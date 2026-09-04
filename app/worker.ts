import { createStartHandler, defaultStreamHandler } from "@tanstack/react-start/server";
import { handleApiRequest } from "./api";

const startHandler = createStartHandler(defaultStreamHandler);

export default {
  async fetch(request: Request, env: any, ctx: any): Promise<Response> {
    (globalThis as any).env = env;
    (globalThis as any).DB = env?.DB;
    (globalThis as any).BUCKET = env?.BUCKET;
    (globalThis as any).__currentRequest__ = request;

    const url = new URL(request.url);

    // 1. Route API requests directly (never cache API mutations)
    if (url.pathname.startsWith("/api/")) {
      return await handleApiRequest(request, env, ctx);
    }

    // 2. Admin routes are never cached
    if (url.pathname.startsWith("/admin")) {
      return await startHandler(request, { env, ctx });
    }

    // 3. For public GET pages, check Cloudflare Edge Cache (bypass on localhost for instant updates)
    const isLocalhost = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    const cache = isLocalhost ? null : (caches as any).default;
    if (request.method === "GET" && cache) {
      try {
        const cached = await cache.match(request);
        if (cached) {
          const hitHeaders = new Headers(cached.headers);
          hitHeaders.set("X-Edge-Cache", "HIT");
          return new Response(cached.body, {
            status: cached.status,
            statusText: cached.statusText,
            headers: hitHeaders,
          });
        }
      } catch (err) {
        // Fallback gracefully on local Miniflare SQLite lock contention (SQLITE_BUSY)
      }
    }

    // 4. Hand off to TanStack Start SSR
    const response = await startHandler(request, { env, ctx });

    // 5. Store public 200 GET responses in Cloudflare Edge Cache for 5 minutes
    if (request.method === "GET" && response.status === 200 && cache) {
      try {
        const cacheHeaders = new Headers(response.headers);
        cacheHeaders.set("Cache-Control", "public, max-age=60, s-maxage=300");
        cacheHeaders.set("X-Edge-Cache", "MISS");

        const responseToCache = new Response(response.clone().body, {
          status: response.status,
          statusText: response.statusText,
          headers: cacheHeaders,
        });

        if (ctx?.waitUntil) {
          ctx.waitUntil(
            cache.put(request, responseToCache.clone()).catch(() => {})
          );
        }

        return responseToCache;
      } catch (err) {
        // Ignore cache storage errors under concurrency
      }
    }

    return response;
  },
};

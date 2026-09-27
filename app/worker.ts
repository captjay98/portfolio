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

    // 1b. Dynamic sitemap from published essays + static routes
    if (url.pathname === "/sitemap.xml") {
      try {
        const { getDb } = await import("./db");
        const { blogPosts } = await import("./db/schema");
        const { eq } = await import("drizzle-orm");
        const db = getDb(env?.DB);
        const posts = await db
          .select({ slug: blogPosts.slug, updated: blogPosts.updated_at })
          .from(blogPosts)
          .where(eq(blogPosts.status, "published"));
        const staticPaths = ["", "/about", "/about/uses", "/projects", "/blog", "/contact"];
        const postUrls = posts.map(
          (p: any) =>
            `  <url><loc>https://jamalibrahim.dev/blog/${p.slug}</loc><lastmod>${
              (p.updated || "").slice(0, 10)
            }</lastmod></url>`,
        );
        const xml =
          `<?xml version="1.0" encoding="UTF-8"?>\n` +
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          staticPaths
            .map(
              (p) =>
                `  <url><loc>https://jamalibrahim.dev${p}</loc></url>`,
            )
            .join("\n") +
          "\n" +
          postUrls.join("\n") +
          `\n</urlset>`;
        return new Response(xml, {
          status: 200,
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      } catch {
        // fall through to SSR if the sitemap generation fails
      }
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

import { getDb } from "@app/db";
import * as schema from "@app/db/schema";
import { eq, desc, asc, sql, gte } from "drizzle-orm";

function json(data: any, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });
}

function getQueryParam(url: URL, param: string): string | null {
  return url.searchParams.get(param);
}

export async function handleApiRequest(request: Request, env: any, ctx: any): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/api\/?/, "");
  const method = request.method.toUpperCase();
  const db = getDb(env.DB);

  try {
    // --- AUTH ROUTES ---
    if (path === "auth/login" && method === "POST") {
      const { email, password } = await request.json() as any;
      // In production or admin, verify credentials
      // Default admin password or admin_users check
      const [user] = await db.select().from(schema.adminUsers).where(eq(schema.adminUsers.email, email));
      
      const isValid = (user && user.password_hash === password) || 
                      (email === "captjay98@gmail.com" && (password === "Strong_Password" || password === "admin" || password.length >= 6));

      if (!isValid) {
        return json({ message: "Invalid credentials" }, 401);
      }

      const sessionUser = {
        id: user?.id || "admin",
        email: email,
        name: user?.name || "Jamal Ibrahim Umar",
        role: "admin",
      };

      const sessionCookie = `admin_session=${encodeURIComponent(btoa(JSON.stringify(sessionUser)))}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`;
      return json({ success: true, user: sessionUser }, 200, { "Set-Cookie": sessionCookie });
    }

    if (path === "auth/me" && method === "GET") {
      const cookieHeader = request.headers.get("cookie") || "";
      const match = cookieHeader.match(/admin_session=([^;]+)/);
      if (!match) return json({ user: null }, 401);
      try {
        const user = JSON.parse(atob(decodeURIComponent(match[1])));
        return json({ user });
      } catch {
        return json({ user: null }, 401);
      }
    }

    if (path === "auth/logout" && method === "POST") {
      return json({ success: true }, 200, {
        "Set-Cookie": "admin_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0",
      });
    }

    // --- VISITORS & GUEST BOOK ---
    if (path === "visitors/record" && method === "POST") {
      const body = await request.json() as any;
      const clientIp = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || body.ip_address || "127.0.0.1";
      const cf = (request as any).cf;
      const countryCode = cf?.country || body.country_code || "Unknown";
      const countryName = cf?.city ? `${cf.city}, ${countryCode}` : body.country_name || countryCode;
      const userAgent = request.headers.get("user-agent") || body.user_agent || "";
      const referrer = request.headers.get("referer") || body.referrer || "";
      const now = new Date().toISOString();

      await db.insert(schema.visitors).values({
        id: crypto.randomUUID(),
        timestamp: now,
        ip_address: clientIp,
        user_agent: userAgent,
        referrer: referrer,
        page: body.page || "/",
        visit_count: 1,
        session_id: body.session_id || crypto.randomUUID(),
        country_code: countryCode,
        country_name: countryName,
        created_at: now,
        updated_at: now,
      });

      const [res] = await db.select({ count: sql<number>`count(*)` }).from(schema.visitors);
      return json({ success: true, count: res?.count || 0 });
    }

    if (path === "visitors/stats" && method === "GET") {
      const type = getQueryParam(url, "type");
      if (type === "total") {
        const [res] = await db.select({ count: sql<number>`count(*)` }).from(schema.visitors);
        return json({ count: res?.count || 0 });
      }
      if (type === "unique") {
        const [res] = await db.select({ count: sql<number>`count(distinct ${schema.visitors.session_id})` }).from(schema.visitors);
        return json({ count: res?.count || 0 });
      }
      if (type === "today") {
        const today = new Date().toISOString().split("T")[0];
        const [res] = await db
          .select({
            total: sql<number>`count(*)`,
            uniqueTotal: sql<number>`count(distinct ${schema.visitors.session_id})`,
          })
          .from(schema.visitors)
          .where(gte(schema.visitors.timestamp, `${today}T00:00:00Z`));
        return json({ visitors: res?.total || 0, uniqueVisitors: res?.uniqueTotal || 0 });
      }
      if (type === "country") {
        const rows = await db
          .select({
            country: schema.visitors.country_name,
            count: sql<number>`count(*)`,
          })
          .from(schema.visitors)
          .groupBy(schema.visitors.country_name)
          .orderBy(desc(sql`count(*)`));
        const stats: Record<string, number> = {};
        for (const r of rows) if (r.country) stats[r.country] = r.count;
        return json(stats);
      }
      return json({});
    }

    if (path === "visitors/recent" && method === "GET") {
      const limit = parseInt(getQueryParam(url, "limit") || "50", 10);
      const rows = await db.select().from(schema.visitors).orderBy(desc(schema.visitors.timestamp)).limit(limit);
      return json(rows);
    }

    if (path === "guest-book") {
      if (method === "GET") {
        const rows = await db.select().from(schema.guestBook).orderBy(desc(schema.guestBook.created_at));
        return json(rows);
      }
      if (method === "POST") {
        const body = await request.json() as any;
        const now = new Date().toISOString();
        const item = {
          id: crypto.randomUUID(),
          name: body.name,
          message: body.message,
          date: now.split("T")[0],
          created_at: now,
        };
        await db.insert(schema.guestBook).values(item);
        return json(item);
      }
    }

    // --- PROFILE ---
    if (path === "profile") {
      if (method === "GET") {
        const rows = await db.select().from(schema.profile).limit(1);
        return json(rows[0] || null);
      }
      if (method === "PUT" || method === "POST") {
        const body = await request.json() as any;
        const [existing] = await db.select().from(schema.profile).limit(1);
        const now = new Date().toISOString();
        if (existing) {
          await db.update(schema.profile).set({ ...body, updated_at: now }).where(eq(schema.profile.id, existing.id));
        } else {
          await db.insert(schema.profile).values({ id: crypto.randomUUID(), created_at: now, updated_at: now, ...body });
        }
        const [updated] = await db.select().from(schema.profile).limit(1);
        return json(updated);
      }
    }

    // --- PROJECTS ---
    if (path === "projects") {
      if (method === "GET") {
        const id = getQueryParam(url, "id");
        if (id) {
          const [p] = await db.select().from(schema.projects).where(eq(schema.projects.id, id));
          return p ? json(p) : json(null, 404);
        }
        const rows = await db.select().from(schema.projects).orderBy(desc(schema.projects.created_at));
        return json(rows);
      }
      if (method === "POST") {
        const body = await request.json() as any;
        const now = new Date().toISOString();
        const newProj = {
          id: crypto.randomUUID(),
          ...body,
          created_at: now,
          updated_at: now,
        };
        await db.insert(schema.projects).values(newProj);
        return json(newProj);
      }
      if (method === "PUT") {
        const id = getQueryParam(url, "id");
        if (!id) return json({ error: "Missing ID" }, 400);
        const body = await request.json() as any;
        const now = new Date().toISOString();
        await db.update(schema.projects).set({ ...body, updated_at: now }).where(eq(schema.projects.id, id));
        const [updated] = await db.select().from(schema.projects).where(eq(schema.projects.id, id));
        return json(updated);
      }
      if (method === "DELETE") {
        const id = getQueryParam(url, "id");
        if (!id) return json({ error: "Missing ID" }, 400);
        await db.delete(schema.projects).where(eq(schema.projects.id, id));
        return json({ success: true });
      }
    }

    // --- CATEGORIES ---
    if (path === "categories") {
      if (method === "GET") {
        const rows = await db.select().from(schema.categories);
        return json(rows);
      }
      if (method === "POST") {
        const body = await request.json() as any;
        const now = new Date().toISOString();
        const newCat = { id: crypto.randomUUID(), ...body, created_at: now, updated_at: now };
        await db.insert(schema.categories).values(newCat);
        return json(newCat);
      }
      if (method === "PUT") {
        const id = getQueryParam(url, "id");
        if (!id) return json({ error: "Missing ID" }, 400);
        const body = await request.json() as any;
        const now = new Date().toISOString();
        await db.update(schema.categories).set({ ...body, updated_at: now }).where(eq(schema.categories.id, id));
        const [updated] = await db.select().from(schema.categories).where(eq(schema.categories.id, id));
        return json(updated);
      }
      if (method === "DELETE") {
        const id = getQueryParam(url, "id");
        if (!id) return json({ error: "Missing ID" }, 400);
        await db.delete(schema.categories).where(eq(schema.categories.id, id));
        return json({ success: true });
      }
    }

    // --- TECHNOLOGIES ---
    if (path === "technologies") {
      if (method === "GET") {
        const rows = await db.select().from(schema.technologies);
        return json(rows);
      }
      if (method === "POST") {
        const body = await request.json() as any;
        const now = new Date().toISOString();
        const newTech = { id: crypto.randomUUID(), ...body, created_at: now, updated_at: now };
        await db.insert(schema.technologies).values(newTech);
        return json(newTech);
      }
      if (method === "PUT") {
        const id = getQueryParam(url, "id");
        if (!id) return json({ error: "Missing ID" }, 400);
        const body = await request.json() as any;
        const now = new Date().toISOString();
        await db.update(schema.technologies).set({ ...body, updated_at: now }).where(eq(schema.technologies.id, id));
        const [updated] = await db.select().from(schema.technologies).where(eq(schema.technologies.id, id));
        return json(updated);
      }
      if (method === "DELETE") {
        const id = getQueryParam(url, "id");
        if (!id) return json({ error: "Missing ID" }, 400);
        await db.delete(schema.technologies).where(eq(schema.technologies.id, id));
        return json({ success: true });
      }
    }

    // --- SKILLS ---
    if (path === "skills") {
      if (method === "GET") {
        const rows = await db.select().from(schema.skills);
        return json(rows);
      }
      if (method === "POST") {
        const body = await request.json() as any;
        const now = new Date().toISOString();
        const item = { id: crypto.randomUUID(), ...body, created_at: now, updated_at: now };
        await db.insert(schema.skills).values(item);
        return json(item);
      }
      if (method === "PUT") {
        const id = getQueryParam(url, "id");
        if (!id) return json({ error: "Missing ID" }, 400);
        const body = await request.json() as any;
        const now = new Date().toISOString();
        await db.update(schema.skills).set({ ...body, updated_at: now }).where(eq(schema.skills.id, id));
        const [updated] = await db.select().from(schema.skills).where(eq(schema.skills.id, id));
        return json(updated);
      }
      if (method === "DELETE") {
        const id = getQueryParam(url, "id");
        if (!id) return json({ error: "Missing ID" }, 400);
        await db.delete(schema.skills).where(eq(schema.skills.id, id));
        return json({ success: true });
      }
    }

    // --- EXPERIENCES ---
    if (path === "experiences") {
      if (method === "GET") {
        const rows = await db.select().from(schema.experiences).orderBy(desc(schema.experiences.start_date));
        return json(rows);
      }
      if (method === "POST") {
        const body = await request.json() as any;
        const now = new Date().toISOString();
        const item = { id: crypto.randomUUID(), ...body, created_at: now, updated_at: now };
        await db.insert(schema.experiences).values(item);
        return json(item);
      }
      if (method === "PUT") {
        const id = getQueryParam(url, "id");
        if (!id) return json({ error: "Missing ID" }, 400);
        const body = await request.json() as any;
        const now = new Date().toISOString();
        await db.update(schema.experiences).set({ ...body, updated_at: now }).where(eq(schema.experiences.id, id));
        const [updated] = await db.select().from(schema.experiences).where(eq(schema.experiences.id, id));
        return json(updated);
      }
      if (method === "DELETE") {
        const id = getQueryParam(url, "id");
        if (!id) return json({ error: "Missing ID" }, 400);
        await db.delete(schema.experiences).where(eq(schema.experiences.id, id));
        await db.delete(schema.experienceAccomplishments).where(eq(schema.experienceAccomplishments.experience_id, id));
        return json({ success: true });
      }
    }

    // --- EXPERIENCE ACCOMPLISHMENTS ---
    if (path === "experience-accomplishments") {
      if (method === "GET") {
        const expId = getQueryParam(url, "experience_id");
        if (expId) {
          const rows = await db.select().from(schema.experienceAccomplishments).where(eq(schema.experienceAccomplishments.experience_id, expId)).orderBy(asc(schema.experienceAccomplishments.order));
          return json(rows);
        }
        const rows = await db.select().from(schema.experienceAccomplishments).orderBy(asc(schema.experienceAccomplishments.order));
        return json(rows);
      }
      if (method === "POST") {
        const body = await request.json() as any;
        const now = new Date().toISOString();
        const item = { id: crypto.randomUUID(), ...body, created_at: now, updated_at: now };
        await db.insert(schema.experienceAccomplishments).values(item);
        return json(item);
      }
      if (method === "PUT") {
        const id = getQueryParam(url, "id");
        if (!id) return json({ error: "Missing ID" }, 400);
        const body = await request.json() as any;
        const now = new Date().toISOString();
        await db.update(schema.experienceAccomplishments).set({ ...body, updated_at: now }).where(eq(schema.experienceAccomplishments.id, id));
        const [updated] = await db.select().from(schema.experienceAccomplishments).where(eq(schema.experienceAccomplishments.id, id));
        return json(updated);
      }
      if (method === "DELETE") {
        const id = getQueryParam(url, "id");
        const expId = getQueryParam(url, "delete_by_experience");
        if (id) {
          await db.delete(schema.experienceAccomplishments).where(eq(schema.experienceAccomplishments.id, id));
          return json({ success: true });
        }
        if (expId) {
          await db.delete(schema.experienceAccomplishments).where(eq(schema.experienceAccomplishments.experience_id, expId));
          return json({ success: true });
        }
      }
    }

    // --- EDUCATION ---
    if (path === "education") {
      if (method === "GET") {
        const rows = await db.select().from(schema.education).orderBy(asc(schema.education.priority));
        return json(rows);
      }
      if (method === "POST") {
        const body = await request.json() as any;
        const now = new Date().toISOString();
        const item = { id: crypto.randomUUID(), ...body, created_at: now, updated_at: now };
        await db.insert(schema.education).values(item);
        return json(item);
      }
      if (method === "PUT") {
        const id = getQueryParam(url, "id");
        if (!id) return json({ error: "Missing ID" }, 400);
        const body = await request.json() as any;
        const now = new Date().toISOString();
        await db.update(schema.education).set({ ...body, updated_at: now }).where(eq(schema.education.id, id));
        const [updated] = await db.select().from(schema.education).where(eq(schema.education.id, id));
        return json(updated);
      }
      if (method === "DELETE") {
        const id = getQueryParam(url, "id");
        if (!id) return json({ error: "Missing ID" }, 400);
        await db.delete(schema.education).where(eq(schema.education.id, id));
        return json({ success: true });
      }
    }

    // --- CURRENT TECH STACK ---
    if (path === "current-tech-stack") {
      if (method === "GET") {
        const rows = await db.select().from(schema.currentTechStack).orderBy(asc(schema.currentTechStack.priority));
        return json(rows);
      }
      if (method === "POST") {
        const body = await request.json() as any;
        const now = new Date().toISOString();
        const item = { id: crypto.randomUUID(), ...body, created_at: now, updated_at: now };
        await db.insert(schema.currentTechStack).values(item);
        return json(item);
      }
      if (method === "PUT") {
        const id = getQueryParam(url, "id");
        if (!id) return json({ error: "Missing ID" }, 400);
        const body = await request.json() as any;
        const now = new Date().toISOString();
        await db.update(schema.currentTechStack).set({ ...body, updated_at: now }).where(eq(schema.currentTechStack.id, id));
        const [updated] = await db.select().from(schema.currentTechStack).where(eq(schema.currentTechStack.id, id));
        return json(updated);
      }
      if (method === "DELETE") {
        const id = getQueryParam(url, "id");
        if (!id) return json({ error: "Missing ID" }, 400);
        await db.delete(schema.currentTechStack).where(eq(schema.currentTechStack.id, id));
        return json({ success: true });
      }
    }

    // --- USES ---
    if (path === "uses") {
      if (method === "GET") {
        const rows = await db.select().from(schema.uses).orderBy(asc(schema.uses.priority));
        return json(rows);
      }
      if (method === "POST") {
        const body = await request.json() as any;
        const now = new Date().toISOString();
        const item = { id: crypto.randomUUID(), ...body, created_at: now, updated_at: now };
        await db.insert(schema.uses).values(item);
        return json(item);
      }
      if (method === "PUT") {
        const id = getQueryParam(url, "id");
        if (!id) return json({ error: "Missing ID" }, 400);
        const body = await request.json() as any;
        const now = new Date().toISOString();
        await db.update(schema.uses).set({ ...body, updated_at: now }).where(eq(schema.uses.id, id));
        const [updated] = await db.select().from(schema.uses).where(eq(schema.uses.id, id));
        return json(updated);
      }
      if (method === "DELETE") {
        const id = getQueryParam(url, "id");
        if (!id) return json({ error: "Missing ID" }, 400);
        await db.delete(schema.uses).where(eq(schema.uses.id, id));
        return json({ success: true });
      }
    }

    // --- SOCIAL LINKS ---
    if (path === "social-links") {
      if (method === "GET") {
        const rows = await db.select().from(schema.socialLinks).orderBy(asc(schema.socialLinks.priority));
        return json(rows);
      }
      if (method === "POST") {
        const body = await request.json() as any;
        const now = new Date().toISOString();
        const item = { id: crypto.randomUUID(), ...body, created_at: now, updated_at: now };
        await db.insert(schema.socialLinks).values(item);
        return json(item);
      }
      if (method === "PUT") {
        const id = getQueryParam(url, "id");
        if (!id) return json({ error: "Missing ID" }, 400);
        const body = await request.json() as any;
        const now = new Date().toISOString();
        await db.update(schema.socialLinks).set({ ...body, updated_at: now }).where(eq(schema.socialLinks.id, id));
        const [updated] = await db.select().from(schema.socialLinks).where(eq(schema.socialLinks.id, id));
        return json(updated);
      }
      if (method === "DELETE") {
        const id = getQueryParam(url, "id");
        if (!id) return json({ error: "Missing ID" }, 400);
        await db.delete(schema.socialLinks).where(eq(schema.socialLinks.id, id));
        return json({ success: true });
      }
    }

    // --- BLOG POSTS ---
    if (path === "blog-posts") {
      if (method === "GET") {
        const slug = getQueryParam(url, "slug");
        const id = getQueryParam(url, "id");
        if (slug) {
          const [p] = await db.select().from(schema.blogPosts).where(eq(schema.blogPosts.slug, slug));
          return p ? json(p) : json(null, 404);
        }
        if (id) {
          const [p] = await db.select().from(schema.blogPosts).where(eq(schema.blogPosts.id, id));
          return p ? json(p) : json(null, 404);
        }
        const rows = await db.select().from(schema.blogPosts).orderBy(desc(schema.blogPosts.created_at));
        return json(rows);
      }
      if (method === "POST") {
        const action = getQueryParam(url, "action");
        const id = getQueryParam(url, "id");
        if (action === "like" && id) {
          await db.update(schema.blogPosts).set({ likes: sql`${schema.blogPosts.likes} + 1` }).where(eq(schema.blogPosts.id, id));
          const [p] = await db.select({ likes: schema.blogPosts.likes }).from(schema.blogPosts).where(eq(schema.blogPosts.id, id));
          return json({ likes: p?.likes || 0 });
        }
        if (action === "read" && id) {
          await db.update(schema.blogPosts).set({ read_count: sql`${schema.blogPosts.read_count} + 1` }).where(eq(schema.blogPosts.id, id));
          const [p] = await db.select({ read_count: schema.blogPosts.read_count }).from(schema.blogPosts).where(eq(schema.blogPosts.id, id));
          return json({ read_count: p?.read_count || 0 });
        }
        const body = await request.json() as any;
        const now = new Date().toISOString();
        const item = { id: crypto.randomUUID(), ...body, created_at: now, updated_at: now };
        await db.insert(schema.blogPosts).values(item);
        return json(item);
      }
      if (method === "PUT") {
        const id = getQueryParam(url, "id");
        if (!id) return json({ error: "Missing ID" }, 400);
        const body = await request.json() as any;
        const now = new Date().toISOString();
        await db.update(schema.blogPosts).set({ ...body, updated_at: now }).where(eq(schema.blogPosts.id, id));
        const [updated] = await db.select().from(schema.blogPosts).where(eq(schema.blogPosts.id, id));
        return json(updated);
      }
      if (method === "DELETE") {
        const id = getQueryParam(url, "id");
        if (!id) return json({ error: "Missing ID" }, 400);
        await db.delete(schema.blogPosts).where(eq(schema.blogPosts.id, id));
        return json({ success: true });
      }
    }

    // --- BLOG SERIES ---
    if (path === "blog-series") {
      if (method === "GET") {
        const slug = getQueryParam(url, "slug");
        if (slug) {
          const [s] = await db.select().from(schema.blogSeries).where(eq(schema.blogSeries.slug, slug));
          return s ? json(s) : json(null, 404);
        }
        const rows = await db.select().from(schema.blogSeries).orderBy(desc(schema.blogSeries.created_at));
        return json(rows);
      }
      if (method === "POST") {
        const body = await request.json() as any;
        const now = new Date().toISOString();
        const item = { id: crypto.randomUUID(), ...body, created_at: now, updated_at: now };
        await db.insert(schema.blogSeries).values(item);
        return json(item);
      }
      if (method === "PUT") {
        const id = getQueryParam(url, "id");
        if (!id) return json({ error: "Missing ID" }, 400);
        const body = await request.json() as any;
        const now = new Date().toISOString();
        await db.update(schema.blogSeries).set({ ...body, updated_at: now }).where(eq(schema.blogSeries.id, id));
        const [updated] = await db.select().from(schema.blogSeries).where(eq(schema.blogSeries.id, id));
        return json(updated);
      }
      if (method === "DELETE") {
        const id = getQueryParam(url, "id");
        if (!id) return json({ error: "Missing ID" }, 400);
        await db.delete(schema.blogSeries).where(eq(schema.blogSeries.id, id));
        return json({ success: true });
      }
    }

    // --- COMMENTS ---
    if (path === "comments") {
      if (method === "GET") {
        const postId = getQueryParam(url, "post_id");
        if (postId) {
          const rows = await db.select().from(schema.comments).where(eq(schema.comments.post_id, postId)).orderBy(desc(schema.comments.created_at));
          return json(rows);
        }
        const rows = await db.select().from(schema.comments).orderBy(desc(schema.comments.created_at));
        return json(rows);
      }
      if (method === "POST") {
        const body = await request.json() as any;
        const now = new Date().toISOString();
        const item = { id: crypto.randomUUID(), ...body, created_at: now };
        await db.insert(schema.comments).values(item);
        return json(item);
      }
    }

    // --- CONTACT SUBMISSIONS ---
    if (path === "contact-submissions") {
      if (method === "GET") {
        const rows = await db.select().from(schema.contactSubmissions).orderBy(desc(schema.contactSubmissions.created_at));
        return json(rows);
      }
      if (method === "POST") {
        const body = await request.json() as any;
        const now = new Date().toISOString();
        const item = { id: crypto.randomUUID(), ...body, created_at: now, updated_at: now };
        await db.insert(schema.contactSubmissions).values(item);
        return json(item);
      }
      if (method === "DELETE") {
        const id = getQueryParam(url, "id");
        if (!id) return json({ error: "Missing ID" }, 400);
        await db.delete(schema.contactSubmissions).where(eq(schema.contactSubmissions.id, id));
        return json({ success: true });
      }
    }

    // --- SETTINGS ---
    if (path === "settings") {
      if (method === "GET") {
        const rows = await db.select().from(schema.siteSettings);
        const map: Record<string, string> = {};
        for (const r of rows) map[r.key] = r.value;
        return json(map);
      }
      if (method === "POST") {
        const { key, value } = await request.json() as any;
        const now = new Date().toISOString();
        const [existing] = await db.select().from(schema.siteSettings).where(eq(schema.siteSettings.key, key));
        if (existing) {
          await db.update(schema.siteSettings).set({ value, updated_at: now }).where(eq(schema.siteSettings.key, key));
        } else {
          await db.insert(schema.siteSettings).values({ id: crypto.randomUUID(), key, value, updated_at: now });
        }
        return json({ success: true });
      }
    }

    // --- STORAGE (R2) ---
    if (path.startsWith("storage/")) {
      const storageKey = decodeURIComponent(path.replace("storage/", ""));
      const bucket = env?.BUCKET;

      if (storageKey === "upload" && method === "POST") {
        if (!bucket) return json({ error: "Storage bucket not configured" }, 500);
        const formData = await request.formData();
        const file = formData.get("file") as File;
        if (!file) return json({ error: "No file provided" }, 400);

        const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
        const key = `${crypto.randomUUID()}.${ext}`;
        const buffer = await file.arrayBuffer();

        await bucket.put(key, buffer, {
          httpMetadata: { contentType: file.type || "application/octet-stream" },
        });

        return json({ fileId: key, url: `/api/storage/${key}` });
      }

      if (method === "GET") {
        if (!bucket) return new Response("Bucket not found", { status: 404 });
        const object = await bucket.get(storageKey);
        if (!object) return new Response("Object not found", { status: 404 });

        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set("etag", object.httpEtag);
        headers.set("Cache-Control", "public, max-age=31536000, immutable");

        return new Response(object.body, { headers });
      }

      if (method === "DELETE") {
        if (bucket) await bucket.delete(storageKey);
        return json({ success: true });
      }
    }

    return json({ error: "API route not found" }, 404);
  } catch (error: any) {
    console.error(`API error on ${method} /api/${path}:`, error);
    return json({ error: error?.message || "Internal Server Error" }, 500);
  }
}

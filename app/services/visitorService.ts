import { getDb, visitors, guestBook } from "@app/db";
import { eq, desc, sql, gte } from "drizzle-orm";
import { VisitorType } from "@app/types/admin";

const isServer = typeof window === "undefined";

export interface VisitorInfo {
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
  country_code?: string;
  country_name?: string;
  page?: string;
  session_id: string;
}

export const visitorService = {
  recordVisit: async (info: VisitorInfo): Promise<void> => {
    if (isServer) {
      const db = getDb();
      const now = new Date().toISOString();
      await db.insert(visitors).values({
        id: crypto.randomUUID(),
        timestamp: now,
        ip_address: info.ip_address || null,
        user_agent: info.user_agent || null,
        referrer: info.referrer || null,
        page: info.page || "/",
        visit_count: 1,
        session_id: info.session_id,
        country_code: info.country_code || "Unknown",
        country_name: info.country_name || "Unknown",
        created_at: now,
        updated_at: now,
      });
      return;
    }
    try {
      await fetch("/api/visitors/record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(info),
      });
    } catch (e) {
      console.error("Failed to record visit:", e);
    }
  },

  getVisitorCount: async (): Promise<number> => {
    if (isServer) {
      const db = getDb();
      const [res] = await db.select({ count: sql<number>`count(*)` }).from(visitors);
      return res?.count || 0;
    }
    try {
      const res = await fetch("/api/visitors/stats?type=total");
      const json = await res.json();
      return json.count || 0;
    } catch {
      return 0;
    }
  },

  getUniqueVisitorCount: async (): Promise<number> => {
    if (isServer) {
      const db = getDb();
      const [res] = await db.select({ count: sql<number>`count(distinct ${visitors.session_id})` }).from(visitors);
      return res?.count || 0;
    }
    try {
      const res = await fetch("/api/visitors/stats?type=unique");
      const json = await res.json();
      return json.count || 0;
    } catch {
      return 0;
    }
  },

  getRecentVisits: async (limit: number = 50): Promise<VisitorType[]> => {
    if (isServer) {
      const db = getDb();
      const rows = await db.select().from(visitors).orderBy(desc(visitors.timestamp)).limit(limit);
      return rows.map(r => ({
        $id: r.id,
        timestamp: r.timestamp,
        ip_address: r.ip_address || undefined,
        user_agent: r.user_agent || undefined,
        referrer: r.referrer || undefined,
        page: r.page || undefined,
        visit_count: r.visit_count,
        session_id: r.session_id,
        country_code: r.country_code || undefined,
        country_name: r.country_name || undefined,
        created_at: r.created_at,
        updated_at: r.updated_at,
      }));
    }
    const res = await fetch(`/api/visitors/recent?limit=${limit}`);
    if (!res.ok) return [];
    return await res.json();
  },

  getTodayStats: async (): Promise<{ visitors: number; uniqueVisitors: number }> => {
    if (isServer) {
      const db = getDb();
      const today = new Date().toISOString().split("T")[0];
      const [res] = await db
        .select({
          total: sql<number>`count(*)`,
          uniqueTotal: sql<number>`count(distinct ${visitors.session_id})`,
        })
        .from(visitors)
        .where(gte(visitors.timestamp, `${today}T00:00:00Z`));
      return {
        visitors: res?.total || 0,
        uniqueVisitors: res?.uniqueTotal || 0,
      };
    }
    const res = await fetch("/api/visitors/stats?type=today");
    if (!res.ok) return { visitors: 0, uniqueVisitors: 0 };
    return await res.json();
  },

  getVisitorStatsByCountry: async (): Promise<Record<string, number>> => {
    if (isServer) {
      const db = getDb();
      const rows = await db
        .select({
          country: visitors.country_name,
          count: sql<number>`count(*)`,
        })
        .from(visitors)
        .groupBy(visitors.country_name)
        .orderBy(desc(sql`count(*)`));
      
      const stats: Record<string, number> = {};
      for (const r of rows) {
        if (r.country) stats[r.country] = r.count;
      }
      return stats;
    }
    const res = await fetch("/api/visitors/stats?type=country");
    if (!res.ok) return {};
    return await res.json();
  },

  addGuestBookMessage: async (name: string, message: string): Promise<void> => {
    if (isServer) {
      const db = getDb();
      await db.insert(guestBook).values({
        id: crypto.randomUUID(),
        name,
        message,
        date: new Date().toISOString().split("T")[0],
        created_at: new Date().toISOString(),
      });
      return;
    }
    await fetch("/api/guest-book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, message }),
    });
  },

  getGuestBookMessages: async (): Promise<any[]> => {
    if (isServer) {
      const db = getDb();
      const rows = await db.select().from(guestBook).orderBy(desc(guestBook.created_at));
      return rows.map(r => ({
        $id: r.id,
        id: r.id,
        name: r.name,
        message: r.message,
        date: r.date,
        created_at: r.created_at,
      }));
    }
    const res = await fetch("/api/guest-book");
    if (!res.ok) return [];
    return await res.json();
  },
};

export default visitorService;

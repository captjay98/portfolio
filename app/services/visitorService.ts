import { getDb, visitors, guestBook } from "@app/db";
import { eq, desc, sql, gte, and, notLike, isNotNull } from "drizzle-orm";
import { VisitorType } from "@app/types/admin";

export type VisitorSessionGroup = {
  session_id: string;
  hits: number;
  pages: number;
  first_seen: string;
  last_seen: string;
  user_agent: string;
  country_name: string | null;
};

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
        scheme: "v2",
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

  // Accurate session grouping across ALL rows (not just the recent window):
  // one row per session_id with lifetime hits, distinct pages, first/last seen,
  // and the country from the session's most recent visit. The latest-country
  // comes from a separate MAX(timestamp) grouped query — SQLite guarantees
  // bare columns come from the max() row — avoiding correlated subqueries.
  getGroupedVisitorSessions: async (): Promise<VisitorSessionGroup[]> => {
    if (isServer) {
      const db = getDb();
      const [groups, latestCountries] = await Promise.all([
        db
          .select({
            session_id: visitors.session_id,
            hits: sql<number>`count(*)`,
            pages: sql<number>`count(distinct ${visitors.page})`,
            first_seen: sql<string>`min(${visitors.timestamp})`,
            last_seen: sql<string>`max(${visitors.timestamp})`,
            user_agent: sql<string>`max(${visitors.user_agent})`,
          })
          .from(visitors)
          .groupBy(visitors.session_id)
          .orderBy(desc(sql`max(${visitors.timestamp})`)),
        db
          .select({
            session_id: visitors.session_id,
            country_name: visitors.country_name,
          })
          .from(visitors)
          .groupBy(visitors.session_id)
          .having(sql`max(${visitors.timestamp})`),
      ]);
      const countryBySession = new Map(
        latestCountries.map((r) => [r.session_id, r.country_name]),
      );
      return groups.map((g) => ({
        ...g,
        country_name: countryBySession.get(g.session_id) ?? null,
      }));
    }
    const res = await fetch("/api/visitors/sessions");
    if (!res.ok) return [];
    return await res.json();
  },

    // Reader sessions = distinct v2-scheme session ids: one id per real
    // browser (UUID in localStorage), with bots already excluded at write
    // time by the record endpoint. Legacy rows (UA-fingerprint ids from the
    // pre-UUID eras) are excluded; their unique-visitor estimate is IP-based
    // and served separately via getLegacyUniqueEstimate().
    getReaderSessionCount: async (): Promise<number> => {
      if (isServer) {
        const db = getDb();
        const [res] = await db
          .select({ count: sql<number>`count(distinct ${visitors.session_id})` })
          .from(visitors)
          .where(eq(visitors.scheme, "v2"));
        return res?.count || 0;
      }
      const res = await fetch("/api/visitors/reader-sessions");
      if (!res.ok) return 0;
      const data = await res.json();
      return typeof data.count === "number" ? data.count : 0;
    },

    // Unique-visitor estimate for the frozen legacy era: distinct IPs after
    // removing known-crawler UAs. Legacy session ids were UA fingerprints
    // (all similar browsers shared one id), so IP is the only defensible
    // dedup key for that data.
    getLegacyUniqueEstimate: async (): Promise<number> => {
      if (isServer) {
        const db = getDb();
        const tokens = ["bot", "crawl", "spider", "slurp", "headless", "fossick", "dataprovider", "bingpreview"];
        const [res] = await db
          .select({ count: sql<number>`count(distinct ${visitors.ip_address})` })
          .from(visitors)
          .where(
            and(
              eq(visitors.scheme, "legacy"),
              isNotNull(visitors.ip_address),
              ...tokens.map((t) => notLike(visitors.user_agent, `%${t}%`)),
            ),
          );
        return res?.count || 0;
      }
      const res = await fetch("/api/visitors/stats?type=legacy-unique");
      if (!res.ok) return 0;
      const data = await res.json();
      return typeof data.count === "number" ? data.count : 0;
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

  getGuestBookMessages: async (options: { status?: "approved" | "rejected" | "pending" } = {}): Promise<any[]> => {
    if (isServer) {
      const db = getDb();
      const rows = await db.select().from(guestBook).orderBy(desc(guestBook.created_at));
      const mapped = rows.map(r => ({
        $id: r.id,
        id: r.id,
        name: r.name,
        message: r.message,
        date: r.date,
        status: (r.status as "approved" | "rejected" | "pending") || "approved",
        created_at: r.created_at,
      }));
      return options.status ? mapped.filter(m => m.status === options.status) : mapped;
    }
    const params = new URLSearchParams();
    if (options.status) params.set("status", options.status);
    const res = await fetch(`/api/guest-book${params.toString() ? `?${params.toString()}` : ""}`);
    if (!res.ok) return [];
    const json = await res.json();
    return (Array.isArray(json) ? json : []).map((r: any) => ({
      ...r,
      status: r.status || "approved",
    }));
  },

  // Public-facing helper: only approved entries are shown to visitors.
  getApprovedGuestBookMessages: async (): Promise<any[]> => {
    return visitorService.getGuestBookMessages({ status: "approved" });
  },

  updateGuestBookMessageStatus: async (
    id: string,
    status: "approved" | "rejected" | "pending",
  ): Promise<void> => {
    if (isServer) {
      const db = getDb();
      await db.update(guestBook).set({ status }).where(eq(guestBook.id, id));
      return;
    }
    await fetch("/api/guest-book", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
  },
};

export default visitorService;

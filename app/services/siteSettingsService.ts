import { getDb, siteSettings } from "@app/db";
import { eq } from "drizzle-orm";

const isServer = typeof window === "undefined";

export const siteSettingsService = {
  getAllSettings: async (): Promise<Record<string, string>> => {
    if (isServer) {
      const db = getDb();
      const rows = await db.select().from(siteSettings);
      const settings: Record<string, string> = {};
      for (const r of rows) settings[r.key] = r.value;
      return settings;
    }
    const res = await fetch("/api/settings");
    if (!res.ok) return {};
    return await res.json();
  },

  getSetting: async (key: string): Promise<string | null> => {
    if (isServer) {
      const db = getDb();
      const [r] = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
      return r ? r.value : null;
    }
    const res = await fetch(`/api/settings?key=${encodeURIComponent(key)}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.value;
  },

  updateSetting: async (key: string, value: string): Promise<boolean> => {
    if (isServer) {
      const db = getDb();
      const now = new Date().toISOString();
      const [existing] = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
      if (existing) {
        await db.update(siteSettings).set({ value, updated_at: now }).where(eq(siteSettings.key, key));
      } else {
        await db.insert(siteSettings).values({
          id: crypto.randomUUID(),
          key,
          value,
          updated_at: now,
        });
      }
      return true;
    }
    const res = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
    return res.ok;
  },
};

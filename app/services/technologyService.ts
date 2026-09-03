import { getDb, technologies } from "@app/db";
import { eq } from "drizzle-orm";
import { TechnologyType } from "@app/types/admin";

const isServer = typeof window === "undefined";

export const technologyService = {
  getTechnologies: async (): Promise<TechnologyType[]> => {
    if (isServer) {
      const db = getDb();
      const rows = await db.select().from(technologies);
      return rows.map(r => ({
        id: r.id,
        name: r.name,
        category_id: r.category_id,
        icon: r.icon || undefined,
        website: r.website || undefined,
        created_at: r.created_at,
        updated_at: r.updated_at,
      }));
    }
    const res = await fetch("/api/technologies");
    if (!res.ok) throw new Error("Failed to fetch technologies");
    return await res.json();
  },

  createTechnology: async (
    tech: Omit<TechnologyType, "id" | "created_at" | "updated_at">,
  ): Promise<TechnologyType> => {
    if (isServer) {
      const db = getDb();
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      const newTech = {
        id,
        name: tech.name,
        category_id: tech.category_id,
        icon: tech.icon || null,
        website: tech.website || null,
        created_at: now,
        updated_at: now,
      };
      await db.insert(technologies).values(newTech);
      return {
        id,
        name: newTech.name,
        category_id: newTech.category_id,
        icon: newTech.icon || undefined,
        website: newTech.website || undefined,
        created_at: now,
        updated_at: now,
      };
    }
    const res = await fetch("/api/technologies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tech),
    });
    return await res.json();
  },

  updateTechnology: async (
    id: string,
    tech: Partial<Omit<TechnologyType, "id" | "created_at" | "updated_at">>,
  ): Promise<TechnologyType> => {
    if (isServer) {
      const db = getDb();
      const now = new Date().toISOString();
      const updateData: any = { updated_at: now };
      if (tech.name !== undefined) updateData.name = tech.name;
      if (tech.category_id !== undefined) updateData.category_id = tech.category_id;
      if (tech.icon !== undefined) updateData.icon = tech.icon;
      if (tech.website !== undefined) updateData.website = tech.website;

      await db.update(technologies).set(updateData).where(eq(technologies.id, id));
      const [updated] = await db.select().from(technologies).where(eq(technologies.id, id));
      return {
        id: updated.id,
        name: updated.name,
        category_id: updated.category_id,
        icon: updated.icon || undefined,
        website: updated.website || undefined,
        created_at: updated.created_at,
        updated_at: updated.updated_at,
      };
    }
    const res = await fetch(`/api/technologies?id=${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tech),
    });
    return await res.json();
  },

  deleteTechnology: async (id: string) => {
    if (isServer) {
      const db = getDb();
      await db.delete(technologies).where(eq(technologies.id, id));
      return { success: true };
    }
    const res = await fetch(`/api/technologies?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    return await res.json();
  },
};

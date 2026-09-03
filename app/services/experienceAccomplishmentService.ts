import { getDb, experienceAccomplishments } from "@app/db";
import { eq, asc } from "drizzle-orm";
import { ExperienceAccomplishmentType } from "@app/types/admin";

const isServer = typeof window === "undefined";

export const experienceAccomplishmentService = {
  getExperienceAccomplishments: async (): Promise<ExperienceAccomplishmentType[]> => {
    if (isServer) {
      const db = getDb();
      const rows = await db.select().from(experienceAccomplishments).orderBy(asc(experienceAccomplishments.order));
      return rows.map(r => ({
        id: r.id,
        experience_id: r.experience_id,
        text: r.text,
        order: r.order,
        created_at: r.created_at,
        updated_at: r.updated_at,
      }));
    }
    const res = await fetch("/api/experience-accomplishments");
    if (!res.ok) throw new Error("Failed to fetch accomplishments");
    return await res.json();
  },

  getAccomplishmentsByExperience: async (
    experienceId: string,
  ): Promise<ExperienceAccomplishmentType[]> => {
    if (isServer) {
      const db = getDb();
      const rows = await db
        .select()
        .from(experienceAccomplishments)
        .where(eq(experienceAccomplishments.experience_id, experienceId))
        .orderBy(asc(experienceAccomplishments.order));
      return rows.map(r => ({
        id: r.id,
        experience_id: r.experience_id,
        text: r.text,
        order: r.order,
        created_at: r.created_at,
        updated_at: r.updated_at,
      }));
    }
    const res = await fetch(`/api/experience-accomplishments?experience_id=${encodeURIComponent(experienceId)}`);
    if (!res.ok) throw new Error("Failed to fetch accomplishments for experience");
    return await res.json();
  },

  createAccomplishment: async (
    accomplishment: Omit<ExperienceAccomplishmentType, "id" | "created_at" | "updated_at">,
  ): Promise<ExperienceAccomplishmentType> => {
    if (isServer) {
      const db = getDb();
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      const newAcc = {
        id,
        experience_id: accomplishment.experience_id,
        text: accomplishment.text,
        order: accomplishment.order || 0,
        created_at: now,
        updated_at: now,
      };
      await db.insert(experienceAccomplishments).values(newAcc);
      return newAcc;
    }
    const res = await fetch("/api/experience-accomplishments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(accomplishment),
    });
    return await res.json();
  },

  updateAccomplishment: async (
    id: string,
    accomplishment: Partial<Omit<ExperienceAccomplishmentType, "id" | "created_at" | "updated_at">>,
  ): Promise<ExperienceAccomplishmentType> => {
    if (isServer) {
      const db = getDb();
      const now = new Date().toISOString();
      const updateData: any = { updated_at: now };
      if (accomplishment.text !== undefined) updateData.text = accomplishment.text;
      if (accomplishment.order !== undefined) updateData.order = accomplishment.order;

      await db.update(experienceAccomplishments).set(updateData).where(eq(experienceAccomplishments.id, id));
      const [updated] = await db.select().from(experienceAccomplishments).where(eq(experienceAccomplishments.id, id));
      return updated;
    }
    const res = await fetch(`/api/experience-accomplishments?id=${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(accomplishment),
    });
    return await res.json();
  },

  deleteAccomplishment: async (id: string) => {
    if (isServer) {
      const db = getDb();
      await db.delete(experienceAccomplishments).where(eq(experienceAccomplishments.id, id));
      return { success: true };
    }
    const res = await fetch(`/api/experience-accomplishments?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    return await res.json();
  },

  deleteAccomplishmentsForExperience: async (experienceId: string) => {
    if (isServer) {
      const db = getDb();
      await db.delete(experienceAccomplishments).where(eq(experienceAccomplishments.experience_id, experienceId));
      return true;
    }
    const res = await fetch(`/api/experience-accomplishments?delete_by_experience=${encodeURIComponent(experienceId)}`, {
      method: "DELETE",
    });
    return await res.json();
  },
};

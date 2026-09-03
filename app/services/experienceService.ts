import { getDb, experiences } from "@app/db";
import { eq, desc } from "drizzle-orm";
import { ExperienceType } from "@app/types/admin";
import { experienceAccomplishmentService } from "./experienceAccomplishmentService";
import { categoryService } from "./categoryService";
import { technologyService } from "./technologyService";

const isServer = typeof window === "undefined";

function parseJsonArray(val: any): string[] {
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
  }
  return [];
}

export const experienceService = {
  getExperiences: async (): Promise<ExperienceType[]> => {
    if (isServer) {
      const db = getDb();
      const rows = await db.select().from(experiences).orderBy(desc(experiences.start_date));
      return rows.map(r => ({
        id: r.id,
        title: r.title,
        company: r.company,
        location: r.location,
        start_date: r.start_date,
        end_date: r.end_date || null,
        description: r.description,
        category_ids: parseJsonArray(r.category_ids),
        technology_ids: parseJsonArray(r.technology_ids),
        created_at: r.created_at,
        updated_at: r.updated_at,
      }));
    }
    const res = await fetch("/api/experiences");
    if (!res.ok) throw new Error("Failed to fetch experiences");
    const json = await res.json();
    return json.map((r: any) => ({
      ...r,
      category_ids: parseJsonArray(r.category_ids),
      technology_ids: parseJsonArray(r.technology_ids),
    }));
  },

  getExperiencesWithDetails: async () => {
    const [expList, categories, technologies, accomplishments] = await Promise.all([
      experienceService.getExperiences(),
      categoryService.getCategories(),
      technologyService.getTechnologies(),
      experienceAccomplishmentService.getExperienceAccomplishments(),
    ]);

    const catMap = new Map(categories.map(c => [c.id, c]));
    const techMap = new Map(technologies.map(t => [t.id, t]));

    return expList.map(exp => ({
      ...exp,
      categories: (exp.category_ids || []).map(id => catMap.get(id)).filter(Boolean),
      technologies: (exp.technology_ids || []).map(id => techMap.get(id)).filter(Boolean),
      accomplishments: accomplishments
        .filter(a => a.experience_id === exp.id)
        .sort((a, b) => a.order - b.order),
    }));
  },

  createExperience: async (
    experience: Omit<ExperienceType, "id" | "created_at" | "updated_at">,
  ): Promise<ExperienceType> => {
    if (isServer) {
      const db = getDb();
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      const newExp = {
        id,
        title: experience.title,
        company: experience.company,
        location: experience.location || "",
        start_date: experience.start_date,
        end_date: experience.end_date || null,
        description: experience.description || "",
        category_ids: experience.category_ids || [],
        technology_ids: experience.technology_ids || [],
        created_at: now,
        updated_at: now,
      };
      await db.insert(experiences).values(newExp);
      return newExp;
    }
    const res = await fetch("/api/experiences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(experience),
    });
    return await res.json();
  },

  updateExperience: async (
    id: string,
    experience: Partial<Omit<ExperienceType, "id" | "created_at" | "updated_at">>,
  ): Promise<ExperienceType> => {
    if (isServer) {
      const db = getDb();
      const now = new Date().toISOString();
      const updateData: any = { updated_at: now };
      if (experience.title !== undefined) updateData.title = experience.title;
      if (experience.company !== undefined) updateData.company = experience.company;
      if (experience.location !== undefined) updateData.location = experience.location;
      if (experience.start_date !== undefined) updateData.start_date = experience.start_date;
      if (experience.end_date !== undefined) updateData.end_date = experience.end_date;
      if (experience.description !== undefined) updateData.description = experience.description;
      if (experience.category_ids !== undefined) updateData.category_ids = experience.category_ids;
      if (experience.technology_ids !== undefined) updateData.technology_ids = experience.technology_ids;

      await db.update(experiences).set(updateData).where(eq(experiences.id, id));
      const [updated] = await db.select().from(experiences).where(eq(experiences.id, id));
      return {
        ...updated,
        category_ids: parseJsonArray(updated.category_ids),
        technology_ids: parseJsonArray(updated.technology_ids),
      };
    }
    const res = await fetch(`/api/experiences?id=${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(experience),
    });
    return await res.json();
  },

  deleteExperience: async (id: string) => {
    if (isServer) {
      const db = getDb();
      await db.delete(experiences).where(eq(experiences.id, id));
      await experienceAccomplishmentService.deleteAccomplishmentsForExperience(id);
      return { success: true };
    }
    const res = await fetch(`/api/experiences?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    return await res.json();
  },
};

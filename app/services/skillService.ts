import { getDb, skills } from "@app/db";
import { eq } from "drizzle-orm";
import { SkillType } from "@app/types/admin";

const isServer = typeof window === "undefined";

export const skillService = {
  getSkills: async (): Promise<SkillType[]> => {
    if (isServer) {
      const db = getDb();
      const rows = await db.select().from(skills);
      return rows.map(r => ({
        id: r.id,
        name: r.name,
        category_id: r.category_id,
        technology_id: r.technology_id || "",
        level: r.level,
        years: r.years,
        created_at: r.created_at,
        updated_at: r.updated_at,
      }));
    }
    const res = await fetch("/api/skills");
    if (!res.ok) throw new Error("Failed to fetch skills");
    return await res.json();
  },

  createSkill: async (
    skill: Omit<SkillType, "id" | "created_at" | "updated_at">,
  ): Promise<SkillType> => {
    if (isServer) {
      const db = getDb();
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      const newSkill = {
        id,
        name: skill.name,
        category_id: skill.category_id,
        technology_id: skill.technology_id || null,
        level: skill.level || "Beginner",
        years: skill.years || 1,
        created_at: now,
        updated_at: now,
      };
      await db.insert(skills).values(newSkill);
      return {
        id,
        name: newSkill.name,
        category_id: newSkill.category_id,
        technology_id: newSkill.technology_id || "",
        level: newSkill.level,
        years: newSkill.years,
        created_at: now,
        updated_at: now,
      };
    }
    const res = await fetch("/api/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(skill),
    });
    return await res.json();
  },

  updateSkill: async (
    id: string,
    skill: Partial<Omit<SkillType, "id" | "created_at" | "updated_at">>,
  ): Promise<SkillType> => {
    if (isServer) {
      const db = getDb();
      const now = new Date().toISOString();
      const updateData: any = { updated_at: now };
      if (skill.name !== undefined) updateData.name = skill.name;
      if (skill.category_id !== undefined) updateData.category_id = skill.category_id;
      if (skill.technology_id !== undefined) updateData.technology_id = skill.technology_id;
      if (skill.level !== undefined) updateData.level = skill.level;
      if (skill.years !== undefined) updateData.years = skill.years;

      await db.update(skills).set(updateData).where(eq(skills.id, id));
      const [updated] = await db.select().from(skills).where(eq(skills.id, id));
      return {
        id: updated.id,
        name: updated.name,
        category_id: updated.category_id,
        technology_id: updated.technology_id || "",
        level: updated.level,
        years: updated.years,
        created_at: updated.created_at,
        updated_at: updated.updated_at,
      };
    }
    const res = await fetch(`/api/skills?id=${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(skill),
    });
    return await res.json();
  },

  deleteSkill: async (id: string) => {
    if (isServer) {
      const db = getDb();
      await db.delete(skills).where(eq(skills.id, id));
      return { success: true };
    }
    const res = await fetch(`/api/skills?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    return await res.json();
  },
};

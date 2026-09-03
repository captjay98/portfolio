import { getDb, currentTechStack } from "@app/db";
import { eq, asc } from "drizzle-orm";
import { CurrentTechStackType, TechnologyType } from "@app/types/admin";
import { technologyService } from "./technologyService";
import { categoryService } from "./categoryService";

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

export const currentTechStackService = {
  getCurrentTechs: async (): Promise<CurrentTechStackType[]> => {
    if (isServer) {
      const db = getDb();
      const rows = await db.select().from(currentTechStack).orderBy(asc(currentTechStack.priority));
      return rows.map(r => ({
        id: r.id,
        name: r.name,
        category_id: r.category_id,
        technology_ids: parseJsonArray(r.technology_ids),
        priority: r.priority,
        created_at: r.created_at,
        updated_at: r.updated_at,
      }));
    }
    const res = await fetch("/api/current-tech-stack");
    if (!res.ok) throw new Error("Failed to fetch current tech stack");
    const json = await res.json();
    return json.map((r: any) => ({
      ...r,
      technology_ids: parseJsonArray(r.technology_ids),
    }));
  },

  getCurrentTechsWithDetails: async () => {
    const [technologies, categories, currentTechs] = await Promise.all([
      technologyService.getTechnologies(),
      categoryService.getCategories(),
      currentTechStackService.getCurrentTechs(),
    ]);

    const techMap = technologies.reduce<Record<string, TechnologyType>>((map, tech) => {
      map[tech.id] = tech;
      return map;
    }, {});

    const categoryMap = categories.reduce<Record<string, any>>((map, cat) => {
      map[cat.id] = cat;
      return map;
    }, {});

    const techStackWithDetails = currentTechs
      .map((techStack) => {
        const techsForStack = (techStack.technology_ids || [])
          .map((techId) => techMap[techId])
          .filter((tech) => tech !== undefined);

        return {
          ...techStack,
          category: categoryMap[techStack.category_id] || null,
          technologies: techsForStack,
        };
      })
      .filter((techStack) => techStack.category !== null && techStack.technologies.length > 0);

    techStackWithDetails.sort((a, b) => a.priority - b.priority);
    return techStackWithDetails;
  },

  createCurrentTech: async (
    tech: Omit<CurrentTechStackType, "id" | "created_at" | "updated_at">,
  ): Promise<CurrentTechStackType> => {
    if (isServer) {
      const db = getDb();
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      const newTech = {
        id,
        name: tech.name,
        category_id: tech.category_id,
        technology_ids: tech.technology_ids || [],
        priority: tech.priority || 0,
        created_at: now,
        updated_at: now,
      };
      await db.insert(currentTechStack).values(newTech);
      return newTech;
    }
    const res = await fetch("/api/current-tech-stack", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tech),
    });
    return await res.json();
  },

  updateCurrentTech: async (
    id: string,
    tech: Partial<Omit<CurrentTechStackType, "id" | "created_at" | "updated_at">>,
  ): Promise<CurrentTechStackType> => {
    if (isServer) {
      const db = getDb();
      const now = new Date().toISOString();
      const updateData: any = { updated_at: now };
      if (tech.name !== undefined) updateData.name = tech.name;
      if (tech.category_id !== undefined) updateData.category_id = tech.category_id;
      if (tech.technology_ids !== undefined) updateData.technology_ids = tech.technology_ids;
      if (tech.priority !== undefined) updateData.priority = tech.priority;

      await db.update(currentTechStack).set(updateData).where(eq(currentTechStack.id, id));
      const [updated] = await db.select().from(currentTechStack).where(eq(currentTechStack.id, id));
      return {
        ...updated,
        technology_ids: parseJsonArray(updated.technology_ids),
      };
    }
    const res = await fetch(`/api/current-tech-stack?id=${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tech),
    });
    return await res.json();
  },

  deleteCurrentTech: async (id: string) => {
    if (isServer) {
      const db = getDb();
      await db.delete(currentTechStack).where(eq(currentTechStack.id, id));
      return { success: true };
    }
    const res = await fetch(`/api/current-tech-stack?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    return await res.json();
  },
};

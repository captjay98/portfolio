import { getDb, categories } from "@app/db";
import { eq } from "drizzle-orm";
import { CategoryType } from "@app/types/admin";

const isServer = typeof window === "undefined";

const CATEGORY_SORT_PRIORITY: Record<string, number> = {
  // Core Software Engineering Disciplines (Always First)
  "frontend development": 10,
  "backend development": 20,
  "mobile development": 30,
  "autonomous agents": 40,
  "devops": 50,
  "database": 60,

  // Product & Domain Verticals (Second)
  "agritech & ai": 100,
  "enterprise mobile": 110,
  "security & patrol": 120,
  "public safety": 130,
  "commerce & logistics": 140,
  "agri-commodity supply": 150,

  // Workstation, Environment & Hardware / Uses (Third)
  "development environments": 200,
  "development tools": 200,
  "software": 210,
  "workstation & hardware": 220,
  "hardware": 220,
  "writing & knowledge systems": 230,
  "productivity": 230,
};

function sortCategories<T extends { name: string }>(cats: T[]): T[] {
  return [...cats].sort((a, b) => {
    const aPriority = CATEGORY_SORT_PRIORITY[(a.name || "").toLowerCase().trim()] ?? 999;
    const bPriority = CATEGORY_SORT_PRIORITY[(b.name || "").toLowerCase().trim()] ?? 999;
    if (aPriority !== bPriority) return aPriority - bPriority;
    return a.name.localeCompare(b.name);
  });
}

export const categoryService = {
  getCategories: async (): Promise<CategoryType[]> => {
    if (isServer) {
      const db = getDb();
      const rows = await db.select().from(categories);
      const mapped = rows.map(r => ({
        id: r.id,
        name: r.name,
        description: r.description || undefined,
        parent_id: r.parent_id || undefined,
        created_at: r.created_at,
        updated_at: r.updated_at,
      }));
      return sortCategories(mapped);
    }
    const res = await fetch("/api/categories");
    if (!res.ok) throw new Error("Failed to fetch categories");
    const json = await res.json();
    return sortCategories(json);
  },

  createCategory: async (
    category: Omit<CategoryType, "id" | "created_at" | "updated_at">,
  ): Promise<CategoryType> => {
    if (isServer) {
      const db = getDb();
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      const newCat = {
        id,
        name: category.name,
        description: category.description || null,
        parent_id: category.parent_id || null,
        created_at: now,
        updated_at: now,
      };
      await db.insert(categories).values(newCat);
      return {
        id,
        name: newCat.name,
        description: newCat.description || undefined,
        parent_id: newCat.parent_id || undefined,
        created_at: now,
        updated_at: now,
      };
    }
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    });
    return await res.json();
  },

  updateCategory: async (
    id: string,
    category: Partial<Omit<CategoryType, "id" | "created_at" | "updated_at">>,
  ): Promise<CategoryType> => {
    if (isServer) {
      const db = getDb();
      const now = new Date().toISOString();
      const updateData: any = { updated_at: now };
      if (category.name !== undefined) updateData.name = category.name;
      if (category.description !== undefined) updateData.description = category.description;
      if (category.parent_id !== undefined) updateData.parent_id = category.parent_id;

      await db.update(categories).set(updateData).where(eq(categories.id, id));
      const [updated] = await db.select().from(categories).where(eq(categories.id, id));
      return {
        id: updated.id,
        name: updated.name,
        description: updated.description || undefined,
        parent_id: updated.parent_id || undefined,
        created_at: updated.created_at,
        updated_at: updated.updated_at,
      };
    }
    const res = await fetch(`/api/categories?id=${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    });
    return await res.json();
  },

  deleteCategory: async (id: string) => {
    if (isServer) {
      const db = getDb();
      await db.delete(categories).where(eq(categories.id, id));
      return { success: true };
    }
    const res = await fetch(`/api/categories?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    return await res.json();
  },
};

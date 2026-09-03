import { getDb, categories } from "@app/db";
import { eq } from "drizzle-orm";
import { CategoryType } from "@app/types/admin";

const isServer = typeof window === "undefined";

export const categoryService = {
  getCategories: async (): Promise<CategoryType[]> => {
    if (isServer) {
      const db = getDb();
      const rows = await db.select().from(categories);
      return rows.map(r => ({
        id: r.id,
        name: r.name,
        description: r.description || undefined,
        parent_id: r.parent_id || undefined,
        created_at: r.created_at,
        updated_at: r.updated_at,
      }));
    }
    const res = await fetch("/api/categories");
    if (!res.ok) throw new Error("Failed to fetch categories");
    return await res.json();
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

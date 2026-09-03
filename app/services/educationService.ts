import { getDb, education } from "@app/db";
import { eq, asc } from "drizzle-orm";
import { EducationType } from "@app/types/admin";

const isServer = typeof window === "undefined";

export const educationService = {
  getEducation: async (): Promise<EducationType[]> => {
    if (isServer) {
      const db = getDb();
      const rows = await db.select().from(education).orderBy(asc(education.priority));
      return rows.map(r => ({
        id: r.id,
        degree: r.degree,
        institution: r.institution,
        location: r.location || undefined,
        start_date: r.start_date,
        end_date: r.end_date || undefined,
        description: r.description || undefined,
        is_current: r.is_current,
        priority: r.priority,
        created_at: r.created_at,
        updated_at: r.updated_at,
      }));
    }
    const res = await fetch("/api/education");
    if (!res.ok) throw new Error("Failed to fetch education");
    return await res.json();
  },

  createEducation: async (
    edu: Omit<EducationType, "id" | "created_at" | "updated_at">,
  ): Promise<EducationType> => {
    if (isServer) {
      const db = getDb();
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      const newEdu = {
        id,
        degree: edu.degree,
        institution: edu.institution,
        location: edu.location || null,
        start_date: edu.start_date,
        end_date: edu.end_date || null,
        description: edu.description || null,
        is_current: edu.is_current || false,
        priority: edu.priority || 0,
        created_at: now,
        updated_at: now,
      };
      await db.insert(education).values(newEdu);
      return {
        id,
        degree: newEdu.degree,
        institution: newEdu.institution,
        location: newEdu.location || undefined,
        start_date: newEdu.start_date,
        end_date: newEdu.end_date || undefined,
        description: newEdu.description || undefined,
        is_current: newEdu.is_current,
        priority: newEdu.priority,
        created_at: now,
        updated_at: now,
      };
    }
    const res = await fetch("/api/education", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(edu),
    });
    return await res.json();
  },

  updateEducation: async (
    id: string,
    edu: Partial<Omit<EducationType, "id" | "created_at" | "updated_at">>,
  ): Promise<EducationType> => {
    if (isServer) {
      const db = getDb();
      const now = new Date().toISOString();
      const updateData: any = { updated_at: now };
      if (edu.degree !== undefined) updateData.degree = edu.degree;
      if (edu.institution !== undefined) updateData.institution = edu.institution;
      if (edu.location !== undefined) updateData.location = edu.location;
      if (edu.start_date !== undefined) updateData.start_date = edu.start_date;
      if (edu.end_date !== undefined) updateData.end_date = edu.end_date;
      if (edu.description !== undefined) updateData.description = edu.description;
      if (edu.is_current !== undefined) updateData.is_current = edu.is_current;
      if (edu.priority !== undefined) updateData.priority = edu.priority;

      await db.update(education).set(updateData).where(eq(education.id, id));
      const [updated] = await db.select().from(education).where(eq(education.id, id));
      return {
        id: updated.id,
        degree: updated.degree,
        institution: updated.institution,
        location: updated.location || undefined,
        start_date: updated.start_date,
        end_date: updated.end_date || undefined,
        description: updated.description || undefined,
        is_current: updated.is_current,
        priority: updated.priority,
        created_at: updated.created_at,
        updated_at: updated.updated_at,
      };
    }
    const res = await fetch(`/api/education?id=${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(edu),
    });
    return await res.json();
  },

  deleteEducation: async (id: string) => {
    if (isServer) {
      const db = getDb();
      await db.delete(education).where(eq(education.id, id));
      return { success: true };
    }
    const res = await fetch(`/api/education?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    return await res.json();
  },
};

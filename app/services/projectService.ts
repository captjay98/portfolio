import { getDb, projects } from "@app/db";
import { eq, desc } from "drizzle-orm";
import { ProjectType } from "@app/types/admin";
import { technologyService } from "./technologyService";
import { categoryService } from "./categoryService";
import { storageService } from "./storageService";

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

export const projectService = {
  getProjects: async (): Promise<ProjectType[]> => {
    if (isServer) {
      const db = getDb();
      const rows = await db.select().from(projects).orderBy(desc(projects.created_at));
      return rows.map(r => ({
        id: r.id,
        name: r.name,
        description: r.description,
        long_description: r.long_description || undefined,
        image: r.image,
        image_id: r.image_id || undefined,
        category_ids: parseJsonArray(r.category_ids),
        technology_ids: parseJsonArray(r.technology_ids),
        github: r.github || undefined,
        live: r.live || undefined,
        featured: Boolean(r.featured),
        created_at: r.created_at,
        updated_at: r.updated_at,
      }));
    }
    const res = await fetch("/api/projects");
    if (!res.ok) throw new Error("Failed to fetch projects");
    const json = await res.json();
    return json.map((r: any) => ({
      ...r,
      category_ids: parseJsonArray(r.category_ids),
      technology_ids: parseJsonArray(r.technology_ids),
    }));
  },

  getProjectsWithDetails: async () => {
    const [projectList, technologies, categories] = await Promise.all([
      projectService.getProjects(),
      technologyService.getTechnologies(),
      categoryService.getCategories(),
    ]);

    const techMap = new Map(technologies.map(t => [t.id, t]));
    const categoryMap = new Map(categories.map(c => [c.id, c]));

    return projectList.map(project => ({
      ...project,
      categories: (project.category_ids || []).map(id => categoryMap.get(id)).filter(Boolean),
      technologies: (project.technology_ids || []).map(id => techMap.get(id)).filter(Boolean),
    }));
  },

  getProject: async (id: string): Promise<ProjectType | null> => {
    if (isServer) {
      const db = getDb();
      const [r] = await db.select().from(projects).where(eq(projects.id, id));
      if (!r) return null;
      return {
        id: r.id,
        name: r.name,
        description: r.description,
        long_description: r.long_description || undefined,
        image: r.image,
        image_id: r.image_id || undefined,
        category_ids: parseJsonArray(r.category_ids),
        technology_ids: parseJsonArray(r.technology_ids),
        github: r.github || undefined,
        live: r.live || undefined,
        featured: Boolean(r.featured),
        created_at: r.created_at,
        updated_at: r.updated_at,
      };
    }
    const res = await fetch(`/api/projects?id=${encodeURIComponent(id)}`);
    if (!res.ok) return null;
    const r = await res.json();
    return {
      ...r,
      category_ids: parseJsonArray(r.category_ids),
      technology_ids: parseJsonArray(r.technology_ids),
    };
  },

  getFeaturedProjects: async (): Promise<ProjectType[]> => {
    const all = await projectService.getProjects();
    return all.filter(p => p.featured);
  },

  createProject: async (
    project: Omit<ProjectType, "id" | "created_at" | "updated_at">,
    imageFile?: File,
  ): Promise<ProjectType> => {
    let imageUrl = project.image || "";
    let imageId = project.image_id || "";

    if (imageFile) {
      imageId = await storageService.uploadFile(imageFile, "portfolio");
      imageUrl = storageService.getFileView(imageId, "portfolio");
    }

    if (isServer) {
      const db = getDb();
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      const newProj = {
        id,
        name: project.name,
        description: project.description,
        long_description: project.long_description || null,
        image: imageUrl,
        image_id: imageId || null,
        category_ids: project.category_ids || [],
        technology_ids: project.technology_ids || [],
        github: project.github || null,
        live: project.live || null,
        featured: Boolean(project.featured),
        created_at: now,
        updated_at: now,
      };
      await db.insert(projects).values(newProj);
      return {
        ...newProj,
        long_description: newProj.long_description || undefined,
        image_id: newProj.image_id || undefined,
        github: newProj.github || undefined,
        live: newProj.live || undefined,
      };
    }

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...project, image: imageUrl, image_id: imageId }),
    });
    return await res.json();
  },

  updateProject: async (
    id: string,
    project: Partial<Omit<ProjectType, "id" | "created_at" | "updated_at">>,
    imageFile?: File,
  ): Promise<ProjectType> => {
    let imageUrl = project.image;
    let imageId = project.image_id;

    if (imageFile) {
      imageId = await storageService.uploadFile(imageFile, "portfolio");
      imageUrl = storageService.getFileView(imageId, "portfolio");
    }

    if (isServer) {
      const db = getDb();
      const now = new Date().toISOString();
      const updateData: any = { updated_at: now };
      if (project.name !== undefined) updateData.name = project.name;
      if (project.description !== undefined) updateData.description = project.description;
      if (project.long_description !== undefined) updateData.long_description = project.long_description;
      if (imageUrl !== undefined) updateData.image = imageUrl;
      if (imageId !== undefined) updateData.image_id = imageId;
      if (project.category_ids !== undefined) updateData.category_ids = project.category_ids;
      if (project.technology_ids !== undefined) updateData.technology_ids = project.technology_ids;
      if (project.github !== undefined) updateData.github = project.github;
      if (project.live !== undefined) updateData.live = project.live;
      if (project.featured !== undefined) updateData.featured = project.featured;

      await db.update(projects).set(updateData).where(eq(projects.id, id));
      const [updated] = await db.select().from(projects).where(eq(projects.id, id));
      return {
        id: updated.id,
        name: updated.name,
        description: updated.description,
        long_description: updated.long_description || undefined,
        image: updated.image,
        image_id: updated.image_id || undefined,
        category_ids: parseJsonArray(updated.category_ids),
        technology_ids: parseJsonArray(updated.technology_ids),
        github: updated.github || undefined,
        live: updated.live || undefined,
        featured: Boolean(updated.featured),
        created_at: updated.created_at,
        updated_at: updated.updated_at,
      };
    }

    const res = await fetch(`/api/projects?id=${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...project, image: imageUrl, image_id: imageId }),
    });
    return await res.json();
  },

  deleteProject: async (id: string) => {
    if (isServer) {
      const db = getDb();
      await db.delete(projects).where(eq(projects.id, id));
      return { success: true };
    }
    const res = await fetch(`/api/projects?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    return await res.json();
  },
};

import { getDb, profile, socialLinks, uses } from "@app/db";
import { eq, asc } from "drizzle-orm";
import { ProfileType, SocialLinkType, UsesItemType } from "@app/types/admin";
import { storageService } from "./storageService";

const isServer = typeof window === "undefined";

export const profileService = {
  getProfile: async (): Promise<ProfileType | null> => {
    if (isServer) {
      const db = getDb();
      const rows = await db.select().from(profile).limit(1);
      if (rows.length === 0) return null;
      const doc = rows[0];
      return {
        id: doc.id,
        full_name: doc.full_name,
        nickname: doc.nickname,
        title: doc.title,
        bio_short: doc.bio_short,
        bio_long: doc.bio_long,
        location: doc.location,
        avatar: doc.avatar,
        avatar_id: doc.avatar_id || undefined,
        cover_image: doc.cover_image || undefined,
        cover_image_id: doc.cover_image_id || undefined,
        resume_url: doc.resume_url || undefined,
        meta_description: doc.meta_description || undefined,
        created_at: doc.created_at,
        updated_at: doc.updated_at,
      };
    }
    const res = await fetch("/api/profile");
    if (!res.ok) return null;
    return await res.json();
  },

  updateProfile: async (
    data: Partial<Omit<ProfileType, "id" | "created_at" | "updated_at">>,
    avatarFile?: File,
    coverFile?: File,
  ): Promise<ProfileType | null> => {
    let avatarUrl = data.avatar;
    let avatarId = data.avatar_id;
    if (avatarFile) {
      avatarId = await storageService.uploadFile(avatarFile, "portfolio");
      avatarUrl = storageService.getFileView(avatarId, "portfolio");
    }

    let coverUrl = data.cover_image;
    let coverId = data.cover_image_id;
    if (coverFile) {
      coverId = await storageService.uploadFile(coverFile, "portfolio");
      coverUrl = storageService.getFileView(coverId, "portfolio");
    }

    if (isServer) {
      const db = getDb();
      const existing = await profileService.getProfile();
      const now = new Date().toISOString();
      const updateData: any = {
        ...data,
        updated_at: now,
      };
      if (avatarUrl) updateData.avatar = avatarUrl;
      if (avatarId) updateData.avatar_id = avatarId;
      if (coverUrl) updateData.cover_image = coverUrl;
      if (coverId) updateData.cover_image_id = coverId;

      if (existing) {
        await db.update(profile).set(updateData).where(eq(profile.id, existing.id));
      } else {
        await db.insert(profile).values({
          id: crypto.randomUUID(),
          full_name: data.full_name || "",
          nickname: data.nickname || "",
          title: data.title || "",
          bio_short: data.bio_short || "",
          bio_long: data.bio_long || "",
          location: data.location || "",
          avatar: avatarUrl || "/profile/default-avatar.webp",
          created_at: now,
          updated_at: now,
          ...updateData,
        });
      }
      return await profileService.getProfile();
    }

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        avatar: avatarUrl,
        avatar_id: avatarId,
        cover_image: coverUrl,
        cover_image_id: coverId,
      }),
    });
    return await res.json();
  },

  uploadResume: async (file: File): Promise<string> => {
    const fileId = await storageService.uploadFile(file, "portfolio");
    const fileUrl = storageService.getFileView(fileId, "portfolio");
    await profileService.updateProfile({ resume_url: fileUrl });
    return fileUrl;
  },

  getSocialLinks: async (): Promise<SocialLinkType[]> => {
    if (isServer) {
      const db = getDb();
      const rows = await db.select().from(socialLinks).orderBy(asc(socialLinks.priority));
      return rows.map(r => ({
        id: r.id,
        platform: r.platform,
        url: r.url,
        icon: r.icon,
        priority: r.priority,
        is_visible: Boolean(r.is_visible),
        created_at: r.created_at,
        updated_at: r.updated_at,
      }));
    }
    const res = await fetch("/api/social-links");
    if (!res.ok) return [];
    return await res.json();
  },

  createSocialLink: async (data: Omit<SocialLinkType, "id" | "created_at" | "updated_at">) => {
    if (isServer) {
      const db = getDb();
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      const newLink = {
        id,
        platform: data.platform,
        url: data.url,
        icon: data.icon || "",
        priority: data.priority || 0,
        is_visible: data.is_visible !== false,
        created_at: now,
        updated_at: now,
      };
      await db.insert(socialLinks).values(newLink);
      return newLink;
    }
    const res = await fetch("/api/social-links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  updateSocialLink: async (id: string, data: Partial<Omit<SocialLinkType, "id" | "created_at" | "updated_at">>) => {
    if (isServer) {
      const db = getDb();
      const now = new Date().toISOString();
      await db.update(socialLinks).set({ ...data, updated_at: now }).where(eq(socialLinks.id, id));
      const [updated] = await db.select().from(socialLinks).where(eq(socialLinks.id, id));
      return updated;
    }
    const res = await fetch(`/api/social-links?id=${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  deleteSocialLink: async (id: string) => {
    if (isServer) {
      const db = getDb();
      await db.delete(socialLinks).where(eq(socialLinks.id, id));
      return { success: true };
    }
    const res = await fetch(`/api/social-links?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    return await res.json();
  },

  getAllUses: async (): Promise<UsesItemType[]> => {
    if (isServer) {
      const db = getDb();
      const rows = await db.select().from(uses).orderBy(asc(uses.priority));
      return rows.map(r => ({
        id: r.id,
        category_id: r.category_id,
        name: r.name,
        description: r.description,
        link: r.link || undefined,
        image: r.image || undefined,
        image_id: r.image_id || undefined,
        is_favorite: Boolean(r.is_favorite),
        priority: r.priority,
        created_at: r.created_at,
        updated_at: r.updated_at,
      }));
    }
    const res = await fetch("/api/uses");
    if (!res.ok) return [];
    return await res.json();
  },

  getUses: async (): Promise<Record<string, UsesItemType[]>> => {
    const items = await profileService.getAllUses();
    const grouped: Record<string, UsesItemType[]> = {};
    for (const item of items) {
      if (!grouped[item.category_id]) grouped[item.category_id] = [];
      grouped[item.category_id].push(item);
    }
    return grouped;
  },

  createUsesItem: async (data: Omit<UsesItemType, "id" | "created_at" | "updated_at">) => {
    if (isServer) {
      const db = getDb();
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      const newItem = {
        id,
        category_id: data.category_id,
        name: data.name,
        description: data.description || "",
        link: data.link || null,
        image: data.image || null,
        image_id: data.image_id || null,
        is_favorite: Boolean(data.is_favorite),
        priority: data.priority || 0,
        created_at: now,
        updated_at: now,
      };
      await db.insert(uses).values(newItem);
      return newItem;
    }
    const res = await fetch("/api/uses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  updateUsesItem: async (id: string, data: Partial<Omit<UsesItemType, "id" | "created_at" | "updated_at">>) => {
    if (isServer) {
      const db = getDb();
      const now = new Date().toISOString();
      await db.update(uses).set({ ...data, updated_at: now }).where(eq(uses.id, id));
      const [updated] = await db.select().from(uses).where(eq(uses.id, id));
      return updated;
    }
    const res = await fetch(`/api/uses?id=${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  deleteUsesItem: async (id: string) => {
    if (isServer) {
      const db = getDb();
      await db.delete(uses).where(eq(uses.id, id));
      return { success: true };
    }
    const res = await fetch(`/api/uses?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    return await res.json();
  },
};

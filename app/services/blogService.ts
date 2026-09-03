import { getDb, blogPosts, blogSeries, comments } from "@app/db";
import { eq, desc, sql } from "drizzle-orm";
import { BlogPostType, BlogSeriesType } from "@app/types/admin";
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

function calculateReadingTime(content: string): string {
  const wordsPerMinute = 225;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

export const blogService = {
  getBlogPosts: async (options: {
    status?: "draft" | "published";
    featured?: boolean;
    series_id?: string;
  } = {}): Promise<BlogPostType[]> => {
    if (isServer) {
      const db = getDb();
      let query = db.select().from(blogPosts).orderBy(desc(blogPosts.created_at));
      const rows = await query;
      let filtered = rows;
      if (options.status) filtered = filtered.filter(r => r.status === options.status);
      if (options.featured !== undefined) filtered = filtered.filter(r => Boolean(r.featured) === options.featured);
      if (options.series_id) filtered = filtered.filter(r => r.series_id === options.series_id);

      return filtered.map(r => ({
        id: r.id,
        title: r.title,
        slug: r.slug,
        excerpt: r.excerpt,
        content: r.content,
        cover_image: r.cover_image,
        cover_image_id: r.cover_image_id || undefined,
        date: r.date,
        reading_time: r.reading_time,
        category_ids: parseJsonArray(r.category_ids),
        tag_ids: parseJsonArray(r.tag_ids),
        technology_ids: parseJsonArray(r.technology_ids),
        status: (r.status as "draft" | "published") || "published",
        featured: Boolean(r.featured),
        series_id: r.series_id || undefined,
        series_position: r.series_position || undefined,
        related_post_ids: parseJsonArray(r.related_post_ids),
        recommended_next_read_id: r.recommended_next_read_id || undefined,
        read_count: r.read_count,
        likes: r.likes,
        created_at: r.created_at,
        updated_at: r.updated_at,
      }));
    }
    const params = new URLSearchParams();
    if (options.status) params.set("status", options.status);
    if (options.featured !== undefined) params.set("featured", String(options.featured));
    if (options.series_id) params.set("series_id", options.series_id);

    const res = await fetch(`/api/blog-posts?${params.toString()}`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.map((r: any) => ({
      ...r,
      category_ids: parseJsonArray(r.category_ids),
      tag_ids: parseJsonArray(r.tag_ids),
      technology_ids: parseJsonArray(r.technology_ids),
      related_post_ids: parseJsonArray(r.related_post_ids),
    }));
  },

  // Compatibility aliases
  getBlogs: async () => blogService.getBlogPosts(),
  getBlog: async (id: string) => blogService.getBlogPostById(id),
  getPublishedPosts: async () => blogService.getBlogPosts({ status: "published" }),
  getAllSeries: async () => blogService.getSeries(),
  getBlogBySlug: async (slug: string) => blogService.getBlogPostBySlug(slug),
  getPostBySlug: async (slug: string) => blogService.getBlogPostBySlug(slug),
  getPostById: async (id: string) => blogService.getBlogPostById(id),
  getPostsInSeries: async (seriesId: string) => blogService.getBlogPosts({ series_id: seriesId, status: "published" }),
  toggleLike: async (blogId: string) => blogService.likeBlogPost(blogId),
  recordPostRead: async (id: string) => blogService.incrementReadCount(id),

  getFeaturedBlogPosts: async (): Promise<BlogPostType[]> => {
    return await blogService.getBlogPosts({ featured: true, status: "published" });
  },

  getBlogPostBySlug: async (slug: string): Promise<BlogPostType | null> => {
    if (isServer) {
      const db = getDb();
      const rows = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
      if (rows.length === 0) return null;
      const r = rows[0];
      return {
        id: r.id,
        title: r.title,
        slug: r.slug,
        excerpt: r.excerpt,
        content: r.content,
        cover_image: r.cover_image,
        cover_image_id: r.cover_image_id || undefined,
        date: r.date,
        reading_time: r.reading_time,
        category_ids: parseJsonArray(r.category_ids),
        tag_ids: parseJsonArray(r.tag_ids),
        technology_ids: parseJsonArray(r.technology_ids),
        status: (r.status as "draft" | "published") || "published",
        featured: Boolean(r.featured),
        series_id: r.series_id || undefined,
        series_position: r.series_position || undefined,
        related_post_ids: parseJsonArray(r.related_post_ids),
        recommended_next_read_id: r.recommended_next_read_id || undefined,
        read_count: r.read_count,
        likes: r.likes,
        created_at: r.created_at,
        updated_at: r.updated_at,
      };
    }
    const res = await fetch(`/api/blog-posts?slug=${encodeURIComponent(slug)}`);
    if (!res.ok) return null;
    const r = await res.json();
    return {
      ...r,
      category_ids: parseJsonArray(r.category_ids),
      tag_ids: parseJsonArray(r.tag_ids),
      technology_ids: parseJsonArray(r.technology_ids),
      related_post_ids: parseJsonArray(r.related_post_ids),
    };
  },

  getBlogPostById: async (id: string): Promise<BlogPostType | null> => {
    if (isServer) {
      const db = getDb();
      const rows = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
      if (rows.length === 0) return null;
      const r = rows[0];
      return {
        id: r.id,
        title: r.title,
        slug: r.slug,
        excerpt: r.excerpt,
        content: r.content,
        cover_image: r.cover_image,
        cover_image_id: r.cover_image_id || undefined,
        date: r.date,
        reading_time: r.reading_time,
        category_ids: parseJsonArray(r.category_ids),
        tag_ids: parseJsonArray(r.tag_ids),
        technology_ids: parseJsonArray(r.technology_ids),
        status: (r.status as "draft" | "published") || "published",
        featured: Boolean(r.featured),
        series_id: r.series_id || undefined,
        series_position: r.series_position || undefined,
        related_post_ids: parseJsonArray(r.related_post_ids),
        recommended_next_read_id: r.recommended_next_read_id || undefined,
        read_count: r.read_count,
        likes: r.likes,
        created_at: r.created_at,
        updated_at: r.updated_at,
      };
    }
    const res = await fetch(`/api/blog-posts?id=${encodeURIComponent(id)}`);
    if (!res.ok) return null;
    const r = await res.json();
    return {
      ...r,
      category_ids: parseJsonArray(r.category_ids),
      tag_ids: parseJsonArray(r.tag_ids),
      technology_ids: parseJsonArray(r.technology_ids),
      related_post_ids: parseJsonArray(r.related_post_ids),
    };
  },

  createBlogPost: async (
    data: Omit<BlogPostType, "id" | "created_at" | "updated_at">,
    imageFile?: File,
  ): Promise<BlogPostType> => {
    let coverUrl = data.cover_image;
    let coverId = data.cover_image_id;
    if (imageFile) {
      coverId = await storageService.uploadFile(imageFile, "blog");
      coverUrl = storageService.getFileView(coverId, "blog");
    }

    if (isServer) {
      const db = getDb();
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      const readingTime = data.reading_time || calculateReadingTime(data.content);
      const newPost = {
        id,
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt || "",
        content: data.content,
        cover_image: coverUrl || "",
        cover_image_id: coverId || null,
        date: data.date || now.split("T")[0],
        reading_time: readingTime,
        category_ids: data.category_ids || [],
        tag_ids: data.tag_ids || [],
        technology_ids: data.technology_ids || [],
        status: data.status || "published",
        featured: Boolean(data.featured),
        series_id: data.series_id || null,
        series_position: data.series_position || null,
        related_post_ids: data.related_post_ids || [],
        recommended_next_read_id: data.recommended_next_read_id || null,
        read_count: data.read_count || 0,
        likes: data.likes || 0,
        created_at: now,
        updated_at: now,
      };
      await db.insert(blogPosts).values(newPost);
      return {
        ...newPost,
        cover_image_id: newPost.cover_image_id || undefined,
        series_id: newPost.series_id || undefined,
        series_position: newPost.series_position || undefined,
        recommended_next_read_id: newPost.recommended_next_read_id || undefined,
      };
    }

    const res = await fetch("/api/blog-posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, cover_image: coverUrl, cover_image_id: coverId }),
    });
    return await res.json();
  },

  updateBlogPost: async (
    id: string,
    data: Partial<Omit<BlogPostType, "id" | "created_at" | "updated_at">>,
    imageFile?: File,
  ): Promise<BlogPostType> => {
    let coverUrl = data.cover_image;
    let coverId = data.cover_image_id;
    if (imageFile) {
      coverId = await storageService.uploadFile(imageFile, "blog");
      coverUrl = storageService.getFileView(coverId, "blog");
    }

    if (isServer) {
      const db = getDb();
      const now = new Date().toISOString();
      const updateData: any = { updated_at: now };
      if (data.title !== undefined) updateData.title = data.title;
      if (data.slug !== undefined) updateData.slug = data.slug;
      if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
      if (data.content !== undefined) {
        updateData.content = data.content;
        updateData.reading_time = calculateReadingTime(data.content);
      }
      if (coverUrl !== undefined) updateData.cover_image = coverUrl;
      if (coverId !== undefined) updateData.cover_image_id = coverId;
      if (data.date !== undefined) updateData.date = data.date;
      if (data.category_ids !== undefined) updateData.category_ids = data.category_ids;
      if (data.tag_ids !== undefined) updateData.tag_ids = data.tag_ids;
      if (data.technology_ids !== undefined) updateData.technology_ids = data.technology_ids;
      if (data.status !== undefined) updateData.status = data.status;
      if (data.featured !== undefined) updateData.featured = data.featured;
      if (data.series_id !== undefined) updateData.series_id = data.series_id;
      if (data.series_position !== undefined) updateData.series_position = data.series_position;
      if (data.related_post_ids !== undefined) updateData.related_post_ids = data.related_post_ids;
      if (data.recommended_next_read_id !== undefined) updateData.recommended_next_read_id = data.recommended_next_read_id;

      await db.update(blogPosts).set(updateData).where(eq(blogPosts.id, id));
      return (await blogService.getBlogPostById(id))!;
    }

    const res = await fetch(`/api/blog-posts?id=${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, cover_image: coverUrl, cover_image_id: coverId }),
    });
    return await res.json();
  },

  deleteBlogPost: async (id: string) => {
    if (isServer) {
      const db = getDb();
      await db.delete(blogPosts).where(eq(blogPosts.id, id));
      return { success: true };
    }
    const res = await fetch(`/api/blog-posts?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    return await res.json();
  },

  likeBlogPost: async (id: string): Promise<number> => {
    if (isServer) {
      const db = getDb();
      await db.update(blogPosts).set({ likes: sql`${blogPosts.likes} + 1` }).where(eq(blogPosts.id, id));
      const [post] = await db.select({ likes: blogPosts.likes }).from(blogPosts).where(eq(blogPosts.id, id));
      return post?.likes || 0;
    }
    const res = await fetch(`/api/blog-posts?id=${encodeURIComponent(id)}&action=like`, { method: "POST" });
    const json = await res.json();
    return json.likes;
  },

  incrementReadCount: async (id: string): Promise<number> => {
    if (isServer) {
      const db = getDb();
      await db.update(blogPosts).set({ read_count: sql`${blogPosts.read_count} + 1` }).where(eq(blogPosts.id, id));
      const [post] = await db.select({ read_count: blogPosts.read_count }).from(blogPosts).where(eq(blogPosts.id, id));
      return post?.read_count || 0;
    }
    const res = await fetch(`/api/blog-posts?id=${encodeURIComponent(id)}&action=read`, { method: "POST" });
    const json = await res.json();
    return json.read_count;
  },

  getRelatedPosts: async (currentPost: BlogPostType, limit: number = 3): Promise<BlogPostType[]> => {
    const allPosts = await blogService.getBlogPosts({ status: "published" });
    const otherPosts = allPosts.filter(p => p.id !== currentPost.id);
    const related = otherPosts.filter(p =>
      (p.category_ids || []).some(cat => (currentPost.category_ids || []).includes(cat)) ||
      (p.technology_ids || []).some(tech => (currentPost.technology_ids || []).includes(tech))
    );
    return (related.length > 0 ? related : otherPosts).slice(0, limit);
  },

  getSeries: async (idOrSlug?: string): Promise<any> => {
    if (isServer) {
      const db = getDb();
      if (idOrSlug) {
        const rows = await db.select().from(blogSeries).where(eq(blogSeries.id, idOrSlug)).limit(1);
        if (rows.length > 0) return rows[0];
        const rowsSlug = await db.select().from(blogSeries).where(eq(blogSeries.slug, idOrSlug)).limit(1);
        return rowsSlug[0] || null;
      }
      const rows = await db.select().from(blogSeries).orderBy(desc(blogSeries.created_at));
      return rows.map(r => ({
        id: r.id,
        title: r.title,
        description: r.description || undefined,
        slug: r.slug,
        image: r.image || undefined,
        image_id: r.image_id || undefined,
        status: r.status,
        created_at: r.created_at,
        updated_at: r.updated_at,
      }));
    }
    const url = idOrSlug ? `/api/blog-series?slug=${encodeURIComponent(idOrSlug)}` : "/api/blog-series";
    const res = await fetch(url);
    if (!res.ok) return idOrSlug ? null : [];
    return await res.json();
  },

  getSeriesBySlug: async (slug: string): Promise<BlogSeriesType | null> => {
    return await blogService.getSeries(slug);
  },

  getComments: async (postId: string) => {
    if (isServer) {
      const db = getDb();
      const rows = await db.select().from(comments).where(eq(comments.post_id, postId)).orderBy(desc(comments.created_at));
      return rows.map(r => ({
        $id: r.id,
        id: r.id,
        content_id: r.post_id,
        post_id: r.post_id,
        user_id: "visitor",
        user_name: r.author_name,
        author_name: r.author_name,
        user_email: r.author_email,
        author_email: r.author_email,
        user_avatar: null,
        text: r.content,
        content: r.content,
        date: r.created_at,
        created_at: r.created_at,
        likes: 0,
      }));
    }
    const res = await fetch(`/api/comments?post_id=${encodeURIComponent(postId)}`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.map((r: any) => ({
      $id: r.id,
      id: r.id,
      content_id: r.post_id,
      post_id: r.post_id,
      user_id: "visitor",
      user_name: r.author_name,
      author_name: r.author_name,
      user_email: r.author_email,
      author_email: r.author_email,
      user_avatar: null,
      text: r.content,
      content: r.content,
      date: r.created_at,
      created_at: r.created_at,
      likes: 0,
    }));
  },

  addComment: async (postId: string, authorName: string, authorEmail: string, content: string) => {
    if (isServer) {
      const db = getDb();
      const newComment = {
        id: crypto.randomUUID(),
        post_id: postId,
        author_name: authorName,
        author_email: authorEmail || null,
        content,
        created_at: new Date().toISOString(),
      };
      await db.insert(comments).values(newComment);
      return newComment;
    }
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ post_id: postId, author_name: authorName, author_email: authorEmail, content }),
    });
    return await res.json();
  },
};

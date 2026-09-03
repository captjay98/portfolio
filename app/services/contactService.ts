import { getDb, contactSubmissions } from "@app/db";
import { eq, desc } from "drizzle-orm";

const isServer = typeof window === "undefined";

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  updated_at?: string;
}

export const contactService = {
  submitContact: async (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<ContactSubmission> => {
    if (isServer) {
      const db = getDb();
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      const newSub = {
        id,
        name: data.name,
        email: data.email,
        subject: data.subject || "",
        message: data.message,
        created_at: now,
        updated_at: now,
      };
      await db.insert(contactSubmissions).values(newSub);
      return newSub;
    }
    const res = await fetch("/api/contact-submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  getSubmissions: async (): Promise<ContactSubmission[]> => {
    if (isServer) {
      const db = getDb();
      const rows = await db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.created_at));
      return rows.map(r => ({
        id: r.id,
        name: r.name,
        email: r.email,
        subject: r.subject,
        message: r.message,
        created_at: r.created_at,
        updated_at: r.updated_at,
      }));
    }
    const res = await fetch("/api/contact-submissions");
    if (!res.ok) return [];
    return await res.json();
  },

  getSubmission: async (id: string): Promise<ContactSubmission> => {
    if (isServer) {
      const db = getDb();
      const [r] = await db.select().from(contactSubmissions).where(eq(contactSubmissions.id, id));
      if (!r) throw new Error("Contact submission not found");
      return {
        id: r.id,
        name: r.name,
        email: r.email,
        subject: r.subject,
        message: r.message,
        created_at: r.created_at,
        updated_at: r.updated_at,
      };
    }
    const res = await fetch(`/api/contact-submissions?id=${encodeURIComponent(id)}`);
    return await res.json();
  },

  deleteSubmission: async (id: string): Promise<void> => {
    if (isServer) {
      const db = getDb();
      await db.delete(contactSubmissions).where(eq(contactSubmissions.id, id));
      return;
    }
    await fetch(`/api/contact-submissions?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  },
};

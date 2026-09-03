const isServer = typeof window === "undefined";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const authService = {
  getCurrentUser: async (request?: Request): Promise<UserSession | null> => {
    if (isServer) {
      const req = request || (globalThis as any).__currentRequest__;
      if (!req) return null;
      const cookieHeader = req.headers?.get ? req.headers.get("cookie") || "" : "";
      const match = cookieHeader.match(/admin_session=([^;]+)/);
      if (!match) return null;

      try {
        const value = decodeURIComponent(match[1]);
        const parsed = JSON.parse(atob(value));
        if (parsed && parsed.email) {
          return {
            id: parsed.id || "admin",
            name: parsed.name || "Jamal Ibrahim Umar",
            email: parsed.email,
            role: parsed.role || "admin",
          };
        }
      } catch {
        return null;
      }
      return null;
    }

    try {
      const res = await fetch("/api/auth/me");
      if (!res.ok) return null;
      const data = await res.json();
      return data.user || null;
    } catch {
      return null;
    }
  },

  login: async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Invalid credentials");
    }

    return await res.json();
  },

  logout: async () => {
    await fetch("/api/auth/logout", { method: "POST" });
  },
};

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { account } from "@/lib/appwrite";

type User = {
  id: string;
  name?: string;
  email?: string;
  role?: string;
} | null;

export function useAuth() {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        if (!account) throw new Error("Account is not initialized");
        const currentUser = await account.get();
        setUser({
          id: currentUser.$id,
          name: currentUser.name,
          email: currentUser.email,
          role: currentUser.labels[0],
        });
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      if (!account) throw new Error("Account is not initialized");
      
      // Create session first
      await account.createEmailPasswordSession(email, password);
      
      // Then get user details
      const currentUser = await account.get();
      const userData = {
        id: currentUser.$id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.labels[0],
      };
      
      // Set user state before returning
      setUser(userData);
      setIsLoading(false);
      return { success: true, error: null };
    } catch (error) {
      setIsLoading(false);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to login",
      };
    }
  };

  const logout = async () => {
    try {
      if (!account) throw new Error("Account is not initialized");
      await account.deleteSession("current");
      setUser(null);
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return {
    user,
    isLoading,
    login,
    logout,
  };
}

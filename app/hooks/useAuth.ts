import { useState, useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { authService, UserSession } from "@app/services/authService";

export function useAuth() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
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
      const res = await authService.login(email, password);
      setUser(res.user);
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
      await authService.logout();
      setUser(null);
      router.navigate({ to: "/admin/login" });
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

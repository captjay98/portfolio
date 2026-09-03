"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button className="w-9 h-9 rounded-md flex items-center justify-center">
        💡
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-9 h-9 rounded-md flex items-center justify-center transition-colors"
      style={{
        backgroundColor:
          theme === "dark"
            ? "var(--color-card-dark)"
            : "var(--color-card-light)",
      }}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-yellow-500" />
      ) : (
        <Moon
          className="h-5 w-5"
          style={{ color: "var(--color-accent-primary)" }}
        />
      )}
    </button>
  );
}

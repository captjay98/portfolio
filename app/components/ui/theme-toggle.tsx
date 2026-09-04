"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${className}`}>
        <span className="w-4 h-4 opacity-0" />
      </div>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-light-subtle/15 dark:hover:bg-white/10 text-light-text dark:text-dark-text ${className}`}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-[#e6b450] transition-transform hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 text-light-accent dark:text-[#e6b450] transition-transform hover:-rotate-12" />
      )}
    </button>
  );
}

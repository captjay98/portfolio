"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Category = {
  value: string;
  label: string;
};

export default function BlogCategoriesFilter({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("all");

  // Initialize active category from URL on mount
  useEffect(() => {
    const category = searchParams.get("category") || "all";
    setActiveCategory(category);
  }, [searchParams]);

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);

    // Update URL with new category
    const params = new URLSearchParams(searchParams.toString());
    if (category === "all") {
      params.delete("category");
    } else {
      params.set("category", category);
    }

    // Use shallow routing to avoid full page refresh
    router.push(`/blog?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-30 bg-glass shadow-subtle rounded-lg px-2 py-1 animate-fade-in backdrop-blur-md max-w-[90vw] overflow-x-auto no-scrollbar">
      <div className="flex space-x-1 md:space-x-2">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => handleCategoryChange(category.value)}
            className={`px-2 md:px-3 py-1 md:py-1.5 rounded-md text-xs whitespace-nowrap transition-all ${
              activeCategory === category.value
                ? "bg-accent-gradient text-white shadow-accent"
                : "bg-light-subtle/10 dark:bg-dark-subtle/10 text-light-text dark:text-dark-text hover:bg-light-subtle/20 dark:hover:bg-dark-subtle/20"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { BlogPostCard } from "./BlogPostCard";
import { useSearchParams } from "next/navigation";
import { BlogPostType } from "../../../types/admin";

export default function BlogList({
  initialPosts,
}: {
  initialPosts: BlogPostType[];
}) {
  const searchParams = useSearchParams();
  const [filteredPosts, setFilteredPosts] = useState(initialPosts);
  const [, setActiveCategory] = useState("all");

  // Filter posts when search params change or when initial posts change
  useEffect(() => {
    const category = searchParams.get("category") || "all";
    const search = searchParams.get("search") || "";
    const tag = searchParams.get("tag") || "";

    setActiveCategory(category);

    // Start with initial posts
    let filtered = [...initialPosts];

    // Apply category filtering
    if (category === "featured") {
      filtered = filtered.filter((post) => post.featured);
    } else if (category !== "all") {
      filtered = filtered.filter((post) =>
        post.category_ids?.includes(category),
      );
    }

    // Apply tag filtering if present
    if (tag) {
      filtered = filtered.filter((post) => post.tag_ids?.includes(tag));
    }

    // Apply search filtering if present
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchLower) ||
          post.excerpt.toLowerCase().includes(searchLower) ||
          post.content.toLowerCase().includes(searchLower) ||
          post.category_ids?.some((cat) =>
            cat.toLowerCase().includes(searchLower),
          ) ||
          post.tag_ids?.some((tag) => tag.toLowerCase().includes(searchLower)),
      );
    }

    setFilteredPosts(filtered);
  }, [searchParams, initialPosts]);

  // No posts message
  if (filteredPosts.length === 0) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <p className="text-light-text dark:text-dark-text mb-4">
          No posts found with the current filters.
        </p>
        <button
          onClick={() => {
            // Reset all search parameters
            window.history.pushState({}, "", "/blog");
            window.location.reload();
          }}
          className="px-4 py-2 bg-accent-gradient text-white rounded-md hover:shadow-accent transition-all"
        >
          Reset Filters
        </button>
      </div>
    );
  }

  // Display filtered posts
  return (
    <>
      <p className="text-light-subtle dark:text-dark-subtle mb-6">
        Found {filteredPosts.length} post{filteredPosts.length !== 1 ? "s" : ""}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {filteredPosts.map((post, index) => (
          <div
            key={post.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <BlogPostCard post={post} />
          </div>
        ))}
      </div>
    </>
  );
}

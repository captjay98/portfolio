"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useRouter, useSearch } from "@tanstack/react-router";

export default function BlogSearch() {
  const router = useRouter();
  const searchParams = useSearch({ strict: false }) as { search?: string };
  const [searchTerm, setSearchTerm] = useState(
    searchParams.search || "",
  );
  const [isExpanded, setIsExpanded] = useState(
    Boolean(searchParams.search),
  );

  // Update search term when URL changes
  useEffect(() => {
    setSearchTerm(searchParams.search || "");
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchTerm) {
      router.navigate({
        to: "/blog",
        search: { search: searchTerm },
      });
    } else {
      router.navigate({
        to: "/blog",
        search: {},
      });
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    router.navigate({
      to: "/blog",
      search: {},
    });
  };

  return (
    <div className="relative  w-full max-w-md mx-auto m-10">
      {isExpanded ? (
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search blog posts..."
            className="w-full pl-10 pr-10 py-2 bg-glass border border-light-subtle/20 dark:border-dark-subtle/20 rounded-lg focus:outline-none focus:border-light-accent dark:focus:border-dark-accent placeholder-light-subtle dark:placeholder-dark-subtle text-light-text dark:text-dark-text"
            autoFocus
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-light-subtle dark:text-dark-subtle" />

          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-2.5"
            >
              <X className="h-5 w-5 text-light-subtle dark:text-dark-subtle hover:text-light-accent dark:hover:text-dark-accent" />
            </button>
          )}
        </form>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center justify-center w-full py-2 px-4 bg-glass border border-light-subtle/20 dark:border-dark-subtle/20 rounded-lg hover:border-light-accent dark:hover:border-dark-accent text-light-subtle dark:text-dark-subtle"
        >
          <Search className="mr-2 h-5 w-5" />
          <span>Search blog posts...</span>
        </button>
      )}
    </div>
  );
}

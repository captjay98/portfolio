"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, ListOrdered } from "lucide-react";
import { useState } from "react";
import { BlogPostType } from "@/types/admin";

interface SeriesNavigationProps {
  seriesTitle: string;
  seriesSlug: string;
  currentPostId: string;
  posts: BlogPostType[];
}

export default function SeriesNavigation({
  seriesTitle,
  seriesSlug,
  currentPostId,
  posts,
}: SeriesNavigationProps) {
  const [expanded, setExpanded] = useState(false);

  // Sort posts by series position with more robust handling
  const sortedPosts = [...posts].sort((a, b) => {
    const posA =
      a.series_position !== undefined && a.series_position !== null
        ? Number(a.series_position)
        : 9999;
    const posB =
      b.series_position !== undefined && b.series_position !== null
        ? Number(b.series_position)
        : 9999;
    return posA - posB;
  });

  // Find current post index in sorted array
  const currentIndex = sortedPosts.findIndex(
    (post) => post.id === currentPostId,
  );
  const previousPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null;
  const nextPost =
    currentIndex < sortedPosts.length - 1
      ? sortedPosts[currentIndex + 1]
      : null;

  return (
    <div className="border border-light-subtle/10 dark:border-dark-subtle/10 rounded-lg mb-8 bg-light-subtle/5 dark:bg-dark-subtle/5 overflow-hidden">
      {/* Series header */}
      <div className="p-4 border-b border-light-subtle/10 dark:border-dark-subtle/10 flex justify-between items-center">
        <div>
          <span className="text-xs uppercase tracking-wider text-light-accent dark:text-dark-accent font-semibold">
            Series
          </span>
          <h3 className="font-bold text-light-text dark:text-dark-text">
            {seriesTitle}
          </h3>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-light-accent dark:text-dark-accent text-sm flex items-center hover:underline"
        >
          <ListOrdered size={16} className="mr-1" />
          {expanded ? "Hide" : "View"} all posts
        </button>
      </div>

      {/* Expanded list of all posts in series */}
      {expanded && (
        <div className="p-4 border-b border-light-subtle/10 dark:border-dark-subtle/10 bg-glass">
          <ol className="list-decimal pl-5 space-y-2">
            {sortedPosts.map((post) => (
              <li
                key={post.id}
                className={
                  post.id === currentPostId
                    ? "text-light-accent dark:text-dark-accent font-medium"
                    : "text-light-text dark:text-dark-text"
                }
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className={
                    post.id === currentPostId
                      ? "cursor-default"
                      : "hover:underline"
                  }
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Previous/Next navigation */}
      <div className="p-4 flex justify-between items-center">
        {previousPost ? (
          <Link
            href={`/blog/${previousPost.slug}`}
            className="flex items-center text-light-accent dark:text-dark-accent text-sm hover:underline"
          >
            <ChevronLeft size={16} className="mr-1" />
            <span className="max-w-[120px] truncate">
              Previous: {previousPost.title}
            </span>
          </Link>
        ) : (
          <div></div>
        )}

        <Link
          href={`/blog/series/${seriesSlug}`}
          className="text-light-accent dark:text-dark-accent text-sm hover:underline mx-2"
        >
          View Series
        </Link>

        {nextPost ? (
          <Link
            href={`/blog/${nextPost.slug}`}
            className="flex items-center text-light-accent dark:text-dark-accent text-sm hover:underline text-right"
          >
            <span className="max-w-[120px] truncate">
              Next: {nextPost.title}
            </span>
            <ChevronRight size={16} className="ml-1" />
          </Link>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}

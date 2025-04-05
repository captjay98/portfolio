"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar } from "lucide-react";
import { blogService } from "@/services/blogService";
import { BlogPostType } from "../../../types/admin";
import { getImageSrc } from "@/utils/imageUtils";

interface RelatedPostsProps {
  currentPostId: string;
  relatedPostIds?: string[];
  tags?: string[];
  categories?: string[];
}

export default function RelatedPosts({
  currentPostId,
  relatedPostIds = [],
  tags = [],
  categories = [],
}: RelatedPostsProps) {
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasRendered, setHasRendered] = useState(false);

  // Prevent hydration mismatch by marking component as rendered
  useEffect(() => {
    setHasRendered(true);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchRelatedPosts = async () => {
      try {
        // If we have explicit related post IDs, use those first
        if (relatedPostIds.length > 0) {
          const posts = await blogService.getRelatedPosts(relatedPostIds);
          if (isMounted) setRelatedPosts(posts);
        }
        // Otherwise, find posts with similar categories or tags
        else {
          const allPosts = await blogService.getBlogs();

          // Filter out the current post
          const otherPosts = allPosts.filter(
            (post) => post.id !== currentPostId,
          );

          // Score each post based on shared categories and tags
          const scoredPosts = otherPosts.map((post) => {
            let score = 0;

            // Score based on categories
            post.category_ids?.forEach((category) => {
              if (categories && categories.includes(category)) score += 2;
            });

            // Score based on tags
            post.tag_ids?.forEach((tag) => {
              if (tags && tags.includes(tag)) score += 1;
            });

            return { post, score };
          });

          // Sort by score and take top 3
          const topPosts = scoredPosts
            .filter((item) => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .map((item) => item.post)
            .slice(0, 3);

          // If we don't have enough related posts, add some recent ones
          if (topPosts.length < 3) {
            const recentPosts = otherPosts
              .filter((post) => !topPosts.some((p) => p.id === post.id))
              .sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateB.getTime() - dateA.getTime();
              })
              .slice(0, 3 - topPosts.length);

            topPosts.push(...recentPosts);
          }

          if (isMounted) setRelatedPosts(topPosts);
        }
      } catch (error) {
        console.error("Error fetching related posts:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    // Only fetch if we've rendered client-side to avoid hydration mismatch
    if (hasRendered) {
      fetchRelatedPosts();
    }

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [currentPostId, relatedPostIds, categories, tags, hasRendered]);

  // Don't show anything during SSR to prevent hydration mismatch
  if (!hasRendered) {
    return null;
  }

  // Return null if there are no related posts
  if (!loading && relatedPosts.length === 0) {
    return null;
  }

  // Common title and container for both loading and loaded states
  const SectionTitle = () => (
    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6">
      Related Posts
    </h2>
  );

  return (
    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
      <SectionTitle />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading
          ? // Loading skeletons that match the card dimensions exactly
            Array(3)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-50 dark:bg-gray-800/50 rounded-lg overflow-hidden animate-pulse"
                >
                  <div className="h-32 bg-gray-200 dark:bg-gray-700"></div>
                  <div className="p-4">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-2"></div>
                  </div>
                </div>
              ))
          : // Actual related posts
            relatedPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group block bg-gray-50 dark:bg-gray-800/50 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative h-32 overflow-hidden">
                  <Image
                    src={getImageSrc(post.cover_image)}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw"
                    className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                    quality={75}
                  />
                </div>

                <div className="p-4">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h3>

                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                    <Calendar size={12} className="mr-1" />
                    <span>
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
}

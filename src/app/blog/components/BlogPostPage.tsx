"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { blogService } from "@/services/blogService";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { BlogPostType } from "../../../types/admin";
import { getImageSrc } from "@/utils/imageUtils";

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Get all posts and find the one with matching slug
        const allPosts = await blogService.getBlogs();
        const foundPost = allPosts.find((p) => p.slug === slug);

        if (foundPost) {
          // Optionally fetch the full post if needed
          const fullPost = await blogService.getBlog(foundPost.id);
          setPost(fullPost);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching blog post:", error);
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  // Handle post not found
  if (!loading && !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            Post not found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The blog post you are looking for does not exist or has been
            removed.
          </p>
          <Link
            href="/blog"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  if (loading || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-blue-600 dark:text-blue-400">
          Loading...
        </div>
      </div>
    );
  }

  // Format the date for display
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="min-h-screen max-h-screen overflow-y-auto pb-16">
      <article className="w-full px-4 py-6 md:py-12 animate-fade-in">
        <div className="max-w-3xl mx-auto">
          {/* Back button */}
          <Link
            href="/blog"
            className="inline-flex items-center mb-8 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            <span>Back to all posts</span>
          </Link>

          {/* Post header */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
              <div className="flex items-center">
                <Calendar size={16} className="mr-1" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center">
                <Clock size={16} className="mr-1" />
                <span>{post.reading_time}</span>
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-6">
              {post.category_ids &&
                post.category_ids.map((category) => (
                  <span
                    key={category}
                    className="px-3 py-1 text-sm rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                  >
                    <Tag size={14} className="inline mr-1" />
                    {category}
                  </span>
                ))}
            </div>
          </header>

          {/* Featured image */}
          {post.cover_image && (
            <div className="relative w-full h-80 md:h-96 mb-8 rounded-lg overflow-hidden">
              <Image
                src={getImageSrc(post.cover_image)}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 768px"
                className="object-cover"
                priority
                quality={90}
              />
            </div>
          )}

          {/* Post content with markdown renderer */}
          <MarkdownRenderer content={post.content} />

          {/* Post footer */}
          <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
            <Link
              href="/blog"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
            >
              <ArrowLeft size={16} className="mr-2" />
              <span>Back to all posts</span>
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}

import { Calendar, ChevronRight, Clock, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BlogPostType } from "../../../types/admin";
import { getImageSrc } from "@/utils/imageUtils";
import { LikeButton } from "./LikeButton";

export function BlogPostCard({ post }: { post: BlogPostType }) {
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
console.log(post)
  return (
    <div className="group bg-glass rounded-lg overflow-hidden shadow-elevated effect-3d transition-all duration-300 border border-light-subtle/10 dark:border-dark-subtle/20 hover:-translate-y-1 h-full flex flex-col">
      {/* Featured badge */}
      {post.featured && (
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-accent-gradient text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-accent">
            Featured
          </span>
        </div>
      )}

      {/* Image section */}
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={getImageSrc(post.cover_image)}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw"
          className="object-cover transform group-hover:scale-105 transition-transform duration-500"
          quality={85}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent transition-opacity duration-300"></div>

        {/* Categories overlay */}
        {/* <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
          {post.category_ids &&
            post.category_ids.slice(0, 2).map((category) => (
              <span
                key={category}
                className="px-2 py-1 text-xs bg-light-subtle/20 dark:bg-dark-subtle/20 text-white rounded-full backdrop-blur-sm"
              >
                {category}
              </span>
            ))}
          {post.category_ids && post.category_ids.length > 2 && (
            <span className="px-2 py-1 text-xs bg-light-subtle/20 dark:bg-dark-subtle/20 text-white rounded-full backdrop-blur-sm">
              +{post.category_ids.length - 2}
            </span>
          )}
        </div> */}
      </div>

      {/* Content section */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-light-text dark:text-dark-text mb-2 group-hover:text-light-accent dark:group-hover:text-dark-accent transition-colors">
          {post.title}
        </h3>

        <div className="flex items-center text-light dark:text-dark-subtle text-sm mb-4 space-x-4">
          <div className="flex items-center">
            <Calendar size={14} className="mr-1" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center">
            <Clock size={14} className="mr-1" />
            <span>{post.reading_time}</span>
          </div>
          <div className="flex items-center">
            <BookOpen size={14} className="mr-1" />
            <span>{post.read_count || 0} reads</span>
          </div>
          <LikeButton 
            blogId={post.id} 
            initialLikes={post.likes || 0} 
            iconSize={14}
          />
        </div>

        <p className="text-light-text dark:text-dark-text text-sm mb-5 flex-1">
          {post.excerpt}
        </p>

        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center mt-auto text-light-accent dark:text-dark-accent font-medium text-sm hover:underline group/link"
        >
          Read more
          <ChevronRight
            size={16}
            className="ml-1 transform group-hover/link:translate-x-1 transition-transform"
          />
        </Link>
      </div>
    </div>
  );
}

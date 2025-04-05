import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ChevronRight } from "lucide-react";
import { getImageSrc } from "@/utils/imageUtils";
import { BlogPostType } from "@/types/admin";

export default function FeaturedPost({ post }: { post: BlogPostType }) {
  // Format the date for display
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="group relative h-80 w-full overflow-hidden rounded-xl">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <Image
          src={getImageSrc(post.cover_image)}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 1200px"
          className="object-cover transform group-hover:scale-105 transition-transform duration-700"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 w-full p-6 md:p-8">
        <div className="max-w-xl">
          {/* Featured badge */}
          <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold rounded-full bg-blue-600 text-white">
            Featured
          </span>

          {/* Title */}
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors">
            {post.title}
          </h3>

          {/* Metadata */}
          <div className="flex items-center text-white/80 space-x-4 mb-4">
            <div className="flex items-center">
              <Calendar size={14} className="mr-1" />
              <span className="text-sm">{formattedDate}</span>
            </div>
            {post.reading_time && (
              <div className="flex items-center">
                <Clock size={14} className="mr-1" />
                <span className="text-sm">{post.reading_time}</span>
              </div>
            )}
          </div>

          {/* Excerpt */}
          <p className="text-white/90 text-sm md:text-base line-clamp-2 mb-4">
            {post.excerpt}
          </p>

          {/* Link */}
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center text-blue-300 hover:text-blue-100 transition-colors"
          >
            Read article
            <ChevronRight
              size={16}
              className="ml-1 transform group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </div>

      {/* Make the whole card clickable */}
      <Link
        href={`/blog/${post.slug}`}
        className="absolute inset-0"
        aria-label={post.title}
      />
    </div>
  );
}

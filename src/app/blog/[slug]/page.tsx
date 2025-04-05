import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Tag, Share2, BookOpen } from "lucide-react";
import { blogService } from "@/services/blogService";
import { profileService } from "@/services/profileService";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import TableOfContents from "../components/TableOfContents";
import SeriesNavigation from "../components/SeriesNavigation";
import RelatedPosts from "../components/RelatedPosts";
import BackToTopButton from "../components/BackToTopButton";
import Comments from "../components/Comments";
import { BlogPostType, BlogSeriesType } from "@/types/admin";
import { getImageSrc } from "@/utils/imageUtils";
import { categoryService } from "@/services/categoryService";
import { LikeButton } from "../components/LikeButton";

export const dynamicParams = true;
export const revalidate = 3600;

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [
        {
          url: post.cover_image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: "article",
      publishedTime: post.date,
      tags: post.category_ids,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.cover_image],
    },
  };
}

// Generate static paths for common blog posts
export async function generateStaticParams() {
  try {
    const posts = await blogService.getBlogs();
    // Generate static paths for the most recent or featured posts
    const postsToPrerender = posts
      .filter((post) => post.featured || post.status === "published")
      .slice(0, 10); // Limit to 10 to avoid too many static pages

    return postsToPrerender.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error("Error generating static paths for blog posts:", error);
    return [];
  }
}

// Helper function to get a post by slug
async function getPostBySlug(slug: string): Promise<BlogPostType | null> {
  try {
    const allPosts = (await blogService.getBlogs()) as BlogPostType[];
    const post = allPosts.find((p) => p.slug === slug);

    if (!post) return null;

    return post;
  } catch (error) {
    console.error("Error fetching blog post by slug:", error);
    return null;
  }
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const categories = await categoryService.getCategories();

  if (!post) {
    notFound();
  }

  // Increment read count
  try {
    await blogService.incrementReadCount(post.id);
  } catch (error) {
    console.error("Error incrementing read count:", error);
  }

  const usedCategories = categories.filter((category) =>
    post.category_ids.includes(category.id),
  );

  const categoryFilters = [
    ...usedCategories.map((category) => ({
      value: category.id,
      label: category.name,
    })),
  ];

  // Get author information
  const author = await profileService.getProfile();

  // Get series info if the post is part of a series
  let seriesData: BlogSeriesType | null = null;
  let seriesPosts: BlogPostType[] = [];
  if (post.series_id) {
    try {
      const series = await blogService.getSeries(post.series_id);
      const postsInSeries = (await blogService.getPostsInSeries(
        post.series_id,
      )) as BlogPostType[];

      if (series && postsInSeries.length > 0) {
        seriesData = series;
        seriesPosts = postsInSeries.map((post) => ({
          ...post,
          coverImage: post.cover_image,
          readingTime: post.reading_time,
        }));
      }
    } catch (error) {
      console.error("Error fetching series data:", error);
    }
  }

  // Format the date for display
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="min-h-screen max-h-screen overflow-y-auto pb-16">
      <BackToTopButton />

      <article className="w-full px-2 py-6 md:py-12 animate-fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main content column */}
            <div className="lg:w-2/3">
              {/* Back button */}
              <Link
                href="/blog"
                className="inline-flex items-center mb-8 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <ArrowLeft size={16} className="mr-2" />
                <span>Back to all posts</span>
              </Link>

              {/* Content Card - Wrapping all the content */}
              <div className="bg-glass rounded-xl shadow-elevated effect-3d overflow-hidden border border-light-subtle/10 dark:border-dark-subtle/20 mb-8">
                <div className="py-6 px-2 md:p-8">
                  {/* Post header */}
                  <header className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-light-text dark:text-dark-text mb-4">
                      {post.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-light-subtle dark:text-dark-subtle mb-6">
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-1" />
                        <span>{formattedDate}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={16} className="mr-1" />
                        <span>{post.reading_time}</span>
                      </div>
                      <div className="flex items-center">
                        <BookOpen size={16} className="mr-1" />
                        <span>{post.read_count || 0} reads</span>
                      </div>
                      <LikeButton 
                        blogId={post.id} 
                        initialLikes={post.likes || 0}
                        iconSize={16}
                      />
                    </div>

                    {/* Category_ids */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {post.category_ids &&
                        categoryFilters.map((category) => (
                          <Link
                            key={category.value}
                            href={`/blog?category=${category}`}
                            className="px-3 py-1 text-sm rounded-full bg-light-subtle/10 dark:bg-dark-subtle/10 text-light-text dark:text-dark-text hover:bg-light-subtle/20 dark:hover:bg-dark-subtle/20 transition-colors"
                          >
                            <Tag size={14} className="inline mr-1" />
                            {category.label}
                          </Link>
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

                  {/* Series navigation (if part of a series) */}
                  {seriesData && seriesPosts.length > 0 && (
                    <SeriesNavigation
                      seriesTitle={seriesData.title}
                      seriesSlug={seriesData.slug}
                      currentPostId={post.id}
                      posts={seriesPosts}
                    />
                  )}

                  {/* Table of contents */}
                  <TableOfContents content={post.content} />

                  {/* Post content with markdown renderer */}
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <MarkdownRenderer content={post.content} />
                  </div>

                  {/* Social sharing */}
                  <div className="mt-8 pt-4 border-t border-light-subtle/10 dark:border-dark-subtle/10">
                    <div className="flex flex-wrap items-center">
                      <span className="text-light-text dark:text-dark-text mr-4 flex items-center">
                        <Share2 size={16} className="mr-2" />
                        Share this post:
                      </span>
                      <div className="flex space-x-2">
                        <a
                          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                          aria-label="Share on Twitter"
                        >
                          <svg
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                          </svg>
                        </a>

                        <a
                          href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`)}&title=${encodeURIComponent(post.title)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                          aria-label="Share on LinkedIn"
                        >
                          <svg
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        </a>

                        <a
                          href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(`I thought you might enjoy this article: ${post.title} ${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`)}`}
                          className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                          aria-label="Share via Email"
                        >
                          <svg
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments section */}
              <div className="bg-glass rounded-xl shadow-elevated effect-3d overflow-hidden border border-light-subtle/10 dark:border-dark-subtle/20 p-6">
                <Comments postId={post.id} postSlug={post.slug} />
              </div>

              {/* Related posts - outside the card */}
              <RelatedPosts
                currentPostId={post.id}
                relatedPostIds={post.related_post_ids}
                tags={post.tag_ids}
                categories={post.category_ids}
              />
            </div>

            {/* Sidebar column */}
            <aside className="lg:w-1/3 space-y-8">
              {/* Author bio card */}
              <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-lg p-6 border border-blue-100 dark:border-blue-900/30">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3">
                  About the Author
                </h3>
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                    <Image
                      src={author?.avatar || "/avatar.jpg"}
                      alt={author?.nickname || "Author"}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200">
                      {author?.full_name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {author?.title || "Software Engineer"}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {author?.bio_short ||
                    "Full-stack developer specialized in building modern web applications."}
                </p>
              </div>

              {/* Series Information (if applicable) - Simplified approach */}
              {seriesData && seriesPosts.length > 0 && (
                <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-lg overflow-hidden border border-blue-100 dark:border-blue-900/30">
                  <div className="p-4 bg-blue-100/50 dark:bg-blue-900/30 border-b border-blue-100 dark:border-blue-900/40">
                    <h3 className="font-bold text-light-text dark:text-dark-text flex items-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-light-accent dark:bg-dark-accent mr-2"></span>
                      Part of Series: {seriesData.title}
                    </h3>
                  </div>

                  <div className="p-4">
                    <div className="mb-3">
                      <Link
                        href={`/blog/series/${seriesData.slug}`}
                        className="text-sm text-light-accent dark:text-dark-accent hover:underline"
                      >
                        View all posts in this series
                      </Link>
                    </div>

                    <div className="space-y-3">
                      {seriesPosts
                        .sort(
                          (a, b) =>
                            (a.series_position || 0) - (b.series_position || 0),
                        )
                        .map((seriesPost) => (
                          <div
                            key={seriesPost.id}
                            className={`p-2 rounded ${
                              seriesPost.id === post.id
                                ? "bg-light-subtle/10 dark:bg-dark-subtle/10"
                                : ""
                            }`}
                          >
                            {seriesPost.id === post.id ? (
                              <div className="text-light-accent dark:text-dark-accent font-medium">
                                → {seriesPost.title}{" "}
                                <span className="text-xs">(current)</span>
                              </div>
                            ) : (
                              <Link
                                href={`/blog/${seriesPost.slug}`}
                                className="block text-light-text dark:text-dark-text hover:text-light-accent dark:hover:text-dark-accent"
                              >
                                {seriesPost.title}
                              </Link>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tags cloud */}
              {post.tag_ids && post.tag_ids.length > 0 && (
                <div className="bg-slate-50/30 dark:bg-slate-800/30 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tag_ids.map((tag) => (
                      <Link
                        key={tag}
                        href={`/blog?tag=${tag}`}
                        className="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </article>
    </main>
  );
}

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock } from "lucide-react";
import { blogService } from "@/services/blogService";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostType } from "@/types/admin";
import { getImageSrc } from "@/utils/imageUtils";

// Enable dynamic routes with static generation where possible
export const dynamicParams = true;
export const revalidate = 3600; // Revalidate at most once per hour

type Params = Promise<{ slug: string }>;

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const series = await getSeriesBySlug(slug);

  if (!series) {
    return {
      title: "Series Not Found",
      description: "The requested blog series could not be found.",
    };
  }

  return {
    title: `${series.title} - Blog Series`,
    description:
      series.description ||
      `A collection of posts in the ${series.title} series`,
    openGraph: {
      title: `${series.title} - Blog Series`,
      description:
        series.description ||
        `A collection of posts in the ${series.title} series`,
      images: series.image
        ? [
            {
              url: series.image,
              width: 1200,
              height: 630,
              alt: series.title,
            },
          ]
        : undefined,
      type: "website",
    },
  };
}

// Generate static paths for common series
export async function generateStaticParams() {
  try {
    const allSeries = await blogService.getAllSeries();
    return allSeries.map((series) => ({
      slug: series.slug,
    }));
  } catch (error) {
    console.error("Error generating static paths for blog series:", error);
    return [];
  }
}

// Helper function to get a series by slug
async function getSeriesBySlug(slug: string) {
  try {
    return await blogService.getSeriesBySlug(slug);
  } catch (error) {
    console.error("Error fetching blog series by slug:", error);
    return null;
  }
}

export default async function SeriesPage({ params }: { params: Params }) {
  const { slug } = await params;
  const series = await getSeriesBySlug(slug);

  if (!series) {
    notFound();
  }

  // Get all posts in this series
  const posts = (await blogService.getPostsInSeries(
    series.id,
  )) as BlogPostType[];

  // Calculate total reading time for the series
  const totalReadingTime = posts.reduce((total, post) => {
    const time = post.reading_time || "0 min read";
    const minutes = parseInt(time.split(" ")[0]) || 0;
    return total + minutes;
  }, 0);

  return (
    <main className="min-h-screen max-h-screen overflow-y-auto pb-16">
      <div className="w-full px-4 py-6 md:py-12 animate-fade-in">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Link
            href="/blog"
            className="inline-flex items-center mb-8 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            <span>Back to all posts</span>
          </Link>

          {/* Content Card - Matching the blog post card styling */}
          <div className="bg-glass rounded-xl shadow-elevated effect-3d overflow-hidden border border-light-subtle/10 dark:border-dark-subtle/20 mb-8">
            <div className="p-6 md:p-8">
              {/* Series header */}
              <header className="mb-8">
                <div className="flex items-center mb-4">
                  <BookOpen
                    size={20}
                    className="mr-2 text-light-accent dark:text-dark-accent"
                  />
                  <span className="text-sm uppercase tracking-wider text-light-accent dark:text-dark-accent font-semibold">
                    Blog Series
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-light-text dark:text-dark-text mb-4">
                  {series.title}
                </h1>

                <div className="flex items-center text-light-subtle dark:text-dark-subtle text-sm mb-6">
                  <Clock size={16} className="mr-1" />
                  <span>
                    {totalReadingTime} min total reading time • {posts.length}{" "}
                    {posts.length === 1 ? "post" : "posts"}
                  </span>
                </div>

                {/* Series image if available */}
                {series.image && (
                  <div className="relative w-full h-64 md:h-80 mb-8 rounded-lg overflow-hidden">
                    <Image
                      src={getImageSrc(series.image)}
                      alt={series.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 768px"
                      className="object-cover"
                      priority
                      quality={90}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent"></div>
                  </div>
                )}

                {/* Series description */}
                {series.description && (
                  <div className="prose dark:prose-invert max-w-none mb-8 text-light-text dark:text-dark-text">
                    <MarkdownRenderer content={series.description} />
                  </div>
                )}
              </header>

              {/* Posts in series */}
              <section>
                <h2 className="text-xl font-bold text-light-text dark:text-dark-text mb-6">
                  Posts in this series
                </h2>

                {posts.length > 0 ? (
                  <div className="space-y-6">
                    {posts.map((post, index) => (
                      <div key={post.id} className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-light-subtle/20 dark:bg-dark-subtle/20 flex items-center justify-center text-light-accent dark:text-dark-accent font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <Link
                            href={`/blog/${post.slug}`}
                            className="block p-4 border border-light-subtle/10 dark:border-dark-subtle/10 rounded-lg hover:border-light-accent/30 dark:hover:border-dark-accent/30 transition-colors"
                          >
                            <h3 className="font-bold text-light-text dark:text-dark-text mb-2 hover:text-light-accent dark:hover:text-dark-accent">
                              {post.title}
                            </h3>
                            <p className="text-sm text-light-subtle dark:text-dark-subtle mb-2">
                              {post.excerpt}
                            </p>
                            <div className="text-xs text-light-subtle/80 dark:text-dark-subtle/80">
                              {post.reading_time}
                            </div>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-light-subtle dark:text-dark-subtle">
                    No posts found in this series yet.
                  </p>
                )}
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

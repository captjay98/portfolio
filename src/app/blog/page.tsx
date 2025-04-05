import { Suspense } from "react";
import { blogService } from "@/services/blogService";
import { Skeleton } from "@/components/ui/skeleton";
import BlogList from "./components/BlogList";
import BlogCategoriesFilter from "./components/BlogCategoriesFilter";
// import BlogSearch from "./components/BlogSearch";
import SeriesList from "./components/SeriesList";
import { BlogPostType } from "@/types/admin";
import { categoryService } from "@/services/categoryService";

export const revalidate = 3600;

export const metadata = {
  title: "Blog",
  description: "Thoughts, insights, tutorials on web development, software engineering, tech, Islam, life, sports, cars, aviation and anything else that I fancy.",
};

export default async function BlogPage() {
  // Fetch all blog posts server-side
  const posts = (await blogService.getBlogs()) as BlogPostType[];
  const categories = await categoryService.getCategories();

  // Fetch series
  const allSeries = await blogService.getAllSeries();
  const hasSeries = allSeries.length > 0;

  const usedCategoryIds = new Set<string>();
  posts.forEach((post) => {
    if (Array.isArray(post.category_ids)) {
      post.category_ids.forEach((id) => usedCategoryIds.add(id));
    } else if (post.category_ids) {
      usedCategoryIds.add(post.category_ids);
    }
  });

  // Filter categories to only include those used in projects
  const usedCategories = categories.filter((category) =>
    usedCategoryIds.has(category.id),
  );

  // Create category options including "all" and "featured"
  const categoryFilters = [
    { value: "all", label: "All Projects" },
    { value: "featured", label: "Featured" },
    ...usedCategories.map((category) => ({
      value: category.id,
      label: category.name,
    })),
  ];

  return (
    <main className="min-h-screen max-h-screen overflow-y-auto py-16">
      <div className="w-full px-4 py-6 md:py-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mt-8 animate-fade-in">
            {/* <h1 className="text-xl font-bold text-light-text dark:text-dark-text m-4">
              $user-{">"}blog;
            </h1> */}
            <p className="mb-10 text-light dark:text-dark-subtle max-w-2xl mx-auto">
              Thoughts, insights, tutorials on web development, software
              engineering, tech, Islam, life, sports, cars, aviation and
              anything else that I fancy.
            </p>
          </div>

          {/* Search Component - Client Component
          <Suspense
            fallback={
              <div className="max-w-md mx-auto mb-8">
                <Skeleton className="h-10 w-full rounded-full" />
              </div>
            }
          >
            <BlogSearch />
          </Suspense> */}

          {/* Filter Categories - Client Component */}
          <Suspense
            fallback={
              <div className="flex flex-wrap justify-center gap-2 mb-10">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="w-24 h-10 rounded-full" />
                ))}
              </div>
            }
          >
            <BlogCategoriesFilter categories={categoryFilters} />
          </Suspense>

          {/* Series Section - When series exist */}
          {hasSeries && (
            <Suspense
              fallback={
                <div className="mb-10">
                  <Skeleton className="h-12 w-64 mb-4" />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-40 w-full rounded-lg" />
                    ))}
                  </div>
                </div>
              }
            >
              <SeriesList series={allSeries.slice(0, 3)} />
            </Suspense>
          )}

          {/* Blog Posts List - Client Component with Server Data */}
          <Suspense
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-[400px]">
                    <Skeleton className="w-full h-full rounded-lg" />
                  </div>
                ))}
              </div>
            }
          >
            <BlogList initialPosts={posts} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}

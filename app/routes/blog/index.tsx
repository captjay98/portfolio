import { createFileRoute } from '@tanstack/react-router'
import BlogList from '@app/blog/components/BlogList'
import BlogCategoriesFilter from '@app/blog/components/BlogCategoriesFilter'
import SeriesList from '@app/blog/components/SeriesList'
import { blogService } from '@app/services/blogService'
import { categoryService } from '@app/services/categoryService'
import * as React from 'react'

const fetchBlogData = async () => {
  try {
    const [posts, categories, series] = await Promise.all([
      blogService.getPublishedPosts(),
      categoryService.getCategories(),
      blogService.getAllSeries(),
    ])

    // Format categories for filter - only include categories that have posts
    const categoryIds = new Set(posts.flatMap(post => post.category_ids || []))
    const categoryFilters = categories
      .filter(cat => categoryIds.has(cat.id))
      .map(cat => ({
        id: cat.id,
        name: cat.name,
      }))

    return {
      posts,
      categoryFilters,
      allSeries: series,
    }
  } catch (error) {
    console.error('Error fetching blog data:', error)
    return {
      posts: [],
      categoryFilters: [],
      allSeries: [],
    }
  }
}

export const Route = createFileRoute('/blog/')({
  loader: async () => {
    return fetchBlogData()
  },
  component: Blog,
})

function Blog() {
  const { posts, categoryFilters, allSeries } = Route.useLoaderData()
  const hasSeries = allSeries && allSeries.length > 0

  return (
    <main className="min-h-screen max-h-screen overflow-y-auto py-16">
      <div className="w-full px-4 py-6 md:py-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mt-8 animate-fade-in">
            <p className="mb-10 text-light dark:text-dark-subtle max-w-2xl mx-auto">
              Thoughts, insights, tutorials on web development, software
              engineering, tech, Islam, life, sports, cars, aviation and
              anything else that I fancy.
            </p>
          </div>

          <BlogCategoriesFilter categories={categoryFilters} />

          {hasSeries && (
            <SeriesList series={allSeries.slice(0, 3)} />
          )}

          <BlogList initialPosts={posts} />
        </div>
      </div>
    </main>
  )
}

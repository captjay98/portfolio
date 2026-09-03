import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { getImageSrc } from '@app/utils/imageUtils'
import {
  ArrowLeft,
  Calendar,
  Clock,
  Layers,
  ChevronRight,
  BookOpen,
} from 'lucide-react'
import * as React from 'react'

// Mock fetchSeriesData for build verification
const fetchSeriesData = async ({ data: slug }: { data: string }) => {
  return null
}

export const Route = createFileRoute('/blog/series/$slug/')({
  loader: ({ params }) => fetchSeriesData({ data: params.slug }),
  component: SeriesPage,
})

function SeriesPage() {
  const data = Route.useLoaderData()

  if (!data) {
    throw notFound()
  }

  const { series, posts } = data as any

  const sortedPosts = [...posts].sort(
    (a: any, b: any) => (a.series_position || 0) - (b.series_position || 0),
  )

  const totalReadingTime = posts.reduce((acc: number, post: any) => {
    const minutes = parseInt(post.reading_time || '0')
    return acc + (isNaN(minutes) ? 0 : minutes)
  }, 0)

  return (
    <main className="min-h-screen max-h-screen overflow-y-auto pb-16">
      <div className="w-full px-4 py-6 md:py-12 animate-fade-in">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/blog"
            className="inline-flex items-center mb-8 text-light-subtle dark:text-dark-subtle hover:text-light-accent dark:hover:text-dark-accent transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            <span>Back to Blog</span>
          </Link>

          <header className="mb-12 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 mb-4 shadow-sm">
              <Layers size={32} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-light-text dark:text-dark-text mb-4">
              {series.title}
            </h1>
            <p className="text-xl text-light-subtle dark:text-dark-subtle mb-6 max-w-2xl mx-auto">
              {series.description}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-light-subtle dark:text-dark-subtle">
              <div className="flex items-center bg-glass px-3 py-1 rounded-full border border-light-subtle/10 dark:border-dark-subtle/10">
                <BookOpen size={16} className="mr-2" />
                <span>{posts.length} Posts</span>
              </div>
              <div className="flex items-center bg-glass px-3 py-1 rounded-full border border-light-subtle/10 dark:border-dark-subtle/10">
                <Clock size={16} className="mr-2" />
                <span>~{totalReadingTime} min read</span>
              </div>
            </div>
          </header>

          <div className="relative">
            <div className="absolute left-4 md:left-8 top-4 bottom-4 w-0.5 bg-gradient-to-b from-blue-500/20 via-blue-500/10 to-transparent"></div>

            <div className="space-y-8">
              {sortedPosts.map((post: any, index: number) => {
                const postDate = new Date(post.date).toLocaleDateString(
                  'en-US',
                  {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  },
                )

                return (
                  <div
                    key={post.id}
                    className="relative pl-12 md:pl-20 group animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="absolute left-[0.65rem] md:left-[1.65rem] top-6 w-6 h-6 rounded-full bg-glass border-2 border-blue-500 z-10 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                        {index + 1}
                      </span>
                    </div>

                    <Link
                      to="/blog/$slug"
                      params={{ slug: post.slug }}
                      className="block bg-glass rounded-xl p-5 md:p-6 shadow-subtle hover:shadow-elevated border border-transparent hover:border-blue-500/30 transition-all duration-300 group-hover:-translate-y-1"
                    >
                      <div className="flex flex-col md:flex-row gap-6">
                        {post.cover_image && (
                          <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden shrink-0 shadow-md">
                            <img
                              src={getImageSrc(post.cover_image)}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        )}

                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-light-text dark:text-dark-text mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-light-subtle dark:text-dark-subtle mb-4 line-clamp-2 text-sm">
                            {post.description ||
                              post.excerpt ||
                              'Read this chapter...'}
                          </p>

                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-4 text-xs text-light-subtle dark:text-dark-subtle">
                              <span className="flex items-center">
                                <Calendar size={12} className="mr-1" />
                                {postDate}
                              </span>
                              <span className="flex items-center">
                                <Clock size={12} className="mr-1" />
                                {post.reading_time}
                              </span>
                            </div>

                            <span className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                              Read
                              <ChevronRight size={16} className="ml-1" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

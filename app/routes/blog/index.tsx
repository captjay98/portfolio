import { createFileRoute, Link } from '@tanstack/react-router'
import { blogService } from '@app/services/blogService'
import { categoryService } from '@app/services/categoryService'
import { LikeButton } from '@app/blog/components/LikeButton'
import { ArrowUpRight, BookOpen, Calendar, Clock, Eye, Sparkles } from 'lucide-react'
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
  const { posts, categoryFilters } = Route.useLoaderData()
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all')

  const filteredPosts = React.useMemo(() => {
    if (selectedCategory === 'all') return posts
    return posts.filter((p: any) => p.category_ids?.includes(selectedCategory))
  }, [posts, selectedCategory])

  return (
    <main className="min-h-screen pb-24 animate-fade-in">
      <div className="max-w-3xl mx-auto px-6 pt-10">
        {/* Editorial Journal Masthead */}
        <header className="space-y-4 pb-10 border-b border-light-subtle/15 dark:border-dark-subtle/15 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono tracking-wider uppercase border border-[#e6b450]/40 bg-[#e6b450]/10 text-[#e6b450]">
            <BookOpen size={12} />
            <span>Journal // Publications &amp; Essays</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-light-text dark:text-[#ffffff] tracking-tight">
            Writings &amp; Field Notes
          </h1>

          <p className="font-serif italic text-lg text-light-subtle dark:text-[#d9d7d3]/80 leading-relaxed">
            Long-form essays, architecture postmortems, and reflections on systems engineering, software craft, and distributed computing.
          </p>

          {/* Category Filters */}
          {categoryFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-4">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all duration-200 ${
                  selectedCategory === 'all'
                    ? 'bg-[#e6b450] text-[#0a0e14] font-semibold'
                    : 'border border-light-subtle/20 dark:border-dark-subtle/20 bg-light-background/60 dark:bg-[#131721]/70 text-light-text dark:text-dark-text hover:border-[#e6b450]/50'
                }`}
              >
                All Essays ({posts.length})
              </button>

              {categoryFilters.map((cat: any) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all duration-200 ${
                    selectedCategory === cat.id
                      ? 'bg-[#e6b450] text-[#0a0e14] font-semibold'
                      : 'border border-light-subtle/20 dark:border-dark-subtle/20 bg-light-background/60 dark:bg-[#131721]/70 text-light-text dark:text-dark-text hover:border-[#e6b450]/50'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </header>

        {/* Single-Column Editorial Essay List */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 font-mono text-sm text-light-subtle dark:text-dark-subtle">
            No essays found in this category.
          </div>
        ) : (
          <div className="space-y-12">
            {filteredPosts.map((post: any) => {
              const formattedDate = post.published_at || post.date
                ? new Date(post.published_at || post.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Recent'

              return (
                <article
                  key={post.id}
                  className="group pt-6 pb-8 border-b border-light-subtle/15 dark:border-[#1e2430] space-y-3 transition-colors"
                >
                  {/* Metadata line */}
                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-light-subtle dark:text-dark-subtle">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} className="text-[#e6b450]" />
                      {formattedDate}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {post.reading_time ? `${post.reading_time} min read` : '5 min read'}
                    </span>
                    {post.featured && (
                      <>
                        <span>•</span>
                        <span className="text-[#e6b450] font-medium flex items-center gap-1">
                          <Sparkles size={11} /> Featured
                        </span>
                      </>
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="font-serif text-2xl sm:text-3xl text-light-text dark:text-dark-text group-hover:text-[#e6b450] transition-colors font-medium leading-snug">
                    <Link to="/blog/$slug" params={{ slug: post.slug }}>
                      {post.title}
                    </Link>
                  </h2>

                  {/* Excerpt */}
                  {post.excerpt && (
                    <p className="text-sm sm:text-base leading-relaxed text-light-text/80 dark:text-[#d9d7d3]/85 font-sans">
                      {post.excerpt}
                    </p>
                  )}

                  {/* Footer Row: Read Count + Like Button + Read Link */}
                  <div className="pt-3 flex items-center justify-between text-xs font-mono text-light-subtle dark:text-dark-subtle">
                    <div className="flex items-center gap-4">
                      {post.read_count !== undefined && (
                        <span className="flex items-center gap-1 text-light-subtle dark:text-dark-subtle/80">
                          <Eye size={12} />
                          {post.read_count} reads
                        </span>
                      )}
                      <div className="flex items-center">
                        <LikeButton
                          blogId={post.id}
                          initialLikes={post.likes || 0}
                          iconSize={13}
                        />
                      </div>
                    </div>

                    <Link
                      to="/blog/$slug"
                      params={{ slug: post.slug }}
                      className="inline-flex items-center gap-1 text-light-accent dark:text-[#e6b450] font-medium hover:underline"
                    >
                      <span>Read Essay</span>
                      <ArrowUpRight size={13} />
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}

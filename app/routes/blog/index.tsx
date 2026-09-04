import { createFileRoute, Link } from '@tanstack/react-router'
import { blogService } from '@app/services/blogService'
import { LikeButton } from '@app/blog/components/LikeButton'
import { ArrowUpRight, Calendar, Clock, Eye, Sparkles } from 'lucide-react'
import * as React from 'react'

const fetchBlogData = async () => {
  try {
    const [posts, series] = await Promise.all([
      blogService.getPublishedPosts(),
      blogService.getAllSeries(),
    ])

    return {
      posts,
      allSeries: series,
    }
  } catch (error) {
    console.error('Error fetching blog data:', error)
    return {
      posts: [],
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
  const { posts } = Route.useLoaderData()

  return (
    <main className="min-h-screen pb-24 animate-fade-in">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10">
        {/* Editorial Journal Masthead */}
        <header className="space-y-3 sm:space-y-4 pb-8 sm:pb-10 border-b border-light-subtle/15 dark:border-dark-subtle/15 mb-8 sm:mb-10">
          <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl text-light-text dark:text-[#ffffff] tracking-tight">
            Writings &amp; Field Notes
          </h1>

          <p className="font-serif italic text-base sm:text-lg text-light-subtle dark:text-[#d9d7d3]/80 leading-relaxed">
            Long-form essays, architecture postmortems, and reflections on systems engineering, software craft, and distributed computing. Also tech, religion, life, love, and everything else. Primarily software though.
          </p>
        </header>

        {/* Single-Column Editorial Essay List */}
        {posts.length === 0 ? (
          <div className="text-center py-20 font-mono text-sm text-light-subtle dark:text-dark-subtle">
            No essays published yet.
          </div>
        ) : (
          <div className="space-y-10 sm:space-y-12">
            {posts.map((post: any) => {
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
                  className="group pt-5 sm:pt-6 pb-7 sm:pb-8 border-b border-light-subtle/15 dark:border-[#1e2430] space-y-3 transition-colors"
                >
                  {/* Metadata line */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono text-light-subtle dark:text-dark-subtle">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} className="text-[#e6b450]" />
                      {formattedDate}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {post.reading_time?.includes('min') ? post.reading_time : `${post.reading_time || '5'} min read`}
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
                  <h2 className="font-serif text-xl sm:text-2xl md:text-3xl text-light-text dark:text-dark-text group-hover:text-[#e6b450] transition-colors font-medium leading-snug">
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

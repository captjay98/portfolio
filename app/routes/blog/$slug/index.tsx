import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { MarkdownRenderer } from '@app/components/markdown-renderer'
import TableOfContents from '@app/blog/components/TableOfContents'
import SeriesNavigation from '@app/blog/components/SeriesNavigation'
import RelatedPosts from '@app/blog/components/RelatedPosts'
import BackToTopButton from '@app/blog/components/BackToTopButton'
import Comments from '@app/blog/components/Comments'
import { getImageSrc } from '@app/utils/imageUtils'
import { LikeButton } from '@app/blog/components/LikeButton'
import { ArrowLeft, Calendar, Clock, Tag, Share2, BookOpen } from 'lucide-react'
import { blogService } from '@app/services/blogService'
import { categoryService } from '@app/services/categoryService'
import { profileService } from '@app/services/profileService'
import * as React from 'react'

const fetchPostBySlug = async ({ data: slug }: { data: string }) => {
  try {
    const [post, categories, profile] = await Promise.all([
      blogService.getBlogBySlug(slug),
      categoryService.getCategories(),
      profileService.getProfile(),
    ])

    if (!post) {
      return null
    }

    // Get series data if post belongs to a series
    let seriesData = null
    let seriesPosts = []
    if (post.series_id) {
      const series = await blogService.getSeries(post.series_id)
      if (series) {
        seriesData = series
        seriesPosts = await blogService.getPostsInSeries(post.series_id)
      }
    }

    // Format categories for the component
    const categoryFilters = categories.map(cat => ({
      value: cat.id,
      label: cat.name,
    }))

    return {
      post,
      categoryFilters,
      author: profile,
      seriesData,
      seriesPosts,
    }
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
}

export const Route = createFileRoute('/blog/$slug/')({
  loader: ({ params }) => fetchPostBySlug({ data: params.slug }),
  component: BlogPost,
})

function BlogPost() {
  const data = Route.useLoaderData()

  if (!data) {
    throw notFound()
  }

  const { post, categoryFilters, author, seriesData, seriesPosts } = data as any

  const formattedDate = new Date(post.date || post.published_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <main className="min-h-screen pb-24 animate-fade-in">
      <BackToTopButton />

      <article className="max-w-3xl mx-auto px-6 pt-10">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            to="/blog"
            className="inline-flex items-center text-xs font-mono text-light-subtle dark:text-dark-subtle hover:text-[#e6b450] transition-colors"
          >
            <ArrowLeft size={14} className="mr-1.5" />
            <span>Journal Index</span>
          </Link>
        </div>

        {/* Article Header */}
        <header className="space-y-4 pb-8 border-b border-light-subtle/15 dark:border-dark-subtle/15 mb-8">
          {/* Metadata line */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-light-subtle dark:text-dark-subtle">
            <span className="flex items-center gap-1">
              <Calendar size={12} className="text-[#e6b450]" />
              {formattedDate}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {post.reading_time?.includes('min') ? post.reading_time : `${post.reading_time || '5'} min read`}
            </span>
            {post.read_count !== undefined && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <BookOpen size={12} />
                  {post.read_count} reads
                </span>
              </>
            )}
            <span>•</span>
            <LikeButton
              blogId={post.id}
              initialLikes={post.likes || 0}
              iconSize={13}
            />
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-light-text dark:text-[#ffffff] tracking-tight leading-[1.18] font-medium">
            {post.title}
          </h1>

          {/* Category Tags */}
          {post.category_ids && categoryFilters && (
            <div className="flex flex-wrap gap-2 pt-2">
              {categoryFilters.map((category: any) => (
                <span
                  key={category.value}
                  className="px-2.5 py-0.5 text-xs font-mono rounded bg-light-subtle/10 dark:bg-[#131721] text-light-subtle dark:text-[#d9d7d3] border border-light-subtle/15 dark:border-[#1e2430]"
                >
                  <Tag size={11} className="inline mr-1 text-[#e6b450]" />
                  {category.label}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Cover Image */}
        {post.cover_image && (
          <div className="relative w-full h-72 sm:h-96 mb-10 rounded-xl overflow-hidden border border-light-subtle/15 dark:border-[#1e2430]">
            <img
              src={getImageSrc(post.cover_image)}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Series Navigation if applicable */}
        {seriesData && seriesPosts.length > 0 && (
          <div className="mb-8">
            <SeriesNavigation
              seriesTitle={seriesData.title}
              seriesSlug={seriesData.slug}
              currentPostId={post.id}
              posts={seriesPosts}
            />
          </div>
        )}

        {/* Table of Contents */}
        {post.content && (
          <div className="mb-8 p-5 rounded-xl border border-light-subtle/15 dark:border-[#1e2430] bg-light-background/40 dark:bg-[#131721]/50">
            <TableOfContents content={post.content} />
          </div>
        )}

        {/* Article Prose Content with Authentic Ayu Dark Highlighting */}
        <div className="prose prose-neutral dark:prose-invert lg:prose-lg max-w-none font-serif leading-relaxed text-light-text/90 dark:text-[#d9d7d3]/95 mb-16">
          <MarkdownRenderer content={post.content} />
        </div>

        {/* Author Bio Colophon Box */}
        <section className="p-6 rounded-xl border border-light-subtle/15 dark:border-[#1e2430] bg-light-background/40 dark:bg-[#131721]/60 mb-12 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {author?.avatar && (
            <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-[#e6b450]/40">
              <img
                src={author.avatar}
                alt={author.full_name || 'Jamal Ibrahim'}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-medium text-light-text dark:text-dark-text">
              Written by {author?.full_name || 'Jamal Ibrahim Umar'}
            </h3>
            <p className="text-xs sm:text-sm text-light-subtle dark:text-[#949dab] leading-relaxed">
              {author?.bio_short || 'Software engineer crafting resilient distributed systems, developer tools, and thoughtful mobile and web applications.'}
            </p>
          </div>
        </section>

        {/* Comments Section */}
        <div className="mb-14">
          <Comments postId={post.id} postSlug={post.slug} />
        </div>

        {/* Related Posts */}
        <RelatedPosts
          currentPostId={post.id}
          relatedPostIds={post.related_post_ids}
          tags={post.tag_ids}
          categories={post.category_ids}
        />
      </article>
    </main>
  )
}

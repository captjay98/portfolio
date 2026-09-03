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

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <main className="min-h-screen max-h-screen overflow-y-auto pb-16">
      <BackToTopButton />

      <article className="w-full px-2 py-6 md:py-12 animate-fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <Link
                to="/blog"
                className="inline-flex items-center mb-8 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <ArrowLeft size={16} className="mr-2" />
                <span>Back to all posts</span>
              </Link>

              <div className="bg-glass rounded-xl shadow-elevated effect-3d overflow-hidden border border-light-subtle/10 dark:border-dark-subtle/20 mb-8">
                <div className="py-6 px-2 md:p-8">
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

                    <div className="flex flex-wrap gap-2 mb-6">
                      {post.category_ids &&
                        categoryFilters.map((category: any) => (
                          <Link
                            key={category.value}
                            to="/blog"
                            search={{ category: category.value }}
                            className="px-3 py-1 text-sm rounded-full bg-light-subtle/10 dark:bg-dark-subtle/10 text-light-text dark:text-dark-text hover:bg-light-subtle/20 dark:hover:bg-dark-subtle/20 transition-colors"
                          >
                            <Tag size={14} className="inline mr-1" />
                            {category.label}
                          </Link>
                        ))}
                    </div>
                  </header>

                  {post.cover_image && (
                    <div className="relative w-full h-80 md:h-96 mb-8 rounded-lg overflow-hidden">
                      <img
                        src={getImageSrc(post.cover_image)}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {seriesData && seriesPosts.length > 0 && (
                    <SeriesNavigation
                      seriesTitle={seriesData.title}
                      seriesSlug={seriesData.slug}
                      currentPostId={post.id}
                      posts={seriesPosts}
                    />
                  )}

                  <TableOfContents content={post.content} />

                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <MarkdownRenderer content={post.content} />
                  </div>

                  <div className="mt-8 pt-4 border-t border-light-subtle/10 dark:border-dark-subtle/10">
                    <div className="flex flex-wrap items-center">
                      <span className="text-light-text dark:text-dark-text mr-4 flex items-center">
                        <Share2 size={16} className="mr-2" />
                        Share this post:
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-glass rounded-xl shadow-elevated effect-3d overflow-hidden border border-light-subtle/10 dark:border-dark-subtle/20 p-6">
                <Comments postId={post.id} postSlug={post.slug} />
              </div>

              <RelatedPosts
                currentPostId={post.id}
                relatedPostIds={post.related_post_ids}
                tags={post.tag_ids}
                categories={post.category_ids}
              />
            </div>

            <aside className="lg:w-1/3 space-y-8">
              <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-lg p-6 border border-blue-100 dark:border-blue-900/30">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3">
                  About the Author
                </h3>
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                    <img
                      src={author?.avatar || '/avatar.jpg'}
                      alt={author?.nickname || 'Author'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200">
                      {author?.full_name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {author?.title || 'Software Engineer'}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {author?.bio_short ||
                    'Full-stack developer specialized in building modern web applications.'}
                </p>
              </div>

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
                        to="/blog/series/$slug"
                        params={{ slug: seriesData.slug }}
                        className="text-sm text-light-accent dark:text-dark-accent hover:underline"
                      >
                        View all posts in this series
                      </Link>
                    </div>

                    <div className="space-y-3">
                      {seriesPosts
                        .sort(
                          (a: any, b: any) =>
                            (a.series_position || 0) - (b.series_position || 0),
                        )
                        .map((seriesPost: any) => (
                          <div
                            key={seriesPost.id}
                            className={`p-2 rounded ${
                              seriesPost.id === post.id
                                ? 'bg-light-subtle/10 dark:bg-dark-subtle/10'
                                : ''
                            }`}
                          >
                            {seriesPost.id === post.id ? (
                              <div className="text-light-accent dark:text-dark-accent font-medium">
                                → {seriesPost.title}{' '}
                                <span className="text-xs">(current)</span>
                              </div>
                            ) : (
                              <Link
                                to="/blog/$slug"
                                params={{ slug: seriesPost.slug }}
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
            </aside>
          </div>
        </div>
      </article>
    </main>
  )
}

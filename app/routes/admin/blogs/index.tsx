import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, Star, BookOpen, Heart, Eye } from 'lucide-react'
import { getImageSrc } from '@app/utils/imageUtils'
import { blogService } from '@app/services/blogService'
import { categoryService } from '@app/services/categoryService'

export const Route = createFileRoute('/admin/blogs/')({
  component: AdminBlogs,
})

function AdminBlogs() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  // Fetch data on component mount
  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setIsLoading(true)
    try {
      const [postsData, categoriesData] = await Promise.all([
        blogService.getBlogs(),
        categoryService.getCategories(),
      ])

      setPosts(postsData)
      setCategories(categoriesData)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Get unique categories from blog posts
  const getUniqueBlogCategories = () => {
    const uniqueCategoryIds = new Set<string>()
    posts.forEach((post) => {
      post.category_ids?.forEach((catId: string) => uniqueCategoryIds.add(catId))
    })
    return categories.filter((cat) => uniqueCategoryIds.has(cat.id))
  }

  // Filter posts
  const filteredPosts = [...posts].filter((post) => {
    const matchesCategory = selectedCategory === "all" || post.category_ids?.includes(selectedCategory)
    const matchesSearch = searchTerm === "" || post.title.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return

    try {
      await blogService.deleteBlog(postId)
      setPosts(posts.filter(p => p.id !== postId))
    } catch (error) {
      console.error("Error deleting blog post:", error)
      alert("Failed to delete blog post")
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4 py-8">
        <div className="h-6 w-48 bg-light-subtle/10 dark:bg-[#131721] rounded animate-pulse" />
        <div className="h-64 w-full bg-white dark:bg-[#0a0e14] border border-light-border dark:border-[#1e2430] rounded-xl animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-light-border dark:border-[#1e2430]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-amber-500/10 dark:bg-[#e6b450]/15 text-amber-800 dark:text-[#e6b450] border border-amber-500/20">
              EDITORIAL
            </span>
            <span className="text-xs font-mono text-light-subtle dark:text-[#8a9199]">
              {posts.length} Essays
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-light-text dark:text-[#bfbdb6]">
            Blog Posts
          </h1>
          <p className="text-xs text-light-subtle dark:text-[#8a9199]">
            Draft, publish, and curate essays and architectural postmortems.
          </p>
        </div>

        <button
          onClick={() => navigate({ to: '/admin/blogs/new' as any })}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#e6b450] hover:bg-[#d48b00] text-black font-mono text-xs font-semibold rounded-lg tracking-wider transition-colors shadow-xs w-full sm:w-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>NEW ESSAY</span>
        </button>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-light-subtle dark:text-[#8a9199]" />
          <input
            type="search"
            placeholder="Search essays by title..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg bg-white dark:bg-[#0a0e14] border border-light-border dark:border-[#1e2430] text-light-text dark:text-[#bfbdb6] placeholder:text-light-subtle/50 focus:outline-none focus:border-[#e6b450] focus:ring-1 focus:ring-[#e6b450] transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category badges */}
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            className={`px-2.5 py-1 text-xs font-mono rounded-md border transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#e6b450]/15 text-amber-800 dark:text-[#e6b450] border-[#e6b450]/40 font-semibold'
                : 'bg-white dark:bg-[#0a0e14] text-light-subtle dark:text-[#8a9199] border-light-border dark:border-[#1e2430] hover:border-[#e6b450]/30'
            }`}
            onClick={() => setSelectedCategory('all')}
          >
            All ({posts.length})
          </button>
          {getUniqueBlogCategories().map((category: any) => (
            <button
              key={category.id}
              type="button"
              className={`px-2.5 py-1 text-xs font-mono rounded-md border transition-all ${
                selectedCategory === category.id
                  ? 'bg-[#e6b450]/15 text-amber-800 dark:text-[#e6b450] border-[#e6b450]/40 font-semibold'
                  : 'bg-white dark:bg-[#0a0e14] text-light-subtle dark:text-[#8a9199] border-light-border dark:border-[#1e2430] hover:border-[#e6b450]/30'
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name} ({posts.filter(p => p.category_ids?.includes(category.id)).length})
            </button>
          ))}
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white dark:bg-[#0a0e14] rounded-xl border border-light-border dark:border-[#1e2430] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-light-border dark:border-[#1e2430] bg-light-background/60 dark:bg-[#131721]/50">
                <th className="px-4 py-3 text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">
                  Essay
                </th>
                <th className="px-4 py-3 text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">
                  Categories
                </th>
                <th className="px-4 py-3 text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">
                  Engagement
                </th>
                <th className="px-4 py-3 text-right text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light-border/60 dark:divide-[#1e2430]/60">
              {filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-xs font-mono text-light-subtle dark:text-[#8a9199]">
                    No essays found matching criteria
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post: any) => (
                  <tr key={post.id} className="hover:bg-light-subtle/5 dark:hover:bg-[#131721]/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        {post.cover_image && (
                          <div className="h-10 w-10 rounded border border-light-border dark:border-[#1e2430] overflow-hidden shrink-0">
                            <img
                              src={getImageSrc(post.cover_image)}
                              alt={post.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-semibold text-xs text-light-text dark:text-[#bfbdb6] truncate max-w-sm">
                            {post.title}
                          </div>
                          <div className="text-[11px] text-light-subtle dark:text-[#8a9199] truncate max-w-sm">
                            {post.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {post.category_ids?.slice(0, 2).map((catId: string) => {
                          const cat = categories.find(c => c.id === catId)
                          return cat ? (
                            <span key={catId} className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-light-subtle/10 dark:bg-[#131721] text-light-subtle dark:text-[#8a9199] border border-light-border dark:border-[#1e2430]">
                              {cat.name}
                            </span>
                          ) : null
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      {post.status === "published" ? (
                        <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-mono rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                          PUBLISHED
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-mono rounded bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-[#e6b450]">
                          DRAFT
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3 text-xs font-mono text-light-subtle dark:text-[#8a9199]">
                        <span className="inline-flex items-center gap-1">
                          <Heart size={11} className="text-rose-500" />
                          <span>{post.likes || 0}</span>
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <BookOpen size={11} className="text-blue-500" />
                          <span>{post.read_count || 0}</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center gap-1.5 justify-end">
                        {post.featured && <Star className="h-3 w-3 text-amber-500 fill-amber-500" />}
                        <a
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          title="View on site"
                          className="p-1.5 rounded text-light-subtle dark:text-[#8a9199] hover:text-light-text dark:hover:text-[#bfbdb6] transition-colors"
                        >
                          <Eye size={13} />
                        </a>
                        <button
                          onClick={() => navigate({ to: `/admin/blogs/edit/${post.id}` as any })}
                          className="p-1.5 rounded text-light-subtle dark:text-[#8a9199] hover:text-amber-700 dark:hover:text-[#e6b450] transition-colors"
                          title="Edit"
                        >
                          <Edit size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-1.5 rounded text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

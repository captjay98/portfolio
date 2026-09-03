import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, Star, Calendar, BookOpen, Heart, MoreHorizontal, ChevronDown } from 'lucide-react'
import { getImageSrc } from '@app/utils/imageUtils'
import { blogService } from '@app/services/blogService'
import { categoryService } from '@app/services/categoryService'

export const Route = createFileRoute('/admin/blogs/')({
  component: AdminBlogs,
})

function AdminBlogs() {
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
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
          <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Blog Posts</h2>
        <button
          onClick={() => window.location.href = '/admin/blogs/new'}
          className="flex items-center px-4 py-2 bg-accent-gradient text-white rounded-lg hover:shadow-accent transition-all hover:scale-105"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Post
        </button>
      </div>

      {/* Search field */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-light-subtle dark:text-dark-subtle" />
        <input
          type="search"
          placeholder="Search posts..."
          className="pl-10 w-full md:w-96 px-4 py-2 bg-glass rounded-lg border border-light-subtle/20 dark:border-dark-subtle/20 focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Category badges */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span
          className={`px-3 py-1 text-sm rounded-full transition-all ${
            selectedCategory === 'all'
              ? 'bg-accent-gradient text-white shadow-accent'
              : 'bg-glass border border-light-subtle/20 dark:border-dark-subtle/20 text-light-text dark:text-dark-text hover:bg-light-subtle/20 dark:hover:bg-dark-subtle/20 cursor-pointer'
          }`}
          onClick={() => setSelectedCategory('all')}
        >
          All ({posts.length})
        </span>
        {getUniqueBlogCategories().map((category: any) => (
          <span
            key={category.id}
            className={`px-3 py-1 text-sm rounded-full transition-all ${
              selectedCategory === category.id
                ? 'bg-accent-gradient text-white shadow-accent'
                : 'bg-glass border border-light-subtle/20 dark:border-dark-subtle/20 text-light-text dark:text-dark-text hover:bg-light-subtle/20 dark:hover:bg-dark-subtle/20 cursor-pointer'
            }`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name} ({posts.filter(p => p.category_ids?.includes(category.id)).length})
          </span>
        ))}
      </div>

      {/* Posts table */}
      <div className="bg-glass rounded-xl shadow-elevated border border-light-subtle/10 dark:border-dark-subtle/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-light-subtle/20 dark:border-dark-subtle/20">
                <th className="px-4 py-3 text-left text-sm font-semibold text-light-text dark:text-dark-text">
                  Post
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-light-text dark:text-dark-text">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-light-text dark:text-dark-text">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-light-text dark:text-dark-text">
                  Stats
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-light-text dark:text-dark-text">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-light-subtle dark:text-dark-subtle">
                    No posts found
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post: any) => (
                  <tr key={post.id} className="border-b border-light-subtle/20 dark:border-dark-subtle/20 hover:bg-light-subtle/50 dark:hover:bg-dark-subtle/5">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {post.cover_image && (
                          <div className="h-12 w-12 rounded overflow-hidden flex-shrink-0">
                            <img
                              src={getImageSrc(post.cover_image)}
                              alt={post.title}
                              className="h-full w-full object-cover rounded"
                            />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-sm">{post.title}</div>
                          <div className="text-xs text-light-subtle dark:text-dark-subtle">
                            {post.excerpt?.substring(0, 60)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {post.category_ids?.slice(0, 2).map((catId: string) => {
                          const cat = categories.find(c => c.id === catId)
                          return cat ? (
                            <span key={catId} className="px-2 py-1 text-xs rounded-full bg-light-subtle/10 dark:bg-dark-subtle/10 text-light-text dark:text-dark-text">
                              {cat.name}
                            </span>
                          ) : null
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {post.status === "published" ? (
                        <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900 text-green-800">
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-xs text-light-subtle dark:text-dark-subtle">
                        <Heart size={12} className="text-rose-500" />
                        <span>{post.likes || 0}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-xs text-light-subtle dark:text-dark-subtle">
                        <BookOpen size={12} className="text-blue-500" />
                        <span>{post.read_count || 0}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        {post.featured && <Star className="h-3 w-3 text-yellow-500" />}
                        <button
                          onClick={() => window.location.href = `/admin/blogs/edit/${post.id}`}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:text-blue-800"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-2 text-red-600 dark:text-red-400 hover:text-red-800"
                        >
                          <Trash2 size={14} />
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

      {/* Delete Confirmation Dialog */}
      <div>
        <input type="hidden" />
      </div>
    </div>
  )
}

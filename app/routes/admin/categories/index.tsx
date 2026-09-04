import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2 } from 'lucide-react'
import { categoryService } from '@app/services/categoryService'

export const Route = createFileRoute('/admin/categories/')({
  component: AdminCategories,
})

function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false)
  const [deletingCategory, setDeletingCategory] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch data on component mount
  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setIsLoading(true)
    try {
      const categoriesData = await categoryService.getCategories()
      setCategories(categoriesData)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Filter categories
  const filteredCategories = [...categories].filter((category: any) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      category.name.toLowerCase().includes(searchLower) ||
      category.description?.toLowerCase().includes(searchLower)
    )
  })

  // Handle delete
  const handleDelete = async () => {
    if (!deletingCategory) return

    try {
      await categoryService.deleteCategory(deletingCategory.id)
      setCategories(categories.filter(c => c.id !== deletingCategory.id))
      setIsDeleteDialogOpen(false)
      setDeletingCategory(null)
    } catch (error) {
      console.error("Error deleting category:", error)
      alert("Failed to delete category")
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
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-purple-500/10 dark:bg-purple-500/15 text-purple-800 dark:text-purple-400 border border-purple-500/20">
              TAXONOMY
            </span>
            <span className="text-xs font-mono text-light-subtle dark:text-[#8a9199]">
              {categories.length} Categories
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-light-text dark:text-[#bfbdb6]">
            Taxonomies &amp; Categories
          </h1>
          <p className="text-xs text-light-subtle dark:text-[#8a9199]">
            Organize engineering domains, topics, and classification labels.
          </p>
        </div>

        <button
          onClick={() => { setEditingCategory(null); setIsCategoryFormOpen(true) }}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#e6b450] hover:bg-[#d48b00] text-black font-mono text-xs font-semibold rounded-lg tracking-wider transition-colors shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>NEW CATEGORY</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative w-full md:w-80">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-light-subtle dark:text-[#8a9199]" />
        <input
          type="search"
          placeholder="Search categories..."
          className="w-full pl-9 pr-4 py-2 text-xs rounded-lg bg-white dark:bg-[#0a0e14] border border-light-border dark:border-[#1e2430] text-light-text dark:text-[#bfbdb6] placeholder:text-light-subtle/50 focus:outline-none focus:border-[#e6b450] focus:ring-1 focus:ring-[#e6b450] transition-colors"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Categories Table */}
      <div className="bg-white dark:bg-[#0a0e14] rounded-xl border border-light-border dark:border-[#1e2430] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-light-border dark:border-[#1e2430] bg-light-background/60 dark:bg-[#131721]/50">
                <th className="px-4 py-3 text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">
                  Category
                </th>
                <th className="px-4 py-3 text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">
                  Description
                </th>
                <th className="px-4 py-3 text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">
                  Color
                </th>
                <th className="px-4 py-3 text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">
                  Projects
                </th>
                <th className="px-4 py-3 text-right text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light-border/60 dark:divide-[#1e2430]/60">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-xs font-mono text-light-subtle dark:text-[#8a9199]">
                    No categories found matching criteria
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category: any) => (
                  <tr key={category.id} className="hover:bg-light-subtle/5 dark:hover:bg-[#131721]/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        {category.color && (
                          <div
                            className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                            style={{ backgroundColor: category.color }}
                          />
                        )}
                        <span className="font-semibold text-xs text-light-text dark:text-[#bfbdb6]">
                          {category.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-light-subtle dark:text-[#8a9199] max-w-xs truncate">
                      {category.description || "—"}
                    </td>
                    <td className="px-4 py-3.5 text-xs font-mono text-light-subtle dark:text-[#8a9199]">
                      {category.color || "None"}
                    </td>
                    <td className="px-4 py-3.5 text-xs font-mono text-light-subtle dark:text-[#8a9199]">
                      {category.project_count || 0}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center gap-1.5 justify-end">
                        <button
                          onClick={() => {
                            setEditingCategory(category)
                            setIsCategoryFormOpen(true)
                          }}
                          className="p-1.5 rounded text-light-subtle dark:text-[#8a9199] hover:text-amber-700 dark:hover:text-[#e6b450] transition-colors"
                          title="Edit"
                        >
                          <Edit size={13} />
                        </button>
                        <button
                          onClick={() => {
                            setDeletingCategory(category)
                            setIsDeleteDialogOpen(true)
                          }}
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

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && deletingCategory && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#0a0e14] rounded-2xl p-6 max-w-md w-full border border-light-border dark:border-[#1e2430] shadow-xl space-y-4">
            <h3 className="text-base font-bold text-light-text dark:text-[#bfbdb6]">
              Delete Category
            </h3>
            <p className="text-xs text-light-subtle dark:text-[#8a9199] leading-relaxed">
              Are you sure you want to delete <strong className="text-light-text dark:text-[#bfbdb6]">{deletingCategory.name}</strong>? This action will remove the category taxonomy.
            </p>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteDialogOpen(false)
                  setDeletingCategory(null)
                }}
                className="px-3 py-1.5 rounded-lg border border-light-border dark:border-[#1e2430] text-xs font-mono text-light-subtle dark:text-[#8a9199] hover:bg-light-subtle/10 dark:hover:bg-[#131721] transition-colors"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-mono font-semibold transition-colors"
              >
                DELETE CATEGORY
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

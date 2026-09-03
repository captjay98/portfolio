import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, MoreHorizontal } from 'lucide-react'
import { categoryService } from '@app/services/categoryService'
import { getImageSrc } from '@app/utils/imageUtils'

export const Route = createFileRoute('/admin/categories/')({
  component: AdminCategories,
})

function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false)
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null)
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
    if (!editingCategory) return

    try {
      await categoryService.deleteCategory(editingCategory.id)
      setCategories(categories.filter(c => c.id !== editingCategory.id))
      setIsDeleteDialogOpen(false)
      setEditingCategory(null)
    } catch (error) {
      console.error("Error deleting category:", error)
      alert("Failed to delete category")
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
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
        <button
          onClick={() => { setEditingCategory(null); setIsCategoryFormOpen(true) }}
          className="flex items-center px-4 py-2 bg-accent-gradient text-white rounded-lg hover:shadow-accent transition-all hover:scale-105"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Category
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-light-subtle dark:text-dark-subtle" />
        <input
          type="search"
          placeholder="Search categories..."
          className="pl-10 w-full md:w-96 px-4 py-2 bg-glass rounded-lg border border-light-subtle/20 dark:border-dark-subtle/20 focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Categories Table */}
      <div className="bg-glass rounded-xl shadow-elevated border border-light-subtle/10 dark:border-dark-subtle/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-light-subtle/20 dark:border-dark-subtle/20">
                <th className="px-4 py-3 text-left text-sm font-semibold text-light-text dark:text-dark-text">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-light-text dark:text-dark-text">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-light-text dark:text-dark-text">
                  Color
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-light-text dark:text-dark-text">
                  Projects Count
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-light-text dark:text-dark-text">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-light-subtle dark:text-dark-subtle">
                    No categories found
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category: any) => (
                  <tr key={category.id} className="border-b border-light-subtle/20 dark:border-dark-subtle/20 hover:bg-light-subtle/50 dark:hover:bg-dark-subtle/5">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {category.color && (
                          <div
                            className="w-8 h-8 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                        )}
                        <div>
                          <div className="font-medium text-sm">{category.name}</div>
                          <div className="text-xs text-light-subtle dark:text-dark-subtle">
                            {category.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-xs text-light-subtle dark:text-dark-subtle">
                        {category.description || "No description"}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="w-8 h-8 rounded-full" style={{ backgroundColor: category.color || '#ccc' }}></div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      {category.project_count || 0}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => {
                            setEditingCategory(category)
                            setIsCategoryFormOpen(true)
                          }}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:text-blue-800"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setDeletingCategoryId(category.id)
                            setIsDeleteDialogOpen(true)
                          }}
                          className="p-2 text-red-600 dark:text-red-400 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
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

      {/* Edit Category Dialog */}
      {isCategoryFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4 shadow-xl animate-fade-in">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {editingCategory ? "Edit Category" : "New Category"}
            </h3>
            <div className="flex justify-between mt-6">
              <button
                onClick={() => {
                  setIsCategoryFormOpen(false)
                  setEditingCategory(null)
                }}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-800"
              >
                Cancel
              </button>
              <div className="flex gap-3">
                <button
                  onClick={async () => {
                    // This would require the CategoryForm component
                    if (editingCategory) {
                      // Update logic here
                      console.log("Update category:", editingCategory)
                    } else {
                      console.log("Create new category")
                    }
                    setIsCategoryFormOpen(false)
                    setEditingCategory(null)
                  }}
                  className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && deletingCategoryId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4 shadow-xl animate-fade-in">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Delete Category
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Are you sure you want to delete this category? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsDeleteDialogOpen(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 dark:hover:bg-red-900"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

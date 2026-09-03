import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, Star } from 'lucide-react'
import { projectService } from '@app/services/projectService'
import { categoryService } from '@app/services/categoryService'
import { technologyService } from '@app/services/technologyService'
import { getImageSrc } from '@app/utils/imageUtils'

export const Route = createFileRoute('/admin/projects/')({
  component: AdminProjects,
})

function AdminProjects() {
  const [projects, setProjects] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null)

  // Fetch data on component mount
  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setIsLoading(true)
    try {
      const [projectsData, categoriesData] = await Promise.all([
        projectService.getProjectsWithDetails(),
        categoryService.getCategories(),
      ])

      setProjects(projectsData)
      setCategories(categoriesData)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Get unique project categories
  const getUniqueProjectCategories = () => {
    const uniqueCategoryIds = new Set<string>()
    projects.forEach((project) => {
      project.categories?.forEach((cat: any) => uniqueCategoryIds.add(cat.id))
    })
    return categories.filter((cat) => uniqueCategoryIds.has(cat.id))
  }

  // Filter projects
  const filteredProjects = [...projects].filter((project: any) => {
    const matchesCategory = selectedCategory === "all" || project.categories?.some((cat: any) => cat.id === selectedCategory)
    const matchesSearch = searchTerm === "" || project.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Handle delete
  const handleDelete = async () => {
    if (!deletingProjectId) return

    try {
      await projectService.deleteProject(deletingProjectId)
      setProjects(projects.filter(p => p.id !== deletingProjectId))
      setIsDeleteDialogOpen(false)
      setDeletingProjectId(null)
    } catch (error) {
      console.error("Error deleting project:", error)
      alert("Failed to delete project")
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
        <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
        <button
          onClick={() => (window.location.href = "/admin/projects/new")}
          className="flex items-center px-4 py-2 bg-accent-gradient text-white rounded-lg hover:shadow-accent transition-all hover:scale-105"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-light-subtle dark:text-dark-subtle" />
        <input
          type="search"
          placeholder="Search projects..."
          className="pl-10 w-full md:w-96 px-4 py-2 bg-glass rounded-lg border border-light-subtle/20 dark:border-dark-subtle/20 focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div
          className={`px-3 py-1 text-sm rounded-full transition-all ${
            selectedCategory === 'all'
              ? 'bg-accent-gradient text-white shadow-accent'
              : 'bg-glass border border-light-subtle/20 dark:border-dark-subtle/20 text-light-text dark:text-dark-text hover:bg-light-subtle/20 dark:hover:bg-dark-subtle/20 cursor-pointer'
          }`}
          onClick={() => setSelectedCategory('all')}
        >
          All ({filteredProjects.length})
        </div>
        {getUniqueProjectCategories().map((category: any) => (
          <div
            key={category.id}
            className={`px-3 py-1 text-sm rounded-full transition-all ${
              selectedCategory === category.id
                ? 'bg-accent-gradient text-white shadow-accent'
                : 'bg-glass border border-light-subtle/20 dark:border-dark-subtle/20 text-light-text dark:text-dark-text hover:bg-light-subtle/20 dark:hover:bg-dark-subtle/20 cursor-pointer'
            }`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </div>
        ))}
      </div>

      {/* Projects Table */}
      <div className="bg-glass rounded-xl shadow-elevated border border-light-subtle/10 dark:border-dark-subtle/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-light-subtle/20 dark:border-dark-subtle/20">
                <th className="px-4 py-3 text-left text-sm font-semibold text-light-text dark:text-dark-text">
                  Project
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-light-text dark:text-dark-text">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-light-text dark:text-dark-text">
                  Technologies
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-light-text dark:text-dark-text">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-light-text dark:text-dark-text">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-light-subtle dark:text-dark-subtle">
                    No projects found
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project: any) => (
                  <tr key={project.id} className="border-b border-light-subtle/20 dark:border-dark-subtle/20">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {project.image && (
                          <div className="h-12 w-12 rounded overflow-hidden flex-shrink-0 relative">
                            <img
                              src={getImageSrc(project.image)}
                              alt={project.name}
                              className="h-full w-full object-cover rounded"
                            />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-sm">{project.name}</div>
                          <div className="text-xs text-light-subtle dark:text-dark-subtle line-clamp-1">
                            {project.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {project.categories?.map((cat: any) => (
                          <span key={cat.id} className="px-2 py-1 text-xs rounded-full bg-light-subtle/10 dark:bg-dark-subtle/10 text-light-text dark:text-dark-text">
                            {cat.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {project.technologies?.slice(0, 3).map((tech: any) => (
                          <span key={tech.id} className="px-2 py-1 text-xs rounded-full bg-light-subtle/10 dark:bg-dark-subtle/10 text-light-text dark:text-dark-text">
                            {tech.name}
                          </span>
                        ))}
                        {project.technologies && project.technologies.length > 3 && (
                          <span className="px-2 py-1 text-xs rounded-full bg-light-subtle/10 dark:bg-dark-subtle/10 text-light-text dark:text-dark-text">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {project.featured ? (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        </div>
                      ) : null}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-4 justify-end">
                        <button
                          onClick={() => (window.location.href = `/admin/projects/${project.id}`)}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:text-blue-800"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setDeletingProjectId(project.id)
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

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4 shadow-xl animate-fade-in">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Delete Project
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Are you sure you want to delete the project "{deletingProjectId}"? This action cannot be undone.
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

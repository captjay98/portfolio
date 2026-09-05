import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, Star, ExternalLink, Archive, ArchiveRestore } from 'lucide-react'
import { projectService } from '@app/services/projectService'
import { categoryService } from '@app/services/categoryService'
import { getImageSrc } from '@app/utils/imageUtils'

export const Route = createFileRoute('/projects/')({
  component: AdminProjects,
})

function AdminProjects() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "archived">("all")
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingProject, setDeletingProject] = useState<any | null>(null)

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

  // Handle archive toggle
  const handleToggleArchive = async (project: any) => {
    try {
      const nextArchived = !project.is_archived
      await projectService.archiveProject(project.id, nextArchived)
      setProjects(projects.map(p => p.id === project.id ? { ...p, is_archived: nextArchived, featured: nextArchived ? false : p.featured } : p))
    } catch (error) {
      console.error("Error toggling archive status:", error)
      alert("Failed to update project archive status")
    }
  }

  // Filter projects
  const filteredProjects = [...projects].filter((project: any) => {
    const matchesCategory = selectedCategory === "all" || project.categories?.some((cat: any) => cat.id === selectedCategory)
    const matchesSearch = searchTerm === "" || project.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || (statusFilter === "active" ? !project.is_archived : project.is_archived)
    return matchesCategory && matchesSearch && matchesStatus
  })

  // Handle delete
  const handleDelete = async () => {
    if (!deletingProject) return

    try {
      await projectService.deleteProject(deletingProject.id)
      setProjects(projects.filter(p => p.id !== deletingProject.id))
      setIsDeleteDialogOpen(false)
      setDeletingProject(null)
    } catch (error) {
      console.error("Error deleting project:", error)
      alert("Failed to delete project")
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
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-cyan-500/10 dark:bg-[#39bae6]/15 text-cyan-800 dark:text-[#39bae6] border border-cyan-500/20">
              SYSTEM PORTFOLIO
            </span>
            <span className="text-xs font-mono text-light-subtle dark:text-[#8a9199]">
              {projects.length} Systems
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-light-text dark:text-[#bfbdb6]">
            Engineered Projects
          </h1>
          <p className="text-xs text-light-subtle dark:text-[#8a9199]">
            Manage production software, edge infrastructure demos, and architectural specs.
          </p>
        </div>

        <button
          onClick={() => navigate({ to: '/admin/projects/new' as any })}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#e6b450] hover:bg-[#d48b00] text-black font-mono text-xs font-semibold rounded-lg tracking-wider transition-colors shadow-xs w-full sm:w-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>NEW PROJECT</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-light-subtle dark:text-[#8a9199]" />
            <input
              type="search"
              placeholder="Search projects..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg bg-white dark:bg-[#0a0e14] border border-light-border dark:border-[#1e2430] text-light-text dark:text-[#bfbdb6] placeholder:text-light-subtle/50 focus:outline-none focus:border-[#e6b450] focus:ring-1 focus:ring-[#e6b450] transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status filter tabs */}
          <div className="inline-flex rounded-lg border border-light-border dark:border-[#1e2430] bg-light-background/60 dark:bg-[#131721]/60 p-1 text-xs font-mono">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1 rounded-md transition-colors ${
                statusFilter === "all"
                  ? "bg-white dark:bg-[#0a0e14] text-light-text dark:text-[#bfbdb6] font-semibold shadow-xs"
                  : "text-light-subtle dark:text-[#8a9199] hover:text-light-text dark:hover:text-[#bfbdb6]"
              }`}
            >
              All ({projects.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("active")}
              className={`px-3 py-1 rounded-md transition-colors ${
                statusFilter === "active"
                  ? "bg-white dark:bg-[#0a0e14] text-emerald-800 dark:text-emerald-400 font-semibold shadow-xs"
                  : "text-light-subtle dark:text-[#8a9199] hover:text-light-text dark:hover:text-[#bfbdb6]"
              }`}
            >
              Active ({projects.filter(p => !p.is_archived).length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("archived")}
              className={`px-3 py-1 rounded-md transition-colors ${
                statusFilter === "archived"
                  ? "bg-white dark:bg-[#0a0e14] text-amber-800 dark:text-[#e6b450] font-semibold shadow-xs"
                  : "text-light-subtle dark:text-[#8a9199] hover:text-light-text dark:hover:text-[#bfbdb6]"
              }`}
            >
              Archived ({projects.filter(p => p.is_archived).length})
            </button>
          </div>
        </div>

        {/* Category badges */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[10px] font-mono text-light-subtle dark:text-[#8a9199] uppercase tracking-wider mr-1">
            Category:
          </span>
          <button
            type="button"
            className={`px-2.5 py-1 text-xs font-mono rounded-md border transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#e6b450]/15 text-amber-800 dark:text-[#e6b450] border-[#e6b450]/40 font-semibold'
                : 'bg-white dark:bg-[#0a0e14] text-light-subtle dark:text-[#8a9199] border-light-border dark:border-[#1e2430] hover:border-[#e6b450]/30'
            }`}
            onClick={() => setSelectedCategory('all')}
          >
            All
          </button>
          {getUniqueProjectCategories().map((category: any) => (
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
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white dark:bg-[#0a0e14] rounded-xl border border-light-border dark:border-[#1e2430] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-light-border dark:border-[#1e2430] bg-light-background/60 dark:bg-[#131721]/50">
                <th className="px-4 py-3 text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">
                  Project
                </th>
                <th className="px-4 py-3 text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">
                  Domain
                </th>
                <th className="px-4 py-3 text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">
                  Stack
                </th>
                <th className="px-4 py-3 text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">
                  Highlight
                </th>
                <th className="px-4 py-3 text-right text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light-border/60 dark:divide-[#1e2430]/60">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-xs font-mono text-light-subtle dark:text-[#8a9199]">
                    No projects found matching criteria
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project: any) => (
                  <tr key={project.id} className="hover:bg-light-subtle/5 dark:hover:bg-[#131721]/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        {project.image && (
                          <div className="h-10 w-10 rounded border border-light-border dark:border-[#1e2430] overflow-hidden shrink-0">
                            <img
                              src={getImageSrc(project.image)}
                              alt={project.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-semibold text-xs text-light-text dark:text-[#bfbdb6] truncate max-w-xs">
                            {project.name}
                          </div>
                          <div className="text-[11px] text-light-subtle dark:text-[#8a9199] truncate max-w-xs">
                            {project.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {project.categories?.map((cat: any) => (
                          <span key={cat.id} className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-light-subtle/10 dark:bg-[#131721] text-light-subtle dark:text-[#8a9199] border border-light-border dark:border-[#1e2430]">
                            {cat.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {project.technologies?.slice(0, 3).map((tech: any) => (
                          <span key={tech.id} className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-cyan-500/10 dark:bg-[#39bae6]/10 text-cyan-800 dark:text-[#39bae6] border border-cyan-500/20">
                            {tech.name}
                          </span>
                        ))}
                        {project.technologies && project.technologies.length > 3 && (
                          <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-light-subtle/10 dark:bg-[#131721] text-light-subtle dark:text-[#8a9199]">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col gap-1 items-start">
                        {project.is_archived ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono rounded bg-light-subtle/10 border border-light-border dark:border-[#1e2430] text-light-subtle dark:text-[#8a9199]">
                            <Archive className="h-2.5 w-2.5" />
                            <span>ARCHIVED</span>
                          </span>
                        ) : project.featured ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono rounded bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-[#e6b450]">
                            <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
                            <span>FEATURED</span>
                          </span>
                        ) : (
                          <span className="text-[11px] font-mono text-light-subtle dark:text-[#8a9199]">
                            Standard
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center gap-1.5 justify-end">
                        <button
                          onClick={() => handleToggleArchive(project)}
                          className={`p-1.5 rounded transition-colors ${
                            project.is_archived
                              ? "text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10"
                              : "text-light-subtle dark:text-[#8a9199] hover:text-amber-700 dark:hover:text-[#e6b450] hover:bg-amber-500/10"
                          }`}
                          title={project.is_archived ? "Restore to Active" : "Archive Project"}
                        >
                          {project.is_archived ? <ArchiveRestore size={13} /> : <Archive size={13} />}
                        </button>
                        <button
                          onClick={() => navigate({ to: `/admin/projects/${project.id}` as any })}
                          className="p-1.5 rounded text-light-subtle dark:text-[#8a9199] hover:text-amber-700 dark:hover:text-[#e6b450] transition-colors"
                          title="Edit"
                        >
                          <Edit size={13} />
                        </button>
                        <button
                          onClick={() => {
                            setDeletingProject(project)
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
      {isDeleteDialogOpen && deletingProject && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#0a0e14] rounded-2xl p-6 max-w-md w-full border border-light-border dark:border-[#1e2430] shadow-xl space-y-4">
            <h3 className="text-base font-bold text-light-text dark:text-[#bfbdb6]">
              Confirm Project Removal
            </h3>
            <p className="text-xs text-light-subtle dark:text-[#8a9199] leading-relaxed">
              Are you sure you want to delete <strong className="text-light-text dark:text-[#bfbdb6]">{deletingProject.name}</strong>? This action will permanently remove the record from Cloudflare D1.
            </p>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteDialogOpen(false)
                  setDeletingProject(null)
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
                DELETE RECORD
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

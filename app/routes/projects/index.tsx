import { createFileRoute } from '@tanstack/react-router'
import ProjectsPage from '@app/projects/components/ProjectPage'
import { projectService } from '@app/services/projectService'
import { categoryService } from '@app/services/categoryService'
import * as React from 'react'

const fetchProjectsData = async () => {
  try {
    const [projects, categories] = await Promise.all([
      projectService.getProjectsWithDetails(),
      categoryService.getCategories(),
    ])

    // Filter categories to only those belonging to projects
    const projectCategoryMap = new Map<string, string>()
    projects.forEach((p: any) => {
      (p.categories || []).forEach((c: any) => {
        if (c && c.id && c.name) {
          projectCategoryMap.set(c.id, c.name)
        }
      })
    })

    const disciplinePriority: Record<string, number> = {
      'frontend development': 10,
      'backend development': 20,
      'mobile development': 30,
      'autonomous agents': 40,
      'devops': 50,
      'database': 60,
      'agritech & ai': 100,
      'enterprise mobile': 110,
      'security & patrol': 120,
      'public safety': 130,
      'commerce & logistics': 140,
      'agri-commodity supply': 150,
    }

    const sortedProjectCategories = Array.from(projectCategoryMap.entries()).sort((a, b) => {
      const aPriority = disciplinePriority[a[1].toLowerCase()] ?? 200
      const bPriority = disciplinePriority[b[1].toLowerCase()] ?? 200
      if (aPriority !== bPriority) return aPriority - bPriority
      return a[1].localeCompare(b[1])
    })

    const formattedCategories = [
      { value: 'all', label: 'All Projects' },
      { value: 'featured', label: 'Featured' },
      ...sortedProjectCategories.map(([id, name]) => ({
        value: id,
        label: name,
      })),
    ]

    return {
      enrichedProjects: projects,
      formattedCategories,
    }
  } catch (error) {
    console.error('Error fetching projects data:', error)
    return {
      enrichedProjects: [],
      formattedCategories: [],
    }
  }
}

export const Route = createFileRoute('/projects/')({
  loader: async () => {
    return fetchProjectsData()
  },
  component: Projects,
})

function Projects() {
  const { enrichedProjects, formattedCategories } = Route.useLoaderData()

  return (
    <ProjectsPage
      initialProjects={enrichedProjects}
      categories={formattedCategories}
    />
  )
}

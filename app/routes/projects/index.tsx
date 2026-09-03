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

    // Format categories for the component
    const formattedCategories = [
      { value: 'all', label: 'All Projects' },
      { value: 'featured', label: 'Featured' },
      ...categories.map(cat => ({
        value: cat.id,
        label: cat.name,
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

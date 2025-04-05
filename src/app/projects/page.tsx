import { Metadata } from "next";
import { Suspense } from "react";
import { projectService } from "@/services/projectService";
import { categoryService } from "@/services/categoryService";
import { technologyService } from "@/services/technologyService";
import ProjectsPage from "./components/ProjectPage";
import ProjectsLoading from "./loading";

export const metadata: Metadata = {
  title: "Projects",
  description: "My Portfolio of Software Engineering Products",
};

export default async function Projects() {
  // Fetch all projects, categories, and technologies
  const [projects, allCategories, allTechnologies] = await Promise.all([
    projectService.getProjects(),
    categoryService.getCategories(),
    technologyService.getTechnologies(),
  ]);

  // Extract unique category IDs used in projects
  const usedCategoryIds = new Set<string>();
  projects.forEach((project) => {
    if (Array.isArray(project.category_ids)) {
      project.category_ids.forEach((id) => usedCategoryIds.add(id));
    } else if (project.category_ids) {
      usedCategoryIds.add(project.category_ids);
    }
  });

  // Filter categories to only include those used in projects
  const usedCategories = allCategories.filter((category) =>
    usedCategoryIds.has(category.id),
  );

  // Create category options including "all" and "featured"
  const formattedCategories = [
    { value: "all", label: "All Projects" },
    { value: "featured", label: "Featured" },
    ...usedCategories.map((category) => ({
      value: category.id,
      label: category.name,
    })),
  ];

  // Create a map of technology IDs to names
  const technologyMap = allTechnologies.reduce(
    (map, tech) => {
      map[tech.id] = tech.name;
      return map;
    },
    {} as Record<string, string>,
  );

  // Enrich projects with technology names
  const enrichedProjects = projects.map((project) => {
    // Convert technology IDs to names
    const technologyNames = Array.isArray(project.technology_ids)
      ? project.technology_ids.map((techId) => technologyMap[techId] || techId)
      : [];

    return {
      ...project,
      technologies: technologyNames,
    };
  });

  return (
    <Suspense fallback={<ProjectsLoading />}>
      <ProjectsPage
        initialProjects={enrichedProjects}
        categories={formattedCategories}
      />
    </Suspense>
  );
}

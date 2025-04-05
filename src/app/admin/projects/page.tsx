"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  MoreHorizontal,
  Star,
  StarOff,
} from "lucide-react";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";

// Import services and types
import { projectService } from "@/services/projectService";
import { categoryService } from "@/services/categoryService";
import { technologyService } from "@/services/technologyService";
import { ProjectType, CategoryType, TechnologyType } from "@/types/admin";
import { ProjectForm } from "./components/ProjectForm";

// Import Shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { getImageSrc } from "@/utils/imageUtils";

export default function AdminProjects() {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [technology_ids, setTechnology_ids] = useState<TechnologyType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortField, setSortField] = useState<"name" | "category">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [editingProject, setEditingProject] = useState<ProjectType | null>(
    null,
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    try {
      // Fetch all data directly using services
      const [projectsData, categoriesData, technology_idsData] =
        await Promise.all([
          projectService.getProjects(),
          categoryService.getCategories(),
          technologyService.getTechnologies(),
        ]);

      setProjects(projectsData);
      setCategories(categoriesData);
      setTechnology_ids(technology_idsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Something went wrong fetching data");
    } finally {
      setIsLoading(false);
    }
  }

  // Get category name by ID
  const getCategoryName = (categoryId: string): string => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || "Unknown";
  };

  // Get unique categories from projects
  const getUniqueProjectCategories = () => {
    const uniqueCategoryIds = new Set<string>();
    projects.forEach((project) => {
      project.category_ids.forEach((catId) => uniqueCategoryIds.add(catId));
    });
    return categories.filter((cat) => uniqueCategoryIds.has(cat.id));
  };

  // Filter, sort, and search projects
  const filteredProjects = [...projects]
    .filter((project) => {
      // Filter by category
      if (
        selectedCategory !== "all" &&
        !project.category_ids.includes(selectedCategory)
      ) {
        return false;
      }

      // Filter by search term
      const searchLower = searchTerm.toLowerCase();
      return (
        project.name.toLowerCase().includes(searchLower) ||
        project.description.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      // Sort by selected field and direction
      if (sortField === "name") {
        return sortDirection === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else {
        // Use first category for sorting
        const categoryA = getCategoryName(a.category_ids[0] || "");
        const categoryB = getCategoryName(b.category_ids[0] || "");
        return sortDirection === "asc"
          ? categoryA.localeCompare(categoryB)
          : categoryB.localeCompare(categoryA);
      }
    });

  const toggleSort = (field: "name" | "category") => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleEditProject = (project: ProjectType) => {
    setEditingProject(project);
    setIsProjectFormOpen(true);
  };

  const handleNewProject = () => {
    setEditingProject(null);
    setIsProjectFormOpen(true);
  };

  const handleDeleteProject = (project: ProjectType) => {
    setEditingProject(project);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!editingProject) return;

    try {
      const toastId = toast.loading("Deleting project...");

      // Use service directly instead of API route
      await projectService.deleteProject(editingProject.id);

      setProjects(
        projects.filter((project) => project.id !== editingProject.id),
      );
      toast.success("Project deleted successfully", { id: toastId });
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    } finally {
      setIsDeleteDialogOpen(false);
      setEditingProject(null);
    }
  };

  const handleProjectFormSubmit = async (
    data: Omit<ProjectType, "id" | "created_at" | "updated_at">,
    imageFile?: File,
  ) => {
    const toastId = toast.loading(
      editingProject ? "Updating project..." : "Creating project...",
    );

    try {
      if (editingProject) {
        // Update existing project - use service directly
        const updatedProject = await projectService.updateProject(
          editingProject.id,
          data,
          imageFile,
        );

        setProjects(
          projects.map((project) =>
            project.id === editingProject.id ? updatedProject : project,
          ),
        );
        toast.success("Project updated successfully", { id: toastId });
        setIsProjectFormOpen(false);
      } else {
        // Create new project - use service directly
        const newProject = await projectService.createProject(data, imageFile);

        setProjects([...projects, newProject]);
        toast.success("Project created successfully", { id: toastId });
        setIsProjectFormOpen(false);
      }
    } catch (error) {
      console.error("Error submitting project form:", error);
      toast.error(`Failed to ${editingProject ? "update" : "create"} project`, {
        id: toastId,
      });
    }
  };

  // Main render code
  if (isLoading) {
    return (
      <TableSkeleton
        columns={5}
        rows={5}
        searchField={true}
        filterField={true}
      />
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <Toaster position="top-right" />

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
        <Button onClick={handleNewProject}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Search field */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search projects..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Category badges */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <Badge
            key="all"
            variant={selectedCategory === "all" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedCategory("all")}
          >
            All Categories
          </Badge>
          {getUniqueProjectCategories().map((category) => (
            <Badge
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Badge>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          {/* Count info */}
          <div className="text-sm text-muted-foreground mb-4">
            Showing {filteredProjects.length} of {projects.length} projects
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="w-[250px] cursor-pointer"
                  onClick={() => toggleSort("name")}
                >
                  <div className="flex items-center gap-1">
                    Project
                    {sortField === "name" && (
                      <ChevronDown
                        className={`h-4 w-4 ${sortDirection === "desc" ? "transform rotate-180" : ""}`}
                      />
                    )}
                  </div>
                </TableHead>
                <TableHead>Technology_ids</TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => toggleSort("category")}
                >
                  <div className="flex items-center gap-1">
                    Category
                    {sortField === "category" && (
                      <ChevronDown
                        className={`h-4 w-4 ${sortDirection === "desc" ? "transform rotate-180" : ""}`}
                      />
                    )}
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No projects found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded overflow-hidden bg-muted">
                          <Image
                            src={getImageSrc(project.image)}
                            alt={project.name}
                            width={40}
                            height={40}
                            className="object-cover h-full w-full"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{project.name}</div>
                          <div className="text-xs text-muted-foreground line-clamp-1">
                            {project.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {project.technology_ids &&
                        project.technology_ids.length > 0 ? (
                          <>
                            {project.technology_ids
                              .slice(0, 2)
                              .map((techId) => {
                                const tech = technology_ids.find(
                                  (t) => t.id === techId,
                                );
                                return (
                                  <Badge key={techId} variant="outline">
                                    {tech?.name || "Unknown"}
                                  </Badge>
                                );
                              })}
                            {project.technology_ids.length > 2 && (
                              <Badge variant="outline">
                                +{project.technology_ids.length - 2}
                              </Badge>
                            )}
                          </>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            None
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {project.category_ids.map((catId) => (
                          <Badge
                            key={catId}
                            variant="secondary"
                            className="capitalize"
                          >
                            {getCategoryName(catId)}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {project.featured ? (
                        <Badge className="bg-yellow-500">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          Featured
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          <StarOff className="h-3 w-3 mr-1" />
                          Regular
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => handleEditProject(project)}
                          >
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteProject(project)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Project Form Dialog */}
      <Dialog open={isProjectFormOpen} onOpenChange={setIsProjectFormOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? "Edit Project" : "New Project"}
            </DialogTitle>
            <DialogDescription>
              {editingProject
                ? "Update the details of this project."
                : "Add a new project to your portfolio."}
            </DialogDescription>
          </DialogHeader>

          <ProjectForm
            project={editingProject || undefined}
            onSubmit={handleProjectFormSubmit}
            onCancel={() => setIsProjectFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {editingProject?.name}? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

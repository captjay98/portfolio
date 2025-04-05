"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Calendar,
  MoreHorizontal,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import {
  ExperienceType,
  CategoryType,
  TechnologyType,
  ExperienceAccomplishmentType,
} from "../../../types/admin";
import { ExperienceForm } from "./components/ExperienceForm";

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
import { categoryService } from "@/services/categoryService";
import { technologyService } from "@/services/technologyService";
import { experienceService } from "@/services/experienceService";
import { experienceAccomplishmentService } from "@/services/experienceAccomplishmentService";
import { TableSkeleton } from "@/components/ui/table-skeleton";

// Format date for display
const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "Present";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
};

export default function AdminExperience() {
  const [experiences, setExperiences] = useState<ExperienceType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingExperience, setEditingExperience] =
    useState<ExperienceType | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isExperienceFormOpen, setIsExperienceFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [, setDomains] = useState<CategoryType[]>([]);
  const [, setTechnologies] = useState<TechnologyType[]>([]);

  // Fetch data on component mount
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // Fetch data directly from services
        const [experiencesData, categoriesData, technologiesData] =
          await Promise.all([
            experienceService.getExperiences(),
            categoryService.getCategories(),
            technologyService.getTechnologies(),
          ]);

        setExperiences(experiencesData);
        setDomains(categoriesData);
        setTechnologies(technologiesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Something went wrong fetching data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Filter experiences by search term
  const filteredExperiences = experiences.filter((exp) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      exp.title.toLowerCase().includes(searchLower) ||
      exp.company.toLowerCase().includes(searchLower) ||
      exp.description.toLowerCase().includes(searchLower)
    );
  });

  const handleEditExperience = (experience: ExperienceType) => {
    setEditingExperience(experience);
    setIsExperienceFormOpen(true);
  };

  const handleNewExperience = () => {
    setEditingExperience(null);
    setIsExperienceFormOpen(true);
  };

  const handleDelete = (experience: ExperienceType) => {
    setEditingExperience(experience);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!editingExperience) return;

    try {
      const toastId = toast.loading("Deleting experience...");

      // Delete all related accomplishments first
      await experienceAccomplishmentService.deleteAccomplishmentsForExperience(
        editingExperience.id,
      );

      // Then delete the experience
      await experienceService.deleteExperience(editingExperience.id);

      setExperiences(
        experiences.filter((exp) => exp.id !== editingExperience.id),
      );
      toast.success("Experience deleted successfully", { id: toastId });
    } catch (error) {
      console.error("Error deleting experience:", error);
      toast.error("Failed to delete experience");
    } finally {
      setIsDeleteDialogOpen(false);
      setEditingExperience(null);
    }
  };

  const handleExperienceFormSubmit = async (
    data: Omit<ExperienceType, "id" | "created_at" | "updated_at">,
    accomplishments: Omit<
      ExperienceAccomplishmentType,
      "id" | "experience_id" | "created_at" | "updated_at"
    >[],
  ) => {
    const toastId = toast.loading(
      editingExperience ? "Updating experience..." : "Creating experience...",
    );

    try {
      if (editingExperience) {
        // Update existing experience directly
        const updatedExperience = await experienceService.updateExperience(
          editingExperience.id,
          data,
        );

        // Handle accomplishments update
        // First delete all existing accomplishments
        await experienceAccomplishmentService.deleteAccomplishmentsForExperience(
          editingExperience.id,
        );

        // Then create all the new ones
        for (const accomplishment of accomplishments) {
          await experienceAccomplishmentService.createAccomplishment({
            experience_id: editingExperience.id,
            text: accomplishment.text,
            order: accomplishment.order,
          });
        }

        // Ensure updatedExperience has correct type structure
        const typedUpdatedExperience: ExperienceType = {
          ...updatedExperience,
          category_ids:
            updatedExperience.category_ids || data.category_ids || [],
        };

        setExperiences(
          experiences.map((exp) =>
            exp.id === editingExperience.id ? typedUpdatedExperience : exp,
          ),
        );

        toast.success("Experience updated successfully", { id: toastId });
        setIsExperienceFormOpen(false);
      } else {
        // Create new experience
        const newExperience = await experienceService.createExperience(data);

        // Create all accomplishments
        for (const accomplishment of accomplishments) {
          await experienceAccomplishmentService.createAccomplishment({
            experience_id: newExperience.id,
            text: accomplishment.text,
            order: accomplishment.order,
          });
        }

        setExperiences([...experiences, newExperience]);
        toast.success("Experience created successfully", { id: toastId });
        setIsExperienceFormOpen(false);
      }
    } catch (error) {
      console.error("Error submitting experience form:", error);
      toast.error(
        `Failed to ${editingExperience ? "update" : "create"} experience`,
        { id: toastId },
      );
    }
  };

  // Main render code
  if (isLoading) {
    return (
      <TableSkeleton
        columns={5}
        rows={4}
        searchField={true}
        filterField={false}
      />
    );
  }

  return (
    <div className="space-y-6  pb-20">
      {/* Toast container for react-hot-toast */}
      <Toaster position="top-right" />

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Work Experience</h2>
        <Button onClick={handleNewExperience}>
          <Plus className="mr-2 h-4 w-4" />
          New Experience
        </Button>
      </div>

      {/* Search field */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search experience..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex justify-end"></div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Position</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Timeline</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExperiences.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No experience entries found
                  </TableCell>
                </TableRow>
              ) : (
                filteredExperiences.map((exp) => (
                  <TableRow key={exp.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{exp.title}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {exp.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{exp.company}</TableCell>
                    <TableCell>{exp.location}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        <span>
                          {formatDate(exp.start_date)} -{" "}
                          {formatDate(exp.end_date)}
                        </span>
                      </div>
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
                            onClick={() => handleEditExperience(exp)}
                          >
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(exp)}
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

      {/* Experience Form Dialog */}
      <Dialog
        open={isExperienceFormOpen}
        onOpenChange={setIsExperienceFormOpen}
      >
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>
              {editingExperience ? "Edit Experience" : "New Experience"}
            </DialogTitle>
            <DialogDescription>
              {editingExperience
                ? "Update the details of this work experience."
                : "Add a new work experience to your portfolio."}
            </DialogDescription>
          </DialogHeader>

          <ExperienceForm
            experience={editingExperience || undefined}
            onSubmit={handleExperienceFormSubmit}
            onCancel={() => setIsExperienceFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Experience</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {editingExperience?.title} at
              {editingExperience?.company}? This action cannot be undone.
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

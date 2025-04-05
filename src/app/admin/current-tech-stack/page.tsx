/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useEffect } from "react";
import {
  MoreVertical,
  Trash2,
  Edit,
  Plus,
  Loader2,
  ArrowUp,
  ArrowDown,
  Search,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import {
  CategoryType,
  CurrentTechStackType,
  TechnologyType,
} from "../../../types/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { currentTechStackService } from "@/services/currentTechStackService";
import { categoryService } from "@/services/categoryService";
import { technologyService } from "@/services/technologyService";
import { TechStackForm } from "./components/TechStackForm";
import { TechnologyCard } from "@/components/TechnologyCard";

export default function CurrentTechStackAdmin() {
  const [techStacks, setTechStacks] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingTechStack, setEditingTechStack] =
    useState<CurrentTechStackType | null>(null);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [technologies, setTechnologies] = useState<TechnologyType[]>([]);

  // Fetch data on mount
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const [techStacksData, categoriesData, technologiesData] =
          await Promise.all([
            currentTechStackService.getCurrentTechsWithDetails(),
            categoryService.getCategories(),
            technologyService.getTechnologies(),
          ]);

        setTechStacks(techStacksData);
        setCategories(categoriesData);
        setTechnologies(technologiesData);
      } catch (error) {
        console.error("Error fetching tech stack data:", error);
        toast.error("Failed to load tech stack data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Filter tech stacks based on search term
  const filteredTechStacks = techStacks.filter(
    (stack) =>
      stack.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stack.category?.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleNewTechStack = () => {
    setEditingTechStack(null);
    setIsFormOpen(true);
  };

  const handleEditTechStack = (techStack: CurrentTechStackType) => {
    setEditingTechStack(techStack);
    setIsFormOpen(true);
  };

  const handleDelete = (techStack: CurrentTechStackType) => {
    setEditingTechStack(techStack);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!editingTechStack) return;

    try {
      const toastId = toast.loading("Deleting tech stack item...");

      // Call delete API
      await currentTechStackService.deleteCurrentTech(editingTechStack.id);

      // Update state
      setTechStacks(
        techStacks.filter((stack) => stack.id !== editingTechStack.id),
      );
      toast.success("Tech stack item deleted successfully", { id: toastId });
      setIsDeleteDialogOpen(false);
      setEditingTechStack(null);
    } catch (error) {
      console.error("Error deleting tech stack item:", error);
      toast.error("Failed to delete tech stack item");
    }
  };

  const handleFormSubmit = async () => {
    const toastId = toast.loading(
      editingTechStack
        ? "Updating tech stack item..."
        : "Creating tech stack item...",
    );

    try {
      if (editingTechStack) {
        // Refresh the list to get updated details
        const updatedTechStacks =
          await currentTechStackService.getCurrentTechsWithDetails();
        setTechStacks(updatedTechStacks);

        toast.success("Tech stack item updated successfully", { id: toastId });
      } else {
        // Refresh the list to get updated details
        const updatedTechStacks =
          await currentTechStackService.getCurrentTechsWithDetails();
        setTechStacks(updatedTechStacks);

        toast.success("Tech stack item created successfully", { id: toastId });
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error submitting tech stack form:", error);
      toast.error(
        `Failed to ${editingTechStack ? "update" : "create"} tech stack item`,
        { id: toastId },
      );
    }
  };

  const handleMovePriority = async (
    techStack: CurrentTechStackType,
    direction: "up" | "down",
  ) => {
    // Find current and target positions
    const sortedStacks = [...techStacks].sort(
      (a, b) => a.priority - b.priority,
    );
    const currentIndex = sortedStacks.findIndex((s) => s.id === techStack.id);

    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === sortedStacks.length - 1)
    ) {
      return; // Already at the edge
    }

    const targetIndex =
      direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const targetStack = sortedStacks[targetIndex];

    try {
      // Swap priorities
      const currentPriority = techStack.priority;
      const targetPriority = targetStack.priority;

      // Update both stacks
      await Promise.all([
        currentTechStackService.updateCurrentTech(techStack.id, {
          priority: targetPriority,
        }),
        currentTechStackService.updateCurrentTech(targetStack.id, {
          priority: currentPriority,
        }),
      ]);

      // Refresh the list
      const updatedTechStacks =
        await currentTechStackService.getCurrentTechsWithDetails();
      setTechStacks(updatedTechStacks);

      toast.success("Tech stack priority updated");
    } catch (error) {
      console.error("Error updating priority:", error);
      toast.error("Failed to reorder tech stack items");
    }
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Current Tech Stack
        </h2>
        <Button onClick={handleNewTechStack}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Tech Stack
        </Button>
      </div>

      {/* Search field */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search tech stack items..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Technologies</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : filteredTechStacks.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-10 text-muted-foreground"
                  >
                    No tech stack items found
                  </TableCell>
                </TableRow>
              ) : (
                filteredTechStacks.map((stack) => (
                  <TableRow key={stack.id}>
                    <TableCell className="font-medium">{stack.name}</TableCell>
                    <TableCell>
                      {stack.category?.name || "No category"}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {stack.technologies.map((tech: any) => (
                          <TechnologyCard
                            key={tech.id}
                            name={tech.name}
                            size="xs"
                            variant="default"
                            showIndicator={true}
                            categoryColor={
                              stack.category?.color || "bg-blue-500"
                            }
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="mr-2">{stack.priority}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleMovePriority(stack, "up")}
                          disabled={stack === filteredTechStacks[0]}
                        >
                          <ArrowUp size={14} />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleMovePriority(stack, "down")}
                          disabled={
                            stack ===
                            filteredTechStacks[filteredTechStacks.length - 1]
                          }
                        >
                          <ArrowDown size={14} />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEditTechStack(stack)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(stack)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
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

      {/* Tech Stack Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingTechStack
                ? "Edit Tech Stack Item"
                : "Add New Tech Stack Item"}
            </DialogTitle>
            <DialogDescription>
              {editingTechStack
                ? "Update the details for this tech stack item."
                : "Add a new technology stack to your profile."}
            </DialogDescription>
          </DialogHeader>

          <TechStackForm
            techStack={editingTechStack!}
            categories={categories}
            technologies={technologies}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Tech Stack Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {editingTechStack?.name}? This
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

"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  ExternalLink,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { TechnologyType, CategoryType } from "../../../types/admin";
import { TechnologyForm } from "./components/TechnologyForm";

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

import { technologyService } from "@/services/technologyService";
import { categoryService } from "@/services/categoryService";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import Image from "next/image";

export default function AdminTechnologies() {
  const [technologies, setTechnologies] = useState<TechnologyType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [editingTechnology, setEditingTechnology] =
    useState<TechnologyType | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isTechnologyFormOpen, setIsTechnologyFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [techData, categoriesData] = await Promise.all([
          technologyService.getTechnologies(),
          categoryService.getCategories(),
        ]);

        setTechnologies(techData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Something went wrong fetching data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Get category name by ID - enhanced with better debugging
  const getCategoryName = (categoryId: string): string => {
    // Find by ID
    const category = categories.find((c) => c.id === categoryId);

    if (category) {
      return category.name;
    } else {
      return "Unknown";
    }
  };

  // Get unique categories from technologies
  const getUniqueTechnologyCategories = () => {
    const uniqueCategoryIds = new Set<string>();
    technologies.forEach((technology) => {
      uniqueCategoryIds.add(technology.category_id);
    });
    return categories.filter((category) => uniqueCategoryIds.has(category.id));
  };

  // Filter technologies by category and search term
  const filteredTechnologies = technologies.filter((tech) => {
    if (selectedCategory !== "all" && tech.category_id !== selectedCategory) {
      return false;
    }

    const searchLower = searchTerm.toLowerCase();
    return tech.name.toLowerCase().includes(searchLower);
  });

  const handleEditTechnology = (technology: TechnologyType) => {
    setEditingTechnology(technology);
    setIsTechnologyFormOpen(true);
  };

  const handleNewTechnology = () => {
    setEditingTechnology(null);
    setIsTechnologyFormOpen(true);
  };

  const handleDelete = (technology: TechnologyType) => {
    setEditingTechnology(technology);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!editingTechnology) return;

    try {
      const toastId = toast.loading("Deleting technology...");

      await technologyService.deleteTechnology(editingTechnology.id);

      setTechnologies(
        technologies.filter((tech) => tech.id !== editingTechnology.id),
      );
      toast.success("Technology deleted successfully", { id: toastId });
    } catch (error) {
      console.error("Error deleting technology:", error);
      toast.error("Failed to delete technology");
    } finally {
      setIsDeleteDialogOpen(false);
      setEditingTechnology(null);
    }
  };

  const handleTechnologyFormSubmit = async (
    data: Omit<TechnologyType, "id" | "created_at" | "updated_at">,
  ) => {
    const toastId = toast.loading(
      editingTechnology ? "Updating technology..." : "Creating technology...",
    );

    try {
      if (editingTechnology) {
        const updatedTechnology = await technologyService.updateTechnology(
          editingTechnology.id,
          data,
        );

        setTechnologies(
          technologies.map((tech) =>
            tech.id === editingTechnology.id ? updatedTechnology : tech,
          ),
        );
        toast.success("Technology updated successfully", { id: toastId });
        setIsTechnologyFormOpen(false);
      } else {
        const newTechnology = await technologyService.createTechnology(data);

        setTechnologies([...technologies, newTechnology]);
        toast.success("Technology created successfully", { id: toastId });
        setIsTechnologyFormOpen(false);
      }
    } catch (error) {
      console.error("Error submitting technology form:", error);
      toast.error(
        `Failed to ${editingTechnology ? "update" : "create"} technology`,
        { id: toastId },
      );
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
        <h2 className="text-3xl font-bold tracking-tight">Technologies</h2>
        <Button onClick={handleNewTechnology}>
          <Plus className="mr-2 h-4 w-4" />
          New Technology
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search technologies..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

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
          {getUniqueTechnologyCategories().map((category) => (
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

      <Card className="overflow-hidden">
        <CardContent className="pt-6 overflow-auto">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Icon</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTechnologies.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No technologies found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTechnologies.map((technology) => (
                    <TableRow key={technology.id}>
                      <TableCell className="font-medium">
                        {technology.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getCategoryName(technology.category_id)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {technology.icon ? (
                          <div className="w-8 h-8 flex items-center justify-center">
                            <Image
                              width={32}
                              height={32}
                              src={technology.icon}
                              alt={`${technology.name} icon`}
                              className="max-w-full max-h-full"
                            />
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {technology.website ? (
                          <a
                            href={technology.website}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center text-blue-500 hover:underline"
                          >
                            <span className="truncate max-w-[200px]">
                              {technology.website.replace(/^https?:\/\//, "")}
                            </span>
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        ) : (
                          <span className="text-muted-foreground">—</span>
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
                              onClick={() => handleEditTechnology(technology)}
                            >
                              <Edit className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(technology)}
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
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={isTechnologyFormOpen}
        onOpenChange={setIsTechnologyFormOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingTechnology ? "Edit Technology" : "New Technology"}
            </DialogTitle>
            <DialogDescription>
              {editingTechnology
                ? "Update the details of this technology."
                : "Add a new technology to your portfolio."}
            </DialogDescription>
          </DialogHeader>

          <TechnologyForm
            technology={editingTechnology || undefined}
            onSubmit={handleTechnologyFormSubmit}
            onCancel={() => setIsTechnologyFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Technology</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {editingTechnology?.name}? This
              may affect any skills and experiences associated with this
              technology.
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

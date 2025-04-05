"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, MoreHorizontal } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { CategoryType } from "../../../types/admin";
import { CategoryForm } from "./components/CategoryForm";

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
import { TableSkeleton } from "@/components/ui/table-skeleton";

export default function AdminCategories() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCategory, setEditingCategory] = useState<CategoryType | null>(
    null,
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // Use categoryService directly instead of fetching from API
        const categoriesData = await categoryService.getCategories();
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

  // Get parent category name by ID
  const getParentName = (parentId?: string): string => {
    if (!parentId) return "None";
    const parent = categories.find((c) => c.id === parentId);
    return parent?.name || "Unknown";
  };

  // Filter categories by search term only (removed type filter)
  const filteredCategories = categories.filter((category) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      category.name.toLowerCase().includes(searchLower) ||
      category.description?.toLowerCase().includes(searchLower)
    );
  });

  const handleEditCategory = (category: CategoryType) => {
    setEditingCategory(category);
    setIsCategoryFormOpen(true);
  };

  const handleNewCategory = () => {
    setEditingCategory(null);
    setIsCategoryFormOpen(true);
  };

  const handleDelete = (category: CategoryType) => {
    setEditingCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!editingCategory) return;

    try {
      const toastId = toast.loading("Deleting category...");

      // Delete category directly with categoryService
      await categoryService.deleteCategory(editingCategory.id);

      setCategories(
        categories.filter((category) => category.id !== editingCategory.id),
      );
      toast.success("Category deleted successfully", { id: toastId });
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    } finally {
      setIsDeleteDialogOpen(false);
      setEditingCategory(null);
    }
  };

  const handleCategoryFormSubmit = async (
    data: Omit<CategoryType, "id" | "created_at" | "updated_at">,
  ) => {
    const toastId = toast.loading(
      editingCategory ? "Updating category..." : "Creating category...",
    );

    try {
      if (editingCategory) {
        // Update existing category directly with categoryService
        const updatedCategory = await categoryService.updateCategory(
          editingCategory.id,
          data,
        );
        setCategories(
          categories.map((category) =>
            category.id === editingCategory.id ? updatedCategory : category,
          ),
        );
        toast.success("Category updated successfully", { id: toastId });
        setIsCategoryFormOpen(false);
      } else {
        // Create new category directly with categoryService
        const newCategory = await categoryService.createCategory(data);
        setCategories([...categories, newCategory]);
        toast.success("Category created successfully", { id: toastId });
        setIsCategoryFormOpen(false);
      }
    } catch (error) {
      console.error("Error submitting category form:", error);
      toast.error(
        `Failed to ${editingCategory ? "update" : "create"} category`,
        { id: toastId },
      );
    }
  };

  // Main render code
  if (isLoading) {
    return (
      <TableSkeleton
        columns={4}
        rows={5}
        searchField={true}
        filterField={false}
      />
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <Toaster position="top-right" />

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
        <Button onClick={handleNewCategory} className="ml-auto">
          <Plus className="mr-2 h-4 w-4" />
          New Category
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search categories..."
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
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No categories found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell>{getParentName(category.parent_id)}</TableCell>
                    <TableCell className="max-w-[300px] truncate">
                      {category.description || "—"}
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
                            onClick={() => handleEditCategory(category)}
                          >
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(category)}
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

      <Dialog open={isCategoryFormOpen} onOpenChange={setIsCategoryFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "New Category"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Update the details of this category."
                : "Add a new category to organize your portfolio content."}
            </DialogDescription>
          </DialogHeader>

          <CategoryForm
            category={editingCategory || undefined}
            categories={categories}
            onSubmit={handleCategoryFormSubmit}
            onCancel={() => setIsCategoryFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {editingCategory?.name}? This may
              affect any items associated with this category.
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

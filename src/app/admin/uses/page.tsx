"use client";

import { useState, useEffect } from "react";
import {
  MoreVertical,
  Trash2,
  Edit,
  Plus,
  Loader2,
  Star,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { UsesItemType } from "../../../types/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { profileService } from "@/services/profileService";
import { UsesItemForm } from "./components/UsesItemForm";

export default function UsesAdmin() {
  const [items, setItems] = useState<UsesItemType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<UsesItemType | null>(null);

  // Fetch data on mount
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const [itemsData] = await Promise.all([profileService.getAllUses()]);

        setItems(itemsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Filter items based on search term and category
  const filteredItems = items.filter((item) => {
    // Filter by search term
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by category
    const matchesCategory =
      selectedCategory === "all" || item.category_id === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleNewItem = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleEditItem = (item: UsesItemType) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = (item: UsesItemType) => {
    setEditingItem(item);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!editingItem) return;

    try {
      const toastId = toast.loading("Deleting item...");

      // Call delete API
      await profileService.deleteUsesItem(editingItem.id);

      // Update state
      setItems(items.filter((item) => item.id !== editingItem.id));
      toast.success("Item deleted successfully", { id: toastId });
      setIsDeleteDialogOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item");
    }
  };

  const handleFormSubmit = async (
    data: Omit<UsesItemType, "id" | "created_at" | "updated_at">,
  ) => {
    const toastId = toast.loading(
      editingItem ? "Updating item..." : "Creating item...",
    );

    try {
      if (editingItem) {
        // Update existing item
        const updatedItem = await profileService.updateUsesItem(
          editingItem.id,
          data,
        );
        setItems(
          items.map((item) =>
            item.id === editingItem.id ? updatedItem : item,
          ),
        );

        toast.success("Item updated successfully", { id: toastId });
      } else {
        // Create new item
        const newItem = await profileService.createUsesItem(data);
        setItems([...items, newItem]);

        toast.success("Item created successfully", { id: toastId });
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(`Failed to ${editingItem ? "update" : "create"} item`, {
        id: toastId,
      });
    }
  };

  const handleFavoriteToggle = async (item: UsesItemType) => {
    try {
      const updatedItem = await profileService.updateUsesItem(item.id, {
        is_favorite: !item.is_favorite,
      });

      setItems(items.map((i) => (i.id === item.id ? updatedItem : i)));
      toast.success(
        `Item ${updatedItem.is_favorite ? "marked as favorite" : "removed from favorites"}`,
      );
    } catch (error) {
      console.error("Error updating favorite status:", error);
      toast.error("Failed to update favorite status");
    }
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Uses & Tools</h2>
        <Button onClick={handleNewItem}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Item
        </Button>
      </div>

      {/* Search and filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search items..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <SlidersHorizontal size={16} />
          <select
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
          </select>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="hidden md:table-cell">
                  Description
                </TableHead>
                <TableHead>Favorite</TableHead>
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
              ) : filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-10 text-muted-foreground"
                  >
                    No items found
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.name}
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-blue-600 dark:text-blue-400 hover:underline text-xs"
                        >
                          (link)
                        </a>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">Category</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell max-w-xs truncate">
                      {item.description}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleFavoriteToggle(item)}
                        className={`text-yellow-500 hover:text-yellow-600 focus:outline-none ${!item.is_favorite && "opacity-25 hover:opacity-100"}`}
                        title={
                          item.is_favorite
                            ? "Remove from favorites"
                            : "Add to favorites"
                        }
                      >
                        <Star
                          className="h-5 w-5"
                          fill={item.is_favorite ? "currentColor" : "none"}
                        />
                      </button>
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
                            onClick={() => handleEditItem(item)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(item)}
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

      {/* Item Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Edit Item" : "Add New Item"}
            </DialogTitle>
            <DialogDescription>
              {editingItem
                ? "Update the details for this item in your uses list."
                : "Add a new tool or item to your uses list."}
            </DialogDescription>
          </DialogHeader>

          <UsesItemForm
            item={editingItem!}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {editingItem?.name}? This action
              cannot be undone.
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

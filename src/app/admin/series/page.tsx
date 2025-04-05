"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { BlogSeriesType } from "../../../types/admin";
import { blogService } from "@/services/blogService";
import { TableSkeleton } from "@/components/ui/table-skeleton";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import Image from "next/image";
import { getImageSrc } from "@/utils/imageUtils";

export default function AdminSeries() {
  const router = useRouter();
  const [series, setSeries] = useState<BlogSeriesType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingSeries, setEditingSeries] = useState<BlogSeriesType | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    fetchSeries();
  }, []);

  async function fetchSeries() {
    setIsLoading(true);
    try {
      const seriesData = await blogService.getAllSeries();
      setSeries(seriesData);
    } catch (error) {
      console.error("Error fetching series:", error);
      toast.error("Something went wrong fetching series data");
    } finally {
      setIsLoading(false);
    }
  }

  // Filter and search series
  const filteredSeries = [...series].filter((s) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      s.title.toLowerCase().includes(searchLower) ||
      (s.description && s.description.toLowerCase().includes(searchLower))
    );
  });

  const handleNewSeries = () => {
    router.push("/admin/series/new");
  };

  const handleEditSeries = (series: BlogSeriesType) => {
    router.push(`/admin/series/edit/${series.id}`);
  };

  const handleDeleteSeries = (series: BlogSeriesType) => {
    setEditingSeries(series);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!editingSeries) return;

    try {
      const toastId = toast.loading("Deleting series...");

      // Delete the series
      await blogService.deleteSeries(editingSeries.id);

      // Update local state
      setSeries(series.filter((s) => s.id !== editingSeries.id));

      toast.success("Series deleted successfully", { id: toastId });
    } catch (error) {
      console.error("Error deleting series:", error);
      toast.error("Failed to delete series");
    } finally {
      setIsDeleteDialogOpen(false);
      setEditingSeries(null);
    }
  };

  // Main render code
  if (isLoading) {
    return <TableSkeleton columns={4} rows={5} searchField={true} />;
  }

  return (
    <div className="space-y-6  pb-20">
      <Toaster position="top-right" />

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Blog Series</h2>
        <Button onClick={handleNewSeries}>
          <Plus className="mr-2 h-4 w-4" />
          New Series
        </Button>
      </div>

      {/* Search field */}
      <div className="relative">
        <Input
          type="search"
          placeholder="Search series..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Manage Blog Series</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Show count info */}
          <div className="text-sm text-muted-foreground mb-4">
            Showing {filteredSeries.length} of {series.length} series
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Series Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSeries.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No series found
                  </TableCell>
                </TableRow>
              ) : (
                filteredSeries.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <div className="h-10 w-10 rounded overflow-hidden bg-muted">
                            <Image
                              src={getImageSrc(item.image)}
                              alt={item.title}
                              width={40}
                              height={40}
                              className="object-cover h-full w-full"
                            />
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{item.title}</div>
                          {item.description && (
                            <div className="text-xs text-muted-foreground line-clamp-1">
                              {item.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.status === "ongoing" ? "default" : "secondary"
                        }
                      >
                        {item.status === "ongoing" ? "Ongoing" : "Completed"}
                      </Badge>
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
                            onClick={() => handleEditSeries(item)}
                          >
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteSeries(item)}
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Series</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {editingSeries?.title}? This
              action cannot be undone. Posts in this series will not be deleted,
              but they will no longer be part of this series.
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

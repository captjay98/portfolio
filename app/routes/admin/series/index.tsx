import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, MoreHorizontal, Search } from 'lucide-react';
import { toast } from 'sonner';
import { BlogSeriesType } from '@app/types/admin';
import { blogService } from '@app/services/blogService';
import { SeriesForm } from '@app/components/admin/SeriesForm';

import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@app/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@app/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@app/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@app/components/ui/dialog';
import { Badge } from '@app/components/ui/badge';
import { getImageSrc } from '@app/utils/imageUtils';

export const Route = createFileRoute('/admin/series/')({
  component: AdminSeries,
});

function AdminSeries() {
  const [series, setSeries] = useState<BlogSeriesType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSeries, setEditingSeries] = useState<BlogSeriesType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSeries();
  }, []);

  async function fetchSeries() {
    setIsLoading(true);
    try {
      const seriesData = await blogService.getAllSeries();
      setSeries(seriesData);
    } catch (error) {
      console.error('Error fetching series:', error);
      toast.error('Failed to load blog series');
    } finally {
      setIsLoading(false);
    }
  }

  const filteredSeries = series.filter((s) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      s.title.toLowerCase().includes(searchLower) ||
      (s.description && s.description.toLowerCase().includes(searchLower))
    );
  });

  const handleNewSeries = () => {
    setEditingSeries(null);
    setIsFormOpen(true);
  };

  const handleEditSeries = (item: BlogSeriesType) => {
    setEditingSeries(item);
    setIsFormOpen(true);
  };

  const handleDeleteSeries = (item: BlogSeriesType) => {
    setEditingSeries(item);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!editingSeries) return;
    try {
      await blogService.deleteSeries(editingSeries.id);
      setSeries(series.filter((s) => s.id !== editingSeries.id));
      toast.success('Series deleted successfully');
    } catch (error) {
      console.error('Error deleting series:', error);
      toast.error('Failed to delete series');
    } finally {
      setIsDeleteDialogOpen(false);
      setEditingSeries(null);
    }
  };

  const handleFormSubmit = async (
    data: Omit<BlogSeriesType, 'id' | 'created_at' | 'updated_at'>,
    imageFile?: File,
  ) => {
    try {
      if (editingSeries) {
        const updated = await blogService.updateSeries(editingSeries.id, data, imageFile);
        setSeries(series.map((s) => (s.id === editingSeries.id ? updated : s)));
        toast.success('Series updated successfully');
      } else {
        const created = await blogService.createSeries(data, imageFile);
        setSeries([...series, created]);
        toast.success('Series created successfully');
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error saving series:', error);
      toast.error('Failed to save series');
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="h-64 w-full bg-muted/30 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Blog Series</h2>
        <Button onClick={handleNewSeries}>
          <Plus className="mr-2 h-4 w-4" />
          New Series
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search series..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Manage Blog Series</CardTitle>
        </CardHeader>
        <CardContent>
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
                  <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                    No series found
                  </TableCell>
                </TableRow>
              ) : (
                filteredSeries.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <div className="h-10 w-10 rounded overflow-hidden bg-muted flex-shrink-0">
                            <img
                              src={getImageSrc(item.image)}
                              alt={item.title}
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
                      <Badge variant={item.status === 'ongoing' ? 'default' : 'secondary'}>
                        {item.status === 'ongoing' ? 'Ongoing' : 'Completed'}
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
                          <DropdownMenuItem onClick={() => handleEditSeries(item)}>
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

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{editingSeries ? 'Edit Series' : 'New Series'}</DialogTitle>
            <DialogDescription>
              {editingSeries ? 'Update details of this blog series.' : 'Create a new blog series.'}
            </DialogDescription>
          </DialogHeader>

          <SeriesForm
            series={editingSeries || undefined}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Series</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {editingSeries?.title}? Posts in this series will not be deleted, but they will unlinked from this series.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
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

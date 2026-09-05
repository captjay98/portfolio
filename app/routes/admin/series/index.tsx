import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, MoreHorizontal, Search } from 'lucide-react';
import { toast } from 'sonner';
import { BlogSeriesType } from '@app/types/admin';
import { blogService } from '@app/services/blogService';
import { SeriesForm } from '@app/components/admin/SeriesForm';

import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
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
      <div className="space-y-4 py-8">
        <div className="h-6 w-48 bg-light-subtle/10 dark:bg-[#131721] rounded animate-pulse" />
        <div className="h-64 w-full bg-white dark:bg-[#0a0e14] border border-light-border dark:border-[#1e2430] rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-light-border dark:border-[#1e2430]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-amber-500/10 dark:bg-[#e6b450]/15 text-amber-800 dark:text-[#e6b450] border border-amber-500/20">
              ESSAY SERIES
            </span>
            <span className="text-xs font-mono text-light-subtle dark:text-[#8a9199]">
              {series.length} Series
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-light-text dark:text-[#bfbdb6]">
            Blog Series
          </h1>
          <p className="text-xs text-light-subtle dark:text-[#8a9199]">
            Group technical writing into multi-part deep dives and episodic guides.
          </p>
        </div>

        <button
          onClick={handleNewSeries}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#e6b450] hover:bg-[#d48b00] text-black font-mono text-xs font-semibold rounded-lg tracking-wider transition-colors shadow-xs w-full sm:w-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>NEW SERIES</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-light-subtle dark:text-[#8a9199]" />
        <Input
          type="search"
          placeholder="Search series..."
          className="pl-9 text-xs bg-white dark:bg-[#0a0e14] border-light-border dark:border-[#1e2430]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white dark:bg-[#0a0e14] rounded-xl border border-light-border dark:border-[#1e2430] shadow-xs overflow-hidden">
        <div className="px-4 py-3 border-b border-light-border dark:border-[#1e2430] bg-light-background/60 dark:bg-[#131721]/50 flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">
            Manage Series ({filteredSeries.length} of {series.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-light-border dark:border-[#1e2430] bg-light-background/60 dark:bg-[#131721]/50">
                <TableHead className="text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">Series Title</TableHead>
                <TableHead className="text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">Status</TableHead>
                <TableHead className="text-right text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">Actions</TableHead>
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
        </div>
      </div>

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

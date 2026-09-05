import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';
import { TechnologyType, CategoryType } from '@app/types/admin';
import { TechnologyForm } from '@app/components/admin/TechnologyForm';

import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import { Card, CardContent } from '@app/components/ui/card';
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
import { technologyService } from '@app/services/technologyService';
import { categoryService } from '@app/services/categoryService';

export const Route = createFileRoute('/admin/technologies/')({
  component: AdminTechnologies,
});

function AdminTechnologies() {
  const [technologies, setTechnologies] = useState<TechnologyType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingTechnology, setEditingTechnology] = useState<TechnologyType | null>(null);
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
        console.error('Error fetching data:', error);
        toast.error('Something went wrong fetching data');
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const getCategoryName = (categoryId: string): string => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || 'Unknown';
  };

  const filteredTechnologies = technologies.filter((tech) => {
    if (selectedCategory !== 'all' && tech.category_id !== selectedCategory) {
      return false;
    }
    const searchLower = searchTerm.toLowerCase();
    return tech.name.toLowerCase().includes(searchLower);
  });

  const handleEditTechnology = (tech: TechnologyType) => {
    setEditingTechnology(tech);
    setIsTechnologyFormOpen(true);
  };

  const handleNewTechnology = () => {
    setEditingTechnology(null);
    setIsTechnologyFormOpen(true);
  };

  const handleDelete = (tech: TechnologyType) => {
    setEditingTechnology(tech);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!editingTechnology) return;

    try {
      await technologyService.deleteTechnology(editingTechnology.id);
      setTechnologies(technologies.filter((t) => t.id !== editingTechnology.id));
      toast.success('Technology deleted successfully');
    } catch (error) {
      console.error('Error deleting technology:', error);
      toast.error('Failed to delete technology');
    } finally {
      setIsDeleteDialogOpen(false);
      setEditingTechnology(null);
    }
  };

  const handleTechnologyFormSubmit = async (
    data: Omit<TechnologyType, 'id' | 'created_at' | 'updated_at'>,
  ) => {
    try {
      if (editingTechnology) {
        const updatedTech = await technologyService.updateTechnology(editingTechnology.id, data);
        setTechnologies(technologies.map((t) => (t.id === editingTechnology.id ? updatedTech : t)));
        toast.success('Technology updated successfully');
      } else {
        const newTech = await technologyService.createTechnology(data);
        setTechnologies([...technologies, newTech]);
        toast.success('Technology created successfully');
      }
      setIsTechnologyFormOpen(false);
    } catch (error) {
      console.error('Error submitting technology form:', error);
      toast.error(`Failed to ${editingTechnology ? 'update' : 'create'} technology`);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 py-4 sm:py-8">
        <div className="h-6 w-48 bg-light-subtle/10 dark:bg-[#131721] rounded animate-pulse" />
        <div className="h-64 w-full bg-white dark:bg-[#0a0e14] border border-light-border dark:border-[#1e2430] rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-light-border dark:border-[#1e2430]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-400 border border-emerald-500/20">
              FRAMEWORKS &amp; RUNTIMES
            </span>
            <span className="text-xs font-mono text-light-subtle dark:text-[#8a9199]">
              {technologies.length} Tools
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-light-text dark:text-[#bfbdb6]">
            Technologies &amp; Tools
          </h1>
          <p className="text-xs text-light-subtle dark:text-[#8a9199]">
            Manage frameworks, libraries, database engines, and runtime dependencies.
          </p>
        </div>

        <button
          type="button"
          onClick={handleNewTechnology}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 bg-[#e6b450] hover:bg-[#d48b00] text-black font-mono text-xs font-semibold rounded-lg tracking-wider transition-colors shadow-xs w-full sm:w-auto shrink-0"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>NEW TECHNOLOGY</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-light-subtle dark:text-[#8a9199]" />
          <Input
            type="search"
            placeholder="Search technologies..."
            className="pl-8 text-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          <Badge
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            className="cursor-pointer text-xs"
            onClick={() => setSelectedCategory('all')}
          >
            All
          </Badge>
          {categories.map((category) => (
            <Badge
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              className="cursor-pointer text-xs"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Badge>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-[#0a0e14] rounded-xl border border-light-border dark:border-[#1e2430] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <tr className="border-b border-light-border dark:border-[#1e2430] bg-light-background/60 dark:bg-[#131721]/50">
                <TableHead className="w-[80px] text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">Icon</TableHead>
                <TableHead className="text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">Name</TableHead>
                <TableHead className="text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">Category</TableHead>
                <TableHead className="text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">Website</TableHead>
                <TableHead className="text-right text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">Actions</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {filteredTechnologies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-xs font-mono">
                    No technologies found
                  </TableCell>
                </TableRow>
              ) : (
                filteredTechnologies.map((tech) => (
                  <TableRow key={tech.id} className="hover:bg-light-subtle/5 dark:hover:bg-[#131721]/50 transition-colors">
                    <TableCell>
                      {tech.icon ? (
                        <img
                          src={tech.icon}
                          alt={tech.name}
                          className="h-7 w-7 object-contain rounded"
                          onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                      ) : (
                        <div className="h-7 w-7 rounded bg-light-subtle/10 dark:bg-[#131721] flex items-center justify-center text-[10px] font-mono">
                          {tech.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium text-xs text-light-text dark:text-[#bfbdb6]">{tech.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[10px] font-mono">{getCategoryName(tech.category_id)}</Badge>
                    </TableCell>
                    <TableCell>
                      {tech.website ? (
                        <a
                          href={tech.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-xs text-amber-700 dark:text-[#e6b450] hover:underline"
                        >
                          Visit <ExternalLink size={11} className="ml-1" />
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEditTechnology(tech)}>
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(tech)}
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

      <Dialog open={isTechnologyFormOpen} onOpenChange={setIsTechnologyFormOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {editingTechnology ? 'Edit Technology' : 'New Technology'}
            </DialogTitle>
            <DialogDescription>
              {editingTechnology
                ? 'Update the details of this technology.'
                : 'Add a new technology to your portfolio.'}
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
              Are you sure you want to delete {editingTechnology?.name}? This action cannot be undone.
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

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
      <div className="p-6 space-y-4">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="h-64 w-full bg-muted/30 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Technologies</h2>
        <Button onClick={handleNewTechnology}>
          <Plus className="mr-2 h-4 w-4" />
          New Technology
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search technologies..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setSelectedCategory('all')}
          >
            All
          </Badge>
          {categories.map((category) => (
            <Badge
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Icon</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Website</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTechnologies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No technologies found
                  </TableCell>
                </TableRow>
              ) : (
                filteredTechnologies.map((tech) => (
                  <TableRow key={tech.id}>
                    <TableCell>
                      {tech.icon ? (
                        <img
                          src={tech.icon}
                          alt={tech.name}
                          className="h-8 w-8 object-contain rounded"
                          onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                      ) : (
                        <div className="h-8 w-8 rounded bg-muted flex items-center justify-center text-xs">
                          {tech.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{tech.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{getCategoryName(tech.category_id)}</Badge>
                    </TableCell>
                    <TableCell>
                      {tech.website ? (
                        <a
                          href={tech.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-xs text-blue-500 hover:underline"
                        >
                          Visit <ExternalLink size={12} className="ml-1" />
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
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
        </CardContent>
      </Card>

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

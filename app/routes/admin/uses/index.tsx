import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import {
  Trash2,
  Edit,
  Plus,
  Star,
  Search,
  ExternalLink,
  MoreHorizontal,
} from 'lucide-react';
import { toast } from 'sonner';
import { UsesItemType } from '@app/types/admin';
import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import { Card, CardContent } from '@app/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { profileService } from '@app/services/profileService';
import { UsesItemForm } from '@app/components/admin/UsesItemForm';

export const Route = createFileRoute('/admin/uses/')({
  component: UsesAdmin,
});

function UsesAdmin() {
  const [items, setItems] = useState<UsesItemType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<UsesItemType | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setIsLoading(true);
      const itemsData = await profileService.getAllUses();
      setItems(itemsData);
    } catch (error) {
      console.error('Error fetching uses data:', error);
      toast.error('Failed to load uses items');
    } finally {
      setIsLoading(false);
    }
  }

  const filteredItems = items.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.name.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term)
    );
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
      await profileService.deleteUsesItem(editingItem.id);
      setItems(items.filter((i) => i.id !== editingItem.id));
      toast.success('Item deleted');
    } catch (error) {
      console.error('Error deleting uses item:', error);
      toast.error('Failed to delete item');
    } finally {
      setIsDeleteDialogOpen(false);
      setEditingItem(null);
    }
  };

  const handleFormSubmit = async (
    data: Omit<UsesItemType, 'id' | 'created_at' | 'updated_at'>,
  ) => {
    try {
      if (editingItem) {
        const updated = await profileService.updateUsesItem(editingItem.id, data);
        setItems(items.map((i) => (i.id === editingItem.id ? updated : i)));
        toast.success('Item updated');
      } else {
        const created = await profileService.createUsesItem(data);
        setItems([...items, created]);
        toast.success('Item created');
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error saving item:', error);
      toast.error('Failed to save item');
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
        <h2 className="text-3xl font-bold tracking-tight">Uses / Gear</h2>
        <Button onClick={handleNewItem}>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search gear & software..."
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
                <TableHead>Item</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Link</TableHead>
                <TableHead>Favorite</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No items found
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="max-w-xs truncate text-xs text-muted-foreground">
                      {item.description}
                    </TableCell>
                    <TableCell>
                      {item.link ? (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline inline-flex items-center text-xs"
                        >
                          View Link <ExternalLink size={12} className="ml-1" />
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {item.is_favorite ? (
                        <Badge variant="default" className="flex items-center gap-1 w-fit">
                          <Star size={10} className="fill-current" /> Favorite
                        </Badge>
                      ) : (
                        <Badge variant="outline">Regular</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditItem(item)}>
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(item)}
                            className="text-destructive"
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Item' : 'Add Item'}</DialogTitle>
            <DialogDescription>
              {editingItem ? 'Update gear / uses details.' : 'Add new tool to your Uses page.'}
            </DialogDescription>
          </DialogHeader>

          <UsesItemForm
            item={editingItem || undefined}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {editingItem?.name}?
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

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
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-purple-500/10 dark:bg-purple-500/15 text-purple-800 dark:text-purple-400 border border-purple-500/20">
              GEAR & WORKSPACE
            </span>
            <span className="text-xs font-mono text-light-subtle dark:text-[#8a9199]">
              {items.length} Items
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-light-text dark:text-[#bfbdb6]">
            Uses & Equipment
          </h1>
          <p className="text-xs text-light-subtle dark:text-[#8a9199]">
            Hardware, developer tools, desk accessories, and day-to-day software stack.
          </p>
        </div>

        <button
          onClick={handleNewItem}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#e6b450] hover:bg-[#d48b00] text-black font-mono text-xs font-semibold rounded-lg tracking-wider transition-colors shadow-xs w-full sm:w-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>ADD ITEM</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-light-subtle dark:text-[#8a9199]" />
        <Input
          type="search"
          placeholder="Search gear & software..."
          className="pl-9 text-xs bg-white dark:bg-[#0a0e14] border-light-border dark:border-[#1e2430]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white dark:bg-[#0a0e14] rounded-xl border border-light-border dark:border-[#1e2430] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-light-border dark:border-[#1e2430] bg-light-background/60 dark:bg-[#131721]/50">
                <TableHead className="text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">Item</TableHead>
                <TableHead className="text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">Description</TableHead>
                <TableHead className="text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">Link</TableHead>
                <TableHead className="text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">Favorite</TableHead>
                <TableHead className="text-right text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">Actions</TableHead>
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
        </div>
      </div>

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

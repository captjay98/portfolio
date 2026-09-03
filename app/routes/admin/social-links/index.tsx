import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import {
  Trash2,
  Edit,
  Plus,
  ExternalLink,
  Search,
  MoreHorizontal,
} from 'lucide-react';
import { toast } from 'sonner';
import { SocialLinkType } from '@app/types/admin';
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
import { SocialLinkForm } from '@app/components/admin/SocialLinkForm';

export const Route = createFileRoute('/admin/social-links/')({
  component: SocialLinksAdmin,
});

function SocialLinksAdmin() {
  const [links, setLinks] = useState<SocialLinkType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLinkType | null>(null);

  useEffect(() => {
    fetchLinks();
  }, []);

  async function fetchLinks() {
    try {
      setIsLoading(true);
      const data = await profileService.getSocialLinks();
      setLinks([...data].sort((a, b) => a.priority - b.priority));
    } catch (error) {
      console.error('Error fetching social links:', error);
      toast.error('Failed to load social links');
    } finally {
      setIsLoading(false);
    }
  }

  const filteredLinks = links.filter(
    (link) =>
      link.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.url.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleNewLink = () => {
    setEditingLink(null);
    setIsFormOpen(true);
  };

  const handleEditLink = (link: SocialLinkType) => {
    setEditingLink(link);
    setIsFormOpen(true);
  };

  const handleDelete = (link: SocialLinkType) => {
    setEditingLink(link);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!editingLink) return;
    try {
      await profileService.deleteSocialLink(editingLink.id);
      setLinks(links.filter((l) => l.id !== editingLink.id));
      toast.success('Social link deleted');
    } catch (error) {
      console.error('Error deleting social link:', error);
      toast.error('Failed to delete social link');
    } finally {
      setIsDeleteDialogOpen(false);
      setEditingLink(null);
    }
  };

  const handleFormSubmit = async (
    data: Omit<SocialLinkType, 'id' | 'created_at' | 'updated_at'>,
  ) => {
    try {
      if (editingLink) {
        const updated = await profileService.updateSocialLink(editingLink.id, data);
        setLinks(links.map((l) => (l.id === editingLink.id ? updated : l)));
        toast.success('Social link updated');
      } else {
        const created = await profileService.createSocialLink(data);
        setLinks([...links, created]);
        toast.success('Social link created');
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error saving social link:', error);
      toast.error('Failed to save social link');
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
        <h2 className="text-3xl font-bold tracking-tight">Social Links</h2>
        <Button onClick={handleNewLink}>
          <Plus className="mr-2 h-4 w-4" />
          Add Link
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search social links..."
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
                <TableHead>Platform</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Visibility</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLinks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No social links found
                  </TableCell>
                </TableRow>
              ) : (
                filteredLinks.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell className="font-medium">{link.platform}</TableCell>
                    <TableCell>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline inline-flex items-center text-sm"
                      >
                        {link.url} <ExternalLink size={12} className="ml-1" />
                      </a>
                    </TableCell>
                    <TableCell>
                      <Badge variant={link.is_visible ? 'default' : 'secondary'}>
                        {link.is_visible ? 'Visible' : 'Hidden'}
                      </Badge>
                    </TableCell>
                    <TableCell>{link.priority}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditLink(link)}>
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(link)}
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
            <DialogTitle>{editingLink ? 'Edit Social Link' : 'Add Social Link'}</DialogTitle>
            <DialogDescription>
              {editingLink ? 'Update your social link.' : 'Add a new social link.'}
            </DialogDescription>
          </DialogHeader>

          <SocialLinkForm
            link={editingLink || undefined}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Social Link</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {editingLink?.platform}?
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

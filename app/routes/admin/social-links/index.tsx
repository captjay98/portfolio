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
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-cyan-500/10 dark:bg-[#39bae6]/15 text-cyan-800 dark:text-[#39bae6] border border-cyan-500/20">
              CHANNELS & NETWORKS
            </span>
            <span className="text-xs font-mono text-light-subtle dark:text-[#8a9199]">
              {links.length} Profiles
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-light-text dark:text-[#bfbdb6]">
            Social Links
          </h1>
          <p className="text-xs text-light-subtle dark:text-[#8a9199]">
            Manage external public profiles, GitHub handles, LinkedIn, and community links.
          </p>
        </div>

        <button
          onClick={handleNewLink}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#e6b450] hover:bg-[#d48b00] text-black font-mono text-xs font-semibold rounded-lg tracking-wider transition-colors shadow-xs w-full sm:w-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>ADD LINK</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-light-subtle dark:text-[#8a9199]" />
        <Input
          type="search"
          placeholder="Search social links..."
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
                <TableHead className="text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">Platform</TableHead>
                <TableHead className="text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">URL</TableHead>
                <TableHead className="text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">Visibility</TableHead>
                <TableHead className="text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">Priority</TableHead>
                <TableHead className="text-right text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">Actions</TableHead>
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
        </div>
      </div>

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

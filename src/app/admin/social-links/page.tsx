"use client";

import { useState, useEffect } from "react";
import {
  MoreVertical,
  Trash2,
  Edit,
  Plus,
  Loader2,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Search,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { SocialLinkType } from "../../../types/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Switch } from "@/components/ui/switch";
import { profileService } from "@/services/profileService";
import { SocialLinkForm } from "./components/SocialLinkForm";

export default function SocialLinksAdmin() {
  const [links, setLinks] = useState<SocialLinkType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLinkType | null>(null);

  // Fetch data on mount
  useEffect(() => {
    async function fetchLinks() {
      try {
        setIsLoading(true);
        const data = await profileService.getSocialLinks();

        // Sort by priority
        const sortedLinks = [...data].sort((a, b) => a.priority - b.priority);
        setLinks(sortedLinks);
      } catch (error) {
        console.error("Error fetching social links:", error);
        toast.error("Failed to load social links");
      } finally {
        setIsLoading(false);
      }
    }

    fetchLinks();
  }, []);

  // Filter links based on search term
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
      const toastId = toast.loading("Deleting social link...");

      // Call delete API
      await profileService.deleteSocialLink(editingLink.id);

      // Update state
      setLinks(links.filter((link) => link.id !== editingLink.id));
      toast.success("Social link deleted successfully", { id: toastId });
      setIsDeleteDialogOpen(false);
      setEditingLink(null);
    } catch (error) {
      console.error("Error deleting social link:", error);
      toast.error("Failed to delete social link");
    }
  };

  const handleFormSubmit = async (
    data: Omit<SocialLinkType, "id" | "created_at" | "updated_at">,
  ) => {
    const toastId = toast.loading(
      editingLink ? "Updating social link..." : "Creating social link...",
    );

    try {
      if (editingLink) {
        // Update existing link
        const updatedLink = await profileService.updateSocialLink(
          editingLink.id,
          data,
        );
        setLinks(
          links.map((link) =>
            link.id === editingLink.id ? updatedLink : link,
          ),
        );
        toast.success("Social link updated successfully", { id: toastId });
      } else {
        // Create new link
        const newLink = await profileService.createSocialLink(data);
        setLinks([...links, newLink]);
        toast.success("Social link created successfully", { id: toastId });
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error submitting social link form:", error);
      toast.error(
        `Failed to ${editingLink ? "update" : "create"} social link`,
        { id: toastId },
      );
    }
  };

  const handleVisibilityToggle = async (link: SocialLinkType) => {
    try {
      const updatedLink = await profileService.updateSocialLink(link.id, {
        is_visible: !link.is_visible,
      });

      setLinks(links.map((l) => (l.id === link.id ? updatedLink : l)));
      toast.success(
        `Social link ${updatedLink.is_visible ? "shown" : "hidden"}`,
      );
    } catch (error) {
      console.error("Error updating visibility:", error);
      toast.error("Failed to update visibility");
    }
  };

  const handleMovePriority = async (
    link: SocialLinkType,
    direction: "up" | "down",
  ) => {
    // Find current and target positions
    const sortedLinks = [...links].sort((a, b) => a.priority - b.priority);
    const currentIndex = sortedLinks.findIndex((l) => l.id === link.id);

    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === sortedLinks.length - 1)
    ) {
      return; // Already at the edge
    }

    const targetIndex =
      direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const targetLink = sortedLinks[targetIndex];

    try {
      // Swap priorities
      const currentPriority = link.priority;
      const targetPriority = targetLink.priority;

      // Update both links
      const [updatedCurrent, updatedTarget] = await Promise.all([
        profileService.updateSocialLink(link.id, { priority: targetPriority }),
        profileService.updateSocialLink(targetLink.id, {
          priority: currentPriority,
        }),
      ]);

      // Update state
      setLinks(
        links.map((l) => {
          if (l.id === link.id) return updatedCurrent;
          if (l.id === targetLink.id) return updatedTarget;
          return l;
        }),
      );
    } catch (error) {
      console.error("Error updating priority:", error);
      toast.error("Failed to reorder social links");
    }
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Social Links</h2>
        <Button onClick={handleNewLink}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Link
        </Button>
      </div>

      {/* Search field */}
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
                <TableHead>Visible</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Icon</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : filteredLinks.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-10 text-muted-foreground"
                  >
                    No social links found
                  </TableCell>
                </TableRow>
              ) : (
                filteredLinks.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell>
                      <Switch
                        checked={link.is_visible}
                        onCheckedChange={() => handleVisibilityToggle(link)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {link.platform}
                    </TableCell>
                    <TableCell>{link.icon}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                      >
                        {link.url}
                        <ExternalLink size={14} className="ml-1 inline" />
                      </a>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleMovePriority(link, "up")}
                          disabled={link.priority === filteredLinks[0].priority}
                        >
                          <ArrowUp size={14} />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleMovePriority(link, "down")}
                          disabled={
                            link.priority ===
                            filteredLinks[filteredLinks.length - 1].priority
                          }
                        >
                          <ArrowDown size={14} />
                        </Button>
                      </div>
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
                            onClick={() => handleEditLink(link)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(link)}
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

      {/* Social Link Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingLink ? "Edit Social Link" : "Add New Social Link"}
            </DialogTitle>
            <DialogDescription>
              {editingLink
                ? "Update the details for this social media link."
                : "Add a new social media link to your profile."}
            </DialogDescription>
          </DialogHeader>

          <SocialLinkForm
            link={editingLink!}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Social Link</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the {editingLink?.platform} link?
              This action cannot be undone.
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

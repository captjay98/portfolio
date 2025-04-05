import { useState, useEffect } from "react";
import { Loader2, X, Plus, Pencil, ArrowUpDown } from "lucide-react";
import { BlogPostType } from "../../../../types/admin";
import { blogService } from "@/services/blogService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface SeriesPostsManagerProps {
  seriesId: string;
  onUpdate?: () => void; // Optional callback when posts are updated
}

export function SeriesPostsManager({
  seriesId,
  onUpdate,
}: SeriesPostsManagerProps) {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<BlogPostType[]>([]);
  const [availablePosts, setAvailablePosts] = useState<BlogPostType[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<string>("");
  const [selectedPosition, setSelectedPosition] = useState<string>("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showPositionDialog, setShowPositionDialog] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPostType | null>(null);
  const [reordering, setReordering] = useState(false);

  // Fetch data on mount and when seriesId changes
  useEffect(() => {
    if (!seriesId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch posts in this series
        const seriesPosts = await blogService.getPostsInSeries(seriesId);
        setPosts(seriesPosts);

        // Fetch all posts to populate the dropdown
        const allPosts = await blogService.getBlogs();
        // Filter out posts already in this series
        const seriesPostIds = seriesPosts.map((post) => post.id);
        const filtered = allPosts.filter(
          (post) => !seriesPostIds.includes(post.id),
        );
        setAvailablePosts(filtered);
      } catch (error) {
        console.error("Error fetching series posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [seriesId]);

  // Add a post to the series
  const handleAddPost = async () => {
    if (!selectedPostId) return;

    try {
      const post = availablePosts.find((p) => p.id === selectedPostId);
      if (!post) return;

      // Determine position (default to end of list)
      const position = selectedPosition
        ? parseInt(selectedPosition)
        : posts.length > 0
          ? Math.max(...posts.map((p) => p.series_position || 0)) + 1
          : 1;

      // Update the post to be part of this series
      await blogService.updateBlog(selectedPostId, {
        series_id: seriesId,
        series_position: position,
      });

      // Refresh the posts list
      const updatedPosts = await blogService.getPostsInSeries(seriesId);
      setPosts(updatedPosts);

      // Update available posts
      setAvailablePosts(availablePosts.filter((p) => p.id !== selectedPostId));

      // Reset selection
      setSelectedPostId("");
      setSelectedPosition("");
      setShowAddDialog(false);

      // Notify parent
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error adding post to series:", error);
    }
  };

  // Remove a post from the series
  const handleRemovePost = async (postId: string) => {
    try {
      // Update the post to remove it from the series
      await blogService.updateBlog(postId, {
        series_id: "",
        series_position: undefined,
      });

      // Find the removed post
      const removedPost = posts.find((p) => p.id === postId);

      // Update the local state
      setPosts(posts.filter((p) => p.id !== postId));
      if (removedPost) {
        setAvailablePosts([...availablePosts, removedPost]);
      }

      // Notify parent
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error removing post from series:", error);
    }
  };

  // Open dialog to edit position
  const handleOpenPositionDialog = (post: BlogPostType) => {
    setEditingPost(post);
    setSelectedPosition(post.series_position?.toString() || "");
    setShowPositionDialog(true);
  };

  // Update post position
  const handleUpdatePosition = async () => {
    if (!editingPost || !selectedPosition) return;

    try {
      const position = parseInt(selectedPosition);

      // Update the post position
      await blogService.updateBlog(editingPost.id, {
        series_position: position,
      });

      // Update local state
      setPosts(
        posts
          .map((post) =>
            post.id === editingPost.id
              ? { ...post, series_position: position }
              : post,
          )
          .sort((a, b) => (a.series_position || 0) - (b.series_position || 0)),
      );

      // Reset
      setEditingPost(null);
      setSelectedPosition("");
      setShowPositionDialog(false);

      // Notify parent
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error updating post position:", error);
    }
  };

  // Toggle reordering mode
  const toggleReordering = () => {
    setReordering(!reordering);
  };

  // Move post up or down
  const movePost = async (postId: string, direction: "up" | "down") => {
    const postIndex = posts.findIndex((p) => p.id === postId);
    if (postIndex === -1) return;

    const newPosts = [...posts];
    const post = newPosts[postIndex];

    if (direction === "up" && postIndex > 0) {
      // Swap with previous
      const prevPost = newPosts[postIndex - 1];
      const prevPosition = prevPost.series_position || 0;
      const currentPosition = post.series_position || 0;

      try {
        // Update positions in DB
        await Promise.all([
          blogService.updateBlog(post.id, { series_position: prevPosition }),
          blogService.updateBlog(prevPost.id, {
            series_position: currentPosition,
          }),
        ]);

        // Update positions in state
        newPosts[postIndex].series_position = prevPosition;
        newPosts[postIndex - 1].series_position = currentPosition;

        // Re-sort
        setPosts(
          [...newPosts].sort(
            (a, b) => (a.series_position || 0) - (b.series_position || 0),
          ),
        );

        // Notify parent
        if (onUpdate) onUpdate();
      } catch (error) {
        console.error("Error reordering posts:", error);
      }
    } else if (direction === "down" && postIndex < posts.length - 1) {
      // Swap with next
      const nextPost = newPosts[postIndex + 1];
      const nextPosition = nextPost.series_position || 0;
      const currentPosition = post.series_position || 0;

      try {
        // Update positions in DB
        await Promise.all([
          blogService.updateBlog(post.id, { series_position: nextPosition }),
          blogService.updateBlog(nextPost.id, {
            series_position: currentPosition,
          }),
        ]);

        // Update positions in state
        newPosts[postIndex].series_position = nextPosition;
        newPosts[postIndex + 1].series_position = currentPosition;

        // Re-sort
        setPosts(
          [...newPosts].sort(
            (a, b) => (a.series_position || 0) - (b.series_position || 0),
          ),
        );

        // Notify parent
        if (onUpdate) onUpdate();
      } catch (error) {
        console.error("Error reordering posts:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
        <span className="ml-2">Loading posts...</span>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Posts in Series</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={toggleReordering}>
            <ArrowUpDown className="h-4 w-4 mr-1" />
            {reordering ? "Done" : "Reorder"}
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => setShowAddDialog(true)}
            disabled={availablePosts.length === 0}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Post
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {posts.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No posts in this series yet.
          </div>
        ) : (
          <div className="space-y-2">
            {posts
              .sort(
                (a, b) => (a.series_position || 0) - (b.series_position || 0),
              )
              .map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">
                      #{post.series_position || "?"}
                    </Badge>
                    <div>
                      <div className="font-medium">{post.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {post.status === "published" ? "Published" : "Draft"} ·{" "}
                        {post.reading_time}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {reordering ? (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => movePost(post.id, "up")}
                          disabled={posts.indexOf(post) === 0}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="m18 15-6-6-6 6" />
                          </svg>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => movePost(post.id, "down")}
                          disabled={posts.indexOf(post) === posts.length - 1}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenPositionDialog(post)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemovePost(post.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
        <Separator className="my-4" />
        <div className="text-sm text-muted-foreground">
          Showing {posts.length} post{posts.length !== 1 ? "s" : ""} in this
          series
        </div>
      </CardContent>

      {/* Add Post Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Post to Series</DialogTitle>
            <DialogDescription>
              Select an existing post to add to this series.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="post">Select Post</Label>
              <Select value={selectedPostId} onValueChange={setSelectedPostId}>
                <SelectTrigger id="post">
                  <SelectValue placeholder="Select a post to add" />
                </SelectTrigger>
                <SelectContent>
                  {availablePosts.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No available posts
                    </SelectItem>
                  ) : (
                    availablePosts.map((post) => (
                      <SelectItem key={post.id} value={post.id}>
                        {post.title}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position in Series (Optional)</Label>
              <Input
                id="position"
                type="number"
                min="1"
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
                placeholder={`Position (default: ${posts.length + 1})`}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to add to the end of the series
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddPost} disabled={!selectedPostId}>
              Add to Series
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Position Dialog */}
      <Dialog open={showPositionDialog} onOpenChange={setShowPositionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Position</DialogTitle>
            <DialogDescription>
              Change the position of {editingPost?.title} in the series.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-position">Position in Series</Label>
              <Input
                id="new-position"
                type="number"
                min="1"
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPositionDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdatePosition} disabled={!selectedPosition}>
              Update Position
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

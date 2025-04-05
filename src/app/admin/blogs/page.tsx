"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Star,
  ChevronDown,
  MoreHorizontal,
  Calendar,
  Heart,
  BookOpen,
} from "lucide-react";
import Image from "next/image";
import { BlogPostType, CategoryType } from "../../../types/admin";
import { blogService } from "@/services/blogService";
import { categoryService } from "@/services/categoryService";
import { TableSkeleton } from "@/components/ui/table-skeleton";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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

import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import { getImageSrc } from "@/utils/imageUtils";

export default function AdminBlogs() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<BlogPostType[]>([]);
  const [category_ids, setCategory_ids] = useState<CategoryType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortField, setSortField] = useState<"date" | "title">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [editingPost, setEditingPost] = useState<BlogPostType | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    try {
      // Fetch blogs and category_ids
      const [blogsData, category_idsData] = await Promise.all([
        blogService.getBlogs(),
        categoryService.getCategories(),
      ]);

      setBlogs(blogsData);
      setCategory_ids(category_idsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      // toast.error("Something went wrong fetching data");
    } finally {
      setIsLoading(false);
    }
  }

  // Get category name by ID
  const getCategoryName = (categoryId: string): string => {
    const category = category_ids.find((c) => c.id === categoryId);
    return category?.name || "Unknown";
  };

  // Filter, sort, and search posts
  const filteredPosts = [...blogs]
    .filter((post) => {
      // Filter by category
      if (
        selectedCategory !== "all" &&
        !post.category_ids.includes(selectedCategory)
      ) {
        return false;
      }

      // Filter by search term
      const searchLower = searchTerm.toLowerCase();
      return (
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      // Sort by selected field and direction
      if (sortField === "date") {
        return sortDirection === "asc"
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return sortDirection === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
    });

  const toggleSort = (field: "date" | "title") => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleEditPost = (post: BlogPostType) => {
    router.push(`/admin/blogs/edit/${post.id}`);
  };

  const handleNewPost = () => {
    router.push("/admin/blogs/new");
  };

  const handleDeletePost = (post: BlogPostType) => {
    setEditingPost(post);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!editingPost) return;

    try {
      // Toaster("Deleting blog post...");

      // Delete the blog post
      await blogService.deleteBlog(editingPost.id);

      // Update local state
      setBlogs(blogs.filter((blog) => blog.id !== editingPost.id));

      // toast.success("Blog post deleted successfully", { id: toastId });
    } catch (error) {
      console.error("Error deleting blog post:", error);
      // toast.error("Failed to delete blog post");
    } finally {
      setIsDeleteDialogOpen(false);
      setEditingPost(null);
    }
  };

  // Get unique categories from blog posts
  const getUniqueBlogCategories = () => {
    const uniqueCategoryIds = new Set<string>();
    blogs.forEach((blog) => {
      blog.category_ids.forEach((catId) => uniqueCategoryIds.add(catId));
    });
    return category_ids.filter((cat) => uniqueCategoryIds.has(cat.id));
  };

  // Main render code
  if (isLoading) {
    return (
      <TableSkeleton
        columns={5}
        rows={5}
        searchField={true}
        filterField={true}
      />
    );
  }

  return (
    <div className="space-y-6  pb-20">
      <Toaster position="top-right" />

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Blog Posts</h2>
        <Button onClick={handleNewPost}>
          <Plus className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </div>

      {/* Search field moved outside the card */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search posts..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Category badges */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <Badge
            key="all"
            variant={selectedCategory === "all" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedCategory("all")}
          >
            All Categories
          </Badge>
          {getUniqueBlogCategories().map((category) => (
            <Badge
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Badge>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Manage Blog Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Show count info */}
          <div className="text-sm text-muted-foreground mb-4">
            Showing {filteredPosts.length} of {blogs.length} posts
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="w-[300px] cursor-pointer"
                  onClick={() => toggleSort("title")}
                >
                  <div className="flex items-center gap-1">
                    Title
                    {sortField === "title" && (
                      <ChevronDown
                        className={`h-4 w-4 ${sortDirection === "desc" ? "transform rotate-180" : ""}`}
                      />
                    )}
                  </div>
                </TableHead>
                <TableHead>Category_ids</TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => toggleSort("date")}
                >
                  <div className="flex items-center gap-1">
                    Published
                    {sortField === "date" && (
                      <ChevronDown
                        className={`h-4 w-4 ${sortDirection === "desc" ? "transform rotate-180" : ""}`}
                      />
                    )}
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Stats</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No posts found
                  </TableCell>
                </TableRow>
              ) : (
                filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded overflow-hidden bg-muted">
                          <Image
                            src={getImageSrc(post.cover_image)}
                            alt={post.title}
                            width={40}
                            height={40}
                            className="object-cover h-full w-full"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{post.title}</div>
                          <div className="text-xs text-muted-foreground line-clamp-1">
                            {post.excerpt}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {post.category_ids.slice(0, 2).map((categoryId) => (
                          <Badge key={categoryId} variant="outline">
                            {getCategoryName(categoryId)}
                          </Badge>
                        ))}
                        {post.category_ids.length > 2 && (
                          <Badge variant="outline">
                            +{post.category_ids.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-muted-foreground">
                        <Calendar size={14} className="mr-1" />
                        {new Date(post.date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      {post.status === "published" ? (
                        <Badge
                          variant={post.featured ? "default" : "secondary"}
                        >
                          {post.featured && (
                            <Star className="h-3 w-3 mr-1 fill-current" />
                          )}
                          {post.featured ? "Featured" : "Published"}
                        </Badge>
                      ) : (
                        <Badge variant="outline">Draft</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Heart size={14} className="text-rose-500" />
                          <span>{post.likes || 0} likes</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen size={14} className="text-blue-500" />
                          <span>{post.read_count || 0} reads</span>
                        </div>
                      </div>
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
                          <DropdownMenuItem
                            onClick={() => handleEditPost(post)}
                          >
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeletePost(post)}
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Blog Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {editingPost?.title}? This action
              cannot be undone.
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

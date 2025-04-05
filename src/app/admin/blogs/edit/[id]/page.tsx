"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { BlogPostType } from "../../../../../types/admin";
import { blogService } from "@/services/blogService";
import SimpleBlogForm from "../../components/SimpleBlogForm";
import React from "react";
import { useParams } from "next/navigation";

export default function EditBlog() {
  const router = useRouter();
  const [blog, setBlog] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const params = useParams<{ id: string }>();
  const id = params.id;

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const blogData = await blogService.getBlog(id);
        setBlog(blogData);
      } catch (error) {
        console.error("Error fetching blog:", error);
        toast.error("Failed to load blog post");
        router.push("/admin/blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, router]);

  const handleSubmit = async (
    data: Omit<BlogPostType, "id" | "created_at" | "updated_at">,
    coverImageFile?: File,
  ) => {
    if (!blog) return;

    setSubmitting(true);
    const toastId = toast.loading("Updating blog post...");

    try {
      await blogService.updateBlog(blog.id, data, coverImageFile);
      toast.success("Blog post updated successfully", { id: toastId });
      router.push("/admin/blogs");
    } catch (error) {
      console.error("Error updating blog:", error);
      toast.error("Failed to update blog post", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-medium">Blog post not found</h2>
        <Button
          onClick={() => router.push("/admin/blogs")}
          variant="secondary"
          className="mt-4"
        >
          Back to Blog Posts
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Edit Blog Post</h2>
      </div>

      <SimpleBlogForm
        blog={blog}
        onSubmit={handleSubmit}
        isSubmitting={submitting}
        onCancel={() => router.push("/admin/blogs")}
      />
    </div>
  );
}

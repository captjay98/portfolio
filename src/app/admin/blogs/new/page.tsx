"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { BlogPostType } from "../../../../types/admin";
import { blogService } from "@/services/blogService";
import SimpleBlogForm from "../components/SimpleBlogForm";

export default function NewBlog() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (
    data: Omit<BlogPostType, "id" | "created_at" | "updated_at">,
    coverImageFile?: File,
  ) => {
    setSubmitting(true);
    const toastId = toast.loading("Creating blog post...");

    try {
      await blogService.createBlog(data, coverImageFile);
      toast.success("Blog post created successfully", { id: toastId });
      router.push("/admin/blogs");
    } catch (error) {
      console.error("Error creating blog:", error);
      toast.error("Failed to create blog post", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight">
          Create New Blog Post
        </h2>
      </div>

      <SimpleBlogForm
        onSubmit={handleSubmit}
        isSubmitting={submitting}
        onCancel={() => router.push("/admin/blogs")}
      />
    </div>
  );
}

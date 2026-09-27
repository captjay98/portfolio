import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { toast } from 'sonner';
import { blogService } from '@app/services/blogService';
import { BlogPostType } from '@app/types/admin';
import { BlogForm } from '@app/components/admin/BlogForm';

export const Route = createFileRoute('/admin/blogs/new')({
  component: AdminNewBlog,
});

function AdminNewBlog() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (
    data: Omit<BlogPostType, 'id' | 'created_at' | 'updated_at'>,
    coverImageFile?: File,
  ) => {
    setIsSubmitting(true);
    try {
      await blogService.createBlogPost(data, coverImageFile);
      toast.success('Blog post created successfully');
      navigate({ to: '/admin/blogs' });
    } catch (error) {
      console.error('Error creating blog post:', error);
      toast.error('Failed to create blog post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col gap-1 pb-4 border-b border-light-border dark:border-[#1e2430]">
        <span className="w-fit text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-amber-500/10 dark:bg-[#e6b450]/15 text-amber-800 dark:text-[#e6b450] border border-amber-500/20">
          EDITORIAL
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-light-text dark:text-[#bfbdb6]">
          New Blog Post
        </h1>
        <p className="text-xs text-light-subtle dark:text-[#8a9199]">
          Draft a new essay, preview it, and publish when ready.
        </p>
      </div>

      <BlogForm
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onCancel={() => navigate({ to: '/admin/blogs' })}
      />
    </div>
  );
}

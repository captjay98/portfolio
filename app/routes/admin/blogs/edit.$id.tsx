import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { blogService } from '@app/services/blogService';
import { BlogPostType } from '@app/types/admin';
import { BlogForm } from '@app/components/admin/BlogForm';

export const Route = createFileRoute('/admin/blogs/edit/$id')({
  component: AdminEditBlog,
});

function AdminEditBlog() {
  const navigate = useNavigate();
  const { id } = Route.useParams();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const postData = await blogService.getBlogPostById(id);
        if (!postData) {
          toast.error('Blog post not found');
          navigate({ to: '/admin/blogs' });
          return;
        }
        setPost(postData);
      } catch (error) {
        console.error('Error fetching blog post:', error);
        toast.error('Failed to load blog post');
        navigate({ to: '/admin/blogs' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleSubmit = async (
    data: Omit<BlogPostType, 'id' | 'created_at' | 'updated_at'>,
    coverImageFile?: File,
  ) => {
    setIsSubmitting(true);
    try {
      await blogService.updateBlogPost(id, data, coverImageFile);
      toast.success('Blog post updated successfully');
      navigate({ to: '/admin/blogs' });
    } catch (error) {
      console.error('Error updating blog post:', error);
      toast.error('Failed to update blog post');
    } finally {
      setIsSubmitting(false);
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

  if (!post) {
    return (
      <div className="py-8 text-sm text-muted-foreground">Blog post not found.</div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col gap-1 pb-4 border-b border-light-border dark:border-[#1e2430]">
        <span className="w-fit text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-amber-500/10 dark:bg-[#e6b450]/15 text-amber-800 dark:text-[#e6b450] border border-amber-500/20">
          EDITORIAL
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-light-text dark:text-[#bfbdb6]">
          Edit Blog Post
        </h1>
        <p className="text-xs text-light-subtle dark:text-[#8a9199]">
          Update “{post.title}”, preview changes, and save when ready.
        </p>
      </div>

      <BlogForm
        blog={post}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onCancel={() => navigate({ to: '/admin/blogs' })}
      />
    </div>
  );
}

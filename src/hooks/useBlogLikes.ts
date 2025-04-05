import { useState } from 'react';
import { blogService } from '@/services/blogService';
import { toast } from 'sonner';

export function useBlogLikes() {
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async (blogId: string) => {
    setIsLiking(true);
    try {
      await blogService.toggleLike(blogId);
      toast.success('Thanks for liking!');
    } catch (error) {
      toast.error('Failed to like post');
      console.error('Error liking post:', error);
    } finally {
      setIsLiking(false);
    }
  };

  return {
    isLiking,
    handleLike
  };
}

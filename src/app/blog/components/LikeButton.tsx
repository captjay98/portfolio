"use client";

import { ThumbsUp } from "lucide-react";
import { useBlogLikes } from "@/hooks/useBlogLikes";

interface LikeButtonProps {
  blogId: string;
  initialLikes: number;
  className?: string;
  iconSize?: number;
}

export function LikeButton({ 
  blogId, 
  initialLikes,
  className = "",
  iconSize = 14 
}: LikeButtonProps) {
  const { isLiking, handleLike } = useBlogLikes();

  return (
    <button 
      className={`flex items-center light-accent dark:dark-text-accent hover:text-rose-600 transition-colors disabled:opacity-50 ${className}`}
      onClick={() => handleLike(blogId)}
      disabled={isLiking}
    >
      <ThumbsUp 
        size={iconSize} 
        className={`mr-1 ${isLiking ? 'animate-pulse' : ''}`} 
      />
      <span>{initialLikes || 0}</span>
    </button>
  );
}

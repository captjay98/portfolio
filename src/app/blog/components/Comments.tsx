"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  MessageCircle,
  Send,
  ThumbsUp,
  Reply,
  MoreVertical,
  AlertCircle,
  User,
  AtSign,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { blogService } from "@/services/blogService";

interface Comment {
  $id: string;
  content_id: string;
  user_id: string;
  user_name: string;
  user_email: string | null;
  user_avatar: string | null;
  text: string;
  date: string;
  likes: number;
}

interface CommentsProps {
  postId: string;
  postSlug: string;
}

export default function Comments({ postId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [commenterName, setCommenterName] = useState("");
  const [commenterEmail, setCommenterEmail] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());

  // Fetch comments on mount
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        const fetchedComments = await blogService.getComments(postId);
        setComments(fetchedComments);
        setError(null);
      } catch (err) {
        console.error("Error fetching comments:", err);
        setError("Failed to load comments. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  // Pre-fill commenter info if user is logged in
  useEffect(() => {
    if (user) {
      setCommenterName(user.name || "");
      setCommenterEmail(user.email || "");
    }
  }, [user]);

  // Load liked comments from localStorage
  useEffect(() => {
    const storedLikes = localStorage.getItem(`blog_comment_likes_${postId}`);
    if (storedLikes) {
      setLikedComments(new Set(JSON.parse(storedLikes)));
    }
  }, [postId]);

  // Save liked comments to localStorage when changed
  useEffect(() => {
    if (likedComments.size > 0) {
      localStorage.setItem(
        `blog_comment_likes_${postId}`,
        JSON.stringify(Array.from(likedComments)),
      );
    }
  }, [likedComments, postId]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) {
      return;
    }

    // Validate name if not anonymous
    if (!isAnonymous && !commenterName.trim()) {
      setError("Please enter your name or choose to comment anonymously");
      return;
    }

    setIsSubmitting(true);

    try {
      const newCommentData = {
        content_id: postId,
        text: newComment,
        date: new Date().toISOString(),
        user_name: isAnonymous ? "Anonymous" : commenterName,
        user_email: isAnonymous ? "" : commenterEmail,
      };

      const addedComment = await blogService.addComment(newCommentData);

      // Add the new comment to the list
      setComments([addedComment, ...comments]);

      // Clear the form
      setNewComment("");
      setError(null);
    } catch (err) {
      console.error("Error posting comment:", err);
      setError("Failed to post your comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAnonymous = () => {
    setIsAnonymous(!isAnonymous);
  };

  const handleLike = async (commentId: string) => {
    // If no email provided or anonymous, don't allow liking
    if (isAnonymous || (!user && !commenterEmail)) {
      setError("Please sign in or provide an email to like comments");
      return;
    }

    // Check if already liked
    const isLiked = likedComments.has(commentId);

    try {
      const updatedComment = await blogService.likeComment(
        commentId,
        isLiked ? "unlike" : "like",
      );

      // Update local state of liked comments
      const newLikedComments = new Set(likedComments);
      if (isLiked) {
        newLikedComments.delete(commentId);
      } else {
        newLikedComments.add(commentId);
      }
      setLikedComments(newLikedComments);

      // Update the comments list
      setComments(
        comments.map((comment) =>
          comment.$id === commentId ? updatedComment : comment,
        ),
      );
    } catch (err) {
      console.error("Error liking comment:", err);
      setError("Failed to like comment");
    }
  };

  return (
    <section className="mt-10 pt-8 border-t border-light-subtle/10 dark:border-dark-subtle/10">
      <h2 className="text-xl font-bold text-light-text dark:text-dark-text mb-6 flex items-center">
        <MessageCircle
          size={20}
          className="mr-2 text-light-accent dark:text-dark-accent"
        />
        Comments {comments.length > 0 && `(${comments.length})`}
      </h2>

      {/* Comment form */}
      <div className="mb-8 bg-glass rounded-lg p-4 border border-light-subtle/10 dark:border-dark-subtle/20">
        <form onSubmit={handleSubmitComment} className="space-y-4">
          {/* Anonymous toggle */}
          <div className="flex items-center justify-end space-x-2 mb-4">
            <label className="text-sm text-light-text dark:text-dark-text cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={toggleAnonymous}
                className="mr-2 accent-light-accent dark:accent-dark-accent"
              />
              Post anonymously
            </label>
          </div>

          {/* Commenter info - show only if not anonymous */}
          {!isAnonymous && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 bg-light-subtle/5 dark:bg-dark-subtle/5 rounded-md px-3 py-2">
                <User
                  size={16}
                  className="text-light-subtle dark:text-dark-subtle"
                />
                <input
                  type="text"
                  value={commenterName}
                  onChange={(e) => setCommenterName(e.target.value)}
                  placeholder="Your name *"
                  className="bg-transparent w-full border-none focus:ring-0 text-light-text dark:text-dark-text"
                  required={!isAnonymous}
                />
              </div>

              <div className="flex items-center space-x-2 bg-light-subtle/5 dark:bg-dark-subtle/5 rounded-md px-3 py-2">
                <AtSign
                  size={16}
                  className="text-light-subtle dark:text-dark-subtle"
                />
                <input
                  type="email"
                  value={commenterEmail}
                  onChange={(e) => setCommenterEmail(e.target.value)}
                  placeholder="Your email (optional)"
                  className="bg-transparent w-full border-none focus:ring-0 text-light-text dark:text-dark-text"
                />
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            {/* Avatar placeholder */}
            <div className="w-10 h-10 rounded-full bg-light-subtle/20 dark:bg-dark-subtle/20 flex items-center justify-center flex-shrink-0 text-light-text dark:text-dark-text">
              {isAnonymous
                ? "A"
                : commenterName
                  ? commenterName[0]?.toUpperCase()
                  : "?"}
            </div>

            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full px-3 py-2 rounded-md bg-light-subtle/10 dark:bg-dark-subtle/10 border border-light-subtle/20 dark:border-dark-subtle/20 focus:ring-light-accent dark:focus:ring-dark-accent focus:border-light-accent dark:focus:border-dark-accent text-light-text dark:text-dark-text min-h-[100px]"
                rows={3}
                required
              />

              <div className="mt-2 flex justify-between items-center">
                <p className="text-xs text-light-subtle dark:text-dark-subtle">
                  {isAnonymous ? "Posting anonymously" : "Comments are public"}
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting || !newComment.trim()}
                  className={`flex items-center px-4 py-2 bg-accent-gradient text-white rounded-md shadow-accent transition-all hover:scale-105 active:scale-95 ${
                    isSubmitting || !newComment.trim()
                      ? "opacity-70 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {isSubmitting ? (
                    "Posting..."
                  ) : (
                    <>
                      Post Comment
                      <Send size={16} className="ml-2" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-3 rounded-md bg-red-100/30 dark:bg-red-900/20 text-red-800 dark:text-red-300 flex items-center">
          <AlertCircle size={16} className="mr-2" />
          {error}
        </div>
      )}

      {/* Comments list */}
      <div className="space-y-6">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse flex space-x-4">
              <div className="w-10 h-10 rounded-full bg-light-subtle/20 dark:bg-dark-subtle/20"></div>
              <div className="flex-1 space-y-3">
                <div className="h-3 bg-light-subtle/20 dark:bg-dark-subtle/20 rounded w-1/4"></div>
                <div className="h-3 bg-light-subtle/20 dark:bg-dark-subtle/20 rounded w-full"></div>
                <div className="h-3 bg-light-subtle/20 dark:bg-dark-subtle/20 rounded w-3/4"></div>
              </div>
            </div>
          ))
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.$id}
              className="bg-glass rounded-lg p-4 border border-light-subtle/10 dark:border-dark-subtle/20"
            >
              <div className="flex items-start gap-3">
                {comment.user_avatar ? (
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={comment.user_avatar}
                      alt={comment.user_name || "User"}
                      width={40}
                      height={40}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-light-subtle/20 dark:bg-dark-subtle/20 flex items-center justify-center flex-shrink-0 text-light-text dark:text-dark-text">
                    {comment.user_name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-light-text dark:text-dark-text">
                        {comment.user_name || "Anonymous User"}
                      </div>
                      <div className="text-xs text-light-subtle dark:text-dark-subtle">
                        {formatDistanceToNow(new Date(comment.date), {
                          addSuffix: true,
                        })}
                      </div>
                    </div>

                    <button
                      className="text-light-subtle dark:text-dark-subtle hover:text-light-text dark:hover:text-dark-text transition-colors"
                      aria-label="Comment options"
                    >
                      <MoreVertical size={16} />
                    </button>
                  </div>

                  <p className="mt-2 text-light-text dark:text-dark-text whitespace-pre-wrap">
                    {comment.text}
                  </p>

                  <div className="mt-3 flex items-center gap-4">
                    <button
                      className={`text-light-subtle dark:text-dark-subtle hover:text-light-text 
                        dark:hover:text-dark-text transition-colors flex items-center text-xs
                        ${likedComments.has(comment.$id) ? "text-blue-500" : ""}`}
                      onClick={() => handleLike(comment.$id)}
                      disabled={isAnonymous || (!user && !commenterEmail)}
                      aria-label="Like comment"
                    >
                      <ThumbsUp size={14} className="mr-1" />
                      {comment.likes || 0}
                    </button>

                    <button
                      className="text-light-subtle dark:text-dark-subtle hover:text-light-text dark:hover:text-dark-text transition-colors flex items-center text-xs"
                      aria-label="Reply to comment"
                    >
                      <Reply size={14} className="mr-1" />
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-light-subtle dark:text-dark-subtle">
              No comments yet. Be the first to comment!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

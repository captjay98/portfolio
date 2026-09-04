"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@app/hooks/useAuth";
import {
  MessageSquare,
  Send,
  ThumbsUp,
  AlertCircle,
  User,
  AtSign,
  Shield,
  LoaderCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { blogService } from "@app/services/blogService";

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

function formatCommentDate(dateStr: string) {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
  } catch {
    return "recently";
  }
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
        setError("Unable to load comments. Please check your connection.");
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
    try {
      const storedLikes = localStorage.getItem(`blog_comment_likes_${postId}`);
      if (storedLikes) {
        setLikedComments(new Set(JSON.parse(storedLikes)));
      }
    } catch {}
  }, [postId]);

  // Save liked comments to localStorage when changed
  useEffect(() => {
    if (likedComments.size > 0) {
      try {
        localStorage.setItem(
          `blog_comment_likes_${postId}`,
          JSON.stringify(Array.from(likedComments)),
        );
      } catch {}
    }
  }, [likedComments, postId]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) {
      return;
    }

    if (!isAnonymous && !commenterName.trim()) {
      setError("Please enter your name or choose to post anonymously.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const newCommentData = {
        content_id: postId,
        text: newComment.trim(),
        date: new Date().toISOString(),
        user_name: isAnonymous ? "Anonymous" : commenterName.trim(),
        user_email: isAnonymous ? "" : commenterEmail.trim(),
      };

      const addedComment = await blogService.addComment(newCommentData);
      setComments([addedComment, ...comments]);
      setNewComment("");
    } catch (err) {
      console.error("Error posting comment:", err);
      setError("Failed to post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (commentId: string) => {
    const isLiked = likedComments.has(commentId);

    try {
      const updatedComment = await blogService.likeComment(
        commentId,
        isLiked ? "unlike" : "like",
      );

      const newLikedComments = new Set(likedComments);
      if (isLiked) {
        newLikedComments.delete(commentId);
      } else {
        newLikedComments.add(commentId);
      }
      setLikedComments(newLikedComments);

      setComments(
        comments.map((comment) =>
          comment.$id === commentId ? updatedComment : comment,
        ),
      );
    } catch (err) {
      console.error("Error liking comment:", err);
      setError("Unable to update reaction. Please try again.");
    }
  };

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="flex items-baseline justify-between pb-4 border-b border-light-subtle/15 dark:border-[#1e2430]">
        <div className="flex items-center gap-3">
          <h2 className="font-serif text-2xl text-light-text dark:text-[#ffffff] tracking-tight">
            Discussion
          </h2>
          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-light-subtle/10 dark:bg-[#131721] text-light-subtle dark:text-dark-subtle border border-light-subtle/15 dark:border-[#1e2430]">
            {comments.length} {comments.length === 1 ? "comment" : "comments"}
          </span>
        </div>
        <span className="text-xs font-mono text-light-subtle dark:text-dark-subtle/70 hidden sm:inline">
          Markdown supported
        </span>
      </div>

      {/* Comment Form Card */}
      <div className="rounded-xl border border-light-subtle/15 dark:border-[#1e2430] bg-light-background/60 dark:bg-[#131721]/60 p-5 sm:p-7 shadow-xs">
        <form onSubmit={handleSubmitComment} className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-light-subtle/10 dark:border-[#1e2430]">
            <span className="text-xs font-mono text-light-subtle dark:text-dark-subtle">
              {isAnonymous ? "Commenting as Anonymous" : "Leave a response"}
            </span>

            <button
              type="button"
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition-all border cursor-pointer ${
                isAnonymous
                  ? "bg-[#e6b450]/15 text-[#e6b450] border-[#e6b450]/40 font-semibold"
                  : "border-light-subtle/15 dark:border-[#1e2430] text-light-subtle dark:text-dark-subtle hover:text-light-text dark:hover:text-[#ffffff]"
              }`}
            >
              <Shield size={12} />
              <span>{isAnonymous ? "Anonymous Active" : "Post Anonymously"}</span>
            </button>
          </div>

          {/* Name & Email inputs - shown when not anonymous */}
          {!isAnonymous && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-light-subtle dark:text-dark-subtle mb-1.5">
                  Your Name <span className="text-[#e6b450]">*</span>
                </label>
                <div className="relative">
                  <User
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-light-subtle/60 dark:text-dark-subtle/60"
                  />
                  <input
                    type="text"
                    required
                    value={commenterName}
                    onChange={(e) => setCommenterName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-light-subtle/5 dark:bg-[#0a0e14] border border-light-subtle/15 dark:border-[#1e2430] focus:border-[#e6b450]/60 dark:focus:border-[#e6b450]/60 outline-none text-sm text-light-text dark:text-dark-text transition-colors placeholder:text-light-subtle/40 dark:placeholder:text-dark-subtle/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-light-subtle dark:text-dark-subtle mb-1.5">
                  Your Email <span className="text-[10px] lowercase text-light-subtle/60">(optional)</span>
                </label>
                <div className="relative">
                  <AtSign
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-light-subtle/60 dark:text-dark-subtle/60"
                  />
                  <input
                    type="email"
                    value={commenterEmail}
                    onChange={(e) => setCommenterEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-light-subtle/5 dark:bg-[#0a0e14] border border-light-subtle/15 dark:border-[#1e2430] focus:border-[#e6b450]/60 dark:focus:border-[#e6b450]/60 outline-none text-sm text-light-text dark:text-dark-text transition-colors placeholder:text-light-subtle/40 dark:placeholder:text-dark-subtle/40"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Comment Textarea */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-light-subtle dark:text-dark-subtle mb-1.5">
              Comment
            </label>
            <textarea
              required
              rows={4}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your perspective, questions, or architectural critiques..."
              className="w-full px-3.5 py-2.5 rounded-lg bg-light-subtle/5 dark:bg-[#0a0e14] border border-light-subtle/15 dark:border-[#1e2430] focus:border-[#e6b450]/60 dark:focus:border-[#e6b450]/60 outline-none text-sm text-light-text dark:text-dark-text transition-colors placeholder:text-light-subtle/40 dark:placeholder:text-dark-subtle/40 resize-y"
            />
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-mono flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Actions Footer */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-mono text-light-subtle dark:text-dark-subtle/70">
              Comments are public
            </span>

            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="px-5 py-2.5 rounded-lg bg-[#e6b450] text-[#0a0e14] font-mono text-xs font-semibold hover:bg-[#e6b450]/90 transition-all flex items-center gap-2 disabled:opacity-50 shadow-xs active:scale-[0.99] cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle size={13} className="animate-spin" />
                  <span>Posting...</span>
                </>
              ) : (
                <>
                  <span>Post Comment</span>
                  <Send size={13} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="p-5 rounded-xl border border-light-subtle/15 dark:border-[#1e2430] bg-light-background/40 dark:bg-[#131721]/40 animate-pulse space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-light-subtle/15 dark:bg-[#1e2430]" />
                  <div className="h-3 w-28 bg-light-subtle/15 dark:bg-[#1e2430] rounded" />
                </div>
                <div className="h-3 w-full bg-light-subtle/15 dark:bg-[#1e2430] rounded" />
                <div className="h-3 w-3/4 bg-light-subtle/15 dark:bg-[#1e2430] rounded" />
              </div>
            ))}
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => {
            const isLiked = likedComments.has(comment.$id);
            const initial = (comment.user_name || "A")[0]?.toUpperCase() || "A";

            return (
              <article
                key={comment.$id}
                className="rounded-xl border border-light-subtle/15 dark:border-[#1e2430] bg-light-background/60 dark:bg-[#131721]/60 p-5 sm:p-6 space-y-3 transition-colors"
              >
                {/* Author row */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {comment.user_avatar ? (
                      <img
                        src={comment.user_avatar}
                        alt={comment.user_name || "User"}
                        className="w-8 h-8 rounded-full object-cover border border-light-subtle/20 dark:border-[#1e2430]"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#e6b450]/10 border border-[#e6b450]/30 text-[#e6b450] font-mono text-xs font-semibold flex items-center justify-center">
                        {initial}
                      </div>
                    )}

                    <div>
                      <div className="font-serif text-sm text-light-text dark:text-dark-text font-medium flex items-center gap-2">
                        <span>{comment.user_name || "Anonymous User"}</span>
                        {comment.user_name === "Anonymous" && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-light-subtle/10 dark:bg-[#0a0e14] text-light-subtle dark:text-dark-subtle border border-light-subtle/10 dark:border-[#1e2430]">
                            guest
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-light-subtle dark:text-dark-subtle/70">
                        {formatCommentDate(comment.date)}
                      </div>
                    </div>
                  </div>

                  {/* Reaction Button */}
                  <button
                    type="button"
                    onClick={() => handleLike(comment.$id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono transition-all border cursor-pointer ${
                      isLiked
                        ? "bg-[#e6b450]/15 text-[#e6b450] border-[#e6b450]/40 font-semibold"
                        : "border-light-subtle/15 dark:border-[#1e2430] text-light-subtle dark:text-dark-subtle hover:text-light-text dark:hover:text-[#ffffff] hover:border-light-subtle/30"
                    }`}
                    aria-label="Like comment"
                  >
                    <ThumbsUp size={11} />
                    <span>{comment.likes || 0}</span>
                  </button>
                </div>

                {/* Comment Text */}
                <p className="text-sm sm:text-base font-sans text-light-text/90 dark:text-[#d9d7d3]/90 leading-relaxed whitespace-pre-wrap sm:pl-11">
                  {comment.text}
                </p>
              </article>
            );
          })
        ) : (
          <div className="py-12 px-6 rounded-xl border border-dashed border-light-subtle/20 dark:border-[#1e2430] text-center space-y-2">
            <MessageSquare
              size={24}
              className="mx-auto text-light-subtle/40 dark:text-dark-subtle/40"
            />
            <p className="font-serif text-base text-light-text dark:text-dark-text font-medium">
              No responses yet
            </p>
            <p className="text-xs font-mono text-light-subtle dark:text-dark-subtle max-w-sm mx-auto">
              Be the first to share your thoughts, critiques, or perspectives on this writing.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

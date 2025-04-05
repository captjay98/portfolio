/* eslint-disable  @typescript-eslint/no-explicit-any */
import {
  databases,
  ID,
  appwriteConfig,
  Query,
  BLOG_BUCKET_ID,
  COMMENTS_COLLECTION_ID,
  BLOG_POSTS_COLLECTION_ID,
} from "@/lib/appwrite";
import { BlogPostType, BlogSeriesType } from "../types/admin";
import { storageService } from "./storageService";

export const blogService = {
  // Helper function to convert Appwrite document to BlogPostType
  _mapDocumentToBlog(doc: any): BlogPostType {
    return {
      id: doc.$id,
      title: doc.title || "",
      slug: doc.slug || "",
      excerpt: doc.excerpt || "",
      content: doc.content || "",
      cover_image: doc.cover_image || "",
      cover_image_id: doc.cover_image_id || "",
      date: doc.date || "",
      reading_time: doc.reading_time || "",
      category_ids: doc.category_ids || [],
      tag_ids: doc.tag_ids || [],
      technology_ids: doc.technology_ids || [],
      status: doc.status || "draft",
      featured: doc.featured || false,
      series_id: doc.series_id || undefined,
      series_position: doc.series_position || undefined,
      related_post_ids: doc.related_post_ids || [],
      recommended_next_read_id: doc.recommended_next_read_id || "",
      created_at: doc.$createdAt,
      updated_at: doc.$updatedAt,
      read_count: doc.read_count || 0,
      likes: doc.likes ||    
 0,
    };
  },

  // Calculate reading time for content
  _calculateReadingTime(content: string): string {
    const wordsPerMinute = 225;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  },

  // Handle image operations
  async _handleImage(
    coverImageFile: File | undefined,
    existingImage_id?: string,
  ): Promise<{ image_id: string; imageUrl: string }> {
    let image_id = existingImage_id || "";
    let imageUrl = "";

    // If a new file is provided, upload it
    if (coverImageFile) {
      // Delete existing image if there is one
      if (existingImage_id) {
        try {
          await storageService.deleteFile(existingImage_id, BLOG_BUCKET_ID);
        } catch (error) {
          console.warn("Could not delete previous cover image:", error);
        }
      }

      // Upload new image
      image_id = await storageService.uploadFile(
        coverImageFile,
        BLOG_BUCKET_ID,
      );
      imageUrl = storageService.getFileView(image_id, BLOG_BUCKET_ID);
    } else if (existingImage_id) {
      // Use existing image
      imageUrl = storageService.getFileView(existingImage_id, BLOG_BUCKET_ID);
    }

    return { image_id, imageUrl };
  },

  // List all blogs
  getBlogs: async (): Promise<BlogPostType[]> => {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        BLOG_POSTS_COLLECTION_ID,
      );

      return response.documents.map((doc) =>
        blogService._mapDocumentToBlog(doc),
      );
    } catch (error) {
      console.error("Error fetching blogs:", error);
      throw error;
    }
  },

  // Get single blog by ID
  getBlog: async (id: string): Promise<BlogPostType> => {
    try {
      const response = await databases.getDocument(
        appwriteConfig.databaseId,
        BLOG_POSTS_COLLECTION_ID,
        id,
      );

      return blogService._mapDocumentToBlog(response);
    } catch (error) {
      console.error("Error fetching blog:", error);
      throw error;
    }
  },

  // Create a new blog
  createBlog: async (
    blogData: Omit<BlogPostType, "id" | "created_at" | "updated_at">,
    coverImageFile?: File,
  ): Promise<BlogPostType> => {
    try {
      // Make a clean copy of the blog data without any ID
      const { ...cleanBlogData } = blogData as any;

      // Handle image upload if provided
      const { image_id, imageUrl } =
        await blogService._handleImage(coverImageFile);

      // Calculate reading time if not provided
      if (!cleanBlogData.reading_time && cleanBlogData.content) {
        cleanBlogData.reading_time = blogService._calculateReadingTime(
          cleanBlogData.content,
        );
      }

      // Prepare the final data object
      const finalData = {
        ...cleanBlogData,
        cover_image: imageUrl || cleanBlogData.cover_image || "",
        cover_image_id: image_id || cleanBlogData.cover_image_id || "",
        date: cleanBlogData.date || new Date().toISOString().split("T")[0],
      };

      // Create the document with a unique ID
      const response = await databases.createDocument(
        appwriteConfig.databaseId,
        BLOG_POSTS_COLLECTION_ID,
        ID.unique(),
        finalData,
      );

      return blogService._mapDocumentToBlog(response);
    } catch (error) {
      console.error("Error creating blog:", error);
      throw error;
    }
  },

  // Update an existing blog
  updateBlog: async (
    id: string,
    blogData: Partial<Omit<BlogPostType, "id" | "created_at" | "updated_at">>,
    coverImageFile?: File,
  ): Promise<BlogPostType> => {
    try {
      // Handle image upload if provided
      const { image_id, imageUrl } = await blogService._handleImage(
        coverImageFile,
        blogData.cover_image_id,
      );

      // Calculate reading time if content was updated
      if (
        blogData.content &&
        (!blogData.reading_time || blogData.reading_time === "")
      ) {
        blogData.reading_time = blogService._calculateReadingTime(
          blogData.content,
        );
      }

      // Prepare the final data object
      const finalData = {
        ...blogData,
        cover_image: imageUrl || blogData.cover_image,
        cover_image_id: image_id || blogData.cover_image_id,
      };

      // Update the document
      const response = await databases.updateDocument(
        appwriteConfig.databaseId,
        BLOG_POSTS_COLLECTION_ID,
        id,
        finalData,
      );

      return blogService._mapDocumentToBlog(response);
    } catch (error) {
      console.error("Error updating blog:", error);
      throw error;
    }
  },

  // Delete a blog and its associated image
  deleteBlog: async (id: string): Promise<boolean> => {
    try {
      // Get the blog to access its image ID
      const blog = await blogService.getBlog(id);

      // Delete the document
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        BLOG_POSTS_COLLECTION_ID,
        id,
      );

      // Delete the cover image if it exists
      if (blog.cover_image_id) {
        try {
          await storageService.deleteFile(blog.cover_image_id, BLOG_BUCKET_ID);
        } catch (error) {
          console.warn("Could not delete blog cover image:", error);
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting blog:", error);
      throw error;
    }
  },

  // Get a URL for the cover image
  getCoverImageUrl: (image_id: string): string => {
    if (!image_id) {
      return "/blog/blog-placeholder.jpg";
    }

    if (image_id.startsWith("http") || image_id.startsWith("/")) {
      return image_id;
    }

    return storageService.getFileView(image_id, BLOG_BUCKET_ID);
  },

  // Get a preview URL for the cover image
  getCoverImagePreview: (
    image_id: string,
    width: number = 600,
    height: number = 400,
  ): string => {
    if (!image_id) {
      return "/blog/blog-placeholder.jpg";
    }

    if (
      (image_id.startsWith("http") || image_id.startsWith("/")) &&
      !image_id.includes(appwriteConfig.endpoint)
    ) {
      return image_id;
    }

    // Extract the ID from a full URL if needed
    if (
      image_id.includes(appwriteConfig.endpoint) &&
      image_id.includes("/storage/buckets/")
    ) {
      const parts = image_id.split("/");
      image_id = parts[parts.length - 1];
    }

    return storageService.getFilePreview(
      image_id,
      BLOG_BUCKET_ID,
      width,
      height,
    );
  },

  // ===== BLOG SERIES METHODS =====

  // Helper function to convert Appwrite document to BlogSeriesType
  _mapDocumentToSeries(doc: any): BlogSeriesType {
    return {
      id: doc.$id,
      title: doc.title || "",
      description: doc.description || "",
      slug: doc.slug || "",
      image: doc.image || "",
      image_id: doc.image_id || "",
      status: doc.status || "ongoing",
      created_at: doc.$createdAt,
      updated_at: doc.$updatedAt,
    };
  },

  // Get all blog series
  getAllSeries: async (): Promise<BlogSeriesType[]> => {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        "blog_series",
      );

      return response.documents.map((doc) =>
        blogService._mapDocumentToSeries(doc),
      );
    } catch (error) {
      console.error("Error fetching blog series:", error);
      throw error;
    }
  },

  // Get a single series by ID
  getSeries: async (id: string): Promise<BlogSeriesType | null> => {
    try {
      const response = await databases.getDocument(
        appwriteConfig.databaseId,
        "blog_series",
        id,
      );

      return blogService._mapDocumentToSeries(response);
    } catch (error) {
      console.error("Error fetching series:", error);
      return null;
    }
  },

  // Get a series by slug
  getSeriesBySlug: async (slug: string): Promise<BlogSeriesType | null> => {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        "blog_series",
        [Query.equal("slug", slug)],
      );

      if (response.documents.length === 0) {
        return null;
      }

      return blogService._mapDocumentToSeries(response.documents[0]);
    } catch (error) {
      console.error("Error fetching series by slug:", error);
      return null;
    }
  },

  // Create a new blog series
  createSeries: async (
    series: Omit<BlogSeriesType, "id" | "created_at" | "updated_at">,
    imageFile?: File,
  ): Promise<BlogSeriesType | null> => {
    try {
      let image_id = "";
      let imageUrl = series.image || "";

      // Handle image upload if provided
      if (imageFile) {
        image_id = await storageService.uploadFile(imageFile, BLOG_BUCKET_ID);
        imageUrl = storageService.getFileView(image_id, BLOG_BUCKET_ID);
      }

      // Create the series document
      const response = await databases.createDocument(
        appwriteConfig.databaseId,
        "blog_series",
        ID.unique(),
        {
          ...series,
          image: imageUrl,
          image_id: image_id,
        },
      );

      return blogService._mapDocumentToSeries(response);
    } catch (error) {
      console.error("Error creating series:", error);
      return null;
    }
  },

  // Update an existing series
  updateSeries: async (
    id: string,
    series: Partial<Omit<BlogSeriesType, "id" | "created_at" | "updated_at">>,
    imageFile?: File,
  ): Promise<BlogSeriesType | null> => {
    try {
      // Get existing series data first
      const existingSeries = await blogService.getSeries(id);
      if (!existingSeries) {
        throw new Error("Series not found");
      }

      let image_id = series.image_id || existingSeries.image_id || "";
      let imageUrl = series.image || existingSeries.image || "";

      // Handle image upload if a new file is provided
      if (imageFile) {
        // Delete old image if exists
        if (image_id) {
          try {
            await storageService.deleteFile(image_id, BLOG_BUCKET_ID);
          } catch (error) {
            console.error("Error deleting old image:", error);
          }
        }

        // Upload new image
        image_id = await storageService.uploadFile(imageFile, BLOG_BUCKET_ID);
        imageUrl = storageService.getFileView(image_id, BLOG_BUCKET_ID);
      }

      // Update the series document
      const response = await databases.updateDocument(
        appwriteConfig.databaseId,
        "blog_series",
        id,
        {
          ...series,
          image: imageUrl,
          image_id: image_id,
        },
      );

      return blogService._mapDocumentToSeries(response);
    } catch (error) {
      console.error("Error updating series:", error);
      return null;
    }
  },

  // Delete a series
  deleteSeries: async (id: string): Promise<boolean> => {
    try {
      // Get series to check for image
      const series = await blogService.getSeries(id);
      if (!series) {
        return false;
      }

      // Delete associated image if exists
      if (series.image_id) {
        try {
          await storageService.deleteFile(series.image_id, BLOG_BUCKET_ID);
        } catch (error) {
          console.error("Error deleting series image:", error);
        }
      }

      // Delete the series document
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        "blog_series",
        id,
      );

      return true;
    } catch (error) {
      console.error("Error deleting series:", error);
      return false;
    }
  },

  // ===== POSTS IN SERIES METHODS =====

  // Get posts in a series ordered by position
  getPostsInSeries: async (seriesId: string): Promise<BlogPostType[]> => {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        BLOG_POSTS_COLLECTION_ID,
        [
          Query.equal("series_id", seriesId),
          Query.orderAsc("series_position"), // Always order by position
        ],
      );

      return response.documents.map((doc) =>
        blogService._mapDocumentToBlog(doc),
      );
    } catch (error) {
      console.error("Error fetching posts in series:", error);
      return [];
    }
  },

  // ===== RELATED CONTENT METHODS =====

  // Get related posts for a blog post
  getRelatedPosts: async (postIds: string[]): Promise<BlogPostType[]> => {
    if (!postIds || postIds.length === 0) return [];

    try {
      // Create queries for each post ID
      const queries = postIds.map((id) => Query.equal("$id", id));

      // Combine with OR operator
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        BLOG_POSTS_COLLECTION_ID,
        [Query.or(queries)],
      );

      return response.documents.map((doc) =>
        blogService._mapDocumentToBlog(doc),
      );
    } catch (error) {
      console.error("Error fetching related posts:", error);
      return [];
    }
  },

  // Get recommended next read
  getRecommendedNextRead: async (
    postId: string,
  ): Promise<BlogPostType | null> => {
    try {
      // First get the current post to find its recommended_next_read_id
      const post = await blogService.getBlog(postId);

      if (!post.recommended_next_read_id) {
        return null;
      }

      // Then get the recommended next post
      const nextPost = await blogService.getBlog(post.recommended_next_read_id);
      return nextPost;
    } catch (error) {
      console.error("Error fetching recommended next read:", error);
      return null;
    }
  },

  // Add this new method to support static site generation
  getFeaturedAndRecentBlogs: async (
    limit: number = 10,
  ): Promise<BlogPostType[]> => {
    try {
      const allBlogs = await blogService.getBlogs();

      // Get featured blogs
      const featuredBlogs = allBlogs.filter(
        (blog) => blog.featured && blog.status === "published",
      );

      // Get recent blogs that aren't already in featured
      const recentBlogs = allBlogs
        .filter((blog) => !blog.featured && blog.status === "published")
        .sort((a, b) => {
          const dateA = new Date(a.date || a.created_at || "");
          const dateB = new Date(b.date || a.created_at || "");
          return dateB.getTime() - dateA.getTime();
        });

      // Combine, prioritizing featured, then limit
      const combined = [...featuredBlogs, ...recentBlogs].slice(0, limit);

      return combined;
    } catch (error) {
      console.error("Error fetching featured and recent blogs:", error);
      return [];
    }
  },

  getBlogBySlug: async (slug: string): Promise<BlogPostType | null> => {
    try {
      // First attempt to get all blogs and find by slug
      const allBlogs = await blogService.getBlogs();
      const blog = allBlogs.find((b) => b.slug === slug);

      if (!blog) {
        return null;
      }

      // Get full blog content if needed
      return await blogService.getBlog(blog.id);
    } catch (error) {
      console.error("Error fetching blog by slug:", error);
      return null;
    }
  },

  // Get comments for a post
  getComments: async (postId: string) => {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        COMMENTS_COLLECTION_ID,
        [Query.equal("content_id", postId), Query.orderDesc("$createdAt")],
      );

      return response.documents.map((doc) => ({
        $id: doc.$id,
        content_id: doc.content_id,
        user_id: doc.user_id,
        user_name: doc.user_name,
        user_email: doc.user_email,
        user_avatar: doc.user_avatar,
        text: doc.text,
        date: doc.date || doc.$createdAt,
        likes: doc.likes || 0,
      }));
    } catch (error) {
      console.error("Error fetching comments:", error);
      return [];
    }
  },

  // Add a comment to a post
  addComment: async (commentData: {
    content_id: string;
    text: string;
    date: string;
    user_name?: string;
    user_email?: string;
  }) => {
    try {
      // Generate a unique user ID for the comment
      const uniqueId = ID.unique();

      const response = await databases.createDocument(
        appwriteConfig.databaseId,
        COMMENTS_COLLECTION_ID,
        ID.unique(),
        {
          ...commentData,
          user_id: uniqueId,
          user_name: commentData.user_name || "Anonymous",
          user_email: commentData.user_email || "",
          user_avatar: null,
        },
      );

      return {
        $id: response.$id,
        content_id: response.content_id,
        user_id: response.user_id,
        user_name: response.user_name,
        user_email: response.user_email,
        user_avatar: response.user_avatar,
        text: response.text,
        date: response.date || response.$createdAt,
        likes: response.likes || 0,
      };
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  },

  // Updated method to increment or decrement likes
  likeComment: async (commentId: string, action: "like" | "unlike") => {
    try {
      const comment = await databases.getDocument(
        appwriteConfig.databaseId,
        COMMENTS_COLLECTION_ID,
        commentId,
      );

      // Get current likes count
      let likes = comment.likes || 0;

      // Increment or decrement based on action
      if (action === "like") {
        likes += 1;
      } else if (action === "unlike" && likes > 0) {
        likes -= 1;
      }

      // Update the comment with new likes count
      const updatedComment = await databases.updateDocument(
        appwriteConfig.databaseId,
        COMMENTS_COLLECTION_ID,
        commentId,
        { likes },
      );

      return {
        $id: updatedComment.$id,
        content_id: updatedComment.content_id,
        user_id: updatedComment.user_id,
        user_name: updatedComment.user_name,
        user_email: updatedComment.user_email,
        user_avatar: updatedComment.user_avatar,
        text: updatedComment.text,
        date: updatedComment.date || updatedComment.$createdAt,
        likes: updatedComment.likes || 0,
      };
    } catch (error) {
      console.error("Error updating comment likes:", error);
      throw error;
    }
  },

  // Increment read count for a blog post
  incrementReadCount: async (id: string): Promise<void> => {
    try {
      const blog = await blogService.getBlog(id);
      const currentReadCount = blog.read_count || 0;
      
      await databases.updateDocument(
        appwriteConfig.databaseId,
        BLOG_POSTS_COLLECTION_ID,
        id,
        {
          read_count: currentReadCount + 1,
        }
      );
    } catch (error) {
      console.error("Error incrementing read count:", error);
      throw error;
    }
  },

  // Toggle like for a blog post
  toggleLike: async (id: string): Promise<BlogPostType> => {
    try {
      const blog = await blogService.getBlog(id);
      const currentLikes = blog.likes || 0;
      
      const response = await databases.updateDocument(
        appwriteConfig.databaseId,
        BLOG_POSTS_COLLECTION_ID,
        id,
        {
          likes: currentLikes + 1,
        }
      );

      return blogService._mapDocumentToBlog(response);
    } catch (error) {
      console.error("Error toggling like:", error);
      throw error;
    }
  },
};

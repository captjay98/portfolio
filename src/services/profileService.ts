import {
  databases,
  ID,
  appwriteConfig,
  PROFILE_COLLECTION_ID,
  SOCIAL_LINKS_COLLECTION_ID,
  USES_COLLECTION_ID,
  PORTFOLIO_BUCKET_ID,
  account,
} from "@/lib/appwrite";
import { storageService } from "./storageService";
import { ProfileType, SocialLinkType, UsesItemType } from "../types/admin";

export const profileService = {
  // Get profile data
  getProfile: async (): Promise<ProfileType | null> => {
    try {
      // Profile collection typically has only one document
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        PROFILE_COLLECTION_ID,
      );

      if (response.documents.length === 0) {
        return null;
      }

      const doc = response.documents[0];
      return {
        id: doc.$id,
        full_name: doc.full_name || "",
        nickname: doc.nickname || "",
        title: doc.title || "",
        bio_short: doc.bio_short || "",
        bio_long: doc.bio_long || "",
        location: doc.location || "",
        avatar: doc.avatar || "",
        avatar_id: doc.avatar_id || "",
        cover_image: doc.cover_image || "",
        cover_image_id: doc.cover_image_id || "",
        resume_url: doc.resume_url || "",
        meta_description: doc.meta_description || "",
        created_at: doc.$createdAt,
        updated_at: doc.$updatedAt,
      };
    } catch (error) {
      console.error("Error fetching profile data:", error);
      return null;
    }
  },

  // Get social links
  getSocialLinks: async (): Promise<SocialLinkType[]> => {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        SOCIAL_LINKS_COLLECTION_ID,
      );

      return response.documents.map((doc) => ({
        id: doc.$id,
        platform: doc.platform || "",
        url: doc.url || "",
        icon: doc.icon || "",
        priority: doc.priority || 0,
        is_visible: doc.is_visible ?? true,
        created_at: doc.$createdAt,
        updated_at: doc.$updatedAt,
      }));
    } catch (error) {
      console.error("Error fetching social links:", error);
      return [];
    }
  },

  // Get uses items grouped by category
  getUses: async (): Promise<Record<string, UsesItemType[]>> => {
    try {
      const items = await profileService.getAllUses();

      // Group by category
      const groupedItems: Record<string, UsesItemType[]> = {};
      items.forEach((item) => {
        if (!groupedItems[item.category_id]) {
          groupedItems[item.category_id] = [];
        }
        groupedItems[item.category_id].push(item);
      });

      // Sort items within each category by priority
      Object.keys(groupedItems).forEach((category) => {
        groupedItems[category].sort((a, b) => a.priority - b.priority);
      });

      return groupedItems;
    } catch (error) {
      console.error("Error fetching grouped uses items:", error);
      return {};
    }
  },

  // Get all uses items (not grouped)
  getAllUses: async (): Promise<UsesItemType[]> => {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        USES_COLLECTION_ID,
      );

      return response.documents.map((doc) => ({
        id: doc.$id,
        category_id: doc.category_id,
        name: doc.name,
        description: doc.description,
        link: doc.link,
        image: doc.image,
        image_id: doc.image_id,
        is_favorite: doc.is_favorite,
        priority: doc.priority,
        created_at: doc.$createdAt,
        updated_at: doc.$updatedAt,
      }));
    } catch (error) {
      console.error("Error fetching all uses items:", error);
      return [];
    }
  },

  // Update profile
  updateProfile: async (
    data: Partial<Omit<ProfileType, "id" | "created_at" | "updated_at">>,
    avatarFile?: File,
    coverFile?: File,
  ): Promise<ProfileType | null> => {
    try {
      // Get existing profile first
      const profile = await profileService.getProfile();
      if (!profile) {
        throw new Error("Profile not found");
      }

      // Handle avatar upload if provided
      let avatarId = profile.avatar_id || "";
      let avatarUrl = profile.avatar || "";
      if (avatarFile) {
        // Delete old avatar if exists
        if (profile.avatar_id) {
          try {
            await storageService.deleteFile(
              profile.avatar_id,
              PORTFOLIO_BUCKET_ID,
            );
          } catch (error) {
            console.warn("Could not delete old avatar:", error);
          }
        }
        // Upload new avatar
        avatarId = await storageService.uploadFile(
          avatarFile,
          PORTFOLIO_BUCKET_ID,
        );
        avatarUrl = storageService.getFileView(avatarId, PORTFOLIO_BUCKET_ID);
      }

      // Handle cover image upload if provided
      let coverId = profile.cover_image_id || "";
      let coverUrl = profile.cover_image || "";
      if (coverFile) {
        // Delete old cover if exists
        if (profile.cover_image_id) {
          try {
            await storageService.deleteFile(
              profile.cover_image_id,
              PORTFOLIO_BUCKET_ID,
            );
          } catch (error) {
            console.warn("Could not delete old cover image:", error);
          }
        }
        // Upload new cover
        coverId = await storageService.uploadFile(
          coverFile,
          PORTFOLIO_BUCKET_ID,
        );
        coverUrl = storageService.getFileView(coverId, PORTFOLIO_BUCKET_ID);
      }

      // Update the profile
      const response = await databases.updateDocument(
        appwriteConfig.databaseId,
        PROFILE_COLLECTION_ID,
        profile.id,
        {
          ...data,
          avatar: avatarUrl,
          avatar_id: avatarId,
          cover_image: coverUrl,
          cover_image_id: coverId,
        },
      );

      return {
        id: response.$id,
        full_name: response.full_name || "",
        nickname: response.nickname || "",
        title: response.title || "",
        bio_short: response.bio_short || "",
        bio_long: response.bio_long || "",
        location: response.location || "",
        avatar: response.avatar || "",
        avatar_id: response.avatar_id || "",
        cover_image: response.cover_image || "",
        cover_image_id: response.cover_image_id || "",
        resume_url: response.resume_url || "",
        meta_description: response.meta_description || "",
        created_at: response.$createdAt,
        updated_at: response.$updatedAt,
      };
    } catch (error) {
      console.error("Error updating profile:", error);
      return null;
    }
  },

  // New method to upload resume
  uploadResume: async (file: File): Promise<string> => {
    try {
      // Get existing profile
      const profile = await profileService.getProfile();
      if (!profile) {
        throw new Error("Profile not found");
      }

      // Delete old resume if exists
      if (profile.resume_url && profile.resume_url.includes("storage.")) {
        try {
          // Extract file ID from URL if it's an Appwrite storage URL
          const resumeFileId = profile.resume_url.split("/").pop();
          if (resumeFileId) {
            await storageService.deleteFile(resumeFileId, PORTFOLIO_BUCKET_ID);
          }
        } catch (error) {
          console.warn("Could not delete old resume file:", error);
        }
      }

      // Upload new resume
      const fileId = await storageService.uploadFile(file, PORTFOLIO_BUCKET_ID);
      const fileUrl = storageService.getFileView(fileId, PORTFOLIO_BUCKET_ID);

      // Update profile with new resume URL
      if (profile.id) {
        await databases.updateDocument(
          appwriteConfig.databaseId,
          PROFILE_COLLECTION_ID,
          profile.id,
          { resume_url: fileUrl },
        );
      }

      return fileUrl;
    } catch (error) {
      console.error("Error uploading resume:", error);
      throw error;
    }
  },

  // Create a social link
  createSocialLink: async (
    data: Omit<SocialLinkType, "id" | "created_at" | "updated_at">,
  ): Promise<SocialLinkType> => {
    try {
      const response = await databases.createDocument(
        appwriteConfig.databaseId,
        SOCIAL_LINKS_COLLECTION_ID,
        ID.unique(),
        data,
      );

      return {
        id: response.$id,
        platform: response.platform,
        url: response.url,
        icon: response.icon,
        priority: response.priority,
        is_visible: response.is_visible,
        created_at: response.$createdAt,
        updated_at: response.$updatedAt,
      };
    } catch (error) {
      console.error("Error creating social link:", error);
      throw error;
    }
  },

  // Update a social link
  updateSocialLink: async (
    id: string,
    data: Partial<Omit<SocialLinkType, "id" | "created_at" | "updated_at">>,
  ): Promise<SocialLinkType> => {
    try {
      const response = await databases.updateDocument(
        appwriteConfig.databaseId,
        SOCIAL_LINKS_COLLECTION_ID,
        id,
        data,
      );

      return {
        id: response.$id,
        platform: response.platform,
        url: response.url,
        icon: response.icon,
        priority: response.priority,
        is_visible: response.is_visible,
        created_at: response.$createdAt,
        updated_at: response.$updatedAt,
      };
    } catch (error) {
      console.error("Error updating social link:", error);
      throw error;
    }
  },

  // Delete a social link
  deleteSocialLink: async (id: string): Promise<boolean> => {
    try {
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        SOCIAL_LINKS_COLLECTION_ID,
        id,
      );
      return true;
    } catch (error) {
      console.error("Error deleting social link:", error);
      throw error;
    }
  },

  // Create a uses item
  createUsesItem: async (
    data: Omit<UsesItemType, "id" | "created_at" | "updated_at">,
    imageFile?: File,
  ): Promise<UsesItemType> => {
    try {
      let imageId = "";
      let imageUrl = data.image || "";

      // Handle image upload if provided
      if (imageFile) {
        imageId = await storageService.uploadFile(
          imageFile,
          PORTFOLIO_BUCKET_ID,
        );
        imageUrl = storageService.getFileView(imageId, PORTFOLIO_BUCKET_ID);
      }

      const response = await databases.createDocument(
        appwriteConfig.databaseId,
        USES_COLLECTION_ID,
        ID.unique(),
        {
          ...data,
          image: imageUrl,
          image_id: imageId,
        },
      );

      return {
        id: response.$id,
        category_id: response.category_id,
        name: response.name,
        description: response.description,
        link: response.link,
        image: response.image,
        image_id: response.image_id,
        is_favorite: response.is_favorite,
        priority: response.priority,
        created_at: response.$createdAt,
        updated_at: response.$updatedAt,
      };
    } catch (error) {
      console.error("Error creating uses item:", error);
      throw error;
    }
  },

  // Update a uses item
  updateUsesItem: async (
    id: string,
    data: Partial<Omit<UsesItemType, "id" | "created_at" | "updated_at">>,
    imageFile?: File,
  ): Promise<UsesItemType> => {
    try {
      // Get existing item to check for image
      const existingItem = await databases.getDocument(
        appwriteConfig.databaseId,
        USES_COLLECTION_ID,
        id,
      );

      let imageId = existingItem.image_id || "";
      let imageUrl = existingItem.image || "";

      // Handle image upload if provided
      if (imageFile) {
        // Delete old image if exists
        if (imageId) {
          try {
            await storageService.deleteFile(imageId, PORTFOLIO_BUCKET_ID);
          } catch (error) {
            console.warn("Could not delete old image:", error);
          }
        }

        // Upload new image
        imageId = await storageService.uploadFile(
          imageFile,
          PORTFOLIO_BUCKET_ID,
        );
        imageUrl = storageService.getFileView(imageId, PORTFOLIO_BUCKET_ID);
      }

      const response = await databases.updateDocument(
        appwriteConfig.databaseId,
        USES_COLLECTION_ID,
        id,
        {
          ...data,
          image: imageUrl,
          image_id: imageId,
        },
      );

      return {
        id: response.$id,
        category_id: response.category_id,
        name: response.name,
        description: response.description,
        link: response.link,
        image: response.image,
        image_id: response.image_id,
        is_favorite: response.is_favorite,
        priority: response.priority,
        created_at: response.$createdAt,
        updated_at: response.$updatedAt,
      };
    } catch (error) {
      console.error("Error updating uses item:", error);
      throw error;
    }
  },

  // Delete a uses item
  deleteUsesItem: async (id: string): Promise<boolean> => {
    try {
      // Get item to check for image
      const item = await databases.getDocument(
        appwriteConfig.databaseId,
        USES_COLLECTION_ID,
        id,
      );

      // Delete associated image if exists
      if (item.image_id) {
        try {
          await storageService.deleteFile(item.image_id, PORTFOLIO_BUCKET_ID);
        } catch (error) {
          console.warn("Could not delete item image:", error);
        }
      }

      await databases.deleteDocument(
        appwriteConfig.databaseId,
        USES_COLLECTION_ID,
        id,
      );

      return true;
    } catch (error) {
      console.error("Error deleting uses item:", error);
      throw error;
    }
  },

  // Add these methods to the profileService
  updateProfileName: async (fullName: string) => {
    try {
      if (account === null) {
        throw new Error("Account is not initialized");
      }

      await account.updateName(fullName);

      return { success: true };
    } catch (error) {
      console.error("Error updating profile name:", error);
      throw error;
    }
  },

  updatePassword: async (currentPassword: string, newPassword: string) => {
    try {
      if (account === null) {
        throw new Error("Account is not initialized");
      }

      await account.updatePassword(newPassword, currentPassword);
      return { success: true };
    } catch (error) {
      console.error("Error updating password:", error);
      throw error;
    }
  },

  // Add this new method to the profileService
  updateProfileEmail: async (email: string, password: string) => {
    try {
      if (account === null) {
        throw new Error("Account is not initialized");
      }

      await account.updateEmail(email, password);
      return { success: true };
    } catch (error) {
      console.error("Error updating email:", error);
      throw error;
    }
  },
};

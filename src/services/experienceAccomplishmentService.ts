import {
  databases,
  ID,
  Query,
  appwriteConfig,
  EXPERIENCE_ACCOMPLISHMENTS_COLLECTION_ID,
} from "@/lib/appwrite";
import { ExperienceAccomplishmentType } from "../types/admin";

export const experienceAccomplishmentService = {
  getAccomplishmentsByExperience: async (
    experienceId: string,
  ): Promise<ExperienceAccomplishmentType[]> => {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        EXPERIENCE_ACCOMPLISHMENTS_COLLECTION_ID,
        [Query.equal("experience_id", experienceId)],
      );

      return response.documents.map((doc, index) => ({
        id: doc.$id,
        experience_id: doc.experience_id,
        text: doc.text,
        order: index,
        created_at: doc.$createdAt,
        updated_at: doc.$updatedAt,
      }));
    } catch (error) {
      console.error("Error fetching accomplishments:", error);
      throw error;
    }
  },

  createAccomplishment: async (
    accomplishment: Omit<
      ExperienceAccomplishmentType,
      "id" | "created_at" | "updated_at"
    >,
  ) => {
    // Don't exclude order anymore, it's required by the Appwrite collection
    const data = {
      experience_id: accomplishment.experience_id,
      text: accomplishment.text,
      order: accomplishment.order || 0, // Provide a default value if not provided
    };

    const response = await databases.createDocument(
      appwriteConfig.databaseId,
      EXPERIENCE_ACCOMPLISHMENTS_COLLECTION_ID,
      ID.unique(),
      data,
    );

    return {
      id: response.$id,
      experience_id: response.experience_id,
      text: response.text,
      order: response.order,
      created_at: response.$createdAt,
      updated_at: response.$updatedAt,
    };
  },

  updateAccomplishment: async (
    id: string,
    accomplishment: Partial<
      Omit<ExperienceAccomplishmentType, "id" | "created_at" | "updated_at">
    >,
  ) => {
    const response = await databases.updateDocument(
      appwriteConfig.databaseId,
      EXPERIENCE_ACCOMPLISHMENTS_COLLECTION_ID,
      id,
      accomplishment,
    );
    return {
      id: response.$id,
      experience_id: response.experience_id,
      text: response.text,
      order: response.order,
      created_at: response.$createdAt,
      updated_at: response.$updatedAt,
    };
  },

  deleteAccomplishment: async (id: string) => {
    return await databases.deleteDocument(
      appwriteConfig.databaseId,
      EXPERIENCE_ACCOMPLISHMENTS_COLLECTION_ID,
      id,
    );
  },

  // Delete all accomplishments for an experience
  deleteAccomplishmentsForExperience: async (experienceId: string) => {
    try {
      const accomplishments =
        await experienceAccomplishmentService.getAccomplishmentsByExperience(
          experienceId,
        );

      const deletePromises = accomplishments.map((accomplishment) =>
        databases.deleteDocument(
          appwriteConfig.databaseId,
          EXPERIENCE_ACCOMPLISHMENTS_COLLECTION_ID,
          accomplishment.id,
        ),
      );

      await Promise.all(deletePromises);
      return true;
    } catch (error) {
      console.error("Error deleting accomplishments:", error);
      throw error;
    }
  },
};

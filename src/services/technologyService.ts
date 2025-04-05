import { databases, ID, appwriteConfig, TECHNOLOGIES_COLLECTION_ID } from "@/lib/appwrite";
import { TechnologyType } from "../types/admin";

export const technologyService = {
  getTechnologies: async (): Promise<TechnologyType[]> => {
    try {
      // Fetch categories and technologies in parallel
      const techResponse = await databases.listDocuments(
        appwriteConfig.databaseId,
        TECHNOLOGIES_COLLECTION_ID,
      );

      return techResponse.documents.map((doc) => ({
        id: doc.$id,
        name: doc.name,
        category_id: doc.category_id,
        icon: doc.icon,
        website: doc.website,
        created_at: doc.$createdAt,
        updated_at: doc.$updatedAt,
      }));
    } catch (error) {
      console.error("Error fetching technologies:", error);
      throw error;
    }
  },

  createTechnology: async (
    technology: Omit<TechnologyType, "id" | "created_at" | "updated_at">,
  ) => {
    const response = await databases.createDocument(
      appwriteConfig.databaseId,
      TECHNOLOGIES_COLLECTION_ID,
      ID.unique(),
      technology,
    );
    return {
      id: response.$id,
      name: response.name,
      category_id: response.category_id,
      icon: response.icon,
      website: response.website,
      created_at: response.$createdAt,
      updated_at: response.$updatedAt,
    };
  },

  updateTechnology: async (
    id: string,
    technology: Partial<
      Omit<TechnologyType, "id" | "created_at" | "updated_at">
    >,
  ) => {
    const response = await databases.updateDocument(
      appwriteConfig.databaseId,
      TECHNOLOGIES_COLLECTION_ID,
      id,
      technology,
    );
    return {
      id: response.$id,
      name: response.name,
      category_id: response.category_id,
      icon: response.icon,
      website: response.website,
      created_at: response.$createdAt,
      updated_at: response.$updatedAt,
    };
  },

  deleteTechnology: async (id: string) => {
    return await databases.deleteDocument(
      appwriteConfig.databaseId,
      TECHNOLOGIES_COLLECTION_ID,
      id,
    );
  },
};

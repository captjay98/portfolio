import { databases, ID, appwriteConfig, CATEGORIES_COLLECTION_ID } from "@/lib/appwrite";
import { CategoryType } from "../types/admin";

export const categoryService = {
  getCategories: async (): Promise<CategoryType[]> => {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        CATEGORIES_COLLECTION_ID,
      );

      return response.documents.map((doc) => ({
        id: doc.$id,
        name: doc.name,
        description: doc.description,
        parent_id: doc.parent_id,
        created_at: doc.$createdAt,
        updated_at: doc.$updatedAt,
      }));
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  createCategory: async (
    category: Omit<CategoryType, "id" | "created_at" | "updated_at">,
  ) => {
    const response = await databases.createDocument(
      appwriteConfig.databaseId,
      CATEGORIES_COLLECTION_ID,
      ID.unique(),
      category,
    );
    return {
      id: response.$id,
      name: response.name,
      description: response.description,
      parent_id: response.parent_id,
      created_at: response.$createdAt,
      updated_at: response.$updatedAt,
    };
  },

  updateCategory: async (
    id: string,
    category: Partial<Omit<CategoryType, "id" | "created_at" | "updated_at">>,
  ) => {
    const response = await databases.updateDocument(
      appwriteConfig.databaseId,
      CATEGORIES_COLLECTION_ID,
      id,
      category,
    );
    return {
      id: response.$id,
      name: response.name,
      description: response.description,
      parent_id: response.parent_id,
      created_at: response.$createdAt,
      updated_at: response.$updatedAt,
    };
  },

  deleteCategory: async (id: string) => {
    return await databases.deleteDocument(
      appwriteConfig.databaseId,
      CATEGORIES_COLLECTION_ID,
      id,
    );
  },
};

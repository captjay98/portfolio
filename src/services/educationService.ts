import {
  databases,
  ID,
  appwriteConfig,
  EDUCATION_COLLECTION_ID,
} from "@/lib/appwrite";
import { EducationType } from "../types/admin";

export const educationService = {
  getEducation: async (): Promise<EducationType[]> => {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        EDUCATION_COLLECTION_ID,
      );

      const educationItems = response.documents.map((doc) => ({
        id: doc.$id,
        degree: doc.degree,
        institution: doc.institution,
        location: doc.location,
        start_date: doc.start_date,
        end_date: doc.end_date,
        description: doc.description,
        is_current: doc.is_current,
        priority: doc.priority,
        created_at: doc.$createdAt,
        updated_at: doc.$updatedAt,
      }));

      // Sort by priority
      return educationItems.sort((a, b) => a.priority - b.priority);
    } catch (error) {
      console.error("Error fetching education:", error);
      return [];
    }
  },

  createEducation: async (
    education: Omit<EducationType, "id" | "created_at" | "updated_at">,
  ) => {
    const response = await databases.createDocument(
      appwriteConfig.databaseId,
      EDUCATION_COLLECTION_ID,
      ID.unique(),
      education,
    );
    return {
      id: response.$id,
      degree: response.degree,
      institution: response.institution,
      location: response.location,
      start_date: response.start_date,
      end_date: response.end_date,
      description: response.description,
      is_current: response.is_current,
      priority: response.priority,
      created_at: response.$createdAt,
      updated_at: response.$updatedAt,
    };
  },

  updateEducation: async (
    id: string,
    education: Partial<Omit<EducationType, "id" | "created_at" | "updated_at">>,
  ) => {
    const response = await databases.updateDocument(
      appwriteConfig.databaseId,
      EDUCATION_COLLECTION_ID,
      id,
      education,
    );
    return {
      id: response.$id,
      degree: response.degree,
      institution: response.institution,
      location: response.location,
      start_date: response.start_date,
      end_date: response.end_date,
      description: response.description,
      is_current: response.is_current,
      priority: response.priority,
      created_at: response.$createdAt,
      updated_at: response.$updatedAt,
    };
  },

  deleteEducation: async (id: string) => {
    return await databases.deleteDocument(
      appwriteConfig.databaseId,
      EDUCATION_COLLECTION_ID,
      id,
    );
  },
};

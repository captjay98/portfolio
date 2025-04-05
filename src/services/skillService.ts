import { databases, ID, appwriteConfig, SKILLS_COLLECTION_ID } from "@/lib/appwrite";
import { SkillType } from "../types/admin";

// Helper function to convert Appwrite document to SkillType
// const mapDocumentToSkill = (doc: Models.Document): SkillType => ({
// id: doc.$id,
// name: doc.name,
// domain_category_id: doc.domain_category_id,
// technology_id: doc.technology_id,
// level: doc.level,
// years: doc.years,
// created_at: doc.$createdAt,
// updated_at: doc.$updatedAt,
// });

export const skillService = {
  getSkills: async (): Promise<SkillType[]> => {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        SKILLS_COLLECTION_ID,
      );

      return response.documents.map((doc) => ({
        id: doc.$id,
        name: doc.name,
        category_id: doc.category_id,
        technology_id: doc.technology_id,
        level: doc.level,
        years: doc.years,
        created_at: doc.$createdAt,
        updated_at: doc.$updatedAt,
      }));
    } catch (error) {
      console.error("Error fetching skills:", error);
      throw error;
    }
  },

  createSkill: async (
    skill: Omit<SkillType, "id" | "created_at" | "updated_at">,
  ) => {
    const response = await databases.createDocument(
      appwriteConfig.databaseId,
      SKILLS_COLLECTION_ID,
      ID.unique(),
      skill,
    );
    return {
      id: response.$id,
      name: response.name,
      category_id: response.category_id,
      technology_id: response.technology_id,
      level: response.level,
      years: response.years,
      created_at: response.$createdAt,
      updated_at: response.$updatedAt,
    };
  },

  updateSkill: async (
    id: string,
    skill: Partial<Omit<SkillType, "id" | "created_at" | "updated_at">>,
  ) => {
    const response = await databases.updateDocument(
      appwriteConfig.databaseId,
      SKILLS_COLLECTION_ID,
      id,
      skill,
    );
    return {
      id: response.$id,
      name: response.name,
      category_id: response.category_id,
      technology_id: response.technology_id,
      level: response.level,
      years: response.years,
      created_at: response.$createdAt,
      updated_at: response.$updatedAt,
    };
  },

  deleteSkill: async (id: string) => {
    return await databases.deleteDocument(
      appwriteConfig.databaseId,
      SKILLS_COLLECTION_ID,
      id,
    );
  },
};

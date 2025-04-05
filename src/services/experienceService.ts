import {
  databases,
  ID,
  appwriteConfig,
  EXPERIENCES_COLLECTION_ID,
} from "@/lib/appwrite";
import { ExperienceType } from "../types/admin";
import { categoryService } from "./categoryService";
import { technologyService } from "./technologyService";

export const experienceService = {
  getExperiences: async (): Promise<ExperienceType[]> => {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        EXPERIENCES_COLLECTION_ID,
      );

      return response.documents.map((doc) => ({
        id: doc.$id,
        title: doc.title || "",
        company: doc.company || "",
        location: doc.location || "",
        start_date: doc.start_date || "",
        end_date: doc.end_date || null,
        description: doc.description || "",
        category_ids: doc.category_ids || [],
        technology_ids: doc.technology_ids || [],
        created_at: doc.$createdAt,
        updated_at: doc.$updatedAt,
      }));
    } catch (error) {
      console.error("Error fetching experiences:", error);
      return [];
    }
  },

  createExperience: async (
    experience: Omit<ExperienceType, "id" | "created_at" | "updated_at">,
  ) => {
    const response = await databases.createDocument(
      appwriteConfig.databaseId,
      EXPERIENCES_COLLECTION_ID,
      ID.unique(),
      experience,
    );
    return {
      id: response.$id,
      title: response.title,
      company: response.company,
      location: response.location,
      start_date: response.start_date,
      end_date: response.end_date,
      description: response.description,
      category_ids: response.category_ids || [],
      technology_ids: response.technology_ids || [],
      created_at: response.$createdAt,
      updated_at: response.$updatedAt,
    };
  },

  updateExperience: async (
    id: string,
    experience: Partial<
      Omit<ExperienceType, "id" | "created_at" | "updated_at">
    >,
  ) => {
    const response = await databases.updateDocument(
      appwriteConfig.databaseId,
      EXPERIENCES_COLLECTION_ID,
      id,
      experience,
    );
    return {
      id: response.$id,
      title: response.title,
      company: response.company,
      location: response.location,
      start_date: response.start_date,
      end_date: response.end_date,
      description: response.description,
      category_ids: response.category_ids || [],
      technology_ids: response.technology_ids || [],
      created_at: response.$createdAt,
      updated_at: response.$updatedAt,
    };
  },

  deleteExperience: async (id: string) => {
    return await databases.deleteDocument(
      appwriteConfig.databaseId,
      EXPERIENCES_COLLECTION_ID,
      id,
    );
  },

  // New method to get experiences with resolved tech and category names
  getExperiencesWithNames: async (): Promise<ExperienceType[]> => {
    try {
      // Fetch experiences, technology_ids, and categories in parallel
      const [experiences, technology_ids, categories] = await Promise.all([
        experienceService.getExperiences(),
        technologyService.getTechnologies(),
        categoryService.getCategories(),
      ]);

      // Create maps for quick lookup
      const techMap = technology_ids.reduce<Record<string, string>>(
        (map, tech) => {
          map[tech.id] = tech.name;
          return map;
        },
        {},
      );

      const catMap = categories.reduce<Record<string, string>>((map, cat) => {
        map[cat.id] = cat.name;
        return map;
      }, {});

      // Replace IDs with names in each experience
      return experiences.map((exp) => ({
        ...exp,
        technology_ids: exp.technology_ids.map(
          (techId) => techMap[techId] || techId,
        ),
        category_ids: exp.category_ids.map((catId) => catMap[catId] || catId),
      }));
    } catch (error) {
      console.error("Error fetching experiences with names:", error);
      return [];
    }
  },
};

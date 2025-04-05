/* eslint-disable  @typescript-eslint/no-explicit-any */
import {
  databases,
  ID,
  appwriteConfig,
  CURRENT_TECH_STACK_COLLECTION_ID,
} from "@/lib/appwrite";
import { CurrentTechStackType, TechnologyType } from "../types/admin";
import { technologyService } from "./technologyService";
import { categoryService } from "./categoryService";

export const currentTechStackService = {
  getCurrentTechs: async (): Promise<CurrentTechStackType[]> => {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        CURRENT_TECH_STACK_COLLECTION_ID,
      );

      return response.documents.map((doc) => ({
        id: doc.$id,
        name: doc.name,
        category_id: doc.category_id,
        technology_ids: doc.technology_ids || [],
        priority: doc.priority,
        created_at: doc.$createdAt,
        updated_at: doc.$updatedAt,
      }));
    } catch (error) {
      console.error("Error fetching current tech stack:", error);
      return [];
    }
  },

  getCurrentTechsWithDetails: async () => {
    try {
      // Fetch technologies, categories, and current tech stack in parallel
      const [technologies, categories, currentTechs] = await Promise.all([
        technologyService.getTechnologies(),
        categoryService.getCategories(),
        currentTechStackService.getCurrentTechs(),
      ]);

      // Create maps for quick lookup
      const techMap = technologies.reduce<Record<string, TechnologyType>>(
        (map, tech) => {
          map[tech.id] = tech;
          return map;
        },
        {},
      );

      const categoryMap = categories.reduce<Record<string, any>>((map, cat) => {
        map[cat.id] = cat;
        return map;
      }, {});

      // Combine the details with the current tech stack items
      const techStackWithDetails = currentTechs
        .map((techStack) => {
          // Get technologies for this tech stack
          const techsForStack = techStack.technology_ids
            .map((techId) => techMap[techId])
            .filter((tech) => tech !== undefined);

          return {
            ...techStack,
            category: categoryMap[techStack.category_id] || null,
            technologies: techsForStack,
          };
        })
        .filter(
          (techStack) =>
            techStack.category !== null && techStack.technologies.length > 0,
        );

      // Sort by priority
      techStackWithDetails.sort((a, b) => a.priority - b.priority);

      return techStackWithDetails;
    } catch (error) {
      console.error("Error fetching current tech stack with details:", error);
      return [];
    }
  },

  createCurrentTech: async (
    tech: Omit<CurrentTechStackType, "id" | "created_at" | "updated_at">,
  ) => {
    const response = await databases.createDocument(
      appwriteConfig.databaseId,
      CURRENT_TECH_STACK_COLLECTION_ID,
      ID.unique(),
      tech,
    );
    return {
      id: response.$id,
      name: response.name,
      category_id: response.category_id,
      technology_ids: response.technology_ids || [],
      priority: response.priority,
      created_at: response.$createdAt,
      updated_at: response.$updatedAt,
    };
  },

  updateCurrentTech: async (
    id: string,
    tech: Partial<
      Omit<CurrentTechStackType, "id" | "created_at" | "updated_at">
    >,
  ) => {
    const response = await databases.updateDocument(
      appwriteConfig.databaseId,
      CURRENT_TECH_STACK_COLLECTION_ID,
      id,
      tech,
    );
    return {
      id: response.$id,
      name: response.name,
      category_id: response.category_id,
      technology_ids: response.technology_ids || [],
      priority: response.priority,
      created_at: response.$createdAt,
      updated_at: response.$updatedAt,
    };
  },

  deleteCurrentTech: async (id: string) => {
    return await databases.deleteDocument(
      appwriteConfig.databaseId,
      CURRENT_TECH_STACK_COLLECTION_ID,
      id,
    );
  },
};

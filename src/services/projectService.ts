import {
  databases,
  ID,
  appwriteConfig,
  PROJECTS_COLLECTION_ID,
  PORTFOLIO_BUCKET_ID,
} from "@/lib/appwrite";
import { ProjectType } from "../types/admin";
import { storageService } from "./storageService";

export const projectService = {
  getProjects: async (): Promise<ProjectType[]> => {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        PROJECTS_COLLECTION_ID,
      );

      return response.documents.map((doc) => ({
        id: doc.$id,
        name: doc.name,
        description: doc.description,
        long_description: doc.long_description,
        image: doc.image,
        image_id: doc.image_id,
        category_ids: doc.category_ids,
        technology_ids: doc.technology_ids || [],
        github: doc.github,
        live: doc.live,
        featured: doc.featured || false,
        created_at: doc.$createdAt,
        updated_at: doc.$updatedAt,
      }));
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw error;
    }
  },

  getProject: async (id: string): Promise<ProjectType> => {
    try {
      const response = await databases.getDocument(
        appwriteConfig.databaseId,
        PROJECTS_COLLECTION_ID,
        id,
      );

      return {
        id: response.$id,
        name: response.name,
        description: response.description,
        long_description: response.long_description,
        image: response.image,
        image_id: response.image_id,
        category_ids: response.category_ids,
        technology_ids: response.technology_ids || [],
        github: response.github,
        live: response.live,
        featured: response.featured,
        created_at: response.$createdAt,
        updated_at: response.$updatedAt,
      };
    } catch (error) {
      console.error("Error fetching project:", error);
      throw error;
    }
  },

  createProject: async (
    project: Omit<ProjectType, "id" | "created_at" | "updated_at">,
    imageFile?: File,
  ) => {
    const image_id = project.image;
    let imageUrl = image_id;

    if (imageFile) {
      imageUrl = storageService.getFileView(image_id, PORTFOLIO_BUCKET_ID);
    } else if (image_id && image_id !== "default_project_image") {
      imageUrl = storageService.getFileView(image_id, PORTFOLIO_BUCKET_ID);
    } else if (!image_id || image_id === "default_project_image") {
      imageUrl = "/project/project-placeholder.jpg";
    }

    const response = await databases.createDocument(
      appwriteConfig.databaseId,
      PROJECTS_COLLECTION_ID,
      ID.unique(),
      {
        ...project,
        image: imageUrl,
        image_id: image_id,
      },
    );

    return {
      id: response.$id,
      name: response.name,
      description: response.description,
      long_description: response.long_description,
      image: response.image,
      image_id: response.image_id || response.image,
      category_ids: response.category_ids,
      technology_ids: response.technology_ids || [],
      github: response.github,
      live: response.live,
      featured: response.featured,
      created_at: response.$createdAt,
      updated_at: response.$updatedAt,
    };
  },

  updateProject: async (
    id: string,
    project: Partial<Omit<ProjectType, "id" | "created_at" | "updated_at">>,
    imageFile?: File,
  ) => {
    let image_id = project.image_id || project.image;
    let imageUrl = project.image;

    if (imageFile) {
      // Upload new image file
      const newImage_id = await storageService.uploadFile(
        imageFile,
        PORTFOLIO_BUCKET_ID,
      );
      image_id = newImage_id;
      imageUrl = storageService.getFileView(newImage_id, PORTFOLIO_BUCKET_ID);

      // Delete previous image if it exists and differs from default
      if (project.image_id && project.image_id !== "default_project_image") {
        try {
          await storageService.deleteFile(
            project.image_id,
            PORTFOLIO_BUCKET_ID,
          );
        } catch (error) {
          console.warn("Could not delete previous image:", error);
        }
      }
    } else if (image_id && image_id !== "default_project_image") {
      // Ensure existing image ID is converted to a URL
      imageUrl = storageService.getFileView(image_id, PORTFOLIO_BUCKET_ID);
    } else if (!image_id || image_id === "default_project_image") {
      imageUrl = "/project/project-placeholder.jpg";
      image_id = "default_project_image";
    }

    const projectData = {
      ...project,
      image: imageUrl,
      image_id: image_id,
    };

    const response = await databases.updateDocument(
      appwriteConfig.databaseId,
      PROJECTS_COLLECTION_ID,
      id,
      projectData,
    );

    return {
      id: response.$id,
      name: response.name,
      description: response.description,
      long_description: response.long_description,
      image: response.image,
      image_id: response.image_id || response.image,
      category_ids: response.category_ids,
      technology_ids: response.technology_ids || [],
      github: response.github,
      live: response.live,
      featured: response.featured,
      created_at: response.$createdAt,
      updated_at: response.$updatedAt,
    };
  },

  deleteProject: async (id: string) => {
    try {
      const project = await projectService.getProject(id);

      await databases.deleteDocument(
        appwriteConfig.databaseId,
        PROJECTS_COLLECTION_ID,
        id,
      );

      // Use image_id if available, otherwise fall back to image
      const imageToDelete = project.image_id || project.image;

      if (
        imageToDelete &&
        imageToDelete !== "default_project_image" &&
        !imageToDelete.startsWith("/")
      ) {
        try {
          await storageService.deleteFile(imageToDelete, PORTFOLIO_BUCKET_ID);
        } catch (error) {
          console.warn("Could not delete project image:", error);
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting project:", error);
      throw error;
    }
  },

  getImageUrl: (image_id: string): string => {
    if (!image_id || image_id === "default_project_image") {
      return "/images/default-project.png";
    }

    // If it's already a URL, return it directly
    if (image_id.startsWith("http") || image_id.startsWith("/")) {
      return image_id;
    }

    return storageService.getFileView(image_id, PORTFOLIO_BUCKET_ID);
  },

  getImagePreview: (
    image_id: string,
    width: number = 400,
    height: number = 300,
  ): string => {
    if (!image_id || image_id === "default_project_image") {
      return "/images/default-project.png";
    }

    // If it's already a URL but not an Appwrite URL, we can't generate a preview
    if (
      (image_id.startsWith("http") || image_id.startsWith("/")) &&
      !image_id.includes(appwriteConfig.endpoint)
    ) {
      return image_id;
    }

    // If it's already a fully qualified Appwrite URL, extract the ID
    if (
      image_id.includes(appwriteConfig.endpoint) &&
      image_id.includes("/storage/buckets/")
    ) {
      const parts = image_id.split("/");
      image_id = parts[parts.length - 1];
    }

    return storageService.getFilePreview(
      image_id,
      PORTFOLIO_BUCKET_ID,
      width,
      height,
    );
  },
};

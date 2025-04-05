import { storage, ID } from "@/lib/appwrite";
import { ImageGravity } from "appwrite";

export const storageService = {
  uploadFile: async (file: File, bucketId: string): Promise<string> => {
    try {
      const response = await storage.createFile(bucketId, ID.unique(), file);

      return response.$id;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  },

  getFileView: (fileId: string, bucketId: string): string => {
    return storage.getFileView(bucketId, fileId).toString();
  },

  getFilePreview: (
    fileId: string,
    bucketId: string,
    width: number = 200,
    height: number = 200,
  ): string => {
    return storage
      .getFilePreview(bucketId, fileId, width, height, ImageGravity.Center, 100)
      .toString();
  },

  deleteFile: async (fileId: string, bucketId: string): Promise<void> => {
    try {
      await storage.deleteFile(bucketId, fileId);
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  },
};

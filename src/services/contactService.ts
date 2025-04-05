import { databases, ID, appwriteConfig } from "@/lib/appwrite";
import { CONTACT_SUBMISSIONS_COLLECTION_ID } from "@/lib/appwrite";

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  updated_at?: string;
}

export const contactService = {
  submitContact: async (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<ContactSubmission> => {
    try {
      const response = await databases.createDocument(
        appwriteConfig.databaseId,
        CONTACT_SUBMISSIONS_COLLECTION_ID,
        ID.unique(),
        data,
      );

      return {
        id: response.$id,
        name: response.name,
        email: response.email,
        subject: response.subject,
        message: response.message,
        created_at: response.$createdAt,
        updated_at: response.$updatedAt,
      };
    } catch (error) {
      console.error("Error submitting contact form:", error);
      throw error;
    }
  },

  getSubmissions: async (): Promise<ContactSubmission[]> => {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        CONTACT_SUBMISSIONS_COLLECTION_ID,
      );

      return response.documents.map((doc) => ({
        id: doc.$id,
        name: doc.name,
        email: doc.email,
        subject: doc.subject,
        message: doc.message,
        created_at: doc.$createdAt,
        updated_at: doc.$updatedAt,
      }));
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
      throw error;
    }
  },

  getSubmission: async (id: string): Promise<ContactSubmission> => {
    try {
      const doc = await databases.getDocument(
        appwriteConfig.databaseId,
        CONTACT_SUBMISSIONS_COLLECTION_ID,
        id,
      );

      return {
        id: doc.$id,
        name: doc.name,
        email: doc.email,
        subject: doc.subject,
        message: doc.message,
        created_at: doc.$createdAt,
        updated_at: doc.$updatedAt,
      };
    } catch (error) {
      console.error(`Error fetching contact submission with ID ${id}:`, error);
      throw error;
    }
  },

  deleteSubmission: async (id: string): Promise<void> => {
    try {
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        CONTACT_SUBMISSIONS_COLLECTION_ID,
        id,
      );
    } catch (error) {
      console.error(`Error deleting contact submission with ID ${id}:`, error);
      throw error;
    }
  },
};

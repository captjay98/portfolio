/* eslint-disable  @typescript-eslint/no-explicit-any */
import {
  databases,
  ID,
  Query,
  appwriteConfig,
  VISITORS_COLLECTION_ID,
  GUEST_BOOK_COLLECTION_ID,
} from "@/lib/appwrite";
import { VisitorType } from "@/types/admin";

// Helper function to convert Appwrite document to VisitorType
const mapDocumentToVisitor = (doc: any): VisitorType => ({
  $id: doc.$id,
  timestamp: doc.timestamp,
  ip_address: doc.ip_address,
  user_agent: doc.user_agent,
  referrer: doc.referrer,
  page: doc.page,
  visit_count: doc.visit_count,
  session_id: doc.session_id,
  country_code: doc.country_code,
  country_name: doc.country_name,
  created_at: doc.$createdAt,
  updated_at: doc.$updatedAt,
});

interface VisitorInfo {
  ip_address: string;
  user_agent: string;
  referrer: string;
  country_code: string;
  country_name: string;
  page: string;
  session_id: string;
}

export const visitorService = {
  // Record a new visit
  recordVisit: async (visitorInfo: VisitorInfo): Promise<void> => {
    try {
      await databases.createDocument(
        appwriteConfig.databaseId,
        VISITORS_COLLECTION_ID,
        ID.unique(),
        {
          ...visitorInfo,
          timestamp: new Date().toISOString(),
          visit_count: 1,
        }
      );
    } catch (error) {
      console.error("Error recording visit:", error);
    }
  },

  // Get visitor count
  getVisitorCount: async (): Promise<number> => {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        VISITORS_COLLECTION_ID,
        []
      );
      return response.documents.length;
    } catch (error) {
      console.error("Error fetching visitor count:", error);
      return 0;
    }
  },

  // Get unique visitor count
  getUniqueVisitorCount: async (): Promise<number> => {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        VISITORS_COLLECTION_ID,
        []
      );
      const uniqueVisitors = new Set(
        response.documents.map((v) => v.session_id),
      );
      return uniqueVisitors.size;
    } catch (error) {
      console.error("Error fetching unique visitor count:", error);
      return 0;
    }
  },

  // Get recent visits
  getRecentVisits: async (limit: number = 10): Promise<VisitorType[]> => {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        VISITORS_COLLECTION_ID,
        [Query.orderDesc("timestamp"), Query.limit(limit)],
      );
      return response.documents.map((doc) => mapDocumentToVisitor(doc));
    } catch (error) {
      console.error("Error fetching recent visits:", error);
      return [];
    }
  },

  // Get today's stats
  getTodayStats: async (): Promise<{
    visitors: number;
    uniqueVisitors: number;
  }> => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        VISITORS_COLLECTION_ID,
        [Query.greaterThanEqual("timestamp", `${today}T00:00:00Z`)],
      );

      const uniqueVisitors = new Set(
        response.documents.map((v) => v.session_id),
      );

      return {
        visitors: response.documents.length,
        uniqueVisitors: uniqueVisitors.size,
      };
    } catch (error) {
      console.error("Error fetching today's stats:", error);
      return { visitors: 0, uniqueVisitors: 0 };
    }
  },

  // Get visitor stats by country
  getVisitorStatsByCountry: async (): Promise<Record<string, number>> => {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        VISITORS_COLLECTION_ID,
        [],
      );

      const stats: Record<string, number> = {};
      response.documents.forEach((doc) => {
        const country = doc.country_code || "Unknown";
        stats[country] = (stats[country] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error("Error fetching visitor stats by country:", error);
      return {};
    }
  },

  // Add guest book message
  addGuestBookMessage: async (name: string, message: string): Promise<void> => {
    try {
      await databases.createDocument(
        appwriteConfig.databaseId,
        GUEST_BOOK_COLLECTION_ID,
        ID.unique(),
        {
          name,
          message,
          date: new Date().toISOString().split("T")[0],
        }
      );
    } catch (error) {
      console.error("Error adding guest book message:", error);
      throw error;
    }
  },

  // Get guest book messages
  getGuestBookMessages: async (): Promise<any[]> => {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        GUEST_BOOK_COLLECTION_ID,
        [Query.orderDesc("$createdAt")]
      );
      return response.documents;
    } catch (error) {
      console.error("Error fetching guest book messages:", error);
      return [];
    }
  },
};

export default visitorService;

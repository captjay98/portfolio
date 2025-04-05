/* eslint-disable  @typescript-eslint/no-explicit-any */
import {
  databases,
  DATABASE_ID,
  SITE_SETTINGS_COLLECTION_ID,
} from "@/lib/appwrite";
import { Query } from "appwrite";

export type SiteSettingType = {
  id: string;
  key: string;
  value: string;
  description: string;
};

async function getAllSettings(): Promise<Record<string, string>> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      SITE_SETTINGS_COLLECTION_ID,
    );

    // Convert to a key-value map for easier access
    const settings: Record<string, string> = {};
    response.documents.forEach((doc: any) => {
      settings[doc.key] = doc.value;
    });

    return settings;
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return {};
  }
}

async function getSetting(key: string): Promise<string | null> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      SITE_SETTINGS_COLLECTION_ID,
      [Query.equal("key", key)],
    );

    if (response.documents.length > 0) {
      return response.documents[0].value;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching setting ${key}:`, error);
    return null;
  }
}

async function updateSetting(key: string, value: string): Promise<boolean> {
  try {
    // First check if the setting exists
    const response = await databases.listDocuments(
      DATABASE_ID,
      SITE_SETTINGS_COLLECTION_ID,
      [Query.equal("key", key)],
    );

    if (response.documents.length > 0) {
      // Update existing setting
      await databases.updateDocument(
        DATABASE_ID,
        SITE_SETTINGS_COLLECTION_ID,
        response.documents[0].$id,
        { value },
      );
    } else {
      // Create new setting with a default description
      await databases.createDocument(
        DATABASE_ID,
        SITE_SETTINGS_COLLECTION_ID,
        "unique()",
        {
          key,
          value,
          description: `Setting for ${key}`,
        },
      );
    }

    return true;
  } catch (error) {
    console.error(`Error updating setting ${key}:`, error);
    return false;
  }
}

export const siteSettingsService = {
  getAllSettings,
  getSetting,
  updateSetting,
};

import { Databases } from "node-appwrite";
import { SITE_SETTINGS_COLLECTION_ID } from "@/lib/appwrite";

async function seedSiteSettings(databases: Databases, databaseId: string) {
  console.log("Seeding site settings...");

  const defaultSettings = [
    {
      key: "siteTitle",
      value: "Jamal Ibrahim Umar",
      description: "The title displayed in browser tabs and search results",
    },
    {
      key: "siteName",
      value: "Jamal's Developer Portfolio",
      description: "The name of the site used throughout the application",
    },
    {
      key: "siteDescription",
      value: "A showcase of my development work and skills",
      description: "Short description used for SEO and previews",
    },
    {
      key: "emailNotifications",
      value: "false",
      description: "Whether to send email notifications for important events",
    },
    {
      key: "contactEmail",
      value: "captjay98@gmail.com",
      description:
        "Email address displayed on contact page and used for notifications",
    },
  ];

  // Check and seed each setting
  for (const setting of defaultSettings) {
    try {
      // Check if setting already exists
      const existingSettings = await databases.listDocuments(
        databaseId,
        SITE_SETTINGS_COLLECTION_ID,
        [`key=${setting.key}`],
      );

      if (existingSettings.total === 0) {
        // Create setting if it doesn't exist
        await databases.createDocument(
          databaseId,
          SITE_SETTINGS_COLLECTION_ID,
          "unique()",
          setting,
        );
        console.log(`Created site setting: ${setting.key}`);
      } else {
        console.log(`Site setting already exists: ${setting.key}`);
      }
    } catch (error) {
      console.error(`Error seeding site setting ${setting.key}:`, error);
    }
  }

  console.log("✅ Site settings seeding complete!");
}

export default seedSiteSettings;

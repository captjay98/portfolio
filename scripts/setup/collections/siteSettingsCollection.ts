import { Databases, IndexType } from "node-appwrite";
import { getOrCreateCollection } from "./utils";
import { SITE_SETTINGS_COLLECTION_ID } from "@/lib/appwrite";

async function setupSiteSettingsCollection(
  databases: Databases,
  databaseId: string,
) {
  console.log("Setting up Site Settings collection...");

  // Use the utility to create or get the collection with standard permissions
  await getOrCreateCollection(
    databases,
    databaseId,
    SITE_SETTINGS_COLLECTION_ID,
    "Site Settings",
  );

  // Define attributes
  const attributes = [
    { key: "key", type: "string", size: 255, required: true },
    { key: "value", type: "string", size: 10000, required: true },
    { key: "description", type: "string", size: 1000, required: false },
  ];

  // Create attributes
  for (const attr of attributes) {
    try {
      await databases.createStringAttribute(
        databaseId,
        SITE_SETTINGS_COLLECTION_ID,
        attr.key,
        attr.size!,
        attr.required,
      );
      console.log(`Created attribute ${attr.key} for Site Settings collection`);
    } catch (error: any) {
      if (error?.code === 409) {
        console.log(
          `Attribute ${attr.key} already exists for Site Settings collection`,
        );
      } else {
        throw error;
      }
    }
  }

  // Create unique index on key
  try {
    await databases.createIndex(
      databaseId,
      SITE_SETTINGS_COLLECTION_ID,
      "by_key",
      IndexType.Unique,
      ["key"],
    );
    console.log("Created key index for Site Settings collection");
  } catch (error: any) {
    if (error?.code === 409) {
      console.log("Key index already exists for Site Settings collection");
    } else {
      throw error;
    }
  }

  console.log("✅ Site Settings collection setup complete!");
}

export default setupSiteSettingsCollection;

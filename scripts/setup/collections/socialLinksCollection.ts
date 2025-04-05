import { Databases, IndexType } from "node-appwrite";
import { getOrCreateCollection } from "./utils";
import { SOCIAL_LINKS_COLLECTION_ID } from "@/lib/appwrite";

async function setupSocialLinksCollection(
  databases: Databases,
  databaseId: string,
) {
  console.log("Setting up Social Links collection...");

  // Use the utility to create or get the collection with standard permissions
  await getOrCreateCollection(
    databases,
    databaseId,
    SOCIAL_LINKS_COLLECTION_ID,
    "Social Links",
  );

  // Define attributes for social links
  const attributes = [
    { key: "platform", type: "string", size: 100, required: true },
    { key: "url", type: "string", size: 1024, required: true },
    { key: "icon", type: "string", size: 100, required: true },
    { key: "priority", type: "integer", required: true, default: 0 },
    { key: "is_visible", type: "boolean", required: true, default: true },
  ];

  // Create attributes
  for (const attr of attributes) {
    try {
      if (attr.type === "string") {
        await databases.createStringAttribute(
          databaseId,
          SOCIAL_LINKS_COLLECTION_ID,
          attr.key,
          attr.size!,
          attr.required,
        );
      } else if (attr.type === "integer") {
        await databases.createIntegerAttribute(
          databaseId,
          SOCIAL_LINKS_COLLECTION_ID,
          attr.key,
          attr.required,
        );
      } else if (attr.type === "boolean") {
        await databases.createBooleanAttribute(
          databaseId,
          SOCIAL_LINKS_COLLECTION_ID,
          attr.key,
          attr.required,
        );
      }
      console.log(`Created attribute ${attr.key} for Social Links collection`);
    } catch (error: any) {
      if (error?.code === 409) {
        console.log(
          `Attribute ${attr.key} already exists for Social Links collection`,
        );
      } else {
        throw error;
      }
    }
  }

  // Create index for priority
  try {
    await databases.createIndex(
      databaseId,
      SOCIAL_LINKS_COLLECTION_ID,
      "priority_index",
      IndexType.Key,
      ["priority"],
      [],
    );
    console.log("Created priority index for Social Links collection");
  } catch (error: any) {
    if (error?.code === 409) {
      console.log("Priority index already exists for Social Links collection");
    } else {
      throw error;
    }
  }

  console.log("✅ Social Links collection setup complete!");
}

export default setupSocialLinksCollection;

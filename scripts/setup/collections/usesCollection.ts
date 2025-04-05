import { Databases, IndexType } from "node-appwrite";
import { getOrCreateCollection } from "./utils";
import { USES_COLLECTION_ID } from "@/lib/appwrite";

async function setupUsesCollection(databases: Databases, databaseId: string) {
  console.log("Setting up Uses collection...");

  // Use the utility to create or get the collection with standard permissions
  await getOrCreateCollection(
    databases,
    databaseId,
    USES_COLLECTION_ID,
    "Uses",
  );

  // Define attributes for uses items
  const attributes = [
    { key: "category_id", type: "string", size: 100, required: true }, // Changed from category
    { key: "name", type: "string", size: 255, required: true },
    { key: "description", type: "string", size: 2000, required: true },
    { key: "link", type: "string", size: 1024, required: false },
    { key: "image", type: "string", size: 1024, required: false },
    { key: "image_id", type: "string", size: 255, required: false },
    { key: "is_favorite", type: "boolean", required: true, default: false },
    { key: "priority", type: "integer", required: true, default: 0 },
  ];

  // Create attributes
  for (const attr of attributes) {
    try {
      if (attr.type === "string") {
        await databases.createStringAttribute(
          databaseId,
          USES_COLLECTION_ID,
          attr.key,
          attr.size!,
          attr.required,
        );
      } else if (attr.type === "integer") {
        await databases.createIntegerAttribute(
          databaseId,
          USES_COLLECTION_ID,
          attr.key,
          attr.required,
        );
      } else if (attr.type === "boolean") {
        await databases.createBooleanAttribute(
          databaseId,
          USES_COLLECTION_ID,
          attr.key,
          attr.required,
        );
      }
      console.log(`Created attribute ${attr.key} for Uses collection`);
    } catch (error: any) {
      if (error?.code === 409) {
        console.log(`Attribute ${attr.key} already exists for Uses collection`);
      } else {
        throw error;
      }
    }
  }

  // Create indexes
  try {
    await databases.createIndex(
      databaseId,
      USES_COLLECTION_ID,
      "category_id_index", // Update the index name as well
      IndexType.Key,
      ["category_id"], // Update index field
      [],
    );
    console.log("Created category_id index for Uses collection");
  } catch (error: any) {
    if (error?.code === 409) {
      console.log("Category_id index already exists for Uses collection");
    } else {
      throw error;
    }
  }

  try {
    await databases.createIndex(
      databaseId,
      USES_COLLECTION_ID,
      "priority_index",
      IndexType.Key,
      ["priority"],
      [],
    );
    console.log("Created priority index for Uses collection");
  } catch (error: any) {
    if (error?.code === 409) {
      console.log("Priority index already exists for Uses collection");
    } else {
      throw error;
    }
  }

  console.log("✅ Uses collection setup complete!");
}

export default setupUsesCollection;

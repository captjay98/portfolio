import { Databases, IndexType } from "node-appwrite";
import { getOrCreateCollection } from "./utils";
import { CATEGORIES_COLLECTION_ID } from "@/lib/appwrite";

async function setupCategoriesCollection(
  databases: Databases,
  databaseId: string,
) {
  console.log("Setting up Categories collection...");

  // Use the utility to create or get the collection with standard permissions
  await getOrCreateCollection(
    databases,
    databaseId,
    CATEGORIES_COLLECTION_ID,
    "Categories",
  );

  // Define attributes based on CategoryType
  const attributes = [
    { key: "name", type: "string", size: 100, required: true },
    { key: "description", type: "string", size: 500, required: false },
    { key: "parent_id", type: "string", size: 36, required: false },
  ];

  // Create attributes
  for (const attr of attributes) {
    try {
      await databases.createStringAttribute(
        databaseId,
        CATEGORIES_COLLECTION_ID,
        attr.key,
        attr.size,
        attr.required,
      );
      console.log(`Created attribute ${attr.key} for Categories collection`);
    } catch (error: any) {
      if (error?.code === 409) {
        console.log(
          `Attribute ${attr.key} already exists for Categories collection`,
        );
      } else {
        throw error;
      }
    }
  }

  // Create indexes
  try {
    await databases.createIndex(
      databaseId,
      CATEGORIES_COLLECTION_ID,
      "name_index",
      IndexType.Unique,
      ["name"],
    );
    console.log("Created name index for Categories collection");
  } catch (error: any) {
    if (error?.code === 409) {
      console.log("Name index already exists for Categories collection");
    } else {
      throw error;
    }
  }

  console.log("✅ Categories collection setup complete!");
}

export default setupCategoriesCollection;

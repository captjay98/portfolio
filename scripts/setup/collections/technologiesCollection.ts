import { Databases, IndexType } from "node-appwrite";
import { getOrCreateCollection } from "./utils";
import { TECHNOLOGIES_COLLECTION_ID } from "@/lib/appwrite";

async function setupTechnologiesCollection(
  databases: Databases,
  databaseId: string,
) {
  console.log("Setting up Technologies collection...");

  // Use the utility to create or get the collection with standard permissions
  await getOrCreateCollection(
    databases,
    databaseId,
    TECHNOLOGIES_COLLECTION_ID,
    "Technologies",
  );

  // Define attributes based on TechnologyType
  const attributes = [
    { key: "name", type: "string", size: 100, required: true },
    { key: "category_id", type: "string", size: 36, required: true },
    { key: "icon", type: "string", size: 255, required: false },
    { key: "website", type: "string", size: 255, required: false },
  ];

  // Create attributes
  for (const attr of attributes) {
    try {
      await databases.createStringAttribute(
        databaseId,
        TECHNOLOGIES_COLLECTION_ID,
        attr.key,
        attr.size,
        attr.required,
      );
      console.log(`Created attribute ${attr.key} for Technologies collection`);
    } catch (error: any) {
      if (error?.code === 409) {
        console.log(
          `Attribute ${attr.key} already exists for Technologies collection`,
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
      TECHNOLOGIES_COLLECTION_ID,
      "name_index",
      IndexType.Unique,
      ["name"],
      [],
    );
    console.log("Created name index for Technologies collection");
  } catch (error: any) {
    if (error?.code === 409) {
      console.log("Name index already exists for Technologies collection");
    } else {
      throw error;
    }
  }

  try {
    await databases.createIndex(
      databaseId,
      TECHNOLOGIES_COLLECTION_ID,
      "category_index",
      IndexType.Key,
      ["category_id"],
      [],
    );
    console.log("Created category index for Technologies collection");
  } catch (error: any) {
    if (error?.code === 409) {
      console.log("Category index already exists for Technologies collection");
    } else {
      throw error;
    }
  }

  console.log("✅ Technologies collection setup complete!");
}

export default setupTechnologiesCollection;

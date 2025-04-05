import { Databases, IndexType } from "node-appwrite";
import { getOrCreateCollection } from "./utils";
import { EXPERIENCES_COLLECTION_ID } from "@/lib/appwrite";

async function setupExperiencesCollection(
  databases: Databases,
  databaseId: string,
) {
  console.log("Setting up Experiences collection...");

  // Use the utility to create or get the collection with standard permissions
  await getOrCreateCollection(
    databases,
    databaseId,
    EXPERIENCES_COLLECTION_ID,
    "Work Experiences",
  );

  // Define attributes
  const attributes = [
    { key: "title", type: "string", size: 255, required: true },
    { key: "company", type: "string", size: 255, required: true },
    { key: "location", type: "string", size: 255, required: true },
    { key: "start_date", type: "string", size: 50, required: true },
    { key: "end_date", type: "string", size: 50, required: false },
    { key: "description", type: "string", size: 10000, required: true },
    { key: "category_ids", type: "string[]", size: 36, required: false },
    { key: "technology_ids", type: "string[]", size: 36, required: false },
  ];

  // Create attributes
  for (const attr of attributes) {
    try {
      if (attr.type === "string") {
        await databases.createStringAttribute(
          databaseId,
          EXPERIENCES_COLLECTION_ID,
          attr.key,
          attr.size!,
          attr.required,
        );
      } else if (attr.type === "string[]") {
        await databases.createStringAttribute(
          databaseId,
          EXPERIENCES_COLLECTION_ID,
          attr.key,
          attr.size!,
          attr.required,
          undefined,
          true,
        );
      }
      console.log(`Created attribute ${attr.key} for Experiences collection`);
    } catch (error: any) {
      if (error?.code === 409) {
        console.log(
          `Attribute ${attr.key} already exists for Experiences collection`,
        );
      } else {
        throw error;
      }
    }
  }

  // Create index
  try {
    await databases.createIndex(
      databaseId,
      EXPERIENCES_COLLECTION_ID,
      "by_date",
      IndexType.Key,
      ["start_date"],
    );
    console.log("Created date index for Experiences collection");
  } catch (error: any) {
    if (error?.code === 409) {
      console.log("Date index already exists for Experiences collection");
    } else {
      throw error;
    }
  }

  console.log("✅ Experiences collection setup complete!");
}

export default setupExperiencesCollection;

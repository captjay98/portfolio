import { Databases, IndexType } from "node-appwrite";
import { getOrCreateCollection } from "./utils";
import { CURRENT_TECH_STACK_COLLECTION_ID } from "@/lib/appwrite";

async function setupCurrentTechStackCollection(
  databases: Databases,
  databaseId: string,
) {
  console.log("Setting up Current Tech Stack collection...");

  // Use the utility to create or get the collection with standard permissions
  await getOrCreateCollection(
    databases,
    databaseId,
    CURRENT_TECH_STACK_COLLECTION_ID,
    "Current Tech Stack",
  );

  // Define attributes
  const attributes = [
    { key: "name", type: "string", size: 255, required: true },
    { key: "category_id", type: "string", size: 36, required: true },
    { key: "technology_ids", type: "stringArray", required: true },
    { key: "priority", type: "integer", required: true },
  ];

  // Create attributes
  for (const attr of attributes) {
    try {
      if (attr.type === "string") {
        await databases.createStringAttribute(
          databaseId,
          CURRENT_TECH_STACK_COLLECTION_ID,
          attr.key,
          attr.size!,
          attr.required,
        );
      } else if (attr.type === "integer") {
        await databases.createIntegerAttribute(
          databaseId,
          CURRENT_TECH_STACK_COLLECTION_ID,
          attr.key,
          attr.required,
        );
      } else if (attr.type === "stringArray") {
        await databases.createStringAttribute(
          databaseId,
          CURRENT_TECH_STACK_COLLECTION_ID,
          attr.key,
          255,
          attr.required,
          undefined,
          true,
        );
      }
      console.log(
        `Created attribute ${attr.key} for Current Tech Stack collection`,
      );
    } catch (error: any) {
      if (error?.code === 409) {
        console.log(
          `Attribute ${attr.key} already exists for Current Tech Stack collection`,
        );
      } else {
        throw error;
      }
    }
  }

  console.log("✅ Current Tech Stack collection setup complete!");
}

export default setupCurrentTechStackCollection;

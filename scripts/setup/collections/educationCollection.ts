import { Databases, IndexType } from "node-appwrite";
import { getOrCreateCollection } from "./utils";
import { EDUCATION_COLLECTION_ID } from "@/lib/appwrite";

async function setupEducationCollection(
  databases: Databases,
  databaseId: string,
) {
  console.log("Setting up Education collection...");

  // Use the utility to create or get the collection with standard permissions
  await getOrCreateCollection(
    databases,
    databaseId,
    EDUCATION_COLLECTION_ID,
    "Education",
  );

  // Define attributes
  const attributes = [
    { key: "degree", type: "string", size: 255, required: true },
    { key: "institution", type: "string", size: 255, required: true },
    { key: "location", type: "string", size: 255, required: false },
    { key: "start_date", type: "string", size: 100, required: true },
    { key: "end_date", type: "string", size: 100, required: false },
    { key: "description", type: "string", size: 1000, required: false },
    { key: "is_current", type: "boolean", required: true },
    { key: "priority", type: "integer", required: true },
  ];

  // Create attributes
  for (const attr of attributes) {
    try {
      if (attr.type === "string") {
        await databases.createStringAttribute(
          databaseId,
          EDUCATION_COLLECTION_ID,
          attr.key,
          attr.size!,
          attr.required,
        );
      } else if (attr.type === "integer") {
        await databases.createIntegerAttribute(
          databaseId,
          EDUCATION_COLLECTION_ID,
          attr.key,
          attr.required,
        );
      } else if (attr.type === "boolean") {
        await databases.createBooleanAttribute(
          databaseId,
          EDUCATION_COLLECTION_ID,
          attr.key,
          attr.required,
        );
      }
      console.log(`Created attribute ${attr.key} for Education collection`);
    } catch (error: any) {
      if (error?.code === 409) {
        console.log(
          `Attribute ${attr.key} already exists for Education collection`,
        );
      } else {
        throw error;
      }
    }
  }

  console.log("✅ Education collection setup complete!");
}

export default setupEducationCollection;

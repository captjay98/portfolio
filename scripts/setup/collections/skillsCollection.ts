import { Databases, IndexType } from "node-appwrite";
import { getOrCreateCollection } from "./utils";
import { SKILLS_COLLECTION_ID } from "@/lib/appwrite";

async function setupSkillsCollection(databases: Databases, databaseId: string) {
  console.log("Setting up Skills collection...");

  // Use the utility to create or get the collection with standard permissions
  await getOrCreateCollection(
    databases,
    databaseId,
    SKILLS_COLLECTION_ID,
    "Skills",
  );

  // Define attributes
  const attributes = [
    { key: "name", type: "string", size: 255, required: true },
    { key: "category_id", type: "string", size: 255, required: true },
    { key: "technology_id", type: "string", size: 255, required: true },
    { key: "level", type: "string", size: 100, required: true },
    { key: "years", type: "float", required: true, min: 0, max: 50 },
  ];

  // Create attributes
  for (const attr of attributes) {
    try {
      if (attr.type === "string") {
        await databases.createStringAttribute(
          databaseId,
          SKILLS_COLLECTION_ID,
          attr.key,
          attr.size!,
          attr.required,
        );
      } else if (attr.type === "float") {
        await databases.createFloatAttribute(
          databaseId,
          SKILLS_COLLECTION_ID,
          attr.key,
          attr.required,
          attr.min,
          attr.max,
        );
      }
      console.log(`Created attribute ${attr.key} for Skills collection`);
    } catch (error: any) {
      if (error?.code === 409) {
        console.log(
          `Attribute ${attr.key} already exists for Skills collection`,
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
      SKILLS_COLLECTION_ID,
      "by_category",
      IndexType.Key,
      ["category_id"],
    );
    console.log("Created category index for Skills collection");
  } catch (error: any) {
    if (error?.code === 409) {
      console.log("Category index already exists for Skills collection");
    } else {
      throw error;
    }
  }

  try {
    await databases.createIndex(
      databaseId,
      SKILLS_COLLECTION_ID,
      "by_technology",
      IndexType.Key,
      ["technology_id"],
    );
    console.log("Created technology index for Skills collection");
  } catch (error: any) {
    if (error?.code === 409) {
      console.log("Technology index already exists for Skills collection");
    } else {
      throw error;
    }
  }

  console.log("✅ Skills collection setup complete!");
}

export default setupSkillsCollection;

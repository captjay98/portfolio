import { Databases, IndexType } from "node-appwrite";
import { getOrCreateCollection } from "./utils";
import { PROJECTS_COLLECTION_ID } from "@/lib/appwrite";

async function setupProjectsCollection(
  databases: Databases,
  databaseId: string,
) {
  console.log("Setting up Projects collection...");

  // Use the utility to create or get the collection with standard permissions
  await getOrCreateCollection(
    databases,
    databaseId,
    PROJECTS_COLLECTION_ID,
    "Projects",
  );

  // Define attributes
  const attributes = [
    { key: "name", type: "string", size: 255, required: true },
    { key: "description", type: "string", size: 500, required: true },
    { key: "long_description", type: "text", required: false }, // Changed from longDescription
    { key: "image", type: "string", size: 255, required: true },
    { key: "image_id", type: "string", size: 255, required: false }, // Changed from imageId
    { key: "category_ids", type: "string[]", required: true, default: [] }, // Changed from category (string) to category_ids (array)
    { key: "technology_ids", type: "string[]", required: true, default: [] }, // Changed from technologies
    { key: "github", type: "string", size: 255, required: false },
    { key: "live", type: "string", size: 255, required: false },
    { key: "featured", type: "boolean", required: true },
  ];

  // Create attributes
  for (const attr of attributes) {
    try {
      if (attr.type === "string") {
        await databases.createStringAttribute(
          databaseId,
          PROJECTS_COLLECTION_ID,
          attr.key,
          attr.size!,
          attr.required,
        );
      } else if (attr.type === "text") {
        await databases.createStringAttribute(
          databaseId,
          PROJECTS_COLLECTION_ID,
          attr.key,
          65535, // max text size
          attr.required,
        );
      } else if (attr.type === "boolean") {
        await databases.createBooleanAttribute(
          databaseId,
          PROJECTS_COLLECTION_ID,
          attr.key,
          attr.required,
        );
      } else if (attr.type === "string[]") {
        await databases.createStringAttribute(
          databaseId,
          PROJECTS_COLLECTION_ID,
          attr.key,
          255,
          attr.required,
          undefined,
          true, // array
        );
      }
      console.log(`Created attribute ${attr.key} for Projects collection`);
    } catch (error: any) {
      // Skip if attribute already exists
      if (error?.code === 409) {
        console.log(
          `Attribute ${attr.key} already exists for Projects collection`,
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
      PROJECTS_COLLECTION_ID,
      "name_index",
      IndexType.Unique,
      ["name"],
      [],
    );
    console.log("Created name index for Projects collection");
  } catch (error: any) {
    if (error?.code === 409) {
      console.log("Name index already exists for Projects collection");
    } else {
      throw error;
    }
  }

  try {
    await databases.createIndex(
      databaseId,
      PROJECTS_COLLECTION_ID,
      "featured_index",
      IndexType.Key,
      ["featured"],
      [],
    );
    console.log("Created featured index for Projects collection");
  } catch (error: any) {
    if (error?.code === 409) {
      console.log("Featured index already exists for Projects collection");
    } else {
      throw error;
    }
  }

  console.log("✅ Projects collection setup complete!");
}

export default setupProjectsCollection;

import { Databases, IndexType } from "node-appwrite";
import { getOrCreateCollection } from "./utils";
import { BLOG_POSTS_COLLECTION_ID } from "@/lib/appwrite";

async function setupBlogSeriesCollection(
  databases: Databases,
  databaseId: string,
) {
  console.log("Setting up Blog Series collection...");

  // Use the utility to create or get the collection with standard permissions
  const collectionId = "blog_series";
  await getOrCreateCollection(
    databases,
    databaseId,
    collectionId,
    "Blog Series",
  );

  // Define attributes based on BlogSeriesType
  const attributes = [
    { key: "title", type: "string", size: 255, required: true },
    { key: "description", type: "string", size: 500, required: false },
    { key: "slug", type: "string", size: 255, required: true },
    { key: "image", type: "string", size: 255, required: false },
    { key: "image_id", type: "string", size: 255, required: false }, // Changed from imageId
    { key: "status", type: "string", size: 50, required: true },
  ];

  // Create attributes
  for (const attr of attributes) {
    try {
      await databases.createStringAttribute(
        databaseId,
        collectionId,
        attr.key,
        attr.size,
        attr.required,
      );
      console.log(`Created attribute ${attr.key} for Blog Series collection`);
    } catch (error: any) {
      if (error?.code === 409) {
        console.log(
          `Attribute ${attr.key} already exists for Blog Series collection`,
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
      collectionId,
      "slug_index",
      IndexType.Unique,
      ["slug"],
      [],
    );
    console.log("Created slug index for Blog Series collection");
  } catch (error: any) {
    if (error?.code === 409) {
      console.log("Slug index already exists for Blog Series collection");
    } else {
      throw error;
    }
  }

  console.log("✅ Blog Series collection setup complete!");
}

export default setupBlogSeriesCollection;

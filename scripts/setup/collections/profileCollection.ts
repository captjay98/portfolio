import { Databases, IndexType } from "node-appwrite";
import { getOrCreateCollection } from "./utils";
import { PROFILE_COLLECTION_ID } from "@/lib/appwrite";

async function setupProfileCollection(
  databases: Databases,
  databaseId: string,
) {
  console.log("Setting up Profile collection...");

  // Use the utility to create or get the collection with standard permissions
  await getOrCreateCollection(
    databases,
    databaseId,
    PROFILE_COLLECTION_ID,
    "Profile",
  );

  // Define attributes for profile
  const attributes = [
    { key: "full_name", type: "string", size: 255, required: true },
    { key: "nickname", type: "string", size: 100, required: false },
    { key: "title", type: "string", size: 255, required: true },
    { key: "bio_short", type: "string", size: 500, required: true },
    { key: "bio_long", type: "text", required: true },
    { key: "location", type: "string", size: 255, required: false },
    { key: "avatar", type: "string", size: 1024, required: false },
    { key: "avatar_id", type: "string", size: 255, required: false },
    { key: "cover_image", type: "string", size: 1024, required: false },
    { key: "cover_image_id", type: "string", size: 255, required: false },
    { key: "resume_url", type: "string", size: 1024, required: false },
    { key: "meta_description", type: "string", size: 500, required: false },
  ];

  // Create attributes
  for (const attr of attributes) {
    try {
      if (attr.type === "string") {
        await databases.createStringAttribute(
          databaseId,
          PROFILE_COLLECTION_ID,
          attr.key,
          attr.size!,
          attr.required,
        );
      } else if (attr.type === "text") {
        await databases.createStringAttribute(
          databaseId,
          PROFILE_COLLECTION_ID,
          attr.key,
          65535, // max text size
          attr.required,
        );
      }
      console.log(`Created attribute ${attr.key} for Profile collection`);
    } catch (error: any) {
      if (error?.code === 409) {
        console.log(
          `Attribute ${attr.key} already exists for Profile collection`,
        );
      } else {
        throw error;
      }
    }
  }

  console.log("✅ Profile collection setup complete!");
}

export default setupProfileCollection;

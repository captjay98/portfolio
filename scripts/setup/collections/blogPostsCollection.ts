import { Databases, IndexType } from "node-appwrite";
import { getOrCreateCollection } from "./utils";
import { BLOG_POSTS_COLLECTION_ID } from "@/lib/appwrite";

async function setupBlogPostsCollection(
  databases: Databases,
  databaseId: string,
) {
  console.log("Setting up Blog Posts collection...");

  // Use the utility to create or get the collection with standard permissions
  await getOrCreateCollection(
    databases,
    databaseId,
    BLOG_POSTS_COLLECTION_ID,
    "Blog Posts",
  );

  // Define attributes based on BlogPostType
  const attributes = [
    { key: "title", type: "string", size: 255, required: true },
    { key: "slug", type: "string", size: 255, required: true },
    { key: "excerpt", type: "string", size: 500, required: true },
    { key: "content", type: "text", required: true },
    { key: "cover_image", type: "string", size: 255, required: true }, 
    { key: "cover_image_id", type: "string", size: 255, required: false }, 
    { key: "date", type: "string", size: 50, required: true },
    { key: "reading_time", type: "string", size: 50, required: true }, 
    { key: "category_ids", type: "string[]", required: true }, 
    { key: "tag_ids", type: "string[]", required: false }, 
    { key: "technology_ids", type: "string[]", required: false }, 
    { key: "status", type: "string", size: 50, required: true },
    { key: "featured", type: "boolean", required: true, default: false },
    { key: "series_id", type: "string", size: 36, required: false },
    { key: "series_position", type: "integer", required: false },
    { key: "related_post_ids", type: "string[]", required: false }, 
    {
      key: "recommended_next_read_id",
      type: "string",
      size: 36,
      required: false,
    },
    { key: "likes", type: "integer", required: false, default: 0 }, 
    { key: "read_count", type: "integer", required: false, default: 0 }, 
  ];

  // Create attributes
  for (const attr of attributes) {
    try {
      if (attr.type === "string") {
        await databases.createStringAttribute(
          databaseId,
          BLOG_POSTS_COLLECTION_ID,
          attr.key,
          attr.size!,
          attr.required,
        );
      } else if (attr.type === "text") {
        await databases.createStringAttribute(
          databaseId,
          BLOG_POSTS_COLLECTION_ID,
          attr.key,
          65535, 
          attr.required,
        );
      } else if (attr.type === "boolean") {
        await databases.createBooleanAttribute(
          databaseId,
          BLOG_POSTS_COLLECTION_ID,
          attr.key,
          attr.required,
        );
      } else if (attr.type === "string[]") {
        await databases.createStringAttribute(
          databaseId,
          BLOG_POSTS_COLLECTION_ID,
          attr.key,
          255,
          attr.required,
          undefined,
          true,
        );
      } else if (attr.type === "integer") {
        await databases.createIntegerAttribute(
          databaseId,
          BLOG_POSTS_COLLECTION_ID,
          attr.key,
          attr.required,
        );
      }
      console.log(`Created attribute ${attr.key} for Blog Posts collection`);
    } catch (error: any) {
      if (error?.code === 409) {
        console.log(
          `Attribute ${attr.key} already exists for Blog Posts collection`,
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
      BLOG_POSTS_COLLECTION_ID,
      "slug_index",
      IndexType.Unique,
      ["slug"],
      [],
    );
    console.log("Created slug index for Blog Posts collection");
  } catch (error: any) {
    if (error?.code === 409) {
      console.log("Slug index already exists for Blog Posts collection");
    } else {
      throw error;
    }
  }

  try {
    await databases.createIndex(
      databaseId,
      BLOG_POSTS_COLLECTION_ID,
      "featured_index",
      IndexType.Key,
      ["featured"],
      [],
    );
    console.log("Created featured index for Blog Posts collection");
  } catch (error: any) {
    if (error?.code === 409) {
      console.log("Featured index already exists for Blog Posts collection");
    } else {
      throw error;
    }
  }

  try {
    await databases.createIndex(
      databaseId,
      BLOG_POSTS_COLLECTION_ID,
      "series_index",
      IndexType.Key,
      ["series_id", "series_position"],
      [],
    );
    console.log("Created series index for Blog Posts collection");
  } catch (error: any) {
    if (error?.code === 409) {
      console.log("Series index already exists for Blog Posts collection");
    } else {
      throw error;
    }
  }

  try {
    await databases.createIndex(
      databaseId,
      BLOG_POSTS_COLLECTION_ID,
      "likes_index", 
      IndexType.Key,
      ["likes"],
    );
    console.log("Created likes index for Blog Posts collection");
  } catch (error: any) {
    if (error?.code === 409) {
      console.log("Likes index already exists for Blog Posts collection");
    } else {
      throw error;
    }
  }

  try {
    await databases.createIndex(
      databaseId,
      BLOG_POSTS_COLLECTION_ID,
      "read_count_index",  
      IndexType.Key,
      ["read_count"],
    );
    console.log("Created read_count index for Blog Posts collection");
  } catch (error: any) {
    if (error?.code === 409) {
      console.log("Read count index already exists for Blog Posts collection");
    } else {
      throw error;
    }
  }

  console.log("✅ Blog Posts collection setup complete!");
}

export default setupBlogPostsCollection;

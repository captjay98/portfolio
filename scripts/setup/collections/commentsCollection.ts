import { Databases, IndexType, Permission, Role } from "node-appwrite";
import { getOrCreateCollection } from "./utils";
import { COMMENTS_COLLECTION_ID } from "@/lib/appwrite";

async function setupCommentsCollection(
  databases: Databases,
  databaseId: string,
) {
  console.log("Setting up Comments collection...");

  const commentPermissions = [
    Permission.read(Role.any()),
    Permission.create(Role.any()),
    Permission.update(Role.any()),
    Permission.delete(Role.label("admin")),
  ];

  // Use the utility to create or get the collection with standard permissions
  await getOrCreateCollection(
    databases,
    databaseId,
    COMMENTS_COLLECTION_ID,
    "Comments",
    commentPermissions,
  );

  // Define attributes
  const attributes = [
    { key: "content_id", type: "string", size: 36, required: true },
    { key: "user_id", type: "string", size: 36, required: true },
    { key: "user_avatar", type: "string", size: 255, required: false },
    { key: "user_name", type: "string", size: 100, required: false },
    { key: "user_email", type: "string", size: 255, required: false },
    { key: "text", type: "string", size: 5000, required: true },
    { key: "date", type: "string", size: 50, required: true },
    { key: "likes", type: "integer", required: false },
  ];

  // Create attributes
  for (const attr of attributes) {
    try {
      if (attr.type === "integer") {
        await databases.createIntegerAttribute(
          databaseId,
          COMMENTS_COLLECTION_ID,
          attr.key,
          attr.required,
        );
        console.log(
          `Created integer attribute ${attr.key} for Comments collection`,
        );
      } else if (attr.type === "string") {
        await databases.createStringAttribute(
          databaseId,
          COMMENTS_COLLECTION_ID,
          attr.key,
          attr.size!,
          attr.required,
        );
        console.log(`Created attribute ${attr.key} for Comments collection`);
      }
    } catch (error: any) {
      if (error?.code === 409) {
        console.log(
          `Attribute ${attr.key} already exists for Comments collection`,
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
      COMMENTS_COLLECTION_ID,
      "by_content",
      IndexType.Key,
      ["content_id"],
    );
    console.log("Created content index for Comments collection");
  } catch (error: any) {
    if (error?.code === 409) {
      console.log("Content index already exists for Comments collection");
    } else {
      throw error;
    }
  }

  try {
    await databases.createIndex(
      databaseId,
      COMMENTS_COLLECTION_ID,
      "by_user",
      IndexType.Key,
      ["user_id"],
    );
    console.log("Created user index for Comments collection");
  } catch (error: any) {
    if (error?.code === 409) {
      console.log("User index already exists for Comments collection");
    } else {
      throw error;
    }
  }

  console.log("✅ Comments collection setup complete!");
}

export default setupCommentsCollection;

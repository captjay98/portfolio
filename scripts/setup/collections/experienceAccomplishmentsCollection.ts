import { Databases, IndexType } from "node-appwrite";
import { getOrCreateCollection } from "./utils";

async function setupExperienceAccomplishmentsCollection(
  databases: Databases,
  databaseId: string,
) {
  console.log("Setting up Experience Accomplishments collection...");

  // Use the utility to create or get the collection with standard permissions
  const collectionId = "experience_accomplishments";
  await getOrCreateCollection(
    databases,
    databaseId,
    collectionId,
    "Experience Accomplishments",
  );

  // Define attributes
  const attributes = [
    { key: "experience_id", type: "string", size: 36, required: true },
    { key: "text", type: "string", size: 1000, required: true },
    { key: "order", type: "integer", required: true },
  ];

  // Create attributes
  for (const attr of attributes) {
    try {
      if (attr.type === "string") {
        await databases.createStringAttribute(
          databaseId,
          collectionId,
          attr.key,
          attr.size!,
          attr.required,
        );
      } else if (attr.type === "integer") {
        await databases.createIntegerAttribute(
          databaseId,
          collectionId,
          attr.key,
          attr.required,
        );
      }
      console.log(
        `Created attribute ${attr.key} for Experience Accomplishments collection`,
      );
    } catch (error: any) {
      if (error?.code === 409) {
        console.log(
          `Attribute ${attr.key} already exists for Experience Accomplishments collection`,
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
      "by_experience",
      IndexType.Key,
      ["experience_id"],
    );
    console.log(
      "Created experience index for Experience Accomplishments collection",
    );
  } catch (error: any) {
    if (error?.code === 409) {
      console.log(
        "Experience index already exists for Experience Accomplishments collection",
      );
    } else {
      throw error;
    }
  }

  try {
    await databases.createIndex(
      databaseId,
      collectionId,
      "by_order",
      IndexType.Key,
      ["order"],
    );
    console.log(
      "Created order index for Experience Accomplishments collection",
    );
  } catch (error: any) {
    if (error?.code === 409) {
      console.log(
        "Order index already exists for Experience Accomplishments collection",
      );
    } else {
      throw error;
    }
  }

  console.log("✅ Experience Accomplishments collection setup complete!");
}

export default setupExperienceAccomplishmentsCollection;

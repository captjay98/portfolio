import { VISITORS_COLLECTION_ID } from "@/lib/appwrite";
import { Databases, IndexType, Permission, Role } from "node-appwrite";
import { getOrCreateCollection } from "./utils";

async function setupVisitorsCollection(
  databases: Databases,
  databaseId: string,
) {
  console.log("Setting up Visitors collection...");

  // Define custom permissions for visitors collection
  const visitorPermissions = [
    Permission.read(Role.any()),
    Permission.create(Role.any()),
    Permission.update(Role.any()),
    Permission.delete(Role.label("admin")),
  ];

  // Use the utility with custom permissions
  await getOrCreateCollection(
    databases,
    databaseId,
    VISITORS_COLLECTION_ID,
    "Visitors",
    visitorPermissions,
  );

  // Define attributes
  const attributes = [
    { key: "timestamp", type: "string", size: 100, required: true },
    { key: "ip_address", type: "string", size: 100, required: false },
    { key: "user_agent", type: "string", size: 500, required: false },
    { key: "referrer", type: "string", size: 500, required: false },
    { key: "page", type: "string", size: 255, required: false },
    { key: "visit_count", type: "integer", required: true },
    { key: "session_id", type: "string", size: 100, required: true },
    { key: "country_code", type: "string", size: 55, required: false },
    { key: "country_name", type: "string", size: 100, required: false },
  ];

  // Create attributes
  for (const attr of attributes) {
    try {
      if (attr.type === "string") {
        await databases.createStringAttribute(
          databaseId,
          VISITORS_COLLECTION_ID,
          attr.key,
          attr.size!,
          attr.required,
        );
      } else if (attr.type === "integer") {
        await databases.createIntegerAttribute(
          databaseId,
          VISITORS_COLLECTION_ID,
          attr.key,
          attr.required,
        );
      }
    } catch (error) {
      console.error(`Error creating attribute ${attr.key}:`, error);
    }
  }

  // Create indexes
  try {
    // Index for timestamp (for recent visits)
    await databases.createIndex(
      databaseId,
      VISITORS_COLLECTION_ID,
      "timestamp_idx",
      IndexType.Key,
      ["timestamp"],
    );

    // Index for session_id (for unique visitor counting)
    await databases.createIndex(
      databaseId,
      VISITORS_COLLECTION_ID,
      "session_id_idx",
      IndexType.Key,
      ["session_id"],
    );

    // Index for page (for page-specific analytics)
    await databases.createIndex(
      databaseId,
      VISITORS_COLLECTION_ID,
      "page_idx",
      IndexType.Key,
      ["page"],
    );

    // Index for country_code (for country-specific analytics)
    await databases.createIndex(
      databaseId,
      VISITORS_COLLECTION_ID,
      "country_idx",
      IndexType.Key,
      ["country_code"],
    );
  } catch (error) {
    console.error("Error creating indexes:", error);
  }

  console.log("Visitors collection setup complete");
}

export default setupVisitorsCollection;

import { CONTACT_SUBMISSIONS_COLLECTION_ID } from "@/lib/appwrite";
import { Databases, IndexType, Permission, Role } from "node-appwrite";

async function setupContactSubmissionsCollection(
  databases: Databases,
  databaseId: string,
) {
  console.log("Setting up Contact Submissions collection...");

  try {
    // Check if collection exists
    await databases.getCollection(
      databaseId,
      CONTACT_SUBMISSIONS_COLLECTION_ID,
    );
    console.log(
      `Collection 'Contact Submissions' already exists with ID: ${CONTACT_SUBMISSIONS_COLLECTION_ID}`,
    );
  } catch (error) {
    // Create collection if it doesn't exist
    const collection = await databases.createCollection(
      databaseId,
      CONTACT_SUBMISSIONS_COLLECTION_ID,
      "Contact Submissions",
      [
        Permission.read(Role.any()),
        Permission.create(Role.any()),
        Permission.update(Role.label("admin")),
        Permission.delete(Role.label("admin")),
      ],
    );
    console.log(
      `Created collection 'Contact Submissions' with ID: ${collection.$id}`,
    );
  }

  // Define attributes
  const attributes = [
    { key: "name", type: "string", size: 255, required: true },
    { key: "email", type: "email", required: true },
    { key: "subject", type: "string", size: 500, required: true },
    { key: "message", type: "string", size: 10000, required: true },
  ];

  // Create attributes
  for (const attr of attributes) {
    try {
      if (attr.type === "string") {
        await databases.createStringAttribute(
          databaseId,
          CONTACT_SUBMISSIONS_COLLECTION_ID,
          attr.key,
          attr.size!,
          attr.required,
        );
      } else if (attr.type === "email") {
        await databases.createEmailAttribute(
          databaseId,
          CONTACT_SUBMISSIONS_COLLECTION_ID,
          attr.key,
          attr.required,
        );
      }
      console.log(
        `Created attribute ${attr.key} for Contact Submissions collection`,
      );
    } catch (error: any) {
      if (error?.code === 409) {
        console.log(
          `Attribute ${attr.key} already exists for Contact Submissions collection`,
        );
      } else {
        throw error;
      }
    }
  }

  console.log("✅ Contact Submissions collection setup complete!");
}

export default setupContactSubmissionsCollection;

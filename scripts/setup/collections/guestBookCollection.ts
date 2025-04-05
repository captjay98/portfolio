import { Databases, IndexType, Permission, Role } from "node-appwrite";
import { getOrCreateCollection } from "./utils";
import { GUEST_BOOK_COLLECTION_ID } from "@/lib/appwrite";

async function setupGuestBookCollection(
  databases: Databases,
  databaseId: string,
) {
  console.log("Setting up Guest Book collection...");

  // Define custom permissions for guestbook collection
  const guestbookPermissions = [
    Permission.read(Role.any()),
    Permission.create(Role.any()),
    Permission.update(Role.label("admin")),
    Permission.delete(Role.label("admin")),
  ];

  // Use the utility with custom permissions
  await getOrCreateCollection(
    databases,
    databaseId,
    GUEST_BOOK_COLLECTION_ID,
    "Guest Book",
    guestbookPermissions,
  );

  const attributes = [
    { key: "name", type: "string", size: 255, required: true },
    { key: "email", type: "email", required: false },
    { key: "message", type: "string", size: 1000, required: true },
    { key: "date", type: "string", size: 50, required: true },
    { key: "ip_address", type: "string", size: 100, required: false },
  ];

  // Create attributes
  for (const attr of attributes) {
    try {
      if (attr.type === "string") {
        await databases.createStringAttribute(
          databaseId,
          GUEST_BOOK_COLLECTION_ID,
          attr.key,
          attr.size!,
          attr.required,
        );
      } else if (attr.type === "email") {
        await databases.createEmailAttribute(
          databaseId,
          GUEST_BOOK_COLLECTION_ID,
          attr.key,
          attr.required,
        );
      }
      console.log(`Created attribute ${attr.key} for Guest Book collection`);
    } catch (error: any) {
      if (error?.code === 409) {
        console.log(
          `Attribute ${attr.key} already exists for Guest Book collection`,
        );
      } else {
        throw error;
      }
    }
  }

  console.log("✅ Guest Book collection setup complete!");
}

export default setupGuestBookCollection;

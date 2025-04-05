import { Client, Databases, Permission, Role } from "node-appwrite";
import dotenv from "dotenv";

dotenv.config();

// Initialize Appwrite client
const client = new Client();
client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "")
  .setKey(process.env.APPWRITE_API_KEY || "");

const databases = new Databases(client);

// Define the standard permissions we want to apply
const standardPermissions = [
  Permission.read(Role.any()),
  Permission.create(Role.label("admin")),
  Permission.update(Role.label("admin")),
  Permission.delete(Role.label("admin")),
];

async function updateCollectionPermissions() {
  console.log("🔄 Updating collection permissions...");

  const databaseId =
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "portfolio";

  try {
    // Get all collections
    const response = await databases.listCollections(databaseId);

    console.log(`Found ${response.collections.length} collections to update`);

    // Update permissions for each collection
    for (const collection of response.collections) {
      console.log(
        `Updating permissions for collection: ${collection.name} (${collection.$id})`,
      );

      try {
        await databases.updateCollection(
          databaseId,
          collection.$id,
          collection.name,
          standardPermissions,
        );
        console.log(
          `✅ Updated permissions for collection: ${collection.name}`,
        );
      } catch (error) {
        console.error(
          `❌ Failed to update permissions for collection ${collection.name}:`,
          error,
        );
      }
    }

    console.log("✅ Collection permissions update complete!");
  } catch (error) {
    console.error("❌ Failed to update collection permissions:", error);
    throw error;
  }
}

// If this script is run directly, execute the update
if (require.main === module) {
  updateCollectionPermissions()
    .then(() => {
      console.log("Permissions update complete!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Update failed:", error);
      process.exit(1);
    });
}

export default updateCollectionPermissions;

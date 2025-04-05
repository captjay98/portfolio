import setupDatabase from "./setupDatabase";
import setupCollections from "./setupCollections";
import setupStorage from "./setupStorage";
import setupUsers from "./setupUsers";
import dotenv from "dotenv";

dotenv.config();

async function setupAppwrite() {
  console.log("🚀 Starting Appwrite setup...");

  try {
    // Step 1: Setup database
    console.log("\n=== SETTING UP DATABASE ===");
    const databaseId = await setupDatabase();

    // Step 2: Setup storage
    console.log("\n=== SETTING UP STORAGE ===");
    await setupStorage();

    // Step 3: Setup collections
    console.log("\n=== SETTING UP COLLECTIONS ===");
    await setupCollections();

    // Step 4: Setup admin user
    console.log("\n=== SETTING UP ADMIN USER ===");
    const { adminUserId } = await setupUsers();

    console.log("\n✅ Appwrite setup completed successfully!");
    console.log(`
    Important IDs:
    - Database ID: ${databaseId}
    - Admin User ID: ${adminUserId}
    
    Make sure these IDs are set in your .env file:
    NEXT_PUBLIC_APPWRITE_DATABASE_ID=${databaseId}
    `);
  } catch (error) {
    console.error("\n❌ Appwrite setup failed:", error);
    process.exit(1);
  }
}

// If this script is run directly, execute the setup
if (require.main === module) {
  setupAppwrite()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error("Setup failed:", error);
      process.exit(1);
    });
}

export default setupAppwrite;

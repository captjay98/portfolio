import { Client, Databases, Storage, Users } from "node-appwrite";
import dotenv from "dotenv";
import readline from "readline";

dotenv.config();

// Initialize Appwrite client
const client = new Client();

client
  .setEndpoint(
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1",
  )
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "")
  .setKey(process.env.APPWRITE_API_KEY || "");

const databases = new Databases(client);
const storage = new Storage(client);
const users = new Users(client);

// Create readline interface for confirmations
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askForConfirmation = (message: string): Promise<boolean> => {
  return new Promise((resolve) => {
    rl.question(`${message} (yes/no): `, (answer) => {
      resolve(answer.toLowerCase() === "yes");
    });
  });
};

// Delete all databases
const cleanupDatabases = async () => {
  console.log("Fetching all databases...");

  try {
    const databasesList = await databases.list();

    if (databasesList.total === 0) {
      console.log("No databases found to delete.");
      return;
    }

    console.log(`Found ${databasesList.total} database(s).`);

    for (const database of databasesList.databases) {
      const confirmed = await askForConfirmation(
        `Delete database "${database.name}" (ID: ${database.$id})?`,
      );

      if (confirmed) {
        try {
          await databases.delete(database.$id);
          console.log(`✅ Database "${database.name}" deleted successfully.`);
        } catch (error) {
          console.error(
            `❌ Failed to delete database "${database.name}":`,
            error,
          );
        }
      } else {
        console.log(`Skipping database "${database.name}".`);
      }
    }

    console.log("Database cleanup completed.");
  } catch (error) {
    console.error("Error during database cleanup:", error);
  }
};

// Delete all storage buckets
const cleanupBuckets = async () => {
  console.log("Fetching all storage buckets...");

  try {
    const bucketsList = await storage.listBuckets();

    if (bucketsList.total === 0) {
      console.log("No storage buckets found to delete.");
      return;
    }

    console.log(`Found ${bucketsList.total} bucket(s).`);

    for (const bucket of bucketsList.buckets) {
      const confirmed = await askForConfirmation(
        `Delete bucket "${bucket.name}" (ID: ${bucket.$id})?`,
      );

      if (confirmed) {
        try {
          await storage.deleteBucket(bucket.$id);
          console.log(`✅ Bucket "${bucket.name}" deleted successfully.`);
        } catch (error) {
          console.error(`❌ Failed to delete bucket "${bucket.name}":`, error);
        }
      } else {
        console.log(`Skipping bucket "${bucket.name}".`);
      }
    }

    console.log("Storage bucket cleanup completed.");
  } catch (error) {
    console.error("Error during storage bucket cleanup:", error);
  }
};

// Delete all users
const cleanupUsers = async () => {
  console.log("Fetching all users...");

  try {
    const usersList = await users.list();

    if (usersList.total === 0) {
      console.log("No users found to delete.");
      return;
    }

    console.log(`Found ${usersList.total} user(s).`);

    const confirmed = await askForConfirmation(
      `Delete all ${usersList.total} users?`,
    );

    if (confirmed) {
      let deletedCount = 0;
      let errorCount = 0;

      for (const user of usersList.users) {
        try {
          await users.delete(user.$id);
          deletedCount++;
          process.stdout.write(
            `\rDeleting users: ${deletedCount}/${usersList.total}`,
          );
        } catch (error) {
          errorCount++;
          console.error(`\n❌ Failed to delete user "${user.$id}":`, error);
        }
      }

      console.log(`\n✅ Deleted ${deletedCount} users. Failed: ${errorCount}.`);
    } else {
      console.log("Skipping user deletion.");
    }

    console.log("User cleanup completed.");
  } catch (error) {
    console.error("Error during user cleanup:", error);
  }
};

// Main cleanup function
const runCleanup = async () => {
  console.log("🧹 Starting Appwrite project cleanup...");

  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  const warning = [
    "⚠️  WARNING: This script will delete all databases, storage buckets, and users from your Appwrite project.",
    `⚠️  Project ID: ${projectId}`,
    "⚠️  This action cannot be undone!",
  ];

  warning.forEach((line) => console.log(line));

  const proceed = await askForConfirmation(
    "Are you absolutely sure you want to proceed?",
  );

  if (!proceed) {
    console.log("Cleanup cancelled.");
    rl.close();
    return;
  }

  const finalCheck = await askForConfirmation(
    "Last chance: All data will be permanently deleted. Continue?",
  );

  if (!finalCheck) {
    console.log("Cleanup cancelled.");
    rl.close();
    return;
  }

  // Run the cleanup operations
  await cleanupDatabases();
  await cleanupBuckets();
  await cleanupUsers();

  console.log("✅ Appwrite project cleanup completed.");
  rl.close();
};

// Run the script
if (require.main === module) {
  runCleanup().catch((error) => {
    console.error("Cleanup failed:", error);
    process.exit(1);
  });
}

export default runCleanup;

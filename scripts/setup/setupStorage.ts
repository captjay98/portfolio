import { Client, Permission, Role, Storage } from "node-appwrite";
import dotenv from "dotenv";
import { BLOG_BUCKET_ID, PORTFOLIO_BUCKET_ID } from "@/lib/appwrite";

dotenv.config();

// Initialize Appwrite client
const client = new Client();
client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "")
  .setKey(process.env.APPWRITE_API_KEY || "");

const storage = new Storage(client);

async function setupStorage() {
  console.log("📦 Setting up storage buckets...");

  try {
    // Setup Project Images Bucket
    await setupBucket(PORTFOLIO_BUCKET_ID, "Project Images", 10 * 1024 * 1024);

    // Setup Blog Images Bucket
    await setupBucket(BLOG_BUCKET_ID, "Blog Images", 10 * 1024 * 1024);

    console.log("✅ All storage buckets setup complete!");
  } catch (error) {
    console.error("❌ Storage setup failed:", error);
    throw error;
  }
}

async function setupBucket(
  bucketId: string,
  name: string,
  maximumFileSize: number,
) {
  console.log(`Setting up ${name} bucket...`);

  try {
    // Try to get the bucket (will throw if it doesn't exist)
    await storage.getBucket(bucketId);
    console.log(`Bucket '${name}' already exists with ID: ${bucketId}`);
  } catch (error) {
    // Bucket doesn't exist, create it
    // Updated parameters according to the method signature
    await storage.createBucket(
      bucketId,
      name,
      [
        Permission.read(Role.any()),
        Permission.update(Role.label("admin")),
        Permission.create(Role.label("admin")),
        Permission.delete(Role.label("admin")),
      ],
      false, // File security
      true, // Enabled
      maximumFileSize,
      [],
      undefined, // Compression
      false, // Encryption
      true, // Antivirus
    );
    console.log(`Created bucket '${name}' with ID: ${bucketId}`);
  }
}

// If this script is run directly, execute the setup
if (require.main === module) {
  setupStorage()
    .then(() => {
      console.log("Storage setup complete!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Setup failed:", error);
      process.exit(1);
    });
}

export default setupStorage;

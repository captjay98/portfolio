import dotenv from "dotenv";
import { Client, Databases } from "node-appwrite";

// Load environment variables
dotenv.config();

async function checkCollections() {
  // Initialize Appwrite client
  const client = new Client();
  client
    .setEndpoint(
      process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ||
        "https://cloud.appwrite.io/v1",
    )
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "")
    .setKey(process.env.APPWRITE_API_KEY || "");

  // Initialize database service
  const databases = new Databases(client);

  try {
    // Check if database exists
    console.log("Checking database...");
    console.log(`Database ID: ${process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID}`);

    // Get all collections in the database
    console.log("Fetching collections...");
    const response = await databases.listCollections(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "",
    );

    console.log("\nAvailable Collections:");
    response.collections.forEach((collection) => {
      console.log(`- ${collection.name} (ID: ${collection.$id})`);
    });

    // Check for required collections
    const requiredCollections = [
      "projects",
      "categories",
      "technologies",
      "skills",
      "experiences",
      "experience_accomplishments",
      "blog_posts",
      "blog_series",
    ];

    console.log("\nMissing Collections:");
    const availableCollections = response.collections.map((c) => c.$id);
    const missingCollections = requiredCollections.filter(
      (reqCol) => !availableCollections.includes(reqCol),
    );

    if (missingCollections.length === 0) {
      console.log("None - All required collections exist");
    } else {
      missingCollections.forEach((col) => console.log(`- ${col}`));
      console.log(
        "\nPlease create these collections in your Appwrite dashboard before seeding.",
      );
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

checkCollections();

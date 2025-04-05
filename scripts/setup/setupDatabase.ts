import { Client, Databases } from "node-appwrite";
import dotenv from "dotenv";

dotenv.config();

// Initialize Appwrite client
const client = new Client();
client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "")
  .setKey(process.env.APPWRITE_API_KEY || "");

const databases = new Databases(client);

// Specific database ID to use
const PORTFOLIO_DATABASE_ID = "portfolio";

async function setupDatabase() {
  console.log("🗄️ Setting up database...");

  try {
    // Check if the database with our specified ID already exists
    try {
      const existingDatabase = await databases.get(PORTFOLIO_DATABASE_ID);
      console.log(
        `Database 'portfolio' already exists with ID: ${existingDatabase.$id}`,
      );
      return PORTFOLIO_DATABASE_ID;
    } catch (error) {
      // Database doesn't exist yet, we'll create it
      console.log(`Database 'portfolio' doesn't exist yet. Creating...`);
    }

    // Create the database with specific ID
    const database = await databases.create(
      PORTFOLIO_DATABASE_ID,
      "Portfolio Database",
    );
    console.log(`✅ Database created with ID: ${database.$id}`);

    console.log(
      `Database ID: ${PORTFOLIO_DATABASE_ID}. Please add this to your .env file as NEXT_PUBLIC_APPWRITE_DATABASE_ID`,
    );
    return PORTFOLIO_DATABASE_ID;
  } catch (error) {
    console.error("❌ Database setup failed:", error);
    throw error;
  }
}

// If this script is run directly, execute the setup
if (require.main === module) {
  setupDatabase()
    .then((databaseId) => {
      console.log(`Database setup complete. Database ID: ${databaseId}`);
      process.exit(0);
    })
    .catch((error) => {
      console.error("Setup failed:", error);
      process.exit(1);
    });
}

export default setupDatabase;

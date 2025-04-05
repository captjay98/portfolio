import { Client, Databases } from "node-appwrite";
import dotenv from "dotenv";
import setupDatabase from "./setupDatabase";

// Import collection setup functions
import setupProjectsCollection from "./collections/projectsCollection";
import setupBlogSeriesCollection from "./collections/blogSeriesCollection";
import setupBlogPostsCollection from "./collections/blogPostsCollection";
import setupCategoriesCollection from "./collections/categoriesCollection";
import setupTechnologiesCollection from "./collections/technologiesCollection";
import setupContactSubmissionsCollection from "./collections/contactSubmissionsCollection";
import setupSiteSettingsCollection from "./collections/siteSettingsCollection";
import setupCommentsCollection from "./collections/commentsCollection";
import setupExperienceAccomplishmentsCollection from "./collections/experienceAccomplishmentsCollection";
import setupExperiencesCollection from "./collections/experiencesCollection";
import setupGuestBookCollection from "./collections/guestBookCollection";
import setupSkillsCollection from "./collections/skillsCollection";
import setupProfileCollection from "./collections/profileCollection";
import setupSocialLinksCollection from "./collections/socialLinksCollection";
import setupUsesCollection from "./collections/usesCollection";
import setupEducationCollection from "./collections/educationCollection";
import setupCurrentTechStackCollection from "./collections/currentTechStackCollection";
import setupVisitorsCollection from "./collections/visitorsCollection";

dotenv.config();

// Initialize Appwrite client
const client = new Client();
client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "")
  .setKey(process.env.APPWRITE_API_KEY || "");

const databases = new Databases(client);

async function setupCollections() {
  // Get database ID from environment or create a new database
  let databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

  if (!databaseId) {
    console.log(
      "No database ID found in environment variables. Creating a new database...",
    );
    databaseId = await setupDatabase();
  }

  console.log(`Using database ID: ${databaseId}`);

  try {
    // Setup each collection using imported functions

    await setupCategoriesCollection(databases, databaseId);
    await setupTechnologiesCollection(databases, databaseId);
    await setupSkillsCollection(databases, databaseId);
    await setupCurrentTechStackCollection(databases, databaseId);

    await setupProjectsCollection(databases, databaseId);
    await setupBlogSeriesCollection(databases, databaseId);
    await setupBlogPostsCollection(databases, databaseId);
    await setupCommentsCollection(databases, databaseId);

    await setupExperienceAccomplishmentsCollection(databases, databaseId);
    await setupExperiencesCollection(databases, databaseId);

    await setupProfileCollection(databases, databaseId);
    await setupSocialLinksCollection(databases, databaseId);
    await setupUsesCollection(databases, databaseId);
    await setupEducationCollection(databases, databaseId);

    await setupContactSubmissionsCollection(databases, databaseId);
    await setupSiteSettingsCollection(databases, databaseId);

    await setupGuestBookCollection(databases, databaseId);
    await setupVisitorsCollection(databases, databaseId);

    console.log("✅ All collections setup complete!");
  } catch (error) {
    console.error("❌ Collection setup failed:", error);
    throw error;
  }
}

// If this script is run directly, execute the setup
if (require.main === module) {
  setupCollections()
    .then(() => {
      console.log("All collections setup complete!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Setup failed:", error);
      process.exit(1);
    });
}

export default setupCollections;

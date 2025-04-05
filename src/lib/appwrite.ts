import {
  Client as BrowserClient,
  Databases,
  Storage,
  Account,
  ID,
  Query,
} from "appwrite";
import {
  Client as NodeClient,
  Databases as NodeDatabases,
  Storage as NodeStorage,
} from "node-appwrite";

// Appwrite configuration
export const appwriteConfig = {
  endpoint:
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1",
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "",
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "",
  apiKey: process.env.APPWRITE_API_KEY || "",
};

// Initialize the appropriate Appwrite client based on environment
const isServer = typeof window === "undefined";

let client: BrowserClient | NodeClient;
let databases: Databases | NodeDatabases;
let storage: Storage | NodeStorage;
let account: Account | null = null;

if (isServer) {
  // Server environment - use node-appwrite
  client = new NodeClient();

  client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setKey(appwriteConfig.apiKey);

  databases = new NodeDatabases(client as NodeClient);
  storage = new NodeStorage(client as NodeClient);

  console.log("Using server-side Appwrite client");
} else {
  // Browser environment - use browser SDK
  client = new BrowserClient();

  client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId);

  databases = new Databases(client as BrowserClient);
  storage = new Storage(client as BrowserClient);
  account = new Account(client as BrowserClient);

  console.log("Using client-side Appwrite client");
}

// Export the initialized services
export { client, databases, storage, account, ID, Query };

// Collection IDs
export const DATABASE_ID = appwriteConfig.databaseId;
export const CATEGORIES_COLLECTION_ID = "categories";
export const TECHNOLOGIES_COLLECTION_ID = "technologies";
export const SKILLS_COLLECTION_ID = "skills";
export const EXPERIENCES_COLLECTION_ID = "experiences";
export const EXPERIENCE_ACCOMPLISHMENTS_COLLECTION_ID =
  "experience_accomplishments";
export const PROJECTS_COLLECTION_ID = "projects";
export const BLOG_POSTS_COLLECTION_ID = "blog_posts";
export const COMMENTS_COLLECTION_ID = "comments";
export const GUEST_BOOK_COLLECTION_ID = "guest_book";
export const CONTACT_SUBMISSIONS_COLLECTION_ID = "contact_submissions";
export const SITE_SETTINGS_COLLECTION_ID = "site_settings";
export const VISITORS_COLLECTION_ID = "visitors";

export const PROFILE_COLLECTION_ID = "profile";
export const SOCIAL_LINKS_COLLECTION_ID = "social_links";
export const USES_COLLECTION_ID = "uses";
export const EDUCATION_COLLECTION_ID = "education";
export const CURRENT_TECH_STACK_COLLECTION_ID = "current_tech_stack";

// Storage bucket IDs
export const PORTFOLIO_BUCKET_ID = "portfolio";
export const BLOG_BUCKET_ID = "blog";

import { Client, Users, ID } from "node-appwrite";
import dotenv from "dotenv";

dotenv.config();

// Initialize Appwrite client
const client = new Client();
client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "")
  .setKey(process.env.APPWRITE_API_KEY || "");

const users = new Users(client);

// Default user credentials
const DEFAULT_EMAIL = process.env.DEFAULT_ADMIN_EMAIL || "admin@example.com";
const DEFAULT_PASSWORD =
  process.env.DEFAULT_ADMIN_PASSWORD || "Strong_Password";

async function setupUsers() {
  console.log("👤 Setting up admin user...");

  try {
    // Check if admin user already exists
    const usersList = await users.list();
    const existingAdmin = usersList.users.find(
      (user) => user.email === DEFAULT_EMAIL,
    );

    let adminUser;

    if (existingAdmin) {
      adminUser = existingAdmin;
      console.log(
        `Admin user already exists with ID: ${adminUser.$id} and email: ${adminUser.email}`,
      );
    } else {
      // Create new admin user
      adminUser = await users.create(
        ID.unique(),
        DEFAULT_EMAIL,
        undefined,
        DEFAULT_PASSWORD,
        DEFAULT_EMAIL.split("@")[0],
      );
      console.log(
        `✅ Admin user created with ID: ${adminUser.$id} and email: ${DEFAULT_EMAIL}`,
      );

      // Show password if using default
      if (!process.env.DEFAULT_ADMIN_PASSWORD) {
        console.log(`⚠️ Using default password: ${DEFAULT_PASSWORD}`);
        console.log("Please change this password after first login.");
      }
    }

    // Add admin label to user
    await users.updateLabels(adminUser.$id, ["admin"]);
    console.log(`✅ Added admin label to user ${adminUser.email}`);

    console.log("✅ Admin user setup complete!");
    return { adminUserId: adminUser.$id };
  } catch (error) {
    console.error("❌ User setup failed:", error);
    throw error;
  }
}

// If this script is run directly, execute the setup
if (require.main === module) {
  setupUsers()
    .then(({ adminUserId }) => {
      console.log(`
Admin user setup complete!
- Admin user ID: ${adminUserId}
      `);
      process.exit(0);
    })
    .catch((error) => {
      console.error("Setup failed:", error);
      process.exit(1);
    });
}

export default setupUsers;

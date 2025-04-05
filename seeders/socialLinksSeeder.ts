import { databases, ID, appwriteConfig } from "@/lib/appwrite";

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
  priority: number;
  is_visible: boolean;
}

export const socialLinksData: SocialLink[] = [
  {
    platform: "GitHub",
    url: "https://github.com/captjay98",
    icon: "github",
    priority: 1,
    is_visible: true,
  },
  {
    platform: "LinkedIn",
    url: "https://linkedin.com/in/captjay98",
    icon: "linkedin",
    priority: 2,
    is_visible: true,
  },
  {
    platform: "Instagram",
    url: "https://instagram.com/captjay98",
    icon: "instagram",
    priority: 3,
    is_visible: true,
  },
  {
    platform: "Email",
    url: "mailto:captjay98@gmail.com",
    icon: "mail",
    priority: 4,
    is_visible: true,
  },
];

export const seedSocialLinks = async () => {
  console.log("Seeding social links...");

  try {
    // Check if links already exist
    const existingLinks = await databases.listDocuments(
      appwriteConfig.databaseId,
      "social_links",
    );

    if (existingLinks.documents.length > 0) {
      console.log("Social links already exist, skipping seeding");
      return;
    }

    // Create links
    for (const link of socialLinksData) {
      await databases.createDocument(
        appwriteConfig.databaseId,
        "social_links",
        ID.unique(),
        link,
      );
    }

    console.log("✅ Social links seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding social links:", error);
    throw error;
  }
};

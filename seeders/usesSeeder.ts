import {
  databases,
  ID,
  appwriteConfig,
  USES_COLLECTION_ID,
} from "@/lib/appwrite";
import { PORTFOLIO_BUCKET_ID } from "@/lib/appwrite";
import { UsesItemType } from "../src/types/admin";
import { storageService } from "@/services/storageService";

export const usesData: Partial<UsesItemType>[] = [
  // Development

  {
    category_id: "Development Tools",
    name: "AstroNvim",
    description: "My code editor when i want to code all alone.",
    link: "https://astronvim.com/",
    is_favorite: true,
    priority: 1,
  },
  {
    category_id: "Development Tools",
    name: "VS Code",
    description: "My code editor when i want to pair code with AI",
    link: "https://code.visualstudio.com/",
    is_favorite: true,
    priority: 2,
  },

  {
    category_id: "Development Tools",
    name: "Bruno",
    description: "Love the simplicity, my go do API client.",
    link: "https://bruno.com/",
    is_favorite: true,
    priority: 3,
  },

  {
    category_id: "Development Tools",
    name: "BeeKeeper Studio",
    description: "Again, love the simplicity, my go do SQL client.",
    link: "https://www.beekeeperstudio.io/",
    is_favorite: false,
    priority: 4,
  },

  {
    category_id: "Software",
    name: "POp_OS 24.04",
    description:
      "Running an Alpha Build, because I like to live on the edge and because I dig Cosmic.",
    is_favorite: true,
    priority: 1,
  },

  // Hardware
  {
    category_id: "Hardware",
    name: "ThinkPad X1 Carbon Gen 9",
    description: "Loaded with 32GB RAM. Because I need all the RAM I can get.",
    is_favorite: true,
    priority: 1,
  },

  // Productivity

  {
    category_id: "Productivity",
    name: "MDSILO",
    description:
      "A really really cool tool for managing writing and everthing else.",
    link: "https://mdsilo.com",
    is_favorite: true,
    priority: 1,
  },
  {
    category_id: "Productivity",
    name: "ClickUp",
    description:
      "For note-taking, project management, and organizing my personal knowledge base.",
    link: "https://www.clickup.com",
    is_favorite: false,
    priority: 2,
  },
];

export const seedUses = async () => {
  console.log("Seeding Uses items...");

  try {
    // Get category IDs for mapping
    const { categoryService } = await import("../src/services/categoryService");
    const categories = await categoryService.getCategories();

    // Create a mapping of category names to IDs
    const categoryMap = categories.reduce<Record<string, string>>(
      (map, cat) => {
        map[cat.name.toLowerCase()] = cat.id;
        return map;
      },
      {},
    );

    for (const item of usesData) {
      // Find category ID by name (since our category_id field currently stores the name)
      const categoryName = item.category_id;
      const categoryId = categoryMap[categoryName?.toLowerCase() || ""];

      if (!categoryId) {
        console.warn(
          `Category "${categoryName}" not found, skipping item "${item.name}"`,
        );
        continue;
      }

      // Handle image upload if needed
      let imageId = item.image_id || "";
      let imageUrl = item.image || "";

      if (imageUrl && imageUrl.startsWith("/")) {
        const file = await fetchImageAsFile(imageUrl);
        if (file) {
          const uploadedId = await storageService.uploadFile(
            file,
            PORTFOLIO_BUCKET_ID,
          );
          if (uploadedId) {
            imageId = uploadedId;
            imageUrl = storageService.getFileView(
              uploadedId,
              PORTFOLIO_BUCKET_ID,
            );
          }
        }
      }

      await databases.createDocument(
        appwriteConfig.databaseId,
        USES_COLLECTION_ID,
        ID.unique(),
        {
          category_id: categoryId, // Store the actual ID, not the name
          name: item.name,
          description: item.description,
          link: item.link,
          image: imageUrl,
          image_id: imageId,
          is_favorite: item.is_favorite,
          priority: item.priority,
        },
      );

      console.log(
        `Created Uses item: ${item.name} (Category: ${categoryName} → ${categoryId})`,
      );
    }

    console.log("Uses items seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding Uses items:", error);
    throw error;
  }
};

// Helper function to fetch an image and convert to File
const fetchImageAsFile = async (imagePath: string): Promise<File | null> => {
  try {
    const response = await fetch(
      imagePath.startsWith("http")
        ? imagePath
        : `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}${imagePath}`,
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${imagePath}`);
    }

    const blob = await response.blob();
    const filename = imagePath.split("/").pop() || "image.jpg";

    return new File([blob], filename, { type: blob.type });
  } catch (error) {
    console.error(`Error fetching image: ${imagePath}`, error);
    return null;
  }
};

import { BlogSeriesType } from "../src/types/admin";
import { blogService } from "@/services/blogService";

export const blogSeriesData: Array<
  Omit<BlogSeriesType, "id" | "created_at" | "updated_at">
> = [
  {
    title: "Getting Started with React",
    description:
      "A comprehensive series for beginners to learn React from scratch",
    slug: "getting-started-with-react",
    image: "blog/blog.jpg",
    image_id: "blog/react-series",
    status: "completed",
  },
  {
    title: "Modern JavaScript Features",
    description:
      "Exploring the latest JavaScript features and how to use them effectively",
    slug: "modern-javascript-features",
    image: "blog/blog1.webp",
    image_id: "blog/javascript-series",
    status: "ongoing",
  },
  {
    title: "Full Stack Development with MERN",
    description:
      "Building complete applications with MongoDB, Express, React, and Node.js",
    slug: "full-stack-mern",
    image: "blog/blog2.webp",
    image_id: "blog/mern-series",
    status: "ongoing",
  },
  {
    title: "Modern Mobile Phones",
    description:
      "Deep dives into smartphone technology, chipsets, and camera systems",
    slug: "modern-mobile-phones",
    image: "blog/blog3.webp",
    image_id: "blog/smartphones-series",
    status: "completed",
  },
  {
    title: "Electric Vehicle Revolution",
    description:
      "Tracking the evolution of electric vehicles and their impact on transportation",
    slug: "electric-vehicle-revolution",
    image: "blog/blog.jpg",
    image_id: "blog/ev-series",
    status: "ongoing",
  },
  {
    title: "Modern Military Aircraft",
    description:
      "Exploring the technology behind today's most advanced military aircraft",
    slug: "modern-military-aircraft",
    image: "blog/blog4.webp",
    image_id: "blog/military-aircraft-series",
    status: "completed",
  },
];

export const seedBlogSeries = async (): Promise<Record<string, string>> => {
  console.log("Seeding blog series...");

  // Create a map to store series titles to their IDs
  const seriesMap: Record<string, string> = {};

  try {
    for (const series of blogSeriesData) {
      // Prepare series data for createSeries function
      const seriesData: Omit<
        BlogSeriesType,
        "id" | "created_at" | "updated_at"
      > = {
        title: series.title,
        description: series.description,
        slug: series.slug,
        image: series.image,
        image_id: series.image_id,
        status: series.status,
      };

      // Create the series using blogService, passing the imageFile
      const createdSeries = await blogService.createSeries(seriesData);

      if (createdSeries) {
        seriesMap[series.title] = createdSeries.id;
        console.log(`Created series: ${series.title}`);
      } else {
        console.warn(`Failed to create series: ${series.title}`);
      }
    }

    console.log("Blog series seeding completed successfully!");
    return seriesMap;
  } catch (error) {
    console.error("Error seeding blog series:", error);
    throw error;
  }
};

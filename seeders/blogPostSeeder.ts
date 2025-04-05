import {
  databases,
  ID,
  appwriteConfig,
  BLOG_POSTS_COLLECTION_ID,
  BLOG_BUCKET_ID,
} from "@/lib/appwrite";
import { BlogPostType } from "../src/types/admin";

export const blogPostData: Omit<BlogPostType, "id">[] = [
  // Tech & Development Posts
  {
    title: "Introduction to React Components",
    slug: "introduction-to-react-components",
    excerpt: "Learn the fundamentals of React components and how they work",
    content: `
# Introduction to React Components

React is all about components. In this article, we'll explore what makes components so powerful and how to create them.

## What is a Component?

Components are reusable pieces of code that return React elements describing what should appear on the screen.

\`\`\`jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
\`\`\`

## Class vs. Functional Components

There are two ways to define a component...

...and much more content follows.
    `,
    cover_image: "blog/blog.jpg",
    cover_image_id: "blog/react-components",
    date: "2023-01-15",
    reading_time: "5 min",
    category_ids: ["Frontend Development"],
    tag_ids: ["beginners", "components", "jsx"],
    technology_ids: ["React", "JavaScript"],
    status: "published",
    featured: true,
    series_id: "Getting Started with React",
    series_position: 1,
    related_post_ids: [],
    recommended_next_read_id: "",
  },
  {
    title: "Understanding ES6 Destructuring",
    slug: "understanding-es6-destructuring",
    excerpt: "Master the powerful destructuring syntax introduced in ES6",
    content: `
# Understanding ES6 Destructuring

Destructuring is one of the most useful features introduced in ES6. Let's see how it works.

## Array Destructuring

Array destructuring allows you to extract values from arrays into distinct variables.

\`\`\`javascript
const numbers = [1, 2, 3, 4, 5];
const [first, second, ...rest] = numbers;

console.log(first); // 1
console.log(second); // 2
console.log(rest); // [3, 4, 5]
\`\`\`

...and much more content follows.
    `,
    cover_image: "blog/blog1.webp",
    cover_image_id: "blog/es6-destructuring",
    date: "2023-03-10",
    reading_time: "6 min",
    category_ids: ["Frontend Development", "Backend Development"],
    tag_ids: ["es6", "destructuring", "syntax"],
    technology_ids: ["JavaScript"],
    status: "published",
    featured: true,
    series_id: "Modern JavaScript Features",
    series_position: 1,
    related_post_ids: [],
    recommended_next_read_id: "",
  },

  // Mobile Technology Posts
  {
    title: "Understanding Smartphone SOCs: A Deep Dive",
    slug: "understanding-smartphone-socs",
    excerpt: "Exploring the technology that powers modern smartphones",
    content: `
# Understanding Smartphone SOCs: A Deep Dive

System on a Chip (SOC) is the heart of every modern smartphone. Let's explore what makes them tick.

## What is an SOC?

A System on a Chip integrates multiple components including:

- CPU (Central Processing Unit)
- GPU (Graphics Processing Unit)
- DSP (Digital Signal Processor)
- ISP (Image Signal Processor)
- Modem
- Memory
- And more

## Top SOC Manufacturers

### Qualcomm Snapdragon

Qualcomm's Snapdragon series powers many Android flagships...

...and much more content follows.
    `,
    cover_image: "blog/blog2.webp",
    cover_image_id: "blog/smartphone-socs",
    date: "2023-05-15",
    reading_time: "10 min",
    category_ids: ["Mobile Phones", "SOCs", "Technology"],
    tag_ids: ["smartphones", "processors", "qualcomm", "apple", "mediatek"],
    technology_ids: [],
    status: "published",
    featured: true,
    series_id: "Modern Mobile Phones",
    series_position: 1,
    related_post_ids: [],
    recommended_next_read_id: "",
  },

  // Automotive Posts
  {
    title: "Electric vs Hydrogen: The Future of Automotive Propulsion",
    slug: "electric-vs-hydrogen-future-automotive",
    excerpt:
      "Comparing the two leading technologies that aim to replace internal combustion engines",
    content: `
# Electric vs Hydrogen: The Future of Automotive Propulsion

As the world moves away from fossil fuels, two technologies are competing to power the vehicles of tomorrow.

## Battery Electric Vehicles (BEVs)

Battery electric vehicles store electricity in large battery packs...

## Hydrogen Fuel Cell Vehicles

Hydrogen vehicles use fuel cells to convert hydrogen into electricity...

...and much more content follows.
    `,
    cover_image: "blog/blog3.webp",
    cover_image_id: "blog/ev-vs-hydrogen",
    date: "2023-06-20",
    reading_time: "12 min",
    category_ids: ["Cars", "Electric Vehicles", "Technology"],
    tag_ids: ["ev", "hydrogen", "automotive", "sustainability"],
    technology_ids: [],
    status: "published",
    featured: false,
    series_id: "Electric Vehicle Revolution",
    series_position: 1,
    related_post_ids: [],
    recommended_next_read_id: "",
  },

  // Military Technology Posts
  {
    title: "The Evolution of Stealth Technology in Fighter Jets",
    slug: "evolution-stealth-technology-fighter-jets",
    excerpt: "How radar-evading technology has revolutionized aerial warfare",
    content: `
# The Evolution of Stealth Technology in Fighter Jets

Stealth technology has fundamentally changed how air combat works. Let's explore its development.

## The Early Days: F-117 Nighthawk

The F-117 Nighthawk was the first operational aircraft designed around stealth technology...

## Modern Stealth: F-22 and F-35

Today's fifth-generation fighters like the F-22 Raptor and F-35 Lightning II...

...and much more content follows.
    `,
    cover_image: "blog/blog4.webp",
    cover_image_id: "blog/stealth-technology",
    date: "2023-07-05",
    reading_time: "15 min",
    category_ids: ["Military Aircraft", "Aviation", "Technology"],
    tag_ids: ["stealth", "fighter jets", "radar", "aviation"],
    technology_ids: [],
    status: "published",
    featured: true,
    series_id: "Modern Military Aircraft",
    series_position: 1,
    related_post_ids: [],
    recommended_next_read_id: "",
  },
  {
    title: "Modern Main Battle Tanks: Technology and Capability",
    slug: "modern-main-battle-tanks",
    excerpt:
      "Exploring the technological advancements in today's armored warfare",
    content: `
# Modern Main Battle Tanks: Technology and Capability

Main battle tanks remain the backbone of land warfare. Let's examine the technology that makes them so formidable.

## Active Protection Systems

Modern tanks are increasingly equipped with active protection systems that can intercept incoming projectiles...

## Advanced Armor

Composite and reactive armor technologies have revolutionized tank protection...

...and much more content follows.
    `,
    cover_image: "blog/blog5.webp",
    cover_image_id: "blog/modern-tanks",
    date: "2023-08-10",
    reading_time: "14 min",
    category_ids: ["Military Vehicles", "Technology"],
    tag_ids: ["tanks", "armor", "military", "defense"],
    technology_ids: [],
    status: "published",
    featured: false,
    series_id: undefined,
    related_post_ids: [],
    recommended_next_read_id: "",
  },
];

export const seedBlogPosts = async () => {
  console.log("Seeding blog posts...");

  try {
    // Get category, technology, and series IDs
    const { categoryService } = await import("../src/services/categoryService");
    const { technologyService } = await import(
      "../src/services/technologyService"
    );
    const { blogService } = await import("../src/services/blogService");

    const categories = await categoryService.getCategories();
    const technologies = await technologyService.getTechnologies();
    const series = await blogService.getAllSeries();

    const categoryMap = categories.reduce<Record<string, string>>(
      (map, cat) => {
        map[cat.name.toLowerCase()] = cat.id;
        return map;
      },
      {},
    );

    const technologyMap = technologies.reduce<Record<string, string>>(
      (map, tech) => {
        map[tech.name.toLowerCase()] = tech.id;
        return map;
      },
      {},
    );

    const seriesMap = series.reduce<Record<string, string>>((map, s) => {
      map[s.title.toLowerCase()] = s.id;
      return map;
    }, {});

    for (const post of blogPostData) {
      // Convert categories to category_ids
      const categoryIds =
        post.category_ids?.map(
          (category) => categoryMap[category.toLowerCase()] || category,
        ) || [];

      // Convert tags to tag_ids if present
      const tagIds = post.tag_ids || [];

      // Convert technologies to technology_ids if present
      const technologyIds =
        post.technology_ids?.map(
          (tech) => technologyMap[tech.toLowerCase()] || tech,
        ) || [];

      // Convert series_id from name to actual ID
      const seriesId = post.series_id
        ? seriesMap[post.series_id.toLowerCase()] || post.series_id
        : undefined;

      await databases.createDocument(
        appwriteConfig.databaseId,
        BLOG_POSTS_COLLECTION_ID,
        ID.unique(),
        {
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          cover_image: post.cover_image,
          cover_image_id: post.cover_image_id,
          date: post.date,
          reading_time: post.reading_time,
          category_ids: categoryIds,
          tag_ids: tagIds,
          technology_ids: technologyIds,
          status: post.status,
          featured: post.featured,
          series_id: seriesId,
          series_position: post.series_position,
          related_post_ids: post.related_post_ids || [],
          recommended_next_read_id: post.recommended_next_read_id || "",
        },
      );

      console.log(`Created blog post: ${post.title}`);
    }

    console.log("Blog posts seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding blog posts:", error);
    throw error;
  }
};

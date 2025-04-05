// Base URL for icons
const ICON_BASE_URL = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/";

export const technologyData = [
  // Frontend technologies
  {
    name: "React",
    category_id: "Frontend Development",
    icon: `${ICON_BASE_URL}react/react-original.svg`,
    website: "https://reactjs.org/",
  },
  {
    name: "TypeScript",
    category_id: "Frontend Development",
    icon: `${ICON_BASE_URL}typescript/typescript-original.svg`,
    website: "https://www.typescriptlang.org/",
  },
  {
    name: "Next.js",
    category_id: "Frontend Development",
    icon: `${ICON_BASE_URL}nextjs/nextjs-original.svg`,
    website: "https://nextjs.org/",
  },
  {
    name: "Tailwind CSS",
    category_id: "Frontend Development",
    icon: `${ICON_BASE_URL}tailwindcss/tailwindcss-original.svg`,
    website: "https://tailwindcss.com/",
  },
  {
    name: "Vue.js",
    category_id: "Frontend Development",
    icon: `${ICON_BASE_URL}vuejs/vuejs-original.svg`,
    website: "https://vuejs.org/",
  },
  {
    name: "Inertia.js",
    category_id: "Frontend Development",
    icon: `${ICON_BASE_URL}devicon/devicon-original.svg`,
    website: "https://inertiajs.com/",
  },

  // Backend technologies
  {
    name: "Node.js",
    category_id: "Backend Development",
    icon: `${ICON_BASE_URL}nodejs/nodejs-original.svg`,
    website: "https://nodejs.org/",
  },
  {
    name: "Express",
    category_id: "Backend Development",
    icon: `${ICON_BASE_URL}express/express-original.svg`,
    website: "https://expressjs.com/",
  },
  {
    name: "Bun",
    category_id: "Backend Development",
    icon: `${ICON_BASE_URL}bun/bun-original.svg`,
    website: "https://bun.sh/",
  },
  {
    name: "Hono",
    category_id: "Backend Development",
    icon: `${ICON_BASE_URL}typescript/typescript-original.svg`,
    website: "https://hono.dev/",
  },
  {
    name: "Django",
    category_id: "Backend Development",
    icon: `${ICON_BASE_URL}django/django-plain.svg`,
    website: "https://www.djangoproject.com/",
  },
  {
    name: "Laravel",
    category_id: "Backend Development",
    icon: `${ICON_BASE_URL}laravel/laravel-plain.svg`,
    website: "https://laravel.com/",
  },

  // Database technologies
  {
    name: "MongoDB",
    category_id: "Database",
    icon: `${ICON_BASE_URL}mongodb/mongodb-original.svg`,
    website: "https://www.mongodb.com/",
  },
  {
    name: "PostgreSQL",
    category_id: "Database",
    icon: `${ICON_BASE_URL}postgresql/postgresql-original.svg`,
    website: "https://www.postgresql.org/",
  },
  {
    name: "Redis",
    category_id: "Database",
    icon: `${ICON_BASE_URL}redis/redis-original.svg`,
    website: "https://www.redis.com/",
  },

  // DevOps technologies
  {
    name: "Docker",
    category_id: "DevOps",
    icon: `${ICON_BASE_URL}docker/docker-original.svg`,
    website: "https://www.docker.com/",
  },
  {
    name: "Coolify",
    category_id: "DevOps",
    icon: `${ICON_BASE_URL}devicon/devicon-original.svg`,
    website: "https://coolify.io/",
  },

  // Mobile technologies
  {
    name: "Flutter",
    category_id: "Mobile Development",
    icon: `${ICON_BASE_URL}flutter/flutter-original.svg`,
    website: "https://flutter.dev/",
  },
  {
    name: "Javascript",
    category_id: "Languages",
    icon: `${ICON_BASE_URL}javascript/javascript-original.svg`,
    website: "https://www.javascript.com/",
  },
  {
    name: "Python",
    category_id: "Languages",
    icon: `${ICON_BASE_URL}python/python-original.svg`,
    website: "https://www.python.org/",
  },
  {
    name: "PHP",
    category_id: "Languages",
    icon: `${ICON_BASE_URL}php/php-original.svg`,
    website: "https://www.php.net/",
  },
  {
    name: "TypeScript",
    category_id: "Languages",
    icon: `${ICON_BASE_URL}typescript/typescript-original.svg`,
    website: "https://www.typescriptlang.org/",
  },
  {
    name: "C",
    category_id: "Languages",
    icon: `${ICON_BASE_URL}c/c-original.svg`,
    website: "https://en.wikipedia.org/wiki/C_(programming_language)",
  },
  {
    name: "Dart",
    category_id: "Languages",
    icon: `${ICON_BASE_URL}dart/dart-original.svg`,
    website: "https://dart.dev/",
  },
  {
    name: "Rust",
    category_id: "Languages",
    icon: `${ICON_BASE_URL}rust/rust-plain.svg`,
    website: "https://www.rust-lang.org/",
  },
];

export const seedTechnologies = async () => {
  console.log("Seeding technologies...");

  try {
    const { technologyService } = await import(
      "../src/services/technologyService"
    );
    const { categoryService } = await import("../src/services/categoryService");

    // Get all categories
    const categories = await categoryService.getCategories();
    console.log(`Found ${categories.length} categories for mapping`);

    // Create category map for quick lookup
    const categoryMap = categories.reduce<Record<string, string>>(
      (map, cat) => {
        map[cat.name.toLowerCase()] = cat.id;
        return map;
      },
      {},
    );

    console.log(
      "Category mapping created:",
      Object.keys(categoryMap).join(", "),
    );

    const technologies = [];

    // Create each technology and store the result with ID
    for (const tech of technologyData) {
      // Get the category name from the tech object
      const categoryName = tech.category_id;
      console.log(
        `Processing technology: ${tech.name}, Category name: ${categoryName}`,
      );

      // Look up the actual category ID using the name
      const categoryId = categoryMap[String(categoryName).toLowerCase()];

      // Log the mapping result
      if (categoryId) {
        console.log(`✓ Found category ID for "${categoryName}": ${categoryId}`);
      } else {
        console.warn(`⚠ Category "${categoryName}" not found in mapping!`);
        const closestMatches = Object.keys(categoryMap)
          .filter(
            (name) =>
              String(categoryName).toLowerCase().includes(name) ||
              name.includes(String(categoryName).toLowerCase()),
          )
          .join(", ");
        console.log(`Closest category matches: ${closestMatches || "none"}`);
        continue; // Skip this technology if category not found
      }

      // Create a new object with the proper category ID
      const techData = {
        ...tech,
        category_id: categoryId, // Replace the name with the actual ID
      };

      console.log(`Creating technology with data:`, {
        name: techData.name,
        category_id: techData.category_id,
        original_category: categoryName,
      });

      const createdTech = await technologyService.createTechnology(techData);
      technologies.push(createdTech);

      console.log(
        `✅ Created technology: ${tech.name} (Category: ${categoryName} → ${categoryId})`,
      );
    }

    console.log(`Seeded ${technologies.length} technologies successfully!`);
    return technologies;
  } catch (error) {
    console.error("Error seeding technologies:", error);
    console.error(
      "Stack trace:",
      error instanceof Error ? error.stack : "No stack trace",
    );
    throw error;
  }
};

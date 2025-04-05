import { technologyService } from "../src/services/technologyService";
import { categoryService } from "../src/services/categoryService";
import { currentTechStackService } from "../src/services/currentTechStackService";

// New structure for tech stack data
export const currentTechStackData = [
  {
    name: "Mobile",
    category: "Mobile Development",
    technologies: ["Flutter"],
    priority: 1,
  },
  {
    name: "Frontend ",
    category: "Frontend Development",
    technologies: ["Next.js", "Vue.js"],
    priority: 2,
  },
  {
    name: "Backend ",
    category: "Backend Development",
    technologies: ["Laravel"],
    priority: 3,
  },

  // {
  //   name: "Database Stack",
  //   category: "Database",
  //   technologies: ["PostgreSQL"],
  //   priority: 4,
  // },
];

export const seedCurrentTechStack = async () => {
  console.log("Seeding current tech stack...");

  try {
    // Get all categories and technologies to find their IDs
    const [categories, technologies] = await Promise.all([
      categoryService.getCategories(),
      technologyService.getTechnologies(),
    ]);

    // Create maps for quick lookup
    const catMap = categories.reduce<Record<string, string>>((map, cat) => {
      map[cat.name] = cat.id;
      return map;
    }, {});

    const techMap = technologies.reduce<Record<string, string>>((map, tech) => {
      map[tech.name] = tech.id;
      return map;
    }, {});

    const techStacks = [];

    // Create each tech stack item
    for (const item of currentTechStackData) {
      const categoryId = catMap[item.category];

      if (!categoryId) {
        console.warn(
          `Category ${item.category} not found in database, skipping`,
        );
        continue;
      }

      // Get tech IDs for each technology name
      const techIds = item.technologies
        .map((techName) => {
          const techId = techMap[techName];
          if (!techId) {
            console.warn(
              `Technology ${techName} not found in database, will be excluded`,
            );
          }
          return techId;
        })
        .filter(Boolean);

      if (techIds.length === 0) {
        console.warn(`No valid technologies for ${item.name}, skipping`);
        continue;
      }

      const createdItem = await currentTechStackService.createCurrentTech({
        name: item.name,
        category_id: categoryId,
        technology_ids: techIds,
        priority: item.priority,
      });

      techStacks.push(createdItem);
    }

    console.log(`Seeded ${techStacks.length} current tech stack items`);
    return techStacks;
  } catch (error) {
    console.error("Error seeding current tech stack:", error);
    throw error;
  }
};

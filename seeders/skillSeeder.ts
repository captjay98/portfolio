export const skillData = [
  {
    name: "React Development",
    category_id: "Frontend Development",
    technology_id: "React",
    level: "Advanced",
    years: 3,
  },
  {
    name: "TypeScript",
    category_id: "Frontend Development",
    technology_id: "TypeScript",
    level: "Intermediate",
    years: 2,
  },
  {
    name: "Node.js Backend",
    category_id: "Backend Development",
    technology_id: "Node.js",
    level: "Advanced",
    years: 3,
  },
  {
    name: "MongoDB Database",
    category_id: "Database",
    technology_id: "MongoDB",
    level: "Intermediate",
    years: 2,
  },
  {
    name: "Docker Containerization",
    category_id: "DevOps",
    technology_id: "Docker",
    level: "Intermediate",
    years: 1,
  },
  {
    name: "React Native Mobile Development",
    category_id: "Mobile Development",
    technology_id: "React Native",
    level: "Intermediate",
    years: 1,
  },
];

export const seedSkills = async () => {
  console.log("Seeding skills...");

  try {
    const { skillService } = await import("../src/services/skillService");
    const { categoryService } = await import("../src/services/categoryService");
    const { technologyService } = await import(
      "../src/services/technologyService"
    );

    // Get all categories and technologies
    const categories = await categoryService.getCategories();
    const technologies = await technologyService.getTechnologies();

    // Create maps for quick lookup
    const categoryMap = categories.reduce<Record<string, string>>(
      (map, cat) => {
        map[cat.name] = cat.id;
        return map;
      },
      {},
    );

    const techMap = technologies.reduce<Record<string, string>>((map, tech) => {
      map[tech.name] = tech.id;
      return map;
    }, {});

    const skills = [];

    // Create each skill and store the result with ID
    for (const skill of skillData) {
      // Get real category and technology IDs
      const category_id = categoryMap[skill.category_id] || "";
      const technology_id = techMap[skill.technology_id] || "";

      const createdSkill = await skillService.createSkill({
        ...skill,
        category_id: category_id,
        technology_id: technology_id,
      });

      skills.push(createdSkill);
    }

    console.log(`Seeded ${skills.length} skills`);
    return skills;
  } catch (error) {
    console.error("Error seeding skills:", error);
    throw error;
  }
};

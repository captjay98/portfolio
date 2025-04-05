import {
  databases,
  ID,
  appwriteConfig,
  EXPERIENCES_COLLECTION_ID,
} from "@/lib/appwrite";

export const experienceData = [
  {
    title: "Lead Mobile Developer",
    company: "SchoolTry AB",
    location: "Abuja, Nigeria",
    start_date: "2024-12-16",
    end_date: null,
    description:
      "Responsible for overseeing the development and maintenance of mobile Applications.",
    category_ids: ["Mobile Development"],
    technology_ids: ["Flutter"],
  },
  {
    title: "Mobile Developer",
    company: "SchoolTry AB",
    location: "Abuja, Nigeria",
    start_date: "2024-07-16",
    end_date: "2024-12-16",
    description:
      "Maintained and developed new features for the Legacy K12 SchoolTry mobile application",
    category_ids: ["Mobile Development"],
    technology_ids: ["Flutter"],
  },
  {
    title: "Software Engineer",
    company: "AirBills Digital",
    location: "Remote",
    start_date: "2022-01-01",
    end_date: "2024-07-16",
    description: "Built Various web applications for different clients",
    category_ids: ["Frontend Development", "Backend Development"],
    technology_ids: [
      "Django",
      "Express",
      "Hono",
      "Laravel",
      "PostgreSQL",
      "Redis",
      "MongoDB",
      "React",
      "Vue.js",
      "Tailwind CSS",
    ],
  },
  {
    title: "Software Engineer",
    company: "Freelance",
    location: "Remote",
    start_date: "2019-01-01",
    end_date: "2024-07-16",
    description: "Built Various web applications for different clients",
    category_ids: ["Frontend Development", "Backend Development"],
    technology_ids: [
      "Django",
      "Express",
      "Hono",
      "Laravel",
      "PostgreSQL",
      "Redis",
      "MongoDB",
      "React",
      "Vue.js",
      "Tailwind CSS",
    ],
  },
];

// Create accomplishments for experiences
export const createAccomplishments = async (
  experienceMap: Record<string, string>,
) => {
  try {
    const { experienceAccomplishmentService } = await import(
      "../src/services/experienceAccomplishmentService"
    );

    const accomplishmentsData = [
      // Senior Frontend Developer accomplishments
      {
        experience_id: experienceMap["Lead Mobile Developer"],
        text: "Led a team of 3 developers to deliver a brand new mobile application for SchoolTry Tertiary within 4 months",
        order: 1,
      },
      {
        experience_id: experienceMap["Lead Mobile Developer"],
        text: "COntiniously maintaining the legacy K12 SchoolTry mobile application",
        order: 2,
      },
      {
        experience_id: experienceMap["Lead Mobile Developer"],
        text: "Resumed development of the v2 K12 SchoolTry mobile application",
        order: 3,
      },

      // Full Stack Developer accomplishments
      {
        experience_id: experienceMap["Mobile Developer"],
        text: "Squashed bugs and  Refactored which lead to improved performance and stability in the K12 SchoolTry mobile application.",
        order: 1,
      },
      {
        experience_id: experienceMap["Mobile Developer"],
        text: "Optimized application performance, reducing load times.",
        order: 2,
      },
      {
        experience_id: experienceMap["Mobile Developer"],
        text: "Started development of a new K12 mobile application for SchoolTry.",
        order: 3,
      },

      // Junior Web Developer accomplishments
      {
        experience_id: experienceMap["Software Engineer"],
        text: "Developed responsive UI components used across multiple projects",
        order: 1,
      },
      {
        experience_id: experienceMap["Software Engineer"],
        text: "Developed Monolithic and Microservices applications for various clients",
        order: 2,
      },
    ];

    const accomplishments = [];

    for (const data of accomplishmentsData) {
      // Make sure order is a valid number
      const accomplishmentData = {
        ...data,
        order: data.order || 0, // Ensure order is provided, default to 0 if missing
      };

      const created =
        await experienceAccomplishmentService.createAccomplishment(
          accomplishmentData,
        );
      accomplishments.push(created);
    }

    console.log(`Created ${accomplishments.length} experience accomplishments`);
    return accomplishments;
  } catch (error) {
    console.error("Error creating accomplishments:", error);
    throw error;
  }
};

// Change field names to match updated schema
export const seedExperiences = async () => {
  console.log("Seeding experiences...");

  try {
    const { experienceService } = await import(
      "../src/services/experienceService"
    );
    const { categoryService } = await import("../src/services/categoryService");
    const { technologyService } = await import(
      "../src/services/technologyService"
    );
    const { experienceAccomplishmentService } = await import(
      "../src/services/experienceAccomplishmentService"
    );

    // Get all categories and technologies first
    const [categories, technologies] = await Promise.all([
      categoryService.getCategories(),
      technologyService.getTechnologies(),
    ]);

    // Create maps for quick lookup
    const categoryMap = categories.reduce(
      (map, cat) => {
        map[cat.name] = cat.id;
        return map;
      },
      {} as Record<string, string>,
    );

    const techMap = technologies.reduce(
      (map, tech) => {
        map[tech.name] = tech.id;
        return map;
      },
      {} as Record<string, string>,
    );

    // Create experiences and store their IDs
    const experienceMap: Record<string, string> = {};

    for (const exp of experienceData) {
      const mappedExp = {
        ...exp,
        category_ids: exp.category_ids.map((cat) => categoryMap[cat]),
        technology_ids: exp.technology_ids.map((tech) => techMap[tech]),
      };

      const createdExp = await experienceService.createExperience(mappedExp);
      experienceMap[exp.title] = createdExp.id;
    }

    // Create accomplishments for each experience
    const accomplishments = [
      {
        experience_id: experienceMap["Lead Mobile Developer"],
        accomplishments: [
          "Led a team of 3 developers to deliver a brand new mobile application for SchoolTry Tertiary within 4 months",
          "Continuously maintaining the legacy K12 SchoolTry mobile application",
          "Resumed development of the v2 K12 SchoolTry mobile application",
        ],
      },
      {
        experience_id: experienceMap["Mobile Developer"],
        accomplishments: [
          "Squashed bugs and Refactored which lead to improved performance and stability",
          "Optimized application performance, reducing load times",
          "Started development of a new K12 mobile application for SchoolTry",
        ],
      },
      {
        experience_id: experienceMap["Software Engineer"],
        accomplishments: [
          "Developed responsive UI components used across multiple projects",
          "Developed Monolithic and Microservices applications for various clients",
          "Implemented CI/CD pipelines and automated deployment processes",
        ],
      },
    ];

    // Create accomplishments
    for (const exp of accomplishments) {
      for (const [index, text] of exp.accomplishments.entries()) {
        await experienceAccomplishmentService.createAccomplishment({
          experience_id: exp.experience_id,
          text,
          order: index + 1,
        });
      }
    }

    console.log("Experiences and accomplishments seeded successfully!");
  } catch (error) {
    console.error("Error seeding experiences:", error);
    throw error;
  }
};

export const categoryData = [
  // Tech & Development Categories
  {
    name: "Frontend Development",
    description: "Technologies used for client-side development",
  },
  {
    name: "Backend Development",
    description: "Technologies used for server-side development",
  },
  {
    name: "Mobile Development",
    description: "Technologies for mobile application development",
  },
  {
    name: "DevOps",
    description: "Technologies for deployment and infrastructure",
  },
  {
    name: "Database",
    description: "Database technologies and systems",
  },
  // Technology Categories
  {
    name: "Mobile Phones",
    description:
      "Reviews, comparisons, and news about smartphones and mobile technology",
  },
  {
    name: "Computer Hardware",
    description: "Desktop computers, laptops, components and peripherals",
  },
  {
    name: "SOCs",
    description: "System on Chips, processors, and computing architecture",
  },

  // Automotive Categories
  {
    name: "Cars",
    description: "Car reviews, automotive technology, and industry news",
  },
  {
    name: "Electric Vehicles",
    description:
      "Electric cars, batteries, charging infrastructure, and sustainable transport",
  },

  // Aviation & Military Categories
  {
    name: "Aviation",
    description:
      "Commercial aircraft, aviation technology, and industry developments",
  },
  {
    name: "Military Aircraft",
    description:
      "Fighter jets, bombers, transport planes, and military aviation technology",
  },
  {
    name: "Military Vehicles",
    description:
      "Tanks, armored personnel carriers, and other ground combat vehicles",
  },

  // General Categories
  {
    name: "Science & Technology",
    description: "General science and technology news and analysis",
  },

  //Islam & philosphy
  {
    name: "Islam",
    description:
      "Islamic Related topics including Quran, Hadith, and Islamic philosophy",
  },
  { name: "Astronomy", description: "Astronomy and cosmology in Islam" },

  {
    name: "Metaphysics",
    description:
      "Philosophical inquiry into the nature of reality, being, and existence",
  },
  {
    name: "Ethics & Morality",
    description:
      "Philosophical discussions about ethics, morality, and values in different traditions",
  },
  {
    name: "Philosophy of Mind",
    description:
      "Examination of consciousness, mind-body problem, and cognitive processes",
  },

  // Categories from Uses
  {
    name: "Development Tools",
    description: "Software tools used for programming and development work",
  },
  {
    name: "Software",
    description: "Operating systems and various software applications",
  },
  {
    name: "Hardware",
    description: "Physical computing equipment and peripherals",
  },
  {
    name: "Productivity",
    description:
      "Tools and applications that help with work efficiency and organization",
  },
];

export const seedCategories = async () => {
  console.log("Seeding categories...");

  try {
    const { categoryService } = await import("../src/services/categoryService");

    const categories = [];

    // Create each category and store the result with ID
    for (const category of categoryData) {
      const createdCategory = await categoryService.createCategory(category);
      categories.push(createdCategory);
    }

    console.log(`Seeded ${categories.length} categories`);
    return categories;
  } catch (error) {
    console.error("Error seeding categories:", error);
    throw error;
  }
};

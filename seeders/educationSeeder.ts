import { educationService } from "../src/services/educationService";

export const educationData = [
  {
    degree: "BSc, Computer Science",
    institution: "ESAE Benin University",
    location: "Cotonou, Benin",
    start_date: "2018",
    end_date: "2021",
    description: "Focused on software engineering and computer systems.",
    is_current: false,
    priority: 2,
  },
  {
    degree: "ALX Software Engineering",
    institution: "ALX Africa",
    location: "Remote",
    start_date: "2022",
    end_date: "2023",
    description:
      "Intensive software engineering program covering full-stack Software Engineering.",
    is_current: false,
    priority: 1,
  },
];

export const seedEducation = async () => {
  console.log("Seeding education...");

  try {
    const educationItems = [];

    // Create each education item
    for (const item of educationData) {
      const createdItem = await educationService.createEducation(item);
      educationItems.push(createdItem);
    }

    console.log(`Seeded ${educationItems.length} education items`);
    return educationItems;
  } catch (error) {
    console.error("Error seeding education:", error);
    throw error;
  }
};

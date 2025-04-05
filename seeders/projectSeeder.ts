import {
  databases,
  ID,
  appwriteConfig,
  PROJECTS_COLLECTION_ID,
} from "@/lib/appwrite";

export const projectData = [
  {
    name: "ProJavi",
    description:
      "Backend built with Laravel,PostgreSQL as DB. Frontend in NextJs and Mobile App with Flutter.",
    long_description:
      "A comprehensive platform with Laravel/PostgreSQL backend, Next.js frontend, and Flutter mobile app. Features include user authentication, real-time updates, notifcation, messages, and cross-platform compatibility.",
    image: "project/projavi.webp",
    image_id: "projects/projaavi",
    category_ids: [
      "Fullstack Development",
      "Frontend Development",
      "Backend Development",
      "Mobile Development",
    ],
    technology_ids: ["Laravel", "Next.js", "Flutter", "PostgreSQL"],
    github: "",
    live: "https://www.projavi.com/",
    featured: true,
  },
  {
    name: "SchoolTry Tertiary",
    description: "Mobile App for Schooltry Tertiary built with Flutter.",
    long_description:
      "Lead the development of this app with 2 others on the team. Built with a bespoke clean Multi-Tenant architecture and Riverpod for state management . Implemented offline-first capabilities, secure authentication and many features for tertiary education users.",
    image: "project/schooltry-tertiary.webp",
    image_id: "projects/schooltry-tertiary",
    category_ids: ["Mobile Development"],
    technology_ids: ["Flutter"],
    github: "",
    live: "https://www.schooltry.com.",
    featured: true,
  },
  {
    name: "SchoolTry K12",
    description: "Mobile App for Schooltry K12 built with Flutter.",
    long_description:
      "Lead the development with 2 others on the team, built with a clean architecture patterns and Riverpod for efficient state management. It Includes interactive learning tools, CBT, progress tracking, parent and teacher dashboard with management tools, and age-appropriate UI/UX specifically designed for younger students in primary and secondary education.",
    image: "project/schooltry-k12.webp",
    image_id: "projects/schooltry-k12",
    category_ids: ["Mobile Development"],
    technology_ids: ["Flutter"],
    github: "",
    live: "https://www.schooltry.com.",
    featured: true,
  },
  {
    name: "Kalbites",
    description:
      "Backend built with Hono running on Bun with PostgreSQL as DB. Frontend in React.",
    long_description:
      "Backend is currently built with Hono running on Bun with PostgreSQl as DB. The Backend was previously built with Express.js running on NodeJs with MongoDb as DB. The frontend is still React, previous one was built with JSX.",
    image: "project/kalbites.webp",
    image_id: "projects/kalbites",
    category_ids: [
      "Fullstack Development",
      "Frontend Development",
      "Backend Development",
      "Mobile Development",
    ],
    technology_ids: ["Hono", "Bun", "PostgreSQL", "React"],
    github: "https://www.github.com/captjay98/kalbites_frontend",
    live: "https://www.kalbites.vercel.app/",
    featured: true,
  },

  {
    name: "Bumsa Election Portal",
    description:
      "Voting platform for BUK Medical Students Association Elections using Laravel & Vue.",
    long_description:
      "I utilized Laravel and PostgreSQl for the Backend Of this project. The Frontend was buitlt with Inertiajs/Vue3. It is a Voting platform for BUK Medical Students Association Elections.",
    image: "project/bumsa.webp",
    image_id: "projects/bumsa",
    category_ids: [
      "Fullstack Development",
      "Frontend Development",
      "Backend Development",
    ],
    technology_ids: ["Laravel", "PostgreSQL", "Vue.js", "Inertia.js"],
    github: "https://www.github.com/captjay98/bumsa",
    live: "https://www.bumsa.fly.dev/",
    featured: false,
  },
  {
    name: "Raffle Suites",
    description:
      "Full-Stack Hotel Website built with NextJS 14 with top-notch SEO.",
    long_description:
      "This is a Full-Stack App cooked up with nextjs14 with Top Notch SEO. It is also visually appealing and also has all the basic features required for a Hotel Website to work, with room for additional features.",
    image: "project/rafflesuites.webp",
    image_id: "projects/rafflesuites",
    category_ids: ["Frontend Development"],
    technology_ids: ["Next.js", "React", "Tailwind CSS"],
    github: "https://www.github.com/captjay98/rafflesuites",
    live: "https://www.raffle-suites.vercel.app/",
    featured: true,
  },
  {
    name: "Ticketer",
    description:
      "Train Booking App built with Laravel, PostgreSQL, and Vue/Inertia.",
    long_description:
      "I utilized Laravel and PostgreSQl for the Backend Of this project. The Frontend was buitlt with Inertiajs/Vue3. It is a Train Booking App with all the features required for a Booking Platform to work.",
    image: "project/ticketer.webp",
    image_id: "projects/ticketer",
    category_ids: [
      "Fullstack Development",
      "Frontend Development",
      "Backend Development",
    ],
    technology_ids: ["Laravel", "PostgreSQL", "Vue.js", "Inertia.js"],
    github: "https://www.github.com/captjay98/jobsite",
    live: "https://www.ticketer.fly.dev/",
    featured: true,
  },
  {
    name: "Abata Crafts",
    description: "Online Shop with custom payment & delivery integrations.",
    long_description:
      "This is an online Shop built with Medusajs. I added a Paytack Integration for payment, and also built a custom fullfillment provider for delivery from Kaduna using Public Transport delivery or Gig Logistics.",
    image: "project/abatacrafts.webp",
    image_id: "projects/abatacrafts",
    category_ids: [
      "Fullstack Development",
      "Frontend Development",
      "Backend Development",
    ],
    technology_ids: ["React", "Node.js", "Express"],
    github: "https://www.github.com/captjay98/abatacrafts-storefront",
    live: "https://www.abatacrafts.vercel.app/",
    featured: false,
  },
  {
    name: "Jobsite",
    description:
      "Complete job platform with seeker, employer and admin features.",
    long_description:
      "I built the Backend Of this project using Laravel and PGSQl. The Frontend was buitlt with Inertiajs/Vue3. It is a Jobsite with all the features required for a jobsite to work, Seeker, Employer and Admin Features.",
    image: "project/jobsite.webp",
    image_id: "projects/jobsite",
    category_ids: [
      "Fullstack Development",
      "Frontend Development",
      "Backend Development",
    ],
    technology_ids: ["Laravel", "PostgreSQL", "Vue.js", "Inertia.js"],
    github: "https://www.github.com/captjay98/jobsite",
    live: "https://www.jobsite-fejw.onrender.com",
    featured: false,
  },
  {
    name: "SBTravels",
    description:
      "Travel agency website built with NextJS 13 focused on reach and visibility.",
    long_description:
      "I built this website with NextJS 13 for a travel agency looking to expand their online presence. It features responsive design, SEO optimization, and visually appealing UI to showcase their services effectively. While currently mostly static, the architecture allows for easy addition of dynamic features like booking and user accounts in future iterations.",
    image: "project/sbtravel.webp",
    image_id: "projects/sbtravel",
    category_ids: ["Frontend Development"],
    technology_ids: ["Next.js", "React", "Tailwind CSS"],
    github: "https://www.github.com/captjay98/sbtravels",
    live: "https://www.sbtravels.vercel.app/",
    featured: false,
  },
  {
    name: "Interview Django",
    description:
      "API server for a job platform built with Django and PostgreSQL.",
    long_description:
      "This API server powers a comprehensive job platform using Django and Django Rest Framework with PostgreSQL database. It handles job listings, applications, user profiles, authentication, and search functionality. The API includes role-based access control for job seekers, employers, and administrators with comprehensive documentation.",
    image: "project/inter.webp",
    image_id: "projects/interview-django",
    category_ids: ["Backend Development"],
    technology_ids: ["Django", "PostgreSQL"],
    github: "https://www.github.com/captjay98/jobsite-django",
    live: "https://www.jobsite-django.onrender.com/",
    featured: false,
  },

  {
    name: "Interview Node",
    description:
      "API server for a job platform built with Express and MongoDB.",
    long_description:
      "This is a Node.js implementation of the job platform API using Express and MongoDB. It provides the same functionality as the Django version but with a different tech stack. Features include JWT authentication, job management, application tracking, and user profile management with RESTful endpoints.",
    image: "project/inter.webp",
    image_id: "projects/interview-node",
    category_ids: ["Backend Development"],
    technology_ids: ["Node.js", "Express", "MongoDB"],
    github: "https://www.github.com/captjay98/jobsite-express",
    live: "https://www.jobsite-express.onrender.com",
    featured: false,
  },
  {
    name: "JILTicketing",
    description:
      "Backend for a train ticketing platform built with Django and MySQL.",
    long_description:
      "I developed this train ticketing backend using Django and MySQL to handle ticket reservations, seat availability, and payment processing for a Nigerian train service concept. The system includes user authentication, booking management, and admin controls while a colleague built the frontend interface.",
    image: "project/jil.webp",
    image_id: "projects/jil-ticketing",
    category_ids: ["Backend Development"],
    technology_ids: ["Django", "MySQL"],
    github: "https://www.github.com/captjay98/jilticketing",
    live: "https://www.jilticketing.onrender.com",
    featured: false,
  },
];

// Helper function to get category and technology IDs
const getCategoryAndTechnologyIds = async () => {
  try {
    // Import category and technology services
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

    return { categoryMap, technologyMap };
  } catch (error) {
    console.error("Error getting categories and technologies:", error);
    return { categoryMap: {}, technologyMap: {} };
  }
};

export const seedProjects = async () => {
  console.log("Seeding projects...");

  try {
    // Get category and technology maps
    const { categoryMap, technologyMap } = await getCategoryAndTechnologyIds();

    for (const project of projectData) {
      // Map category strings to actual IDs
      const categoryIds = project.category_ids.map(
        (category) => categoryMap[category.toLowerCase()] || category,
      );

      // Map technology strings to actual IDs
      const technologyIds = project.technology_ids.map(
        (tech) => technologyMap[tech.toLowerCase()] || tech,
      );

      const imageUrl = project.image;

      // Add the project to the database with proper IDs and image references
      await databases.createDocument(
        appwriteConfig.databaseId,
        PROJECTS_COLLECTION_ID,
        ID.unique(),
        {
          name: project.name,
          description: project.description,
          long_description: project.long_description,
          image: imageUrl,
          image_id: project.image_id,
          category_ids: categoryIds,
          technology_ids: technologyIds,
          github: project.github,
          live: project.live,
          featured: project.featured,
        },
      );

      console.log(`Created project: ${project.name}`);
    }

    console.log("Projects seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding projects:", error);
    throw error;
  }
};

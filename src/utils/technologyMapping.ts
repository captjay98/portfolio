import { getCategoryDotColor } from "./categoryColors";

// Map common technologies to their respective categories
const technologyCategories: Record<string, string> = {
  // Frontend
  React: "Frontend Development",
  "Next.js": "Frontend Development",
  "Vue.js": "Frontend Development",
  Angular: "Frontend Development",
  JavaScript: "Frontend Development",
  TypeScript: "Frontend Development",
  HTML: "Frontend Development",
  CSS: "Frontend Development",
  "Tailwind CSS": "Frontend Development",
  Bootstrap: "Frontend Development",
  Redux: "Frontend Development",

  // Backend
  "Node.js": "Backend Development",
  Express: "Backend Development",
  Django: "Backend Development",
  Flask: "Backend Development",
  Laravel: "Backend Development",
  PHP: "Backend Development",
  Python: "Backend Development",
  Java: "Backend Development",
  "C#": "Backend Development",
  "ASP.NET": "Backend Development",
  "Ruby on Rails": "Backend Development",

  // Databases
  MongoDB: "Database Systems",
  PostgreSQL: "Database Systems",
  MySQL: "Database Systems",
  SQLite: "Database Systems",
  Redis: "Database Systems",
  Firebase: "Database Systems",
  Supabase: "Database Systems",

  // DevOps
  Docker: "DevOps",
  Kubernetes: "DevOps",
  Jenkins: "DevOps",
  "GitHub Actions": "DevOps",
  "CI/CD": "DevOps",
  Git: "DevOps",

  // Cloud
  AWS: "Cloud Services",
  Azure: "Cloud Services",
  "Google Cloud": "Cloud Services",
  Vercel: "Cloud Services",
  Netlify: "Cloud Services",
  Heroku: "Cloud Services",

  // Mobile
  "React Native": "Mobile Development",
  Flutter: "Mobile Development",
  Swift: "Mobile Development",
  Kotlin: "Mobile Development",
  Android: "Mobile Development",
  iOS: "Mobile Development",

  // Testing
  Jest: "Testing",
  Cypress: "Testing",
  Mocha: "Testing",
  Chai: "Testing",
  Selenium: "Testing",
  Playwright: "Testing",

  // Tools
  Webpack: "Tools & Utilities",
  Vite: "Tools & Utilities",
  npm: "Tools & Utilities",
  Yarn: "Tools & Utilities",
  GraphQL: "Tools & Utilities",
  "REST API": "Tools & Utilities",
};

/**
 * Get the category for a technology name
 * @param techName The technology name
 * @returns The category name or a default value
 */
export function getTechnologyCategory(techName: string): string {
  // Try to match exactly
  if (technologyCategories[techName]) {
    return technologyCategories[techName];
  }

  // Try to match by including the tech name (case insensitive)
  const lowercaseTechName = techName.toLowerCase();
  for (const [key, category] of Object.entries(technologyCategories)) {
    if (
      lowercaseTechName.includes(key.toLowerCase()) ||
      key.toLowerCase().includes(lowercaseTechName)
    ) {
      return category;
    }
  }

  // Default category for unknown technologies
  return "Tools & Utilities";
}

/**
 * Get the color for a technology based on its inferred category
 * @param techName The technology name
 * @returns The CSS class for the color
 */
export function getTechnologyColor(techName: string): string {
  const category = getTechnologyCategory(techName);
  return getCategoryDotColor(category);
}

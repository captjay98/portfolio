import { seedBlogPosts } from "./blogPostSeeder";
import { seedBlogSeries } from "./blogSeriesSeeder";
import { seedCategories } from "./categorySeeder";
import { seedExperiences } from "./experienceSeeder";
import { seedProjects } from "./projectSeeder";
import { seedSkills } from "./skillSeeder";
import { seedTechnologies } from "./technologySeeder";
import { seedProfile } from "./profileSeeder";
import { seedSocialLinks } from "./socialLinksSeeder";
import { seedUses } from "./usesSeeder";
import { seedEducation } from "./educationSeeder";
import { seedCurrentTechStack } from "./currentTechStackSeeder";
import { seedVisitors } from "./visitorsSeeder";

// Main function to run all seeders
const runSeeders = async () => {
  console.log("🌱 Starting database seeding...");

  try {
    // Run seeders in sequence with proper error handling
    console.log("\n--- CATEGORIES ---");
    await seedCategories();

    console.log("\n--- TECHNOLOGIES ---");
    await seedTechnologies();

    console.log("\n--- SKILLS ---");
    await seedSkills();

    console.log("\n--- EXPERIENCES ---");
    await seedExperiences();

    console.log("\n--- EDUCATION ---");
    await seedEducation();

    console.log("\n--- PROJECTS ---");
    await seedProjects();

    console.log("\n--- PROFILE ---");
    await seedProfile();

    console.log("\n--- USES ---");
    await seedUses();

    console.log("\n--- SOCIAL LINKS ---");
    await seedSocialLinks();

    console.log("\n--- CURRENT TECH STACK ---");
    await seedCurrentTechStack();

    // console.log("\n--- BLOG SERIES ---");
    // await seedBlogSeries();
    
    // console.log("\n--- BLOG POSTS ---");
    // await seedBlogPosts();
    
    // console.log("\n--- VISITORS ---");
    // // await seedVisitors();

    console.log("✅ Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    process.exit(1);
  }
};

// Run the seeders if this file is executed directly
if (require.main === module) {
  runSeeders();
}

export default runSeeders;

// For individual seeding
export {
  seedCategories,
  seedTechnologies,
  seedSkills,
  seedExperiences,
  seedProjects,
  seedBlogSeries,
  seedBlogPosts,
  seedProfile,
  seedSocialLinks,
  seedUses,
  seedVisitors,
};

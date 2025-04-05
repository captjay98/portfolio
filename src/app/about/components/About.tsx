import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
import { profileService } from "@/services/profileService";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { TechnologyType } from "../../../types/admin";
import { ExperienceItem } from "./ExperienceItem";
import { technologyService } from "@/services/technologyService";
import { experienceService } from "@/services/experienceService";
import { categoryService } from "@/services/categoryService";
import { educationService } from "@/services/educationService";
import { EducationItem } from "./EducationItem";
import TechnologyCard from "@/components/TechnologyCard";
import { experienceAccomplishmentService } from "@/services/experienceAccomplishmentService";
import { ExperienceAccomplishmentType } from "../../../types/admin";
import {
  getCategoryBgColor,
  getCategoryDotColor,
} from "@/utils/categoryColors";

export default async function AboutPage() {
  // Fetch all data in parallel on the server - removed unnecessary uses fetch
  const [profile, technologies, experiences, categories, education] =
    await Promise.all([
      profileService.getProfile(),
      technologyService.getTechnologies(),
      experienceService.getExperiences(),
      categoryService.getCategories(),
      educationService.getEducation(),
    ]);

  // Fetch accomplishments for each experience using the service
  const accomplishmentsPromises = experiences.map((experience) =>
    experienceAccomplishmentService.getAccomplishmentsByExperience(
      experience.id,
    ),
  );

  const accomplishmentsArrays = await Promise.all(accomplishmentsPromises);

  // Create a map of experience ID to accomplishments
  const experienceAccomplishmentsMap: Record<
    string,
    ExperienceAccomplishmentType[]
  > = {};
  experiences.forEach((experience, index) => {
    experienceAccomplishmentsMap[experience.id] = accomplishmentsArrays[index];
  });

  // Create mappings from IDs to names
  const techMap: Record<string, string> = {};
  technologies.forEach((tech) => {
    techMap[tech.id] = tech.name;
  });

  const catMap: Record<string, string> = {};
  categories.forEach((cat) => {
    catMap[cat.id] = cat.name;
  });

  // Group technologies by category name instead of ID
  const techsByCategory = technologies.reduce<Record<string, TechnologyType[]>>(
    (acc, tech) => {
      const categoryName = catMap[tech.category_id] || tech.category_id;
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(tech);
      return acc;
    },
    {},
  );

  // Helper function to format date with month and year (instead of just year)
  const formatDate = (dateString: string): string => {
    if (!dateString) return "";

    // Try to extract month and year from various date formats
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      // Valid date - format as Month Year (e.g., "Jan 2021")
      return date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    }

    // If parsing fails, return the original string
    return dateString;
  };

  return (
    <main className="min-h-screen max-h-screen overflow-y-auto pb-16 ">
      <div className="w-full px-4 py-6 md:py-6 mt-10 ">
        <div className="max-w-7xl mx-auto">
          {/* About & Uses Tabs */}
          <div className="border-b border-light-border dark:border-dark-border mb-6">
            <div className="flex space-x-8">
              <Link
                href="/about"
                className={`py-3 font-medium text-sm border-b-2 border-light-accent dark:border-dark-accent text-light-accent dark:text-dark-accent`}
              >
                About Me
              </Link>
              <Link
                href="/about/uses"
                className={`py-3 font-medium text-sm border-b-2 border-transparent text-light-subtle dark:text-dark-subtle hover:text-light-text dark:hover:text-dark-text`}
              >
                Uses
              </Link>
            </div>
          </div>
          {/* Tab Content */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-5 overflow-auto md:overflow-hidden">
            {/* Left column: Bio */}
            <div className="md:col-span-7 space-y-3">
              <div className="bg-glass shadow-subtle effect-3d rounded-lg p-4 animate-fade-in">
                <MarkdownRenderer content={profile?.bio_long || ""} />
              </div>

              {/* Technologies - More compact design */}
              <div
                className="bg-glass shadow-subtle effect-3d rounded-lg p-4 animate-fade-in-up"
                style={{ animationDelay: "0.1s" }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-medium text-light-accent dark:text-dark-accent">
                    Technical Skills
                  </h2>
                  <span className="px-2 py-1 text-xs bg-accent-gradient text-white rounded-full font-medium shadow-accent">
                    {profile?.title}
                  </span>
                </div>

                {/* Technologies grid - styled version */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(techsByCategory).map(
                    ([categoryName, categoryTechs], index) => (
                      <div
                        key={categoryName}
                        className="space-y-2 animate-slide-in-right bg-glass rounded-lg overflow-hidden shadow-subtle hover:shadow-accent transition-shadow duration-300"
                        style={{ animationDelay: `${0.05 * index}s` }}
                      >
                        {/* Category header */}
                        <div
                          className={`px-3 py-2 ${getCategoryBgColor(categoryName)}`}
                        >
                          <h3 className="text-sm font-bold text-white">
                            {categoryName}
                          </h3>
                        </div>

                        {/* Technologies */}
                        <div className="p-3">
                          <div className="flex flex-wrap gap-2 mt-1">
                            {categoryTechs.map((tech) => (
                              <TechnologyCard
                                key={tech.id}
                                name={tech.name}
                                showIndicator={true}
                                size="md"
                                categoryColor={getCategoryDotColor(
                                  categoryName,
                                )}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>

            {/* Right column: Experience & Education - More compact */}
            <div className="md:col-span-5 space-y-3">
              {/* Profile Card */}
              <div className="bg-glass shadow-subtle effect-3d rounded-lg p-4 animate-fade-in">
                <div className="flex items-center space-x-4">
                  {profile?.avatar ? (
                    <div className="w-20 h-20 rounded-full overflow-hidden shadow-accent">
                      <Image
                        src={profile.avatar}
                        alt={profile.full_name}
                        width={80}
                        height={80}
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-accent-gradient flex items-center justify-center text-white text-xl font-bold shadow-accent">
                      {profile?.full_name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h2 className="text-lg font-semibold text-light-text dark:text-dark-text">
                      {profile?.full_name}
                    </h2>
                    <p className="text-light-accent dark:text-dark-accent text-sm font-medium">
                      {profile?.title}
                    </p>
                    {profile?.location && (
                      <p className="text-light-subtle dark:text-dark-subtle text-xs mt-1">
                        {profile.location}
                      </p>
                    )}
                    <Link
                      href="mailto:captjay98@gmail.com"
                      className="mt-2 inline-flex items-center text-xs text-light-accent dark:text-dark-accent hover:underline"
                    >
                      <Mail size={12} className="mr-1" />
                      Contact Me
                    </Link>
                  </div>
                </div>
                <p className="mt-3 text-sm text-light-text dark:text-dark-text">
                  {profile?.bio_short}
                </p>
              </div>

              {/* Experience Section */}
              <div
                className="bg-glass shadow-subtle effect-3d rounded-lg p-4 animate-fade-in-up"
                style={{ animationDelay: "0.2s" }}
              >
                <h2 className="text-lg font-medium text-light-accent dark:text-dark-accent mb-3">
                  Experience
                </h2>

                <div className="space-y-5">
                  {/* Display experiences from state */}
                  {experiences.length > 0 ? (
                    experiences.map((experience) => (
                      <ExperienceItem
                        key={experience.id}
                        experience={experience}
                        accomplishments={
                          experienceAccomplishmentsMap[experience.id] || []
                        }
                        techMap={techMap}
                        catMap={catMap}
                      />
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No experience information available.
                    </p>
                  )}
                </div>
              </div>

              {/* Education */}
              <div
                className="bg-glass shadow-subtle effect-3d rounded-lg p-4 animate-fade-in-up"
                style={{ animationDelay: "0.3s" }}
              >
                <h2 className="text-lg font-medium text-light-accent dark:text-dark-accent mb-2">
                  Education
                </h2>

                <div className="space-y-3">
                  {education.length > 0 ? (
                    education.map((edu) => (
                      <EducationItem
                        key={edu.id}
                        degree={edu.degree}
                        institution={edu.institution}
                        period={`${formatDate(edu.start_date)}${edu.end_date ? ` - ${formatDate(edu.end_date)}` : ""}`}
                        location={edu.location}
                        description={edu.description}
                        isCurrent={edu.is_current}
                      />
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No education information available.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

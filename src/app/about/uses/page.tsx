/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from "next/link";
import Image from "next/image";
import { profileService } from "@/services/profileService";
import { categoryService } from "@/services/categoryService";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Uses - My Tools and Equipment",
  description:
    "Tools, technologies, and equipment I use for development and productivity.",
};

export default async function UsesPage() {
  // Fetch uses items and categories in parallel
  const [usesItems, categories] = await Promise.all([
    profileService.getUses(),
    categoryService.getCategories(),
  ]);

  if (Object.keys(usesItems).length === 0) {
    notFound();
  }

  // Create a mapping of category IDs to names
  const categoryMap: Record<string, string> = {};
  categories.forEach((category) => {
    categoryMap[category.id] = category.name;
  });

  // Map category IDs to names in usesItems
  const mappedUsesItems: Record<string, any[]> = {};
  Object.entries(usesItems).forEach(([categoryId, items]) => {
    const categoryName = categoryMap[categoryId] || categoryId;
    mappedUsesItems[categoryName] = items;
  });

  return (
    <main className="min-h-screen max-h-screen overflow-y-auto pb-16">
      <div className="w-full px-4 py-6 md:py-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-10 animate-fade-in">
            <h1 className="text-xl font-bold text-light-accent dark:text-dark-accent mb-4">
              $user-
              <span className="text-[var(--color-light-syntax-func)] dark:text-[var(--color-dark-syntax-func)]">
                uses
              </span>
              ;
            </h1>
          </div>

          {/* Tabs */}
          <div className="border-b border-light-border dark:border-dark-border mb-6">
            <div className="flex space-x-8">
              <Link
                href="/about"
                className={`py-3 font-medium text-sm border-b-2 border-transparent text-light-subtle dark:text-dark-subtle hover:text-light-text dark:hover:text-dark-text`}
              >
                About Me
              </Link>
              <Link
                href="/about/uses"
                className={`py-3 font-medium text-sm border-b-2 border-light-accent dark:border-dark-accent text-light-accent dark:text-dark-accent`}
              >
                Uses
              </Link>
            </div>
          </div>

          {/* Uses Content */}
          <div className="animate-fade-in">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[var(--color-light-syntax-tag)] dark:text-[var(--color-dark-syntax-tag)] mb-1 animate-fade-in-up">
                My Tech Stack
              </h2>
              <p
                className="text-sm text-[#4b5563] dark:text-dark-subtle animate-fade-in-up"
                style={{ animationDelay: "0.1s" }}
              >
                Tools, technologies, and equipment I use for development and
                productivity.
              </p>
            </div>

            {/* Categories and items - now using mapped category names */}
            <div className="space-y-8">
              {Object.entries(mappedUsesItems).map(
                ([category, categoryItems], categoryIndex) => (
                  <section
                    id={category.toLowerCase().replace(/\s+/g, "-")}
                    key={category}
                    className="scroll-mt-12"
                  >
                    <div className="flex items-center mb-3">
                      <h3
                        className={`text-lg font-semibold ${getCategoryHeaderColor(category, categoryIndex)}`}
                      >
                        {category}
                      </h3>
                      <div
                        className={`h-[1px] flex-grow ml-3 bg-gradient-to-r ${getCategoryGradient(category, categoryIndex)}`}
                      ></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {categoryItems.map((item, itemIndex) => (
                        <div
                          key={item.id}
                          className="group relative animate-fade-in-up"
                          style={{ animationDelay: `${0.05 * itemIndex}s` }}
                        >
                          <div
                            className={`h-full bg-glass rounded-lg p-3 effect-3d hover:translate-y-[-3px] ${
                              item.is_favorite
                                ? `border border-[var(--color-light-syntax-${getCategoryItemColor(category, categoryIndex)})] dark:border-[var(--color-dark-syntax-${getCategoryItemColor(category, categoryIndex)})]`
                                : ""
                            }`}
                          >
                            {item.is_favorite && (
                              <div
                                className={`absolute top-1 right-1 text-xs text-[var(--color-light-syntax-${getCategoryItemColor(category, categoryIndex)})] dark:text-[var(--color-dark-syntax-${getCategoryItemColor(category, categoryIndex)})]`}
                              >
                                ★
                              </div>
                            )}

                            <div className="flex items-start space-x-2">
                              {/* Compact image */}
                              {item.image && (
                                <div className="flex-shrink-0">
                                  <div className="w-10 h-10 rounded overflow-hidden shadow-subtle">
                                    <Image
                                      src={item.image}
                                      alt={item.name}
                                      width={40}
                                      height={40}
                                      className="object-cover w-full h-full"
                                    />
                                  </div>
                                </div>
                              )}

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <h4
                                  className={`text-sm font-bold text-[var(--color-light-syntax-${getCategoryItemColor(category, categoryIndex)})] dark:text-[var(--color-dark-syntax-${getCategoryItemColor(category, categoryIndex)})] truncate`}
                                >
                                  {item.name}
                                </h4>
                                <p className="text-xs text-[#4b5563] dark:text-dark-subtle line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                                  {item.description}
                                </p>

                                {/* Link */}
                                {item.link && (
                                  <a
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`mt-1 inline-flex items-center text-xs text-[var(--color-light-syntax-${getCategoryItemColor(category, categoryIndex)})] dark:text-[var(--color-dark-syntax-${getCategoryItemColor(category, categoryIndex)})] hover:underline`}
                                  >
                                    More info
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// Helper functions to distribute colors across categories
function getCategoryHeaderColor(category: string, index: number): string {
  const colors = [
    "text-[var(--color-light-syntax-entity)] dark:text-[var(--color-dark-syntax-entity)]",
    "text-[var(--color-light-syntax-tag)] dark:text-[var(--color-dark-syntax-tag)]",
    "text-[var(--color-light-syntax-func)] dark:text-[var(--color-dark-syntax-func)]",
    "text-[var(--color-light-syntax-string)] dark:text-[var(--color-dark-syntax-string)]",
    "text-[var(--color-light-syntax-regexp)] dark:text-[var(--color-dark-syntax-regexp)]",
    "text-[var(--color-light-syntax-markup)] dark:text-[var(--color-dark-syntax-markup)]",
    "text-[var(--color-light-syntax-keyword)] dark:text-[var(--color-dark-syntax-keyword)]",
    "text-[var(--color-light-syntax-special)] dark:text-[var(--color-dark-syntax-special)]",
  ];

  return colors[index % colors.length];
}

function getCategoryGradient(category: string, index: number): string {
  const gradients = [
    "from-[var(--color-light-syntax-entity)]/20 to-transparent dark:from-[var(--color-dark-syntax-entity)]/20 dark:to-transparent",
    "from-[var(--color-light-syntax-tag)]/20 to-transparent dark:from-[var(--color-dark-syntax-tag)]/20 dark:to-transparent",
    "from-[var(--color-light-syntax-func)]/20 to-transparent dark:from-[var(--color-dark-syntax-func)]/20 dark:to-transparent",
    "from-[var(--color-light-syntax-string)]/20 to-transparent dark:from-[var(--color-dark-syntax-string)]/20 dark:to-transparent",
    "from-[var(--color-light-syntax-regexp)]/20 to-transparent dark:from-[var(--color-dark-syntax-regexp)]/20 dark:to-transparent",
    "from-[var(--color-light-syntax-markup)]/20 to-transparent dark:from-[var(--color-dark-syntax-markup)]/20 dark:to-transparent",
    "from-[var(--color-light-syntax-keyword)]/20 to-transparent dark:from-[var(--color-dark-syntax-keyword)]/20 dark:to-transparent",
    "from-[var(--color-light-syntax-special)]/20 to-transparent dark:from-[var(--color-dark-syntax-special)]/20 dark:to-transparent",
  ];

  return gradients[index % gradients.length];
}

function getCategoryItemColor(category: string, index: number): string {
  const colors = [
    "entity",
    "tag",
    "func",
    "string",
    "regexp",
    "markup",
    "keyword",
    "special",
  ];
  return colors[index % colors.length];
}

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import { ArrowUpRight, Github, Sparkles, FolderGit2 } from "lucide-react";

interface ProjectsPageProps {
  initialProjects: any[];
  categories: { value: string; label: string }[];
}

export default function ProjectsPage({
  initialProjects,
  categories,
}: ProjectsPageProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Filter projects by selected category
  const filteredProjects = useMemo(() => {
    if (activeCategory === "all") return initialProjects;
    if (activeCategory === "featured") {
      return initialProjects.filter((p) => p.featured);
    }
    return initialProjects.filter((p) => {
      if (Array.isArray(p.category_ids)) {
        return p.category_ids.includes(activeCategory);
      }
      return p.category_ids === activeCategory;
    });
  }, [activeCategory, initialProjects]);

  // Group projects chronologically by release year
  const projectsByYear = useMemo(() => {
    const groups: Record<string, any[]> = {};

    filteredProjects.forEach((project, idx) => {
      let year = "2026";
      if (project.created_at) {
        const d = new Date(project.created_at);
        if (!isNaN(d.getTime())) {
          year = d.getFullYear().toString();
        }
      } else {
        // Fallback staggered years for portfolio entries
        year = (2026 - Math.floor(idx / 3)).toString();
      }

      if (!groups[year]) {
        groups[year] = [];
      }
      groups[year].push(project);
    });

    // Sort years descending
    const sortedYears = Object.keys(groups).sort((a, b) => Number(b) - Number(a));
    return sortedYears.map((year) => ({
      year,
      projects: groups[year],
    }));
  }, [filteredProjects]);

  return (
    <main className="min-h-screen pb-24 animate-fade-in">
      <div className="max-w-4xl mx-auto px-6 pt-10">
        {/* Header Section */}
        <header className="space-y-4 pb-10 border-b border-light-subtle/15 dark:border-dark-subtle/15 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono tracking-wider uppercase border border-[#e6b450]/40 bg-[#e6b450]/10 text-[#e6b450]">
            <FolderGit2 size={12} />
            <span>Compendium // Production Works</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-light-text dark:text-[#ffffff] tracking-tight">
            Editorial Project Index
          </h1>

          <p className="font-serif italic text-lg text-light-subtle dark:text-[#d9d7d3]/80">
            A chronological catalog of production web applications, edge distributed systems, and open-source tooling.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-4">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all duration-200 ${
                    isActive
                      ? "bg-[#e6b450] text-[#0a0e14] font-semibold shadow-sm"
                      : "border border-light-subtle/20 dark:border-dark-subtle/20 bg-light-background/60 dark:bg-[#131721]/70 text-light-text dark:text-dark-text hover:border-[#e6b450]/50"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </header>

        {/* Chronological Projects Listing */}
        {projectsByYear.length === 0 ? (
          <div className="text-center py-20 font-mono text-sm text-light-subtle dark:text-dark-subtle">
            No projects found in this category.
          </div>
        ) : (
          <div className="space-y-16">
            {projectsByYear.map(({ year, projects }) => (
              <section key={year} className="space-y-8">
                {/* Year Marker Header */}
                <div className="flex items-center gap-4 border-b border-light-subtle/15 dark:border-dark-subtle/15 pb-3">
                  <span className="font-serif text-3xl md:text-4xl font-semibold text-[#e6b450]">
                    {year}
                  </span>
                  <div className="h-px flex-1 bg-light-subtle/10 dark:bg-dark-subtle/10"></div>
                  <span className="font-mono text-xs text-light-subtle dark:text-dark-subtle">
                    {projects.length} {projects.length === 1 ? "release" : "releases"}
                  </span>
                </div>

                {/* Project Entries */}
                <div className="space-y-8">
                  {projects.map((project) => {
                    const primaryCategory =
                      project.categories?.[0]?.name || "Systems & Web";

                    // Determine Ayu badge color based on category
                    let categoryBadgeColor = "border-[#39bae6]/40 bg-[#39bae6]/10 text-[#39bae6]";
                    if (
                      primaryCategory.toLowerCase().includes("front") ||
                      primaryCategory.toLowerCase().includes("web")
                    ) {
                      categoryBadgeColor = "border-[#aad94c]/40 bg-[#aad94c]/10 text-[#aad94c]";
                    } else if (
                      primaryCategory.toLowerCase().includes("data") ||
                      primaryCategory.toLowerCase().includes("back")
                    ) {
                      categoryBadgeColor = "border-[#f07178]/40 bg-[#f07178]/10 text-[#f07178]";
                    }

                    return (
                      <article
                        key={project.id}
                        className="p-6 sm:p-7 rounded-xl border border-light-subtle/15 dark:border-[#1e2430] bg-light-background/50 dark:bg-[#131721]/60 hover:border-[#e6b450]/40 transition-all duration-200 space-y-5"
                      >
                        {/* Header: Title + Category */}
                        <div className="flex flex-wrap items-baseline justify-between gap-3">
                          <div className="space-y-1">
                            <h2 className="font-serif text-2xl sm:text-3xl text-light-text dark:text-dark-text font-medium leading-snug">
                              {project.name}
                            </h2>
                            {project.featured && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#e6b450]">
                                <Sparkles size={11} /> Featured Release
                              </span>
                            )}
                          </div>

                          <span
                            className={`text-xs font-mono px-2.5 py-1 rounded border ${categoryBadgeColor}`}
                          >
                            {primaryCategory}
                          </span>
                        </div>

                        {/* Substantive Paragraph Description */}
                        <p className="text-sm sm:text-base leading-relaxed text-light-text/85 dark:text-[#d9d7d3]/85">
                          {project.description}
                        </p>

                        {/* Optional Long Description if substantive */}
                        {project.long_description && project.long_description !== project.description && (
                          <div className="text-xs sm:text-sm text-light-subtle dark:text-[#949dab] leading-relaxed border-l-2 border-[#e6b450]/30 pl-4 py-1">
                            {project.long_description}
                          </div>
                        )}

                        {/* Technologies + GitHub & Demo Links */}
                        <div className="pt-4 border-t border-light-subtle/10 dark:border-dark-subtle/10 flex flex-wrap items-center justify-between gap-4">
                          {/* Ayu syntax technology tags */}
                          <div className="flex flex-wrap gap-1.5">
                            {project.technologies?.map((tech: any) => (
                              <span
                                key={tech.id}
                                className="text-xs font-mono px-2.5 py-0.5 rounded bg-light-subtle/10 dark:bg-[#0a0e14] text-light-text dark:text-[#d9d7d3] border border-light-subtle/10 dark:border-[#1e2430]"
                              >
                                {tech.name}
                              </span>
                            ))}
                          </div>

                          {/* Action Links */}
                          <div className="flex items-center gap-4 text-xs font-mono">
                            {project.github && (
                              <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-light-subtle dark:text-dark-subtle hover:text-[#e6b450] transition-colors"
                              >
                                <Github size={14} />
                                <span>Source</span>
                              </a>
                            )}

                            {project.live && (
                              <a
                                href={project.live}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-light-accent dark:text-[#e6b450] font-medium hover:underline"
                              >
                                <span>Visit Site</span>
                                <ArrowUpRight size={14} />
                              </a>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

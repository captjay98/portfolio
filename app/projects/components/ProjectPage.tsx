/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import { ArrowUpRight, Github, Sparkles } from "lucide-react";
import { getImageSrc } from "@app/utils/imageUtils";

interface ProjectsPageProps {
  initialProjects: any[];
  categories: { value: string; label: string }[];
}

const categoryColorMap: Record<string, { text: string; bg: string; border: string }> = {
  "agritech & ai": {
    text: "#aad94c",
    bg: "#aad94c15",
    border: "#aad94c40",
  },
  "enterprise mobile": {
    text: "#39bae6",
    bg: "#39bae615",
    border: "#39bae640",
  },
  "commerce & logistics": {
    text: "#ff8f40",
    bg: "#ff8f4015",
    border: "#ff8f4040",
  },
  "security & patrol": {
    text: "#f07178",
    bg: "#f0717815",
    border: "#f0717840",
  },
  "public safety": {
    text: "#e6b450",
    bg: "#e6b45015",
    border: "#e6b45040",
  },
  "agri-commodity supply": {
    text: "#aad94c",
    bg: "#aad94c15",
    border: "#aad94c40",
  },
  "autonomous agents": {
    text: "#d2a6ff",
    bg: "#d2a6ff15",
    border: "#d2a6ff40",
  },
  "frontend development": {
    text: "#aad94c",
    bg: "#aad94c15",
    border: "#aad94c40",
  },
  "backend development": {
    text: "#e6b450",
    bg: "#e6b45015",
    border: "#e6b45040",
  },
  "fullstack development": {
    text: "#39bae6",
    bg: "#39bae615",
    border: "#39bae640",
  },
};

function getCategoryColors(catName: string) {
  const normalized = (catName || "").toLowerCase().trim();
  return (
    categoryColorMap[normalized] || {
      text: "#e6b450",
      bg: "#e6b45015",
      border: "#e6b45040",
    }
  );
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
      if (Array.isArray(p.category_ids) && p.category_ids.includes(activeCategory)) {
        return true;
      }
      if (p.categories && Array.isArray(p.categories)) {
        return p.categories.some((c: any) => c && c.id === activeCategory);
      }
      return p.category_ids === activeCategory;
    });
  }, [activeCategory, initialProjects]);

  return (
    <main className="min-h-screen pb-24 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10">
        {/* Header Section */}
        <header className="space-y-3 sm:space-y-4 pb-8 border-b border-light-subtle/15 dark:border-dark-subtle/15 mb-8 sm:mb-10">
          <div>
            <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl text-light-text dark:text-[#ffffff] tracking-tight">
              Selected Works
            </h1>
            <p className="text-xs sm:text-sm font-mono text-light-subtle dark:text-dark-subtle mt-1.5">
              Production applications, mobile platforms, and distributed systems.
            </p>
          </div>

          {/* Clean Category Filter Ribbon - horizontally scrollable on mobile */}
          <div className="flex items-center gap-1.5 sm:gap-2 pt-3 overflow-x-auto no-scrollbar pb-2 sm:flex-wrap sm:overflow-x-visible -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setActiveCategory(cat.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap shrink-0 transition-all duration-150 border ${
                    isActive
                      ? "bg-[#e6b450]/15 text-[#e6b450] border-[#e6b450]/40 font-semibold shadow-xs"
                      : "border-light-subtle/15 dark:border-[#1e2430] bg-light-background/60 dark:bg-[#131721]/60 text-light-subtle dark:text-dark-subtle hover:text-light-text dark:hover:text-[#ffffff] hover:border-light-subtle/30 dark:border-[#1e2430]"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </header>

        {/* Projects Listing */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20 font-mono text-sm text-light-subtle dark:text-dark-subtle">
            No projects found in this category.
          </div>
        ) : (
          /* ========================================================= */
          /* Permanent 2-Column Bento Grid Cards                       */
          /* ========================================================= */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {filteredProjects.map((project: any, index: number) => {
              const year = project.created_at
                ? new Date(project.created_at).getFullYear()
                : 2026 - Math.floor(index / 2);

              const primaryCategory =
                project.categories?.[0]?.name || "Systems & Architecture";

              const catColors = getCategoryColors(primaryCategory);

              // Single substantive narrative paragraph (never duplicated)
              const description =
                project.long_description || project.description;

              const hasLive =
                project.live &&
                project.live !== "null" &&
                project.live.trim().length > 0;

              const hasGithub =
                project.github &&
                project.github !== "null" &&
                project.github.trim().length > 0;

              return (
                <article
                  key={project.id}
                  className="group relative rounded-xl border border-light-subtle/15 dark:border-[#1e2430] bg-light-background/60 dark:bg-[#131721]/60 p-4 sm:p-6 transition-all duration-200 hover:border-[#e6b450]/40 shadow-xs hover:shadow-md flex flex-col overflow-hidden"
                >
                  {/* Top accent hairline */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px] opacity-75 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: catColors.text }}
                  />

                  {/* Card Body - flex-1 pushes action footer to bottom */}
                  <div className="flex-1 space-y-3.5">
                    {/* Project Screenshot / Mockup Preview */}
                    {project.image && (
                      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-[#0a0e14] border border-light-subtle/15 dark:border-[#1e2430]">
                        <img
                          src={getImageSrc(project.image)}
                          alt={project.name}
                          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/project/project-placeholder.jpg";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity pointer-events-none" />
                      </div>
                    )}

                    {/* Meta Ribbon */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-[#e6b450] font-semibold">
                          {year}
                        </span>
                        <span className="text-xs font-mono text-light-subtle dark:text-dark-subtle">
                          &middot;
                        </span>
                        <span
                          className="text-[10px] font-mono px-2 py-0.5 rounded border"
                          style={{
                            color: catColors.text,
                            backgroundColor: catColors.bg,
                            borderColor: catColors.border,
                          }}
                        >
                          {primaryCategory}
                        </span>
                      </div>

                      {project.featured && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#e6b450]">
                          <Sparkles size={11} /> Featured
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h2 className="font-serif text-xl sm:text-2xl text-light-text dark:text-[#ffffff] font-medium leading-snug group-hover:text-[#e6b450] transition-colors">
                      {hasLive ? (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline inline-flex items-center gap-1.5"
                        >
                          <span>{project.name}</span>
                          <ArrowUpRight
                            size={16}
                            className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                          />
                        </a>
                      ) : (
                        project.name
                      )}
                    </h2>

                    {/* Single Substantive Description Paragraph */}
                    <p className="text-xs sm:text-sm leading-relaxed text-light-subtle dark:text-[#d9d7d3]/85 line-clamp-3">
                      {description}
                    </p>

                    {/* Tech Pills (inside body) */}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.technologies.slice(0, 4).map((tech: any) => (
                          <span
                            key={tech.id}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-light-subtle/5 dark:bg-[#0a0e14] text-light-text dark:text-[#d9d7d3] border border-light-subtle/10 dark:border-[#1e2430]"
                          >
                            {tech.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Fixed Bottom Action Bar: Consistent, Anchored Position */}
                  <div className="pt-3.5 mt-4 border-t border-light-subtle/10 dark:border-[#1e2430] flex items-center justify-end gap-4 text-xs font-mono">
                    {hasGithub && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-light-subtle dark:text-dark-subtle hover:text-[#e6b450] transition-colors"
                        title="Source Code"
                      >
                        <Github size={13} />
                        <span>Source</span>
                      </a>
                    )}
                    {hasLive && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[#e6b450] font-medium hover:underline"
                      >
                        <span>Visit Site</span>
                        <ArrowUpRight size={13} />
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

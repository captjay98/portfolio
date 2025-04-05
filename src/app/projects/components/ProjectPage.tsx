/*  eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import TechnologyCard from "@/components/TechnologyCard";
import { getTechnologyColor } from "@/utils/technologyMapping";

export default function ProjectsPage({
  initialProjects,
  categories,
}: {
  initialProjects: any[];
  categories: { value: string; label: string }[];
}) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [filteredProjects, setFilteredProjects] =
    useState<any[]>(initialProjects);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Update filtered projects when active category changes
  useEffect(() => {
    const newFilteredProjects =
      activeCategory === "all"
        ? initialProjects
        : activeCategory === "featured"
          ? initialProjects.filter((project) => project.featured)
          : initialProjects.filter((project) => {
              if (Array.isArray(project.category_ids)) {
                return project.category_ids.includes(activeCategory);
              }
              return project.category_ids === activeCategory;
            });

    setFilteredProjects(newFilteredProjects);
  }, [activeCategory, initialProjects]);

  // Update category using only local state
  const handleCategoryChange = (categoryValue: string) => {
    setActiveCategory(categoryValue);
    setActiveIndex(0);

    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  };

  // Scroll to next/previous project
  const scrollToProject = (direction: "next" | "prev") => {
    if (!scrollContainerRef.current) return;

    const newIndex =
      direction === "next"
        ? Math.min(activeIndex + 1, filteredProjects.length - 1)
        : Math.max(activeIndex - 1, 0);

    setActiveIndex(newIndex);

    const targetElement = document.getElementById(`project-${newIndex}`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Set up scroll event listener to update active index
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;

      const scrollContainer = scrollContainerRef.current;

      // Find which project is most visible in the viewport
      const projectElements = Array.from(
        scrollContainer.querySelectorAll('[id^="project-"]'),
      );

      let maxVisibleHeight = 0;
      let mostVisibleIndex = activeIndex;

      projectElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const index = Number(element.id.replace("project-", ""));

        // Calculate how much of the element is visible in the viewport
        const visibleTop = Math.max(0, rect.top);
        const visibleBottom = Math.min(window.innerHeight, rect.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);

        if (visibleHeight > maxVisibleHeight) {
          maxVisibleHeight = visibleHeight;
          mostVisibleIndex = index;
        }
      });

      if (mostVisibleIndex !== activeIndex) {
        setActiveIndex(mostVisibleIndex);
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, [activeIndex, filteredProjects.length]);

  // Reset active index when filtered projects change
  useEffect(() => {
    setActiveIndex(0);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [filteredProjects]);

  return (
    <main className="min-h-screen">
      {/* Fixed category filter */}
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-30 bg-glass shadow-subtle rounded-lg px-2 py-1 animate-fade-in backdrop-blur-md max-w-[90vw] overflow-x-auto no-scrollbar">
        <div className="flex space-x-1 md:space-x-2">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => handleCategoryChange(category.value)}
              className={`px-2 md:px-3 py-1 md:py-1.5 rounded-md text-xs whitespace-nowrap transition-all ${
                activeCategory === category.value
                  ? "bg-accent-gradient text-white shadow-accent"
                  : "bg-light-subtle/10 dark:bg-dark-subtle/10 text-light-text dark:text-dark-text hover:bg-light-subtle/20 dark:hover:bg-dark-subtle/20"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="fixed right-5 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col gap-3 animate-fade-in">
        <button
          onClick={() => scrollToProject("prev")}
          disabled={activeIndex === 0}
          className={`p-2 rounded-full transition-all duration-300 effect-3d
        ${
          activeIndex === 0
            ? "opacity-30 cursor-not-allowed bg-light-subtle/20 dark:bg-dark-subtle/20"
            : "bg-glass hover:shadow-accent cursor-pointer hover:scale-110"
        }`}
        >
          <ArrowUpCircle className="h-6 w-6 text-light-text dark:text-dark-text" />
        </button>
        <button
          onClick={() => scrollToProject("next")}
          disabled={activeIndex === filteredProjects.length - 1}
          className={`p-2 rounded-full transition-all duration-300 effect-3d
        ${
          activeIndex === filteredProjects.length - 1
            ? "opacity-30 cursor-not-allowed bg-light-subtle/20 dark:bg-dark-subtle/20"
            : "bg-glass hover:shadow-accent cursor-pointer hover:scale-110"
        }`}
        >
          <ArrowDownCircle className="h-6 w-6 text-light-text dark:text-dark-text" />
        </button>
      </div>

      {/* Project indicator */}
      <div className="fixed left-1 md:left-5 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-1.5 animate-fade-in">
        {filteredProjects.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setActiveIndex(index);
              const targetElement = document.getElementById(`project-${index}`);
              if (targetElement) {
                targetElement.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300
              ${
                activeIndex === index
                  ? "w-3 h-3 bg-light-accent dark:bg-dark-accent"
                  : "bg-light-subtle dark:bg-dark-subtle hover:bg-light-accent/50 dark:hover:bg-dark-accent/50"
              }`}
            aria-label={`Go to project ${index + 1}`}
          />
        ))}
      </div>

      {/* Projects container with scroll snap */}
      <div
        ref={scrollContainerRef}
        className="snap-y snap-mandatory h-screen overflow-y-auto overflow-x-hidden scroll-smooth"
      >
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project, index) => (
            <div
              key={project.id}
              id={`project-${index}`}
              className="h-screen w-full snap-start flex items-center justify-center p-4 md:p-10"
            >
              <div
                className={`w-full max-w-5xl md:max-w-7xl h-[70vh] md:h-[40vh] animate-fade-in-up bg-glass rounded-xl shadow-elevated effect-3d overflow-hidden transition-transform duration-500 transform ${
                  index === activeIndex ? "scale-100" : "scale-95 opacity-90"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <FullProjectCard project={project} />
              </div>
            </div>
          ))
        ) : (
          <div className="h-screen flex items-center justify-center">
            <p className="text-light-text dark:text-dark-text text-xl animate-fade-in">
              No projects found in this category.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

// Enhanced project card component for full-screen display
function FullProjectCard({ project }: { project: any }) {
  // Use the pre-processed technologies from the server
  const technologies = project.technologies || [];

  return (
    <>
      <div className="flex flex-col md:flex-row h-full">
        {/* Project image - takes up full height on mobile, half width on desktop */}
        <div className="relative h-[25vh] md:h-auto md:w-1/2 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10"></div>
          <div
            className="absolute inset-0 bg-cover bg-center transform transition-transform duration-10000 hover:scale-110"
            style={{
              backgroundImage: `url(${project.image || "/project-placeholder.jpg"})`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
        </div>

        {/* Project details */}
        <div className="flex-1 p-5 md:p-8 overflow-y-auto max-h-[70vh] md:max-h-[80vh]">
          {/* Project name and technologies for all screen sizes */}
          <div className="mb-6">
            <h2 className="text-light-text dark:text-dark-text text-2xl md:text-3xl font-bold">
              {project.name}
            </h2>
            <div className="flex flex-wrap gap-2 mt-3">
              {technologies.map((tech: string, i: number) => (
                <TechnologyCard
                  key={i}
                  name={tech}
                  size="sm"
                  variant="subtle"
                  showIndicator={true}
                  categoryColor={getTechnologyColor(tech)}
                />
              ))}
            </div>
          </div>

          {/* Long description */}
          <p className="text-light-text dark:text-dark-text mb-6 text-sm md:text-base">
            {project.long_description || project.description}
          </p>
        </div>
      </div>

      {/* Fixed position project links at bottom */}
      <div className="fixed bottom-8 left-0 right-0 z-40 flex justify-center gap-6 animate-fade-in">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-glass text-light-text dark:text-dark-text hover:shadow-accent transition-all duration-300 effect-3d hover:scale-105 min-w-[125px] justify-center"
          >
            <svg
              className="h-5 w-5 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.477 2 2 6.477 2 12C2 16.42 4.87 20.17 8.84 21.5C9.34 21.58 9.5 21.27 9.5 21C9.5 20.77 9.5 20.14 9.5 19.31C6.73 19.91 6.14 17.97 6.14 17.97C5.68 16.81 5.03 16.5 5.03 16.5C4.12 15.88 5.1 15.9 5.1 15.9C6.1 15.97 6.63 16.93 6.63 16.93C7.5 18.45 8.97 18 9.54 17.76C9.63 17.11 9.89 16.67 10.17 16.42C7.95 16.17 5.62 15.31 5.62 11.5C5.62 10.39 6 9.5 6.65 8.79C6.55 8.54 6.2 7.5 6.75 6.15C6.75 6.15 7.59 5.88 9.5 7.17C10.29 6.95 11.15 6.84 12 6.84C12.85 6.84 13.71 6.95 14.5 7.17C16.41 5.88 17.25 6.15 17.25 6.15C17.8 7.5 17.45 8.54 17.35 8.79C18 9.5 18.38 10.39 18.38 11.5C18.38 15.32 16.04 16.16 13.81 16.41C14.17 16.72 14.5 17.33 14.5 18.26C14.5 19.6 14.5 20.68 14.5 21C14.5 21.27 14.66 21.59 15.17 21.5C19.14 20.16 22 16.42 22 12C22 6.477 17.523 2 12 2Z"
                fill="currentColor"
              />
            </svg>
            GitHub
          </a>
        )}

        {project.live && (
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-accent-gradient text-white shadow-accent transition-all duration-300 hover:shadow-lg effect-3d hover:scale-105 min-w-[125px] justify-center"
          >
            <svg
              className="h-5 w-5 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 9L21 3M21 3H15M21 3L13 11M10 3H7C4.79086 3 3 4.79086 3 7V17C3 19.2091 4.79086 21 7 21H17C19.2091 21 21 19.2091 21 17V14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Live Site
          </a>
        )}
      </div>
    </>
  );
}

/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import TechnologyCard from "../TechnologyCard";
import CategoryCard from "../CategoryCard";
import { getTechnologyColor } from "@/utils/technologyMapping";

interface TechStackSectionProps {
  techStacks: any[];
}

export default function TechStackSection({
  techStacks,
}: TechStackSectionProps) {
  const [showTechStack, setShowTechStack] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTechStack(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={` max-sm:mt-0 max-sm:mb-20 max-sm:w-[320px] md:w-[350px] lg:w-[400px] p-4 sm:p-6 mx-auto md:mx-0 transition-all duration-700 ease-in-out transform perspective-1000 ${
        showTechStack
          ? "opacity-100 translate-y-0 rotate-y-0 scale-100"
          : "opacity-0 translate-y-10 rotate-y-30 scale-95"
      }`}
      style={{
        transformStyle: "preserve-3d",
        transformOrigin: "center center",
      }}
    >
      <h1 className="text-light-accent dark:text-dark-syntax-entity mb-3 font-semibold text-lg flex items-center">
        <span className="w-2 h-2 rounded-full bg-accent-gradient mr-2 animate-pulse"></span>
        Current Tech Stack
      </h1>

      <div className="space-y-3 shadow-3d py-4">
        {techStacks.map((stack, index) => (
          <div
            key={stack.id}
            style={{
              opacity: showTechStack ? 1 : 0,
              transform: showTechStack ? "translateZ(0)" : "translateZ(-20px)",
              transition: `all 0.5s ease-out ${0.3 + index * 0.1}s`,
            }}
          >
            <div className="border-l-2 pl-2 sm:pl-4 py-1 hover:bg-light-subtle/5 dark:hover:bg-dark-subtle/5 rounded-r ">
              <div className="mb-2">
                <CategoryCard
                  name={stack.category?.name || "General"}
                  variant="accent"
                  size="sm"
                  showIcon={false}
                />
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {stack.technologies.map((tech: any) => (
                  <TechnologyCard
                    key={tech.id}
                    name={tech.name}
                    variant="outline"
                    size="xs"
                    showIndicator={true}
                    categoryColor={getTechnologyColor(tech.name)}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  ExperienceAccomplishmentType,
  ExperienceType,
} from "../../../types/admin";
import TechnologyCard from "@/components/TechnologyCard";
import CategoryCard from "@/components/CategoryCard";
import { getCategoryDotColor } from "@/utils/categoryColors";

interface ExperienceItemProps {
  experience: ExperienceType;
  accomplishments?: ExperienceAccomplishmentType[];
  techMap: Record<string, string>;
  catMap: Record<string, string>;
}

export function ExperienceItem({
  experience,
  accomplishments = [],
  techMap,
  catMap,
}: ExperienceItemProps) {
  const [expanded, setExpanded] = useState(false);

  // Format date with month and year (instead of just year)
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

  // Helper function to convert ID arrays to name arrays
  const mapIdsToNames = (
    ids: string[],
    idToNameMap: Record<string, string>,
  ): string[] => {
    return ids.map((id) => idToNameMap[id] || id);
  };

  // Extract data from experience object
  const {
    title: role,
    company,
    start_date,
    end_date,
    description,
    location,
    technology_ids = [],
    category_ids = [],
  } = experience;

  // Format period string
  const period = `${formatDate(start_date)}${end_date ? ` - ${formatDate(end_date)}` : " - Present"}`;

  // Map IDs to names
  const technologies = mapIdsToNames(technology_ids, techMap);
  const categories = mapIdsToNames(category_ids, catMap);

  return (
    <div className="p-3 bg-glass rounded-lg shadow-subtle hover:shadow-accent transition-shadow duration-300">
      <div className="flex justify-between">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-light-accent dark:text-dark-accent">
            {role}
          </h3>
          <p className="text-sm font-medium text-light-syntax-tag dark:text-dark-syntax-tag font-medium">
            {company}
          </p>
          <div className="flex items-center mt-1 text-xs text-[#4b5563] dark:text-dark-subtle">
            <span className="font-medium text-light-syntax-func dark:text-dark-syntax-func">
              {period}
            </span>
            {location && (
              <>
                <span className="mx-1 text-[#4b5563] dark:text-dark-subtle">
                  •
                </span>
                <span className="text-[#4b5563] dark:text-dark-subtle font-medium">
                  {location}
                </span>
              </>
            )}
          </div>
        </div>
        {(description ||
          accomplishments.length > 0 ||
          technologies.length > 0) && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="self-start p-1 text-light-subtle dark:text-dark-subtle hover:text-light-accent dark:hover:text-dark-accent"
            aria-label={expanded ? "Collapse details" : "Expand details"}
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        )}
      </div>

      {expanded && (
        <div className="mt-2 space-y-3 animate-fade-in">
          {description && (
            <p className="text-sm text-light-text dark:text-dark-text">
              {description}
            </p>
          )}

          {accomplishments.length > 0 && (
            <div className="mt-3">
              <h4 className="text-sm font-semibold mb-2 text-light-accent dark:text-dark-accent">
                Key Accomplishments
              </h4>
              <ul className="list-disc pl-5 space-y-2.5">
                {accomplishments.map((item) => (
                  <li
                    key={item.id}
                    className="text-sm my-1.5 text-light-text dark:text-dark-text"
                  >
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {technologies.length > 0 && (
            <div className="mt-3">
              <h4 className="text-sm font-semibold mb-2 text-light-accent dark:text-dark-accent">
                Technologies
              </h4>
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech) => (
                  <TechnologyCard
                    key={tech}
                    name={tech}
                    size="xs"
                    variant="accent"
                    showIndicator={true}
                    categoryColor={getCategoryDotColor(tech)}
                  />
                ))}
              </div>
            </div>
          )}

          {categories.length > 0 && (
            <div className="mt-3">
              <h4 className="text-sm font-semibold mb-2 text-light-accent dark:text-dark-accent">
                Domains
              </h4>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <CategoryCard
                    key={category}
                    name={category}
                    size="xs"
                    variant="accent"
                    showIcon={true}
                    useFixedColors={true}
                    customTextColor="darK:text-white text-black"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

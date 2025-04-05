import React from "react";
import { MapPin } from "lucide-react";

interface EducationItemProps {
  degree: string;
  institution: string;
  period: string;
  location?: string;
  description?: string;
  isCurrent?: boolean;
}

export const EducationItem: React.FC<EducationItemProps> = ({
  degree,
  institution,
  period,
  location,
  description,
  isCurrent,
}) => {
  return (
    <div className="relative group animate-fade-in-up">
      <div className="bg-glass rounded-lg p-3 effect-3d transform transition-all duration-300 hover:translate-y-[-3px]">
        {/* Institution dot and line */}
        <div
          className={`absolute left-[-8px] top-[28px] w-3 h-3 rounded-full ${isCurrent ? "animate-pulse" : ""} bg-accent-gradient shadow-glow`}
        ></div>
        <div className="absolute left-[-6.5px] top-[40px] bottom-[10px] w-[2px] bg-light-border dark:bg-dark-border"></div>

        <div className="pl-2">
          {/* Header */}
          <div className="flex justify-between items-start mb-1.5">
            <div>
              <h3 className="text-light-text dark:text-dark-text font-medium">
                {degree}
              </h3>
              <p className="text-light-accent dark:text-dark-accent text-sm font-medium">
                {institution}
              </p>
            </div>
            <div className="text-xs text-light-syntax-func dark:text-dark-syntax-func bg-light-subtle/10 dark:bg-dark-subtle/10 px-2 py-1 rounded font-medium">
              {period}
            </div>
          </div>

          {/* Location if available */}
          {location && (
            <p className="text-xs text-light-text dark:text-dark-text font-medium mb-2 flex items-center">
              <MapPin
                size={12}
                className="mr-1 text-light-syntax-tag dark:text-dark-syntax-tag"
              />
              {location}
            </p>
          )}

          {/* Description */}
          {description && (
            <p className="text-sm text-light-text dark:text-dark-text mt-2 mb-3 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
              {description}
            </p>
          )}

          {/* Current education indicator */}
          {isCurrent && (
            <div className="inline-flex items-center mt-1">
              <span className="inline-block w-2 h-2 rounded-full bg-light-accent dark:bg-dark-accent mr-1 animate-pulse"></span>
              <span className="text-xs text-light-accent dark:text-dark-accent">
                Current
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

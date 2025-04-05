import React from "react";

export interface TechnologyCardProps {
  name: string;
  category?: string;
  categoryColor?: string;
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "default" | "accent" | "subtle" | "outline";
  className?: string;
  showIndicator?: boolean;
}

/**
 * A reusable card component for displaying technology names
 */
export const TechnologyCard: React.FC<TechnologyCardProps> = ({
  name,
  categoryColor = "bg-light-accent dark:bg-dark-accent",
  size = "xs",
  variant = "default",
  className = "",
  showIndicator = false,
}) => {
  // Size classes
  const sizeClasses = {
    xs: "px-1.5 py-0.5 text-xs",
    sm: "px-2 py-1 text-sm",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  };

  // Variant classes
  const variantClasses = {
    default:
      "bg-light-subtle/10 dark:bg-dark-subtle/20 text-light-text dark:text-dark-text",
    accent:
      "bg-light-accent/10 dark:bg-dark-accent/20 text-light-accent dark:text-dark-accent",
    subtle:
      "bg-light-subtle/5 dark:bg-dark-subtle/10 text-light-subtle dark:text-dark-subtle",
    outline:
      "border border-light-border dark:border-dark-border text-light-text dark:text-dark-text",
  };

  // Base classes for the tech card
  const baseClasses =
    "inline-flex items-center rounded-md font-medium transition-all duration-200";

  // Hover effect classes
  const hoverClasses = "hover:bg-light-accent/10 dark:hover:bg-dark-accent/20";

  return (
    <span
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${hoverClasses} ${className} group`}
    >
      {showIndicator && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${categoryColor} mr-1.5 group-hover:animate-pulse`}
        ></span>
      )}
      {name}
    </span>
  );
};

export default TechnologyCard;

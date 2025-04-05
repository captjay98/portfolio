import React from "react";
import { Badge, LucideIcon } from "lucide-react";
import { getCategoryBgColor } from "@/utils/categoryColors";

export interface CategoryCardProps {
  name: string;
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "default" | "accent" | "subtle" | "outline" | "primary";
  showIcon?: boolean;
  iconColor?: string;
  customBgColor?: string;
  customTextColor?: string;
  className?: string;
  icon?: LucideIcon;
  useFixedColors?: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  name,
  size = "sm",
  variant = "default",
  showIcon = true,
  iconColor,
  customBgColor,
  className = "",
  icon: Icon = Badge,
  useFixedColors = true,
}) => {
  // Size classes
  const sizeClasses = {
    xs: "text-xs py-0.5 px-2",
    sm: "text-sm py-1 px-2.5",
    md: "text-base py-1.5 px-3",
    lg: "text-base py-2 px-4",
  };

  // Get icon size based on card size
  const getIconSize = () => {
    switch (size) {
      case "xs":
        return 12;
      case "sm":
        return 14;
      case "md":
        return 16;
      case "lg":
        return 18;
      default:
        return 14;
    }
  };

  // Define color schemes for variants
  const getVariantClasses = () => {
    // If using fixed colors based on category name
    if (useFixedColors) {
      const bgColorClass = customBgColor || getCategoryBgColor(name);

      return `${bgColorClass}  border-current/30`;
    }

    // Otherwise, use the variant system
    const variantClasses = {
      default:
        "bg-gradient-to-r from-[#f0f4f8] to-[#d8e2f3] dark:from-[#2d3748] dark:to-[#1a202c] text-light-text dark:text-dark-text border-[#cbd5e0] dark:border-[#4a5568]",
      accent:
        "bg-gradient-to-r from-[#ebf4ff] to-[#c3dafe] dark:from-[#2a4365] dark:to-[#1e3a8a] text-[#3182ce] dark:text-[#90cdf4] border-[#a3bffa] dark:border-[#4c51bf]",
      primary:
        "bg-gradient-to-r from-[#e6fffa] to-[#b2f5ea] dark:from-[#234e52] dark:to-[#1d4044] text-[#2c7a7b] dark:text-[#81e6d9] border-[#81e6d9] dark:border-[#2c7a7b]",
      subtle:
        "bg-gradient-to-r from-[#f7fafc] to-[#edf2f7] dark:from-[#1a202c] dark:to-[#2d3748] text-light-subtle dark:text-dark-subtle border-[#e2e8f0] dark:border-[#4a5568]",
      outline:
        "bg-transparent border-[1px] border-light-border dark:border-dark-border text-light-text dark:text-dark-text hover:bg-light-subtle/5 dark:hover:bg-dark-subtle/10",
    };

    return variantClasses[variant];
  };

  return (
    <div
      className={`
        inline-flex items-center justify-center rounded-md
        font-medium border-[0.5px] shadow-sm
        ${sizeClasses[size]}
        ${getVariantClasses()}
        transition-all duration-300
        hover:shadow-md hover:scale-105
        text-black dark:text-white
        ${className}
      `}
    >
      {showIcon && (
        <Icon
          size={getIconSize()}
          className={`mr-1.5 ${iconColor || "opacity-80"}`}
        />
      )}
      {name}
    </div>
  );
};

export default CategoryCard;

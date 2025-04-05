/**
 * Returns the background gradient color for a category
 */
export function getCategoryBgColor(categoryName: string): string {
  const colorMap: Record<string, string> = {
    "Mobile Development":
      "bg-gradient-to-r from-light-syntax-tag to-light-syntax-tag/50 dark:from-dark-syntax-tag dark:to-dark-syntax-tag/50",
    "Frontend Development":
      "bg-gradient-to-r from-light-syntax-string to-light-syntax-string/50 dark:from-dark-syntax-string dark:to-dark-syntax-string/50",
    "Backend Development":
      "bg-gradient-to-r from-light-syntax-markup to-light-syntax-markup/50 dark:from-dark-syntax-markup dark:to-dark-syntax-markup/50",
    DevOps:
      "bg-gradient-to-r from-light-syntax-keyword to-light-syntax-keyword/50 dark:from-dark-syntax-keyword dark:to-dark-syntax-keyword/50",
    "Database Systems":
      "bg-gradient-to-r from-light-syntax-markup to-light-syntax-markup/50 dark:from-dark-syntax-markup dark:to-dark-syntax-markup/50",
    "Cloud Services":
      "bg-gradient-to-r from-light-syntax-regexp to-light-syntax-regexp/50 dark:from-dark-syntax-regexp dark:to-dark-syntax-regexp/50",
    "Tools & Utilities":
      "bg-gradient-to-r from-light-syntax-func to-light-syntax-func/50 dark:from-dark-syntax-func dark:to-dark-syntax-func/50",
    Testing:
      "bg-gradient-to-r from-light-syntax-special to-light-syntax-special/50 dark:from-dark-syntax-special dark:to-dark-syntax-special/50",
  };

  return (
    colorMap[categoryName] ||
    "bg-gradient-to-r from-gray-500/50 to-gray-600/50 dark:from-gray-700/50 dark:to-gray-800/50"
  );
}

/**
 * Returns the dot/indicator color for a category
 */
export function getCategoryDotColor(categoryName: string): string {
  const colorMap: Record<string, string> = {
    "Mobile Development": "bg-light-syntax-tag dark:bg-dark-syntax-tag",
    "Frontend Development": "bg-light-syntax-string dark:bg-dark-syntax-string",
    "Backend Development": "bg-light-syntax-markup dark:bg-dark-syntax-markup",
    DevOps: "bg-light-syntax-keyword dark:bg-dark-syntax-keyword",
    "Database Systems": "bg-light-syntax-markup dark:bg-dark-syntax-markup",
    "Cloud Services": "bg-light-syntax-regexp dark:bg-dark-syntax-regexp",
    "Tools & Utilities": "bg-light-syntax-func dark:bg-dark-syntax-func",
    Testing: "bg-light-syntax-special dark:bg-dark-syntax-special",
  };

  return colorMap[categoryName] || "bg-gray-500 dark:bg-gray-700";
}

/**
 * Returns the text color for a category
 */
export function getCategoryTextColor(): string {
  return "text-gray-900 dark:text-white font-medium";
}

/**
 * Returns a background overlay for better text legibility if needed
 */
export function getCategoryTextOverlay(): string {
  return "bg-white/10 dark:bg-black/10 backdrop-blur-[1px]";
}

/**
 * Calculates the estimated reading time for a given text.
 *
 * @param text The content to calculate reading time for
 * @param wordsPerMinute The average reading speed (default: 200 words per minute)
 * @returns A formatted string like "5 min read"
 */
export function calculateReadingTime(
  text: string,
  wordsPerMinute = 200,
): string {
  if (!text) return "0 min read";

  // Remove markdown formatting symbols and code blocks
  const cleanText = text
    .replace(/```[\s\S]*?```/g, "") // Remove code blocks
    .replace(/`[^`]*`/g, "") // Remove inline code
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // Replace [text](link) with just text
    .replace(/#+\s/g, "") // Remove heading markers
    .replace(/\*\*|\*|__|_/g, ""); // Remove bold and italic markers

  // Count words (split by whitespace)
  const wordCount = cleanText.trim().split(/\s+/).length;

  // Calculate reading time
  const minutes = Math.ceil(wordCount / wordsPerMinute);

  return `${minutes} min read`;
}

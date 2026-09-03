export const getImageSrc = (src: string) => {
  if (!src) return "";

  // Check if already a full URL
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }

  // Handle local paths by converting to absolute URLs
  // For local dev or seeded data, prepend with your domain or use a static path
  return `/${src.replace(/^\//, "")}`;
};

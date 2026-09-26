"use client";

import * as React from "react";
import { useTheme } from "next-themes";

/**
 * Derives a dark-mode sibling for a project screenshot.
 * e.g. "project/onesecos.webp" -> "project/onesecos-dark.webp"
 * Returns null when the path has no recognisable extension.
 */
export function getDarkImageVariant(src: string): string | null {
  if (!src) return null;
  if (src.includes("-dark.")) return null;
  return src.replace(/(\.[a-zA-Z0-9]+)(\?.*)?$/, "-dark$1$2");
}

export const getImageSrc = (src: string) => {
  if (!src) return "";
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  return `/${src.replace(/^\//, "")}`;
};

type ProjectImageProps = {
  image: string;
  alt: string;
  className?: string;
  placeholder?: string;
};

/**
 * Theme-synced project screenshot.
 *
 * In dark mode it tries a `-dark` sibling image first and silently falls back
 * to the base screenshot when no dark variant exists (e.g. dark-first
 * projects like ProJavi and OneSecOS, or light-only ones like SchoolTry).
 */
export function ProjectImage({
  image,
  alt,
  className = "",
  placeholder = "/project/project-placeholder.jpg",
}: ProjectImageProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [usingDark, setUsingDark] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const wantsDark = mounted && resolvedTheme === "dark";
  const darkVariant = getDarkImageVariant(image);

  const currentSrc = usingDark ? getImageSrc(darkVariant!) : getImageSrc(image);

  React.useEffect(() => {
    if (!mounted) return;
    setUsingDark(Boolean(wantsDark && darkVariant));
  }, [mounted, wantsDark, darkVariant]);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading="lazy"
      onError={(e) => {
        if (usingDark) {
          // Dark variant missing — fall back to the base screenshot
          setUsingDark(false);
        } else {
          (e.target as HTMLImageElement).src = placeholder;
        }
      }}
    />
  );
}

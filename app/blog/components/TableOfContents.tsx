"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, List } from "lucide-react";

interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents({ content }: { content: string }) {
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Extract headings from markdown content
  useEffect(() => {
    if (!content) return;

    // Regular expression to match markdown headings
    const headingRegex = /^(#{2,4})\s+(.+)$/gm;
    const extractedHeadings: HeadingItem[] = [];

    let match;
    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();

      // Create ID by converting heading text to kebab-case
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");

      extractedHeadings.push({ id, text, level });
    }

    setHeadings(extractedHeadings);
  }, [content]);

  // Track active heading based on scroll position
  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      // Find all heading elements in the document
      const headingElements = headings
        .map((heading) => document.getElementById(heading.id))
        .filter(Boolean);

      // Find the heading element that's currently at the top of the viewport
      let currentHeading = headingElements[0]?.id || null;

      for (const element of headingElements) {
        if (!element) continue;

        const rect = element.getBoundingClientRect();
        if (rect.top <= 100) {
          // 100px offset from top of viewport
          currentHeading = element.id;
        } else {
          break;
        }
      }

      setActiveId(currentHeading);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initialize on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  // Don't render if no headings found
  if (headings.length === 0) return null;

  return (
    <div className="mb-8 border border-blue-100 dark:border-blue-900/40 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3 flex items-center justify-between bg-blue-50/50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-sm font-medium"
      >
        <div className="flex items-center">
          <List size={16} className="mr-2" />
          Table of Contents
        </div>
        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>

      {isExpanded && (
        <div className="p-3 bg-white/50 dark:bg-slate-900/30">
          <nav>
            <ul className="space-y-1 max-h-80 overflow-y-auto">
              {headings.map((heading) => (
                <li
                  key={heading.id}
                  style={{ paddingLeft: `${(heading.level - 2) * 16}px` }}
                >
                  <a
                    href={`#${heading.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.getElementById(heading.id);
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth" });
                        // Optional: update URL hash
                        window.history.pushState(null, "", `#${heading.id}`);
                      }
                    }}
                    className={`block py-1 px-2 text-sm rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 ${
                      heading.id === activeId
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 font-medium"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}

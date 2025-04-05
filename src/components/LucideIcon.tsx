import React from "react";
import { LucideProps } from "lucide-react";
import {
  Github,
  Twitter,
  Linkedin,
  Instagram,
  Facebook,
  Youtube,
  Mail,
  Code,
  MessageSquare,
  Globe,
  Rss,
  Dribbble,
  Star,
  FileDown,
} from "lucide-react";

// A map of icon names to components
const iconMap = {
  github: Github,
  twitter: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  mail: Mail,
  code: Code,
  messageSquare: MessageSquare,
  globe: Globe,
  rss: Rss,
  dribbble: Dribbble,
  star: Star,
  fileDown: FileDown,
};

type IconName = keyof typeof iconMap;

// Convert string to camelCase (e.g., "github" stays "github", but "message-square" becomes "messageSquare")
const toCamelCase = (str: string): string => {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
};

interface LucideIconProps extends LucideProps {
  name: string;
}

const LucideIcon: React.FC<LucideIconProps> = ({ name, ...props }) => {
  // Convert to camelCase
  const camelCaseName = toCamelCase(name);

  // Get the icon component
  const IconComponent = iconMap[camelCaseName as IconName];

  // Fallback to a default icon if not found
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found, defaulting to Globe`);
    return <Globe {...props} />;
  }

  return <IconComponent {...props} />;
};

export default LucideIcon;

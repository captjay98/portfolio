/* eslint-disable  @typescript-eslint/no-explicit-any */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText } from "lucide-react";

import LucideIcon from "../LucideIcon";
import CodeSnippet from "./CodeSnippet";

interface ProfileProps {
  profile: any;
  socialLinks: any[];
  onProfileComplete?: () => void;
}

export default function DynamicProfileContent({
  profile,
  socialLinks,
  onProfileComplete,
}: ProfileProps) {
  const [showProfile, setShowProfile] = useState(false);

  const handleCodeComplete = () => {
    setShowProfile(true);
  };

  // Notify parent when all profile animations are complete
  useEffect(() => {
    if (showProfile && onProfileComplete) {
      // Wait for social links animation to complete before triggering
      const timeout = setTimeout(() => {
        onProfileComplete();
      }, 1000); // Allow time for social links to animate in

      return () => clearTimeout(timeout);
    }
  }, [showProfile, onProfileComplete]);

  return (
    <div>
      <p className="font-light text-light-text dark:text-dark-text max-sm:text-[1.25rem] md:text-[21px] lg:text-xl">
        <CodeSnippet onComplete={handleCodeComplete} />
        <br />
        {showProfile && (
          <span className="text-light-accent dark:text-dark-accent font-bold max-sm:text-[1.75rem] md:text-[28px] lg:text-[40px] animate-fade-in">
            {profile?.full_name || "User FullName"}
          </span>
        )}
        <br />
        {showProfile && (
          <span
            className="text-[0.5rem] text-light-subtle dark:text-dark-subtle animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            also known as {profile?.nickname || "User Nickname"}
          </span>
        )}
      </p>

      {/* Social Links - only show after code animation completes */}
      {showProfile && (
        <div
          className="flex justify-center pt-6 space-x-6 h-20 animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          {/* Dynamic social links .filter(link => link.is_visible) */}
          {socialLinks.map((link) => (
            <Link
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="w-12 h-12 rounded-full bg-glass effect-3d hover:shadow-accent flex items-center justify-center transition-all hover:scale-110">
                <LucideIcon
                  name={link.icon}
                  className="text-light-accent dark:text-dark-accent"
                  size={22}
                />
              </div>
            </Link>
          ))}

          {/* Resume link */}
          {profile?.resume_url && (
            <Link
              href={profile.resume_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="w-10 h-10 rounded-full bg-glass flex items-center justify-center hover:scale-110 transition-all">
                <FileText
                  size={24}
                  className="text-light-accent dark:text-dark-accent"
                />
              </div>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

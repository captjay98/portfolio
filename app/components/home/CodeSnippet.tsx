"use client";

import { useState, useEffect } from "react";
import TypewriterEffect from "../TypewriterEffect";

interface CodeSnippetProps {
  onComplete?: () => void;
}

export default function CodeSnippet({ onComplete }: CodeSnippetProps) {
  const [showHyphen, setShowHyphen] = useState(false);
  const [showArrow, setShowArrow] = useState(false);
  const [showFunction, setShowFunction] = useState(false);
  const [showSemicolon, setShowSemicolon] = useState(false);

  // Chain the animations sequentially
  const handleVariableComplete = () => {
    setShowHyphen(true);
    setShowArrow(true);
  };
  const handleArrowComplete = () => setShowFunction(true);
  const handleFunctionComplete = () => setShowSemicolon(true);

  // Trigger the onComplete callback after the semicolon appears
  useEffect(() => {
    if (showSemicolon && onComplete) {
      // Add a small delay before triggering onComplete
      const timeout = setTimeout(onComplete, 300);
      return () => clearTimeout(timeout);
    }
  }, [showSemicolon, onComplete]);

  return (
    <span className="font-mono">
      <TypewriterEffect
        text="$user"
        className="text-light-syntax-entity dark:text-dark-syntax-entity"
        delay={300}
        typingSpeed={50}
        onComplete={handleVariableComplete}
      />
      {showHyphen && (
        <span className="text-keyword dark:text-dark-keyword">-</span>
      )}
      {showArrow && (
        <TypewriterEffect
          text=">"
          className="text-keyword dark:text-dark-keyword"
          delay={50}
          typingSpeed={100}
          onComplete={handleArrowComplete}
        />
      )}
      {showFunction && (
        <TypewriterEffect
          text="software_engineer"
          className="text-light-accent dark:text-dark-accent"
          delay={50}
          typingSpeed={50}
          onComplete={handleFunctionComplete}
        />
      )}
      {showSemicolon && (
        <span className="text-light-text dark:text-dark-text">;</span>
      )}
    </span>
  );
}

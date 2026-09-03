"use client";

import { useState, useEffect } from "react";

interface TypewriterEffectProps {
  text: string;
  className?: string;
  delay?: number;
  typingSpeed?: number;
  onComplete?: () => void;
}

export default function TypewriterEffect({
  text,
  className = "",
  delay = 500,
  typingSpeed = 60,
  onComplete,
}: TypewriterEffectProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Reset the animation when the text changes
    setDisplayedText("");
    setCurrentIndex(0);
    setIsTyping(false);

    // Start typing after the initial delay
    const delayTimeout = setTimeout(() => {
      setIsTyping(true);
    }, delay);

    return () => clearTimeout(delayTimeout);
  }, [text, delay]);

  useEffect(() => {
    if (!isTyping) return;

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, typingSpeed);

      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
      if (onComplete) onComplete();
    }
  }, [currentIndex, isTyping, text, typingSpeed, onComplete]);

  return <span className={className}>{displayedText}</span>;
}

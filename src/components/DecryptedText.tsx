"use client";
import React, { useEffect, useRef, useState } from "react";

export default function DecryptedText({ text, speed = 50 }: { text: string; speed?: number }) {
  const [displayText, setDisplayText] = useState("");
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let iteration = 0;
    let interval: NodeJS.Timeout;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          clearInterval(interval);
          interval = setInterval(() => {
            setDisplayText((prev) =>
              text
                .split("")
                .map((letter, index) => {
                  if (index < iteration) {
                    return text[index];
                  }
                  return letters[Math.floor(Math.random() * 26)];
                })
                .join("")
            );
            if (iteration >= text.length) {
              clearInterval(interval);
            }
            iteration += 1 / 3;
          }, speed);
        }
      },
      { threshold: 0.5 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, [text, speed]);

  return (
    <div ref={elementRef} className="font-pixel text-4xl md:text-6xl text-white">
      {displayText}
    </div>
  );
}

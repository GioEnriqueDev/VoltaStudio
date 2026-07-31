"use client";
import React, { useRef, useState } from "react";

export function GlowCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden group ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        transformStyle: "preserve-3d",
        transform: isHovering 
          ? `perspective(1000px) rotateX(${(mousePosition.y - (cardRef.current?.clientHeight || 0)/2) / -25}deg) rotateY(${(mousePosition.x - (cardRef.current?.clientWidth || 0)/2) / 25}deg)`
          : "perspective(1000px) rotateX(0deg) rotateY(0deg)",
        transition: isHovering ? "transform 0.1s ease-out" : "transform 0.5s ease-out"
      }}
    >
      {/* 1. StarBorder (Reactbits Pattern) - Rotating gradient border */}
      <div className="absolute inset-0 z-0 p-[2px] rounded-3xl overflow-hidden pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500">
        <div className="w-[300%] h-[300%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_0_340deg,#8c52ff_360deg)] animate-[spin_4s_linear_infinite]" />
      </div>

      {/* 2. Background Glow Tracking */}
      <div
        className="pointer-events-none absolute inset-[2px] rounded-3xl z-0 transition-opacity duration-500 bg-[#05050A]"
        style={{
          background: isHovering 
            ? `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(140,82,255,0.15), #05050A 40%)`
            : "#05050A"
        }}
      />
      
      {/* 3. Border Glow Tracking (Inner Shadow Mask) */}
      <div
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-500 rounded-3xl"
        style={{
          opacity: isHovering ? 1 : 0,
          boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.05)`,
          maskImage: `radial-gradient(300px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#8c52ff] to-[#5e17eb] opacity-80 mix-blend-overlay" />
      </div>

      <div className="relative z-20 h-full w-full">
        {children}
      </div>
    </div>
  );
}

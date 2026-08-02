"use client";
import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";

export function GlowCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for physical 3D tilt (Framer Motion)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for organic movement
  const springConfig = { damping: 30, stiffness: 200, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Tilt constraints (max 6 degrees for a premium, heavy glass feel)
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-6, 6]);

  // Glow position for the spotlight effect
  const glowX = useSpring(useMotionValue(50), { stiffness: 300, damping: 40 });
  const glowY = useSpring(useMotionValue(50), { stiffness: 300, damping: 40 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    
    // Normalize coordinates for 3D tilt (-0.5 to 0.5)
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    
    mouseX.set(xPct);
    mouseY.set(yPct);

    // Percentage coordinates for spotlight (0 to 100)
    glowX.set(((e.clientX - rect.left) / rect.width) * 100);
    glowY.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
    glowX.set(50);
    glowY.set(50);
  };

  // Dinamic spotlight gradient template (Illuminazione diffusa)
  const background = useMotionTemplate`radial-gradient(800px circle at ${glowX}% ${glowY}%, rgba(255, 255, 255, 0.6), transparent 40%)`;

  // Glare fisico (riflesso speculare come sul vetro Apple/Linear)
  // Usa il tilt per spostare il riflesso sulla diagonale
  const glareX = useTransform(mouseX, [-0.5, 0.5], [150, -50]);
  const glareY = useTransform(mouseY, [-0.5, 0.5], [150, -50]);
  const glareBackground = useMotionTemplate`linear-gradient(105deg, transparent 10%, rgba(255,255,255,0.8) ${glareX}%, transparent 90%)`;

  // Pulizia stili hardcoded
  const cleanClassName = className.replace(/bg-\S+/g, '').replace(/shadow-\S+/g, '');

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden group rounded-[2.5rem] bg-white/50 backdrop-blur-[60px] backdrop-saturate-[180%] border border-black/5 shadow-[0_15px_35px_rgba(0,0,0,0.03)] ${cleanClassName}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1200,
        transformStyle: "preserve-3d"
      }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      {/* 1. Base Vetro Smerigliato */}
      <div className="absolute inset-0 rounded-[2.5rem] z-0 bg-white/30" />

      {/* 2. Illuminazione Diffusa (Spotlight che segue il cursore) */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 rounded-[2.5rem] transition-opacity duration-500"
        style={{
          opacity: isHovered ? 1 : 0,
          background,
          boxShadow: "inset 0 1px 1px rgba(255,255,255,0.8), inset 0 0 0 1px rgba(0,0,0,0.02)"
        }}
      />

      {/* 3. Glare Fisico (Riflesso di luce diagonale) */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 rounded-[2.5rem] transition-opacity duration-300 mix-blend-overlay"
        style={{
          opacity: isHovered ? 1 : 0,
          background: glareBackground,
        }}
      />

      {/* Content */}
      <div className="relative z-20 h-full w-full" style={{ transform: "translateZ(20px)" }}>
        {children}
      </div>
    </motion.div>
  );
}

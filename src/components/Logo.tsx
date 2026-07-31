"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Logo() {
  const svgRef = useRef<SVGSVGElement>(null);
  const leftPathRef = useRef<SVGPathElement>(null);
  const rightPathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!svgRef.current || !leftPathRef.current || !rightPathRef.current) return;

    const ctx = gsap.context(() => {
      // Entrance Animation
      gsap.fromTo(
        leftPathRef.current,
        { x: -50, opacity: 0, rotation: -10, transformOrigin: "bottom right" },
        { x: 0, opacity: 1, rotation: 0, duration: 1.5, ease: "power4.out", delay: 0.2 }
      );
      
      gsap.fromTo(
        rightPathRef.current,
        { x: 50, opacity: 0, rotation: 10, transformOrigin: "bottom left" },
        { x: 0, opacity: 1, rotation: 0, duration: 1.5, ease: "power4.out", delay: 0.3 }
      );
    }, svgRef);

    return () => ctx.revert();
  }, []);

  const handleMouseEnter = () => {
    gsap.to(leftPathRef.current, { x: -4, rotation: -2, duration: 0.4, ease: "power2.out" });
    gsap.to(rightPathRef.current, { x: 4, rotation: 2, duration: 0.4, ease: "power2.out" });
  };

  const handleMouseLeave = () => {
    gsap.to(leftPathRef.current, { x: 0, rotation: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
    gsap.to(rightPathRef.current, { x: 0, rotation: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
  };

  return (
    <svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 256 256"
      fill="none"
      className="cursor-pointer overflow-visible drop-shadow-[0_0_8px_rgba(140,82,255,0.3)] hover:drop-shadow-[0_0_15px_rgba(140,82,255,0.6)] transition-all duration-300"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <defs>
        <linearGradient id="v-grad-left" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8c52ff" />
          <stop offset="100%" stopColor="#6d39e3" />
        </linearGradient>
        <linearGradient id="v-grad-right" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7a3cf0" />
          <stop offset="100%" stopColor="#4B0082" />
        </linearGradient>
      </defs>
      
      {/* Left part of the V (Thicker, slightly lower) */}
      <path
        ref={leftPathRef}
        d="M 20 50 L 100 220 L 125 180 L 80 50 Z"
        fill="url(#v-grad-left)"
      />
      
      {/* Right part of the V (Thinner, higher, sharp point intersecting the center) */}
      <path
        ref={rightPathRef}
        d="M 125 180 L 140 230 L 236 40 L 175 40 Z"
        fill="url(#v-grad-right)"
      />
    </svg>
  );
}

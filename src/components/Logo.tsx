"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Logo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const leftPathRef = useRef<SVGPathElement>(null);
  const rightPathRef = useRef<SVGPathElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !leftPathRef.current || !rightPathRef.current || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Fluid Continuous Breathing Animation for the Logo
      gsap.to(leftPathRef.current, {
        y: -2,
        rotation: -1,
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
      });
      
      gsap.to(rightPathRef.current, {
        y: 2,
        rotation: 1,
        duration: 2.5,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        delay: 0.2
      });

      // 2. Entrance Animation
      gsap.fromTo(
        leftPathRef.current,
        { opacity: 0, x: -20, filter: "blur(10px)" },
        { opacity: 1, x: 0, filter: "blur(0px)", duration: 1.5, ease: "expo.out" }
      );
      gsap.fromTo(
        rightPathRef.current,
        { opacity: 0, x: 20, filter: "blur(10px)" },
        { opacity: 1, x: 0, filter: "blur(0px)", duration: 1.5, ease: "expo.out", delay: 0.1 }
      );
      if(textRef.current) {
        gsap.fromTo(textRef.current, 
          { opacity: 0, x: -10 },
          { opacity: 1, x: 0, duration: 1.5, ease: "expo.out", delay: 0.3 }
        );
      }
    }, containerRef);

    // 3. Magnetic Hover Effect
    const container = containerRef.current;
    
    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = container.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      
      // Move SVG
      gsap.to(svgRef.current, {
        x: distanceX * 0.2,
        y: distanceY * 0.2,
        rotation: distanceX * 0.05,
        duration: 0.6,
        ease: "power3.out"
      });
      // Move Text slightly less for parallax
      gsap.to(textRef.current, {
        x: distanceX * 0.1,
        y: distanceY * 0.1,
        duration: 0.6,
        ease: "power3.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to([svgRef.current, textRef.current], {
        x: 0,
        y: 0,
        rotation: 0,
        duration: 1,
        ease: "elastic.out(1, 0.3)"
      });
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      ctx.revert();
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="flex items-center gap-5 cursor-pointer group px-2 py-1 relative z-50"
    >
      {/* THE V ICON */}
      <div className="relative flex items-center justify-center">
        {/* Ambient Glow - expands on hover */}
        <div className="absolute inset-0 bg-black/5 blur-[24px] opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-700 rounded-full scale-110 pointer-events-none" />
        
        <svg
          ref={svgRef}
          xmlns="http://www.w3.org/2000/svg"
          width="44"
          height="44"
          viewBox="0 0 256 256"
          fill="none"
          className="relative z-10 overflow-visible drop-shadow-[0_0_12px_rgba(140,82,255,0.5)] transition-all duration-500"
        >
          <defs>
            <linearGradient id="v-grad-left" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#333333" />
              <stop offset="100%" stopColor="#000000" />
            </linearGradient>
            <linearGradient id="v-grad-right" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#444444" />
              <stop offset="100%" stopColor="#050505" />
            </linearGradient>
            
            <filter id="glow-inner">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.2" />
            </filter>
          </defs>
          
          {/* Left part of the V (Solid, thick, glossy) */}
          <path
            ref={leftPathRef}
            d="M 30 50 L 105 220 L 135 220 L 75 50 Z"
            fill="url(#v-grad-left)"
            filter="url(#glow-inner)"
            className="origin-bottom-right"
          />
          
          {/* Right part of the V (Lightning Bolt jagged inner edge, striking) */}
          <path
            ref={rightPathRef}
            d="M 125 220 L 226 50 L 175 50 L 145 110 L 165 110 L 135 170 L 145 170 Z"
            fill="url(#v-grad-right)"
            filter="url(#glow-inner)"
            className="origin-bottom-left"
          />
        </svg>
      </div>

      {/* TYPOGRAPHY: VOLTA STUDIO */}
      <div ref={textRef} className="flex flex-col justify-center pointer-events-none">
        {/* VOLTA */}
        <div className="text-[#0a0a0a] text-[30px] font-bold tracking-[0.22em] leading-none flex items-center mt-1">
          VOLT<span className="font-sans ml-[2px] text-[28px] text-[#0a0a0a]">Λ</span>
        </div>
        {/* STUDIO */}
        <div className="text-[#4a4a4a] text-[10px] font-medium tracking-[0.9em] leading-none mt-2 uppercase pl-1 opacity-90">
          Studio
        </div>
      </div>
    </div>
  );
}

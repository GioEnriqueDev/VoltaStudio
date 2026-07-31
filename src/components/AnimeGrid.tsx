"use client";
import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

export default function AnimeGrid() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Create a procedural grid of lines
    const rows = 15;
    const cols = 25;
    const spacing = 60;
    const lines: JSX.Element[] = [];

    // Horizontal lines
    for (let i = 0; i <= rows; i++) {
      lines.push(
        <line
          key={`h-${i}`}
          x1="0"
          y1={i * spacing}
          x2={cols * spacing}
          y2={i * spacing}
          className="anime-line stroke-[#8c52ff]/10"
          strokeWidth="1"
          fill="none"
        />
      );
    }
    
    // Vertical lines
    for (let j = 0; j <= cols; j++) {
      lines.push(
        <line
          key={`v-${j}`}
          x1={j * spacing}
          y1="0"
          x2={j * spacing}
          y2={rows * spacing}
          className="anime-line stroke-[#8c52ff]/10"
          strokeWidth="1"
          fill="none"
        />
      );
    }

    // This is done via React state usually, but for performance we just inject them
    // Wait, since it's Next.js client component, we can just render them in the return.

    // Anime.js Staggering Animation
    anime({
      targets: '.anime-line',
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeInOutSine',
      duration: 3000,
      delay: anime.stagger(50, { grid: [cols + 1, rows + 1], from: 'center' }),
      direction: 'alternate',
      loop: true
    });
  }, []);

  // Generate lines purely for render
  const rows = 15;
  const cols = 25;
  const spacing = 60;
  const lines = [];

  for (let i = 0; i <= rows; i++) {
    lines.push(
      <line key={`h-${i}`} x1="0" y1={i * spacing} x2={cols * spacing} y2={i * spacing} className="anime-line stroke-[#8c52ff]/20" strokeWidth="1" fill="none" strokeDasharray="200" />
    );
  }
  for (let j = 0; j <= cols; j++) {
    lines.push(
      <line key={`v-${j}`} x1={j * spacing} y1="0" x2={j * spacing} y2={rows * spacing} className="anime-line stroke-[#8c52ff]/20" strokeWidth="1" fill="none" strokeDasharray="200" />
    );
  }

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40 mix-blend-screen mask-image-radial">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-[1500px]"
        style={{ maskImage: 'radial-gradient(ellipse at center, black 10%, transparent 70%)' }}
      >
        {lines}
      </svg>
    </div>
  );
}

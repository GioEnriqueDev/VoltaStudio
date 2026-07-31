"use client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function HorizontalPan({ children }: { children: React.ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrap.current || !track.current) return;
    
    // Assicurati che ScrollTrigger sia registrato
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      const trackEl = track.current;
      if (!trackEl) return;
      
      const distance = trackEl.scrollWidth - window.innerWidth;
      
      gsap.to(trackEl, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: wrap.current,
          start: "top top",
          end: () => `+=${distance}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }, wrap);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={wrap} className="relative overflow-hidden bg-black text-white">
      <div ref={track} className="flex h-[100dvh] items-center px-[5vw]">
        {children}
      </div>
    </section>
  );
}

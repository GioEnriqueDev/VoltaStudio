"use client";
import React, { useState, useEffect, useRef } from "react";
import { Play, Menu, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import DecryptedText from "../components/DecryptedText";
import Logo from "../components/Logo";
import { GlowCard } from "../components/GlowCard";
import AnimeGrid from "../components/AnimeGrid";
import RiveAsset from "../components/RiveAsset";
import MagneticButton from "../components/MagneticButton";
import SplitType from "split-type";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  
  // Refs per l'architettura fissa e scroll
  const scrollSpacerRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const bentoGridRef = useRef<HTMLDivElement>(null);
  
  // Refs per Kinetic Scrub Text
  const word1Ref = useRef<HTMLDivElement>(null);
  const word2Ref = useRef<HTMLDivElement>(null);

  // Canvas Image Sequence (Frozen Background)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !scrollSpacerRef.current || !heroTextRef.current) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.width = 1920;
    canvas.height = 1080;
    const frameCount = 361;
    
    const currentFrame = (index: number) => `/frames_hq/frame_${(index + 1).toString().padStart(4, "0")}.jpg`;

    const images: HTMLImageElement[] = [];
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      images.push(img);
    }

    images[0].onload = () => {
      context.drawImage(images[0], 0, 0, canvas.width, canvas.height);
    };

    const frames = { frame: 0 };

    import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
      gsap.registerPlugin(ScrollTrigger);

      // Master Timeline per lo Scrub Spacer
      const scrubTl = gsap.timeline({
        scrollTrigger: {
          trigger: scrollSpacerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.2, // Ultra reattivo
        }
      });

      // 1. Hero Text Fade Out (Rapido, 0-15%)
      scrubTl.to(heroTextRef.current, {
        opacity: 0,
        y: -150,
        scale: 0.9,
        ease: "power2.in",
      }, 0);

      // 2. Canvas Scrubbing & Deep Zoom (0-100%)
      scrubTl.to(frames, {
        frame: frameCount - 1,
        snap: "frame",
        ease: "none",
        duration: 1, // Durata base 1 per calcolare bene le frazioni
        onUpdate: () => {
          const img = images[frames.frame];
          if (img && img.complete) {
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
          }
        }
      }, 0);

      scrubTl.fromTo(canvas, 
        { scale: 1 }, 
        { scale: 1.15, ease: "none", duration: 1 }, 
        0
      );

      // 3. Kinetic Text 1: "SCALABILITÀ" (10% -> 40%)
      if (word1Ref.current) {
        const text1 = new SplitType(word1Ref.current, { types: "chars" });
        scrubTl.set(word1Ref.current, { opacity: 1 }, 0.1); 
        scrubTl.fromTo(text1.chars,
          { opacity: 0, scale: 3, filter: "blur(20px)" },
          { opacity: 1, scale: 1, filter: "blur(0px)", stagger: 0.005, duration: 0.05, ease: "power3.out" },
          0.1
        ).to(word1Ref.current, { opacity: 0, y: -100, duration: 0.05 }, 0.35);
      }

      // 4. Kinetic Text 2: "PERFORMANCE" (45% -> 75%)
      if (word2Ref.current) {
        const text2 = new SplitType(word2Ref.current, { types: "chars" });
        scrubTl.set(word2Ref.current, { opacity: 1 }, 0.45); 
        scrubTl.fromTo(text2.chars,
          { opacity: 0, scale: 3, filter: "blur(20px)" },
          { opacity: 1, scale: 1, filter: "blur(0px)", stagger: 0.005, duration: 0.05, ease: "power3.out" },
          0.45
        ).to(word2Ref.current, { opacity: 0, y: -100, duration: 0.05 }, 0.7);
      }

      // 5. Glass Transition Overlay (80% -> 100%)
      scrubTl.to(overlayRef.current, { opacity: 0.9, ease: "none", duration: 0.2 }, 0.8);


      // Animazione a cascata Bento Grid
      if (bentoGridRef.current) {
        gsap.fromTo(bentoGridRef.current.children,
          { opacity: 0, y: 100, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            stagger: 0.1,
            ease: "power4.out",
            scrollTrigger: {
              trigger: bentoGridRef.current,
              start: "top 80%",
            }
          }
        );
      }

      // --- KINETIC TYPOGRAPHY (Split-Type Reveal) ---
      // Rimuoviamo l'animazione base che era su opacity: 0 / y: 100
      // e la facciamo carattere per carattere
      const titleElement = document.querySelector(".split-reveal");
      if (titleElement) {
        const text = new SplitType(titleElement as HTMLElement, { types: "chars" });
        gsap.fromTo(
          text.chars,
          { opacity: 0, y: 100, rotateX: -90 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 1.2,
            stagger: 0.02,
            ease: "power4.out",
            delay: 0.5,
          }
        );
      }

      // --- VELOCITY SKEW (Inerzia Fisica con ScrollTrigger) ---
      let proxy = { skew: 0 };
      const skewSetter = gsap.quickSetter(".skew-element", "skewY", "deg");
      const clamp = gsap.utils.clamp(-5, 5); // Max 5 gradi per eleganza
      
      ScrollTrigger.create({
        onUpdate: (self) => {
          let skew = clamp(self.getVelocity() / -100);
          if (Math.abs(skew) > Math.abs(proxy.skew)) {
            proxy.skew = skew;
            gsap.to(proxy, {
              skew: 0, 
              duration: 1.2, // Ritorno morbido come gelatina
              ease: "elastic.out(1, 0.3)", 
              overwrite: true, 
              onUpdate: () => skewSetter(proxy.skew)
            });
          }
        }
      });
      // ---------------------------------------------------------
      
    });
  }, []);

  const navLinks = ["CHI SIAMO", "METODO", "PROGETTI", "SERVIZI", "AI LAB", "CONTATTI"];

  return (
    <main className="relative w-full bg-black text-white selection:bg-[#8c52ff] selection:text-white">
      
      {/* FROZEN CANVAS BACKGROUND */}
      {/* Rimane fisso sotto a tutto, creando continuità visiva */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-black flex items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover transform-gpu"
        />
        {/* L'overlay che sfuma a nero durante lo scrub */}
        <div ref={overlayRef} className="absolute inset-0 bg-black opacity-40 mix-blend-multiply" />
        
        {/* PAROLE CINETICHE DURANTE LO SCRUB */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div ref={word1Ref} className="absolute text-6xl md:text-[8vw] font-bold tracking-tighter text-white font-pixel opacity-0">
            SCALABILITÀ
          </div>
          <div ref={word2Ref} className="absolute text-6xl md:text-[8vw] font-bold tracking-tighter text-[#8c52ff] font-pixel opacity-0">
            PERFORMANCE
          </div>
        </div>

        {/* Gradiente nero sul fondo per sfumare dolcemente verso il basso */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
      </div>

      {/* HERO FOREGROUND TEXT (Fisso, sfuma via con lo scroll) */}
      <div className="fixed inset-0 z-10 pointer-events-none">
        <div ref={heroTextRef} className="flex h-full flex-col px-5 sm:px-6 md:px-10 lg:px-14">
          <nav className="flex items-center justify-between py-6 pointer-events-auto">
            <Logo />
            <div className="hidden md:flex gap-8 text-sm tracking-wide">
              {navLinks.map((link) => (
                <Link key={link} href="#" className="hover:text-[#8c52ff] transition-colors uppercase font-medium">
                  {link}
                </Link>
              ))}
            </div>
            <button className="md:hidden p-2 hover:text-[#8c52ff] transition-colors" onClick={() => setMenuOpen(true)}>
              <Menu size={24} />
            </button>
          </nav>

          <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 pointer-events-auto">
            <div className="col-span-1">
              <h2 className="text-lg md:text-xl tracking-wide leading-tight">
                <div className="font-normal">VOLTA</div>
                <div className="font-pixel text-2xl md:text-3xl">STUDIO</div>
              </h2>
              <div className="text-[10px] text-white/50 mt-3">*</div>
              <div className="font-pixel mt-1 text-xs text-white/60 leading-relaxed whitespace-pre-line">
                {`Volta Studio è\n  l'agenzia software\n  più avanzata\n  in Italia`}
              </div>
            </div>
            <div className="col-span-1 text-right lg:text-left">
              <h2 className="text-lg md:text-xl tracking-wide leading-tight">
                <div className="font-normal">AI &</div>
                <div className="font-pixel text-2xl md:text-3xl">ENGINEERING</div>
              </h2>
            </div>
            <div className="col-span-1 mt-6 lg:mt-0">
              <div className="text-base tracking-widest text-white/50 uppercase mb-3 font-pixel">Vision</div>
              <p className="text-sm text-white/90 leading-relaxed max-w-[220px]">
                Sviluppiamo le piattaforme digitali e i sistemi di intelligenza artificiale per il top 1% dei brand mondiali.
              </p>
            </div>
            <div className="col-span-1 mt-6 lg:mt-0 text-right lg:text-left">
              <div className="text-base tracking-widest text-white/50 uppercase mb-3 font-pixel">Core</div>
              <ul className="text-sm text-white/90 leading-relaxed space-y-0.5">
                <li>Machine Learning</li>
                <li>Ingegneria Web Avanzata</li>
                <li>Design Architetturale</li>
                <li>UX/UI & WebGL</li>
              </ul>
            </div>
          </div>

          <div className="flex-1" />

          <div className="pb-4 pointer-events-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-end">
              <div>
                <h1 className="split-reveal text-[2.5rem] sm:text-5xl md:text-6xl lg:text-[4.5rem] xl:text-[5.5rem] tracking-tight uppercase font-medium whitespace-pre-line overflow-hidden" style={{ lineHeight: 0.85, perspective: "1000px" }}>
                  <div className="inline-block">INGEGNERIA DIGITALE</div>{"\n"}
                  <div className="inline-block"><span className="font-pixel font-normal text-[1.15em] inline-block leading-none align-baseline text-[#8c52ff]">MARKETING ESTREMO.</span></div>{"\n"}
                  <div className="inline-block">RISULTATI REALI.</div>
                </h1>
              </div>
              <div className="flex flex-col gap-4 sm:gap-6 justify-end">
                <p className="text-white/60 max-w-sm text-sm md:text-base leading-relaxed">
                  Uniamo sviluppo software full-stack, AI e performance marketing per scalare il tuo business oltre ogni limite tecnico.
                </p>
                <MagneticButton className="self-start">
                  <div className="flex items-center gap-3 border border-[#8c52ff]/30 px-8 py-4 backdrop-blur-md bg-[#8c52ff]/10 hover:bg-[#8c52ff]/30 transition-all text-white group">
                    <Play size={14} className="fill-white group-hover:fill-[#8c52ff] group-hover:text-[#8c52ff] transition-colors" />
                    <span className="text-sm tracking-wider font-semibold">AVVIA IL PROGETTO</span>
                  </div>
                </MagneticButton>
                <div className="self-start lg:self-end flex flex-wrap items-stretch gap-2 sm:gap-3 text-sm text-white/80">
                  <div className="bg-[#5e17eb]/20 backdrop-blur-sm px-4 py-2 border border-[#8c52ff]/20 text-[#8c52ff]">
                    <span className="font-bold text-sm tracking-widest">NEXT.JS EXPERTS</span>
                  </div>
                  <div className="bg-[#5e17eb]/20 backdrop-blur-sm px-4 py-2 border border-[#8c52ff]/20 text-[#8c52ff]">
                    <span className="font-bold text-sm tracking-widest">AI NATIVE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 
        SCROLL SPACER 
        Questo div vuoto permette l'azione fisica di scroll che alimenta il video scrub.
      */}
      <div ref={scrollSpacerRef} className="h-[250vh] w-full" />


      {/* --- INIZIO CONTENUTO SCORREVOLE (Scorre sopra il canvas fisso!) --- */}
      <div className="relative z-20">

        {/* BENTO GRID (Glassmorphism estremo + SVG Procedurale) */}
        <section className="relative py-24 px-6 md:px-14">
          {/* Sfondo SVG animato procedurale */}
          <AnimeGrid />
          
          <div className="relative z-10 max-w-[1400px] mx-auto">
            <div className="mb-24 flex flex-col items-center text-center">
              <h2 className="text-4xl md:text-6xl tracking-tight max-w-3xl leading-tight skew-element transform-gpu">
                L'eccellenza non si raggiunge con i template.<br/><br/>
                Scriviamo codice per risultati <span className="font-pixel text-5xl md:text-7xl text-[#8c52ff]">impossibili</span> da replicare.
              </h2>
            </div>

            <div ref={bentoGridRef} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 auto-rows-[350px]">
              {/* Bento Box 1: AI */}
              <GlowCard className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 flex flex-col justify-between skew-element transform-gpu">
                <div className="flex justify-between items-start">
                  <div className="border border-[#8c52ff]/30 text-[#8c52ff] px-4 py-1.5 rounded-full text-xs tracking-widest uppercase font-mono bg-[#8c52ff]/10">
                    01 / Artificial Intelligence
                  </div>
                  {/* LOGO VOLTA STUDIO ANIMATO */}
                  <div className="absolute top-4 right-4 z-20 pointer-events-auto scale-75 origin-top-right">
                    <Logo />
                  </div>
                </div>
                <div className="relative z-10">
                  <h3 className="text-5xl lg:text-6xl tracking-tight mb-6">Integrazione LLM<br/>& Agenti</h3>
                  <p className="text-white/60 text-xl max-w-md">
                    Sviluppiamo soluzioni AI proprietarie, da agenti conversazionali a sistemi RAG avanzati integrati direttamente nella tua infrastruttura aziendale.
                  </p>
                </div>
              </GlowCard>

              {/* Bento Box 2: Engineering */}
              <GlowCard className="col-span-1 md:col-span-1 lg:col-span-2 row-span-1 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 flex flex-col justify-between skew-element transform-gpu">
                <div className="flex justify-between items-start">
                  <div className="border border-white/20 group-hover:border-[#8c52ff]/30 group-hover:text-[#8c52ff] px-4 py-1.5 rounded-full text-xs tracking-widest uppercase font-mono transition-colors">
                    02 / Web Engineering
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl lg:text-4xl tracking-tight mb-3">Performance Assolute</h3>
                  <p className="text-white/60 text-lg">Architetture Next.js server-first, Edge computing e ottimizzazione Core Web Vitals al millisecondo.</p>
                </div>
              </GlowCard>

              {/* Bento Box 3: Design */}
              <GlowCard className="col-span-1 md:col-span-3 lg:col-span-2 row-span-1 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 flex flex-col justify-between skew-element transform-gpu">
                <div className="flex justify-between items-start">
                  <div className="border border-white/20 group-hover:border-[#8c52ff]/30 group-hover:text-[#8c52ff] px-4 py-1.5 rounded-full text-xs tracking-widest uppercase font-mono transition-colors">
                    03 / Pixel Perfect Design
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl lg:text-4xl tracking-tight mb-3 font-pixel">Estetica & Funzione</h3>
                  <p className="text-white/60 text-lg">Nessuna scorciatoia. Disegniamo interfacce customizzate che fondono le migliori pratiche UX con layout Awwwards-winning.</p>
                </div>
              </GlowCard>
            </div>
          </div>
        </section>

        {/* 3. STICKY STACK - TECH ARSENAL (Sostituisce Horizontal Pan) */}
        <section className="py-48 px-6 md:px-14">
          <div className="max-w-[1200px] mx-auto flex flex-col items-center">
            <h2 className="text-6xl md:text-8xl tracking-tighter leading-none mb-32 text-center">
              LE NOSTRE<br />
              <span className="font-pixel text-[1.2em] bg-clip-text text-transparent bg-gradient-to-br from-[#8c52ff] to-[#5e17eb]">ARMI.</span>
            </h2>

            <div className="w-full max-w-4xl flex flex-col gap-8 pb-[20vh]">
              {[
                { title: "Next.js & React", desc: "Sviluppo Frontend ultrarapido e ottimizzato per i Core Web Vitals di Google." },
                { title: "SEO & Growth", desc: "Analisi dei dati, tracciamento avanzato e acquisizione clienti scalabile." },
                { title: "Python & AI", desc: "Automazione aziendale, RAG, e machine learning integrato nel tuo software." },
                { title: "UX/UI & WebGL", desc: "L'eccellenza visiva per abbattere la frequenza di rimbalzo e alzare il tasso di conversione." },
              ].map((tech, i) => (
                <div 
                  key={i} 
                  className="sticky skew-element transform-gpu flex items-center justify-between bg-black/60 backdrop-blur-3xl border border-[#8c52ff]/20 rounded-3xl p-12 w-full h-[25vh] shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-transform duration-500 hover:scale-[1.02]"
                  style={{ top: `calc(15vh + ${i * 40}px)`, zIndex: i + 10 }}
                >
                  <h3 className="text-4xl md:text-6xl tracking-tight font-medium text-white group-hover:text-[#8c52ff] transition-colors">{tech.title}</h3>
                  <p className="text-white/50 text-xl max-w-sm text-right leading-relaxed">{tech.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. REACTBITS COMPONENT SECTION */}
        <section className="bg-black flex flex-col items-center justify-center px-6 py-48 border-t border-white/5">
          <div className="max-w-4xl w-full text-center space-y-16">
            <div className="inline-block border border-white/20 px-6 py-2 rounded-full text-sm text-white/60 tracking-widest uppercase bg-white/5">
              Intersection Observer
            </div>
            
            <h2 className="text-4xl md:text-6xl font-light tracking-wide leading-tight">
              Il software non deve solo funzionare, <span className="text-[#8c52ff]">deve lasciare il segno.</span>
            </h2>

            <div className="py-24 border-y border-white/10">
              <DecryptedText text="VOLTA RESEARCH" speed={60} />
            </div>
          </div>
        </section>
        
      </div> {/* FINE CONTENUTO SCORREVOLE */}

      {/* MOBILE FULLSCREEN MENU */}
      <div 
        className={`fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="flex items-center justify-between px-6 py-6">
          <Logo />
          <button className="p-2 hover:opacity-70" onClick={() => setMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <div className="flex flex-col items-center justify-center flex-1 gap-8">
          {navLinks.map((link, i) => (
            <Link 
              key={link} 
              href="#" 
              onClick={() => setMenuOpen(false)}
              className={`text-2xl md:text-4xl uppercase tracking-widest font-medium transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-[#8c52ff] ${menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: menuOpen ? `${100 + i * 60}ms` : '0ms' }}
            >
              {link}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

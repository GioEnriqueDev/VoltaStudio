"use client";
import React, { useState, useEffect, useRef } from "react";
import { Play, Menu, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import FloatingLines from "../components/FloatingLines";
import DecryptedText from "../components/DecryptedText";
import Logo from "../components/Logo";
import { GlowCard } from "../components/GlowCard";
import AnimeGrid from "../components/AnimeGrid";
import RiveAsset from "../components/RiveAsset";
import MagneticButton from "../components/MagneticButton";
import SplitType from "split-type";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollSpacerRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const bentoGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollSpacerRef.current || !heroTextRef.current) return;

    import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
      gsap.registerPlugin(ScrollTrigger);

      let mm = gsap.matchMedia();
      
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Master Timeline per lo Scrub Spacer
        const scrubTl = gsap.timeline({
          scrollTrigger: {
            trigger: scrollSpacerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.2, // Ultra reattivo
          }
        });

        // 1. Hero Text Fade Out
        scrubTl.to(heroTextRef.current, {
          opacity: 0,
          y: -150,
          scale: 0.9,
          ease: "power2.in",
        }, 0);

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
      });
      // ---------------------------------------------------------
      
    });
  }, []);

  const navLinks = ["CHI SIAMO", "METODO", "PROGETTI", "SERVIZI", "AI LAB", "CONTATTI"];

  return (
    <main className="relative w-full bg-black text-white selection:bg-[#8c52ff] selection:text-white">
      
      {/* FLOATING LINES BACKGROUND (Cinematic Dark+White) */}
      <div className="fixed inset-0 z-0 pointer-events-auto bg-[#050505] overflow-hidden">
        <FloatingLines
          enabledWaves={['top', 'middle', 'bottom']}
          lineCount={[10, 15, 20]}
          lineDistance={[8, 6, 4]}
          bendRadius={5.0}
          bendStrength={-0.5}
          interactive={true}
          parallax={true}
          mixBlendMode="screen"
        />
        {/* Gradiente nero sul fondo per sfumare dolcemente verso il basso ed enfatizzare il contrasto */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-black/20 to-[#050505] opacity-90" />
      </div>

      {/* HERO FOREGROUND TEXT (Fisso, sfuma via con lo scroll) */}
      <div className="fixed inset-0 z-10 pointer-events-none">
        <div ref={heroTextRef} className="flex h-full flex-col px-5 sm:px-6 md:px-10 lg:px-14">
          
          {/* FLOATING NAVBAR PILL */}
          <div className="w-full max-w-6xl mx-auto pt-6 pointer-events-auto">
            <header className="flex items-center justify-between px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl">
              <Logo />
              <nav className="hidden lg:flex gap-8 text-sm tracking-wide text-white/70">
                {navLinks.slice(0, -1).map((link) => (
                  <Link key={link} href="#" className="hover:text-white transition-colors uppercase font-medium">
                    {link}
                  </Link>
                ))}
              </nav>
              <div className="flex items-center gap-4">
                <button className="hidden lg:flex px-6 py-2 bg-white text-black text-sm font-semibold rounded-full hover:bg-white/90 transition-colors">
                  CONTATTI
                </button>
                <button className="lg:hidden p-2 text-white/70 hover:text-white transition-colors" onClick={() => setMenuOpen(true)}>
                  <Menu size={24} />
                </button>
              </div>
            </header>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center text-center pb-20 pointer-events-none">
            
            {/* BADGE */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-sm mb-8">
              <span className="bg-white text-black px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider">
                AGENCY
              </span>
              <span className="text-white/80 font-medium">L'agenzia AI più avanzata d'Italia</span>
            </div>

            {/* TITLE */}
            <h1 className="split-reveal text-5xl sm:text-6xl md:text-7xl lg:text-[6.5rem] tracking-tighter font-semibold overflow-hidden leading-[1.02] max-w-5xl mt-4 text-white" style={{ perspective: "1000px" }}>
              <div className="block pb-2">
                Ingegneria digitale.
              </div>
              <div className="block text-white/90">
                Risultati estremi.
              </div>
            </h1>

            {/* DESCRIPTION */}
            <p className="text-[#a1a1a6] max-w-2xl text-lg md:text-xl leading-relaxed font-medium mt-6 tracking-tight">
              Sviluppo software full-stack, AI agents e performance marketing per scalare il tuo business oltre ogni limite tecnico.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-10 pointer-events-auto">
              <MagneticButton>
                <div className="flex items-center justify-center gap-3 px-8 py-4 bg-white text-black hover:bg-white/90 transition-all rounded-full group cursor-pointer w-full sm:w-auto">
                  <span className="text-sm tracking-widest font-bold uppercase">Inizia Ora</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </MagneticButton>
              <MagneticButton>
                <div className="flex items-center justify-center gap-3 border border-white/20 px-8 py-4 backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all text-white rounded-full cursor-pointer w-full sm:w-auto">
                  <span className="text-sm tracking-widest font-semibold uppercase">Scopri il metodo</span>
                </div>
              </MagneticButton>
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

        {/* BENTO GRID (Glassmorphism Elegante) */}
        <section className="relative py-24 px-6 md:px-14">
          <div className="relative z-10 max-w-[1400px] mx-auto">
            <div className="mb-24 flex flex-col items-center text-center">
              <h2 className="text-4xl md:text-5xl lg:text-6xl tracking-tight max-w-4xl leading-tight font-medium text-white/90">
                L'eccellenza non si raggiunge con i template.<br/><br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">
                  Sviluppiamo codice per risultati impossibili da replicare.
                </span>
              </h2>
            </div>

            <div ref={bentoGridRef} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 auto-rows-[350px]">
              {/* Bento Box 1: AI */}
              <GlowCard className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2 bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-xl border border-white/10 rounded-3xl p-10 flex flex-col justify-between skew-element transform-gpu">
                <div className="flex justify-between items-start">
                  <div className="border border-white/10 text-white/70 px-4 py-1.5 rounded-full text-xs tracking-widest uppercase font-mono bg-white/5 font-semibold">
                    ARTIFICIAL INTELLIGENCE
                  </div>
                  {/* LOGO VOLTA STUDIO ANIMATO */}
                  <div className="absolute top-4 right-4 z-20 pointer-events-auto scale-75 origin-top-right opacity-50">
                    <Logo />
                  </div>
                </div>
                <div className="relative z-10">
                  <h3 className="text-4xl lg:text-6xl tracking-tighter mb-4 text-white font-medium">Integrazione LLM<br/>& Agenti</h3>
                  <p className="text-[#a1a1a6] text-lg max-w-md font-medium leading-relaxed">
                    Sviluppiamo soluzioni AI proprietarie, da agenti conversazionali a sistemi RAG avanzati integrati direttamente nella tua infrastruttura aziendale.
                  </p>
                </div>
              </GlowCard>

              {/* Bento Box 2: Engineering */}
              <GlowCard className="col-span-1 md:col-span-1 lg:col-span-2 row-span-1 bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-xl border border-white/10 rounded-3xl p-10 flex flex-col justify-between skew-element transform-gpu">
                <div className="flex justify-between items-start">
                  <div className="border border-white/10 group-hover:border-white/30 text-white/70 group-hover:text-white px-4 py-1.5 rounded-full text-xs tracking-widest uppercase font-mono transition-colors font-semibold">
                    WEB ENGINEERING
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl lg:text-4xl tracking-tight mb-2 text-white font-medium">Performance Assolute</h3>
                  <p className="text-[#a1a1a6] text-base font-medium leading-relaxed">Architetture Next.js server-first, Edge computing e ottimizzazione Core Web Vitals al millisecondo.</p>
                </div>
              </GlowCard>

              {/* Bento Box 3: Design */}
              <GlowCard className="col-span-1 md:col-span-3 lg:col-span-2 row-span-1 bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-xl border border-white/10 rounded-3xl p-10 flex flex-col justify-between skew-element transform-gpu">
                <div className="flex justify-between items-start">
                  <div className="border border-white/10 group-hover:border-white/30 text-white/70 group-hover:text-white px-4 py-1.5 rounded-full text-xs tracking-widest uppercase font-mono transition-colors font-semibold">
                    PIXEL PERFECT DESIGN
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl lg:text-4xl tracking-tight mb-2 text-white font-medium">Estetica & Funzione</h3>
                  <p className="text-[#a1a1a6] text-base font-medium leading-relaxed">Nessuna scorciatoia. Disegniamo interfacce customizzate che fondono le migliori pratiche UX con layout ultra-premium.</p>
                </div>
              </GlowCard>
            </div>
          </div>
        </section>

        {/* 3. STICKY STACK - TECH ARSENAL */}
        <section className="py-32 md:py-48 px-6 md:px-14">
          <div className="max-w-[1200px] mx-auto flex flex-col items-center">
            <h2 className="text-5xl md:text-7xl tracking-tighter leading-none mb-32 text-center font-medium">
              LE NOSTRE<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">COMPETENZE.</span>
            </h2>

            <div className="w-full max-w-4xl flex flex-col gap-6 pb-[20vh]">
              {[
                { title: "Next.js & React", desc: "Sviluppo Frontend ultrarapido e ottimizzato per i Core Web Vitals di Google." },
                { title: "SEO & Growth", desc: "Analisi dei dati, tracciamento avanzato e acquisizione clienti scalabile." },
                { title: "Python & AI", desc: "Automazione aziendale, RAG, e machine learning integrato nel tuo software." },
                { title: "UX/UI & WebGL", desc: "L'eccellenza visiva per abbattere la frequenza di rimbalzo e alzare il tasso di conversione." },
              ].map((tech, i) => (
                <div 
                  key={i} 
                  className="sticky skew-element transform-gpu flex items-center justify-between bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 w-full h-[22vh] min-h-[160px] shadow-2xl transition-all duration-500 hover:bg-white/10 hover:border-white/30 hover:scale-[1.02]"
                  style={{ top: `calc(15vh + ${i * 30}px)`, zIndex: i + 10 }}
                >
                  <h3 className="text-3xl md:text-5xl tracking-tight font-medium text-white transition-colors">{tech.title}</h3>
                  <p className="text-[#a1a1a6] text-lg max-w-sm text-right leading-relaxed font-medium">{tech.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. REACTBITS COMPONENT SECTION */}
        <section className="flex flex-col items-center justify-center px-6 py-32 md:py-48">
          <div className="max-w-4xl w-full text-center space-y-16">
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight leading-tight text-white/90">
              Il software non deve solo funzionare,<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">deve lasciare il segno.</span>
            </h2>

            <div className="py-24">
              <DecryptedText text="VOLTA RESEARCH" speed={60} className="text-[#a1a1a6] font-medium tracking-widest text-lg md:text-xl" />
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

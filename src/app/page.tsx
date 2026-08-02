"use client";
import React, { useState, useEffect, useRef } from "react";
import { Play, Menu, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import Lenis from "lenis";
import Waves from "../components/Waves";
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

      // Initialize Lenis Smooth Scroll
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      });

      lenis.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);

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

        // --- KINETIC TYPOGRAPHY (Line Reveal) ---
        const titleLines = document.querySelectorAll(".hero-title-line");
        if (titleLines.length > 0) {
          gsap.fromTo(
            titleLines,
            { opacity: 0, y: 80, rotateX: -45 },
            {
              opacity: 1,
              y: 0,
              rotateX: 0,
              duration: 1.4,
              stagger: 0.15,
              ease: "power4.out",
              delay: 0.3,
            }
          );
        }

        // --- RIMOSSO VELOCITY SKEW ---
        // L'inerzia di scroll GSAP (skewY) interferiva direttamente con i transform 3D 
        // di Framer Motion (rotateX, rotateY) sulla stessa proprietà CSS, rompendo 
        // la fisica del vetro durante lo scroll.
      });
      // ---------------------------------------------------------
      
    });
  }, []);

  const navLinks = ["SERVIZI", "APPROCCIO", "CASE STUDY", "CONTATTI"];

  return (
    <main className="relative w-full bg-[#E8E8EB] text-[#0a0a0a] selection:bg-[#8E2DE2] selection:text-white">
      
      {/* WAVES BACKGROUND (Minimal, Interactive, WOW) */}
      <div className="fixed inset-0 z-0 pointer-events-auto bg-[#E8E8EB] overflow-hidden">
        <Waves
          lineColor="rgba(0, 0, 0, 0.05)" // Onde sottili scure per il light theme
          backgroundColor="transparent"
          waveSpeedX={0.045} 
          waveSpeedY={0.025} 
          waveAmpX={60} 
          waveAmpY={30} 
          friction={0.88} 
          tension={0.02} 
          maxCursorMove={180} 
          xGap={16}
          yGap={40}
        />
        
        {/* Sfumatura chiara a sinistra per leggibilità */}
        <div className="absolute inset-y-0 left-0 w-full md:w-[60%] lg:w-[50%] bg-gradient-to-r from-[#E8E8EB] via-[#E8E8EB]/90 to-transparent pointer-events-none z-0" />
      </div>

      {/* CUSTOM CIRCULAR CURSOR ELEMENT (Center-Right) */}
      <div className="fixed top-1/2 right-[15%] -translate-y-1/2 w-[35rem] h-[35rem] bg-black/5 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* HERO FOREGROUND TEXT (Fisso, sfuma via con lo scroll) */}
      <div className="fixed inset-0 z-10 pointer-events-none">
        <div ref={heroTextRef} className="flex h-full flex-col px-5 sm:px-6 md:px-10 lg:px-14">
          
          {/* TOP NAVBAR (Wide, Minimal) */}
          <div className="w-full max-w-[1600px] mx-auto pt-8 pointer-events-auto">
            <header className="relative flex items-center justify-between py-4">
              <div className="flex-1 -ml-6 sm:-ml-8 md:-ml-12 lg:-ml-[64px] xl:-ml-[72px]">
                <Logo />
              </div>
              <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 gap-10 text-[13px] tracking-wide text-black/60">
                {navLinks.map((link, i) => (
                  <Link key={i} href="#" className="relative group hover:text-black transition-colors font-semibold">
                    {link}
                    {/* Micro-interaction indicator */}
                    <span className="absolute -bottom-1.5 left-1/2 w-1 h-1 bg-black rounded-full opacity-0 group-hover:opacity-100 -translate-x-1/2 transition-all" />
                  </Link>
                ))}
              </nav>
              <div className="flex-1 flex justify-end items-center gap-4">
                <button className="hidden lg:flex px-6 py-2.5 bg-[#0a0a0a] text-white rounded-md text-[13px] font-semibold tracking-wide shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_25px_rgba(0,0,0,0.15)] hover:scale-[1.02] transition-all duration-300">
                  INIZIA ORA
                </button>
                <button className="lg:hidden p-2 text-black/70 hover:text-black transition-colors" onClick={() => setMenuOpen(true)}>
                  <Menu size={24} />
                </button>
              </div>
            </header>
          </div>

          {/* HERO CONTENT (Rockstar Typography + Left Aligned for Background Showcase) */}
          <div className="flex-1 w-full max-w-[1600px] mx-auto flex flex-col justify-center items-start px-2 md:px-8 pb-10 pointer-events-none z-10">
            
            {/* MASSIVE TITLES */}
            <h1 className="text-left text-[4rem] sm:text-[6.5rem] md:text-[8rem] lg:text-[10rem] tracking-tighter font-black overflow-visible leading-[0.85] uppercase">
              <span className="hero-title-line block text-[#0a0a0a]">INNOVAZIONE.</span>
              {/* Parola trasparente con bordo per mostrare il background che scorre sotto */}
              <span className="hero-title-line block text-transparent" style={{ WebkitTextStroke: "2px #0a0a0a" }}>AUTOMAZIONE.</span>
              <span className="hero-title-line block text-[#0a0a0a]">RISULTATI.</span>
            </h1>

            {/* DESCRIPTION */}
            <p className="hero-title-line text-[#555555] max-w-lg text-[18px] md:text-[20px] leading-[1.5] font-medium mt-10">
              Soluzioni digitali avanzate per aziende che vogliono dominare il 2028.
            </p>
          </div>
          
          {/* HERO FOOTER (GTA VI Style Layout - Bilanciato a sinistra) */}
          <div className="w-full max-w-[1600px] mx-auto pb-12 flex flex-col md:flex-row justify-between items-start md:items-center px-4 md:px-8 pointer-events-auto z-10">
            <button className="px-10 py-4 bg-[#0a0a0a] text-white rounded-full text-[15px] font-bold tracking-widest shadow-[0_15px_30px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:scale-[1.03] transition-all duration-300 mb-8 md:mb-0">
              INIZIA ORA
            </button>
            
            <div className="flex flex-col md:items-end">
              <p className="text-[#0a0a0a] font-black text-lg md:text-xl uppercase tracking-widest leading-tight md:text-right">
                IN ARRIVO<br/>
                LE SOLUZIONI DEL 2028
              </p>
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
              <h2 className="text-4xl md:text-5xl lg:text-6xl tracking-tight max-w-4xl leading-tight font-medium text-[#0a0a0a]/90">
                Il design mediocre ti costa clienti.<br/><br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#0a0a0a] to-[#0a0a0a]/50">
                  Costruiamo esperienze premium che convertono e posizionano il tuo brand al vertice.
                </span>
              </h2>
            </div>

            <div ref={bentoGridRef} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 auto-rows-[350px]">
              {/* Bento Box 1: AI */}
              <GlowCard className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2 bg-white/50 hover:bg-white/70 transition-all duration-500 backdrop-blur-[60px] backdrop-saturate-[180%] border border-black/5 rounded-[2.5rem] p-10 flex flex-col justify-between shadow-[0_20px_40px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-start">
                  <div className="border border-black/10 text-[#0a0a0a]/80 px-4 py-1.5 rounded-full text-xs tracking-widest uppercase font-mono bg-white/40 font-semibold shadow-sm">
                    AUTOMAZIONE & AI
                  </div>
                  {/* LOGO VOLTA STUDIO ANIMATO */}
                  <div className="absolute top-4 right-4 z-20 pointer-events-auto scale-75 origin-top-right opacity-80 mix-blend-multiply">
                    <Logo />
                  </div>
                </div>
                <div className="relative z-10">
                  <h3 className="text-4xl lg:text-6xl tracking-tighter mb-4 text-[#0a0a0a] font-medium">Lavora meno,<br/>produci di più.</h3>
                  <p className="text-[#4a4a4a] text-lg max-w-md font-medium leading-relaxed">
                    Tagliamo i costi operativi e annulliamo l'errore umano integrando agenti intelligenti che gestiscono il lavoro ripetitivo al posto tuo, 24/7.
                  </p>
                </div>
              </GlowCard>

              {/* Bento Box 2: Engineering */}
              <GlowCard className="col-span-1 md:col-span-1 lg:col-span-2 row-span-1 bg-white/50 hover:bg-white/70 transition-all duration-500 backdrop-blur-[60px] backdrop-saturate-[180%] border border-black/5 rounded-[2.5rem] p-10 flex flex-col justify-between shadow-[0_20px_40px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-start">
                  <div className="border border-black/10 group-hover:border-black/20 text-[#0a0a0a]/80 group-hover:text-black px-4 py-1.5 rounded-full text-xs tracking-widest uppercase font-mono transition-colors font-semibold shadow-sm">
                    TECNOLOGIA HIGH-END
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl lg:text-4xl tracking-tight mb-2 text-[#0a0a0a] font-medium">Infrastrutture Infallibili</h3>
                  <p className="text-[#4a4a4a] text-base font-medium leading-relaxed">Piattaforme web e app ultra-veloci che non si bloccano mai, progettate per gestire picchi di traffico e trasmettere la massima affidabilità ai tuoi clienti.</p>
                </div>
              </GlowCard>

              {/* Bento Box 3: Design */}
              <GlowCard className="col-span-1 md:col-span-3 lg:col-span-2 row-span-1 bg-white/50 hover:bg-white/70 transition-all duration-500 backdrop-blur-[60px] backdrop-saturate-[180%] border border-black/5 rounded-[2.5rem] p-10 flex flex-col justify-between shadow-[0_20px_40px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-start">
                  <div className="border border-black/10 group-hover:border-black/20 text-[#0a0a0a]/80 group-hover:text-black px-4 py-1.5 rounded-full text-xs tracking-widest uppercase font-mono transition-colors font-semibold shadow-sm">
                    DESIGN PERSUASIVO
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl lg:text-4xl tracking-tight mb-2 text-[#0a0a0a] font-medium">Vendita Silenziosa</h3>
                  <p className="text-[#4a4a4a] text-base font-medium leading-relaxed">Non facciamo solo siti belli. Studiamo la psicologia del tuo utente per trasformare ogni singola visita in una conversazione commerciale ad alto valore.</p>
                </div>
              </GlowCard>
            </div>
          </div>
        </section>

        {/* 3. STICKY STACK - TECH ARSENAL */}
        <section className="py-32 md:py-48 px-6 md:px-14">
          <div className="max-w-[1200px] mx-auto flex flex-col items-center">
            <h2 className="text-5xl md:text-7xl tracking-tighter leading-none mb-32 text-center font-medium">
              IL TUO VANTAGGIO<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#0a0a0a] to-[#0a0a0a]/50">COMPETITIVO.</span>
            </h2>

            <div className="w-full max-w-4xl flex flex-col gap-6 pb-[20vh]">
              {[
                { title: "Ecosistemi Scalabili", desc: "Architetture solide come la roccia che crescono insieme al tuo fatturato, senza mai rallentare l'esperienza utente." },
                { title: "Intelligenza Artificiale", desc: "Diamo un cervello al tuo business. Assistenti virtuali e analisi dati per operare ininterrottamente 24/7." },
                { title: "Acquisizione Strategica", desc: "Posizionamento chirurgico sui motori di ricerca per farti trovare esclusivamente da chi è già pronto a comprare." },
                { title: "Brand Positioning Premium", desc: "Esperienze visive mozzafiato che sbaragliano la concorrenza e giustificano prezzi (e margini) molto più alti." },
              ].map((tech, i) => (
                <div 
                  key={i} 
                  className="sticky flex items-center justify-between bg-white/50 backdrop-blur-[60px] backdrop-saturate-[180%] border border-black/5 rounded-[2.5rem] p-10 w-full h-[22vh] min-h-[160px] shadow-[0_20px_40px_rgba(0,0,0,0.05)] transition-all duration-500 hover:bg-white/70 hover:border-black/10 hover:scale-[1.02]"
                  style={{ top: `calc(15vh + ${i * 30}px)`, zIndex: i + 10 }}
                >
                  <h3 className="text-3xl md:text-5xl tracking-tight font-medium text-[#0a0a0a] transition-colors">{tech.title}</h3>
                  <p className="text-[#4a4a4a] text-lg max-w-sm text-right leading-relaxed font-medium">{tech.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. REACTBITS COMPONENT SECTION */}
        <section className="flex flex-col items-center justify-center px-6 py-32 md:py-48">
          <div className="max-w-4xl w-full text-center space-y-16">
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight leading-tight text-[#0a0a0a]/90">
              Il software non deve solo funzionare,<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#0a0a0a] to-[#0a0a0a]/50">deve lasciare il segno.</span>
            </h2>

            <div className="py-24">
              <div className="text-[#555] font-medium tracking-widest text-lg md:text-xl">
                <DecryptedText text="VOLTA RESEARCH" speed={60} />
              </div>
            </div>
          </div>
        </section>
        
      </div> {/* FINE CONTENUTO SCORREVOLE */}

      {/* MOBILE SIDEBAR MENU (Apple Glassmorphism Lucid) */}
      <div 
        className={`fixed inset-0 z-[100] transition-opacity duration-500 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        {/* Sfondo Oscurante (Backdrop Overlay) */}
        <div 
          className="absolute inset-0 bg-black/5 backdrop-blur-[4px]" 
          onClick={() => setMenuOpen(false)} 
        />
        
        {/* Pannello Sidebar (Apple Glass) */}
        <div 
          className={`absolute top-0 right-0 w-[85%] sm:w-[400px] h-full bg-white/40 backdrop-blur-[80px] backdrop-saturate-[180%] border-l border-white/60 shadow-[-20px_0_40px_rgba(0,0,0,0.05)] flex flex-col transform transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex items-center justify-between px-8 py-8 border-b border-black/5">
             <span className="text-black font-bold tracking-widest uppercase text-xs">Menu</span>
             <button className="p-2 -mr-2 bg-black/5 hover:bg-black/10 rounded-full text-black transition-colors" onClick={() => setMenuOpen(false)}>
               <X size={20} />
             </button>
          </div>
          
          <div className="flex flex-col flex-1 px-8 py-10 gap-6 overflow-y-auto">
            {navLinks.map((link, i) => (
              <Link 
                key={link} 
                href="#" 
                onClick={() => setMenuOpen(false)}
                className={`text-2xl md:text-3xl tracking-tight font-medium text-black/80 hover:text-black transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center group ${menuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
                style={{ transitionDelay: menuOpen ? `${100 + i * 80}ms` : '0ms' }}
              >
                {link}
                <ArrowRight size={24} className="ml-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* Footer Sidebar */}
          <div className="p-8 border-t border-black/5">
             <button className="w-full py-4 bg-[#0a0a0a] text-white rounded-xl text-sm font-semibold tracking-wide shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_25px_rgba(0,0,0,0.15)] hover:scale-[1.02] transition-all duration-300">
               INIZIA ORA
             </button>
          </div>
        </div>
      </div>
    </main>
  );
}

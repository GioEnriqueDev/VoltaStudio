import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";
import SmoothScroll from "../components/SmoothScroll";
import CustomCursor from "../components/CustomCursor";
import FilmGrain from "../components/FilmGrain";

const interTight = Inter_Tight({ 
  subsets: ["latin"], 
  variable: "--font-inter-tight",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Volta Studio | Agenzia Sviluppo Software, AI & Web Marketing",
  description: "Costruiamo macchine da conversione. Volta Studio unisce sviluppo software full stack, integrazione Intelligenza Artificiale e strategie di Growth Marketing per scalare il tuo business.",
  keywords: ["Agenzia Sviluppo Software", "Web Marketing Agency", "Sviluppo Web Next.js", "Integrazione AI", "Performance Marketing", "Agenzia Digital", "Sviluppo Full Stack"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://db.onlinewebfonts.com/c/d08bafd725a4cfc309efb5a88e0b63a5?family=basis33" rel="stylesheet" />
      </head>
      <body className={`${interTight.variable} font-sans bg-[#E8E8EB]`}>
        <SmoothScroll>
          <FilmGrain />
          <CustomCursor />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}

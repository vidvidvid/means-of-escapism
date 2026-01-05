"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

interface ZineProps {
  pdfUrl: string;
  pageWidth: number;
  pageHeight: number;
  onOpenChange?: (isOpen: boolean) => void;
  onLoad?: () => void;
}

// Dynamically import Zine with SSR disabled (uses DOM APIs)
const Zine = dynamic<ZineProps>(
  () => import("@/components/Zine") as Promise<{ default: ComponentType<ZineProps> }>,
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="relative flex items-center justify-center">
          {/* Small circular glow behind */}
          <div className="absolute w-32 h-32 pointer-events-none">
            <div className="absolute inset-0 bg-white/10 blur-2xl rounded-full animate-glow-1" />
            <div className="absolute inset-0 bg-white/8 blur-2xl rounded-full animate-glow-2" />
            <div className="absolute inset-0 bg-white/5 blur-xl rounded-full animate-glow-3" />
          </div>
          {/* Floating sparkles */}
          <div className="absolute w-24 h-24">
            <div className="absolute top-0 left-1/4 w-1 h-1 bg-white/60 rounded-full animate-sparkle-1" />
            <div className="absolute top-1/3 right-0 w-1.5 h-1.5 bg-white/40 rounded-full animate-sparkle-2" />
            <div className="absolute bottom-1/4 left-0 w-1 h-1 bg-white/50 rounded-full animate-sparkle-3" />
            <div className="absolute bottom-0 right-1/3 w-0.5 h-0.5 bg-white/70 rounded-full animate-sparkle-1" />
            <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-white/30 rounded-full animate-sparkle-2" />
          </div>
          {/* Central glow */}
          <div className="w-16 h-16 rounded-full bg-white/5 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-white/10 animate-ping" />
          </div>
        </div>
        <p className="font-serif italic text-white/30 tracking-widest text-xs">
          ~ summoning ~
        </p>
      </div>
    ),
  }
);

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Zine container */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-8">
        <Zine
          pdfUrl="/zine.pdf"
          pageWidth={500}
          pageHeight={658}
        />
      </div>
    </main>
  );
}

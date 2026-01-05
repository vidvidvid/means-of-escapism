"use client";

import dynamic from "next/dynamic";

// Dynamically import Zine with SSR disabled (uses DOM APIs)
const Zine = dynamic(() => import("@/components/Zine"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center text-white/60">
      Loading...
    </div>
  ),
});

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Zine container */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-8">
        <div className="relative">
          {/* Magical glow behind the book */}
          <div className="absolute -inset-16 pointer-events-none">
            <div className="absolute inset-0 bg-white/15 blur-3xl rounded-full animate-glow-1" />
            <div className="absolute inset-0 bg-white/10 blur-3xl rounded-full animate-glow-2" />
            <div className="absolute inset-0 bg-white/8 blur-2xl rounded-full animate-glow-3" />
          </div>

          <Zine pdfUrl="/zine.pdf" pageWidth={500} pageHeight={658} />
        </div>

        <p className="mt-6 font-serif italic text-white/30 tracking-widest text-xs relative z-10">
          ~ flutter through the pages ~
        </p>
      </div>
    </main>
  );
}

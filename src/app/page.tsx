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
    <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />

      {/* Floating gradient orbs for visual interest */}
      <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-pink-500/20 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />

      {/* Zine container */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-8">
        <Zine pdfUrl="/zine.pdf" pageWidth={500} pageHeight={658} />

        <p className="mt-6 font-serif italic text-white/40 tracking-widest text-xs">
          ~ flutter through the pages ~
        </p>
      </div>
    </main>
  );
}

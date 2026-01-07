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
  { ssr: false }
);

export default function Home() {
  return (
    <main className="relative h-dvh w-full overflow-hidden bg-black">
      {/* Zine container */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center">
        <Zine
          pdfUrl="/zine.pdf"
          pageWidth={500}
          pageHeight={658}
        />
      </div>
    </main>
  );
}

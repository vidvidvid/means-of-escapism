"use client";

import { useEffect, useState } from "react";
import ZineDesktop from "./ZineDesktop";
import ZineMobile from "./ZineMobile";

interface ZineProps {
  pdfUrl: string;
  pageWidth?: number;
  pageHeight?: number;
  onOpenChange?: (isOpen: boolean) => void;
  onLoad?: () => void;
}

export default function Zine({
  pdfUrl,
  pageWidth = 400,
  pageHeight = 550,
  onOpenChange,
  onLoad,
}: ZineProps) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Don't render until we know which version to show
  if (isMobile === null) {
    return null;
  }

  if (isMobile) {
    return (
      <ZineMobile
        pdfUrl={pdfUrl}
        pageWidth={pageWidth}
        pageHeight={pageHeight}
        onLoad={onLoad}
      />
    );
  }

  return (
    <ZineDesktop
      pdfUrl={pdfUrl}
      pageWidth={pageWidth}
      pageHeight={pageHeight}
      onOpenChange={onOpenChange}
      onLoad={onLoad}
    />
  );
}

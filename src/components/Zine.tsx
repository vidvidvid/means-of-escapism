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

// Detect if touch device
function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

// Detect if mobile portrait (single page mode)
function isMobilePortrait(): boolean {
  if (typeof window === "undefined") return false;
  const isTouch = isTouchDevice();
  const isPortrait = window.innerHeight > window.innerWidth;
  const isSmallScreen = Math.min(window.innerWidth, window.innerHeight) < 768;
  return isTouch && isPortrait && isSmallScreen;
}

// Calculate desktop dimensions for landscape mobile
function getLandscapeDimensions(defaultWidth: number, defaultHeight: number) {
  if (typeof window === "undefined") return { width: defaultWidth, height: defaultHeight };
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const aspectRatio = defaultHeight / defaultWidth;

  // Size for height first, ensure 2 pages fit in width
  let height = vh - 40;
  let width = height / aspectRatio;

  if (width * 2 > vw - 32) {
    width = (vw - 32) / 2;
    height = width * aspectRatio;
  }

  return { width: Math.floor(width), height: Math.floor(height) };
}

export default function Zine({
  pdfUrl,
  pageWidth = 400,
  pageHeight = 550,
  onOpenChange,
  onLoad,
}: ZineProps) {
  const [mode, setMode] = useState<"mobile" | "desktop" | "landscape-mobile" | null>(null);
  const [landscapeDims, setLandscapeDims] = useState({ width: pageWidth, height: pageHeight });

  useEffect(() => {
    const updateMode = () => {
      if (isMobilePortrait()) {
        setMode("mobile");
      } else if (isTouchDevice() && Math.min(window.innerWidth, window.innerHeight) < 768) {
        // Landscape on small touch device
        setMode("landscape-mobile");
        setLandscapeDims(getLandscapeDimensions(pageWidth, pageHeight));
      } else {
        setMode("desktop");
      }
    };

    updateMode();
    window.addEventListener("resize", updateMode);
    window.addEventListener("orientationchange", updateMode);
    return () => {
      window.removeEventListener("resize", updateMode);
      window.removeEventListener("orientationchange", updateMode);
    };
  }, [pageWidth, pageHeight]);

  if (mode === null) return null;

  if (mode === "mobile") {
    return (
      <ZineMobile
        pdfUrl={pdfUrl}
        pageWidth={pageWidth}
        pageHeight={pageHeight}
        onLoad={onLoad}
      />
    );
  }

  // Desktop or landscape-mobile both use ZineDesktop
  const dims = mode === "landscape-mobile" ? landscapeDims : { width: pageWidth, height: pageHeight };

  return (
    <ZineDesktop
      pdfUrl={pdfUrl}
      pageWidth={dims.width}
      pageHeight={dims.height}
      onOpenChange={onOpenChange}
      onLoad={onLoad}
    />
  );
}

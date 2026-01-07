"use client";

import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Set up PDF.js worker
// Use local worker for faster loading
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

interface PageProps {
  pageNumber: number;
  width: number;
  height: number;
  onRenderSuccess?: () => void;
}

const ZinePage = forwardRef<HTMLDivElement, PageProps>(
  ({ pageNumber, width, height, onRenderSuccess }, ref) => {
    return (
      <div ref={ref} className="zine-page">
        <Page
          pageNumber={pageNumber}
          width={width}
          height={height}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          loading={null}
          onRenderSuccess={onRenderSuccess}
        />
      </div>
    );
  }
);

ZinePage.displayName = "ZinePage";

interface ZineMobileProps {
  pdfUrl: string;
  pageWidth?: number;
  pageHeight?: number;
  onLoad?: () => void;
}

export default function ZineMobile({
  pdfUrl,
  pageWidth: defaultPageWidth = 400,
  pageHeight: defaultPageHeight = 550,
  onLoad,
}: ZineMobileProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [renderedPages, setRenderedPages] = useState<number>(0);
  const [isVisible, setIsVisible] = useState(false);
  const [dimensions, setDimensions] = useState(() => {
    if (typeof window === "undefined") {
      return { width: defaultPageWidth, height: defaultPageHeight };
    }
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const aspectRatio = defaultPageHeight / defaultPageWidth;

    let width = Math.min(vw - 48, 400);
    let height = width * aspectRatio;
    if (height > vh - 120) {
      height = vh - 120;
      width = height / aspectRatio;
    }
    return { width: Math.floor(width), height: Math.floor(height) };
  });
  const bookRef = useRef<typeof HTMLFlipBook>(null);

  // Loading until all pages are rendered
  const isLoading = numPages === 0 || renderedPages < numPages;

  const onPageRenderSuccess = useCallback(() => {
    setRenderedPages((prev) => prev + 1);
  }, []);

  // Trigger fade-in and onLoad when all pages rendered
  useEffect(() => {
    if (numPages > 0 && renderedPages >= numPages) {
      onLoad?.();
      setTimeout(() => setIsVisible(true), 50);
    }
  }, [numPages, renderedPages, onLoad]);

  // Recalculate dimensions on resize
  useEffect(() => {
    const calculateDimensions = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const aspectRatio = defaultPageHeight / defaultPageWidth;

      let width = Math.min(vw - 48, 400);
      let height = width * aspectRatio;
      if (height > vh - 120) {
        height = vh - 120;
        width = height / aspectRatio;
      }
      setDimensions({ width: Math.floor(width), height: Math.floor(height) });
    };

    window.addEventListener("resize", calculateDimensions);
    return () => window.removeEventListener("resize", calculateDimensions);
  }, [defaultPageWidth, defaultPageHeight]);

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      setNumPages(numPages);
    },
    []
  );

  const pages = Array.from({ length: numPages }, (_, i) => i + 1);

  const loadingSpinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-32 h-32 pointer-events-none">
          <div className="absolute inset-0 bg-white/10 blur-2xl rounded-full animate-glow-1" />
          <div className="absolute inset-0 bg-white/8 blur-2xl rounded-full animate-glow-2" />
          <div className="absolute inset-0 bg-white/5 blur-xl rounded-full animate-glow-3" />
        </div>
        <div className="absolute w-24 h-24">
          <div className="absolute top-0 left-1/4 w-1 h-1 bg-white/60 rounded-full animate-sparkle-1" />
          <div className="absolute top-1/3 right-0 w-1.5 h-1.5 bg-white/40 rounded-full animate-sparkle-2" />
          <div className="absolute bottom-1/4 left-0 w-1 h-1 bg-white/50 rounded-full animate-sparkle-3" />
          <div className="absolute bottom-0 right-1/3 w-0.5 h-0.5 bg-white/70 rounded-full animate-sparkle-1" />
          <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-white/30 rounded-full animate-sparkle-2" />
        </div>
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-white/10 blur-md" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center animate-spin-slow-reverse">
            <svg className="w-10 h-10 opacity-50" viewBox="0 0 100 100" fill="none">
              <path
                d="M50 50 C50 47, 53 47, 53 50 C53 55, 45 55, 45 50 C45 42, 58 42, 58 50 C58 61, 39 61, 39 50 C39 36, 64 36, 64 50 C64 67, 33 67, 33 50 C33 30, 70 30, 70 50"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="absolute inset-0 animate-orbit-1">
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/60 blur-[1px] shadow-[0_0_6px_rgba(255,255,255,0.5)]" />
          </div>
          <div className="absolute inset-[-8px] animate-orbit-2">
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-2 h-2 rounded-full bg-white/40 blur-[1px] shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
          </div>
          <div className="absolute inset-[-16px] animate-orbit-3">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white/50 blur-[0.5px] shadow-[0_0_4px_rgba(255,255,255,0.6)]" />
          </div>
          <div className="absolute inset-[-4px] animate-orbit-reverse">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white/30 blur-[1px]" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-0.5 rounded-full bg-white/20 blur-[0.5px]" />
          </div>
        </div>
      </div>
      <p className="font-serif italic text-white/30 tracking-widest text-xs">
        ~ summoning ~
      </p>
    </div>
  );

  return (
    <>
      {isLoading && loadingSpinner}
      <div
        className="zine-container flex flex-col items-center"
        style={{
          position: isLoading ? "absolute" : "relative",
          visibility: isLoading ? "hidden" : "visible",
          pointerEvents: isLoading ? "none" : "auto",
        }}
      >
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={null}
        >
          {numPages > 0 && (
            <div
              className={`relative transition-opacity ease-in-out ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
              style={{ transitionDuration: "1.5s" }}
            >
              {/* @ts-expect-error - HTMLFlipBook types are incomplete */}
              <HTMLFlipBook
                ref={bookRef}
                width={dimensions.width}
                height={dimensions.height}
                size="fixed"
                minWidth={200}
                maxWidth={400}
                minHeight={280}
                maxHeight={600}
                showCover={true}
                mobileScrollSupport={true}
                drawShadow={true}
                flippingTime={600}
                usePortrait={true}
                startZIndex={0}
                autoSize={false}
                maxShadowOpacity={0.5}
                clickEventForward={true}
                useMouseEvents={true}
                swipeDistance={30}
                showPageCorners={true}
                disableFlipByClick={false}
                className="zine-book"
              >
                {pages.map((pageNum) => (
                  <ZinePage
                    key={pageNum}
                    pageNumber={pageNum}
                    width={dimensions.width}
                    height={dimensions.height}
                    onRenderSuccess={onPageRenderSuccess}
                  />
                ))}
              </HTMLFlipBook>
            </div>
          )}
        </Document>

        <style jsx global>{`
          .zine-page {
            background: transparent;
            overflow: hidden;
          }

          .zine-page canvas {
            display: block;
          }

          .react-pdf__Page {
            display: flex;
            justify-content: center;
            align-items: flex-start;
            background-color: transparent !important;
          }

          .react-pdf__Page__canvas {
            display: block !important;
          }

          .stf__item {
            background: transparent !important;
          }
        `}</style>
      </div>
    </>
  );
}

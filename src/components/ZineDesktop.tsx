"use client";

import { forwardRef, useCallback, useRef, useState } from "react";
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
}

const ZinePage = forwardRef<HTMLDivElement, PageProps>(
  ({ pageNumber, width, height }, ref) => {
    return (
      <div ref={ref} className="zine-page">
        <Page
          pageNumber={pageNumber}
          width={width}
          height={height}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          loading={null}
        />
      </div>
    );
  }
);

ZinePage.displayName = "ZinePage";

interface ZineDesktopProps {
  pdfUrl: string;
  pageWidth?: number;
  pageHeight?: number;
  onOpenChange?: (isOpen: boolean) => void;
  onLoad?: () => void;
}

export default function ZineDesktop({
  pdfUrl,
  pageWidth = 400,
  pageHeight = 550,
  onOpenChange,
  onLoad,
}: ZineDesktopProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const bookRef = useRef<typeof HTMLFlipBook>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastClickX = useRef<number | null>(null);

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      setNumPages(numPages);
      setIsLoading(false);
      onLoad?.();
      // Trigger fade-in after a tiny delay
      setTimeout(() => setIsVisible(true), 50);
    },
    [onLoad]
  );

  const onFlip = useCallback(
    (e: { data: number }) => {
      const newIsOpen = e.data > 0;
      setIsOpen(newIsOpen);
      onOpenChange?.(newIsOpen);
    },
    [onOpenChange]
  );

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const midpoint = rect.width / 2;
      // Store whether click was on left (backward) or right (forward) side
      lastClickX.current = clickX < midpoint ? -1 : 1;
    }
  }, []);

  const onChangeState = useCallback(
    (e: { data: string }) => {
      // "flipping" state means the flip animation just started
      if (e.data === "flipping") {
        // @ts-expect-error - pageFlip types incomplete
        const pageFlip = bookRef.current?.pageFlip();
        const currentPage = pageFlip?.getCurrentPageIndex() ?? 0;
        const clickedLeft = lastClickX.current === -1;

        // Opening: flipping from cover (always forward)
        if (currentPage === 0 && !isOpen) {
          setIsOpen(true);
          onOpenChange?.(true);
        }
        // Closing: on page 1 and clicked left side (going backward to cover)
        else if (currentPage === 1 && isOpen && clickedLeft) {
          setIsOpen(false);
          onOpenChange?.(false);
        }

        // Reset click tracking
        lastClickX.current = null;
      }
    },
    [onOpenChange, isOpen]
  );

  // Create array of page numbers
  const pages = Array.from({ length: numPages }, (_, i) => i + 1);

  const loadingSpinner = (
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
        {/* Fairycore orbiting sparkles */}
        <div className="relative w-20 h-20">
          {/* Soft center glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-white/10 blur-md" />
          </div>
          {/* Simple spinning spiral */}
          <div className="absolute inset-0 flex items-center justify-center animate-spin-slow-reverse">
            <svg
              className="w-10 h-10 opacity-50"
              viewBox="0 0 100 100"
              fill="none"
            >
              <path
                d="M50 50 C50 47, 53 47, 53 50 C53 55, 45 55, 45 50 C45 42, 58 42, 58 50 C58 61, 39 61, 39 50 C39 36, 64 36, 64 50 C64 67, 33 67, 33 50 C33 30, 70 30, 70 50"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          {/* Inner orbit - fast */}
          <div className="absolute inset-0 animate-orbit-1">
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/60 blur-[1px] shadow-[0_0_6px_rgba(255,255,255,0.5)]" />
          </div>
          {/* Middle orbit - medium */}
          <div className="absolute inset-[-8px] animate-orbit-2">
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-2 h-2 rounded-full bg-white/40 blur-[1px] shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
          </div>
          {/* Outer orbit - slow */}
          <div className="absolute inset-[-16px] animate-orbit-3">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white/50 blur-[0.5px] shadow-[0_0_4px_rgba(255,255,255,0.6)]" />
          </div>
          {/* Counter-rotating ring */}
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
        className={`zine-container flex flex-col items-center transition-transform duration-700 ease-out ${isLoading ? "hidden" : ""}`}
        style={{
          transform: isOpen ? "translateX(0)" : `translateX(-${pageWidth / 2}px)`,
        }}
      >
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={null}
        >
        {!isLoading && numPages > 0 && (
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            className={`relative transition-opacity ease-in-out ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDuration: "1.5s" }}
          >
          {/* Glow around the book */}
          <div
            className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
              isOpen ? "opacity-100" : "opacity-0"
            }`}
            style={{ margin: "-20px", padding: "20px" }}
          >
            <div className="absolute inset-0 bg-white/15 blur-2xl rounded-3xl animate-glow-1" />
            <div className="absolute inset-0 bg-white/10 blur-xl rounded-3xl animate-glow-2" />
          </div>
          {/* @ts-expect-error - HTMLFlipBook types are incomplete */}
          <HTMLFlipBook
            ref={bookRef}
            width={pageWidth}
            height={pageHeight}
            size="fixed"
            minWidth={300}
            maxWidth={500}
            minHeight={400}
            maxHeight={700}
            showCover={true}
            mobileScrollSupport={true}
            drawShadow={true}
            flippingTime={800}
            usePortrait={false}
            startZIndex={0}
            autoSize={false}
            maxShadowOpacity={0.5}
            clickEventForward={true}
            useMouseEvents={true}
            swipeDistance={30}
            showPageCorners={true}
            disableFlipByClick={false}
            className="zine-book"
            onFlip={onFlip}
            onChangeState={onChangeState}
          >
            {pages.map((pageNum) => (
              <ZinePage
                key={pageNum}
                pageNumber={pageNum}
                width={pageWidth}
                height={pageHeight}
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

        /* Right-side pages (odd: 1st/cover, 3rd, 5th...) - round right corners */
        .stf__item:nth-child(odd) {
          border-radius: 0 8px 8px 0;
        }
        .stf__item:nth-child(odd) .zine-page,
        .stf__item:nth-child(odd) .zine-page canvas,
        .stf__item:nth-child(odd) .react-pdf__Page__canvas {
          border-radius: 0 8px 8px 0;
        }

        /* Left-side pages (even: 2nd, 4th, 6th...) - round left corners */
        .stf__item:nth-child(even) {
          border-radius: 8px 0 0 8px;
        }
        .stf__item:nth-child(even) .zine-page,
        .stf__item:nth-child(even) .zine-page canvas,
        .stf__item:nth-child(even) .react-pdf__Page__canvas {
          border-radius: 8px 0 0 8px;
        }
      `}</style>
      </div>
    </>
  );
}

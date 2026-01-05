"use client";

import { forwardRef, useCallback, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

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
  const [numPages, setNumPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const bookRef = useRef<typeof HTMLFlipBook>(null);

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

  const onChangeState = useCallback(
    (e: { data: string }) => {
      // "flipping" state means the flip animation just started
      if (e.data === "flipping") {
        // @ts-expect-error - pageFlip types incomplete
        const pageFlip = bookRef.current?.pageFlip();
        const currentPage = pageFlip?.getCurrentPageIndex() ?? 0;

        // Only trigger open animation when flipping from cover
        if (currentPage === 0 && !isOpen) {
          setIsOpen(true);
          onOpenChange?.(true);
        }
      }
    },
    [onOpenChange, isOpen]
  );

  // Create array of page numbers
  const pages = Array.from({ length: numPages }, (_, i) => i + 1);

  return (
    <div
      className={`zine-container flex flex-col items-center transition-transform duration-700 ease-out ${
        isOpen ? "translate-x-0" : "-translate-x-[250px]"
      }`}
    >
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={null}
      >
        {!isLoading && numPages > 0 && (
          <div
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
      `}</style>
    </div>
  );
}

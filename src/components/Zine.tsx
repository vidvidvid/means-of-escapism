"use client";

import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
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
}

export default function Zine({
  pdfUrl,
  pageWidth = 400,
  pageHeight = 550,
}: ZineProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const bookRef = useRef<typeof HTMLFlipBook>(null);

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      setNumPages(numPages);
      setIsLoading(false);
    },
    []
  );

  // Create array of page numbers
  const pages = Array.from({ length: numPages }, (_, i) => i + 1);

  return (
    <div className="zine-container">
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={
          <div className="flex items-center justify-center text-white/60">
            Loading zine...
          </div>
        }
      >
        {!isLoading && numPages > 0 && (
          // @ts-expect-error - HTMLFlipBook types are incomplete
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

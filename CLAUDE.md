# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Means of Escapism" is a zine viewer web application that displays PDF documents as an interactive flipbook with page-turning animations.

## Commands

- `npm run dev` - Start development server at http://localhost:3000
- `npm run build` - Production build
- `npm run lint` - Run ESLint

## Architecture

**Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4

**Key Libraries:**
- `react-pageflip` - Provides the HTMLFlipBook component for page-turning animations
- `react-pdf` - Renders PDF pages as React components using PDF.js

**Structure:**
```
src/
  app/
    page.tsx      # Main page - dynamically imports Zine component (SSR disabled)
    layout.tsx    # Root layout with Geist fonts
    globals.css   # Tailwind + custom keyframe animations for glow/sparkle effects
  components/
    Zine.tsx      # Core flipbook viewer component
public/
  zine.pdf        # The PDF being displayed
```

**Zine Component (`src/components/Zine.tsx`):**
- Must be client-side only (uses DOM APIs from react-pdf)
- Dynamically imported in page.tsx with `ssr: false`
- Uses PDF.js worker from unpkg CDN
- Tracks open/closed state to animate the book container position (shifts left when closed so cover is centered)
- Custom loading spinner with orbiting sparkle animations

**Path alias:** `@/*` maps to `./src/*`

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2026-03-26

### Added
- Expanded `data/models.json` with Diffusion (Flux.1, SDXL, Playground) and Audio (Whisper, SeamlessM4T, Stable Audio Open) models.
- Implemented "Model Telemetry Control Deck" in `app/compare/page.tsx` for dynamic category and model selection.
- Enhanced `app/compare/page.tsx` with dynamic Recharts integration, automatically adjusting benchmark axes and radar comparisons based on the selected model category.

## [0.2.0] - 2026-03-24

### Added
- Created central `data/models.json` acting as an open contribution database for models and benchmarks.
- Created `Sidebar` component for structural and persistent left-side navigation featuring paths for LLM, Diffusion, Audio, Leaderboard, and Compare.
- Restructured `app/layout.tsx` to include the global sidebar in a 12-column kinetic grid layout, fixing scrolling within main content bounds.
- Hooked `app/page.tsx` up to the `models.json` data source.
- Built new `app/compare/page.tsx` integrating `recharts` to render visual comparative telemetry arrays (Bar Chart & Radar Chart) between top open source LLMs.
- Built new `app/leaderboard/page.tsx` displaying a live ranking table sorted dynamically by MMLU capabilities.

## [0.1.0] - 2026-03-24

### Added
- Initialized "The Kinetic Mainframe" design system based on `DESIGN.md`.
- Configured deep charcoal (`surface`), Cyber Lime (`primary`), and Electric Amber (`secondary`) color palette via CSS variables using Tailwind 4 native variables.
- Configured font hierarchy using Google Fonts:
  - Space Grotesk for Display & Headlines
  - Public Sans for Body & Metadata
  - JetBrains Mono for Data Streams & Terminals
- Built `RootLayout` adding CSS scanline overlay and rigid structural framing logic.
- Implemented `Home` page introducing the staggered boot sequence animation.
- Created `ModelCard` component simulating tactical UI readout arrays using tonal layers and inner bloom shadows.
- Added `lucide-react` dependency for tech-forward iconography.

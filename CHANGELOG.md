# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.8.0] - 2026-03-29

### Added
- **HuggingFace leaderboard integration:** New `scripts/fetch-hf-leaderboard.ts` fetches real evaluation results from the HuggingFace Open LLM Leaderboard v2 dataset (`open-llm-leaderboard/results`). Covers 15 major organizations and 200+ models.
- **43 real LLM entries:** Replaced manually-estimated benchmark values with verified evaluations from 43 curated open-source LLMs across all major families (Qwen, Llama, Mistral, Gemma, Phi, Falcon, Yi, InternLM, DeepSeek distills, Command R, Hermes, Tulu).
- **LLM benchmark suite upgrade (v1 → v2):** Replaced MMLU/HumanEval/GSM8K/MATH with the HF Leaderboard v2 suite — BBH, GPQA, MATH Hard, MuSR, IFEval, MMLU-Pro. These are harder and better discriminate modern model capabilities.
- **Merge script:** `scripts/merge-hf-models.ts` for curating and writing the leaderboard data into `models.json` with proper metadata overrides.

### Changed
- **Leaderboard page:** LLM columns now show MMLU-Pro, BBH, GPQA, MATH, IFEval, MuSR. Default sort by MMLU-Pro.
- **Home page card:** MMLU metric replaced with MMLU-Pro.

## [0.7.0] - 2026-03-29

### Added
- **Model detail page:** New dynamic route `/models/[category]/[id]` with full model profiles — metadata grid, benchmark readout cards with rank/avg/best, normalized radar chart, category standing bar chart, and peer comparison table.
- **Clickable model cards:** All listing pages (LLM, Diffusion, Audio) and leaderboard now link to model detail pages.
- **Shared benchmark metadata:** Centralized `lib/benchmarks.ts` with descriptions, units, and lowerIsBetter flags — used across compare, leaderboard, and detail pages.

### Fixed
- **Benchmark tooltips:** Rewrote `BenchmarkTooltip` as a portal-based client component using `createPortal` to `document.body`. Tooltips now render above all overflow containers and are visible in the leaderboard table.

## [0.6.0] - 2026-03-29

### Added
- **Expanded LLM database:** Added 15 new models — DeepSeek-R1, DeepSeek-V2, Qwen2.5 72B, Qwen2.5 7B, Llama 3.3 70B, Llama 3.2 90B, Gemma 2 9B, InternLM2.5 20B, Mixtral 8x7B, Mistral 7B v0.3, Command R, OLMo 2 7B, Phi-3.5 Mini, StarCoder2 15B, Falcon 40B. LLM total is now 26 models.
- **Expanded diffusion database:** Added 13 new models — HiDream-I1 Full, CogView3-Plus, PixArt-α, SD 3 Medium, SD 2.1, SD 1.5, Würstchen v2, InstaFlow 0.9B, Lumina-T2X, OmniGen v1, Kandinsky 3.0, Dreamshaper XL, RealVisXL v4.0, Juggernaut XL. Diffusion total is now 21 models.
- **Expanded audio database:** Added 13 new models — Parakeet TDT 1.1B, Whisper Large v2, Whisper Medium, Whisper Small, HuBERT Large, SpeechT5, XTTS v2, MusicGen Large, Vocos, WhisperX, NeMo FastConformer, Moonshine Base, EnCodec. Audio total is now 20 models.

## [0.5.0] - 2026-03-29

### Added
- **Compare page — multi-node selection:** Users can now compare up to 5 models simultaneously. The Control Deck has a dynamic node list with `+ ADD NODE` / `✕ REMOVE` controls. Node dropdowns are color-coded (Cyber Lime, Amber, Blue, Pink, Purple).
- **Compare page — adaptive charts:** Both the Bar Chart and Radar Chart now filter to only the selected models. Bar chart groups by benchmark (X axis) with one bar per selected model for clear cross-model comparison.
- **Leaderboard — category tabs:** Three tabs (LLM / Diffusion / Audio) filter the leaderboard table. Columns adapt per category (MMLU/HumanEval/GSM8K/Math for LLM, FID/CLIP/Speed for Diffusion, WER/Latency/Multilingual for Audio).
- **Benchmark tooltips:** New `BenchmarkTooltip` component wraps any benchmark label with an `ⓘ` icon. Hovering shows a glassmorphism card with a plain-English definition and a "▼ Lower is better" tag where applicable.
- **Expanded model database:** 11 LLM models (added DeepSeek-V3, Llama 3.1 405B, Mistral Large 2, Phi-4, Falcon 180B, Yi-34B, Gemma 2 27B, Qwen 1.5 72B, Mixtral 8x22B, Command R+), 7 diffusion models (added FLUX.1 [dev], SD 3.5 Large, Kolors, PixArt-Σ, SDXL 1.0, Playground v2.5), 7 audio models (added Distil-Whisper, Wav2Vec 2.0 Large, Whisper v3, SeamlessM4T v2, MMS, Bark, Stable Audio Open).
- **Null benchmark handling:** Missing benchmarks render as `—` in the leaderboard and sort to the bottom.

## [0.4.0] - 2026-03-28

### Fixed
- **Homepage search**: Converted `app/page.tsx` to a client component and wired up the search input with `useState` + live filtering across model name, architecture, creator, and description. Also updated the model count badge to reflect filtered results.
- **Diffusion page**: Created `app/diffusion/page.tsx` — was missing entirely, causing a 404 with a white-background error page.
- **Audio page**: Created `app/audio/page.tsx` — was missing entirely, same issue as diffusion.
- **Compare page select boxes**: Replaced full-border `<select>` styling with bottom-border-only `appearance-none` selects prefixed with the terminal `>` prompt, matching the Kinetic Mainframe design system's "Terminal Command" input spec.

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

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->
- Always use Context7 when I need library/API documentation, code generation, setup or configuration steps without me having to explicitly ask.
- Always use Typescript and strongly type everything
- This project is using TailwindCSS 4 and NextJS 16
- We're using yarn for this project
- This project is a website called OpenModels where we list Open Source AI Models including LLM, Diffusion Models, their benchmark, details, also where to get them. Think of it as a directory for open source models.
- We should always include CHANGELOG.md with major or minor version that you judge yourself whenever you make changes so we know what has changed. Think of it as a diary where you summarise your change
- We have DESIGN.md that act as our "Design system", please follow the design accordingly and create components when needed

---

## Codebase Map

### Tech Stack
- **Framework:** Next.js 16 (App Router) with Turbopack
- **Language:** TypeScript (strict)
- **Styling:** TailwindCSS 4 with CSS variables
- **Package manager:** Yarn 4
- **Charts:** Recharts
- **Icons:** lucide-react
- **Fonts:** Space Grotesk (display), Public Sans (body), JetBrains Mono (data/terminal)

### Directory Structure

```
/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout — Sidebar + 12-col grid, scanline overlay, font vars
│   ├── globals.css             # Tailwind imports, CSS variables (design tokens), keyframe animations
│   ├── page.tsx                # LLM index — searchable model list, ModelCard components (client)
│   ├── diffusion/page.tsx      # Diffusion model listing — DiffusionModelCard
│   ├── audio/page.tsx          # Audio model listing — AudioModelCard
│   ├── leaderboard/page.tsx    # Multi-tab leaderboard table (LLM/Diffusion/Audio) with sort (client)
│   ├── compare/page.tsx        # Side-by-side comparison — up to 5 models, bar + radar charts (client)
│   └── models/[category]/[id]/page.tsx  # Model detail page — metadata grid, benchmark cards, radar, bar, peer table
│
├── components/
│   ├── Sidebar.tsx             # Persistent left nav with active-state highlighting (client, uses usePathname)
│   └── BenchmarkTooltip.tsx    # Hover tooltip via createPortal to document.body — avoids overflow clipping
│
├── lib/
│   └── benchmarks.ts           # Shared benchmark metadata: keys, labels, units, descriptions, lowerIsBetter
│                               # Also exports: Category type, categoryBenchmarks, categoryLabels
│
├── data/
│   ├── models.json             # Primary data source — all model entries (LLM/Diffusion/Audio)
│   └── hf-fetched-models.json  # Raw output from fetch-hf-leaderboard.ts (intermediate, not imported by app)
│
└── scripts/
    ├── fetch-hf-leaderboard.ts  # Fetches real benchmarks from HF Open LLM Leaderboard v2 dataset
    └── merge-hf-models.ts       # Curates + merges fetched data into models.json (run after fetch)
```

---

### data/models.json — Schema

Every model entry shares this base shape:

```ts
{
  id: string;           // URL-safe slug, e.g. "meta-llama-llama-3-3-70b-instruct"
  huggingFaceId: string; // HuggingFace repo path, e.g. "meta-llama/Llama-3.3-70B-Instruct"
  name: string;         // Display name
  architecture: string; // e.g. "Transformer", "MoE", "Flow-based Transformer"
  description: string;
  creator: string;
  releaseDate: string;  // YYYY-MM-DD
  params: string;       // e.g. "70B", "12B"
  benchmarks: { ... }   // Keys depend on category (see lib/benchmarks.ts)
}
```

LLM entries also have:
- `context: string` — context window size, e.g. `"128k"`

LLM benchmarks: `bbh`, `gpqa`, `mathHard`, `musr`, `ifeval`, `mmluPro` (all `number | null`, percentage)
Diffusion benchmarks: `fid` (lower=better), `clipScore`, `genSpeed`
Audio benchmarks: `wer` (lower=better), `latency` (lower=better), `multilingual`

---

### Model Inventory (v0.9.0)

**LLM — 43 models** (sorted by MMLU-Pro descending in models.json):

| ID | Name | Creator |
|----|------|---------|
| qwen-qwen2-5-72b | Qwen2.5 72B | Alibaba Cloud |
| qwen-qwq-32b-preview | QwQ 32B Preview | Alibaba Cloud |
| qwen-qwen2-5-32b-instruct | Qwen2.5 32B Instruct | Alibaba Cloud |
| qwen-qwen2-5-72b-instruct | Qwen2.5 72B Instruct | Alibaba Cloud |
| mistralai-mistral-large-instruct-2411 | Mistral Large 2411 | Mistral AI |
| mistralai-mistral-small-24b-base-2501 | Mistral Small 24B | Mistral AI |
| qwen-qwen2-72b-instruct | Qwen2 72B Instruct | Alibaba Cloud |
| meta-llama-llama-3-3-70b-instruct | Llama 3.3 70B Instruct | Meta |
| meta-llama-llama-3-1-70b-instruct | Llama 3.1 70B Instruct | Meta |
| microsoft-phi-4 | Phi-4 | Microsoft |
| meta-llama-meta-llama-3-70b-instruct | Llama 3 70B Instruct | Meta |
| qwen-qwen2-5-14b-instruct | Qwen2.5 14B Instruct | Alibaba Cloud |
| deepseek-ai-deepseek-r1-distill-llama-70b | DeepSeek R1 Distill Llama 70B | DeepSeek |
| nousresearch-hermes-3-llama-3-1-70b | Hermes 3 Llama 3.1 70B | Nous Research |
| deepseek-ai-deepseek-r1-distill-qwen-32b | DeepSeek R1 Distill Qwen 32B | DeepSeek |
| microsoft-phi-3-medium-4k-instruct | Phi-3 Medium 14B | Microsoft |
| deepseek-ai-deepseek-r1-distill-qwen-14b | DeepSeek R1 Distill Qwen 14B | DeepSeek |
| microsoft-phi-3-5-moe-instruct | Phi-3.5 MoE Instruct | Microsoft |
| meta-llama-llama-3-1-70b | Llama 3.1 70B | Meta |
| allenai-llama-3-1-tulu-3-70b | Tulu 3 70B | Allen AI |
| 01-ai-yi-1-5-34b-chat | Yi-1.5 34B Chat | 01.AI |
| mistralai-mixtral-8x22b-instruct-v0-1 | Mixtral 8×22B Instruct | Mistral AI |
| google-gemma-2-27b-it | Gemma 2 27B IT | Google |
| tiiuae-falcon3-10b-instruct | Falcon3 10B Instruct | TII |
| cohereforai-c4ai-command-r-plus-08-2024 | Command R+ (Aug 2024) | Cohere |
| google-gemma-2-27b | Gemma 2 27B | Google |
| qwen-qwen2-5-7b-instruct | Qwen2.5 7B Instruct | Alibaba Cloud |
| google-gemma-2-9b | Gemma 2 9B | Google |
| tiiuae-falcon3-7b-instruct | Falcon3 7B Instruct | TII |
| microsoft-phi-3-mini-4k-instruct | Phi-3 Mini 3.8B | Microsoft |
| internlm-internlm2-5-20b-chat | InternLM2.5 20B Chat | InternLM |
| 01-ai-yi-1-5-9b-chat | Yi-1.5 9B Chat | 01.AI |
| deepseek-ai-deepseek-llm-67b-chat | DeepSeek LLM 67B Chat | DeepSeek |
| google-gemma-2-9b-it | Gemma 2 9B IT | Google |
| qwen-qwen2-7b-instruct | Qwen2 7B Instruct | Alibaba Cloud |
| meta-llama-llama-3-1-8b-instruct | Llama 3.1 8B Instruct | Meta |
| internlm-internlm2-5-7b-chat | InternLM2.5 7B Chat | InternLM |
| mistralai-mixtral-8x7b-instruct-v0-1 | Mixtral 8×7B Instruct | Mistral AI |
| meta-llama-meta-llama-3-8b-instruct | Llama 3 8B Instruct | Meta |
| mistralai-mistral-nemo-instruct-2407 | Mistral NeMo 12B | Mistral AI |
| meta-llama-llama-3-2-3b-instruct | Llama 3.2 3B Instruct | Meta |
| nousresearch-hermes-3-llama-3-1-8b | Hermes 3 Llama 3.1 8B | Nous Research |
| mistralai-mistral-7b-instruct-v0-3 | Mistral 7B Instruct v0.3 | Mistral AI |

**Diffusion — 21 models:**

| ID | Name | Creator |
|----|------|---------|
| flux-1-schnell | FLUX.1 [schnell] | Black Forest Labs |
| flux-1-dev | FLUX.1 [dev] | Black Forest Labs |
| hidream-i1-full | HiDream-I1 Full | HiDream AI |
| sd-3.5-large | Stable Diffusion 3.5 Large | Stability AI |
| playground-v2.5 | Playground v2.5 | Playground AI |
| kolors | Kolors | Kwai-Kolors |
| sdxl-1.0 | SDXL 1.0 | Stability AI |
| cogview3-plus | CogView3-Plus | Zhipu AI |
| pixart-sigma | PixArt-Σ | PixArt-alpha |
| pixart-alpha | PixArt-α | PixArt-alpha |
| sd-3-medium | Stable Diffusion 3 Medium | Stability AI |
| sd-2.1 | Stable Diffusion 2.1 | Stability AI |
| sd-1.5 | Stable Diffusion 1.5 | Stability AI |
| wuerstchen-v2 | Würstchen v2 | Hugging Face |
| instaflow-0.9b | InstaFlow 0.9B | NUS / CMU |
| lumina-t2x | Lumina-T2X | Alpha-VLLM |
| omnigen-v1 | OmniGen v1 | PKU |
| kandinsky-3 | Kandinsky 3.0 | Sber AI |
| dreamshaper-xl | Dreamshaper XL | Lykon |
| realvisxl-v4 | RealVisXL v4.0 | SG161222 |
| juggernaut-xl | Juggernaut XL | RunDiffusion |

**Audio — 20 models:**

| ID | Name | Creator |
|----|------|---------|
| distil-whisper | Distil-Whisper | HuggingFace |
| parakeet-tdt-1.1b | Parakeet TDT 1.1B | NVIDIA |
| whisper-large-v3 | Whisper v3 | OpenAI |
| whisper-large-v2 | Whisper Large v2 | OpenAI |
| whisper-medium | Whisper Medium | OpenAI |
| whisper-small | Whisper Small | OpenAI |
| seamless-m4t-v2 | SeamlessM4T v2 | Meta |
| wav2vec2-large | Wav2Vec 2.0 Large | Meta |
| mms | MMS | Meta |
| hubert-large | HuBERT Large | Meta |
| speecht5 | SpeechT5 | Microsoft |
| xtts-v2 | XTTS v2 | Coqui AI |
| musicgen-large | MusicGen Large | Meta |
| bark | Bark | Suno AI |
| stable-audio-open | Stable Audio Open | Stability AI |
| vocos | Vocos | Hubert Siuzdak |
| whisperx | WhisperX | m-bain |
| nemo-fastconformer | NeMo FastConformer | NVIDIA |
| moonshine-base | Moonshine Base | Useful Sensors |
| encodec | EnCodec | Meta |

> **Note:** `whisperx` has no dedicated HuggingFace model page (it is a Python toolkit). Its `huggingFaceId` is intentionally omitted in models.json — the UI suppresses the HF link for entries without `huggingFaceId`.

---

### Key Patterns & Conventions

**Routing:**
- `/` → LLM index
- `/diffusion`, `/audio` → category listing pages
- `/leaderboard` → multi-category sortable table
- `/compare` → multi-model comparison charts
- `/models/[category]/[id]` → individual model detail (dynamic, server-rendered)

**Data flow:**
`data/models.json` is imported directly by pages at build time (static JSON import). No API layer. To add or update models, edit models.json directly or run the HF fetch + merge scripts.

**Adding a new model:**
1. Add an entry to the correct array (`llm`, `diffusion`, or `audio`) in `data/models.json`.
2. Include `huggingFaceId` (the `org/repo` string from HuggingFace) so the HF link renders.
3. For LLMs: run `npx tsx scripts/fetch-hf-leaderboard.ts` then `npx tsx scripts/merge-hf-models.ts` to pull real benchmark data. Or add benchmarks manually.

**Model card / listing pattern:**
All three listing pages (`page.tsx`, `diffusion/page.tsx`, `audio/page.tsx`) use the **stretched-link pattern**: the card is a `<div>` with `position: relative`, an absolutely-positioned `<Link>` (`z-0`) covers the entire card, and the HF external link badge sits at `z-10 pointer-events-auto`. This avoids invalid nested `<a>` elements while allowing two distinct click targets.

**HuggingFace links:**
- Stored as `huggingFaceId` in models.json (e.g. `"Qwen/Qwen2.5-72B"`)
- URL constructed at render: `` `https://huggingface.co/${model.huggingFaceId}` ``
- Rendered in listing cards (small "HF" badge) and model detail header ("HuggingFace" button)
- If `huggingFaceId` is absent, the link is simply not rendered

**BenchmarkTooltip:**
Use `<BenchmarkTooltip label="..." description="..." lowerIsBetter={bool} />` anywhere a benchmark label appears. Tooltip renders via `createPortal` to `document.body` to escape overflow containers (critical for the leaderboard table).

**Scripts (run with `npx tsx`):**
- `scripts/fetch-hf-leaderboard.ts` — fetches from `open-llm-leaderboard/results` HF dataset, outputs `data/hf-fetched-models.json`
- `scripts/merge-hf-models.ts` — filters to `CURATED_IDS`, applies `OVERRIDES`, sorts by MMLU-Pro, writes back to `data/models.json` (preserves diffusion + audio sections)
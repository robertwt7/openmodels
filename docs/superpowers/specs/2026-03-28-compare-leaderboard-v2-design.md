# Design Spec: Compare & Leaderboard V2

**Date:** 2026-03-28

## 1. Objective

Improve the Compare and Leaderboard pages with multi-model comparison (up to 5), adaptive charts, category-aware leaderboard tabs, expanded model data, and inline benchmark education via tooltips.

---

## 2. Compare Page Redesign

### 2.1 Control Deck

Replace the fixed 3-column grid with a two-row layout inside the same `bg-surface-lowest border border-outline-variant/20` container:

- **Row 1:** Category selector only (same terminal `>` prefixed bottom-border style).
- **Row 2:** Dynamic node list. Starts with 2 nodes (Alpha, Beta). Each node is a labeled `>` prefixed dropdown. An `+ ADD NODE` ghost button appends new nodes up to a max of 5. Each node beyond the first two has an `✕ REMOVE` action to its right.

**Node naming:** Alpha, Beta, Gamma, Delta, Epsilon (in order).

**State:**
- `activeCategory: "llm" | "diffusion" | "audio"` — resets all selected model IDs when changed.
- `selectedModelIds: string[]` — starts as `[models[0].id, models[1].id]`, min 1, max 5.

### 2.2 Charts

Both charts filter to **only the selected models** (no more showing all models in the bar chart while only showing 2 in the radar).

**Bar Chart ("Benchmark Array"):**
- One bar group per benchmark key.
- One `<Bar>` per selected model, each a different color from the `colors` palette.
- `dataKey` on each `<Bar>` is the model name; `data` is reshaped to `[{ subject: "mmlu", [modelA.name]: 82, [modelB.name]: 77, ... }, ...]`.

**Radar Chart ("Node Comparison"):**
- One `<Radar>` per selected model.
- Works exactly as today but dynamically maps over `selectedModels` instead of hardcoded `modelA`/`modelB`.

### 2.3 Benchmark Tooltips

A reusable `<BenchmarkTooltip label={string} description={string} lowerIsBetter={boolean} />` client component:
- Renders the label + an inline `ⓘ` icon in `text-gray-500`.
- On hover: absolute-positioned card with `bg-surface-highest backdrop-blur-sm border border-outline-variant/30 shadow-[0_0_20px_rgba(0,0,0,0.5)]`.
- Card contains: benchmark name in `text-primary font-mono uppercase text-xs`, one-sentence definition in `text-gray-400 text-xs`, and optionally an amber `▼ LOWER IS BETTER` tag.

**Definitions:**

| Benchmark | Definition | Lower is better |
|-----------|-----------|----------------|
| MMLU | Massive Multitask Language Understanding — tests general knowledge across 57 subjects | No |
| HumanEval | Code generation accuracy on 164 hand-written Python problems | No |
| GSM8K | Grade-school math word problems requiring multi-step reasoning | No |
| Math | Competition-level math problems from AMC/AIME | No |
| FID | Fréchet Inception Distance — measures realism of generated images vs real images | Yes |
| CLIP Score | Alignment between generated image and text prompt (CLIP embedding cosine similarity) | No |
| Gen Speed | Images generated per second at standard resolution | No |
| WER | Word Error Rate — percentage of words transcribed incorrectly | Yes |
| Latency | Seconds from audio start to first decoded token | Yes |
| Multilingual | Percentage of tested languages with acceptable WER | No |

Used in: compare page chart headers and leaderboard table column headers.

---

## 3. Leaderboard Multi-Category

### 3.1 Tab Bar

Three tabs at the top of the leaderboard page: `LLM` / `DIFFUSION` / `AUDIO`.

**Tab styling:**
- Inactive: `text-gray-400 font-mono text-xs uppercase tracking-widest border-b-2 border-transparent px-4 py-2 hover:text-white transition-colors`
- Active: `text-primary border-b-2 border-primary shadow-[0_2px_8px_rgba(223,255,0,0.2)]`

Tab bar container: `border-b border-outline-variant/20 flex gap-0 mb-8`

**State:** `activeCategory: "llm" | "diffusion" | "audio"` — client component.

### 3.2 Adaptive Table Columns

| Category | Columns (sort key marked ↓) |
|----------|----------------------------|
| LLM | Rank, Model, Params, MMLU ↓, HumanEval, GSM8K, Math |
| Diffusion | Rank, Model, Params, FID ↓, CLIP Score, Gen Speed |
| Audio | Rank, Model, Params, WER ↓, Latency, Multilingual |

Sort is always descending by primary benchmark, except FID and WER where lower is better (sort ascending).

Column headers use `<BenchmarkTooltip>` for benchmark columns.

### 3.3 Null Handling

Models missing a benchmark field render `—` in `text-gray-600`. Null values sort to the bottom.

---

## 4. Data Expansion

Target: ~8–10 models per category. All values sourced from published papers or public leaderboards. Missing benchmarks use `null`.

### 4.1 LLM Additions (to existing 5)
- DeepSeek-V3 (671B MoE, DeepSeek, 2024-12-26)
- Llama 3.1 405B (405B, Meta, 2024-07-23)
- Mistral Large 2 (123B, Mistral AI, 2024-07-24)
- Phi-4 (14B, Microsoft, 2024-12-12)
- Falcon 180B (180B, TII, 2023-09-06)
- Yi-34B (34B, 01.AI, 2023-11-06)

### 4.2 Diffusion Additions (to existing 3)
- Stable Diffusion 3.5 Large (8B, Stability AI, 2024-10-22)
- FLUX.1 [dev] (12B, Black Forest Labs, 2024-08-01)
- Kolors (Kwai-Kolors, 2024-07-06)
- PixArt-Σ (0.6B, PixArt-alpha, 2024-03-20)

### 4.3 Audio Additions (to existing 3)
- MMS (Meta, 2023-05-22) — speech-to-text, 1000+ languages
- Bark (Suno AI, 2023-04-20) — text-to-audio synthesis
- Wav2Vec 2.0 Large (317M, Meta, 2020-09-17)
- Distil-Whisper (756M, HuggingFace, 2023-11-01)

---

## 5. Component Architecture

```
components/
  BenchmarkTooltip.tsx   — reusable tooltip wrapping any benchmark label
app/
  leaderboard/page.tsx   — convert to "use client", add tabs + adaptive columns
  compare/page.tsx       — redesign control deck + multi-model chart logic
data/
  models.json            — expand with new models
```

No new pages needed. `BenchmarkTooltip` is the only new component.

---

## 6. Verification Plan

- Switching category on compare page resets all nodes to first 2 models of new category
- Adding 5 nodes hides the `+ ADD NODE` button
- Removing a node updates both charts immediately
- Leaderboard tabs switch table data and column headers
- Tooltip appears on hover of `ⓘ` icon, disappears on mouse leave
- Null benchmark values render `—` and sort to bottom

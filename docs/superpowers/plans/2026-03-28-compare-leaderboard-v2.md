# Compare & Leaderboard V2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the Compare page to support up to 5 selectable models with adaptive charts, upgrade the Leaderboard to support LLM/Diffusion/Audio tabs, expand model data, and add benchmark tooltips.

**Architecture:** A new `BenchmarkTooltip` component wraps benchmark labels site-wide. The compare page replaces fixed `modelAId`/`modelBId` state with a `selectedModelIds` array. The leaderboard converts to a client component with tab-driven category state and a column config map.

**Tech Stack:** Next.js 16 App Router, React, TypeScript, TailwindCSS 4, Recharts, Lucide React

---

## File Map

| Action | File | Responsibility |
|--------|------|---------------|
| Modify | `data/models.json` | Add 6 LLM, 4 Diffusion, 4 Audio models |
| Create | `components/BenchmarkTooltip.tsx` | Reusable hover tooltip for benchmark labels |
| Modify | `app/compare/page.tsx` | Multi-node control deck + adaptive charts |
| Modify | `app/leaderboard/page.tsx` | Category tabs + adaptive columns |
| Modify | `CHANGELOG.md` | Document v0.5.0 |

---

## Task 1: Expand models.json

**Files:**
- Modify: `data/models.json`

- [ ] **Step 1: Replace `data/models.json` with expanded dataset**

```json
{
  "llm": [
    {
      "id": "llama-3.1-405b",
      "name": "Llama 3.1 405B",
      "architecture": "Transformer",
      "description": "Meta's largest open-weights model, competitive with GPT-4 class systems.",
      "creator": "Meta",
      "releaseDate": "2024-07-23",
      "params": "405B",
      "context": "128k",
      "benchmarks": { "mmlu": 88.6, "humanEval": 89.0, "gsm8k": 96.8, "math": 73.8 }
    },
    {
      "id": "deepseek-v3",
      "name": "DeepSeek-V3",
      "architecture": "MoE",
      "description": "Open-source mixture-of-experts model rivaling frontier closed models.",
      "creator": "DeepSeek",
      "releaseDate": "2024-12-26",
      "params": "671B",
      "context": "128k",
      "benchmarks": { "mmlu": 88.5, "humanEval": 82.6, "gsm8k": 89.3, "math": 61.6 }
    },
    {
      "id": "mistral-large-2",
      "name": "Mistral Large 2",
      "architecture": "Transformer",
      "description": "Frontier-class open-weight model with strong coding and reasoning.",
      "creator": "Mistral AI",
      "releaseDate": "2024-07-24",
      "params": "123B",
      "context": "128k",
      "benchmarks": { "mmlu": 84.0, "humanEval": 92.0, "gsm8k": 93.0, "math": 70.8 }
    },
    {
      "id": "phi-4",
      "name": "Phi-4",
      "architecture": "Transformer",
      "description": "Microsoft's small model that punches above its weight on reasoning tasks.",
      "creator": "Microsoft",
      "releaseDate": "2024-12-12",
      "params": "14B",
      "context": "16k",
      "benchmarks": { "mmlu": 84.8, "humanEval": 82.6, "gsm8k": 91.5, "math": 80.4 }
    },
    {
      "id": "llama-3-70b",
      "name": "Llama 3 70B",
      "architecture": "Transformer",
      "description": "Highly capable foundation model trained on massive multilingual datasets.",
      "creator": "Meta",
      "releaseDate": "2024-04-18",
      "params": "70B",
      "context": "8k",
      "benchmarks": { "mmlu": 82.0, "humanEval": 81.7, "gsm8k": 79.2, "math": 93.0 }
    },
    {
      "id": "gemma-2-27b",
      "name": "Gemma 2 27B",
      "architecture": "Transformer",
      "description": "Google's lightweight, state-of-the-art open model.",
      "creator": "Google",
      "releaseDate": "2024-06-27",
      "params": "27B",
      "context": "8k",
      "benchmarks": { "mmlu": 81.1, "humanEval": 71.3, "gsm8k": 74.0, "math": 85.0 }
    },
    {
      "id": "qwen-1.5-72b",
      "name": "Qwen 1.5 72B",
      "architecture": "Transformer",
      "description": "Robust multilingual model with strong reasoning and coding capabilities.",
      "creator": "Alibaba Cloud",
      "releaseDate": "2024-02-04",
      "params": "72B",
      "context": "32k",
      "benchmarks": { "mmlu": 77.5, "humanEval": 71.9, "gsm8k": 82.3, "math": 84.6 }
    },
    {
      "id": "mixtral-8x22b",
      "name": "Mixtral 8x22B",
      "architecture": "MoE",
      "description": "Sparse mixture-of-experts model providing high performance at lower inference cost.",
      "creator": "Mistral AI",
      "releaseDate": "2024-04-10",
      "params": "141B",
      "context": "64k",
      "benchmarks": { "mmlu": 77.3, "humanEval": 75.0, "gsm8k": 71.4, "math": 89.1 }
    },
    {
      "id": "yi-34b",
      "name": "Yi-34B",
      "architecture": "Transformer",
      "description": "Bilingual (English/Chinese) model with strong multilingual capabilities.",
      "creator": "01.AI",
      "releaseDate": "2023-11-06",
      "params": "34B",
      "context": "200k",
      "benchmarks": { "mmlu": 76.3, "humanEval": 26.0, "gsm8k": 67.9, "math": null }
    },
    {
      "id": "command-r-plus",
      "name": "Command R+",
      "architecture": "Transformer",
      "description": "State-of-the-art RAG-optimized model built for enterprise workloads.",
      "creator": "Cohere",
      "releaseDate": "2024-04-04",
      "params": "104B",
      "context": "128k",
      "benchmarks": { "mmlu": 75.2, "humanEval": 68.1, "gsm8k": 70.0, "math": 81.5 }
    },
    {
      "id": "falcon-180b",
      "name": "Falcon 180B",
      "architecture": "Transformer",
      "description": "TII's large open-access model trained on the RefinedWeb dataset.",
      "creator": "TII",
      "releaseDate": "2023-09-06",
      "params": "180B",
      "context": "2k",
      "benchmarks": { "mmlu": 70.4, "humanEval": null, "gsm8k": 57.8, "math": null }
    }
  ],
  "diffusion": [
    {
      "id": "flux-1-schnell",
      "name": "FLUX.1 [schnell]",
      "architecture": "Flow-based Transformer",
      "description": "SOTA high-speed rectified flow transformer for rapid image generation.",
      "creator": "Black Forest Labs",
      "releaseDate": "2024-08-01",
      "params": "12B",
      "benchmarks": { "fid": 0.85, "clipScore": 0.32, "genSpeed": 4.2 }
    },
    {
      "id": "flux-1-dev",
      "name": "FLUX.1 [dev]",
      "architecture": "Flow-based Transformer",
      "description": "Research-grade variant of FLUX with improved quality over schnell.",
      "creator": "Black Forest Labs",
      "releaseDate": "2024-08-01",
      "params": "12B",
      "benchmarks": { "fid": 0.92, "clipScore": 0.31, "genSpeed": 1.8 }
    },
    {
      "id": "kolors",
      "name": "Kolors",
      "architecture": "Latent Diffusion",
      "description": "Kwai's Chinese-English bilingual image generation model.",
      "creator": "Kwai-Kolors",
      "releaseDate": "2024-07-06",
      "params": "Unknown",
      "benchmarks": { "fid": 1.1, "clipScore": 0.30, "genSpeed": 1.6 }
    },
    {
      "id": "sdxl-1.0",
      "name": "SDXL 1.0",
      "architecture": "Latent Diffusion",
      "description": "High-resolution image synthesis model, the industry open standard.",
      "creator": "Stability AI",
      "releaseDate": "2023-07-26",
      "params": "3.5B",
      "benchmarks": { "fid": 1.2, "clipScore": 0.28, "genSpeed": 1.5 }
    },
    {
      "id": "sd-3.5-large",
      "name": "Stable Diffusion 3.5 Large",
      "architecture": "Multimodal Diffusion Transformer",
      "description": "Stability AI's largest open-weight image model with improved prompt adherence.",
      "creator": "Stability AI",
      "releaseDate": "2024-10-22",
      "params": "8B",
      "benchmarks": { "fid": 1.5, "clipScore": 0.31, "genSpeed": 1.2 }
    },
    {
      "id": "pixart-sigma",
      "name": "PixArt-Σ",
      "architecture": "Diffusion Transformer",
      "description": "Efficient high-resolution image generation with support up to 4K.",
      "creator": "PixArt-alpha",
      "releaseDate": "2024-03-20",
      "params": "0.6B",
      "benchmarks": { "fid": 2.1, "clipScore": 0.29, "genSpeed": 2.4 }
    },
    {
      "id": "playground-v2.5",
      "name": "Playground v2.5",
      "architecture": "Diffusion",
      "description": "Aesthetic-optimized image generation model fine-tuned for photorealism.",
      "creator": "Playground AI",
      "releaseDate": "2024-02-27",
      "params": "Unknown",
      "benchmarks": { "fid": 0.9, "clipScore": 0.30, "genSpeed": 2.1 }
    }
  ],
  "audio": [
    {
      "id": "distil-whisper",
      "name": "Distil-Whisper",
      "architecture": "Transformer",
      "description": "6x faster, 49% smaller distilled version of Whisper large-v2.",
      "creator": "HuggingFace",
      "releaseDate": "2023-11-01",
      "params": "756M",
      "benchmarks": { "wer": 3.0, "latency": 0.3, "multilingual": 7.0 }
    },
    {
      "id": "wav2vec2-large",
      "name": "Wav2Vec 2.0 Large",
      "architecture": "Transformer",
      "description": "Self-supervised speech representation model for high-accuracy ASR.",
      "creator": "Meta",
      "releaseDate": "2020-09-17",
      "params": "317M",
      "benchmarks": { "wer": 3.0, "latency": 0.5, "multilingual": 1.0 }
    },
    {
      "id": "whisper-v3",
      "name": "Whisper v3",
      "architecture": "Transformer",
      "description": "Robust speech recognition model with strong multilingual performance.",
      "creator": "OpenAI",
      "releaseDate": "2023-11-06",
      "params": "1550M",
      "benchmarks": { "wer": 4.2, "latency": 0.8, "multilingual": 95.0 }
    },
    {
      "id": "seamless-m4t-v2",
      "name": "SeamlessM4T v2",
      "architecture": "UnitY2",
      "description": "Massively multilingual & multimodal translation and speech model.",
      "creator": "Meta",
      "releaseDate": "2023-11-30",
      "params": "2.3B",
      "benchmarks": { "wer": 4.8, "latency": 1.2, "multilingual": 98.5 }
    },
    {
      "id": "mms",
      "name": "MMS",
      "architecture": "Transformer",
      "description": "Massively Multilingual Speech model covering 1100+ languages for ASR and TTS.",
      "creator": "Meta",
      "releaseDate": "2023-05-22",
      "params": "1B",
      "benchmarks": { "wer": 5.0, "latency": 0.9, "multilingual": 99.0 }
    },
    {
      "id": "bark",
      "name": "Bark",
      "architecture": "Transformer",
      "description": "Open-source text-to-audio synthesis supporting speech, music, and SFX.",
      "creator": "Suno AI",
      "releaseDate": "2023-04-20",
      "params": "Unknown",
      "benchmarks": { "wer": null, "latency": 3.2, "multilingual": 8.0 }
    },
    {
      "id": "stable-audio-open",
      "name": "Stable Audio Open",
      "architecture": "Latent Diffusion",
      "description": "Open weights for high-quality audio synthesis via latent diffusion.",
      "creator": "Stability AI",
      "releaseDate": "2024-06-05",
      "params": "Unknown",
      "benchmarks": { "wer": null, "latency": 2.5, "multilingual": null }
    }
  ]
}
```

- [ ] **Step 2: Verify valid JSON**

```bash
node -e "require('./data/models.json'); console.log('JSON valid')"
```

Expected output: `JSON valid`

- [ ] **Step 3: Commit**

```bash
git add data/models.json
git commit -m "data: expand models to 11 LLM, 7 diffusion, 7 audio"
```

---

## Task 2: BenchmarkTooltip Component

**Files:**
- Create: `components/BenchmarkTooltip.tsx`

- [ ] **Step 1: Create `components/BenchmarkTooltip.tsx`**

```tsx
interface BenchmarkTooltipProps {
  label: string;
  description: string;
  lowerIsBetter?: boolean;
}

export function BenchmarkTooltip({ label, description, lowerIsBetter }: BenchmarkTooltipProps) {
  return (
    <span className="relative inline-flex items-center gap-1 group/tip">
      {label}
      <span className="text-gray-600 cursor-help text-[10px] leading-none">ⓘ</span>
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 invisible group-hover/tip:visible opacity-0 group-hover/tip:opacity-100 transition-opacity z-50 pointer-events-none">
        <span className="block bg-surface-highest backdrop-blur-sm border border-outline-variant/30 p-3 shadow-[0_0_20px_rgba(0,0,0,0.6)]">
          <span className="block text-primary font-mono text-[10px] uppercase tracking-widest mb-1">{label}</span>
          <span className="block text-gray-400 text-[11px] leading-relaxed">{description}</span>
          {lowerIsBetter && (
            <span className="block text-secondary-container font-mono text-[9px] uppercase tracking-wider mt-2">▼ Lower is better</span>
          )}
        </span>
      </span>
    </span>
  );
}
```

- [ ] **Step 2: Run type-check**

```bash
yarn tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/BenchmarkTooltip.tsx
git commit -m "feat: add BenchmarkTooltip component"
```

---

## Task 3: Compare Page Redesign

**Files:**
- Modify: `app/compare/page.tsx`

- [ ] **Step 1: Replace `app/compare/page.tsx` with the full rewrite**

```tsx
"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import modelsData from "@/data/models.json";
import { BenchmarkTooltip } from "@/components/BenchmarkTooltip";

const NODE_LABELS = ["Alpha", "Beta", "Gamma", "Delta", "Epsilon"];
const colors = ["#DFFF00", "#FFBF00", "#60a5fa", "#f472b6", "#a78bfa"];

const benchmarkInfo: Record<string, { description: string; lowerIsBetter: boolean }> = {
  mmlu: { description: "Massive Multitask Language Understanding — tests general knowledge across 57 subjects.", lowerIsBetter: false },
  humanEval: { description: "Code generation accuracy on 164 hand-written Python programming problems.", lowerIsBetter: false },
  gsm8k: { description: "Grade-school math word problems requiring multi-step arithmetic reasoning.", lowerIsBetter: false },
  math: { description: "Competition-level math problems drawn from AMC and AIME challenges.", lowerIsBetter: false },
  fid: { description: "Fréchet Inception Distance — measures statistical realism of generated images vs real images.", lowerIsBetter: true },
  clipScore: { description: "Alignment between generated image and text prompt using CLIP embedding cosine similarity.", lowerIsBetter: false },
  genSpeed: { description: "Images generated per second at standard resolution on reference hardware.", lowerIsBetter: false },
  wer: { description: "Word Error Rate — percentage of words transcribed incorrectly in speech-to-text output.", lowerIsBetter: true },
  latency: { description: "Seconds from audio input start to first decoded output token.", lowerIsBetter: true },
  multilingual: { description: "Percentage of tested languages achieving acceptable transcription or translation quality.", lowerIsBetter: false },
};

export default function ComparePage() {
  const [activeCategory, setActiveCategory] = useState<keyof typeof modelsData>("llm");
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>([
    modelsData.llm[0].id,
    modelsData.llm[1].id,
  ]);

  useEffect(() => {
    const categoryModels = (modelsData as any)[activeCategory];
    setSelectedModelIds([
      categoryModels[0].id,
      categoryModels[1]?.id ?? categoryModels[0].id,
    ]);
  }, [activeCategory]);

  const models = (modelsData as any)[activeCategory] as any[];
  const selectedModels = selectedModelIds
    .map((id) => models.find((m) => m.id === id))
    .filter(Boolean);

  const benchmarkKeys = Object.keys(selectedModels[0]?.benchmarks ?? {});

  const addNode = () => {
    if (selectedModelIds.length >= 5) return;
    const next = models.find((m) => !selectedModelIds.includes(m.id));
    if (next) setSelectedModelIds([...selectedModelIds, next.id]);
  };

  const removeNode = (index: number) => {
    if (selectedModelIds.length <= 1) return;
    setSelectedModelIds(selectedModelIds.filter((_, i) => i !== index));
  };

  const updateNode = (index: number, modelId: string) => {
    const updated = [...selectedModelIds];
    updated[index] = modelId;
    setSelectedModelIds(updated);
  };

  // Bar chart: X = benchmark, one Bar per selected model
  const barChartData = benchmarkKeys.map((key) => {
    const entry: Record<string, string | number | null> = { benchmark: key.toUpperCase() };
    selectedModels.forEach((m: any) => {
      entry[m.name] = m.benchmarks[key] ?? null;
    });
    return entry;
  });

  // Radar chart: same shape
  const radarChartData = benchmarkKeys.map((key) => {
    const entry: Record<string, string | number> = { subject: key.toUpperCase() };
    selectedModels.forEach((m: any) => {
      entry[m.name] = m.benchmarks[key] ?? 0;
    });
    return entry;
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface-highest border border-outline-variant/30 p-4 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
          <p className="font-display font-bold text-white mb-2 uppercase">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="font-mono text-sm flex gap-4 justify-between" style={{ color: entry.color }}>
              <span className="uppercase">{entry.name}:</span>
              <span>{entry.value ?? "—"}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <header className="flex flex-col gap-4 animate-boot border-b border-outline-variant/20 pb-8">
        <div className="flex items-center gap-4 text-primary font-mono text-sm">
          <span className="w-2 h-2 bg-primary"></span>
          MODE: COMPARATIVE_ANALYSIS
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white uppercase">
          Model <span className="text-secondary-container">Telemetry</span>
        </h1>
        <p className="text-gray-400 font-body max-w-2xl">
          Visual comparative analysis of {activeCategory.toUpperCase()} performance across major benchmarks.
          Select up to 5 nodes to compare.
        </p>
      </header>

      {/* Control Deck */}
      <div className="flex flex-col gap-6 p-6 bg-surface-lowest border border-outline-variant/20 mb-8 font-mono text-sm">
        {/* Row 1: Category */}
        <div className="flex flex-col gap-2 max-w-xs">
          <label className="text-primary text-xs uppercase tracking-widest">Category</label>
          <div className="relative flex items-center">
            <span className="text-primary mr-2 shrink-0">{">"}</span>
            <div className="relative flex-1">
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value as keyof typeof modelsData)}
                className="appearance-none bg-transparent w-full border-b-2 border-outline-variant/40 focus:border-primary pb-1 text-white outline-none cursor-pointer transition-colors pr-6"
              >
                <option value="llm" className="bg-surface-highest">LLM</option>
                <option value="diffusion" className="bg-surface-highest">DIFFUSION</option>
                <option value="audio" className="bg-surface-highest">AUDIO</option>
              </select>
              <span className="absolute right-0 bottom-1.5 text-primary pointer-events-none text-xs leading-none">▼</span>
            </div>
          </div>
        </div>

        {/* Row 2: Nodes */}
        <div className="flex flex-col gap-4">
          <span className="text-primary text-xs uppercase tracking-widest">Nodes ({selectedModelIds.length}/5)</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedModelIds.map((modelId, index) => (
              <div key={index} className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 uppercase tracking-widest" style={{ color: colors[index] }}>
                    Node {NODE_LABELS[index]}
                  </span>
                  {index >= 2 && (
                    <button
                      onClick={() => removeNode(index)}
                      className="text-[10px] text-gray-600 hover:text-red-400 font-mono uppercase tracking-wider transition-colors"
                    >
                      ✕ Remove
                    </button>
                  )}
                </div>
                <div className="relative flex items-center">
                  <span className="mr-2 shrink-0 text-xs" style={{ color: colors[index] }}>{">"}</span>
                  <div className="relative flex-1">
                    <select
                      value={modelId}
                      onChange={(e) => updateNode(index, e.target.value)}
                      className="appearance-none bg-transparent w-full border-b-2 border-outline-variant/40 focus:border-primary pb-1 text-white outline-none cursor-pointer transition-colors pr-6 text-sm"
                    >
                      {models.map((m: any) => (
                        <option key={m.id} value={m.id} className="bg-surface-highest">{m.name}</option>
                      ))}
                    </select>
                    <span className="absolute right-0 bottom-1.5 pointer-events-none text-xs leading-none" style={{ color: colors[index] }}>▼</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedModelIds.length < 5 && (
            <button
              onClick={addNode}
              className="self-start border border-outline-variant/30 hover:border-primary/50 text-primary font-mono text-xs uppercase px-4 py-2 transition-colors hover:bg-primary/5 flex items-center gap-2"
            >
              <span>+</span> Add Node
            </button>
          )}
        </div>
      </div>

      {/* Bar Chart */}
      <section className="bg-surface-low border border-outline-variant/20 p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-outline-variant/30"></div>
        <h2 className="font-mono text-xs uppercase tracking-widest text-primary mb-8 flex items-center gap-2">
          <BarChart2Icon className="w-4 h-4" />
          Benchmark Array
          <span className="text-gray-600 ml-2">
            ({benchmarkKeys.map((k) => {
              const info = benchmarkInfo[k];
              return info ? (
                <BenchmarkTooltip key={k} label={k.toUpperCase()} description={info.description} lowerIsBetter={info.lowerIsBetter} />
              ) : (
                <span key={k}>{k.toUpperCase()}</span>
              );
            }).reduce((acc: any[], el, i) => i === 0 ? [el] : [...acc, <span key={`sep-${i}`} className="mx-1 text-gray-700">/</span>, el], [])})
          </span>
        </h2>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#454932" opacity={0.3} vertical={false} />
              <XAxis dataKey="benchmark" stroke="#e0e6f8" fontFamily="var(--font-jetbrains-mono)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#e0e6f8" fontFamily="var(--font-jetbrains-mono)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#2f3445", opacity: 0.4 }} />
              <Legend wrapperStyle={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "12px" }} iconType="square" />
              {selectedModels.map((m: any, i: number) => (
                <Bar key={m.id} dataKey={m.name} fill={colors[i % colors.length]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Radar Chart */}
      <section className="bg-surface-low border border-outline-variant/20 p-6 relative overflow-hidden">
        <h2 className="font-mono text-xs uppercase tracking-widest text-primary mb-8 flex items-center gap-2">
          <RadarIcon className="w-4 h-4" />
          Node Comparison: {selectedModels.map((m: any) => m.name).join(" vs ")}
        </h2>
        <div className="h-[500px] w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarChartData}>
              <PolarGrid stroke="#454932" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#e0e6f8", fontSize: 12, fontFamily: "var(--font-jetbrains-mono)" }} />
              <PolarRadiusAxis angle={30} tick={{ fill: "#e0e6f8", fontSize: 10 }} />
              {selectedModels.map((m: any, i: number) => (
                <Radar
                  key={m.id}
                  name={m.name}
                  dataKey={m.name}
                  stroke={colors[i % colors.length]}
                  fill={colors[i % colors.length]}
                  fillOpacity={0.15}
                />
              ))}
              <Legend wrapperStyle={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "12px", marginTop: "20px" }} />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </>
  );
}

function BarChart2Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" x2="18" y1="20" y2="10" /><line x1="12" x2="12" y1="20" y2="4" /><line x1="6" x2="6" y1="20" y2="14" />
    </svg>
  );
}

function RadarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19.07 4.93A10 10 0 0 0 6.99 3.34" /><path d="M4 6h.01" /><path d="M2.29 9.62A10 10 0 1 0 21.31 8.35" /><path d="M16.24 7.76A6 6 0 1 0 8.23 16.67" /><path d="M12 18h.01" /><path d="M17.99 11.66A6 6 0 0 1 15.77 16.67" /><circle cx="12" cy="12" r="2" /><path d="m13.41 10.59 5.66-5.66" />
    </svg>
  );
}
```

- [ ] **Step 2: Run type-check**

```bash
yarn tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/compare/page.tsx
git commit -m "feat: redesign compare page with multi-node selection and adaptive charts"
```

---

## Task 4: Leaderboard Multi-Category

**Files:**
- Modify: `app/leaderboard/page.tsx`

- [ ] **Step 1: Replace `app/leaderboard/page.tsx` with the full rewrite**

```tsx
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import modelsData from "@/data/models.json";
import { BenchmarkTooltip } from "@/components/BenchmarkTooltip";

type Category = "llm" | "diffusion" | "audio";

interface ColumnConfig {
  key: string;
  label: string;
  description: string;
  lowerIsBetter: boolean;
}

interface CategoryConfig {
  sortKey: string;
  sortAscending: boolean;
  columns: ColumnConfig[];
}

const categoryConfig: Record<Category, CategoryConfig> = {
  llm: {
    sortKey: "mmlu",
    sortAscending: false,
    columns: [
      { key: "mmlu", label: "MMLU", description: "Massive Multitask Language Understanding — tests general knowledge across 57 subjects.", lowerIsBetter: false },
      { key: "humanEval", label: "HumanEval", description: "Code generation accuracy on 164 hand-written Python programming problems.", lowerIsBetter: false },
      { key: "gsm8k", label: "GSM8K", description: "Grade-school math word problems requiring multi-step arithmetic reasoning.", lowerIsBetter: false },
      { key: "math", label: "Math", description: "Competition-level math problems drawn from AMC and AIME challenges.", lowerIsBetter: false },
    ],
  },
  diffusion: {
    sortKey: "fid",
    sortAscending: true,
    columns: [
      { key: "fid", label: "FID", description: "Fréchet Inception Distance — measures statistical realism of generated images vs real images.", lowerIsBetter: true },
      { key: "clipScore", label: "CLIP Score", description: "Alignment between generated image and text prompt using CLIP embedding cosine similarity.", lowerIsBetter: false },
      { key: "genSpeed", label: "Gen Speed", description: "Images generated per second at standard resolution on reference hardware.", lowerIsBetter: false },
    ],
  },
  audio: {
    sortKey: "wer",
    sortAscending: true,
    columns: [
      { key: "wer", label: "WER", description: "Word Error Rate — percentage of words transcribed incorrectly in speech-to-text output.", lowerIsBetter: true },
      { key: "latency", label: "Latency", description: "Seconds from audio input start to first decoded output token.", lowerIsBetter: true },
      { key: "multilingual", label: "Multilingual", description: "Percentage of tested languages achieving acceptable transcription or translation quality.", lowerIsBetter: false },
    ],
  },
};

export default function LeaderboardPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("llm");

  const config = categoryConfig[activeCategory];
  const models = (modelsData as any)[activeCategory] as any[];

  const sorted = [...models].sort((a, b) => {
    const aVal = a.benchmarks[config.sortKey];
    const bVal = b.benchmarks[config.sortKey];
    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;
    return config.sortAscending ? aVal - bVal : bVal - aVal;
  });

  const tabs: { key: Category; label: string }[] = [
    { key: "llm", label: "LLM" },
    { key: "diffusion", label: "Diffusion" },
    { key: "audio", label: "Audio" },
  ];

  return (
    <>
      <header className="flex flex-col gap-4 animate-boot border-b border-outline-variant/20 pb-8">
        <div className="flex items-center gap-4 text-secondary-container font-mono text-sm">
          <span className="w-2 h-2 bg-secondary-container"></span>
          SYS_RANK: GLOBAL_LEADERBOARD
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white uppercase">
          Neural <span className="text-secondary-container">Hierarchy</span>
        </h1>
        <p className="text-gray-400 font-body max-w-2xl">
          Live rankings of foundation models sorted by primary benchmark performance.
        </p>
      </header>

      {/* Category Tabs */}
      <div className="border-b border-outline-variant/20 flex gap-0 -mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveCategory(tab.key)}
            className={`px-6 py-3 font-mono text-xs uppercase tracking-widest border-b-2 transition-all ${
              activeCategory === tab.key
                ? "text-primary border-primary shadow-[0_2px_8px_rgba(223,255,0,0.15)]"
                : "text-gray-500 border-transparent hover:text-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <section className="bg-surface-lowest border border-outline-variant/20 overflow-x-auto shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <table className="w-full text-left font-mono text-sm whitespace-nowrap">
          <thead className="bg-surface-high border-b border-outline-variant/30 text-xs uppercase tracking-wider text-gray-400">
            <tr>
              <th className="px-6 py-4 font-normal">Rank</th>
              <th className="px-6 py-4 font-normal">Model</th>
              <th className="px-6 py-4 font-normal">Params</th>
              {config.columns.map((col, i) => (
                <th key={col.key} className={`px-6 py-4 font-normal ${i === 0 ? "text-primary" : ""}`}>
                  <span className="flex items-center gap-1">
                    <BenchmarkTooltip
                      label={col.label}
                      description={col.description}
                      lowerIsBetter={col.lowerIsBetter}
                    />
                    {i === 0 && <ChevronDown className="w-3 h-3 ml-1" />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10 text-gray-300">
            {sorted.map((model, index) => (
              <tr key={model.id} className="hover:bg-surface-low transition-colors group">
                <td className="px-6 py-4">
                  <div className={`w-6 h-6 flex items-center justify-center rounded-sm text-xs font-mono ${
                    index === 0
                      ? "bg-primary text-on-primary font-bold shadow-[0_0_10px_rgba(223,255,0,0.5)]"
                      : index === 1
                      ? "bg-secondary-container text-surface-lowest font-bold"
                      : index === 2
                      ? "bg-outline-variant text-white"
                      : "bg-surface-highest text-gray-500"
                  }`}>
                    {index + 1}
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-white group-hover:text-primary transition-colors">{model.name}</td>
                <td className="px-6 py-4 text-gray-500">{model.params}</td>
                {config.columns.map((col, i) => {
                  const val = model.benchmarks[col.key];
                  return (
                    <td key={col.key} className={`px-6 py-4 ${i === 0 ? "text-primary" : ""}`}>
                      {val !== null && val !== undefined ? val : <span className="text-gray-600">—</span>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Run type-check**

```bash
yarn tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/leaderboard/page.tsx
git commit -m "feat: add multi-category tabs and benchmark tooltips to leaderboard"
```

---

## Task 5: Changelog + Final Commit

**Files:**
- Modify: `CHANGELOG.md`

- [ ] **Step 1: Add v0.5.0 entry at the top of the changelog (after the existing header, before `## [0.4.0]`)**

```markdown
## [0.5.0] - 2026-03-28

### Added
- **Compare page — multi-node selection:** Users can now compare up to 5 models simultaneously. The Control Deck has a dynamic node list with `+ ADD NODE` / `✕ REMOVE` controls. Node dropdowns are color-coded (Cyber Lime, Amber, Blue, Pink, Purple).
- **Compare page — adaptive charts:** Both the Bar Chart and Radar Chart now filter to only the selected models. Bar chart groups by benchmark (X axis) with one bar per selected model for clear cross-model comparison.
- **Leaderboard — category tabs:** Three tabs (LLM / Diffusion / Audio) filter the leaderboard table. Columns adapt per category (MMLU/HumanEval/GSM8K/Math for LLM, FID/CLIP/Speed for Diffusion, WER/Latency/Multilingual for Audio).
- **Benchmark tooltips:** New `BenchmarkTooltip` component wraps any benchmark label with an `ⓘ` icon. Hovering shows a glassmorphism card with a plain-English definition and a "▼ Lower is better" tag where applicable.
- **Expanded model database:** 11 LLM models (added DeepSeek-V3, Llama 3.1 405B, Mistral Large 2, Phi-4, Falcon 180B, Yi-34B), 7 diffusion models (added FLUX.1 [dev], SD 3.5 Large, Kolors, PixArt-Σ), 7 audio models (added Distil-Whisper, Wav2Vec 2.0 Large, MMS, Bark).
- **Null benchmark handling:** Missing benchmarks render as `—` in the leaderboard and sort to the bottom.
```

- [ ] **Step 2: Commit**

```bash
git add CHANGELOG.md
git commit -m "docs: update changelog for v0.5.0"
```

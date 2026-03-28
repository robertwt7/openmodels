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

const tabs: { key: Category; label: string }[] = [
  { key: "llm", label: "LLM" },
  { key: "diffusion", label: "Diffusion" },
  { key: "audio", label: "Audio" },
];

export default function LeaderboardPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("llm");

  const config = categoryConfig[activeCategory];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const models = (modelsData as any)[activeCategory] as any[];

  const sorted = [...models].sort((a, b) => {
    const aVal: number | null = a.benchmarks[config.sortKey];
    const bVal: number | null = b.benchmarks[config.sortKey];
    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;
    return (config.sortAscending ? aVal - bVal : bVal - aVal) || a.id.localeCompare(b.id);
  });

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
      <div className="border-b border-outline-variant/20 flex gap-0">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveCategory(tab.key)}
            className={`px-6 py-3 font-mono text-xs uppercase tracking-widest border-b-2 -mb-px transition-all ${
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
              {config.columns.map((col) => (
                <th key={col.key} className={`px-6 py-4 font-normal ${col.key === config.sortKey ? "text-primary" : ""}`}>
                  <span className="flex items-center gap-1">
                    <BenchmarkTooltip
                      label={col.label}
                      description={col.description}
                      lowerIsBetter={col.lowerIsBetter}
                    />
                    {col.key === config.sortKey && <ChevronDown className="w-3 h-3 ml-1" />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10 text-gray-300">
            {sorted.map((model, index) => (
              <tr key={model.id} className="hover:bg-surface-low transition-colors group">
                <td className="px-6 py-4">
                  <div
                    className={`w-6 h-6 flex items-center justify-center text-xs font-mono ${
                      index === 0
                        ? "bg-primary text-on-primary font-bold shadow-[0_0_10px_rgba(223,255,0,0.5)]"
                        : index === 1
                        ? "bg-secondary-container text-surface-lowest font-bold"
                        : index === 2
                        ? "bg-outline-variant text-white"
                        : "bg-surface-highest text-gray-500"
                    }`}
                  >
                    {index + 1}
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-white group-hover:text-primary transition-colors">
                  {model.name}
                </td>
                <td className="px-6 py-4 text-gray-500">{model.params}</td>
                {config.columns.map((col) => {
                  const val = model.benchmarks[col.key];
                  return (
                    <td key={col.key} className={`px-6 py-4 ${col.key === config.sortKey ? "text-primary" : ""}`}>
                      {val !== null && val !== undefined ? val : (
                        <span className="text-gray-600">—</span>
                      )}
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

"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import modelsData from "@/data/models.json";
import { BenchmarkTooltip } from "@/components/BenchmarkTooltip";
import { useLeaderboard } from "@/lib/hooks/useLeaderboard";
import type { LiveModel } from "@/lib/hf-api";

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
    sortKey: "average",
    sortAscending: false,
    columns: [
      { key: "average", label: "Avg ⬆", description: "Overall average score across IFEval, BBH, MATH Lvl 5, GPQA, MuSR, and MMLU-PRO benchmarks as reported by the Open LLM Leaderboard.", lowerIsBetter: false },
      { key: "mmluPro", label: "MMLU-Pro", description: "Massive Multitask Language Understanding Pro — harder, 10-choice version spanning 57 academic subjects.", lowerIsBetter: false },
      { key: "bbh", label: "BBH", description: "Big Bench Hard — 23 challenging multi-step reasoning tasks requiring chain-of-thought.", lowerIsBetter: false },
      { key: "gpqa", label: "GPQA", description: "Graduate-Level Google-Proof Q&A — PhD-level questions across biology, chemistry, and physics.", lowerIsBetter: false },
      { key: "mathHard", label: "MATH", description: "Competition-level mathematics problems from AMC/AIME, testing symbolic and algebraic reasoning.", lowerIsBetter: false },
      { key: "ifeval", label: "IFEval", description: "Instruction Following Evaluation — strict accuracy on verifiable formatting and constraint instructions.", lowerIsBetter: false },
      { key: "musr", label: "MuSR", description: "Multi-step Soft Reasoning — complex narrative reasoning over murder mysteries and object tracking.", lowerIsBetter: false },
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

const LLM_PAGE_SIZE = 100;
const ARCH_OPTIONS = ["All", "Transformer", "MoE"];
const TYPE_OPTIONS = ["All", "chat", "base", "instruct", "merge", "finetune"];

export default function LeaderboardPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("llm");
  const [llmOffset, setLlmOffset] = useState(0);
  const [sortKey, setSortKey] = useState("average");
  const [sortAsc, setSortAsc] = useState(false);
  const [archFilter, setArchFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const { data: llmData, isLoading: llmLoading, isFetching: llmFetching } = useLeaderboard(llmOffset, LLM_PAGE_SIZE);

  const config = categoryConfig[activeCategory];

  // For non-LLM categories use static data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const staticModels = useMemo(() => activeCategory !== "llm" ? ((modelsData as any)[activeCategory] as any[]) : [], [activeCategory]);

  // LLM: filter + sort live data
  const llmModels: LiveModel[] = useMemo(() => {
    const raw = llmData?.models ?? [];
    const filtered = raw.filter((m) => {
      const matchArch =
        archFilter === "All" ||
        m.architecture.toLowerCase() === archFilter.toLowerCase() ||
        (archFilter === "MoE" && m.isMoE);
      const matchType =
        typeFilter === "All" ||
        m.type.toLowerCase() === typeFilter.toLowerCase();
      return matchArch && matchType;
    });
    return [...filtered].sort((a, b) => {
      const aVal = (a.benchmarks as Record<string, number | null>)[sortKey];
      const bVal = (b.benchmarks as Record<string, number | null>)[sortKey];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      return sortAsc ? aVal - bVal : bVal - aVal;
    });
  }, [llmData, sortKey, sortAsc, archFilter, typeFilter]);

  // Non-LLM: client-side sort
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sortedStatic = useMemo(() => [...staticModels].sort((a: any, b: any) => {
    const aVal: number | null = a.benchmarks[config.sortKey];
    const bVal: number | null = b.benchmarks[config.sortKey];
    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;
    return (config.sortAscending ? aVal - bVal : bVal - aVal) || a.id.localeCompare(b.id);
  }), [staticModels, config]);

  const handleLLMSort = (key: string) => {
    if (key === sortKey) {
      setSortAsc((prev) => !prev);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  const handleTabChange = (cat: Category) => {
    setActiveCategory(cat);
    setLlmOffset(0);
    setSortKey(cat === "llm" ? "average" : categoryConfig[cat].sortKey);
    setSortAsc(categoryConfig[cat].sortAscending);
  };

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
            onClick={() => handleTabChange(tab.key)}
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

      {/* LLM Filters */}
      {activeCategory === "llm" && (
        <div className="flex flex-wrap gap-4 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 uppercase tracking-wider">Arch:</span>
            {ARCH_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setArchFilter(opt)}
                className={`px-3 py-1 border transition-colors uppercase ${
                  archFilter === opt
                    ? "border-primary text-primary bg-primary/10"
                    : "border-outline-variant/30 text-gray-500 hover:text-gray-300"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-gray-500 uppercase tracking-wider">Type:</span>
            {TYPE_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setTypeFilter(opt)}
                className={`px-3 py-1 border transition-colors uppercase ${
                  typeFilter === opt
                    ? "border-secondary-container text-secondary-container bg-secondary-container/10"
                    : "border-outline-variant/30 text-gray-500 hover:text-gray-300"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      <section className="bg-surface-lowest border border-outline-variant/20 overflow-x-auto shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <table className="w-full text-left font-mono text-sm whitespace-nowrap">
          <thead className="bg-surface-high border-b border-outline-variant/30 text-xs uppercase tracking-wider text-gray-400">
            <tr>
              <th className="px-6 py-4 font-normal">Rank</th>
              <th className="px-6 py-4 font-normal">Model</th>
              <th className="px-6 py-4 font-normal">Params</th>
              {activeCategory === "llm" ? (
                <>
                  {config.columns.map((col) => (
                    <th
                      key={col.key}
                      className={`px-6 py-4 font-normal cursor-pointer select-none ${col.key === sortKey ? "text-primary" : "hover:text-gray-200"}`}
                      onClick={() => handleLLMSort(col.key)}
                    >
                      <span className="flex items-center gap-1">
                        <BenchmarkTooltip label={col.label} description={col.description} lowerIsBetter={col.lowerIsBetter} />
                        {col.key === sortKey ? (
                          sortAsc ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />
                        ) : null}
                      </span>
                    </th>
                  ))}
                </>
              ) : (
                config.columns.map((col) => (
                  <th key={col.key} className={`px-6 py-4 font-normal ${col.key === config.sortKey ? "text-primary" : ""}`}>
                    <span className="flex items-center gap-1">
                      <BenchmarkTooltip label={col.label} description={col.description} lowerIsBetter={col.lowerIsBetter} />
                      {col.key === config.sortKey && <ChevronDown className="w-3 h-3 ml-1" />}
                    </span>
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10 text-gray-300">
            {activeCategory === "llm" ? (
              llmLoading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="w-6 h-6 bg-surface-highest rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-surface-highest rounded w-48" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-surface-highest rounded w-12" /></td>
                    {config.columns.map((c) => (
                      <td key={c.key} className="px-6 py-4"><div className="h-4 bg-surface-highest rounded w-16" /></td>
                    ))}
                  </tr>
                ))
              ) : (
                llmModels.map((model, index) => (
                  <tr key={model.id} className="hover:bg-surface-low transition-colors group">
                    <td className="px-6 py-4">
                      <div className={`w-6 h-6 flex items-center justify-center text-xs font-mono ${
                        llmOffset + index === 0 ? "bg-primary text-on-primary font-bold shadow-[0_0_10px_rgba(223,255,0,0.5)]"
                        : llmOffset + index === 1 ? "bg-secondary-container text-surface-lowest font-bold"
                        : llmOffset + index === 2 ? "bg-outline-variant text-white"
                        : "bg-surface-highest text-gray-500"
                      }`}>
                        {llmOffset + index + 1}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-white group-hover:text-primary transition-colors">
                      <div className="flex items-center gap-2">
                        <Link href={`/models/llm/${model.id}`} className="hover:underline">
                          {model.name}
                        </Link>
                        <a
                          href={`https://huggingface.co/${model.huggingFaceId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-primary transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{model.params}</td>
                    {config.columns.map((col) => {
                      const val = (model.benchmarks as Record<string, number | null>)[col.key];
                      return (
                        <td key={col.key} className={`px-6 py-4 ${col.key === sortKey ? "text-primary" : ""}`}>
                          {val != null ? val : <span className="text-gray-600">—</span>}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )
            ) : (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              sortedStatic.map((model: any, index: number) => (
                <tr key={model.id} className="hover:bg-surface-low transition-colors group">
                  <td className="px-6 py-4">
                    <div className={`w-6 h-6 flex items-center justify-center text-xs font-mono ${
                      index === 0 ? "bg-primary text-on-primary font-bold shadow-[0_0_10px_rgba(223,255,0,0.5)]"
                      : index === 1 ? "bg-secondary-container text-surface-lowest font-bold"
                      : index === 2 ? "bg-outline-variant text-white"
                      : "bg-surface-highest text-gray-500"
                    }`}>
                      {index + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-white group-hover:text-primary transition-colors">
                    <Link href={`/models/${activeCategory}/${model.id}`} className="hover:underline">
                      {model.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{model.params}</td>
                  {config.columns.map((col) => {
                    const val = model.benchmarks[col.key];
                    return (
                      <td key={col.key} className={`px-6 py-4 ${col.key === config.sortKey ? "text-primary" : ""}`}>
                        {val !== null && val !== undefined ? val : <span className="text-gray-600">—</span>}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      {/* LLM pagination */}
      {activeCategory === "llm" && llmData && (
        <div className="flex items-center justify-between border-t border-outline-variant/20 pt-4">
          <button
            onClick={() => setLlmOffset((prev) => Math.max(0, prev - LLM_PAGE_SIZE))}
            disabled={llmOffset === 0 || llmFetching}
            className="px-4 py-2 font-mono text-xs uppercase border border-outline-variant/30 text-gray-400 hover:border-primary/50 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← Prev
          </button>
          <span className="text-xs font-mono text-gray-500">
            {llmOffset + 1}–{Math.min(llmOffset + LLM_PAGE_SIZE, llmData.total)} / {llmData.total} models
          </span>
          <button
            onClick={() => setLlmOffset((prev) => prev + LLM_PAGE_SIZE)}
            disabled={llmOffset + LLM_PAGE_SIZE >= llmData.total || llmFetching}
            className="px-4 py-2 font-mono text-xs uppercase border border-outline-variant/30 text-gray-400 hover:border-primary/50 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            {llmFetching ? <span className="animate-pulse">Loading…</span> : "Next →"}
          </button>
        </div>
      )}

      {/* LLM attribution */}
      {activeCategory === "llm" && (
        <p className="text-xs font-mono text-gray-600 text-center">
          Source:{" "}
          <a
            href="https://huggingface.co/datasets/open-llm-leaderboard/contents"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-primary transition-colors"
          >
            open-llm-leaderboard/contents
          </a>{" "}
          · HuggingFace · refreshed every 5 min
        </p>
      )}
    </>
  );
}

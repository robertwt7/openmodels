"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ExternalLink, Zap, Radio } from "lucide-react";
import { useLeaderboard } from "@/lib/hooks/useLeaderboard";
import type { LiveModel } from "@/lib/hf-api";

const PAGE_SIZE = 50;

const ARCH_OPTIONS = ["All", "Transformer", "MoE", "SSM"];
const TYPE_OPTIONS = ["All", "pretrained", "chat", "fine-tuned", "instruct", "merge"];

export default function Home() {
  const [query, setQuery] = useState("");
  const [offset, setOffset] = useState(0);
  const [archFilter, setArchFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const { data, isLoading, isError, isFetching } = useLeaderboard(offset, PAGE_SIZE);

  const displayModels = useMemo(() => {
    if (!data?.models) return [];
    return data.models.filter((m) => {
      const matchQuery =
        !query.trim() ||
        [m.name, m.creator, m.architecture, m.type]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase());
      const matchArch =
        archFilter === "All" ||
        m.architecture.toLowerCase() === archFilter.toLowerCase() ||
        (archFilter === "MoE" && m.isMoE);
      const matchType =
        typeFilter === "All" ||
        m.type.toLowerCase() === typeFilter.toLowerCase();
      return matchQuery && matchArch && matchType;
    });
  }, [data, query, archFilter, typeFilter]);

  return (
    <>
      <header className="flex flex-col gap-6 animate-boot">
        <div className="flex items-center gap-4 text-primary font-mono text-sm">
          <span className="w-2 h-2 bg-primary"></span>
          SYSTEM BOOT: LARGE_LANGUAGE_MODELS
        </div>
        <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-white uppercase leading-none">
          Open Source <br />
          <span className="text-primary opacity-90 drop-shadow-[0_0_20px_rgba(223,255,0,0.15)]">
            Intelligence
          </span>
        </h1>
        <p className="max-w-2xl text-lg text-gray-400 font-body">
          A high-bandwidth neural interface directory for open source foundation models.
          Access performance benchmarks, creator metadata, and raw system specs.
        </p>
      </header>

      {/* Search + Filters */}
      <section className="flex flex-col gap-4">
        <div className="bg-surface-lowest p-6 rounded relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary/50 group-focus-within:bg-primary transition-colors"></div>
          <div className="flex items-center gap-4">
            <span className="text-primary font-mono text-xl">{">"}</span>
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setOffset(0); }}
              placeholder="Query models by name, architecture, creator, or type..."
              className="bg-transparent w-full text-white font-mono placeholder:text-gray-600 outline-none border-b-2 border-outline-variant/40 focus:border-primary pb-2 transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 font-mono text-xs">
          {/* Architecture filter */}
          <div className="flex items-center gap-2">
            <span className="text-gray-500 uppercase tracking-wider">Arch:</span>
            {ARCH_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => { setArchFilter(opt); setOffset(0); }}
                className={`px-3 py-1 border transition-colors uppercase ${
                  archFilter === opt
                    ? "border-primary text-primary bg-primary/10"
                    : "border-outline-variant/30 text-gray-500 hover:text-gray-300 hover:border-outline-variant/60"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Type filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-gray-500 uppercase tracking-wider">Type:</span>
            {TYPE_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => { setTypeFilter(opt); setOffset(0); }}
                className={`px-3 py-1 border transition-colors uppercase ${
                  typeFilter === opt
                    ? "border-secondary-container text-secondary-container bg-secondary-container/10"
                    : "border-outline-variant/30 text-gray-500 hover:text-gray-300 hover:border-outline-variant/60"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Live Leaderboard Feed */}
      <section className="flex flex-col gap-8">
        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
          <h2 className="font-display text-2xl uppercase tracking-wider text-white flex items-center gap-3">
            <Radio className="w-5 h-5 text-primary animate-pulse" />
            Open LLM Leaderboard
          </h2>
          <div className="flex items-center gap-3">
            {data && (
              <div className="text-xs font-mono text-primary bg-primary/10 px-3 py-1 border border-primary/20 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary animate-pulse"></span>
                {offset + 1}–{Math.min(offset + PAGE_SIZE, data.total)} / {data.total} MODELS
              </div>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-500 font-mono -mt-4">
          DATA: open-llm-leaderboard/contents via HuggingFace · refreshed every 5 min
        </p>

        {isError && (
          <div className="font-mono text-sm py-8 text-center border border-red-900/30 bg-red-950/10">
            <span className="text-red-400">{">"}</span>{" "}
            <span className="text-red-400">ERR: FEED_UNAVAILABLE</span>
            <span className="text-gray-600"> — HuggingFace API unreachable</span>
          </div>
        )}

        {isLoading && (
          <div className="grid gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {data && !isLoading && displayModels.length === 0 && (
          <div className="font-mono text-gray-500 text-sm py-8 text-center border border-outline-variant/10 bg-surface-low">
            <span className="text-primary">{">"}</span> NO MATCH FOUND
          </div>
        )}

        {data && !isLoading && displayModels.length > 0 && (
          <>
            <div className="grid gap-4">
              {displayModels.map((model) => (
                <LiveModelCard key={`${model.id}-${offset}`} model={model} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-outline-variant/20 pt-6">
              <button
                onClick={() => setOffset((prev) => Math.max(0, prev - PAGE_SIZE))}
                disabled={offset === 0 || isFetching}
                className="px-4 py-2 font-mono text-xs uppercase border border-outline-variant/30 text-gray-400 hover:border-primary/50 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ← Prev
              </button>
              <span className="text-xs font-mono text-gray-600">
                Page {Math.floor(offset / PAGE_SIZE) + 1} of {Math.ceil((data.total) / PAGE_SIZE)}
              </span>
              <button
                onClick={() => setOffset((prev) => prev + PAGE_SIZE)}
                disabled={offset + PAGE_SIZE >= data.total || isFetching}
                className="px-4 py-2 font-mono text-xs uppercase border border-outline-variant/30 text-gray-400 hover:border-primary/50 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                {isFetching ? <span className="animate-pulse">Loading…</span> : "Next →"}
              </button>
            </div>
          </>
        )}
      </section>
    </>
  );
}

function LiveModelCard({ model }: { model: LiveModel }) {
  return (
    <div className="bg-surface-low hover:bg-surface-high transition-colors p-5 flex flex-col lg:flex-row gap-4 lg:items-center group relative overflow-hidden border border-outline-variant/10">
      {/* Stretched link covering the whole card */}
      <Link href={`/models/llm/${model.id}`} className="absolute inset-0 z-0" aria-label={`View ${model.name}`} />

      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/20 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-0.5 h-full bg-primary/10 group-hover:bg-primary/30 transition-colors pointer-events-none"></div>

      {/* Left section: name + badges + creator — takes remaining space */}
      <div className="flex flex-col gap-2 relative z-10 pointer-events-none flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-display text-lg font-bold text-white group-hover:text-primary transition-colors truncate">
            {model.name}
          </h3>
          <a
            href={`https://huggingface.co/${model.huggingFaceId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto flex items-center gap-1 text-[10px] font-mono border border-outline-variant/20 px-2 py-0.5 text-gray-400 hover:text-primary hover:border-primary/40 transition-colors z-10 relative shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-2.5 h-2.5" />
            HF
          </a>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
            <Zap className="w-3 h-3 text-primary" />
            <span className="text-gray-300">{model.creator}</span>
          </div>
          <div className="text-xs font-mono border border-outline-variant/20 px-2 py-0.5 text-gray-400">
            {model.architecture}
          </div>
          {model.type && model.type !== "unknown" && (
            <div className="text-xs font-mono border border-outline-variant/10 px-2 py-0.5 text-gray-600 uppercase">
              {model.type}
            </div>
          )}
          {model.license && (
            <div className="text-xs font-mono text-gray-600">{model.license}</div>
          )}
        </div>
      </div>

      {/* Stats block — fixed width so it aligns across rows */}
      <div className="bg-surface-highest p-3 rounded-sm grid grid-cols-4 gap-4 border border-outline-variant/10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] shrink-0 w-full lg:w-80 relative z-10 pointer-events-none">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-gray-500 font-mono uppercase">Params</span>
          <span className="font-mono text-white text-sm">{model.params}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-gray-500 font-mono uppercase">Avg</span>
          <span className="font-mono text-primary text-sm">
            {model.benchmarks.average != null ? `${model.benchmarks.average}%` : "—"}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-gray-500 font-mono uppercase">MMLU-Pro</span>
          <span className="font-mono text-secondary-container text-sm">
            {model.benchmarks.mmluPro != null ? `${model.benchmarks.mmluPro}%` : "—"}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-gray-500 font-mono uppercase">BBH</span>
          <span className="font-mono text-gray-300 text-sm">
            {model.benchmarks.bbh != null ? `${model.benchmarks.bbh}%` : "—"}
          </span>
        </div>
      </div>

      {/* View button — fixed width */}
      <span className="h-full px-4 py-3 border border-outline-variant/20 group-hover:border-primary/50 text-primary font-mono text-xs uppercase flex items-center justify-center transition-colors bg-surface-lowest group-hover:bg-primary/5 shrink-0 lg:w-20 relative z-10 pointer-events-none">
        View &rarr;
      </span>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-surface-low p-5 flex flex-col lg:flex-row gap-4 lg:items-center justify-between border border-outline-variant/10 animate-pulse">
      <div className="flex flex-col gap-3 flex-1">
        <div className="flex gap-3">
          <div className="h-5 bg-surface-highest rounded w-48"></div>
          <div className="h-5 bg-surface-highest rounded w-24"></div>
        </div>
        <div className="h-3 bg-surface-highest rounded w-32"></div>
      </div>
      <div className="h-14 bg-surface-highest rounded w-64 shrink-0"></div>
    </div>
  );
}

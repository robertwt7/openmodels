"use client";

import { useState } from "react";
import Link from "next/link";
import { Activity, Zap, ExternalLink, Radio } from "lucide-react";
import modelsData from "@/data/models.json";
import { useLeaderboard } from "@/lib/hooks/useLeaderboard";
import type { LiveModel } from "@/lib/hf-api";

const PAGE_SIZE = 50;

export default function Home() {
  const [query, setQuery] = useState("");
  const [offset, setOffset] = useState(0);

  const allModels = modelsData.llm;
  const filtered = query.trim()
    ? allModels.filter((m) =>
        [m.name, m.architecture, m.creator, m.description]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase())
      )
    : allModels;

  const { data, isLoading, isError, isFetching } = useLeaderboard(offset, PAGE_SIZE);

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

      {/* Search / Input Field */}
      <section className="bg-surface-lowest p-6 rounded relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary/50 group-focus-within:bg-primary transition-colors"></div>
        <div className="flex items-center gap-4">
          <span className="text-primary font-mono text-xl">{">"}</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Query models by name, architecture, or benchmark..."
            className="bg-transparent w-full text-white font-mono placeholder:text-gray-600 outline-none border-b-2 border-outline-variant/40 focus:border-primary pb-2 transition-colors"
          />
        </div>
      </section>

      {/* Curated Model Data Stream */}
      <section className="flex flex-col gap-8">
        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
          <h2 className="font-display text-2xl uppercase tracking-wider text-white">
            Data Streams <span className="animate-blink text-primary">_</span>
          </h2>
          <div className="text-xs font-mono text-secondary-container bg-secondary-container/10 px-3 py-1 border border-secondary-container/20 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-secondary-container"></span>
            {filtered.length} / {allModels.length} MODELS
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="font-mono text-gray-500 text-sm py-8 text-center border border-outline-variant/10 bg-surface-low">
            <span className="text-primary">{">"}</span> NO MATCH FOUND FOR &quot;{query}&quot;
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((model) => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>
        )}
      </section>

      {/* Live Leaderboard Feed */}
      <section className="flex flex-col gap-8">
        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
          <h2 className="font-display text-2xl uppercase tracking-wider text-white flex items-center gap-3">
            <Radio className="w-5 h-5 text-primary animate-pulse" />
            Live Feed
          </h2>
          <div className="flex items-center gap-3">
            {data && (
              <div className="text-xs font-mono text-primary bg-primary/10 px-3 py-1 border border-primary/20 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary animate-pulse"></span>
                {offset + 1}–{Math.min(offset + PAGE_SIZE, data.total)} / {data.total} MODELS
              </div>
            )}
            <div className="text-xs font-mono text-gray-500 px-3 py-1 border border-outline-variant/20">
              HF LEADERBOARD
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-500 font-mono -mt-4">
          LIVE_FEED: open-llm-leaderboard/contents — real-time rankings from HuggingFace
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
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {data && !isLoading && (
          <>
            <div className="grid gap-4">
              {data.models.map((model) => (
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
                Page {Math.floor(offset / PAGE_SIZE) + 1} of {Math.ceil(data.total / PAGE_SIZE)}
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

function ModelCard({ model }: { model: (typeof modelsData.llm)[number] }) {
  return (
    <div className="bg-surface-low hover:bg-surface-high transition-colors p-6 flex flex-col lg:flex-row gap-6 lg:items-center justify-between group relative overflow-hidden border border-outline-variant/10">
      {/* Stretched link covering the whole card */}
      <Link href={`/models/llm/${model.id}`} className="absolute inset-0 z-0" aria-label={`View ${model.name}`} />

      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-outline-variant/40 pointer-events-none"></div>

      <div className="flex flex-col gap-2 relative z-10 pointer-events-none">
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="font-display text-xl font-bold text-white group-hover:text-primary transition-colors">{model.name}</h3>
          <div className="text-xs font-mono border border-outline-variant/20 px-2 py-0.5 text-gray-400">
            {model.architecture}
          </div>
          {"huggingFaceId" in model && model.huggingFaceId && (
            <a
              href={`https://huggingface.co/${model.huggingFaceId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto flex items-center gap-1 text-[10px] font-mono border border-outline-variant/20 px-2 py-0.5 text-gray-400 hover:text-primary hover:border-primary/40 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-2.5 h-2.5" />
              HF
            </a>
          )}
        </div>
        <p className="text-sm text-gray-400 max-w-xl">{model.description}</p>
        <div className="flex gap-4 mt-2">
          <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
            <Zap className="w-3 h-3 text-primary" />
            Creator: <span className="text-gray-300">{model.creator}</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
            <Activity className="w-3 h-3 text-secondary-container" />
            Released: <span className="text-gray-300">{model.releaseDate}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 lg:items-center shrink-0 relative z-10 pointer-events-none">
        <div className="bg-surface-highest p-4 rounded-sm flex gap-6 border border-outline-variant/10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-gray-500 font-mono uppercase">Params</span>
            <span className="font-mono text-white text-sm">{model.params}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-gray-500 font-mono uppercase">MMLU-Pro</span>
            <span className="font-mono text-primary text-sm">{model.benchmarks.mmluPro != null ? `${model.benchmarks.mmluPro}%` : "—"}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-gray-500 font-mono uppercase">Context</span>
            <span className="font-mono text-secondary-container text-sm">{model.context}</span>
          </div>
        </div>

        <span className="h-full px-4 border border-outline-variant/20 group-hover:border-primary/50 text-primary font-mono text-xs uppercase flex items-center justify-center transition-colors bg-surface-lowest group-hover:bg-primary/5">
          View &rarr;
        </span>
      </div>
    </div>
  );
}

function LiveModelCard({ model }: { model: LiveModel }) {
  return (
    <div className="bg-surface-low hover:bg-surface-high transition-colors p-5 flex flex-col lg:flex-row gap-4 lg:items-center justify-between group relative overflow-hidden border border-outline-variant/10">
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/20 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-0.5 h-full bg-primary/10 group-hover:bg-primary/30 transition-colors pointer-events-none"></div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="font-display text-lg font-bold text-white group-hover:text-primary transition-colors">
            {model.name}
          </h3>
          <div className="text-xs font-mono border border-outline-variant/20 px-2 py-0.5 text-gray-400">
            {model.architecture}
          </div>
          {model.isMoE && (
            <div className="text-xs font-mono border border-secondary-container/30 px-2 py-0.5 text-secondary-container">
              MoE
            </div>
          )}
          {model.type && (
            <div className="text-xs font-mono border border-outline-variant/10 px-2 py-0.5 text-gray-600 uppercase">
              {model.type}
            </div>
          )}
          <a
            href={`https://huggingface.co/${model.huggingFaceId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] font-mono border border-outline-variant/20 px-2 py-0.5 text-gray-400 hover:text-primary hover:border-primary/40 transition-colors"
          >
            <ExternalLink className="w-2.5 h-2.5" />
            HF
          </a>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
            <Zap className="w-3 h-3 text-primary" />
            <span className="text-gray-300">{model.creator}</span>
          </div>
          {model.license && (
            <div className="text-xs font-mono text-gray-600">{model.license}</div>
          )}
        </div>
      </div>

      <div className="bg-surface-highest p-3 rounded-sm flex gap-4 border border-outline-variant/10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] shrink-0 flex-wrap">
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
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-gray-500 font-mono uppercase">GPQA</span>
          <span className="font-mono text-gray-300 text-sm">
            {model.benchmarks.gpqa != null ? `${model.benchmarks.gpqa}%` : "—"}
          </span>
        </div>
      </div>
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

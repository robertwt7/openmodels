"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import modelsData from "@/data/models.json";
import { Category } from "@/lib/benchmarks";
import { useLeaderboardFull } from "@/lib/hooks/useLeaderboardFull";
import type { LiveModel } from "@/lib/hf-api";

// ─── Types ───────────────────────────────────────────────────────────────────

type DiffusionModel = (typeof modelsData.diffusion)[number];
type AudioModel = (typeof modelsData.audio)[number];

interface TimelineModel {
  id: string;
  name: string;
  creator: string;
  category: Category;
  params: string;
  releaseDate: string;
  benchmarkLabel: string;
  benchmarkValue: string;
  href: string;
}

// ─── Data helpers ─────────────────────────────────────────────────────────────

function toYearMonth(dateStr: string): string {
  return dateStr.slice(0, 7); // "YYYY-MM"
}

function buildMonthRange(start: string, end: string): string[] {
  const months: string[] = [];
  let [y, m] = start.split("-").map(Number);
  const [ey, em] = end.split("-").map(Number);
  while (y < ey || (y === ey && m <= em)) {
    months.push(`${y}-${String(m).padStart(2, "0")}`);
    m++;
    if (m > 12) { m = 1; y++; }
  }
  return months;
}

function normaliseModels(liveLLMs: LiveModel[]): TimelineModel[] {
  const llms: TimelineModel[] = liveLLMs
    .filter((m) => m.releaseDate != null)
    .map((m) => ({
      id: m.id,
      name: m.name,
      creator: m.creator,
      category: "llm" as Category,
      params: m.params,
      releaseDate: m.releaseDate!,
      benchmarkLabel: "Avg",
      benchmarkValue: m.benchmarks.average != null ? `${m.benchmarks.average}%` : "—",
      href: `/models/llm/${m.id}`,
    }));

  const diffusions: TimelineModel[] = modelsData.diffusion.map((m: DiffusionModel) => ({
    id: m.id,
    name: m.name,
    creator: m.creator,
    category: "diffusion" as Category,
    params: m.params,
    releaseDate: m.releaseDate,
    benchmarkLabel: "CLIP",
    benchmarkValue: m.benchmarks.clipScore != null ? String(m.benchmarks.clipScore) : "—",
    href: `/models/diffusion/${m.id}`,
  }));

  const audios: TimelineModel[] = modelsData.audio.map((m: AudioModel) => ({
    id: m.id,
    name: m.name,
    creator: m.creator,
    category: "audio" as Category,
    params: m.params,
    releaseDate: m.releaseDate,
    benchmarkLabel: "WER",
    benchmarkValue: m.benchmarks.wer != null ? `${m.benchmarks.wer}%` : "—",
    href: `/models/audio/${m.id}`,
  }));

  return [...llms, ...diffusions, ...audios];
}

// Month range computed across ALL models so axis never shifts when toggling
function computeMonthRange(all: TimelineModel[]): string[] {
  const dates = all.map((m) => toYearMonth(m.releaseDate)).sort();
  if (dates.length === 0) return [];
  const startYear = dates[0].slice(0, 4);
  const endYear = dates[dates.length - 1].slice(0, 4);
  return buildMonthRange(`${startYear}-01`, `${endYear}-12`);
}

function groupByMonth(models: TimelineModel[]): Map<string, TimelineModel[]> {
  const map = new Map<string, TimelineModel[]>();
  for (const m of models) {
    const key = toYearMonth(m.releaseDate);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(m);
  }
  return map;
}

function groupByYear(months: string[]): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const ym of months) {
    const year = ym.slice(0, 4);
    if (!result[year]) result[year] = [];
    result[year].push(ym);
  }
  return result;
}

const MONTH_NAMES = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

// ─── Category config ──────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<Category, { label: string; color: string; borderColor: string }> = {
  llm:      { label: "LLM",      color: "text-primary",            borderColor: "border-primary/50" },
  diffusion:{ label: "Diffusion",color: "text-secondary-container", borderColor: "border-secondary-container/50" },
  audio:    { label: "Audio",    color: "text-[#00BFFF]",          borderColor: "border-[#00BFFF]/50" },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TimelinePage() {
  const { data: liveData, isLoading: llmLoading } = useLeaderboardFull();
  const liveLLMs: LiveModel[] = liveData?.models ?? [];

  const allModels = normaliseModels(liveLLMs);
  const monthRange = computeMonthRange(allModels);
  const byMonth = groupByMonth(allModels);

  const [active, setActive] = useState<Record<Category, boolean>>({
    llm: true, diffusion: true, audio: true,
  });
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    setScrollProgress(max > 0 ? el.scrollTop / max : 0);
  }, []);

  const toggleCategory = (cat: Category) => {
    setActive((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden -m-8 lg:-m-12 xl:-m-16">
      {/* ── Header ── */}
      <header className="shrink-0 px-8 py-4 bg-surface-lowest border-b border-outline-variant/20 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="w-2 h-2 bg-primary animate-blink shrink-0" />
            <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-white">
              Chronological Index
              <span className="text-primary animate-blink ml-1">_</span>
            </h1>
            {llmLoading && (
              <span className="text-xs font-mono text-gray-600 animate-pulse">Loading LLM data…</span>
            )}
          </div>
          {/* Category filter chips */}
          <div className="flex gap-2">
            {(Object.keys(CATEGORY_CONFIG) as Category[]).map((cat) => {
              const cfg = CATEGORY_CONFIG[cat];
              const isOn = active[cat];
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`font-mono text-xs uppercase tracking-wider px-3 py-1.5 border transition-all relative overflow-hidden ${
                    isOn
                      ? `${cfg.borderColor} ${cfg.color} bg-surface-low`
                      : "border-outline-variant/20 text-gray-600 bg-surface-lowest"
                  }`}
                >
                  {isOn && <span className={`absolute left-0 top-0 bottom-0 w-0.5 ${cfg.color.replace("text-","bg-")}`} />}
                  {cfg.label}
                </button>
              );
            })}
          </div>
        </div>
        {/* Scroll progress bar */}
        <div className="h-[2px] bg-outline-variant/20 w-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-75"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>
      </header>

      {/* ── Vertical scrollable timeline ── */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto overflow-x-hidden"
      >
        <VerticalTimeline monthRange={monthRange} byMonth={byMonth} active={active} />
      </div>
    </div>
  );
}

// ─── Vertical Timeline ────────────────────────────────────────────────────────

function VerticalTimeline({
  monthRange,
  byMonth,
  active,
}: {
  monthRange: string[];
  byMonth: Map<string, TimelineModel[]>;
  active: Record<Category, boolean>;
}) {
  const years = groupByYear(monthRange);

  return (
    <div className="px-8 py-8 flex flex-col gap-12">
      {Object.entries(years).map(([year, months]) => (
        <YearSection key={year} year={year} months={months} byMonth={byMonth} active={active} />
      ))}
    </div>
  );
}

function YearSection({
  year, months, byMonth, active,
}: {
  year: string;
  months: string[];
  byMonth: Map<string, TimelineModel[]>;
  active: Record<Category, boolean>;
}) {
  const hasAnyVisible = months.some(
    (ym) => (byMonth.get(ym) ?? []).some((m) => active[m.category])
  );
  if (!hasAnyVisible) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <span className="font-mono text-primary text-3xl font-bold leading-none">{year}</span>
        <div className="flex-1 h-px bg-outline-variant/30" />
      </div>
      {months.map((ym) => {
        const visibleModels = (byMonth.get(ym) ?? []).filter((m) => active[m.category]);
        if (visibleModels.length === 0) return null;
        const monthIdx = Number(ym.split("-")[1]) - 1;
        return (
          <div key={ym} className="flex gap-6">
            <div className="w-12 shrink-0 pt-1">
              <span className="font-mono text-[11px] uppercase tracking-wider text-gray-500">
                {MONTH_NAMES[monthIdx]}
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              {visibleModels.map((model) => (
                <TimelineModelCard key={model.id} model={model} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Model Card ───────────────────────────────────────────────────────────────

function TimelineModelCard({ model }: { model: TimelineModel }) {
  const cfg = CATEGORY_CONFIG[model.category];

  return (
    <Link
      href={model.href}
      className="w-[220px] block bg-surface-low hover:bg-surface-high border border-outline-variant/10 hover:border-outline-variant/30 p-3 relative overflow-hidden transition-colors no-underline group"
    >
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-outline-variant/40" />
      <div className={`inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest mb-2 ${cfg.color}`}>
        <span className={`w-1.5 h-1.5 shrink-0 ${cfg.color.replace("text-","bg-")}`} />
        {cfg.label}
      </div>
      <div className="font-display font-bold text-sm text-white group-hover:text-primary transition-colors leading-tight mb-1">
        {model.name}
      </div>
      <div className="font-mono text-[10px] text-gray-500 mb-3">{model.creator}</div>
      <div className="bg-surface-highest border border-outline-variant/10 p-2 flex gap-4">
        <div className="flex flex-col gap-0.5">
          <span className="font-mono text-[9px] uppercase text-gray-600">Params</span>
          <span className="font-mono text-xs text-gray-300">{model.params}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="font-mono text-[9px] uppercase text-gray-600">{model.benchmarkLabel}</span>
          <span className="font-mono text-xs text-primary">{model.benchmarkValue}</span>
        </div>
      </div>
      <div className="mt-2 font-mono text-[10px] text-gray-600 group-hover:text-primary transition-colors text-right">
        View →
      </div>
    </Link>
  );
}

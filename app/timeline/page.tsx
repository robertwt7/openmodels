"use client";

import { useState, useRef, useCallback } from "react";
import modelsData from "@/data/models.json";
import { Category } from "@/lib/benchmarks";

// ─── Types ───────────────────────────────────────────────────────────────────

type LLMModel = (typeof modelsData.llm)[number];
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
  // start and end are "YYYY-MM"
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

function normaliseModels(): TimelineModel[] {
  const llms: TimelineModel[] = modelsData.llm.map((m: LLMModel) => ({
    id: m.id,
    name: m.name,
    creator: m.creator,
    category: "llm" as Category,
    params: m.params,
    releaseDate: m.releaseDate,
    benchmarkLabel: "MMLU-Pro",
    benchmarkValue: m.benchmarks.mmluPro != null ? `${m.benchmarks.mmluPro}%` : "—",
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

// Month range is always computed across ALL models regardless of active filters
// so the axis never shifts when toggling categories.
function computeMonthRange(all: TimelineModel[]): string[] {
  const dates = all.map((m) => toYearMonth(m.releaseDate)).sort();
  if (dates.length === 0) return [];
  // Pad to full year boundaries
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

const MONTH_NAMES = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

// ─── Category config ──────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<Category, { label: string; color: string; borderColor: string }> = {
  llm:      { label: "LLM",      color: "text-primary",            borderColor: "border-primary/50" },
  diffusion:{ label: "Diffusion",color: "text-secondary-container", borderColor: "border-secondary-container/50" },
  audio:    { label: "Audio",    color: "text-[#00BFFF]",          borderColor: "border-[#00BFFF]/50" },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TimelinePage() {
  const allModels = normaliseModels();
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
    const max = el.scrollWidth - el.clientWidth;
    setScrollProgress(max > 0 ? el.scrollLeft / max : 0);
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
        {/* Progress bar */}
        <div className="h-[2px] bg-outline-variant/20 w-full rounded-none overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-75"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>
      </header>

      {/* ── Scrollable timeline (ruler + cards) ── */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-x-auto overflow-y-hidden"
        style={{ scrollSnapType: "x mandatory", overscrollBehaviorX: "contain" }}
      >
        {/* Ruler + cards share one wide flex row */}
        <div className="flex flex-col h-full" style={{ width: "max-content" }}>
          <TimelineRuler monthRange={monthRange} byMonth={byMonth} active={active} />
          <CardsArea monthRange={monthRange} byMonth={byMonth} active={active} />
        </div>
      </div>
    </div>
  );
}

function TimelineRuler(_props: {
  monthRange: string[];
  byMonth: Map<string, TimelineModel[]>;
  active: Record<Category, boolean>;
}) {
  return <div className="h-20 bg-surface-lowest border-b border-outline-variant/20 flex items-end" />;
}

function CardsArea(_props: {
  monthRange: string[];
  byMonth: Map<string, TimelineModel[]>;
  active: Record<Category, boolean>;
}) {
  return <div className="flex-1 flex" />;
}

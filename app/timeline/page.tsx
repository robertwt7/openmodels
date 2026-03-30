"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
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

// ─── Placeholder export (will be replaced in Task 3) ─────────────────────────

export default function TimelinePage() {
  return <div className="font-mono text-primary p-8">TIMELINE // WIP</div>;
}

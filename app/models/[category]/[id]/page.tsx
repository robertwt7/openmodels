"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Zap, Activity, Calendar, Cpu, ExternalLink } from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import modelsData from "@/data/models.json";
import {
  benchmarkMeta,
  categoryBenchmarks,
  categoryLabels,
  type Category,
} from "@/lib/benchmarks";
import { BenchmarkTooltip } from "@/components/BenchmarkTooltip";
import { useLeaderboardFull } from "@/lib/hooks/useLeaderboardFull";
import type { LiveModel } from "@/lib/hf-api";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#2f3445] border border-[#454932]/30 p-3 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
        <p className="font-mono font-bold text-white text-xs uppercase mb-1">{label}</p>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {payload.map((entry: any, index: number) => (
          <p key={index} className="font-mono text-xs" style={{ color: entry.color }}>
            {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function ModelDetailPage({
  params,
}: {
  params: Promise<{ category: string; id: string }>;
}) {
  const { category, id } = use(params);

  const validCategory = (["llm", "diffusion", "audio"] as const).includes(category as Category)
    ? (category as Category)
    : null;

  if (!validCategory) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center py-20">
        <p className="font-mono text-gray-500">CATEGORY NOT FOUND</p>
        <Link href="/" className="text-primary font-mono text-sm underline">Return to index</Link>
      </div>
    );
  }

  if (validCategory === "llm") {
    return <LLMDetail id={id} />;
  }

  return <StaticDetail category={validCategory} id={id} />;
}

// ─── LLM Detail (live data) ───────────────────────────────────────────────────

function LLMDetail({ id }: { id: string }) {
  const { data: liveData, isLoading } = useLeaderboardFull();
  const allModels: LiveModel[] = liveData?.models ?? [];
  const model = allModels.find((m) => m.id === id);
  const benchKeys = categoryBenchmarks.llm;
  const categoryLabel = categoryLabels.llm;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 animate-pulse">
        <div className="h-6 bg-surface-highest rounded w-32" />
        <div className="h-12 bg-surface-highest rounded w-96" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-surface-highest rounded" />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-32 bg-surface-highest rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center py-20">
        <p className="font-mono text-gray-500">MODEL NOT FOUND</p>
        <Link href="/" className="text-primary font-mono text-sm underline">Return to index</Link>
      </div>
    );
  }

  // Compute peer subset: top 5 by average + bottom 3 + ±5 around current model
  const sortedByAvg = [...allModels].sort((a, b) => {
    const av = a.benchmarks.average ?? 0;
    const bv = b.benchmarks.average ?? 0;
    return bv - av;
  });
  const currentRank = sortedByAvg.findIndex((m) => m.id === model.id);
  const peerIdxSet = new Set<number>();
  // top 5
  for (let i = 0; i < Math.min(5, sortedByAvg.length); i++) peerIdxSet.add(i);
  // bottom 3
  for (let i = Math.max(0, sortedByAvg.length - 3); i < sortedByAvg.length; i++) peerIdxSet.add(i);
  // ±5 around current
  for (let i = Math.max(0, currentRank - 5); i <= Math.min(sortedByAvg.length - 1, currentRank + 5); i++) peerIdxSet.add(i);
  const peerModels = [...peerIdxSet].sort((a, b) => a - b).map((i) => sortedByAvg[i]);

  return (
    <DetailView
      model={model}
      allModels={allModels}
      peerModels={peerModels}
      benchKeys={benchKeys}
      categoryLabel={categoryLabel}
      validCategory="llm"
      isLive={true}
      currentRank={currentRank + 1}
      totalModels={sortedByAvg.length}
    />
  );
}

// ─── Static Detail (diffusion/audio) ─────────────────────────────────────────

function StaticDetail({ category, id }: { category: "diffusion" | "audio"; id: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allModels = (modelsData as any)[category] as any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const model = allModels.find((m: any) => m.id === id);
  const benchKeys = categoryBenchmarks[category];
  const categoryLabel = categoryLabels[category];

  if (!model) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center py-20">
        <p className="font-mono text-gray-500">MODEL NOT FOUND</p>
        <Link href={`/${category}`} className="text-primary font-mono text-sm underline">Return to index</Link>
      </div>
    );
  }

  return (
    <DetailView
      model={model}
      allModels={allModels}
      peerModels={allModels}
      benchKeys={benchKeys}
      categoryLabel={categoryLabel}
      validCategory={category}
      isLive={false}
    />
  );
}

// ─── Shared Detail View ───────────────────────────────────────────────────────

function DetailView({
  model,
  allModels,
  peerModels,
  benchKeys,
  categoryLabel,
  validCategory,
  isLive,
  currentRank,
  totalModels,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  allModels: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  peerModels: any[];
  benchKeys: string[];
  categoryLabel: string;
  validCategory: Category;
  isLive: boolean;
  currentRank?: number;
  totalModels?: number;
}) {
  const backHref = validCategory === "llm" ? "/" : `/${validCategory}`;

  // Radar chart data
  const radarData = benchKeys
    .filter((k) => model.benchmarks[k] != null)
    .map((k) => {
      const meta = benchmarkMeta[k];
      const val = model.benchmarks[k] as number;
      const allVals = allModels
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((m: any) => m.benchmarks[k] as number | null)
        .filter((v): v is number => v != null);
      const max = Math.max(...allVals);
      const min = Math.min(...allVals);
      const range = max - min || 1;
      const normalized = meta.lowerIsBetter
        ? ((max - val) / range) * 100
        : ((val - min) / range) * 100;
      return { subject: meta.label, value: Math.round(normalized), raw: val };
    });

  // Peer benchmark data
  const peerData = benchKeys
    .filter((k) => model.benchmarks[k] != null)
    .map((k) => {
      const meta = benchmarkMeta[k];
      const val = model.benchmarks[k] as number;
      const allVals = allModels
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((m: any) => m.benchmarks[k] as number | null)
        .filter((v): v is number => v != null);
      const best = meta.lowerIsBetter ? Math.min(...allVals) : Math.max(...allVals);
      const avg = allVals.reduce((a, b) => a + b, 0) / allVals.length;
      const sorted = meta.lowerIsBetter
        ? [...allVals].sort((a, b) => a - b)
        : [...allVals].sort((a, b) => b - a);
      const rank = sorted.indexOf(val) + 1;
      return {
        benchmark: meta.label, key: k, value: val, best,
        average: Math.round(avg * 100) / 100,
        rank, total: allVals.length,
        lowerIsBetter: meta.lowerIsBetter, unit: meta.unit, description: meta.description,
      };
    });

  // Bar chart data
  const comparisonBarData = benchKeys
    .filter((k) => model.benchmarks[k] != null)
    .map((k) => {
      const meta = benchmarkMeta[k];
      const val = model.benchmarks[k] as number;
      const allVals = allModels
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((m: any) => m.benchmarks[k] as number | null)
        .filter((v): v is number => v != null);
      const max = Math.max(...allVals);
      const min = Math.min(...allVals);
      const range = max - min || 1;
      const normalized = meta.lowerIsBetter
        ? ((max - val) / range) * 100
        : ((val - min) / range) * 100;
      return { benchmark: meta.label, score: Math.round(normalized) };
    });

  return (
    <>
      {/* Navigation */}
      <div className="flex items-center gap-4 font-mono text-sm animate-boot">
        <Link href={backHref} className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
          BACK
        </Link>
        <span className="text-outline-variant">/</span>
        <Link href={backHref} className="text-gray-500 hover:text-primary transition-colors uppercase">
          {categoryLabel}
        </Link>
        <span className="text-outline-variant">/</span>
        <span className="text-primary uppercase">{model.name}</span>
      </div>

      {/* Header */}
      <header className="flex flex-col gap-4 animate-boot border-b border-outline-variant/20 pb-8">
        <div className="flex items-center gap-4 text-primary font-mono text-sm">
          <span className="w-2 h-2 bg-primary"></span>
          MODEL_DETAIL: {categoryLabel.toUpperCase()}
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white uppercase">
            {model.name}
          </h1>
          <span className="text-xs font-mono border border-outline-variant/20 px-3 py-1 text-gray-400">
            {model.architecture}
          </span>
          {isLive && model.isMoE && (
            <span className="text-xs font-mono border border-secondary-container/30 px-3 py-1 text-secondary-container">
              MoE
            </span>
          )}
          {isLive && model.type && (
            <span className="text-xs font-mono border border-outline-variant/10 px-3 py-1 text-gray-500 uppercase">
              {model.type}
            </span>
          )}
          {model.huggingFaceId && (
            <a
              href={`https://huggingface.co/${model.huggingFaceId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-mono border border-primary/30 px-3 py-1 text-primary hover:bg-primary/10 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              HuggingFace
            </a>
          )}
        </div>
        {/* Description only available for static models */}
        {!isLive && model.description && (
          <p className="text-gray-400 font-body max-w-2xl text-lg">{model.description}</p>
        )}
        {/* Attribution for live models */}
        {isLive && (
          <p className="text-xs font-mono text-gray-600">
            Benchmark data:{" "}
            <a
              href="https://huggingface.co/datasets/open-llm-leaderboard/contents"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-primary transition-colors"
            >
              open-llm-leaderboard/contents
            </a>
            {" "}· HuggingFace
            {currentRank && totalModels && (
              <span className="ml-3 text-gray-600">Rank #{currentRank} of {totalModels}</span>
            )}
          </p>
        )}
      </header>

      {/* Metadata Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <MetaStat icon={Zap} label="Creator" value={model.creator} />
        <MetaStat
          icon={Calendar}
          label="Released"
          value={model.releaseDate ?? "—"}
        />
        <MetaStat icon={Cpu} label="Parameters" value={model.params} />
        {/* Context only available for static models */}
        {!isLive && model.context && (
          <MetaStat icon={Activity} label="Context" value={model.context} />
        )}
        {isLive && model.license && (
          <MetaStat icon={Activity} label="License" value={model.license} />
        )}
        <MetaStat icon={Activity} label="Category" value={categoryLabel} />
      </div>

      {/* Benchmark Scores */}
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-widest text-primary flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-primary"></span>
          Benchmark Readout
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {peerData.map((d) => (
            <BenchmarkCard key={d.key} data={d} />
          ))}
        </div>
      </section>

      {/* Radar Chart */}
      {radarData.length > 0 && (
        <section className="bg-surface-low border border-outline-variant/20 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-outline-variant/30 pointer-events-none"></div>
          <h2 className="font-mono text-xs uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
            &#9672; Performance Profile
            <span className="text-gray-500 font-normal">&mdash; Normalized scores (higher = better)</span>
          </h2>
          <div className="h-[400px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#454932" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#e0e6f8", fontSize: 12, fontFamily: "var(--font-jetbrains-mono)" }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#e0e6f8", fontSize: 10 }} />
                <Radar name={model.name} dataKey="value" stroke="#DFFF00" fill="#DFFF00" fillOpacity={0.2} />
                <Tooltip content={<ChartTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {/* Comparative Position */}
      {comparisonBarData.length > 0 && (
        <section className="bg-surface-low border border-outline-variant/20 p-6 relative overflow-hidden">
          <h2 className="font-mono text-xs uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
            &#9638; Category Standing
            <span className="text-gray-500 font-normal">&mdash; Position relative to peers (0 = worst, 100 = best)</span>
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonBarData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#454932" opacity={0.3} horizontal={false} />
                <XAxis type="number" domain={[0, 100]} stroke="#e0e6f8" fontFamily="var(--font-jetbrains-mono)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="benchmark" width={100} stroke="#e0e6f8" fontFamily="var(--font-jetbrains-mono)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="score" radius={[0, 2, 2, 0]}>
                  {comparisonBarData.map((entry, index) => (
                    <Cell key={index} fill={entry.score >= 80 ? "#DFFF00" : entry.score >= 50 ? "#FFBF00" : "#60a5fa"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {/* Peer Table */}
      <section className="bg-surface-lowest border border-outline-variant/20 overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant/20 flex items-center justify-between">
          <h2 className="font-mono text-xs uppercase tracking-widest text-primary flex items-center gap-2">
            &#9633; Peer Comparison
          </h2>
          {isLive && totalModels && peerModels.length < totalModels && (
            <span className="text-xs font-mono text-gray-600">
              Showing {peerModels.length} of {totalModels} models (top, bottom, nearby)
            </span>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-sm whitespace-nowrap">
            <thead className="bg-surface-high border-b border-outline-variant/30 text-xs uppercase tracking-wider text-gray-400">
              <tr>
                <th className="px-6 py-3 font-normal">Model</th>
                {benchKeys.map((k) => {
                  const meta = benchmarkMeta[k];
                  return (
                    <th key={k} className="px-6 py-3 font-normal">
                      <BenchmarkTooltip label={meta.label} description={meta.description} lowerIsBetter={meta.lowerIsBetter} />
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 text-gray-300">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {peerModels.map((m: any) => (
                <tr
                  key={m.id}
                  className={`transition-colors ${
                    m.id === model.id ? "bg-primary/5 border-l-2 border-l-primary" : "hover:bg-surface-low"
                  }`}
                >
                  <td className={`px-6 py-3 font-bold ${m.id === model.id ? "text-primary" : "text-white"}`}>
                    {m.id === model.id ? (
                      m.name
                    ) : (
                      <Link href={`/models/${validCategory}/${m.id}`} className="hover:text-primary transition-colors">
                        {m.name}
                      </Link>
                    )}
                  </td>
                  {benchKeys.map((k) => {
                    const val = m.benchmarks[k];
                    return (
                      <td key={k} className="px-6 py-3">
                        {val != null ? val : <span className="text-gray-600">&mdash;</span>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function MetaStat({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="bg-surface-low border border-outline-variant/10 p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
        <Icon className="w-3 h-3 text-primary" />
        {label}
      </div>
      <span className="font-mono text-white text-sm">{value}</span>
    </div>
  );
}

function BenchmarkCard({ data }: {
  data: {
    benchmark: string; key: string; value: number; best: number;
    average: number; rank: number; total: number;
    lowerIsBetter: boolean; unit: string; description: string;
  };
}) {
  const isBest = (data.lowerIsBetter && data.value <= data.best) || (!data.lowerIsBetter && data.value >= data.best);
  const allRange = data.lowerIsBetter
    ? data.best === data.average ? 100 : ((data.average - data.value) / (data.average - data.best)) * 100
    : data.best === 0 ? 100 : (data.value / data.best) * 100;
  const barPercent = Math.max(0, Math.min(100, allRange));

  return (
    <div className="bg-surface-low border border-outline-variant/10 p-4 flex flex-col gap-3 relative overflow-hidden">
      {isBest && (
        <div className="absolute top-0 right-0 bg-primary text-on-primary text-[9px] font-mono uppercase px-2 py-0.5">Best</div>
      )}
      <div className="flex items-center justify-between">
        <BenchmarkTooltip label={data.benchmark} description={data.description} lowerIsBetter={data.lowerIsBetter} />
        <span className="font-mono text-xs text-gray-500">#{data.rank}/{data.total}</span>
      </div>
      <div className="font-mono text-2xl text-white font-bold">
        {data.value}<span className="text-sm text-gray-500">{data.unit}</span>
      </div>
      <div className="h-1.5 bg-surface-highest w-full">
        <div
          className="h-full transition-all"
          style={{
            width: `${barPercent}%`,
            backgroundColor: isBest ? "#DFFF00" : barPercent >= 70 ? "#DFFF00" : barPercent >= 40 ? "#FFBF00" : "#60a5fa",
          }}
        />
      </div>
      <div className="flex justify-between text-[10px] font-mono text-gray-500 uppercase">
        <span>Avg: {data.average}{data.unit}</span>
        <span>Best: {data.best}{data.unit}</span>
      </div>
    </div>
  );
}

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
    const categoryModels = (modelsData as any)[activeCategory] as any[];
    setSelectedModelIds([
      categoryModels[0].id,
      categoryModels[1]?.id ?? categoryModels[0].id,
    ]);
  }, [activeCategory]);

  const models = (modelsData as any)[activeCategory] as any[];
  const selectedModels = selectedModelIds
    .map((id) => models.find((m: any) => m.id === id))
    .filter(Boolean) as any[];

  const benchmarkKeys = selectedModels.length > 0 ? Object.keys(selectedModels[0].benchmarks) : [];

  const addNode = () => {
    if (selectedModelIds.length >= 5) return;
    const next = models.find((m: any) => !selectedModelIds.includes(m.id));
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

  const barChartData = benchmarkKeys.map((key) => {
    const entry: Record<string, string | number | null> = { benchmark: key.toUpperCase() };
    selectedModels.forEach((m: any) => {
      entry[m.name] = m.benchmarks[key] ?? null;
    });
    return entry;
  });

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
        {/* Category selector */}
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

        {/* Nodes */}
        <div className="flex flex-col gap-4">
          <span className="text-primary text-xs uppercase tracking-widest">
            Nodes ({selectedModelIds.length}/5)
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedModelIds.map((modelId, index) => (
              <div key={index} className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs uppercase tracking-widest"
                    style={{ color: colors[index] }}
                  >
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
                  <span className="mr-2 shrink-0 text-xs" style={{ color: colors[index] }}>
                    {">"}
                  </span>
                  <div className="relative flex-1">
                    <select
                      value={modelId}
                      onChange={(e) => updateNode(index, e.target.value)}
                      className="appearance-none bg-transparent w-full border-b-2 border-outline-variant/40 focus:border-primary pb-1 text-white outline-none cursor-pointer transition-colors pr-6 text-sm"
                    >
                      {models.map((m: any) => (
                        <option key={m.id} value={m.id} className="bg-surface-highest">
                          {m.name}
                        </option>
                      ))}
                    </select>
                    <span
                      className="absolute right-0 bottom-1.5 pointer-events-none text-xs leading-none"
                      style={{ color: colors[index] }}
                    >
                      ▼
                    </span>
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
      <section className="bg-surface-low border border-outline-variant/20 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-outline-variant/30 pointer-events-none"></div>
        <h2 className="font-mono text-xs uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
          ▦ Benchmark Array —{" "}
          <span className="text-gray-500 font-normal flex items-center gap-2">
            {benchmarkKeys.map((k, i) => {
              const info = benchmarkInfo[k];
              return (
                <span key={k} className="flex items-center gap-1">
                  {i > 0 && <span className="text-gray-700 mx-1">/</span>}
                  {info ? (
                    <BenchmarkTooltip
                      label={k.toUpperCase()}
                      description={info.description}
                      lowerIsBetter={info.lowerIsBetter}
                    />
                  ) : (
                    k.toUpperCase()
                  )}
                </span>
              );
            })}
          </span>
        </h2>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#454932" opacity={0.3} vertical={false} />
              <XAxis
                dataKey="benchmark"
                stroke="#e0e6f8"
                fontFamily="var(--font-jetbrains-mono)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#e0e6f8"
                fontFamily="var(--font-jetbrains-mono)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#2f3445", opacity: 0.4 }} />
              <Legend
                wrapperStyle={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "12px" }}
                iconType="square"
              />
              {selectedModels.map((m: any, i: number) => (
                <Bar key={m.id} dataKey={m.name} fill={colors[i % colors.length]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Radar Chart */}
      <section className="bg-surface-low border border-outline-variant/20 p-6 relative overflow-hidden">
        <h2 className="font-mono text-xs uppercase tracking-widest text-primary mb-6">
          ◈ Node Comparison —{" "}
          <span className="text-gray-500 font-normal">
            {selectedModels.map((m: any) => m.name).join(" vs ")}
          </span>
        </h2>
        <div className="h-[500px] w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarChartData}>
              <PolarGrid stroke="#454932" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: "#e0e6f8", fontSize: 12, fontFamily: "var(--font-jetbrains-mono)" }}
              />
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
              <Legend
                wrapperStyle={{
                  fontFamily: "var(--font-jetbrains-mono)",
                  fontSize: "12px",
                  marginTop: "20px",
                }}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </>
  );
}

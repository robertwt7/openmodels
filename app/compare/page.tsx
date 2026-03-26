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

export default function ComparePage() {
  const [activeCategory, setActiveCategory] = useState<keyof typeof modelsData>("llm");
  const [modelAId, setModelAId] = useState(modelsData.llm[0].id);
  const [modelBId, setModelBId] = useState(modelsData.llm[1].id);

  useEffect(() => {
    const categoryModels = (modelsData as any)[activeCategory];
    setModelAId(categoryModels[0].id);
    setModelBId(categoryModels[1]?.id || categoryModels[0].id);
  }, [activeCategory]);

  const models = (modelsData as any)[activeCategory];
  const modelA = models.find((m: any) => m.id === modelAId) || models[0];
  const modelB = models.find((m: any) => m.id === modelBId) || models[1] || models[0];
  
  const benchmarkKeys = Object.keys(modelA.benchmarks);

  // Formatting data for the bar chart - show all models in category
  const barChartData = models.map((m: any) => {
    const entry: any = { name: m.name };
    benchmarkKeys.forEach(key => {
      entry[key] = m.benchmarks[key];
    });
    return entry;
  });

  // Reshape data for radar chart comparing selected Node Alpha vs Node Beta
  const radarChartData = benchmarkKeys.map((key) => {
    return {
      subject: key.toUpperCase(),
      [modelA.name]: (modelA.benchmarks as any)[key],
      [modelB.name]: (modelB.benchmarks as any)[key],
    };
  });

  // Customizing Recharts Tooltip for the Kinetic Mainframe Theme
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface-highest border border-outline-variant/30 p-4 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
          <p className="font-display font-bold text-white mb-2 uppercase">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="font-mono text-sm flex gap-4 justify-between" style={{ color: entry.color }}>
              <span className="uppercase">{entry.name}:</span>
              <span>{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const colors = ["#DFFF00", "#FFBF00", "#60a5fa", "#f472b6", "#a78bfa"];

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
          Analyze raw cognitive output capabilities.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-surface-lowest border border-outline-variant/30 mb-8 font-mono text-sm">
        <div className="flex flex-col gap-2">
          <label className="text-primary text-xs uppercase tracking-widest">Category</label>
          <select 
            value={activeCategory} 
            onChange={(e) => setActiveCategory(e.target.value as any)}
            className="bg-surface-highest border border-outline-variant/30 p-2 text-white outline-none focus:border-primary cursor-pointer hover:border-primary/50 transition-colors"
          >
            <option value="llm">LLM</option>
            <option value="diffusion">DIFFUSION</option>
            <option value="audio">AUDIO</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-primary text-xs uppercase tracking-widest">Node Alpha</label>
          <select 
            value={modelAId} 
            onChange={(e) => setModelAId(e.target.value)}
            className="bg-surface-highest border border-outline-variant/30 p-2 text-white outline-none focus:border-primary cursor-pointer hover:border-primary/50 transition-colors"
          >
            {models.map((m: any) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-primary text-xs uppercase tracking-widest">Node Beta</label>
          <select 
            value={modelBId} 
            onChange={(e) => setModelBId(e.target.value)}
            className="bg-surface-highest border border-outline-variant/30 p-2 text-white outline-none focus:border-primary cursor-pointer hover:border-primary/50 transition-colors"
          >
            {models.map((m: any) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
      </div>

      <section className="bg-surface-low border border-outline-variant/20 p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-outline-variant/30"></div>
        <h2 className="font-mono text-xs uppercase tracking-widest text-primary mb-8 flex items-center gap-2">
          <BarChart2Icon className="w-4 h-4" />
          Benchmark Array ({benchmarkKeys.map(k => k.toUpperCase()).join(" vs ")})
        </h2>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barChartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#454932" opacity={0.3} vertical={false} />
              <XAxis dataKey="name" stroke="#e0e6f8" fontFamily="var(--font-jetbrains-mono)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#e0e6f8" fontFamily="var(--font-jetbrains-mono)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#2f3445', opacity: 0.4 }} />
              <Legend wrapperStyle={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: '12px' }} iconType="square" />
              {benchmarkKeys.map((key, index) => (
                <Bar key={key} dataKey={key} fill={colors[index % colors.length]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="bg-surface-low border border-outline-variant/20 p-6 relative overflow-hidden">
        <h2 className="font-mono text-xs uppercase tracking-widest text-primary mb-8 flex items-center gap-2">
          <RadarIcon className="w-4 h-4" />
          Node Comparison: {modelA.name} vs {modelB.name}
        </h2>
        <div className="h-[500px] w-full flex items-center justify-center">
           <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarChartData}>
                <PolarGrid stroke="#454932" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#e0e6f8', fontSize: 12, fontFamily: 'var(--font-jetbrains-mono)' }} />
                <PolarRadiusAxis angle={30} tick={{ fill: '#e0e6f8', fontSize: 10 }} />
                <Radar name={modelA.name} dataKey={modelA.name} stroke="#DFFF00" fill="#DFFF00" fillOpacity={0.2} />
                <Radar name={modelB.name} dataKey={modelB.name} stroke="#FFBF00" fill="#FFBF00" fillOpacity={0.2} />
                <Legend wrapperStyle={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: '12px', marginTop: '20px' }} />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
           </ResponsiveContainer>
        </div>
      </section>
    </>
  );
}

// Simple icons for the headers since we can't import lucide directly inside the client component easily without mixing up the imports in this file block cleanly
function BarChart2Icon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
  );
}

function RadarIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19.07 4.93A10 10 0 0 0 6.99 3.34"/><path d="M4 6h.01"/><path d="M2.29 9.62A10 10 0 1 0 21.31 8.35"/><path d="M16.24 7.76A6 6 0 1 0 8.23 16.67"/><path d="M12 18h.01"/><path d="M17.99 11.66A6 6 0 0 1 15.77 16.67"/><circle cx="12" cy="12" r="2"/><path d="m13.41 10.59 5.66-5.66"/></svg>
  );
}
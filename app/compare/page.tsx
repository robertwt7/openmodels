"use client";

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
  const models = modelsData.llm;

  // Formatting data for the bar chart
  const barChartData = models.map((m) => ({
    name: m.name,
    MMLU: m.benchmarks.mmlu,
    HumanEval: m.benchmarks.humanEval,
    GSM8K: m.benchmarks.gsm8k,
  }));

  // Reshape data for radar chart comparing top 2 models
  const radarChartData = Object.keys(models[0].benchmarks).map((key) => {
    return {
      subject: key.toUpperCase(),
      [models[0].name]: (models[0].benchmarks as any)[key],
      [models[1].name]: (models[1].benchmarks as any)[key],
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
              <span>{entry.value}%</span>
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
          Visual comparative analysis of LLM performance across major benchmarks. 
          Analyze raw cognitive output capabilities.
        </p>
      </header>

      <section className="bg-surface-low border border-outline-variant/20 p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-outline-variant/30"></div>
        <h2 className="font-mono text-xs uppercase tracking-widest text-primary mb-8 flex items-center gap-2">
          <BarChart2Icon className="w-4 h-4" />
          Benchmark Array (MMLU vs HumanEval vs GSM8K)
        </h2>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barChartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#454932" opacity={0.3} vertical={false} />
              <XAxis dataKey="name" stroke="#e0e6f8" fontFamily="var(--font-jetbrains-mono)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#e0e6f8" fontFamily="var(--font-jetbrains-mono)" fontSize={12} domain={[60, 100]} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#2f3445', opacity: 0.4 }} />
              <Legend wrapperStyle={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: '12px' }} iconType="square" />
              <Bar dataKey="MMLU" fill="#DFFF00" />
              <Bar dataKey="HumanEval" fill="#FFBF00" />
              <Bar dataKey="GSM8K" fill="#60a5fa" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="bg-surface-low border border-outline-variant/20 p-6 relative overflow-hidden">
        <h2 className="font-mono text-xs uppercase tracking-widest text-primary mb-8 flex items-center gap-2">
          <RadarIcon className="w-4 h-4" />
          Multivariate Capability Spread
        </h2>
        <div className="h-[500px] w-full flex items-center justify-center">
           <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarChartData}>
                <PolarGrid stroke="#454932" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#e0e6f8', fontSize: 12, fontFamily: 'var(--font-jetbrains-mono)' }} />
                <PolarRadiusAxis angle={30} domain={[60, 100]} tick={{ fill: '#e0e6f8', fontSize: 10 }} />
                <Radar name={models[0].name} dataKey={models[0].name} stroke="#DFFF00" fill="#DFFF00" fillOpacity={0.2} />
                <Radar name={models[1].name} dataKey={models[1].name} stroke="#FFBF00" fill="#FFBF00" fillOpacity={0.2} />
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
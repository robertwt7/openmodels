import Link from "next/link";
import { Zap, Activity } from "lucide-react";
import modelsData from "@/data/models.json";

export default function AudioPage() {
  const models = modelsData.audio;

  return (
    <>
      <header className="flex flex-col gap-6 animate-boot">
        <div className="flex items-center gap-4 text-primary font-mono text-sm">
          <span className="w-2 h-2 bg-primary"></span>
          SYSTEM BOOT: AUDIO_MODELS
        </div>
        <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-white uppercase leading-none">
          Open Source <br />
          <span className="text-primary opacity-90 drop-shadow-[0_0_20px_rgba(223,255,0,0.15)]">
            Acoustics
          </span>
        </h1>
        <p className="max-w-2xl text-lg text-gray-400 font-body">
          Open-weight speech recognition, synthesis, and audio translation models.
          Benchmarked on WER, latency, and multilingual coverage.
        </p>
      </header>

      {/* Model Data Stream */}
      <section className="flex flex-col gap-8">
        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
          <h2 className="font-display text-2xl uppercase tracking-wider text-white">
            Audio Stream <span className="animate-blink text-primary">_</span>
          </h2>
          <div className="text-xs font-mono text-secondary-container bg-secondary-container/10 px-3 py-1 border border-secondary-container/20 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-secondary-container"></span>
            {models.length} MODELS
          </div>
        </div>

        <div className="grid gap-4">
          {models.map((model) => (
            <AudioModelCard key={model.id} model={model} />
          ))}
        </div>
      </section>
    </>
  );
}

function AudioModelCard({ model }: { model: (typeof modelsData.audio)[number] }) {
  return (
    <Link href={`/models/audio/${model.id}`} className="bg-surface-low hover:bg-surface-high transition-colors p-6 flex flex-col lg:flex-row gap-6 lg:items-center justify-between group relative overflow-hidden border border-outline-variant/10 no-underline">
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-outline-variant/40"></div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h3 className="font-display text-xl font-bold text-white group-hover:text-primary transition-colors">{model.name}</h3>
          <div className="text-xs font-mono border border-outline-variant/20 px-2 py-0.5 text-gray-400">
            {model.architecture}
          </div>
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

      <div className="flex flex-col sm:flex-row gap-4 lg:items-center shrink-0">
        <div className="bg-surface-highest p-4 rounded-sm flex gap-6 border border-outline-variant/10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-gray-500 font-mono uppercase">Params</span>
            <span className="font-mono text-white text-sm">{model.params}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-gray-500 font-mono uppercase">WER %</span>
            <span className="font-mono text-primary text-sm">{model.benchmarks.wer}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-gray-500 font-mono uppercase">Latency</span>
            <span className="font-mono text-secondary-container text-sm">{model.benchmarks.latency}s</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-gray-500 font-mono uppercase">Multi%</span>
            <span className="font-mono text-white text-sm">{model.benchmarks.multilingual}</span>
          </div>
        </div>

        <span className="h-full px-4 border border-outline-variant/20 group-hover:border-primary/50 text-primary font-mono text-xs uppercase flex items-center justify-center transition-colors bg-surface-lowest group-hover:bg-primary/5">
          View &rarr;
        </span>
      </div>
    </Link>
  );
}

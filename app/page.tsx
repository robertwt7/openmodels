import { Activity, Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="grid grid-cols-12 min-h-screen">
      {/* Structural Framing: Left Scanline / Metadata column */}
      <div className="col-span-1 hidden md:flex flex-col border-r border-outline-variant/20 pt-8 items-center text-outline-variant text-xs font-mono tracking-widest uppercase writing-vertical-rl">
        <div className="rotate-180" style={{ writingMode: "vertical-rl" }}>
          SYS_STATUS: ONLINE // UPLINK_ESTABLISHED
        </div>
      </div>

      <div className="col-span-12 md:col-span-11 p-8 lg:p-16 flex flex-col gap-16">
        {/* Header / Hero */}
        <header className="flex flex-col gap-6 animate-boot">
          <div className="flex items-center gap-4 text-primary font-mono text-sm">
            <span className="w-2 h-2 bg-primary"></span>
            SYSTEM BOOT: OPEN_MODELS_DB
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
          <div className="flex gap-4 mt-4 font-mono">
            <button className="bg-primary text-on-primary px-6 py-3 rounded text-sm font-bold uppercase shadow-[0_0_20px_rgba(223,255,0,0.15)] hover:shadow-[0_0_30px_rgba(223,255,0,0.3)] transition-shadow border-t border-white/20">
              [ Connect to Matrix ]
            </button>
            <button className="px-6 py-3 rounded text-sm font-bold text-gray-300 uppercase border border-outline-variant/40 hover:bg-surface-high transition-colors">
              Read Docs
            </button>
          </div>
        </header>

        {/* Search / Input Field */}
        <section className="bg-surface-lowest p-6 rounded relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary/50 group-focus-within:bg-primary"></div>
          <div className="flex items-center gap-4">
            <span className="text-primary font-mono text-xl">{">"}</span>
            <input 
              type="text" 
              placeholder="Query models by name, architecture, or benchmark..." 
              className="bg-transparent w-full text-white font-mono placeholder:text-gray-600 outline-none border-b-2 border-outline-variant/40 focus:border-primary pb-2 transition-colors"
            />
          </div>
        </section>

        {/* Model Data Stream */}
        <section className="flex flex-col gap-8">
          <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
            <h2 className="font-display text-2xl uppercase tracking-wider text-white">
              Data Streams <span className="animate-blink">_</span>
            </h2>
            <div className="text-xs font-mono text-secondary-container bg-secondary-container/10 px-3 py-1 border border-secondary-container/20 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-secondary-container"></span>
              LIVE
            </div>
          </div>

          <div className="grid gap-4">
            {models.map((model) => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function ModelCard({ model }: { model: any }) {
  return (
    <div className="bg-surface-low hover:bg-surface-high transition-colors p-6 flex flex-col lg:flex-row gap-6 lg:items-center justify-between group relative overflow-hidden border border-outline-variant/10">
      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-outline-variant/40"></div>
      
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h3 className="font-display text-xl font-bold text-white">{model.name}</h3>
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
            <span className="text-[10px] text-gray-500 font-mono uppercase">MMLU</span>
            <span className="font-mono text-primary text-sm">{model.mmlu}%</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-gray-500 font-mono uppercase">Context</span>
            <span className="font-mono text-secondary-container text-sm">{model.context}</span>
          </div>
        </div>
        
        <button className="h-full px-4 border border-outline-variant/20 hover:border-primary/50 text-primary font-mono text-xs uppercase flex items-center justify-center transition-colors bg-surface-lowest hover:bg-primary/5">
          Load
        </button>
      </div>
    </div>
  );
}

const models = [
  {
    id: "llama-3-70b",
    name: "Llama 3 70B",
    architecture: "Transformer",
    description: "Highly capable foundation model trained on massive multilingual datasets.",
    creator: "Meta",
    releaseDate: "2024-04-18",
    params: "70B",
    mmlu: "82.0",
    context: "8k",
  },
  {
    id: "mixtral-8x22b",
    name: "Mixtral 8x22B",
    architecture: "MoE",
    description: "Sparse mixture-of-experts model providing high performance at lower inference cost.",
    creator: "Mistral AI",
    releaseDate: "2024-04-10",
    params: "141B",
    mmlu: "77.3",
    context: "64k",
  },
  {
    id: "qwen-1.5-72b",
    name: "Qwen 1.5 72B",
    architecture: "Transformer",
    description: "Robust multilingual model with strong reasoning and coding capabilities.",
    creator: "Alibaba Cloud",
    releaseDate: "2024-02-04",
    params: "72B",
    mmlu: "77.5",
    context: "32k",
  }
];

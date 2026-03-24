import { Trophy, ChevronDown } from "lucide-react";
import modelsData from "@/data/models.json";

export default function LeaderboardPage() {
  const models = [...modelsData.llm].sort((a, b) => b.benchmarks.mmlu - a.benchmarks.mmlu);

  return (
    <>
      <header className="flex flex-col gap-4 animate-boot border-b border-outline-variant/20 pb-8">
        <div className="flex items-center gap-4 text-secondary-container font-mono text-sm">
          <span className="w-2 h-2 bg-secondary-container"></span>
          SYS_RANK: GLOBAL_LEADERBOARD
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white uppercase">
          Neural <span className="text-secondary-container">Hierarchy</span>
        </h1>
        <p className="text-gray-400 font-body max-w-2xl">
          Live rankings of foundation models sorted by cumulative benchmark performance.
        </p>
      </header>

      <section className="bg-surface-lowest border border-outline-variant/20 overflow-x-auto shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <table className="w-full text-left font-mono text-sm whitespace-nowrap">
          <thead className="bg-surface-high border-b border-outline-variant/30 text-xs uppercase tracking-wider text-gray-400">
            <tr>
              <th className="px-6 py-4 font-normal">Rank</th>
              <th className="px-6 py-4 font-normal">Model</th>
              <th className="px-6 py-4 font-normal">Params</th>
              <th className="px-6 py-4 font-normal text-primary flex items-center gap-2">MMLU <ChevronDown className="w-3 h-3" /></th>
              <th className="px-6 py-4 font-normal">HumanEval</th>
              <th className="px-6 py-4 font-normal">GSM8K</th>
              <th className="px-6 py-4 font-normal">Math</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10 text-gray-300">
            {models.map((model, index) => (
              <tr key={model.id} className="hover:bg-surface-low transition-colors group">
                <td className="px-6 py-4">
                  <div className={`w-6 h-6 flex items-center justify-center rounded-sm ${index === 0 ? 'bg-primary text-on-primary font-bold shadow-[0_0_10px_rgba(223,255,0,0.5)]' : index === 1 ? 'bg-secondary-container text-surface-lowest font-bold' : index === 2 ? 'bg-outline-variant text-white' : 'bg-surface-highest text-gray-500'}`}>
                    {index + 1}
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-white group-hover:text-primary transition-colors">{model.name}</td>
                <td className="px-6 py-4 text-gray-500">{model.params}</td>
                <td className="px-6 py-4 text-primary">{model.benchmarks.mmlu}</td>
                <td className="px-6 py-4">{model.benchmarks.humanEval}</td>
                <td className="px-6 py-4">{model.benchmarks.gsm8k}</td>
                <td className="px-6 py-4">{model.benchmarks.math}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
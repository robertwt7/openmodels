interface BenchmarkTooltipProps {
  label: string;
  description: string;
  lowerIsBetter?: boolean;
}

export function BenchmarkTooltip({ label, description, lowerIsBetter }: BenchmarkTooltipProps) {
  return (
    <span className="relative inline-flex items-center gap-1 group/tip">
      {label}
      <span className="text-gray-600 cursor-help text-[10px] leading-none">ⓘ</span>
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 invisible group-hover/tip:visible opacity-0 group-hover/tip:opacity-100 transition-opacity z-50 pointer-events-none">
        <span className="block bg-surface-highest backdrop-blur-sm border border-outline-variant/30 p-3 shadow-[0_0_20px_rgba(0,0,0,0.6)]">
          <span className="block text-primary font-mono text-[10px] uppercase tracking-widest mb-1">{label}</span>
          <span className="block text-gray-400 text-[11px] leading-relaxed">{description}</span>
          {lowerIsBetter && (
            <span className="block text-secondary-container font-mono text-[9px] uppercase tracking-wider mt-2">▼ Lower is better</span>
          )}
        </span>
      </span>
    </span>
  );
}

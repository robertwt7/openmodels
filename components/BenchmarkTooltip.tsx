"use client";

import { useState, useRef, useCallback, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

interface BenchmarkTooltipProps {
  label: string;
  description: string;
  lowerIsBetter?: boolean;
}

export function BenchmarkTooltip({
  label,
  description,
  lowerIsBetter,
}: BenchmarkTooltipProps) {
  const [show, setShow] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const handleEnter = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top,
        left: rect.left + rect.width / 2,
      });
    }
    setShow(true);
  }, []);

  return (
    <span
      ref={triggerRef}
      className="inline-flex items-center gap-1 cursor-help"
      onMouseEnter={handleEnter}
      onMouseLeave={() => setShow(false)}
    >
      {label}
      <span className="text-gray-600 text-[10px] leading-none">&#9432;</span>
      {mounted &&
        show &&
        createPortal(
          <div
            className="fixed z-[9999] pointer-events-none"
            style={{
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              transform: "translate(-50%, -100%) translateY(-8px)",
            }}
          >
            <div className="bg-[#2f3445] backdrop-blur-sm border border-[#454932]/30 p-3 shadow-[0_0_20px_rgba(0,0,0,0.6)] w-56">
              <span className="block text-[#DFFF00] font-mono text-[10px] uppercase tracking-widest mb-1">
                {label}
              </span>
              <span className="block text-gray-400 text-[11px] leading-relaxed">
                {description}
              </span>
              {lowerIsBetter && (
                <span className="block text-[#FFBF00] font-mono text-[9px] uppercase tracking-wider mt-2">
                  &#9660; Lower is better
                </span>
              )}
            </div>
          </div>,
          document.body
        )}
    </span>
  );
}

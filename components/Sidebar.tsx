"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Database, Image as ImageIcon, Mic, Trophy, BarChart2 } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "LLM Index", href: "/", icon: Database },
    { name: "Diffusion", href: "/diffusion", icon: ImageIcon },
    { name: "Audio", href: "/audio", icon: Mic },
    { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
    { name: "Compare", href: "/compare", icon: BarChart2 },
  ];

  return (
    <aside className="col-span-12 md:col-span-3 lg:col-span-2 border-r border-outline-variant/20 flex flex-col min-h-full bg-surface-lowest">
      <div className="p-6 border-b border-outline-variant/20 flex flex-col gap-2">
        <div className="text-primary font-mono text-xs flex items-center gap-2 uppercase tracking-widest">
          <span className="w-1.5 h-1.5 bg-primary animate-blink"></span>
          Sys_Nav
        </div>
        <div className="font-display font-bold text-xl uppercase tracking-tighter text-white">
          Open<span className="text-primary">Models</span>
        </div>
      </div>

      <nav className="flex flex-col p-4 gap-2 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 border text-sm font-mono transition-all group relative overflow-hidden ${
                isActive
                  ? "border-primary/50 text-primary bg-primary/5 shadow-[inset_0_0_10px_rgba(223,255,0,0.1)]"
                  : "border-transparent text-gray-400 hover:text-white hover:border-outline-variant/30 hover:bg-surface-low"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
              )}
              <Icon className={`w-4 h-4 ${isActive ? "text-primary" : "text-gray-500 group-hover:text-gray-300"}`} />
              <span className="uppercase tracking-wider">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-outline-variant/20 text-xs font-mono text-outline-variant uppercase tracking-widest text-center">
        v0.1.0 // ONLINE
      </div>
    </aside>
  );
}
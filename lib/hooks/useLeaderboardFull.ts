import { useQuery } from "@tanstack/react-query";
import type { LiveModel } from "@/lib/hf-api";

interface LeaderboardFullResult {
  models: LiveModel[];
  total: number;
}

async function fetchLeaderboardFull(): Promise<LeaderboardFullResult> {
  const res = await fetch("/api/hf-leaderboard-full");
  if (!res.ok) {
    throw new Error(`Failed to fetch full leaderboard (${res.status})`);
  }
  return res.json();
}

export function useLeaderboardFull() {
  return useQuery({
    queryKey: ["hf-leaderboard-full"],
    queryFn: fetchLeaderboardFull,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

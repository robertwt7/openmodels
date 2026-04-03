import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { LiveModel } from "@/lib/hf-api";

interface LeaderboardResult {
  models: LiveModel[];
  total: number;
}

async function fetchLeaderboard(
  offset: number,
  length: number
): Promise<LeaderboardResult> {
  const res = await fetch(
    `/api/hf-leaderboard?offset=${offset}&length=${length}`
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch leaderboard (${res.status})`);
  }
  return res.json();
}

export function useLeaderboard(offset = 0, length = 100) {
  return useQuery({
    queryKey: ["hf-leaderboard", offset, length],
    queryFn: () => fetchLeaderboard(offset, length),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

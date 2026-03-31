import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  type HFLeaderboardResponse,
  type LiveModel,
  mapHFRowToModel,
} from "@/lib/hf-api";

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
  const data: HFLeaderboardResponse = await res.json();
  return {
    models: data.rows.map((r) => mapHFRowToModel(r.row)),
    total: data.num_rows_total,
  };
}

export function useLeaderboard(offset = 0, length = 100) {
  return useQuery({
    queryKey: ["hf-leaderboard", offset, length],
    queryFn: () => fetchLeaderboard(offset, length),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

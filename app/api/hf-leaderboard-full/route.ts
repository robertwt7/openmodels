import { NextResponse } from "next/server";
import { mapHFRowToModel, type HFLeaderboardResponse, type LiveModel } from "@/lib/hf-api";
import llmDates from "@/data/llm-dates.json";

const HF_BASE =
  "https://datasets-server.huggingface.co/rows?dataset=open-llm-leaderboard%2Fcontents&config=default&split=train";
const PAGE_SIZE = 100;

export async function GET() {
  try {
    // Fetch first page to get total count
    const firstRes = await fetch(`${HF_BASE}&offset=0&length=${PAGE_SIZE}`, {
      headers: { "User-Agent": "openmodels/1.0" },
      next: { revalidate: 600 },
    });
    if (!firstRes.ok) {
      return NextResponse.json(
        { error: `HuggingFace API returned ${firstRes.status}` },
        { status: firstRes.status }
      );
    }
    const firstData: HFLeaderboardResponse = await firstRes.json();
    const total = firstData.num_rows_total;
    const allRows = [...firstData.rows];

    // Fetch remaining pages in parallel batches of 5
    const pageCount = Math.ceil(total / PAGE_SIZE);
    for (let batch = 1; batch < pageCount; batch += 5) {
      const batchRequests: Promise<HFLeaderboardResponse>[] = [];
      for (let p = batch; p < Math.min(batch + 5, pageCount); p++) {
        batchRequests.push(
          fetch(`${HF_BASE}&offset=${p * PAGE_SIZE}&length=${PAGE_SIZE}`, {
            headers: { "User-Agent": "openmodels/1.0" },
            next: { revalidate: 600 },
          }).then((r) => r.json() as Promise<HFLeaderboardResponse>)
        );
      }
      const batchData = await Promise.all(batchRequests);
      batchData.forEach((d) => allRows.push(...d.rows));
    }

    // Map rows to LiveModel and enrich with release dates
    const dates = llmDates as Record<string, string>;
    const models: LiveModel[] = allRows.map((r) => {
      const m = mapHFRowToModel(r.row);
      m.releaseDate = dates[m.huggingFaceId] ?? null;
      return m;
    });

    return NextResponse.json(
      { models, total },
      {
        headers: {
          "Cache-Control": "s-maxage=600, stale-while-revalidate=1200",
        },
      }
    );
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to fetch leaderboard: ${err}` },
      { status: 500 }
    );
  }
}

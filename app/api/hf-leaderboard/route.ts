import { NextRequest, NextResponse } from "next/server";
import { mapHFRowToModel, type HFLeaderboardResponse } from "@/lib/hf-api";
import llmDates from "@/data/llm-dates.json";

const HF_DATASETS_SERVER =
  "https://datasets-server.huggingface.co/rows?dataset=open-llm-leaderboard%2Fcontents&config=default&split=train";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const offset = searchParams.get("offset") ?? "0";
  const length = searchParams.get("length") ?? "100";

  const url = `${HF_DATASETS_SERVER}&offset=${offset}&length=${length}`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "openmodels/1.0" },
      next: { revalidate: 300 }, // cache for 5 minutes
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `HuggingFace API returned ${res.status}` },
        { status: res.status }
      );
    }

    const data: HFLeaderboardResponse = await res.json();
    const dates = llmDates as Record<string, string>;

    // Transform to LiveModel[] and enrich with release dates
    const models = data.rows.map((r) => {
      const m = mapHFRowToModel(r.row);
      m.releaseDate = dates[m.huggingFaceId] ?? null;
      return m;
    });

    return NextResponse.json(
      { models, total: data.num_rows_total },
      {
        headers: {
          "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
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

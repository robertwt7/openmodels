import { NextRequest, NextResponse } from "next/server";

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

    const data = await res.json();

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to fetch leaderboard: ${err}` },
      { status: 500 }
    );
  }
}

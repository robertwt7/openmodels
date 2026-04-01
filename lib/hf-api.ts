// Types for the raw HuggingFace Datasets Server API response
// Dataset: open-llm-leaderboard/contents

export interface HFLeaderboardRow {
  fullname: string;
  "Average ⬆️": number | null;
  IFEval: number | null;
  BBH: number | null;
  "MATH Lvl 5": number | null;
  GPQA: number | null;
  MUSR: number | null;
  "MMLU-PRO": number | null;
  Architecture: string | null;
  "#Params (B)": number | null;
  Type: string | null;
  "Hub License": string | null;
  MoE: boolean | null;
}

export interface HFLeaderboardResponse {
  rows: Array<{ row_idx: number; row: HFLeaderboardRow; truncated_cells: string[] }>;
  num_rows_total: number;
  num_rows_per_page: number;
  partial: boolean;
}

// Internal shape used by the app for live-fetched models
export interface LiveModel {
  id: string;
  huggingFaceId: string;
  name: string;
  architecture: string;
  creator: string;
  params: string;
  isMoE: boolean;
  type: string;
  license: string;
  benchmarks: {
    bbh: number | null;
    gpqa: number | null;
    mathHard: number | null;
    musr: number | null;
    ifeval: number | null;
    mmluPro: number | null;
    average: number | null;
  };
}

function slugify(modelId: string): string {
  return modelId
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function creatorFromId(modelId: string): string {
  const org = modelId.split("/")[0] ?? modelId;
  const map: Record<string, string> = {
    "meta-llama": "Meta",
    mistralai: "Mistral AI",
    Qwen: "Alibaba Cloud",
    "deepseek-ai": "DeepSeek",
    google: "Google",
    microsoft: "Microsoft",
    tiiuae: "TII",
    "01-ai": "01.AI",
    allenai: "Allen AI",
    HuggingFaceH4: "Hugging Face",
    NousResearch: "Nous Research",
    CohereForAI: "Cohere",
    internlm: "InternLM",
    THUDM: "Tsinghua University",
  };
  return map[org] ?? org;
}

function formatParams(paramsB: number | null): string {
  if (paramsB === null) return "?";
  if (paramsB >= 1) return `${Math.round(paramsB)}B`;
  return `${Math.round(paramsB * 1000)}M`;
}

function prettyName(modelId: string): string {
  const repoName = modelId.split("/")[1] ?? modelId;
  return repoName.replace(/[-_]/g, " ").replace(/\s+/g, " ").trim();
}

function round2(v: number | null): number | null {
  if (v === null || v === undefined) return null;
  return Math.round(v * 100) / 100;
}

export function mapHFRowToModel(row: HFLeaderboardRow): LiveModel {
  return {
    id: slugify(row.fullname),
    huggingFaceId: row.fullname,
    name: prettyName(row.fullname),
    architecture: row.Architecture ?? "Transformer",
    creator: creatorFromId(row.fullname),
    params: formatParams(row["#Params (B)"]),
    isMoE: row.MoE ?? false,
    type: row.Type ?? "",
    license: row["Hub License"] ?? "",
    benchmarks: {
      bbh: round2(row.BBH),
      gpqa: round2(row.GPQA),
      mathHard: round2(row["MATH Lvl 5"]),
      musr: round2(row.MUSR),
      ifeval: round2(row.IFEval),
      mmluPro: round2(row["MMLU-PRO"]),
      average: round2(row["Average ⬆️"]),
    },
  };
}

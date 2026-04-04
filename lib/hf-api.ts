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
  "Upload To Hub Date": string | null;
  Merged: boolean | null;
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
  releaseDate: string | null;
  benchmarks: {
    average: number | null;
    bbh: number | null;
    gpqa: number | null;
    mathHard: number | null;
    musr: number | null;
    ifeval: number | null;
    mmluPro: number | null;
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

/**
 * Normalize HF Type strings like "💬 chat models (RLHF, DPO, IFT, ...)" → "chat"
 * and "🟢 pretrained" → "pretrained"
 */
function normalizeType(raw: string | null, merged: boolean | null): string {
  if (merged) return "merge";
  if (!raw) return "unknown";
  const lower = raw.toLowerCase();
  if (lower.includes("pretrained")) return "pretrained";
  if (lower.includes("chat")) return "chat";
  if (lower.includes("fine-tuned") || lower.includes("finetuned") || lower.includes("ift")) return "fine-tuned";
  if (lower.includes("instruction") || lower.includes("instruct")) return "instruct";
  if (lower.includes("merge")) return "merge";
  if (lower.includes("base")) return "pretrained";
  return "unknown";
}

/**
 * Normalize HF Architecture strings like "LlamaForCausalLM" → "Transformer"
 */
function normalizeArchitecture(raw: string | null, isMoE: boolean): string {
  if (isMoE) return "MoE";
  if (!raw) return "Transformer";
  const lower = raw.toLowerCase();
  if (lower.includes("mamba") || lower.includes("ssm") || lower.includes("rwkv")) return "SSM";
  if (lower.includes("mixtral") || lower.includes("moe") || lower.includes("dbrx") || lower.includes("switch")) return "MoE";
  // Everything else (LlamaForCausalLM, MistralForCausalLM, GPT2LMHeadModel, etc.) is Transformer-based
  return "Transformer";
}

export function mapHFRowToModel(row: HFLeaderboardRow): LiveModel {
  const isMoE = row.MoE ?? false;
  return {
    id: slugify(row.fullname),
    huggingFaceId: row.fullname,
    name: prettyName(row.fullname),
    architecture: normalizeArchitecture(row.Architecture, isMoE),
    creator: creatorFromId(row.fullname),
    params: formatParams(row["#Params (B)"]),
    isMoE,
    type: normalizeType(row.Type, row.Merged),
    license: row["Hub License"] ?? "",
    releaseDate: row["Upload To Hub Date"] ?? null,
    benchmarks: {
      average: round2(row["Average ⬆️"]),
      bbh: round2(row.BBH),
      gpqa: round2(row.GPQA),
      mathHard: round2(row["MATH Lvl 5"]),
      musr: round2(row.MUSR),
      ifeval: round2(row.IFEval),
      mmluPro: round2(row["MMLU-PRO"]),
    },
  };
}

/**
 * Fetch LLM evaluation results from HuggingFace Open LLM Leaderboard v2
 * and output a JSON file compatible with data/models.json schema.
 *
 * Usage: npx tsx scripts/fetch-hf-leaderboard.ts
 *
 * Outputs: data/hf-fetched-models.json
 */

import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const HF_BASE = "https://huggingface.co";
const DATASET = "open-llm-leaderboard/results";

// Curated list of major open-source LLM organizations on the leaderboard
const TARGET_ORGS = [
  "meta-llama",
  "mistralai",
  "Qwen",
  "deepseek-ai",
  "google",
  "microsoft",
  "tiiuae",
  "01-ai",
  "allenai",
  "HuggingFaceH4",
  "NousResearch",
  "CohereForAI",
  "Nexusflow",
  "internlm",
  "THUDM",
];

// Known context windows for common model families (context not in HF API)
const KNOWN_CONTEXT: Record<string, string> = {
  // Llama 3.x
  "meta-llama/Meta-Llama-3-8B": "8k",
  "meta-llama/Meta-Llama-3-70B": "8k",
  "meta-llama/Meta-Llama-3-8B-Instruct": "8k",
  "meta-llama/Meta-Llama-3-70B-Instruct": "8k",
  "meta-llama/Llama-3.1-8B": "128k",
  "meta-llama/Llama-3.1-70B": "128k",
  "meta-llama/Llama-3.1-405B": "128k",
  "meta-llama/Llama-3.1-8B-Instruct": "128k",
  "meta-llama/Llama-3.1-70B-Instruct": "128k",
  "meta-llama/Llama-3.2-1B": "128k",
  "meta-llama/Llama-3.2-3B": "128k",
  "meta-llama/Llama-3.2-1B-Instruct": "128k",
  "meta-llama/Llama-3.2-3B-Instruct": "128k",
  "meta-llama/Llama-3.3-70B-Instruct": "128k",
  // Mistral
  "mistralai/Mistral-7B-v0.1": "32k",
  "mistralai/Mistral-7B-Instruct-v0.2": "32k",
  "mistralai/Mistral-7B-Instruct-v0.3": "32k",
  "mistralai/Mixtral-8x7B-v0.1": "32k",
  "mistralai/Mixtral-8x7B-Instruct-v0.1": "32k",
  "mistralai/Mixtral-8x22B-v0.1": "64k",
  "mistralai/Mistral-Nemo-Instruct-2407": "128k",
  "mistralai/Mistral-Large-Instruct-2407": "128k",
  // Qwen 2.5
  "Qwen/Qwen2.5-7B": "128k",
  "Qwen/Qwen2.5-14B": "128k",
  "Qwen/Qwen2.5-32B": "128k",
  "Qwen/Qwen2.5-72B": "128k",
  "Qwen/Qwen2.5-7B-Instruct": "128k",
  "Qwen/Qwen2.5-14B-Instruct": "128k",
  "Qwen/Qwen2.5-32B-Instruct": "128k",
  "Qwen/Qwen2.5-72B-Instruct": "128k",
  // Qwen 2
  "Qwen/Qwen2-7B": "128k",
  "Qwen/Qwen2-72B": "128k",
  "Qwen/Qwen2-7B-Instruct": "128k",
  "Qwen/Qwen2-72B-Instruct": "128k",
  // DeepSeek
  "deepseek-ai/deepseek-llm-7b-base": "4k",
  "deepseek-ai/deepseek-llm-67b-base": "4k",
  "deepseek-ai/DeepSeek-V2": "128k",
  "deepseek-ai/DeepSeek-V2.5": "128k",
  "deepseek-ai/DeepSeek-V3": "128k",
  "deepseek-ai/DeepSeek-R1": "128k",
  // Google Gemma
  "google/gemma-2b": "8k",
  "google/gemma-7b": "8k",
  "google/gemma-2-2b": "8k",
  "google/gemma-2-9b": "8k",
  "google/gemma-2-27b": "8k",
  "google/gemma-2-2b-it": "8k",
  "google/gemma-2-9b-it": "8k",
  "google/gemma-2-27b-it": "8k",
  // Microsoft Phi
  "microsoft/phi-1_5": "2k",
  "microsoft/phi-2": "2k",
  "microsoft/Phi-3-mini-4k-instruct": "4k",
  "microsoft/Phi-3-medium-4k-instruct": "4k",
  "microsoft/Phi-3.5-mini-instruct": "128k",
  "microsoft/Phi-4": "16k",
};

// Architecture lookup by model type
const ARCH_BY_MODEL_TYPE: Record<string, string> = {
  llama: "Transformer",
  mistral: "Transformer",
  mixtral: "MoE",
  qwen2: "Transformer",
  qwen2_moe: "MoE",
  gemma: "Transformer",
  gemma2: "Transformer",
  deepseek_v2: "MoE",
  deepseek: "Transformer",
  phi: "Transformer",
  phi3: "Transformer",
  falcon: "Transformer",
  yi: "Transformer",
  olmo: "Transformer",
  command_r: "Transformer",
  internlm2: "Transformer",
  chatglm: "Transformer",
};

interface HFTreeEntry {
  type: string;
  oid: string;
  size: number;
  path: string;
}

interface HFModelMeta {
  id?: string;
  modelId?: string;
  author?: string;
  pipeline_tag?: string;
  library_name?: string;
  cardData?: {
    model_type?: string;
    language?: string[];
    license?: string;
    base_model?: string;
  };
  config?: {
    model_type?: string;
    architectures?: string[];
  };
  safetensors?: {
    total?: number;
    parameters?: Record<string, number>;
  };
  lastModified?: string;
  tags?: string[];
}

interface LLMBenchmarks {
  bbh: number | null;
  gpqa: number | null;
  mathHard: number | null;
  musr: number | null;
  ifeval: number | null;
  mmluPro: number | null;
}

interface ModelEntry {
  id: string;
  huggingFaceId: string;
  name: string;
  architecture: string;
  description: string;
  creator: string;
  releaseDate: string;
  params: string;
  context: string;
  benchmarks: LLMBenchmarks;
}

// Rate limit: delay between requests
async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJSON<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "openmodels-fetcher/1.0" },
    });
    if (!res.ok) {
      if (res.status !== 404) {
        console.warn(`  HTTP ${res.status} for ${url}`);
      }
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`  Fetch error for ${url}: ${err}`);
    return null;
  }
}

async function listOrgModels(org: string): Promise<string[]> {
  const url = `${HF_BASE}/api/datasets/${DATASET}/tree/main/${org}`;
  const data = await fetchJSON<HFTreeEntry[]>(url);
  if (!data) return [];
  return data
    .filter((f) => f.type === "directory")
    .map((f) => f.path.split("/").pop()!)
    .filter(Boolean);
}

async function getLatestResultFile(
  org: string,
  model: string
): Promise<string | null> {
  const url = `${HF_BASE}/api/datasets/${DATASET}/tree/main/${org}/${model}`;
  const data = await fetchJSON<HFTreeEntry[]>(url);
  if (!data) return null;
  const jsonFiles = data
    .filter((f) => f.path.endsWith(".json"))
    .map((f) => f.path.split("/").pop()!)
    .filter(Boolean)
    .sort(); // Sort by timestamp prefix
  return jsonFiles.at(-1) ?? null;
}

async function fetchBenchmarks(
  org: string,
  model: string,
  file: string
): Promise<LLMBenchmarks | null> {
  const url = `${HF_BASE}/datasets/${DATASET}/resolve/main/${org}/${model}/${file}`;
  const data = await fetchJSON<Record<string, Record<string, Record<string, number>>>>(url);
  if (!data) return null;

  const r = data.results ?? {};
  const g = data.groups ?? {};

  const pick = (obj: Record<string, unknown>, key: string): number | null => {
    const val = obj[key];
    return typeof val === "number" ? Math.round(val * 10000) / 100 : null;
  };

  return {
    bbh:
      pick(g["leaderboard_bbh"] ?? {}, "acc_norm,none") ??
      pick(r["leaderboard_bbh"] ?? {}, "acc_norm,none"),
    gpqa:
      pick(g["leaderboard_gpqa"] ?? {}, "acc_norm,none") ??
      pick(r["leaderboard_gpqa"] ?? {}, "acc_norm,none"),
    mathHard:
      pick(g["leaderboard_math_hard"] ?? {}, "exact_match,none") ??
      pick(r["leaderboard_math_hard"] ?? {}, "exact_match,none"),
    musr:
      pick(g["leaderboard_musr"] ?? {}, "acc_norm,none") ??
      pick(r["leaderboard_musr"] ?? {}, "acc_norm,none"),
    ifeval: pick(r["leaderboard_ifeval"] ?? {}, "inst_level_strict_acc,none"),
    mmluPro:
      pick(g["leaderboard_mmlu_pro"] ?? {}, "acc,none") ??
      pick(r["leaderboard_mmlu_pro"] ?? {}, "acc,none"),
  };
}

function formatParams(total: number): string {
  const b = total / 1e9;
  if (b >= 1) return `${Math.round(b)}B`;
  const m = total / 1e6;
  if (m >= 1) return `${Math.round(m)}M`;
  return `${total}`;
}

function parseParamsFromName(modelName: string): string | null {
  // Match patterns like 70B, 7b, 405B, 1.5B, 8x7B, 8x22B
  const match = modelName.match(/(\d+(?:\.\d+)?[Bb]|\d+x\d+[Bb])/);
  if (!match) return null;
  return match[1].toUpperCase();
}

function inferArchitecture(
  modelType: string | undefined,
  modelName: string
): string {
  if (modelType) {
    const arch = ARCH_BY_MODEL_TYPE[modelType.toLowerCase()];
    if (arch) return arch;
  }
  const name = modelName.toLowerCase();
  if (name.includes("mixtral") || name.includes("moe") || name.includes("8x"))
    return "MoE";
  if (name.includes("mamba")) return "SSM";
  return "Transformer";
}

function slugify(org: string, model: string): string {
  return `${org}/${model}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function prettyName(modelId: string): string {
  // e.g. "Meta-Llama-3-70B" → "Meta Llama 3 70B"
  return modelId
    .replace(/-/g, " ")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function creatorFromOrg(org: string): string {
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
    Nexusflow: "Nexusflow",
    internlm: "InternLM",
    THUDM: "Tsinghua University",
  };
  return map[org] ?? org;
}

// Models to skip (chat/instruct variants we already have as base, or too large/deprecated)
function shouldSkip(modelName: string): boolean {
  const lower = modelName.toLowerCase();
  // Skip very old or deprecated models
  if (lower.includes("llama-2")) return true;
  if (lower.includes("gemma-1") || lower === "gemma-2b" || lower === "gemma-7b")
    return true;
  // Skip very small models
  if (lower.includes("-1b") || lower.includes("-1.5b")) return true;
  return false;
}

async function fetchModelMeta(org: string, model: string): Promise<HFModelMeta | null> {
  const url = `${HF_BASE}/api/models/${org}/${model}`;
  return fetchJSON<HFModelMeta>(url);
}

async function processModel(
  org: string,
  model: string
): Promise<ModelEntry | null> {
  const fullId = `${org}/${model}`;
  process.stdout.write(`  → ${fullId} ... `);

  // Get latest result file
  const resultFile = await getLatestResultFile(org, model);
  await sleep(300);
  if (!resultFile) {
    console.log("no result file");
    return null;
  }

  // Fetch benchmarks
  const benchmarks = await fetchBenchmarks(org, model, resultFile);
  await sleep(300);
  if (!benchmarks) {
    console.log("failed to fetch benchmarks");
    return null;
  }

  // Check if model has any benchmark data
  const hasData = Object.values(benchmarks).some((v) => v !== null);
  if (!hasData) {
    console.log("no benchmark data");
    return null;
  }

  // Fetch model metadata
  const meta = await fetchModelMeta(org, model);
  await sleep(300);

  // Determine params
  let params: string | null = null;
  if (meta?.safetensors?.total) {
    params = formatParams(meta.safetensors.total);
  }
  if (!params) {
    params = parseParamsFromName(model) ?? "?";
  }

  // Determine architecture
  const modelType = meta?.config?.model_type;
  const architecture = inferArchitecture(modelType, model);

  // Determine context
  const context = KNOWN_CONTEXT[fullId] ?? "?";

  // Determine release date from lastModified (rough approximation)
  const releaseDate = meta?.lastModified
    ? meta.lastModified.split("T")[0]
    : "2024-01-01";

  // Generate description
  const creator = creatorFromOrg(org);
  const description = `${creator}'s ${prettyName(model)} — evaluated on HuggingFace Open LLM Leaderboard v2.`;

  console.log(
    `OK (bbh=${benchmarks.bbh}, mmluPro=${benchmarks.mmluPro})`
  );

  return {
    id: slugify(org, model),
    huggingFaceId: `${org}/${model}`,
    name: prettyName(model),
    architecture,
    description,
    creator,
    releaseDate,
    params,
    context,
    benchmarks,
  };
}

async function main() {
  console.log("Fetching HuggingFace Open LLM Leaderboard v2 results...\n");

  const results: ModelEntry[] = [];
  const seen = new Set<string>();

  for (const org of TARGET_ORGS) {
    console.log(`\n[${org}]`);
    const models = await listOrgModels(org);
    await sleep(300);

    if (models.length === 0) {
      console.log("  No models found");
      continue;
    }

    console.log(`  Found ${models.length} models`);

    for (const model of models) {
      if (shouldSkip(model)) {
        console.log(`  → ${org}/${model} ... skipped`);
        continue;
      }

      const key = `${org}/${model}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const entry = await processModel(org, model);
      if (entry) {
        results.push(entry);
      }
    }
  }

  console.log(`\n✓ Fetched ${results.length} models`);

  const outPath = join(__dirname, "../data/hf-fetched-models.json");
  writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`✓ Written to ${outPath}`);
}

main().catch(console.error);

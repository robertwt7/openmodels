/**
 * Curate and merge HF-fetched model data into data/models.json.
 * Selects the most significant models, enriches metadata, and
 * replaces the LLM section while preserving diffusion/audio.
 *
 * Usage: npx tsx scripts/merge-hf-models.ts
 */

import { writeFileSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fetched: any[] = JSON.parse(
  readFileSync(join(__dirname, "../data/hf-fetched-models.json"), "utf-8")
);
const existing = JSON.parse(
  readFileSync(join(__dirname, "../data/models.json"), "utf-8")
);

// IDs of models to include (from the fetched slugs)
// Format: "org-model" (slugified)
const CURATED_IDS = new Set([
  // Qwen 2.5
  "qwen-qwen2-5-72b-instruct",
  "qwen-qwen2-5-72b",
  "qwen-qwen2-5-32b-instruct",
  "qwen-qwen2-5-14b-instruct",
  "qwen-qwen2-5-7b-instruct",
  "qwen-qwq-32b-preview",
  // Qwen 2
  "qwen-qwen2-72b-instruct",
  "qwen-qwen2-7b-instruct",
  // Llama 3.x
  "meta-llama-llama-3-3-70b-instruct",
  "meta-llama-llama-3-1-70b-instruct",
  "meta-llama-llama-3-1-70b",
  "meta-llama-llama-3-1-8b-instruct",
  "meta-llama-llama-3-2-3b-instruct",
  "meta-llama-meta-llama-3-70b-instruct",
  "meta-llama-meta-llama-3-8b-instruct",
  // Mistral
  "mistralai-mistral-large-instruct-2411",
  "mistralai-mistral-small-24b-base-2501",
  "mistralai-mixtral-8x22b-instruct-v0-1",
  "mistralai-mixtral-8x7b-instruct-v0-1",
  "mistralai-mistral-nemo-instruct-2407",
  "mistralai-mistral-7b-instruct-v0-3",
  // Google Gemma 2
  "google-gemma-2-27b-it",
  "google-gemma-2-27b",
  "google-gemma-2-9b-it",
  "google-gemma-2-9b",
  // Microsoft Phi
  "microsoft-phi-4",
  "microsoft-phi-3-5-moe-instruct",
  "microsoft-phi-3-medium-4k-instruct",
  "microsoft-phi-3-mini-4k-instruct",
  // Yi
  "01-ai-yi-1-5-34b-chat",
  "01-ai-yi-1-5-9b-chat",
  // NousResearch flagship
  "nousresearch-hermes-3-llama-3-1-70b",
  "nousresearch-hermes-3-llama-3-1-8b",
  // CohereForAI
  "cohereforai-c4ai-command-r-plus-08-2024",
  "cohereforai-c4ai-command-r-08-2024",
  // Falcon 3
  "tiiuae-falcon3-10b-instruct",
  "tiiuae-falcon3-7b-instruct",
  // InternLM 2.5
  "internlm-internlm2-5-20b-chat",
  "internlm-internlm2-5-7b-chat",
  // allenai Tulu 3
  "allenai-llama-3-1-tulu-3-70b",
  // DeepSeek R1 distills
  "deepseek-ai-deepseek-r1-distill-llama-70b",
  "deepseek-ai-deepseek-r1-distill-qwen-32b",
  "deepseek-ai-deepseek-r1-distill-qwen-14b",
  "deepseek-ai-deepseek-llm-67b-chat",
]);

// Manual metadata overrides (release date, description, context)
const OVERRIDES: Record<string, Partial<{
  name: string;
  description: string;
  releaseDate: string;
  context: string;
  architecture: string;
  params: string;
}>> = {
  "qwen-qwen2-5-72b-instruct": {
    name: "Qwen2.5 72B Instruct",
    description: "Alibaba's flagship 72B instruction-tuned model with strong math, coding, and multilingual performance.",
    releaseDate: "2024-09-18",
    context: "128k",
    params: "72B",
  },
  "qwen-qwen2-5-72b": {
    name: "Qwen2.5 72B",
    description: "Qwen2.5 base 72B — Alibaba's most capable open-weights dense model.",
    releaseDate: "2024-09-18",
    context: "128k",
    params: "72B",
  },
  "qwen-qwen2-5-32b-instruct": {
    name: "Qwen2.5 32B Instruct",
    description: "Alibaba's 32B instruction-tuned model balancing performance and deployment efficiency.",
    releaseDate: "2024-09-18",
    context: "128k",
    params: "32B",
  },
  "qwen-qwen2-5-14b-instruct": {
    name: "Qwen2.5 14B Instruct",
    description: "Qwen2.5 14B instruction model — strong mid-size performer across reasoning and coding tasks.",
    releaseDate: "2024-09-18",
    context: "128k",
    params: "14B",
  },
  "qwen-qwen2-5-7b-instruct": {
    name: "Qwen2.5 7B Instruct",
    description: "Efficient 7B model from Alibaba with competitive benchmark scores for its size class.",
    releaseDate: "2024-09-18",
    context: "128k",
    params: "7B",
  },
  "qwen-qwq-32b-preview": {
    name: "QwQ 32B Preview",
    description: "Qwen's reasoning-focused 32B model with chain-of-thought training, competitive with much larger models.",
    releaseDate: "2024-11-27",
    context: "32k",
    params: "32B",
  },
  "qwen-qwen2-72b-instruct": {
    name: "Qwen2 72B Instruct",
    description: "Alibaba's Qwen2 generation 72B model, excelling at multilingual tasks and instruction following.",
    releaseDate: "2024-06-06",
    context: "128k",
    params: "72B",
  },
  "qwen-qwen2-7b-instruct": {
    name: "Qwen2 7B Instruct",
    description: "Qwen2 7B instruction model — small but strong performer across diverse benchmarks.",
    releaseDate: "2024-06-06",
    context: "128k",
    params: "7B",
  },
  "meta-llama-llama-3-3-70b-instruct": {
    name: "Llama 3.3 70B Instruct",
    description: "Meta's latest 70B instruction model with improved reasoning and instruction-following over 3.1.",
    releaseDate: "2024-12-05",
    context: "128k",
    params: "70B",
  },
  "meta-llama-llama-3-1-70b-instruct": {
    name: "Llama 3.1 70B Instruct",
    description: "Meta's 70B instruction-tuned model with 128k context, competitive with GPT-4o class systems.",
    releaseDate: "2024-07-23",
    context: "128k",
    params: "70B",
  },
  "meta-llama-llama-3-1-70b": {
    name: "Llama 3.1 70B",
    description: "Meta Llama 3.1 base 70B — strong open-weights model for fine-tuning and research.",
    releaseDate: "2024-07-23",
    context: "128k",
    params: "70B",
  },
  "meta-llama-llama-3-1-8b-instruct": {
    name: "Llama 3.1 8B Instruct",
    description: "Meta's efficient 8B instruction model, widely deployed for edge and consumer applications.",
    releaseDate: "2024-07-23",
    context: "128k",
    params: "8B",
  },
  "meta-llama-llama-3-2-3b-instruct": {
    name: "Llama 3.2 3B Instruct",
    description: "Meta's compact 3B model optimized for on-device deployment with multilingual support.",
    releaseDate: "2024-09-25",
    context: "128k",
    params: "3B",
  },
  "meta-llama-meta-llama-3-70b-instruct": {
    name: "Llama 3 70B Instruct",
    description: "Meta Llama 3 70B instruction model — the original Llama 3 large variant.",
    releaseDate: "2024-04-18",
    context: "8k",
    params: "70B",
  },
  "meta-llama-meta-llama-3-8b-instruct": {
    name: "Llama 3 8B Instruct",
    description: "Meta Llama 3 8B instruction model — compact and widely adopted open-weights model.",
    releaseDate: "2024-04-18",
    context: "8k",
    params: "8B",
  },
  "mistralai-mistral-large-instruct-2411": {
    name: "Mistral Large 2411",
    description: "Mistral AI's flagship large model (November 2024), with leading performance among open weights.",
    releaseDate: "2024-11-18",
    context: "128k",
    params: "123B",
    architecture: "Transformer",
  },
  "mistralai-mistral-small-24b-base-2501": {
    name: "Mistral Small 24B",
    description: "Mistral AI's efficient 24B model offering high performance-per-parameter for deployment.",
    releaseDate: "2025-01-30",
    context: "32k",
    params: "24B",
    architecture: "Transformer",
  },
  "mistralai-mixtral-8x22b-instruct-v0-1": {
    name: "Mixtral 8×22B Instruct",
    description: "Mistral's large sparse mixture-of-experts model with 141B total and 39B active parameters.",
    releaseDate: "2024-04-10",
    context: "64k",
    params: "141B",
    architecture: "MoE",
  },
  "mistralai-mixtral-8x7b-instruct-v0-1": {
    name: "Mixtral 8×7B Instruct",
    description: "Mistral's pioneering sparse MoE model — 46B total parameters, 12B active per token.",
    releaseDate: "2024-01-08",
    context: "32k",
    params: "46B",
    architecture: "MoE",
  },
  "mistralai-mistral-nemo-instruct-2407": {
    name: "Mistral NeMo 12B",
    description: "Mistral's 12B model built with NVIDIA, featuring 128k context and Tekken tokenizer.",
    releaseDate: "2024-07-18",
    context: "128k",
    params: "12B",
    architecture: "Transformer",
  },
  "mistralai-mistral-7b-instruct-v0-3": {
    name: "Mistral 7B Instruct v0.3",
    description: "Mistral's foundational 7B instruction model — a widely-used open-source baseline.",
    releaseDate: "2024-05-22",
    context: "32k",
    params: "7B",
    architecture: "Transformer",
  },
  "google-gemma-2-27b-it": {
    name: "Gemma 2 27B IT",
    description: "Google's 27B instruction-tuned Gemma 2 model using novel interleaved attention architecture.",
    releaseDate: "2024-06-27",
    context: "8k",
    params: "27B",
    architecture: "Transformer",
  },
  "google-gemma-2-27b": {
    name: "Gemma 2 27B",
    description: "Google Gemma 2 base 27B — strong performance through knowledge distillation during training.",
    releaseDate: "2024-06-27",
    context: "8k",
    params: "27B",
    architecture: "Transformer",
  },
  "google-gemma-2-9b-it": {
    name: "Gemma 2 9B IT",
    description: "Google's 9B Gemma 2 instruction model, outperforming many larger models on standard benchmarks.",
    releaseDate: "2024-06-27",
    context: "8k",
    params: "9B",
    architecture: "Transformer",
  },
  "google-gemma-2-9b": {
    name: "Gemma 2 9B",
    description: "Google Gemma 2 9B base model trained with distillation for improved efficiency.",
    releaseDate: "2024-06-27",
    context: "8k",
    params: "9B",
    architecture: "Transformer",
  },
  "microsoft-phi-4": {
    name: "Phi-4",
    description: "Microsoft's 14B Phi-4 model trained on high-quality synthetic data, punching above its weight class.",
    releaseDate: "2024-12-12",
    context: "16k",
    params: "14B",
    architecture: "Transformer",
  },
  "microsoft-phi-3-5-moe-instruct": {
    name: "Phi-3.5 MoE Instruct",
    description: "Microsoft's 42B MoE model with 6.6B active parameters, strong reasoning in a small footprint.",
    releaseDate: "2024-08-20",
    context: "128k",
    params: "42B",
    architecture: "MoE",
  },
  "microsoft-phi-3-medium-4k-instruct": {
    name: "Phi-3 Medium 14B",
    description: "Microsoft's 14B Phi-3 instruction model with strong reasoning despite compact size.",
    releaseDate: "2024-05-21",
    context: "4k",
    params: "14B",
    architecture: "Transformer",
  },
  "microsoft-phi-3-mini-4k-instruct": {
    name: "Phi-3 Mini 3.8B",
    description: "Microsoft's tiny but capable 3.8B instruction model designed for edge deployment.",
    releaseDate: "2024-04-23",
    context: "4k",
    params: "3.8B",
    architecture: "Transformer",
  },
  "01-ai-yi-1-5-34b-chat": {
    name: "Yi-1.5 34B Chat",
    description: "01.AI's Yi-1.5 chat model at 34B — competitive multilingual performance with 200k context support.",
    releaseDate: "2024-05-13",
    context: "4k",
    params: "34B",
    architecture: "Transformer",
  },
  "01-ai-yi-1-5-9b-chat": {
    name: "Yi-1.5 9B Chat",
    description: "01.AI's efficient 9B chat model from the Yi-1.5 series with strong Asian language support.",
    releaseDate: "2024-05-13",
    context: "4k",
    params: "9B",
    architecture: "Transformer",
  },
  "nousresearch-hermes-3-llama-3-1-70b": {
    name: "Hermes 3 Llama 3.1 70B",
    description: "Nous Research's Hermes 3 fine-tune on Llama 3.1 70B with enhanced tool-use and instruction following.",
    releaseDate: "2024-08-09",
    context: "128k",
    params: "70B",
    architecture: "Transformer",
  },
  "nousresearch-hermes-3-llama-3-1-8b": {
    name: "Hermes 3 Llama 3.1 8B",
    description: "Nous Research's instruction-tuned 8B model on Llama 3.1 backbone with Hermes conversational style.",
    releaseDate: "2024-08-09",
    context: "128k",
    params: "8B",
    architecture: "Transformer",
  },
  "cohereforai-c4ai-command-r-plus-08-2024": {
    name: "Command R+ (Aug 2024)",
    description: "Cohere's powerful Command R+ model optimized for RAG, tool use, and multi-step reasoning.",
    releaseDate: "2024-08-01",
    context: "128k",
    params: "104B",
    architecture: "Transformer",
  },
  "cohereforai-c4ai-command-r-08-2024": {
    name: "Command R (Aug 2024)",
    description: "Cohere's Command R model focused on retrieval-augmented generation and grounded responses.",
    releaseDate: "2024-08-01",
    context: "128k",
    params: "35B",
    architecture: "Transformer",
  },
  "tiiuae-falcon3-10b-instruct": {
    name: "Falcon3 10B Instruct",
    description: "TII's Falcon3 10B instruction model, trained with efficiency optimizations for compute budget.",
    releaseDate: "2024-12-04",
    context: "32k",
    params: "10B",
    architecture: "Transformer",
  },
  "tiiuae-falcon3-7b-instruct": {
    name: "Falcon3 7B Instruct",
    description: "TII's Falcon3 7B instruction model with strong performance in the 7B size class.",
    releaseDate: "2024-12-04",
    context: "32k",
    params: "7B",
    architecture: "Transformer",
  },
  "internlm-internlm2-5-20b-chat": {
    name: "InternLM2.5 20B Chat",
    description: "Shanghai AI Lab's InternLM2.5 20B chat model with leading reasoning scores for its size.",
    releaseDate: "2024-08-05",
    context: "32k",
    params: "20B",
    architecture: "Transformer",
  },
  "internlm-internlm2-5-7b-chat": {
    name: "InternLM2.5 7B Chat",
    description: "InternLM2.5 7B chat model from Shanghai AI Lab with strong math and coding capabilities.",
    releaseDate: "2024-08-05",
    context: "8k",
    params: "7B",
    architecture: "Transformer",
  },
  "allenai-llama-3-1-tulu-3-70b": {
    name: "Tulu 3 70B",
    description: "Allen AI's Tulu 3 fine-tune on Llama 3.1 70B using RLVR training with open data and recipes.",
    releaseDate: "2024-11-19",
    context: "128k",
    params: "70B",
    architecture: "Transformer",
  },
  "deepseek-ai-deepseek-r1-distill-llama-70b": {
    name: "DeepSeek R1 Distill Llama 70B",
    description: "DeepSeek R1 reasoning capability distilled into a Llama 3.1 70B base — competitive with much larger models on math and reasoning.",
    releaseDate: "2025-01-20",
    context: "128k",
    params: "70B",
    architecture: "Transformer",
  },
  "deepseek-ai-deepseek-r1-distill-qwen-32b": {
    name: "DeepSeek R1 Distill Qwen 32B",
    description: "DeepSeek R1 reasoning distilled into Qwen 2.5 32B — strong math and coding in a deployable size.",
    releaseDate: "2025-01-20",
    context: "128k",
    params: "32B",
    architecture: "Transformer",
  },
  "deepseek-ai-deepseek-r1-distill-qwen-14b": {
    name: "DeepSeek R1 Distill Qwen 14B",
    description: "DeepSeek R1 reasoning capability distilled into Qwen 2.5 14B, outperforming GPT-4o on benchmarks.",
    releaseDate: "2025-01-20",
    context: "128k",
    params: "14B",
    architecture: "Transformer",
  },
  "deepseek-ai-deepseek-llm-67b-chat": {
    name: "DeepSeek LLM 67B Chat",
    description: "DeepSeek's 67B chat model trained from scratch with strong coding and reasoning capabilities.",
    releaseDate: "2023-11-02",
    context: "4k",
    params: "67B",
    architecture: "Transformer",
  },
};

interface FetchedModel {
  id: string;
  huggingFaceId: string;
  name: string;
  architecture: string;
  description: string;
  creator: string;
  releaseDate: string;
  params: string;
  context: string;
  benchmarks: Record<string, number | null>;
}

// Select curated models and apply overrides
const curated = (fetched as FetchedModel[])
  .filter((m) => CURATED_IDS.has(m.id))
  .map((m) => {
    const override = OVERRIDES[m.id] ?? {};
    return { ...m, ...override };
  });

// Sort by mmluPro descending (best models first)
curated.sort((a, b) => {
  const av = (a.benchmarks["mmluPro"] as number | null) ?? 0;
  const bv = (b.benchmarks["mmluPro"] as number | null) ?? 0;
  return bv - av;
});

console.log(`Selected ${curated.length} curated models`);
curated.forEach((m) =>
  console.log(` - ${m.name} (${m.params}) mmlu-pro=${m.benchmarks["mmluPro"]}`)
);

// Build new models.json
const updated = {
  llm: curated,
  diffusion: existing.diffusion,
  audio: existing.audio,
};

const outPath = join(__dirname, "../data/models.json");
writeFileSync(outPath, JSON.stringify(updated, null, 2));
console.log(`\n✓ Written ${curated.length} LLM models to ${outPath}`);

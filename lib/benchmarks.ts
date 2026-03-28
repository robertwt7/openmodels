export interface BenchmarkMeta {
  key: string;
  label: string;
  unit: string;
  description: string;
  lowerIsBetter: boolean;
}

export const benchmarkMeta: Record<string, BenchmarkMeta> = {
  mmlu: {
    key: "mmlu",
    label: "MMLU",
    unit: "%",
    description:
      "Massive Multitask Language Understanding — tests general knowledge across 57 subjects.",
    lowerIsBetter: false,
  },
  humanEval: {
    key: "humanEval",
    label: "HumanEval",
    unit: "%",
    description:
      "Code generation accuracy on 164 hand-written Python programming problems.",
    lowerIsBetter: false,
  },
  gsm8k: {
    key: "gsm8k",
    label: "GSM8K",
    unit: "%",
    description:
      "Grade-school math word problems requiring multi-step arithmetic reasoning.",
    lowerIsBetter: false,
  },
  math: {
    key: "math",
    label: "Math",
    unit: "%",
    description:
      "Competition-level math problems drawn from AMC and AIME challenges.",
    lowerIsBetter: false,
  },
  fid: {
    key: "fid",
    label: "FID",
    unit: "",
    description:
      "Fréchet Inception Distance — measures statistical realism of generated images vs real images.",
    lowerIsBetter: true,
  },
  clipScore: {
    key: "clipScore",
    label: "CLIP Score",
    unit: "",
    description:
      "Alignment between generated image and text prompt using CLIP embedding cosine similarity.",
    lowerIsBetter: false,
  },
  genSpeed: {
    key: "genSpeed",
    label: "Gen Speed",
    unit: " img/s",
    description:
      "Images generated per second at standard resolution on reference hardware.",
    lowerIsBetter: false,
  },
  wer: {
    key: "wer",
    label: "WER",
    unit: "%",
    description:
      "Word Error Rate — percentage of words transcribed incorrectly in speech-to-text output.",
    lowerIsBetter: true,
  },
  latency: {
    key: "latency",
    label: "Latency",
    unit: "s",
    description:
      "Seconds from audio input start to first decoded output token.",
    lowerIsBetter: true,
  },
  multilingual: {
    key: "multilingual",
    label: "Multilingual",
    unit: "%",
    description:
      "Percentage of tested languages achieving acceptable transcription or translation quality.",
    lowerIsBetter: false,
  },
};

export type Category = "llm" | "diffusion" | "audio";

export const categoryBenchmarks: Record<Category, string[]> = {
  llm: ["mmlu", "humanEval", "gsm8k", "math"],
  diffusion: ["fid", "clipScore", "genSpeed"],
  audio: ["wer", "latency", "multilingual"],
};

export const categoryLabels: Record<Category, string> = {
  llm: "LLM",
  diffusion: "Diffusion",
  audio: "Audio",
};

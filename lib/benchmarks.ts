export interface BenchmarkMeta {
  key: string;
  label: string;
  unit: string;
  description: string;
  lowerIsBetter: boolean;
}

export const benchmarkMeta: Record<string, BenchmarkMeta> = {
  bbh: {
    key: "bbh",
    label: "BBH",
    unit: "%",
    description:
      "Big Bench Hard — 23 challenging multi-step reasoning tasks requiring chain-of-thought.",
    lowerIsBetter: false,
  },
  gpqa: {
    key: "gpqa",
    label: "GPQA",
    unit: "%",
    description:
      "Graduate-Level Google-Proof Q&A — PhD-level questions across biology, chemistry, and physics.",
    lowerIsBetter: false,
  },
  mathHard: {
    key: "mathHard",
    label: "MATH",
    unit: "%",
    description:
      "Competition-level mathematics problems from AMC/AIME, testing symbolic and algebraic reasoning.",
    lowerIsBetter: false,
  },
  musr: {
    key: "musr",
    label: "MuSR",
    unit: "%",
    description:
      "Multi-step Soft Reasoning — complex narrative reasoning over murder mysteries, object tracking, and team allocation.",
    lowerIsBetter: false,
  },
  ifeval: {
    key: "ifeval",
    label: "IFEval",
    unit: "%",
    description:
      "Instruction Following Evaluation — strict accuracy on verifiable formatting and constraint instructions.",
    lowerIsBetter: false,
  },
  mmluPro: {
    key: "mmluPro",
    label: "MMLU-Pro",
    unit: "%",
    description:
      "Massive Multitask Language Understanding Pro — harder, 10-choice version spanning 57 academic subjects.",
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
  llm: ["bbh", "gpqa", "mathHard", "musr", "ifeval", "mmluPro"],
  diffusion: ["fid", "clipScore", "genSpeed"],
  audio: ["wer", "latency", "multilingual"],
};

export const categoryLabels: Record<Category, string> = {
  llm: "LLM",
  diffusion: "Diffusion",
  audio: "Audio",
};

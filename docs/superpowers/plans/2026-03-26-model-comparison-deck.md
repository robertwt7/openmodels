# Model Telemetry Control Deck & Multi-Modal Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a model selection "Control Deck" on the comparison page and expand the model database with Diffusion and Audio models.

**Architecture:** Use React state to manage selected category and models, dynamically updating Recharts components based on the selected category's benchmarks.

**Tech Stack:** Next.js 16, TailwindCSS 4, Recharts, TypeScript.

---

### Task 1: Expand Model Database

**Files:**
- Modify: `data/models.json`

- [ ] **Step 1: Update `data/models.json` with new models and standardized benchmarks.**

```json
{
  "llm": [
    ...existing,
    {
      "id": "gemma-2-27b",
      "name": "Gemma 2 27B",
      "architecture": "Transformer",
      "description": "Google's lightweight, state-of-the-art open model.",
      "creator": "Google",
      "releaseDate": "2024-06-27",
      "params": "27B",
      "context": "8k",
      "benchmarks": {
        "mmlu": 81.1,
        "humanEval": 71.3,
        "gsm8k": 74.0,
        "math": 85.0
      }
    }
  ],
  "diffusion": [
    {
      "id": "flux-1-schnell",
      "name": "Flux.1 [schnell]",
      "architecture": "Flow-based Transformer",
      "description": "SOTA high-speed rectified flow transformer model.",
      "creator": "Black Forest Labs",
      "releaseDate": "2024-08-01",
      "params": "12B",
      "benchmarks": {
        "fid": 0.85,
        "clipScore": 0.32,
        "genSpeed": 4.2
      }
    },
    {
      "id": "sdxl-1.0",
      "name": "SDXL 1.0",
      "architecture": "Latent Diffusion",
      "description": "High-resolution image synthesis model.",
      "creator": "Stability AI",
      "releaseDate": "2023-07-26",
      "params": "3.5B",
      "benchmarks": {
        "fid": 1.2,
        "clipScore": 0.28,
        "genSpeed": 1.5
      }
    },
    {
      "id": "playground-v2.5",
      "name": "Playground v2.5",
      "architecture": "Diffusion",
      "description": "Aesthetic-optimized image generation model.",
      "creator": "Playground AI",
      "releaseDate": "2024-02-27",
      "params": "Unknown",
      "benchmarks": {
        "fid": 0.9,
        "clipScore": 0.30,
        "genSpeed": 2.1
      }
    }
  ],
  "audio": [
    {
      "id": "whisper-v3",
      "name": "Whisper v3",
      "architecture": "Transformer",
      "description": "Robust speech recognition model.",
      "creator": "OpenAI",
      "releaseDate": "2023-11-06",
      "params": "1550M",
      "benchmarks": {
        "wer": 4.2,
        "latency": 0.8,
        "multilingual": 95.0
      }
    },
    {
      "id": "seamless-m4t-v2",
      "name": "SeamlessM4T v2",
      "architecture": "UnitY2",
      "description": "Massively multilingual & multimodal translation model.",
      "creator": "Meta",
      "releaseDate": "2023-11-30",
      "params": "2.3B",
      "benchmarks": {
        "wer": 4.8,
        "latency": 1.2,
        "multilingual": 98.5
      }
    },
    {
      "id": "stable-audio-open",
      "name": "Stable Audio Open",
      "architecture": "Latent Diffusion",
      "description": "Open weights for high-quality audio synthesis.",
      "creator": "Stability AI",
      "releaseDate": "2024-06-05",
      "params": "Unknown",
      "benchmarks": {
        "wer": 0.0,
        "latency": 2.5,
        "multilingual": 0.0
      }
    }
  ]
}
```

- [ ] **Step 2: Commit changes.**

```bash
git add data/models.json
git commit -m "data: expand model database with diffusion and audio models"
```

---

### Task 2: Implement Control Deck UI & State

**Files:**
- Modify: `app/compare/page.tsx`

- [ ] **Step 1: Define state and selection logic in `ComparePage`.**

```typescript
const [activeCategory, setActiveCategory] = useState<keyof typeof modelsData>("llm");
const [modelAId, setModelAId] = useState(modelsData.llm[0].id);
const [modelBId, setModelBId] = useState(modelsData.llm[1].id);
```

- [ ] **Step 2: Add category-switching effect.**

```typescript
useEffect(() => {
  const categoryModels = modelsData[activeCategory];
  setModelAId(categoryModels[0].id);
  setModelBId(categoryModels[1]?.id || categoryModels[0].id);
}, [activeCategory]);
```

- [ ] **Step 3: Build the Control Deck UI component.**

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-surface-lowest border border-outline-variant/30 mb-8 font-mono text-sm">
  <div className="flex flex-col gap-2">
    <label className="text-primary text-xs uppercase tracking-widest">Category</label>
    <select 
      value={activeCategory} 
      onChange={(e) => setActiveCategory(e.target.value as any)}
      className="bg-surface-highest border border-outline-variant/30 p-2 text-white outline-none focus:border-primary"
    >
      <option value="llm">LLM</option>
      <option value="diffusion">DIFFUSION</option>
      <option value="audio">AUDIO</option>
    </select>
  </div>
  {/* Node Alpha & Beta Selectors */}
</div>
```

- [ ] **Step 4: Commit changes.**

```bash
git add app/compare/page.tsx
git commit -m "feat: add comparison control deck and state management"
```

---

### Task 3: Dynamic Chart Integration

**Files:**
- Modify: `app/compare/page.tsx`

- [ ] **Step 1: Update `barChartData` and `radarChartData` to use selected models and dynamic benchmark keys.**

```typescript
const modelA = (modelsData[activeCategory] as any[]).find(m => m.id === modelAId);
const modelB = (modelsData[activeCategory] as any[]).find(m => m.id === modelBId);
const benchmarkKeys = Object.keys(modelA.benchmarks);

const barChartData = modelsData[activeCategory].map((m: any) => {
  const data: any = { name: m.name };
  benchmarkKeys.forEach(k => data[k] = m.benchmarks[k]);
  return data;
});
```

- [ ] **Step 2: Update Radar and Bar charts to render dynamic keys.**

- [ ] **Step 3: Commit changes.**

```bash
git add app/compare/page.tsx
git commit -m "feat: enable dynamic chart rendering based on selected models"
```

---

### Task 4: Documentation & Final Polish

**Files:**
- Modify: `CHANGELOG.md`

- [ ] **Step 1: Update `CHANGELOG.md`.**

- [ ] **Step 2: Run final verification.**

Run: `npm run build`
Expected: Success

- [ ] **Step 3: Commit final changes.**

```bash
git add CHANGELOG.md
git commit -m "docs: update changelog for model comparison features"
```

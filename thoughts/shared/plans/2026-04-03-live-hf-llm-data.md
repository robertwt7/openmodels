# Live HF Leaderboard as Primary LLM Data Source

## Overview

Replace the static curated `data/models.json` LLM section with live data from the HuggingFace Open LLM Leaderboard API (`open-llm-leaderboard/contents`) across all pages. The live API infrastructure already exists — this plan migrates every page that currently reads static LLM data to use it instead, adds pagination and filtering throughout, and deprecates (but does not delete) the static LLM data.

## Current State Analysis

The app already has a split personality for LLMs:
- `app/api/hf-leaderboard/route.ts` — hits `datasets-server.huggingface.co/rows?dataset=open-llm-leaderboard%2Fcontents` with offset/length, 5-min ISR cache
- `lib/hf-api.ts` — `LiveModel` type + `mapHFRowToModel` transform
- `lib/hooks/useLeaderboard.ts` — React Query hook (staleTime 5 min)
- `app/page.tsx` — shows **both** a static "Data Streams" section (43 curated models from JSON) AND a live "Live Feed" section with pagination

Every other page (leaderboard, compare, detail, timeline) still reads `modelsData` from `data/models.json`.

**Fields available from live API (`HFLeaderboardRow`):**
- Benchmarks: `Average ⬆️`, `IFEval`, `BBH`, `MATH Lvl 5`, `GPQA`, `MUSR`, `MMLU-PRO`
- Metadata: `Architecture`, `#Params (B)`, `Type`, `Hub License`, `MoE`, `fullname`

**Fields NOT in leaderboard API (need supplementary source):**
- `releaseDate` — critical for timeline page; pull from HF model API (`lastModified`) via fetch script
- `description` — drop entirely from LLM UI
- `context` — drop entirely from LLM UI

## Desired End State

- LLM index page: single live feed section with search + filters (type, architecture), pagination
- Leaderboard LLM tab: live data, paginated, with "Average" column added, attribution footer
- Compare page LLM mode: loads from live API with text-search for model selection
- Model detail page `/models/llm/[id]`: data from live API; no description/context shown; release date shown if available; peer comparison and charts work against all live models
- Timeline page: LLM models sourced from live API with release dates from supplementary file
- `data/models.json` LLM section kept but marked deprecated in a comment; diffusion/audio untouched
- `data/llm-dates.json` new supplementary file: `{ [huggingFaceId]: string }` mapping → release dates

### Verification
- All pages load LLM data from the HF API, not from `models.json`
- No TypeScript errors (`yarn tsc --noEmit`)
- Pagination works on index, leaderboard, and compare LLM views
- Timeline LLM cards show correct release dates
- Diffusion and audio pages are completely unaffected

## What We're NOT Doing

- Not adding server-side filtering to the HF API route (datasets-server doesn't support it — filtering stays client-side)
- Not implementing a search API for models by name (we fetch a page and filter locally)
- Not fetching release dates for every model in the full dataset (too expensive; only enrich the models returned in the full fetch via a cached script output)
- Not adding model detail pages for diffusion/audio (unchanged)
- Not removing or modifying `data/models.json` structure
- Not adding authentication or rate-limit handling beyond what already exists

---

## Phase 1: Supplementary Release Dates File

### Overview
Create `data/llm-dates.json` — a lightweight `{ [huggingFaceId: string]: string }` map of HF IDs to release dates. Populate it initially from the existing `models.json` LLM entries (43 models). Update the fetch script to also write to this file using `lastModified` from the HF model API.

### Changes Required

#### 1. Create `data/llm-dates.json`
**File**: `data/llm-dates.json`  
Extract `huggingFaceId → releaseDate` from the current 43 curated LLM entries in `data/models.json`.

```json
{
  "Qwen/Qwen2.5-72B": "2024-09-18",
  "meta-llama/Llama-3.3-70B-Instruct": "2024-12-05",
  "mistralai/Mistral-Large-Instruct-2411": "2024-11-18",
  ...
}
```

#### 2. Update `scripts/fetch-hf-leaderboard.ts`
**File**: `scripts/fetch-hf-leaderboard.ts`  
After the main output is written, also write a merged `data/llm-dates.json` by combining:
- The existing `llm-dates.json` (to preserve manually-added entries)
- Newly fetched dates (`meta.lastModified` split on "T") for all processed models

```typescript
// At the end of main(), after writing hf-fetched-models.json:
const existingDates: Record<string, string> = JSON.parse(
  readFileSync(join(__dirname, "../data/llm-dates.json"), "utf-8").catch(() => "{}")
);
const newDates = results.reduce((acc, m) => {
  if (m.releaseDate && m.releaseDate !== "2024-01-01") {
    acc[m.huggingFaceId] = m.releaseDate;
  }
  return acc;
}, {} as Record<string, string>);
writeFileSync(
  join(__dirname, "../data/llm-dates.json"),
  JSON.stringify({ ...existingDates, ...newDates }, null, 2)
);
```

### Success Criteria

#### Automated Verification:
- [x] `data/llm-dates.json` exists and parses as valid JSON: `node -e "require('./data/llm-dates.json')"`
- [x] File contains at least 40 entries: `node -e "console.log(Object.keys(require('./data/llm-dates.json')).length)"` — 43 entries
- [x] TypeScript compiles: `yarn tsc --noEmit`

---

## Phase 2: Extend `LiveModel` with `releaseDate` + Add `average` to Benchmarks

### Overview
Two small but foundational changes: add `releaseDate` as an optional field on `LiveModel` (populated server-side from `llm-dates.json`), and register `average` in the benchmarks metadata registry so it renders correctly everywhere.

### Changes Required

#### 1. `lib/hf-api.ts` — Add `releaseDate` to `LiveModel`
```typescript
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
  releaseDate: string | null;   // ← add this
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
```

Update `mapHFRowToModel` to set `releaseDate: null` (it can't be populated from the leaderboard row alone — enrichment happens server-side in the API route).

#### 2. `lib/benchmarks.ts` — Add `average` benchmark
Add to `benchmarkMeta`:
```typescript
average: {
  key: "average",
  label: "Average",
  unit: "%",
  description: "Overall average score across IFEval, BBH, MATH Lvl 5, GPQA, MUSR, and MMLU-PRO benchmarks as reported by the Open LLM Leaderboard.",
  lowerIsBetter: false,
},
```

Update `categoryBenchmarks.llm` to prepend `"average"`:
```typescript
llm: ["average", "bbh", "gpqa", "mathHard", "musr", "ifeval", "mmluPro"],
```

### Success Criteria

#### Automated Verification:
- [ ] TypeScript compiles: `yarn tsc --noEmit`
- [ ] `categoryBenchmarks.llm` includes `"average"`: grep in `lib/benchmarks.ts`

---

## Phase 3: New Full-Dataset API Route + Release Date Enrichment

### Overview
Create `/api/hf-leaderboard-full/route.ts` that fetches **all** rows from the datasets server by paginating with `length=100` until exhausted, then enriches each `LiveModel` with a release date from `data/llm-dates.json`. Response is cached with `revalidate: 600` (10 minutes).

This route is used by: compare page, timeline page, and model detail page (for peer comparison).

The index and leaderboard pages continue using the existing paginated `/api/hf-leaderboard` route.

### Changes Required

#### 1. Create `app/api/hf-leaderboard-full/route.ts`

```typescript
import { NextResponse } from "next/server";
import { mapHFRowToModel, type HFLeaderboardResponse, type LiveModel } from "@/lib/hf-api";
import llmDates from "@/data/llm-dates.json";

const HF_BASE = "https://datasets-server.huggingface.co/rows?dataset=open-llm-leaderboard%2Fcontents&config=default&split=train";
const PAGE_SIZE = 100;

export async function GET() {
  try {
    // Fetch first page to get total count
    const first = await fetch(`${HF_BASE}&offset=0&length=${PAGE_SIZE}`, {
      headers: { "User-Agent": "openmodels/1.0" },
      next: { revalidate: 600 },
    });
    if (!first.ok) {
      return NextResponse.json({ error: "HF API error" }, { status: first.status });
    }
    const firstData: HFLeaderboardResponse = await first.json();
    const total = firstData.num_rows_total;
    const allRows = [...firstData.rows];

    // Fetch remaining pages in parallel (batches of 5 concurrent requests)
    const pageCount = Math.ceil(total / PAGE_SIZE);
    for (let batch = 1; batch < pageCount; batch += 5) {
      const batchRequests = [];
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

    // Map and enrich with release dates
    const dates = llmDates as Record<string, string>;
    const models: LiveModel[] = allRows.map((r) => {
      const m = mapHFRowToModel(r.row);
      m.releaseDate = dates[m.huggingFaceId] ?? null;
      return m;
    });

    return NextResponse.json(
      { models, total },
      { headers: { "Cache-Control": "s-maxage=600, stale-while-revalidate=1200" } }
    );
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
```

#### 2. Create `lib/hooks/useLeaderboardFull.ts`

```typescript
import { useQuery } from "@tanstack/react-query";
import type { LiveModel } from "@/lib/hf-api";

async function fetchLeaderboardFull(): Promise<{ models: LiveModel[]; total: number }> {
  const res = await fetch("/api/hf-leaderboard-full");
  if (!res.ok) throw new Error(`Failed to fetch full leaderboard (${res.status})`);
  return res.json();
}

export function useLeaderboardFull() {
  return useQuery({
    queryKey: ["hf-leaderboard-full"],
    queryFn: fetchLeaderboardFull,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
```

### Success Criteria

#### Automated Verification:
- [ ] Route responds 200: `curl -s http://localhost:3000/api/hf-leaderboard-full | jq '.total'`
- [ ] Returns models array: `curl -s http://localhost:3000/api/hf-leaderboard-full | jq '.models | length'`
- [ ] TypeScript compiles: `yarn tsc --noEmit`

#### Manual Verification:
- [ ] Response includes models with `releaseDate` populated for known models (e.g. `Qwen/Qwen2.5-72B`)
- [ ] Response time is acceptable (< 5s on first load, near-instant on cache hit)

**Implementation Note**: After this phase, verify the full route works before proceeding to pages that depend on it.

---

## Phase 4: Update `/api/hf-leaderboard` Route — Add Release Date Enrichment

### Overview
The existing paginated route already powers the index and leaderboard pages. Enrich it with release dates from `llm-dates.json` so those pages can also show dates without a separate fetch.

### Changes Required

#### 1. `app/api/hf-leaderboard/route.ts`
Import `llm-dates.json` and enrich rows before returning:

```typescript
import llmDates from "@/data/llm-dates.json";
import { mapHFRowToModel } from "@/lib/hf-api";

// In GET handler, before returning the response:
const dates = llmDates as Record<string, string>;
const enrichedRows = data.rows.map((r) => ({
  ...r,
  row: { ...r.row, _releaseDate: dates[r.row.fullname] ?? null },
}));
// Return enrichedRows instead of data directly, OR map to LiveModel[] here
```

**Alternative (cleaner)**: Instead of returning raw HF rows, transform to `LiveModel[]` in the route and enrich there. This would require updating `lib/hooks/useLeaderboard.ts` since it currently receives `HFLeaderboardResponse` and maps on the client. The trade-off is a slightly larger payload but better type safety.

**Decision**: Keep the raw row format for the paginated route (to minimize changes to the hook), but add a `_releaseDate` field to each row for the client to pick up. Update `mapHFRowToModel` to optionally accept a date override.

### Success Criteria

#### Automated Verification:
- [ ] TypeScript compiles: `yarn tsc --noEmit`
- [ ] Paginated route still responds 200 with valid `rows` array

---

## Phase 5: Update Index Page (`app/page.tsx`)

### Overview
Remove the static "Data Streams" section entirely. Promote "Live Feed" as the primary LLM listing. Add filters (Type, Architecture) and a search box that filters the current page. Add "View →" stretched links from `LiveModelCard` to `/models/llm/{id}`.

### Changes Required

#### 1. Remove static section
- Delete the entire "Curated Model Data Stream" `<section>` block (lines 62–85)
- Remove the `modelsData` import
- Remove the `ModelCard` component (lines 162–225)
- Remove the static `query`/`filtered` state and logic

#### 2. Add filter state and controls
New state:
```typescript
const [typeFilter, setTypeFilter] = useState<string>("all");
const [archFilter, setArchFilter] = useState<string>("all");
const [query, setQuery] = useState("");
```

Filter options for `Type`: extract unique `model.type` values from current page data. Common values from HF: `"chat"`, `"base"`, `"instruct"`, `""`.  
Filter options for `Architecture`: `"Transformer"`, `"MoE"`.

Filters apply locally to the fetched page data (not server-side, since HF API doesn't support it).

#### 3. Update "Live Feed" section header
- Rename section title to match the primary LLM listing style (e.g. "Open LLM Leaderboard")
- Add attribution line: `DATA: open-llm-leaderboard/contents via HuggingFace`

#### 4. Add links in `LiveModelCard`
Wrap the card in a relative container with a stretched `<Link href={/models/llm/${model.id}}>`, same pattern as the old `ModelCard`. Keep the HF external link badge at `z-10 pointer-events-auto`.

#### 5. Add search input
Replace the old static-data search input with a new one that filters `data.models` on the current page by `name`, `creator`, `architecture`, and `type`.

### Success Criteria

#### Automated Verification:
- [ ] No import of `modelsData` in `app/page.tsx`: `grep -n "models.json" app/page.tsx` returns nothing
- [ ] TypeScript compiles: `yarn tsc --noEmit`

#### Manual Verification:
- [ ] Index page shows only live feed (no separate static section)
- [ ] Clicking a live model card navigates to `/models/llm/{id}`
- [ ] Type and Architecture filters correctly narrow the visible cards
- [ ] Pagination still works
- [ ] HF external link still opens HF in a new tab without triggering the card link

---

## Phase 6: Update Leaderboard Page (`app/leaderboard/page.tsx`)

### Overview
Switch LLM tab to live paginated data using `useLeaderboard`. Add "Average" as the first LLM column. Add filter controls for the LLM tab. Keep diffusion/audio using static `modelsData`. Add an attribution footer for the LLM tab.

### Changes Required

#### 1. Import and use live data for LLM
```typescript
import { useLeaderboard } from "@/lib/hooks/useLeaderboard";

// In component:
const [llmOffset, setLlmOffset] = useState(0);
const LLM_PAGE_SIZE = 100;
const { data: llmData, isLoading: llmLoading } = useLeaderboard(llmOffset, LLM_PAGE_SIZE);

const models = activeCategory === "llm"
  ? (llmData?.models ?? [])
  : (modelsData as any)[activeCategory] as any[];
```

#### 2. Add "Average" column to LLM config
Update `categoryConfig.llm.columns` to add `average` as the first entry:
```typescript
{ key: "average", label: "Avg ⬆", description: "...", lowerIsBetter: false },
```
Update `categoryConfig.llm.sortKey` to `"average"` (the leaderboard default sort).

#### 3. Client-side sort for live data
The live `llmData.models` are already sorted by the leaderboard (descending average). Preserve the sort on tab; allow clicking column headers to re-sort client-side.

#### 4. Pagination controls for LLM tab
Below the LLM table, add Prev/Next buttons using `llmOffset` state (same pattern as index page). Show `offset+1`–`min(offset+PAGE_SIZE, total)` / `total`.

#### 5. Add filter controls for LLM tab (Type, Architecture)
Same filter state as Phase 5, applied to `llmData.models` before rendering the table rows.

#### 6. Attribution note
Below the LLM table (or at the top of the section):
```
Source: open-llm-leaderboard/contents · HuggingFace · Updated every 5 min
```

#### 7. Keep `modelsData` import only for diffusion/audio
The LLM branch no longer reads from `modelsData`.

### Success Criteria

#### Automated Verification:
- [ ] TypeScript compiles: `yarn tsc --noEmit`
- [ ] LLM tab in leaderboard shows "Average" column header

#### Manual Verification:
- [ ] LLM tab loads live data with pagination
- [ ] Sorting by Average works; sorting by other columns reorders rows
- [ ] Diffusion and audio tabs still show static data unchanged
- [ ] Filters narrow LLM rows correctly
- [ ] Attribution note visible on LLM tab

---

## Phase 7: Update Compare Page (`app/compare/page.tsx`)

### Overview
For LLM category, replace the static `<select>` of 43 models with a text-search input that filters models from the full live dataset. For diffusion/audio, behaviour unchanged. The full dataset is needed here so users can pick any model, not just the current page.

### Changes Required

#### 1. Import `useLeaderboardFull` for LLM mode
```typescript
import { useLeaderboardFull } from "@/lib/hooks/useLeaderboardFull";

// In component:
const { data: liveData } = useLeaderboardFull();
const llmModels = liveData?.models ?? [];
```

#### 2. Replace model state initialization for LLM
```typescript
const [selectedModelIds, setSelectedModelIds] = useState<string[]>([]);

// When liveData loads and category is llm, initialize:
useEffect(() => {
  if (activeCategory === "llm" && llmModels.length > 0 && selectedModelIds.length === 0) {
    setSelectedModelIds([llmModels[0].id, llmModels[1]?.id ?? llmModels[0].id]);
  }
}, [activeCategory, llmModels]);
```

#### 3. Add search input for LLM model selection
Replace `<select>` for LLM with a `<input type="text">` search + filtered dropdown (or a combo pattern):
- Text input filters `llmModels` by name/creator on each keystroke
- Show a scrollable list of matching results (max 20 shown) for the user to click
- Selected model name shown in the input when selected

Keep `<select>` for diffusion/audio (small lists).

#### 4. Update `models` variable
```typescript
const models = activeCategory === "llm"
  ? llmModels
  : (modelsData as any)[activeCategory] as any[];
```

#### 5. Update `handleCategoryChange`
On switch to LLM, reset `selectedModelIds` to first two live models (or `[]` until data loads). On switch to diffusion/audio, use static data as before.

#### 6. `benchmarkKeys` for LLM
`LiveModel.benchmarks` now includes `average` as well as the 6 benchmarks. The compare chart should show all 7 benchmark keys.

### Success Criteria

#### Automated Verification:
- [ ] TypeScript compiles: `yarn tsc --noEmit`

#### Manual Verification:
- [ ] LLM compare mode loads live models list
- [ ] Typing in search narrows the list; clicking a result selects it
- [ ] Charts render correctly with live LLM data
- [ ] "Average" appears in the bar and radar charts for LLM comparisons
- [ ] Switching to diffusion/audio still works with static data
- [ ] Up to 5 nodes selectable

---

## Phase 8: Update Model Detail Page (`app/models/[category]/[id]/page.tsx`)

### Overview
For LLM category: source the model and all peer models from the live full dataset. Adapt the UI to remove `description` and `context` (not available from live API). Show `releaseDate` if present. For diffusion/audio: no change.

This is the most impactful change. The page currently requires ALL models in the category for peer comparison, radar normalization, and ranking. For LLM, we fetch the full dataset from `useLeaderboardFull`.

### Changes Required

#### 1. Split the page by category
Since LLM now uses live data and diffusion/audio use static, add a conditional branch at the top:

```typescript
// For LLM category: render LiveLLMDetailPage (client component with data fetching)
// For diffusion/audio: render existing static logic unchanged
```

Create a new client component `app/models/[category]/[id]/LLMDetailView.tsx` (or inline the LLM-specific branch in the page).

#### 2. LLM detail data fetching
```typescript
const { data: liveData, isLoading } = useLeaderboardFull();
const allModels = liveData?.models ?? [];
const model = allModels.find((m) => m.id === id);
```

Show loading skeleton while `isLoading`. Show "Model not found" fallback with link back to `/`.

#### 3. Remove unavailable LLM fields from UI
- Remove `description` paragraph (no equivalent in `LiveModel`)
- Remove `Context` MetaStat (no `context` in `LiveModel`)
- Keep `releaseDate` MetaStat (use `model.releaseDate`, show "—" if null)
- Keep `creator`, `params`, `architecture`, `huggingFaceId` (all present in `LiveModel`)
- Add `type` badge (e.g. "chat", "base") — new info available from live data
- Add `license` display
- Add `isMoE` badge

#### 4. Update benchmarks to include `average`
`benchKeys` for LLM comes from `categoryBenchmarks.llm` which now includes `"average"`. The benchmark card, radar, and peer table all render using `benchKeys`, so they automatically pick up `average` without further changes — as long as `model.benchmarks.average` is populated (it is, from `mapHFRowToModel`).

#### 5. Add attribution note
Below the detail header or in a footer:
```
Benchmark data: open-llm-leaderboard/contents · HuggingFace
```

#### 6. Peer comparison performance concern
With potentially 3000+ live models, the peer table would be unreadable. Limit the peer table to: top 5 by `average`, bottom 3, and models ±10 positions around the current model (ranked by `average`).

### Success Criteria

#### Automated Verification:
- [ ] TypeScript compiles: `yarn tsc --noEmit`

#### Manual Verification:
- [ ] Navigate to `/models/llm/{any-live-id}` — page loads with live data
- [ ] Benchmark cards show correct values + rank/total
- [ ] Radar chart renders with normalised scores including "Average"
- [ ] Category Standing bar chart renders
- [ ] Peer table shows sensible subset (not all 3000 models)
- [ ] HuggingFace link button works
- [ ] Diffusion and audio detail pages completely unaffected

---

## Phase 9: Update Timeline Page (`app/timeline/page.tsx`)

### Overview
Replace static `modelsData.llm` with live data from `useLeaderboardFull`. LLM models without a `releaseDate` are excluded from the timeline (they have no place on the time axis). Diffusion and audio remain from `modelsData`.

### Changes Required

#### 1. Import `useLeaderboardFull`
```typescript
import { useLeaderboardFull } from "@/lib/hooks/useLeaderboardFull";
```

#### 2. Update `normaliseModels` to accept live LLM data
```typescript
function normaliseModels(liveLLMs: LiveModel[]): TimelineModel[] {
  const llms: TimelineModel[] = liveLLMs
    .filter((m) => m.releaseDate != null)
    .map((m) => ({
      id: m.id,
      name: m.name,
      creator: m.creator,
      category: "llm" as Category,
      params: m.params,
      releaseDate: m.releaseDate!,
      benchmarkLabel: "Avg",
      benchmarkValue: m.benchmarks.average != null ? `${m.benchmarks.average}%` : "—",
      href: `/models/llm/${m.id}`,
    }));
  // diffusion and audio remain from modelsData (unchanged)
  ...
}
```

#### 3. Show loading state for LLM data
While `isLoading`, render the timeline with only diffusion/audio models and a subtle "LLM data loading..." indicator in the header.

#### 4. Update type for `LLMModel`
Remove the `type LLMModel = (typeof modelsData.llm)[number]` alias — no longer needed.

### Success Criteria

#### Automated Verification:
- [ ] TypeScript compiles: `yarn tsc --noEmit`
- [ ] No import of `modelsData.llm` in `app/timeline/page.tsx`

#### Manual Verification:
- [ ] Timeline shows LLM models grouped by their release dates
- [ ] Models in `llm-dates.json` appear at the correct year/month
- [ ] LLM models without release dates do not appear (no broken entries)
- [ ] Diffusion and audio cards unchanged
- [ ] Category filter toggles still work correctly

---

## Phase 10: Deprecation + Cleanup

### Overview
Mark the LLM section of `models.json` as deprecated. Update the fetch/merge scripts to note their legacy role. Remove dead code.

### Changes Required

#### 1. `data/models.json` — Add deprecation comment
JSON doesn't support comments, so add a `_deprecated` marker field:
```json
{
  "_llm_deprecated": "LLM data in this file is no longer used by the app. The app now fetches LLM data live from open-llm-leaderboard/contents via /api/hf-leaderboard. This data is kept for reference and as a source for data/llm-dates.json.",
  "llm": [ ... ],
  "diffusion": [ ... ],
  "audio": [ ... ]
}
```

#### 2. Remove dead imports
- `app/page.tsx`: no more `modelsData` import (already done in Phase 5)
- `app/leaderboard/page.tsx`: keep `modelsData` only for diffusion/audio
- `app/timeline/page.tsx`: remove `modelsData.llm` usage

#### 3. Update `CHANGELOG.md`
Add entry for this version bump (minor version).

#### 4. Update `AGENTS.md` codebase map
Update the `data/models.json` schema section to note LLM section is deprecated, and document `data/llm-dates.json`.

### Success Criteria

#### Automated Verification:
- [ ] TypeScript compiles: `yarn tsc --noEmit`
- [ ] `yarn lint` passes
- [ ] `yarn build` succeeds with no errors

#### Manual Verification:
- [ ] All 6 pages work correctly: `/`, `/leaderboard`, `/compare`, `/models/llm/[id]`, `/timeline`, `/diffusion`
- [ ] No references to removed `ModelCard` component
- [ ] `data/models.json` still parses correctly (diffusion/audio intact)

---

## Testing Strategy

### Pages to test after each phase:
| Phase | Pages affected |
|-------|---------------|
| 1–2 | No UI changes |
| 3 | `/api/hf-leaderboard-full` endpoint |
| 4 | Existing `/api/hf-leaderboard` still works |
| 5 | `/` (index) |
| 6 | `/leaderboard` |
| 7 | `/compare` |
| 8 | `/models/llm/[any-id]` |
| 9 | `/timeline` |
| 10 | All pages + build |

### Known risks:
- **Full-dataset API performance**: If the leaderboard has >2000 models, the full fetch route may take several seconds on cold start. Mitigate with ISR caching and optimistic loading skeletons.
- **Model ID collisions**: Two models could slugify to the same ID (e.g. `org/Model-V1` and `org/model-v1`). The existing `slugify` function doesn't handle this. For now, accept this edge case.
- **Compare page initialization**: The `useLeaderboardFull` hook loads asynchronously. Initialize `selectedModelIds` only after data loads.

## References
- Live API route: `app/api/hf-leaderboard/route.ts`
- Types: `lib/hf-api.ts`
- Hook: `lib/hooks/useLeaderboard.ts`
- Static data: `data/models.json`
- HF datasets server docs: `https://huggingface.co/docs/datasets-server`

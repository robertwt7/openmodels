# Design Spec: Model Telemetry Control Deck & Multi-Modal Expansion

## 1. Objective
Enable users to compare open-source AI models across three categories (LLM, Diffusion, Audio) using a centralized "Control Deck" for model selection.

## 2. Data Strategy
### 2.1 expanded `data/models.json`
I will update the JSON structure to include representative open-source models for Diffusion and Audio, ensuring consistent benchmark fields for each category.

**Diffusion Models (FID/Clip Score/Inference Speed):**
- **Flux.1 [schnell]**: High-speed, high-quality open weight model.
- **SDXL 1.0**: The industry standard for open diffusion.
- **Playground v2.5**: Optimized for aesthetics.

**Audio Models (WER/Latency/Multilingual Support):**
- **Whisper v3**: SOTA speech-to-text.
- **SeamlessM4T v2**: Multimodal translation and speech.
- **Stable Audio Open**: Latent diffusion for audio synthesis.

## 3. UI/UX: The Control Deck (Approach 1)
### 3.1 Layout
A horizontal "Control Module" sitting between the header and the charts.
- **Slot 1: Category Selector** (LLM, DIFFUSION, AUDIO).
- **Slot 2: Node Alpha** (Dropdown for first model).
- **Slot 3: Node Beta** (Dropdown for second model).

### 3.2 Visual Language
- **Themed Dropdowns:** Custom styled `<select>` or custom component using `surface_container_highest`.
- **Active Indicators:** A "Cyber Lime" (`primary`) square next to the selected model name.
- **Typography:** JetBrains Mono for all selection inputs to maintain the terminal feel.

## 4. Technical Implementation
- **React State:** `activeCategory`, `modelAId`, `modelBId`.
- **Effect Hook:** When `activeCategory` changes, reset `modelAId` and `modelBId` to the first two models of that category.
- **Dynamic Chart Logic:**
  - Map `activeCategory` to a set of `benchmarkKeys`.
  - Filter `modelsData[activeCategory]` to get the selected models.
  - Re-render Recharts with the new data keys.

## 5. Verification Plan
- **Data Integrity:** Confirm `models.json` is valid JSON and contains all required categories.
- **Interaction Test:** Verify that changing the category updates the available models in the dropdowns.
- **Visual Check:** Ensure charts update with the correct benchmarks (e.g., WER for Audio, FID for Diffusion).
- **Styling Check:** Confirm the "Control Deck" follows the Kinetic Mainframe spacing and color rules.

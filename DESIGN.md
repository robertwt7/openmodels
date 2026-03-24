# Design System Specification: The Kinetic Mainframe

## 1. Overview & Creative North Star
This design system is a sophisticated reimagining of the 1980s high-density computing era. It moves beyond "retro-kitsch" into an aesthetic we define as **"The Kinetic Mainframe."** 

The Creative North Star is the intersection of legacy industrial hardware and modern high-speed intelligence. We are building a digital environment that feels like a redacted government terminal updated with a high-bandwidth neural interface. To achieve this, we break the "template" look through **structural framing**—using a rigid, math-heavy grid that feels architectural rather than decorative. We embrace high-contrast "blooming" light against a deep, infinite void.

---

## 2. Color Strategy: Light in the Void
The palette is built on high-energy luminescence against a charcoal abyss. We avoid the safety of purple/blue gradients in favor of a raw, industrial "Cyber Lime" and "Electric Amber" pairing.

### Palette Application
- **The Void (Base):** `surface` (#0e1322) is our absolute foundation. It is the vacuum in which data exists.
- **Primary Energy:** `primary` (#DFFF00 / Cyber Lime). Used for critical actions, active states, and "Power On" indicators.
- **Secondary Data:** `secondary_container` (#FFBF00 / Electric Amber). Reserved for legacy data streams, warnings, and high-importance model metrics.

### The "No-Line" Rule & Structural Framing
Standard 1px solid borders for sectioning are strictly prohibited. They feel like a "web template." Instead, boundaries are defined by:
1.  **Tonal Shifts:** A `surface_container_low` section sitting on a `surface` background.
2.  **Structural Framing:** Using `outline_variant` (#454932) at 20% opacity to create "grid lines" that run the full height/width of the viewport, mimicking a technical drawing or a terminal screen's cathode ray alignment.
3.  **Surface Hierarchy:** Use the hierarchy from `surface_container_lowest` (#090e1c) to `surface_container_highest` (#2f3445) to create "nested" logic. An AI model's stats should sit in a `surface_container_high` card to feel physically "slotted" into the mainframe.

---

## 3. Typography: The Editorial Terminal
We utilize a hierarchy that contrasts human-centric geometry with machine-centric data.

- **Display & Headlines (Space Grotesk):** These must be bold and tightly tracked. Use `display-lg` (3.5rem) for hero statements to create a high-end editorial feel. The geometric nature of Space Grotesk bridges the gap between 80s sci-fi and modern luxury.
- **Body & Metadata (Public Sans):** Used for long-form descriptions. It provides the "breath" between dense data points.
- **Data Streams (Monospaced Overlay):** While not in the primary scale, all numerical comparisons and AI model technical specs *must* use a monospaced font (JetBrains Mono). This signals "raw output" to the user.

---

## 4. Elevation & Depth: The Bloom Principle
In a mainframe environment, depth is created by light emission (Glow) and tonal stacking, not physical shadows.

- **The Layering Principle:** Stack `surface-container` tiers. For example, the comparison table header should be `surface_container_highest`, while the rows are `surface_container_low`. This creates a "milled" effect where elements feel recessed or extruded.
- **Emission (Bloom):** Traditional shadows are replaced by "Ambient Glows." When a button or chip is active, apply a drop-shadow using the `primary` color (#DFFF00) with a 20px blur at 15% opacity. This mimics the "bloom" of a CRT monitor.
- **Glassmorphism:** For floating "System Overlays" (modals or tooltips), use a semi-transparent `surface_container_highest` with a `backdrop-filter: blur(12px)`. This creates a "frosted terminal" effect that keeps the background data visible but diffused.

---

## 5. Components

### Buttons: Tactile Input
- **Primary:** Solid `primary` (#DFFF00) with `on_primary` (#2c3400) text. Use `DEFAULT` (0.25rem) roundedness. 
- **Effect:** Add a 1px inner-top-border of #ffffff (20% opacity) to give a "mechanical keycap" feel.
- **State:** On hover, increase the "bloom" shadow.

### Data Chips: Metric Badges
- **Style:** No fill. Use a `Ghost Border` (outline-variant at 20% opacity).
- **Typography:** `label-md` using monospaced font.
- **Visual:** A 4px solid square of `primary` or `secondary` in the leading position to indicate status.

### Input Fields: Terminal Command
- **Base:** `surface_container_lowest`.
- **Border:** Bottom-border only (2px) using `outline`. On focus, the border shifts to `primary` with a subtle glow.
- **Prompt:** Always prefix text inputs with a `>` character in `primary` to reinforce the terminal aesthetic.

### Cards & Lists: High-Density Comparison
- **Rule:** Forbid divider lines between list items. Use a 1px jump in `surface_container` values or `spacing-2` (0.4rem) of vertical white space.
- **Header:** Use `headline-sm` in all caps with a tracking of 0.1em for an authoritative, "system-header" feel.

---

## 6. Do's and Don'ts

### Do:
- **Use Intentional Asymmetry:** Align the main content to a 12-column grid, but leave the 1st or 12th column empty for "System Metadata" or vertical "Scanline" decorative text.
- **Apply CRT Overlays:** Use a global CSS overlay of subtle, repeating linear-gradients (scanlines) at 2% opacity to give the screen a physical, hardware-processed texture.
- **Embrace "Data-Heavy" Layouts:** Use `body-sm` and `label-sm` for technical specs. The user should feel like they are looking at a powerful instrument.

### Don't:
- **Don't use "Standard" Blue:** Any hint of standard "SaaS Blue" or "Brand Purple" will break the mainframe immersion. Stick to the Charcoal/Lime/Amber triad.
- **Don't use Soft Shadows:** Large, dark grey shadows make the site feel like a standard consumer app. Use Tonal Layering or Glows instead.
- **Don't over-round corners:** Never use `full` (pill) shapes for structural elements. Stick to `DEFAULT` (0.25rem) or `none` to maintain the hardware-inspired rigidity.

---

## 7. Signature Interaction: The "Boot Sequence"
On initial page load, elements should not simply "fade in." Use a staggered "line-by-line" reveal or a "terminal typing" effect for headings. This reinforces the narrative that the AI comparison data is being "fetched" from a deep-layered mainframe.
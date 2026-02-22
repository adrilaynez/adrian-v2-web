# N-Gram Page Redesign — Architect Specification

> Produced by Prompt 1 ("The Architect")  
> Affects: `en.ts`, `NgramNarrative.tsx`, `page.tsx`, `NgramPedagogyPanels.tsx`, NEW `NgramGenerationBattle.tsx`

---

## 1. i18n String Additions & Changes

### 1.1 §2 howItWorks — Rewritten & Expanded

**Rationale:** Current §2 places `NgramMiniTransitionTable` and `CountingComparisonWidget` back-to-back with no bridging text. The new lead better frames the mental model; a new `bridge` paragraph sits between the two visualizers.

```typescript
// REPLACE ngramNarrative.howItWorks entirely
howItWorks: {
    label: "Mechanics",
    title: "Counting with Context",
    lead: "The core idea is unchanged from bigrams — we still count. But now, instead of asking 'what follows this one character?', we ask 'what follows this sequence of N characters?' The table gets deeper, but the logic stays simple.",
    p1: "For every position in the training text, the model extracts the",
    p1Highlight: " N-character context",
    p1End: " and records which character comes next. At prediction time it looks up the matching context row and reads off the stored probability distribution — pure table lookup, no math.",
    p2: "With N=1 (bigram) the table is a flat V×V grid. With N=2 it becomes a stack of grids — one per two-character prefix. Each additional character of context adds another dimension. The table doesn't just grow; it multiplies.",
    // NEW key: bridging text between NgramMiniTransitionTable and CountingComparisonWidget
    bridge: "The transition table above shows individual rows from this giant lookup table. But how do longer contexts actually change the counts? The widget below puts bigram and trigram counting side by side on the same training text so you can see the difference directly.",
},
```

### 1.2 §3 improvement — Rewritten Lead + New §3.5 "whyNotMore"

**Rationale:** Current lead is generic. New lead ties back to §2's counting. New §3.5 subsection adds the "Why not N=100?" rhetorical question to bridge into §4's explosion.

```typescript
// REPLACE ngramNarrative.improvement
improvement: {
    label: "Improvement",
    title: "The Prediction Gets Better",
    lead: "More context means less ambiguity. When the model can see two characters instead of one, it rules out far more candidates — and the remaining predictions become dramatically more confident.",
    example: "After 'h', dozens of characters are plausible. After 'th', the model strongly expects 'e'. After 'the', a space becomes almost certain. Each extra character of context narrows the field.",
},

// NEW key block: ngramNarrative.whyNotMore (rendered as §3.5 subsection)
whyNotMore: {
    title: "Why Not N=100?",
    lead: "If more context makes predictions better, why stop at 3 or 4? Why not look at the last 100 characters?",
    p1: "Because every extra character of context multiplies the number of rows in the lookup table by the vocabulary size. With 96 characters, going from N=3 to N=4 means 96× more rows. Going to N=100 would require a table with more entries than atoms in the observable universe. The next section makes this explosion visceral.",
},
```

### 1.3 §5 deeperProblem — Expanded with Infinite Data & Typo/Novel Word Failures

**Rationale:** Current §5 only covers cat/dog generalization. New keys add (a) the infinite-data thought experiment and (b) concrete typo/novel-word failure examples.

```typescript
// REPLACE ngramNarrative.deeperProblem
deeperProblem: {
    label: "Limitations",
    title: "The Deeper Problem",
    lead: "The explosion is a practical problem — you can't build a big-enough table. But there's a conceptual problem that's even worse: even with infinite data, counting still fails.",
    p1: "Imagine the text starts with 'the cat sat on the'. If the model has seen that exact context, it can predict what comes next from memory.",
    p2: "Now change one word: 'the dog sat on the'. A human sees it's almost the same situation. The N-gram model treats it like a completely new, unrelated context.",
    p3: "N-grams have no concept of 'similar.' The contexts 'the cat' and 'the dog' are as different to the model as 'the cat' and 'xyzq'. Each is a separate row in the table, with zero connection between them.",
    // NEW: infinite data thought experiment
    infiniteData: {
        title: "Even Infinite Data Can't Help",
        p1: "Suppose you had unlimited training text — every book ever written. Could you fill the table? No. Language is creative: people invent new sentences constantly. The number of possible 10-word sequences vastly exceeds the number of sentences ever uttered. No corpus, however large, can cover every valid context.",
    },
    // NEW: typo and novel word failure examples
    failureExamples: {
        title: "When Counting Breaks Down",
        typoLabel: "Typos",
        typoText: "A user types 'teh cat' instead of 'the cat'. The model has never seen the context 'teh' and returns a uniform (random) distribution. One wrong keystroke erases all learned knowledge.",
        novelLabel: "Novel words",
        novelText: "A new word enters the language — 'selfie', 'blockchain', 'vibe-check'. The model has zero entries for any context containing these words. It cannot even guess that 'selfie' behaves like other nouns.",
    },
    calloutTitle: "No Generalization",
    calloutText: "If the model has never seen a particular sequence in training, it has nothing to say. It can't guess. It can't reason by analogy. It just shrugs. This is the fundamental limitation that motivates neural approaches.",
},
```

### 1.4 NgramGenerationBattle — New Component Labels

```typescript
// NEW key block: ngramNarrative.generationBattle
generationBattle: {
    title: "Generation Battle",
    subtitle: "Same seed, different memory",
    description: "Watch how the same starting text produces dramatically different output as the model's context window grows.",
    columnHeader: "N = {n}",
    qualityLabels: {
        1: "Random noise",
        2: "Letter patterns emerge",
        3: "Word fragments appear",
        4: "Recognizable phrases",
    },
    streaming: "Generating…",
    seedLabel: "Seed text",
    generateButton: "Generate All",
    regenerateButton: "Regenerate",
    tokensLabel: "{count} characters",
    emptyState: "Press Generate to start the battle",
},

// Also add the figure wrapper keys
// inside ngramNarrative.figures:
figures: {
    // ... existing keys preserved ...
    generationBattle: {
        label: "Generation battle · Side-by-side comparison",
        hint: "Each column uses the same seed text but a different context size. Longer context produces more coherent output — until sparsity takes over.",
    },
},
```

### 1.5 Lab Mode — Technical Explanation Section

```typescript
// NEW inside models.ngram.lab:
technicalExplanation: {
    title: "Technical Explanation",
    description: "Under the hood of the current N-gram model",
    modelType: "Model Type",
    modelTypeValue: "Character-level {n}-gram (order {nPlusOne})",
    parameterCount: "Parameter Count",
    parameterCountDesc: "|V|^{n} × |V| = {count} probability entries",
    trainingMethod: "Training Method",
    trainingMethodValue: "Maximum likelihood estimation via counting",
    smoothing: "Smoothing",
    smoothingValue: "Add-α (Laplace) smoothing with α = {alpha}",
    corpusInfo: "Training Corpus",
    corpusInfoValue: "{name} — {tokens} tokens, {vocabSize} unique characters",
    mathematicalFormulation: "Mathematical Formulation",
    formula: "P(c_{t} | c_{t-N}, …, c_{t-1}) = count(c_{t-N}…c_{t}) / count(c_{t-N}…c_{t-1})",
    formulaDesc: "The probability of the next character given the N-character context is the ratio of how often that (N+1)-gram appeared in training to how often the N-gram prefix appeared.",
    inferenceComplexity: "Inference Complexity",
    inferenceComplexityValue: "O(1) — single hash-table lookup per prediction",
    collapsibleLabel: "Show Technical Details",
},
```

---

## 2. NgramGenerationBattle Component Specification

### 2.1 File Location

`src/components/lab/NgramGenerationBattle.tsx`

### 2.2 Props Interface

```typescript
interface NgramGenerationBattleProps {
    /** Seed phrases to choose from or auto-cycle through */
    seeds?: string[];
    /** Which N values to show as columns (default: [1, 2, 3, 4]) */
    nValues?: number[];
    /** Max characters to generate per column (default: 80) */
    maxTokens?: number;
    /** Temperature for all generations (default: 0.8) */
    temperature?: number;
}

// Default values:
// seeds = ["the ", "I wa", "hello"]
// nValues = [1, 2, 3, 4]
// maxTokens = 80
// temperature = 0.8
```

### 2.3 Layout Description

```
┌─────────────────────────────────────────────────────────┐
│ ⚔ Generation Battle                                     │
│   "Same seed, different memory"                         │
│                                                         │
│  Seed: [ the ▾ ]              [ Generate All ]          │
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ N = 1    │ │ N = 2    │ │ N = 3    │ │ N = 4    │   │
│  │ (amber   │ │ (amber   │ │ (amber   │ │ (amber   │   │
│  │  badge)  │ │  badge)  │ │  badge)  │ │  badge)  │   │
│  ├──────────┤ ├──────────┤ ├──────────┤ ├──────────┤   │
│  │          │ │          │ │          │ │          │   │
│  │ streamed │ │ streamed │ │ streamed │ │ streamed │   │
│  │ text     │ │ text     │ │ text     │ │ text     │   │
│  │ area     │ │ area     │ │ area     │ │ area     │   │
│  │          │ │          │ │          │ │          │   │
│  ├──────────┤ ├──────────┤ ├──────────┤ ├──────────┤   │
│  │ "Random  │ │ "Letter  │ │ "Word    │ │"Phrases" │   │
│  │  noise"  │ │ patterns"│ │fragments"│ │          │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
│                                                         │
│  80 characters · 0.8 temperature                        │
└─────────────────────────────────────────────────────────┘
```

**Responsive:** On mobile (`< md`), columns stack vertically (1 per row). On `md+`, 2×2 grid. On `lg+`, 4 columns inline.

### 2.4 Data Flow

1. User clicks "Generate All" (or component auto-generates on mount in narrative mode).
2. For each `n` in `nValues`, call `generateNgram(seed, maxTokens, temperature, n)` **in parallel** via `Promise.all`.
3. Each column shows a loading spinner while its request is in flight.
4. On response, display `generated_text` in a `font-mono` text area with a typewriter animation (characters appear sequentially over ~1.5s using `framer-motion` `staggerChildren`).
5. The seed text is shown in **bold amber** at the start of each column's output; generated text follows in normal weight.
6. Below each text area, show the quality label from `ngramNarrative.generationBattle.qualityLabels[n]`.

**State:**
- `selectedSeed: string` — current seed from dropdown
- `results: Record<number, { text: string; loading: boolean; error: string | null }>` — per-N results
- `isGenerating: boolean` — true while any column is loading

### 2.5 Placement

| Location | Context | Behavior |
|----------|---------|----------|
| `NgramNarrative.tsx` §3 | After `ConcreteImprovementExample`, before `NgramComparison` | Auto-generates on first scroll into view (IntersectionObserver). Seeds fixed to `["the "]`. |
| `page.tsx` lab mode | After `ContextControl`, before the Transition Matrix row | Manual "Generate All" button. Seed dropdown visible. Uses page's current `viz.contextSize` as highlighted column. |

### 2.6 Visual Style

- Amber/orange accent throughout (consistent with N-gram identity).
- Column header badges: `bg-amber-500/15 text-amber-300 border-amber-500/30 font-mono`.
- Text area: `bg-black/30 border border-white/[0.06] rounded-lg p-4 font-mono text-sm text-white/70 min-h-[120px]`.
- Quality label: `text-[10px] uppercase tracking-[0.15em] font-bold`, color varies by quality (N=1: `text-red-400/60`, N=2: `text-orange-400/60`, N=3: `text-amber-400/60`, N=4: `text-emerald-400/60`).
- Wrapped in `FigureWrapper` in narrative mode; in `LabSection` in lab mode.

---

## 3. Lab Mode Layout Restructure Specification

### 3.1 New Component Order (top to bottom)

| # | Component | Show Condition | Accent | Notes |
|---|-----------|---------------|--------|-------|
| 1 | `ModelHero` | Always | — | Unchanged |
| 2 | Lab mode badge | Always | **amber** (was cyan) | Change `Zap` icon color and text color from `cyan` → `amber` |
| 3 | `GuidedExperiments` | Always | amber (already) | **Default state: open**, first experiment expanded |
| 4 | `ContextControl` | Always | amber (already, mode-aware) | **Change min from 1 → 2** (see §3.3) |
| 5 | `NgramGenerationBattle` | `contextSize < 5` | amber | NEW. Manual trigger. Highlighted column = current N. |
| 6 | `FlowHint` | Always | **amber** (was cyan) | Change `border-cyan-500/20` → `border-amber-500/20` |
| 7 | **ROW:** `TransitionMatrix` (3/5) + `Sparsity` + `Comparison` (2/5) | Always | Matrix: **amber** (was cyan), Sparsity: red, Comparison: violet | Change `TransitionMatrix` accent prop and conditioned-on label from cyan → amber |
| 8 | `FlowHint` | Always | **amber** | |
| 9 | `PerformanceSummary` | `hasPerformanceData` | emerald | Unchanged |
| 10 | `NgramLossChart` | `hasLossHistory` | emerald | Unchanged |
| 11 | `FlowHint` | `hasLossHistory` | **amber** | |
| 12 | **ROW:** `InferenceConsole` + `StepwisePrediction` | `contextSize < 5` | Inference: **amber** (was cyan), Stepwise: violet | |
| 13 | `GenerationPlayground` | `contextSize < 5` | amber (already) | Unchanged |
| 14 | **Collapsible "Advanced"** wrapper | Always | white/10 border | Contains: `NgramFiveGramScale` (when N≥5), N=5 warning banner |
| 15 | **Collapsible "Technical Explanation"** | Always | white/10 border | NEW section (see §5) |
| 16 | Footer | Always | **amber** (was cyan) | Change `FlaskConical` icon and text color |

### 3.2 Accent Color Changes Summary

All lab-mode components that currently use `cyan` accent must switch to `amber` to match the N-gram chapter identity:

| Component / Element | Old | New |
|---------------------|-----|-----|
| Lab badge icon + text | `text-cyan-400` / `text-cyan-300/60` | `text-amber-400` / `text-amber-300/60` |
| `FlowHint` border | `border-cyan-500/20` | `border-amber-500/20` |
| `LabSection` for Transition Matrix | `accent="cyan"` (default) | `accent="amber"` |
| `TransitionMatrix` accent prop | `accent="cyan"` | `accent="amber"` |
| Conditioned-on label | `text-cyan-300/60` | `text-amber-300/60` |
| `LabSection` for InferenceConsole | default (cyan) | `accent="amber"` |
| Footer text | `text-cyan-300/15` | `text-amber-300/15` |

### 3.3 ContextControl min=2 Change

In lab mode only, the `ContextControl` slider `min` should be `2` instead of `1`. Rationale: N=1 is the bigram model covered in Chapter 1. The N-gram lab (Chapter 2) should start at N=2 minimum to avoid confusion.

**Implementation approach:** Add an optional `min` prop to `ContextControl`:

```typescript
interface ContextControlProps {
    value: number;
    onChange: (value: number) => void;
    disabled?: boolean;
    min?: number; // NEW — default 1
}
```

In `page.tsx`, pass `min={2}`. The label buttons should only render for values `≥ min`. The slider `min` prop uses this value.

### 3.4 GuidedExperiments Default State

Change `GuidedExperiments` initial state:
- `open`: `true` (was `false`)
- `expanded`: `1` (first experiment expanded, was `null`)

```typescript
// Change these initial state values:
const [open, setOpen] = useState(true);       // was false
const [expanded, setExpanded] = useState<number | null>(1); // was null
```

### 3.5 "Advanced" Collapsible Wrapper

Components that only appear at N≥5 (the `NgramFiveGramScale` explosion panel and the N=5 warning banner) should be wrapped in a collapsible section labeled **"Advanced · Combinatorial Explosion"**. This section:

- Is **collapsed by default**.
- Has the same toggle pattern as `GuidedExperiments` (chevron, amber border).
- Only renders when `contextSize >= 5`.
- Contains the existing N≥5 explosion panel and warning text.

---

## 4. NgramMiniTransitionTable Fallback Behavior

### 4.1 Problem

When `datasetLookup` returns empty results (no corpus matches for a context+next pair), the current behavior shows a bare italic "No matches found in sampled corpus." This is unhelpful pedagogically.

### 4.2 Specified Fallback

When `rowEvidence.length === 0` and `!isLoading`, render:

```
┌────────────────────────────────────────────────┐
│ ⚠ No matches in sample                         │
│                                                │
│ The training corpus sample doesn't contain      │
│ this exact transition. This is expected —       │
│ not every possible N-gram appears in a finite   │
│ corpus. This is the sparsity problem.          │
│                                                │
│ Try expanding a different row, or reduce N      │
│ to see more matches.                           │
└────────────────────────────────────────────────┘
```

**i18n keys:**

```typescript
// Add to ngramPedagogy.transitions:
noMatchesExpanded: {
    title: "No matches in sample",
    explanation: "The training corpus sample doesn't contain this exact transition. This is expected — not every possible N-gram appears in a finite corpus. This is the sparsity problem.",
    hint: "Try expanding a different row, or reduce N to see more matches.",
},
```

**Visual:** Yellow/amber warning style (not red). Use `AlertTriangle` icon, `border-amber-500/20 bg-amber-500/[0.04]` container matching the narrative Callout style.

### 4.3 Better Demo Text

Replace the hardcoded `"LANGUAGE"` demo word with `"the qui"` (the beginning of "the quick brown fox…").

**Rationale:**
- `"LANGUAGE"` is all-caps, which almost never appears in the Paul Graham training corpus → most lookups return empty.
- `"the qui"` is lowercase, contains extremely common English transitions (`th→e`, `e→ `, ` →q`, `qu→i`), and will produce rich corpus evidence at every N value.

**Affected locations:**
- `NgramMiniTransitionTable` → `buildTransitions()` function: change `const sequence = "LANGUAGE"` to `const sequence = "the qui"`.
- `NgramContextPrimer` → change `const history = "LANGUAGE"` to `const history = "the qui"`.
- `NgramContextGrowthAnimation` → change `const tokenStream = "LANGUAGE"` to `const tokenStream = "the qui"`.
- i18n strings referencing "LANGUAGE" in `ngramPedagogy.transitions.isEduBody` and `isFreeBody`: update to reference "the qui" instead.

**Updated i18n:**

```typescript
// Replace in ngramPedagogy.transitions:
isEduBody: "Instead of a giant table, let's trace a few transitions through the phrase <0>the qui</0>. Each row shows: \"given this context, the next character was...\" — plus real evidence from the training corpus.",
isFreeBody: "Sample transitions from <0>the qui</0> with corpus evidence.",
```

---

## 5. Lab Technical Explanation Section Specification

### 5.1 Data Requirements

The section reads from data already available in `page.tsx`:

| Field | Source | Example |
|-------|--------|---------|
| Context size (N) | `viz.contextSize` | `3` |
| Vocab size | `diagnostics?.vocab_size` | `96` |
| Context space | `diagnostics?.estimated_context_space` | `884736` |
| Total tokens | `training?.total_tokens` | `221427` |
| Unique contexts | `training?.unique_contexts` | `8847` |
| Perplexity | `training?.perplexity` | `7.23` |
| Final loss | `training?.final_loss` | `1.978` |
| Corpus name | `nGramData?.metadata.corpus_name` or fallback `"Paul Graham Essays"` | `"Paul Graham Essays"` |
| Smoothing alpha | `(training as any)?.smoothing_alpha` or fallback `1.0` | `1.0` |

No new API calls required.

### 5.2 Layout

```
┌────────────────────────────────────────────────────────────────┐
│ ▶ Show Technical Details                    [ChevronDown]      │
├────────────────────────────────────────────────────────────────┤
│ (Collapsed by default. When expanded:)                         │
│                                                                │
│  ┌─ Model Card ─────────────────────────────────────────────┐  │
│  │ Model Type:    Character-level 3-gram (order 4)          │  │
│  │ Parameters:    |V|^3 × |V| = 84,934,656 entries         │  │
│  │ Training:      Maximum likelihood estimation via counting│  │
│  │ Smoothing:     Add-α (Laplace) with α = 1.0             │  │
│  │ Corpus:        Paul Graham Essays — 221k tokens, 96 chars│  │
│  │ Inference:     O(1) hash-table lookup                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌─ Mathematical Formulation ───────────────────────────────┐  │
│  │                                                          │  │
│  │  P(cₜ | cₜ₋ₙ, …, cₜ₋₁) = count(cₜ₋ₙ…cₜ)              │  │
│  │                            ─────────────────             │  │
│  │                            count(cₜ₋ₙ…cₜ₋₁)            │  │
│  │                                                          │  │
│  │  "The probability of the next character given the        │  │
│  │   N-character context is the ratio of (N+1)-gram count   │  │
│  │   to the N-gram prefix count."                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 5.3 Component Specification

```typescript
interface NgramTechnicalExplanationProps {
    contextSize: number;
    vocabSize: number;
    totalTokens?: number;
    uniqueContexts?: number;
    perplexity?: number;
    finalLoss?: number;
    corpusName?: string;
    smoothingAlpha?: number;
}
```

- **Placement:** Bottom of lab mode, after `GenerationPlayground`, before footer.
- **Wrapper:** Use the same collapsible pattern as `GuidedExperiments` — a button header with `ChevronDown` that toggles an `AnimatePresence` body.
- **Default state:** Collapsed.
- **Accent:** Neutral (`border-white/[0.08]`, no color accent).
- **Model Card:** 2-column grid on `md+`, single column on mobile. Each row: bold label (left), value (right). Values are computed from props:
  - `modelTypeValue`: interpolate N and N+1 into the i18n template.
  - `parameterCountDesc`: compute `vocabSize^contextSize * vocabSize` and format with `toLocaleString()`.
- **Mathematical Formulation:** Rendered as a styled `<pre>` or `<code>` block with monospace font. The formula description comes from the i18n key `models.ngram.lab.technicalExplanation.formulaDesc`.

### 5.4 Existing Component Reuse

This section does NOT replace any existing component. It is purely additive. It uses:
- `ChevronDown` from `lucide-react`
- `AnimatePresence`, `motion` from `framer-motion`
- The existing `LabSection` wrapper is **not** used here (to avoid the colored accent header). Instead, use a minimal collapsible `div` with a thin border.

---

## 6. Summary of Preserved Components

The following components are **explicitly preserved unchanged** as they work well:

| Section | Component | Notes |
|---------|-----------|-------|
| §1 | `ContextWindowVisualizer` (inline in `NgramNarrative.tsx`) | Keep as-is |
| §4 | `ExponentialGrowthAnimator` | Keep as-is |
| §4 | `NgramFiveGramScale` | Keep as-is |
| §4 | `CombinatoricExplosionTable` | Keep as-is |
| §5 | `GeneralizationFailureDemo` | Keep as-is |
| §6 | `StatisticalEraTimeline` | Keep as-is |
| Hero | `ModeToggle` | Keep as-is |
| CTA | Both CTA buttons | Keep as-is |
| Lab | `NgramSparsityIndicator` | Keep as-is |
| Lab | `NgramComparisonDashboard` | Keep as-is |
| Lab | `NgramPerformanceSummary` | Keep as-is |
| Lab | `NgramLossChart` | Keep as-is |
| Lab | `InferenceConsole` | Keep as-is |
| Lab | `StepwisePrediction` | Keep as-is |
| Lab | `GenerationPlayground` | Keep as-is |

---

## 7. Narrative Section Map (Post-Redesign)

| # | Label | Title | Key Components | Changes |
|---|-------|-------|----------------|---------|
| 01 | More Context | Beyond a Single Character | `ContextWindowVisualizer` | None |
| 02 | Mechanics | Counting with Context | `NgramMiniTransitionTable` → NEW bridge text → `CountingComparisonWidget` | Rewritten lead, new bridge paragraph, better demo text |
| 03 | Improvement | The Prediction Gets Better | `ConcreteImprovementExample` → **`NgramGenerationBattle`** → `NgramComparison` + `MetricsLegend` | Rewritten lead, new GenerationBattle |
| 03.5 | *(subsection)* | Why Not N=100? | *(text only)* | **NEW subsection** |
| 04 | Complexity | The Price of Memory | `ExponentialGrowthAnimator`, `NgramFiveGramScale`, `CombinatoricExplosionTable` | None |
| 05 | Limitations | The Deeper Problem | `GeneralizationFailureDemo` | Expanded: infinite data + failure examples |
| 06 | Reflection | The End of Counting | `StatisticalEraTimeline` | None |
| — | CTA | Continue Exploring | Two buttons | None |

# Transformer Chapter — Master Execution Plan v2

Incorporating all pedagogical audit improvements.

---

## Changes from v1

| # | Change | Impact |
|:-:|---|---|
| 1 | §04b split: Q+K first, then discover V as gap | P2.2 restructured (new V16-V20 mapping) |
| 2 | §05 multi-head: interactive challenge before reveal | P2.4 enhanced |
| 3 | §10 cross-attention collapsible panel + original paper context | P3.4 expanded |
| 4 | Monster philosophy in all narrative prompts | P1.2, P1.5, P2.1, P2.2, P3.1, P3.4 |
| 5 | Words-vs-characters bridge in §01 | P1.2 |
| 6 | Optimus Prime easter egg in scaffold | P1.1 |
| 7 | Visual quality emphasis in all viz prompts | All viz prompts |

---

## Phase Overview

| Phase | Sections | Visualizers | Prompts | Credits | Core goal |
|---|---|---|---|---|---|
| **1 — Foundation** | §01, §02, §03 | V01-V12 (12) | 6 | 37 | Narrative scaffold + attention AHA! |
| **2 — Mechanism** | §04, §05, §06 | V13-V37 (25) | 8 | 48 | Math engine: Q+K → V → multi-head → position |
| **3 — Architecture** | §07-§10 | V38-V60 (23) | 5 | 23 | Block assembly + generation + closure |
| **Total** | 10 | 60 | **19** | **108** | |

> [!NOTE]
> Credit increase from 101→108 because P2.2 (Q+K→V discovery) now uses Opus Thinking (was already Opus Thinking) and requires more careful pedagogy.

---

## §04 Internal Structure (REVISED)

The biggest change: §04 is now internally split into 5 sub-beats instead of 4:

```
§04a — Measuring Similarity (dot product)     → V13-V15 (3 viz)
§04b — Two Roles: Query and Key               → V16-V18 (3 viz) ← NEW SPLIT
§04c — The Missing Piece: Value               → V19-V20 (2 viz) ← V DISCOVERED HERE
§04d — Scaling and Softmax                    → V21-V24 (4 viz)  
§04e — The Complete Head                      → V25-V26 (2 viz) ← flagship
```

**Why**: V is introduced as a discovery — the learner sees that Q·K gives weights but realizes "weights of WHAT?" → V fills the gap.

---

## Critical Path

1. **P1.1** scaffold
2. **P1.5** §03 narrative (AHA moment)
3. **P2.2** §04b-c (Q+K then V discovery) — **the most crucial pedagogical sequence**
4. **P2.7** V26 flagship visualizer
5. **P3.1** §07 Block Builder
6. **P3.3** V54 Token Generator

---

## File Structure

```
src/components/lab/
├── TransformerNarrative.tsx          (P1.1 scaffold, P1.2-P3.4 narrative)
├── narrative-primitives.tsx          (P1.1 cyan addition)
└── transformer/
    ├── IsolatedTokensViz.tsx         (V01)
    ├── DrawConnectionsViz.tsx        (V02)
    ├── MLPvsHumanViz.tsx             (V03)
    ├── WishlistCallbackViz.tsx       (V04)
    ├── TelephoneGameViz.tsx          (V05)
    ├── LSTMBandageViz.tsx            (V06)
    ├── SequentialVsParallelViz.tsx    (V07)
    ├── SpotlightViz.tsx              (V08)
    ├── ContextChangesViz.tsx         (V09)
    ├── GuessPatternViz.tsx           (V10)
    ├── StaticVsDynamicViz.tsx        (V11)
    ├── AttentionHeatmapViz.tsx       (V12)
    ├── DotProductArrowsViz.tsx       (V13)
    ├── PairwiseScoringViz.tsx        (V14)
    ├── SelfSimilarityViz.tsx         (V15)
    ├── QueryKeyLensesViz.tsx         (V16)
    ├── QueryMeetsKeyViz.tsx          (V17)
    ├── WhyQKMattersViz.tsx           (V18)
    ├── WeightsOfWhatViz.tsx          (V19) ← NEW: V discovery
    ├── ValueCompletesViz.tsx         (V20) ← NEW: full Q+K+V
    ├── NumbersExplodeViz.tsx         (V21)
    ├── ScalingFixViz.tsx             (V22)
    ├── SoftmaxReturnsViz.tsx         (V23)
    ├── FullScoringPipelineViz.tsx     (V24)
    ├── AttentionBlenderViz.tsx       (V25)
    ├── CompleteAttentionHeadViz.tsx   (V26) ← FLAGSHIP
    ├── OneHeadDilemmaViz.tsx         (V27)
    ├── MultiLensViewViz.tsx          (V28)
    ├── HeadSpecializationViz.tsx     (V29)
    ├── HeadOrchestraViz.tsx          (V30)
    ├── HeadBudgetViz.tsx             (V31)
    ├── ShuffleDisasterViz.tsx        (V32)
    ├── SimpleNumbersViz.tsx          (V33)
    ├── WaveFingerprintViz.tsx        (V34)
    ├── PositionSimilarityViz.tsx     (V35)
    ├── BeforeAfterPositionViz.tsx    (V36)
    ├── PositionEncodingAppliedViz.tsx (V37)
    ├── CommunicationVsProcessingViz.tsx (V38)
    ├── FFNCallbackViz.tsx            (V39)
    ├── HighwayReturnsViz.tsx         (V40)
    ├── LayerNormViz.tsx              (V41)
    ├── BlockBuilderViz.tsx           (V42) ← INTERACTIVE
    ├── DataFlowViz.tsx               (V43)
    ├── BeforeAfterBlockViz.tsx       (V44)
    ├── BlockBlueprintViz.tsx         (V45)
    ├── LayerEvolutionViz.tsx         (V46)
    ├── ArchitectureTowerViz.tsx      (V47)
    ├── DepthVsQualityViz.tsx         (V48)
    ├── CheatingProblemViz.tsx        (V49)
    ├── CausalMaskViz.tsx             (V50)
    ├── GrowingMasksViz.tsx           (V51)
    ├── TrainingEfficiencyViz.tsx     (V52)
    ├── TrainingDashboardViz.tsx      (V53)
    ├── TokenByTokenGeneratorViz.tsx   (V54) ← FLAGSHIP
    ├── GrowingContextViz.tsx         (V55)
    ├── GenerationGalleryViz.tsx      (V56)
    ├── ArchitectureJourneyViz.tsx    (V57)
    ├── WishlistCompleteViz.tsx       (V58)
    ├── CompleteArchitectureRefViz.tsx (V59)
    └── ScalingTeaserViz.tsx          (V60)
```

---

## Prompt-to-Model Assignment (Final)

| ID | Scope | Model | Cost |
|---|---|---|---:|
| P1.1 | Scaffold + color | Sonnet 4.5 Thinking | 3 |
| P1.2 | §01 narrative | Opus Thinking | 8 |
| P1.3 | §01 viz V01-V04 | Sonnet 4.6 Thinking | 6 |
| P1.4 | §02 narr+viz V05-V07 | Sonnet 4.6 Thinking | 6 |
| P1.5 | §03 narrative | Opus Thinking | 8 |
| P1.6 | §03 viz V08-V12 | Opus | 6 |
| P2.1 | §04a narr+viz V13-V15 | Opus Thinking | 8 |
| P2.2 | §04b-c narr+viz V16-V20 | Opus Thinking | 8 |
| P2.3 | §04d narr+viz V21-V25 | Sonnet 4.6 Thinking | 6 |
| P2.4 | §05 narr+viz V27-V31 | Sonnet 4.6 Thinking | 6 |
| P2.5 | §06 narrative | Opus | 6 |
| P2.6 | §06 viz V32-V37 | Sonnet 4.6 Thinking | 6 |
| P2.7 | V26 flagship | Opus | 6 |
| P2.8 | Integration | Sonnet 4.5 | 2 |
| P3.1 | §07 narr+viz V38-V45 | Opus | 6 |
| P3.2 | §08+§09 narr+viz V46-V55 | Sonnet 4.6 Thinking | 6 |
| P3.3 | V54 flagship | Opus | 6 |
| P3.4 | §10 narr+viz V56-V60 | Sonnet 4.5 Thinking | 3 |
| P3.5 | Integration + polish | Sonnet 4.5 | 2 |
| **Total** | | | **108** |

"use client";

import React, { lazy, Suspense } from "react";

import { motion } from "framer-motion";
import { AlertTriangle, ArrowDown, BookOpen, Brain, Eye, Layers, Play, Sparkles, Target, Zap } from "lucide-react";

import { ContinueToast } from "@/components/lab/ContinueToast";
import { KeyTakeaway } from "@/components/lab/KeyTakeaway";
import { FadeInView } from "@/components/lab/FadeInView";
import { ModeToggle } from "@/components/lab/ModeToggle";
import { SectionAnchor } from "@/components/lab/SectionAnchor";
import { SectionProgressBar } from "@/components/lab/SectionProgressBar";
import { useProgressTracker } from "@/hooks/useProgressTracker";

import {
    Callout as _Callout,
    FormulaBlock as _FormulaBlock,
    Heading, Highlight as _Highlight,
    type HighlightColor,
    Lead, type NarrativeAccent,
    P, PullQuote as _PullQuote,
    Section, SectionBreak,
    SectionLabel as _SectionLabel,
} from "./narrative-primitives";

/* ─── Lazy-loaded visualizers: §01 ─── */
const PronounResolutionViz = lazy(() => import("@/components/lab/transformer/PronounResolutionViz").then((m) => ({ default: m.PronounResolutionViz })));
const IsolatedTokensViz = lazy(() => import("@/components/lab/transformer/IsolatedTokensViz").then((m) => ({ default: m.IsolatedTokensViz })));
const DrawConnectionsViz = lazy(() => import("@/components/lab/transformer/DrawConnectionsViz").then((m) => ({ default: m.DrawConnectionsViz })));
const ContextShiftsViz = lazy(() => import("@/components/lab/transformer/ContextShiftsViz").then((m) => ({ default: m.ContextShiftsViz })));
const WishlistCallbackViz = lazy(() => import("@/components/lab/transformer/WishlistCallbackViz").then((m) => ({ default: m.WishlistCallbackViz })));

/* ─── Lazy-loaded visualizers: §02 ─── */
const TelephoneGameViz = lazy(() => import("@/components/lab/transformer/TelephoneGameViz").then((m) => ({ default: m.TelephoneGameViz })));
const LSTMBandageViz = lazy(() => import("@/components/lab/transformer/LSTMBandageViz").then((m) => ({ default: m.LSTMBandageViz })));
const SequentialVsParallelViz = lazy(() => import("@/components/lab/transformer/SequentialVsParallelViz").then((m) => ({ default: m.SequentialVsParallelViz })));
const RNNChainViz = lazy(() => import("@/components/lab/transformer/RNNChainViz").then((m) => ({ default: m.RNNChainViz })));

/* ─── Lazy-loaded visualizers: §03 ─── */
const SpotlightViz = lazy(() => import("@/components/lab/transformer/SpotlightViz").then((m) => ({ default: m.SpotlightViz })));
const ContextChangesViz = lazy(() => import("@/components/lab/transformer/ContextChangesViz").then((m) => ({ default: m.ContextChangesViz })));
const GuessPatternViz = lazy(() => import("@/components/lab/transformer/GuessPatternViz").then((m) => ({ default: m.GuessPatternViz })));
const StaticVsDynamicViz = lazy(() => import("@/components/lab/transformer/StaticVsDynamicViz").then((m) => ({ default: m.StaticVsDynamicViz })));
const AttentionHeatmapViz = lazy(() => import("@/components/lab/transformer/AttentionHeatmapViz").then((m) => ({ default: m.AttentionHeatmapViz })));
const AttentionWebViz = lazy(() => import("@/components/lab/transformer/AttentionWebViz").then((m) => ({ default: m.AttentionWebViz })));

/* ─── Lazy-loaded visualizers: §04a ─── */
const EmbeddingToArrowViz = lazy(() => import("@/components/lab/transformer/EmbeddingToArrowViz").then((m) => ({ default: m.EmbeddingToArrowViz })));
const DotProductCalculatorViz = lazy(() => import("@/components/lab/transformer/DotProductCalculatorViz").then((m) => ({ default: m.DotProductCalculatorViz })));
/* DotProductArrowsViz removed — merged into DotProductCalculatorViz v2 */
const PairwiseScoringViz = lazy(() => import("@/components/lab/transformer/PairwiseScoringViz").then((m) => ({ default: m.PairwiseScoringViz })));
const SelfSimilarityViz = lazy(() => import("@/components/lab/transformer/SelfSimilarityViz").then((m) => ({ default: m.SelfSimilarityViz })));
const DotProductQuiz = lazy(() => import("@/components/lab/transformer/DotProductQuiz").then((m) => ({ default: m.DotProductQuiz })));

/* ─── Lazy-loaded visualizers: §04b-c ─── */
const QKSplitViz = lazy(() => import("@/components/lab/transformer/QKSplitViz").then((m) => ({ default: m.QKSplitViz })));
const QueryKeyRelationsViz = lazy(() => import("@/components/lab/transformer/QueryKeyRelationsViz").then((m) => ({ default: m.QueryKeyRelationsViz })));
const QuerySearchViz = lazy(() => import("@/components/lab/transformer/QuerySearchViz").then((m) => ({ default: m.QuerySearchViz })));
const WhyQKMattersViz = lazy(() => import("@/components/lab/transformer/WhyQKMattersViz").then((m) => ({ default: m.WhyQKMattersViz })));
const WeightsOfWhatViz = lazy(() => import("@/components/lab/transformer/WeightsOfWhatViz").then((m) => ({ default: m.WeightsOfWhatViz })));
const ValueCompletesViz = lazy(() => import("@/components/lab/transformer/ValueCompletesViz").then((m) => ({ default: m.ValueCompletesViz })));


/* ─── Lazy-loaded visualizers: §04d ─── */
const NumbersExplodeViz = lazy(() => import("@/components/lab/transformer/NumbersExplodeViz").then((m) => ({ default: m.NumbersExplodeViz })));
const ScalingFixViz = lazy(() => import("@/components/lab/transformer/ScalingFixViz").then((m) => ({ default: m.ScalingFixViz })));
const FullScoringPipelineViz = lazy(() => import("@/components/lab/transformer/FullScoringPipelineViz").then((m) => ({ default: m.FullScoringPipelineViz })));
const ContextAssemblyFilmViz = lazy(() => import("@/components/lab/transformer/ContextAssemblyFilmViz").then((m) => ({ default: m.ContextAssemblyFilmViz })));
const FullContextualAssemblyViz = lazy(() => import("@/components/lab/transformer/FullContextualAssemblyViz").then((m) => ({ default: m.FullContextualAssemblyViz })));

/* ─── Lazy-loaded visualizers: §05 ─── */
const OneHeadDilemmaViz = lazy(() => import("@/components/lab/transformer/OneHeadDilemmaViz").then((m) => ({ default: m.OneHeadDilemmaViz })));
const MultiHeadIdeaViz = lazy(() => import("@/components/lab/transformer/MultiHeadIdeaViz").then((m) => ({ default: m.MultiHeadIdeaViz })));
const MultiLensViewViz = lazy(() => import("@/components/lab/transformer/MultiLensViewViz").then((m) => ({ default: m.MultiLensViewViz })));
// HeadSpecializationViz removed — sentence switching merged into MultiLensViewViz
const HeadBudgetViz = lazy(() => import("@/components/lab/transformer/HeadBudgetViz").then((m) => ({ default: m.HeadBudgetViz })));
const MultiHeadPipelineViz = lazy(() => import("@/components/lab/transformer/MultiHeadPipelineViz").then((m) => ({ default: m.MultiHeadPipelineViz })));

/* ─── Lazy-loaded visualizers: §06 ─── */
const ShuffleDisasterViz = lazy(() => import("@/components/lab/transformer/ShuffleDisasterViz").then((m) => ({ default: m.ShuffleDisasterViz })));
const SimpleNumbersViz = lazy(() => import("@/components/lab/transformer/SimpleNumbersViz").then((m) => ({ default: m.SimpleNumbersViz })));
const LearnedPositionEmbeddingsViz = lazy(() => import("@/components/lab/transformer/LearnedPositionEmbeddingsViz").then((m) => ({ default: m.LearnedPositionEmbeddingsViz })));
const WaveFingerprintViz = lazy(() => import("@/components/lab/transformer/WaveFingerprintViz").then((m) => ({ default: m.WaveFingerprintViz })));
const PositionalSimilarityViz = lazy(() => import("@/components/lab/transformer/PositionalSimilarityViz").then((m) => ({ default: m.PositionalSimilarityViz })));
const AddEmbeddingsViz = lazy(() => import("@/components/lab/transformer/AddEmbeddingsViz").then((m) => ({ default: m.AddEmbeddingsViz })));
const PositionInActionViz = lazy(() => import("@/components/lab/transformer/PositionInActionViz").then((m) => ({ default: m.PositionInActionViz })));

/* ─── Lazy-loaded visualizers: §08 ─── */
const DepthVsQualityViz = lazy(() => import("@/components/lab/transformer/DepthVsQualityViz").then((m) => ({ default: m.DepthVsQualityViz })));
const LayerEvolutionViz = lazy(() => import("@/components/lab/transformer/LayerEvolutionViz").then((m) => ({ default: m.LayerEvolutionViz })));
const ArchitectureTowerViz = lazy(() => import("@/components/lab/transformer/ArchitectureTowerViz").then((m) => ({ default: m.ArchitectureTowerViz })));

/* ─── Lazy-loaded visualizers: §09 ─── */
const CheatingProblemViz = lazy(() => import("@/components/lab/transformer/CheatingProblemViz").then((m) => ({ default: m.CheatingProblemViz })));
const CausalMaskViz = lazy(() => import("@/components/lab/transformer/CausalMaskViz").then((m) => ({ default: m.CausalMaskViz })));
const GrowingMasksViz = lazy(() => import("@/components/lab/transformer/GrowingMasksViz").then((m) => ({ default: m.GrowingMasksViz })));
const TrainingEfficiencyViz = lazy(() => import("@/components/lab/transformer/TrainingEfficiencyViz").then((m) => ({ default: m.TrainingEfficiencyViz })));
const GrowingContextViz = lazy(() => import("@/components/lab/transformer/GrowingContextViz").then((m) => ({ default: m.GrowingContextViz })));
const TrainingDashboardViz = lazy(() => import("@/components/lab/transformer/TrainingDashboardViz").then((m) => ({ default: m.TrainingDashboardViz })));

/* ─── Lazy-loaded visualizers: §07 ─── */
const CommunicationVsProcessingViz = lazy(() => import("@/components/lab/transformer/CommunicationVsProcessingViz").then((m) => ({ default: m.CommunicationVsProcessingViz })));
const FFNCallbackViz = lazy(() => import("@/components/lab/transformer/FFNCallbackViz").then((m) => ({ default: m.FFNCallbackViz })));
const HighwayReturnsViz = lazy(() => import("@/components/lab/transformer/HighwayReturnsViz").then((m) => ({ default: m.HighwayReturnsViz })));
const LayerNormViz = lazy(() => import("@/components/lab/transformer/LayerNormViz").then((m) => ({ default: m.LayerNormViz })));
const BlockBuilderViz = lazy(() => import("@/components/lab/transformer/BlockBuilderViz").then((m) => ({ default: m.BlockBuilderViz })));
const TransformerBlockExplorerViz = lazy(() => import("@/components/lab/transformer/TransformerBlockExplorerViz").then((m) => ({ default: m.TransformerBlockExplorerViz })));
const AttentionAloneFailsViz = lazy(() => import("@/components/lab/transformer/AttentionAloneFailsViz").then((m) => ({ default: m.AttentionAloneFailsViz })));
const BeforeAfterBlockViz = lazy(() => import("@/components/lab/transformer/BeforeAfterBlockViz").then((m) => ({ default: m.BeforeAfterBlockViz })));
const BlockBlueprintViz = lazy(() => import("@/components/lab/transformer/BlockBlueprintViz").then((m) => ({ default: m.BlockBlueprintViz })));

/* ─── Accent-bound wrappers ─── */
const NA: NarrativeAccent = "cyan";
const SectionLabel = (p: { number: string; label: string }) => <_SectionLabel accent={NA} {...p} />;
const Callout = ({ accent, ...p }: Parameters<typeof _Callout>[0]) => <_Callout accent={accent ?? NA} {...p} />;
const FormulaBlock = (p: { formula: string; caption: string }) => <_FormulaBlock accent={NA} {...p} />;
const PullQuote = (p: { children: React.ReactNode }) => <_PullQuote accent={NA} {...p} />;

/* ─── Enhanced text primitives (§01 visual upgrades) ─── */

/* #2 + #7: Highlight with subtle glow + one-shot pulse animation */
const Highlight = ({ color, ...p }: { children: React.ReactNode; color?: HighlightColor; tooltip?: string }) => {
    const c = color ?? NA;
    const glowMap: Record<string, string> = {
        cyan: "0 0 12px rgba(34,211,238,0.25), 0 0 4px rgba(34,211,238,0.15)",
        amber: "0 0 12px rgba(251,191,36,0.25), 0 0 4px rgba(251,191,36,0.15)",
        rose: "0 0 12px rgba(244,63,94,0.2), 0 0 4px rgba(244,63,94,0.12)",
        violet: "0 0 12px rgba(139,92,246,0.2), 0 0 4px rgba(139,92,246,0.12)",
        indigo: "0 0 12px rgba(99,102,241,0.2), 0 0 4px rgba(99,102,241,0.12)",
        emerald: "0 0 12px rgba(52,211,153,0.2), 0 0 4px rgba(52,211,153,0.12)",
    };
    if (p.tooltip) return <_Highlight color={c} {...p} />;
    return (
        <strong
            className={`font-semibold ${c === "cyan" ? "text-cyan-400" : c === "amber" ? "text-amber-400" : c === "rose" ? "text-rose-400" : c === "violet" ? "text-violet-400" : c === "indigo" ? "text-indigo-400" : "text-emerald-400"}`}
            style={{ textShadow: glowMap[c] || glowMap.cyan }}
        >
            {p.children}
        </strong>
    );
};

/* #1: Gradient text for key phrases */
const GradientText = ({ children, from = "from-cyan-300", via, to = "to-teal-300" }: {
    children: React.ReactNode;
    from?: string;
    via?: string;
    to?: string;
}) => (
    <strong className={`font-semibold bg-gradient-to-r ${from} ${via ?? ""} ${to} bg-clip-text text-transparent`}>
        {children}
    </strong>
);

/* #4: Subtle divider between narrative beats */
const NarrativeDivider = () => (
    <div className="flex items-center justify-center gap-2 my-8 md:my-10" aria-hidden>
        <span className="w-1 h-1 rounded-full bg-cyan-400/20" />
        <span className="w-1 h-1 rounded-full bg-cyan-400/10" />
        <span className="w-1 h-1 rounded-full bg-cyan-400/20" />
    </div>
);

/* #8: Styled inline arrow */
const StyledArrow = () => (
    <svg className="inline-block w-4 h-3 mx-0.5 -mt-0.5" viewBox="0 0 16 12" fill="none" aria-hidden>
        <path d="M1 6h12M9 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400/60" />
    </svg>
);


/* ─── Monster status banner helper ─── */
const MonsterStatus = ({ children, gradient = "cyan-teal" }: { children: React.ReactNode; gradient?: "cyan-teal" | "cyan-amber" }) => {
    const gradientClass = gradient === "cyan-amber"
        ? "from-cyan-400 via-amber-300 to-cyan-400"
        : "from-cyan-400 via-teal-300 to-cyan-400";

    return (
        <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={`text-center text-lg md:text-xl font-bold bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent py-4`}
        >
            {children}
        </motion.p>
    );
};

/* ─── Monster interlude helper ─── */
const MonsterInterlude = ({ children }: { children: React.ReactNode }) => (
    <FadeInView margin="-40px" className="my-12 text-center">
        <p className="text-sm md:text-base italic bg-gradient-to-r from-cyan-400/80 via-teal-300/80 to-cyan-400/80 bg-clip-text text-transparent max-w-lg mx-auto leading-relaxed">
            {children}
        </p>
    </FadeInView>
);

/* ─── Section loading skeleton ─── */
const SectionSkeleton = () => (
    <div className="h-64 animate-pulse bg-white/5 rounded-xl" />
);

/* ─── FigureWrapper (cyan-accented) ─── */
function FigureWrapper({
    label,
    hint,
    children,
}: {
    label: string;
    hint?: string;
    children: React.ReactNode;
}) {
    return (
        <FadeInView as="figure" className="my-12 md:my-16 -mx-4 sm:mx-0">
            <div className="rounded-2xl border border-[var(--lab-border)] bg-[var(--lab-card)] overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-3 border-b border-[var(--lab-border)] bg-[var(--lab-card)]">
                    <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[var(--lab-text-subtle)]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[var(--lab-border)]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400/40" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--lab-text-subtle)]">
                        {label}
                    </span>
                </div>
                <div className="p-4 sm:p-6 bg-[var(--lab-viz-bg)]">{children}</div>
            </div>
            {hint && (
                <figcaption className="mt-3 text-center text-xs text-[var(--lab-text-subtle)] italic">
                    {hint}
                </figcaption>
            )}
        </FadeInView>
    );
}

/* ─────────────────────────────────────────────
   Main narrative component
   ───────────────────────────────────────────── */

export function TransformerNarrative() {
    const { hasStoredProgress, storedSection, clearProgress } = useProgressTracker("transformer");

    return (
        <article className="max-w-[920px] mx-auto px-6 pt-8 pb-24">
            <ContinueToast
                accent="cyan"
                hasStoredProgress={hasStoredProgress}
                storedSection={storedSection}
                clearProgress={clearProgress}
                sectionNames={{
                    "transformer-01": "The Blind Spot",
                    "transformer-02": "The Road Not Taken",
                    "transformer-03": "What If Tokens Could Talk?",
                    "transformer-04": "The Attention Mechanism",
                    "transformer-05": "Seeing Multiple Things at Once",
                    "transformer-06": "Where Am I?",
                    "transformer-07": "The Transformer Block",
                    "transformer-08": "The Full Architecture",
                    "transformer-09": "Teaching It To Write",
                    "transformer-10": "The Monster That Can See Everything",
                }}
            />
            <SectionProgressBar
                sections={[
                    { id: "transformer-01", label: "01", name: "Blind Spot" },
                    { id: "transformer-02", label: "02", name: "Road" },
                    { id: "transformer-03", label: "03", name: "Talk" },
                    { id: "transformer-04", label: "04", name: "Attention" },
                    { id: "transformer-05", label: "05", name: "Multi-Head" },
                    { id: "transformer-06", label: "06", name: "Position" },
                    { id: "transformer-07", label: "07", name: "Block" },
                    { id: "transformer-08", label: "08", name: "Architecture" },
                    { id: "transformer-09", label: "09", name: "Training" },
                    { id: "transformer-10", label: "10", name: "Everything" },
                ]}
                accent="cyan"
            />

            {/* ───────────────────── HERO ───────────────────── */}
            <header className="text-center mb-24 md:mb-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <span className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-cyan-400/60 mb-6">
                        <BookOpen className="w-3.5 h-3.5" />
                        Chapter 5 · The Transformer
                    </span>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[var(--lab-text)] mb-6">
                        The Monster That{" "}
                        <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                            Can See Everything
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-[var(--lab-text-subtle)] max-w-xl mx-auto leading-relaxed mb-12">
                        From blind pattern matching to understanding connections between every token.
                        The architecture that powers GPT, Claude, and the modern AI revolution.
                    </p>

                    <p className="text-[11px] font-mono text-[var(--lab-text-subtle)] mb-8">
                        ~45 min read · 10 sections · 60 interactive visualizers
                    </p>

                    <div className="flex justify-center mb-14">
                        <ModeToggle />
                    </div>

                    <motion.div
                        animate={{ y: [0, 6, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        className="text-[var(--lab-border)]"
                    >
                        <ArrowDown className="w-5 h-5 mx-auto" />
                    </motion.div>
                </motion.div>
            </header>

            {/* ═══════════════════════════════════════════════════
               §01 — THE BLIND SPOT
               ═══════════════════════════════════════════════════ */}
            <Section id="transformer-01">
                <SectionLabel number="01" label="The Blind Spot" />
                <SectionAnchor id="transformer-01">
                    <Heading className="bg-gradient-to-r from-cyan-300 via-white to-cyan-400 bg-clip-text text-transparent">The Blind Spot</Heading>
                </SectionAnchor>

                {/* ── Opening hook ── */}
                <Lead>
                    We built something powerful. A neural network with eyes that learned to see
                    patterns in characters, a brain that learned to think in hidden layers, and
                    stability tricks that kept it all from collapsing. But there&apos;s something
                    deeply wrong with it &mdash; something that no amount of extra layers or training
                    data can fix.
                </Lead>

                <P>
                    Imagine a system that reads five words and predicts the sixth. It processes each
                    word through layers of learned transformations. It has embeddings that encode
                    meaning, hidden layers that find patterns, and a softmax output that produces
                    probabilities. Impressive, right?
                </P>

                <P>
                    Now read this sentence:
                </P>

                {/* ═══ Pronoun Resolution micro-viz (no box) ═══ */}
                <FadeInView className="my-10 md:my-14">
                    <Suspense fallback={<SectionSkeleton />}>
                        <PronounResolutionViz />
                    </Suspense>
                </FadeInView>

                <P>
                    Our model can&apos;t do that. Not even close. And the reason is devastating.
                </P>

                <NarrativeDivider />

                {/* ── Words-vs-characters bridge ── */}
                <Callout icon={AlertTriangle} accent="amber" title="A quick note about tokens">
                    <p>
                        Until now, our monster has been working with individual characters &mdash; letters
                        and symbols. It reads &ldquo;t-h-e&rdquo; as three separate tokens. But to
                        understand the problem we&apos;re about to tackle &mdash; relationships between
                        ideas &mdash; we need to zoom out a level.
                    </p>
                    <p className="mt-2">
                        For the rest of this chapter, we&apos;ll think in terms of <strong>words</strong> instead
                        of individual characters. The concepts work the same way at both
                        levels &mdash; but words make the patterns much easier to see.
                    </p>
                </Callout>

                {/* ── The isolation problem ── */}
                <P>
                    Here&apos;s the flaw. Our MLP sees all the words in its input window, but it
                    treats them as <Highlight color="amber">fixed, static slots</Highlight>. It can
                    memorize patterns like &ldquo;if position 3 is X and position 5 is Y, predict
                    Z&rdquo; &mdash; but it has no way to understand <em>why</em> those positions
                    matter or how they relate to each other.
                </P>

                <P>
                    It&apos;s like reading a sentence with walls between every word. You can see
                    each word perfectly &mdash; but you can&apos;t see how they relate to each other.
                    &ldquo;Trophy&rdquo; and &ldquo;it&rdquo; might as well be in different sentences.
                    The model has <Highlight color="amber">no mechanism to connect them</Highlight>.
                </P>

                <P>
                    This isn&apos;t a small problem. It&apos;s <em>the</em> problem. No matter how
                    many layers we stack, no matter how large the embeddings grow, the model is
                    fundamentally blind to <GradientText>relationships between words</GradientText>.
                </P>

                {/* ═══ V01 — The Isolated Tokens (no box) ═══ */}
                <FadeInView className="my-10 md:my-14">
                    <Suspense fallback={<SectionSkeleton />}>
                        <IsolatedTokensViz />
                    </Suspense>
                </FadeInView>

                {/* ── Dynamic meaning ── */}
                <P>
                    And it gets worse. Language isn&apos;t just about connecting words &mdash;
                    it&apos;s about how meaning itself is <Highlight>fundamentally dynamic</Highlight>.
                    The same word can mean completely different things depending on what surrounds it.
                </P>

                {/* ═══ Context Shifts (no box) ═══ */}
                <FadeInView className="my-10 md:my-14">
                    <Suspense fallback={<SectionSkeleton />}>
                        <ContextShiftsViz />
                    </Suspense>
                </FadeInView>

                <P>
                    The model can&apos;t do this. It sees &ldquo;bank&rdquo; and always produces
                    the same representation &mdash; regardless of whether rivers or money surround it.
                    It has learned a fixed, frozen snapshot of each word, with no way to adjust based
                    on context. <strong>That&apos;s the blind spot.</strong>
                </P>

                <NarrativeDivider />

                {/* ── The human contrast ── */}
                <P>
                    But <em>you</em> see the connections instantly. Read this:
                </P>

                <PullQuote>
                    The cat sat on the warm mat.
                </PullQuote>

                <P>
                    Your brain immediately linked <strong className="text-cyan-300">cat</strong> <StyledArrow /> <strong className="text-cyan-300">sat</strong> <StyledArrow /> <strong className="text-cyan-300">mat</strong>. You felt
                    that &ldquo;warm&rdquo; describes the mat, that &ldquo;on&rdquo; connects sitting
                    to a surface, that the whole scene paints a picture. You didn&apos;t process
                    each word in isolation &mdash; you saw the <GradientText from="from-cyan-300" to="to-emerald-300">web of relationships</GradientText> between
                    them.
                </P>

                <P>
                    What if you could draw those connections yourself?
                </P>

                <NarrativeDivider />

                {/* ═══ V02 — Draw the Connections (no box) ═══ */}
                <FadeInView className="my-10 md:my-14">
                    <Suspense fallback={<SectionSkeleton />}>
                        <DrawConnectionsViz />
                    </Suspense>
                </FadeInView>

                {/* ── THE REVEAL ── */}
                <P>
                    Look at what you just did.
                </P>

                <P>
                    You drew lines of <span className="text-cyan-300/70">varying thickness</span> between related words. You instinctively
                    knew that some connections are strong &mdash; <strong className="text-amber-300/80">cat</strong> and <strong className="text-amber-300/80">sat</strong> are
                    tightly linked &mdash; and others are weak. You gave more <span className="text-white/70">weight</span> to the words that
                    mattered and less to the ones that didn&apos;t.
                </P>

                <P>
                    What you built, right there with your mouse?
                </P>

                {/* #5: THE REVEAL — attention word lands with impact */}
                <div className="my-10 md:my-12 text-center">
                    <motion.p
                        className="text-[15px] md:text-base text-[var(--lab-text-muted)] leading-relaxed mb-3"
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.4 }}
                    >
                        Scientists call it
                    </motion.p>
                    <motion.p
                        className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-amber-300 via-amber-200 to-amber-300 bg-clip-text text-transparent"
                        initial={{ opacity: 0, scale: 0.7, y: 12 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 120 }}
                    >
                        Attention
                    </motion.p>
                </div>

                <P>
                    That&apos;s not a metaphor. The lines you drew &mdash; <span className="text-cyan-300/60">weighted connections</span> between
                    words, varying in strength depending on context &mdash; are <em className="text-white/75 not-italic font-medium">exactly</em> the
                    mechanism that powers every modern language model. <span className="text-white/60">GPT. Claude. Gemini.</span> All
                    of them. They all do precisely what you just did: for every word in the input,
                    figure out which other words matter and <span className="text-amber-300/60">how much</span>.
                </P>

                <P>
                    The difference? You did it with <span className="text-white/70">intuition</span>. The model needs to learn how to do
                    it with <span className="text-cyan-300/60">math</span>. And that&apos;s what this chapter is about.
                </P>

                <NarrativeDivider />

                {/* ── The roadmap ── */}
                <P>
                    So what do we need to build? Over the next sections, we&apos;ll solve this
                    piece by piece:
                </P>

                {/* ═══ V04 — Architecture Wishlist (no box) ═══ */}
                <FadeInView className="my-8 md:my-10">
                    <Suspense fallback={<SectionSkeleton />}>
                        <WishlistCallbackViz />
                    </Suspense>
                </FadeInView>

                {/* ── Key takeaway ── */}
                <KeyTakeaway accent="cyan">
                    Our MLP processes each position independently &mdash; words are isolated.
                    Humans naturally draw weighted connections between related words.
                    That ability is called <strong>attention</strong>, and it&apos;s exactly what
                    we need to teach the model.
                </KeyTakeaway>

                {/* ── Monster status ── */}
                <MonsterStatus>
                    👾 I have eyes. I have a brain. But I&apos;m staring at each word through a
                    keyhole &mdash; I can&apos;t see the sentence. I want to look around. I want
                    to see everything at once.
                </MonsterStatus>
            </Section>

            {/* ── Bridge to §02 ── */}
            <SectionBreak />
            <MonsterInterlude>
                Decades ago, researchers saw this same problem. Their first solution was
                intuitive: read one word at a time, carrying a running memory forward. For ten
                years, it dominated AI research. But it had a fatal flaw...
            </MonsterInterlude>

            {/* ═══════════════════════════════════════════════════
               §02 — THE ROAD NOT TAKEN
               ═══════════════════════════════════════════════════ */}
            <Section id="transformer-02">
                <SectionLabel number="02" label="The Road Not Taken" />
                <SectionAnchor id="transformer-02"><Heading>The Road Not Taken</Heading></SectionAnchor>

                {/* Optional context badge */}
                <FadeInView className="flex items-center gap-2 mb-6 text-xs text-white/30">
                    <span className="px-2 py-0.5 rounded border border-white/10 bg-white/5">Optional Context</span>
                    <span>You can skip this if you&apos;re familiar with RNNs</span>
                </FadeInView>

                <Lead>
                    Before the solution that changed everything, researchers tried a different
                    approach. It was intuitive. It was elegant. And for a decade, it dominated
                    the field.
                </Lead>

                <P>
                    The idea was simple: what if the model reads like we do? Left to right,
                    one word at a time, carrying everything it has learned so far in its memory.
                    Each token receives a summary of all previous tokens, adds its own information,
                    and passes the updated summary to the next.
                </P>

                <P>
                    Researchers called it the <Highlight>Recurrent Neural Network</Highlight>.
                    And on paper, it solved the isolation problem beautifully &mdash; tokens
                    could finally communicate through this chain of memory.
                </P>

                {/* ═══ RNNChainViz — how RNN processes tokens ═══ */}
                <FadeInView className="my-10 md:my-14">
                    <Suspense fallback={<SectionSkeleton />}>
                        <RNNChainViz />
                    </Suspense>
                </FadeInView>

                <NarrativeDivider />

                <P>
                    But think about what happens to the first word&apos;s information as it
                    travels through the chain. Word 1&apos;s meaning gets compressed into
                    word 2&apos;s memory. Then words 1 <em>and</em> 2 get compressed into
                    word 3. By word 50, the memory of word 1 is almost completely gone.
                </P>

                <P>
                    It&apos;s like a game of telephone. The message degrades with every step.
                </P>

                {/* ═══ V05 — TelephoneGameViz ═══ */}
                <FadeInView className="my-10 md:my-14">
                    <Suspense fallback={<SectionSkeleton />}>
                        <TelephoneGameViz />
                    </Suspense>
                </FadeInView>

                <P>
                    Researchers saw this problem and added a clever fix: <Highlight color="amber">memory gates</Highlight>.
                    Tiny neural networks inside each step that decide what to remember
                    and what to forget. They called it the <strong>LSTM</strong> &mdash; Long Short-Term Memory.
                </P>

                <P>
                    It helped. The memory lasted longer. But it didn&apos;t solve
                    the fundamental issue.
                </P>

                {/* ═══ V06 — LSTMBandageViz ═══ */}
                <FadeInView className="my-10 md:my-14">
                    <Suspense fallback={<SectionSkeleton />}>
                        <LSTMBandageViz />
                    </Suspense>
                </FadeInView>

                <NarrativeDivider />

                <P>
                    And there was an even deeper problem &mdash; one that no amount of clever
                    gating could fix. The RNN <em>must</em> process tokens in order. Token 5
                    waits for token 4. Token 4 waits for token 3. You cannot parallelize this.
                    On modern GPUs designed for massive parallelism, the sequential bottleneck
                    was <Highlight color="rose">painfully slow</Highlight>.
                </P>

                {/* ═══ V07 — SequentialVsParallelViz ═══ */}
                <FadeInView className="my-10 md:my-14">
                    <Suspense fallback={<SectionSkeleton />}>
                        <SequentialVsParallelViz />
                    </Suspense>
                </FadeInView>

                {/* "Learn more" link */}
                <FadeInView className="flex justify-center my-6">
                    <a
                        href="/lab/rnn"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold
                            border border-cyan-400/25 text-cyan-300/70 hover:text-cyan-200 hover:border-cyan-400/40
                            hover:shadow-[0_0_20px_-4px_rgba(34,211,238,0.15)] transition-all duration-200"
                        style={{ background: "linear-gradient(135deg, rgba(34,211,238,0.06), rgba(34,211,238,0.02))" }}
                    >
                        <BookOpen className="w-4 h-4" />
                        Dive deeper into RNNs
                    </a>
                </FadeInView>

                <KeyTakeaway accent="cyan">
                    RNNs solved token communication but introduced two fatal flaws:
                    information degrades over long sequences (the telephone game), and
                    sequential processing makes them painfully slow. We need something
                    fundamentally different.
                </KeyTakeaway>

                <MonsterStatus>
                    👾 I tried reading one word at a time, passing notes forward. But by the
                    end of a long sentence, I&apos;ve forgotten how it started. And I&apos;m
                    so slow &mdash; processing one word at a time while the GPU sits idle.
                    There must be a better way.
                </MonsterStatus>

            </Section>

            <SectionBreak />
            <MonsterInterlude>
                What if, instead of processing tokens one by one, carrying a fragile memory...
                every token could see every other token, all at once?
            </MonsterInterlude>

            {/* ═══════════════════════════════════════════════════
               §03 — WHAT IF TOKENS COULD TALK?
               THE MOST IMPORTANT SECTION — discovery-driven,
               slow pacing, the learner arrives at attention themselves.
               ═══════════════════════════════════════════════════ */}
            <Section id="transformer-03">
                <SectionLabel number="03" label="What If Tokens Could Talk?" />
                <SectionAnchor id="transformer-03"><Heading>What If Tokens Could Talk?</Heading></SectionAnchor>

                {/* ── 1. The question hangs ── */}
                <FadeInView className="my-10 md:my-16">
                    <motion.p
                        className="text-center text-xl sm:text-2xl md:text-3xl font-bold leading-relaxed max-w-2xl mx-auto bg-gradient-to-r from-cyan-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    >
                        What if every word in a sentence could look at every other word...
                        and decide which ones matter?
                    </motion.p>
                </FadeInView>

                <NarrativeDivider />

                {/* ── 2. The human analogy ── */}
                <P>
                    When you read a sentence, you don&apos;t process each word in isolation.
                    Your brain builds connections instantly, effortlessly, in parallel.
                </P>

                <P>
                    Consider this sentence: <em>&quot;The king who wore the golden crown ruled the vast kingdom wisely.&quot;</em>
                </P>

                <P>
                    Your eyes jumped: <Highlight>king</Highlight> <StyledArrow />
                    <Highlight color="amber">crown</Highlight> <StyledArrow />
                    <Highlight color="emerald">ruled</Highlight>. You saw the entire sentence
                    and <em>chose</em> what matters. You didn&apos;t read left-to-right carrying a
                    fragile memory. You looked at everything at once.
                </P>

                <NarrativeDivider />

                {/* ── 3. Introduce the spotlight ── */}
                <P>
                    Imagine each word has a <Highlight>spotlight</Highlight>. When you activate a word,
                    its spotlight shines on the other words it cares about &mdash; brighter for stronger
                    connections, dimmer for weaker ones. Every word has its own unique spotlight pattern.
                </P>

                {/* ═══ V08 — SpotlightViz ═══ */}
                <FadeInView className="my-10 md:my-14">
                    <Suspense fallback={<SectionSkeleton />}>
                        <SpotlightViz />
                    </Suspense>
                </FadeInView>

                <P>
                    Click different words. The spotlight pattern changes completely each time.
                    <em> &quot;The&quot;</em> barely shines on anything. But <em>&quot;king&quot;</em>?
                    It illuminates <em>&quot;crown&quot;</em> and <em>&quot;ruled&quot;</em> across
                    the entire sentence.
                </P>

                <NarrativeDivider />

                {/* ── 5. Context changes the spotlight ── */}
                <P>
                    Now here&apos;s where it gets remarkable. The word <em>&quot;bank&quot;</em> shines
                    its spotlight on <Highlight color="emerald">&quot;river&quot;</Highlight> in one sentence
                    &mdash; and on <Highlight color="amber">&quot;money&quot;</Highlight> in another.
                    Same word. Completely different connections.
                </P>

                {/* ═══ V09 — ContextChangesViz ═══ */}
                <FadeInView className="my-10 md:my-14">
                    <Suspense fallback={<SectionSkeleton />}>
                        <ContextChangesViz />
                    </Suspense>
                </FadeInView>

                <NarrativeDivider />

                {/* ── 7. Your intuition IS the answer ── */}
                <P>
                    Here&apos;s the most surprising part: <em>you</em> can predict which words
                    should attend to which. Your linguistic intuition already encodes these patterns.
                    Can you guess the spotlight pattern before seeing it?
                </P>

                {/* ═══ V10 — GuessPatternViz ═══ */}
                <FadeInView className="my-10 md:my-14">
                    <Suspense fallback={<SectionSkeleton />}>
                        <GuessPatternViz />
                    </Suspense>
                </FadeInView>

                <P>
                    Your predictions matched? That&apos;s because attention encodes the same
                    relationships your brain already sees. The mechanism doesn&apos;t invent
                    new patterns &mdash; it <em>learns</em> the ones you already know.
                </P>

                <NarrativeDivider />

                {/* ── 9. The key insight: dynamic vs static ── */}
                <P>
                    Remember the MLP from the previous chapter? Its weights are
                    <Highlight color="amber">carved in stone</Highlight> during training.
                    Position 3 always connects to position 1 with the same strength,
                    no matter what the input says.
                </P>

                <P>
                    Attention weights are completely different. They are
                    computed <Highlight>fresh for every input</Highlight>.
                    A new sentence means new connections, new strengths, new patterns.
                    The wiring rewires itself for every single sentence.
                </P>

                <Callout icon={Zap}>
                    <strong className="text-white/80">Static (MLP):</strong>{" "}
                    <span className="text-white/50">frozen wiring — same connections regardless of input.</span>
                    <br />
                    <strong className="text-white/80">Dynamic (Attention):</strong>{" "}
                    <span className="text-white/50">rewires for every sentence — connections depend on meaning.</span>
                </Callout>

                {/* ═══ V11 — StaticVsDynamicViz ═══ */}
                <FadeInView className="my-10 md:my-14">
                    <Suspense fallback={<SectionSkeleton />}>
                        <StaticVsDynamicViz />
                    </Suspense>
                </FadeInView>

                <NarrativeDivider />

                {/* ── 11. The full picture ── */}
                <P>
                    Now see the complete picture &mdash; every word&apos;s attention to every
                    other word, all at once.
                </P>

                {/* ═══ V11b — AttentionWebViz (full-attention constellation) ═══ */}
                <FadeInView className="my-10 md:my-14">
                    <Suspense fallback={<SectionSkeleton />}>
                        <AttentionWebViz />
                    </Suspense>
                </FadeInView>

                <P>
                    Every word is simultaneously attending to every other word &mdash; a dense web
                    of weighted connections, computed in parallel. But how do we store all of these
                    relationships? The answer is elegantly simple: a grid where every cell is one
                    connection strength.
                </P>

                {/* ═══ V12 — AttentionHeatmapViz ═══ */}
                <FadeInView className="my-10 md:my-14">
                    <Suspense fallback={<SectionSkeleton />}>
                        <AttentionHeatmapViz />
                    </Suspense>
                </FadeInView>

                {/* ── 13. MonsterStatus ── */}
                <MonsterStatus>
                    👾 For the first time, I can LOOK AROUND. I can see every other token.
                    I can feel which ones matter. I&apos;m not processing blindly anymore &mdash;
                    I&apos;m seeing the whole sentence at once. But... how do I actually decide who matters?
                </MonsterStatus>

                {/* ── 14. KeyTakeaway ── */}
                <KeyTakeaway accent="cyan">
                    Attention lets each token dynamically decide which other tokens are relevant &mdash;
                    not through fixed wiring, but through patterns computed fresh for every input.
                    This is the core idea behind every modern language model.
                </KeyTakeaway>

            </Section>

            {/* ── 15. Bridge to §04 ── */}
            <SectionBreak />
            <MonsterInterlude>
                You&apos;ve discovered the idea of attention: tokens looking at each other with
                varying intensity. But how does a token actually KNOW which others are important?
                It starts with a surprisingly simple question.
            </MonsterInterlude>

            {/* ═══════════════════════════════════════════════════
               §04 — THE ATTENTION MECHANISM
               ═══════════════════════════════════════════════════ */}
            <Section id="transformer-04">
                <SectionLabel number="04" label="The Attention Mechanism" />
                <SectionAnchor id="transformer-04"><Heading>The Attention Mechanism</Heading></SectionAnchor>
                <Lead>
                    We know tokens should talk to each other. But <em>how</em> does a token actually
                    figure out which others are important? It starts with a surprisingly simple question.
                </Lead>

                {/* ── §04a: Measuring Similarity ── */}

                {/* ── 1. Connection to embeddings ── */}
                <P>
                    Remember <Highlight color="amber">embeddings</Highlight> from the MLP chapter?
                    They turn each word into a <em>list of features</em> &mdash; numbers that capture
                    what the word means. Is it royal? Is it an action? Is it a person?
                    That list of features is what we call a <Highlight>vector</Highlight>.
                </P>

                <P>
                    If two words are similar, they&apos;ll have similar features &mdash; and therefore
                    similar vectors. We can picture each vector as an <em>arrow in meaning-space</em>:
                    similar words point in similar directions.
                </P>

                <P>
                    But here&apos;s the catch. Think about the word <span className="text-amber-300/70">&ldquo;king&rdquo;</span> &mdash;
                    it could mean a chess piece, a royal ruler, a surname (Martin Luther King),
                    or even a playing card. The MLP gave every word a <em>single</em> embedding,
                    the same <span className="text-cyan-300/50">regardless of context</span>.
                    That&apos;s exactly the problem we&apos;re about to solve.
                </P>

                {/* ═══ EmbeddingToArrowViz ═══ */}
                <FadeInView className="my-10 md:my-14">
                    <Suspense fallback={<SectionSkeleton />}>
                        <EmbeddingToArrowViz />
                    </Suspense>
                </FadeInView>

                <NarrativeDivider />

                {/* ── 2. The question ── */}
                <P>
                    So each word is a list of features. Similar words have similar lists.
                    But <em>how do we measure</em> how similar two lists are? We need a single
                    number that tells us: &quot;these two words are very alike&quot; or &quot;these two
                    words have nothing in common.&quot;
                </P>

                <P>
                    Think back to the neural network chapter. When we had <em>two single numbers</em>,
                    we discovered that multiplying them gives us a
                    <Highlight color="amber">weight</Highlight> &mdash; a way to control influence.
                    Now we have two <em>lists</em> of numbers. What if we multiply matching features
                    and add them all up?
                </P>

                <P>
                    Try it yourself. Slide the features on the right and watch the arrows
                    on the left move &mdash; or drag the arrows directly and watch the numbers change:
                </P>

                {/* ═══ DotProductCalculatorViz ═══ */}
                <FadeInView className="my-10 md:my-14">
                    <Suspense fallback={<SectionSkeleton />}>
                        <DotProductCalculatorViz />
                    </Suspense>
                </FadeInView>

                <P>
                    When features match &mdash; both high or both low &mdash; the products are positive
                    and the score climbs. When they disagree, products go negative and the score drops.
                    Notice how the arrows tell the same story: same direction → big score,
                    perpendicular → zero, opposite → negative.
                </P>

                <PullQuote>
                    Same direction → big number. Perpendicular → zero. Opposite → negative.
                </PullQuote>

                <NarrativeDivider />

                {/* ── 4. Naming + excitement ── */}
                <P>
                    This multiply-and-sum operation has a name: the{" "}
                    <Highlight color="amber">dot product</Highlight>. Mathematically, it&apos;s just
                    multiply-and-add. But what it <em>does</em> is extraordinary &mdash; it measures
                    how much two things point in the same direction.
                </P>

                <P>
                    Think about what that means. We turned words into lists of numbers.
                    Now we have a way to <em>measure</em> how related any two words are,
                    with a single number. High score? They&apos;re related. Near zero?
                    They have nothing in common. <strong className="text-white/50">We just gave
                        the model a relevance detector.</strong>
                </P>

                <NarrativeDivider />

                {/* ── 5. Pairwise scoring ── */}
                <P>
                    Now here&apos;s where it gets exciting. Take every word in a sentence and
                    compute the dot product with <em>every other word</em>. The result?
                    A complete map of relationships &mdash; every word compared to every
                    other word, all at once:
                </P>

                {/* ═══ PairwiseScoringViz ═══ */}
                <FadeInView className="my-10 md:my-14">
                    <Suspense fallback={<SectionSkeleton />}>
                        <PairwiseScoringViz />
                    </Suspense>
                </FadeInView>

                <NarrativeDivider />

                {/* ── 6. Self-similarity trap ── */}
                <P>
                    Wait. Something&apos;s wrong. Look at the{" "}
                    <Highlight color="amber">diagonal</Highlight> of that table &mdash; the cells
                    where a word is compared with itself.
                </P>

                <P>
                    Every word&apos;s highest score is with... <em>itself</em>. Of course it is.
                    A vector compared with itself always matches perfectly. But that means every
                    word pays the most attention to <em>itself</em>, ignoring all the other words
                    around it. That&apos;s exactly the problem we were trying to solve!
                </P>

                <Callout accent="amber" icon={AlertTriangle}>
                    <strong className="text-white/70">The self-attention trap:</strong>{" "}
                    <span className="text-white/50">
                        Using raw embeddings, every token pays the most attention to itself. 🤦
                    </span>
                </Callout>

                {/* ═══ SelfSimilarityViz ═══ */}
                <FadeInView className="my-10 md:my-14">
                    <Suspense fallback={<SectionSkeleton />}>
                        <SelfSimilarityViz />
                    </Suspense>
                </FadeInView>

                <P>
                    Before we move on, let&apos;s lock in the intuition. Can you tell
                    whether two arrows will give a positive or negative dot product
                    just by looking at them? Try the quiz:
                </P>

                {/* ═══ DotProductQuiz ═══ */}
                <FadeInView className="my-10 md:my-14">
                    <Suspense fallback={<SectionSkeleton />}>
                        <DotProductQuiz />
                    </Suspense>
                </FadeInView>

                <NarrativeDivider />

                {/* ── 7. Bridge to §04b ── */}
                <P>
                    So the dot product is brilliant for measuring relevance &mdash;
                    but using raw embeddings leads to a dead end. We need a twist.
                    What if each word could take on <Highlight>different roles</Highlight> &mdash;
                    one version for <em>asking questions</em>, and a different version for
                    <em> advertising answers</em>?
                </P>

                {/* ══════════════════════════════════════════════════════
                   §04b — TWO ROLES: QUERY AND KEY
                   ══════════════════════════════════════════════════════ */}

                {/* ── 0. THE GOAL ── */}
                <Callout icon={Target}>
                    <strong className="text-white/70">Our goal:</strong>{" "}
                    <span className="text-white/50">
                        Make each word&apos;s meaning depend on the words around it.
                        &quot;King&quot; next to &quot;crown&quot; should feel different from &quot;king&quot; next to &quot;chess.&quot;
                        By the end of this section, we&apos;ll get there.
                    </span>
                </Callout>

                {/* ── 1. The lenses metaphor ── */}
                <P>
                    Imagine putting on special glasses that change how you see each word.
                    One pair &mdash; the <Highlight color="cyan">Query lens</Highlight> &mdash;
                    highlights what the word is <em>searching for</em>. Another pair &mdash;
                    the <Highlight color="emerald">Key lens</Highlight> &mdash; highlights what
                    the word <em>advertises</em> to others.
                </P>

                <P>
                    &quot;King&quot; has high royalty in its embedding. But through the Query lens,
                    royalty fades and <em>action</em> lights up &mdash; king is looking for verbs.
                    Through the Key lens, royalty stays bright &mdash; king <em>offers</em> royalty
                    to whoever is looking for a noble subject.
                </P>

                <P>
                    The model learns these two lenses during training. Each one re-mixes
                    the embedding features in a different way, automatically discovering
                    what matters for asking vs. advertising. Click through the words below
                    to see how the same embedding produces two completely different views:
                </P>

                {/* ═══ QKSplitViz ═══ */}
                <FadeInView className="my-10 md:my-14">
                    <Suspense fallback={<SectionSkeleton />}>
                        <QKSplitViz />
                    </Suspense>
                </FadeInView>

                <NarrativeDivider />

                {/* ── 3. This fixes self-similarity! ── */}
                <P>
                    Remember the self-similarity trap? With raw embeddings, king &middot; king = highest
                    score. But now king&apos;s Query emphasizes &quot;action&quot; while its Key emphasizes
                    &quot;royalty&quot; &mdash; <em>they point in different directions</em>. &quot;Ruled&quot; (whose Key
                    screams &quot;action!&quot;) now scores <em>higher</em> than king itself!
                </P>

                <P>
                    See the difference for yourself. Toggle between raw embeddings and Q×K
                    projections &mdash; watch the diagonal collapse:
                </P>

                {/* ═══ WhyQKMattersViz ═══ */}
                <FadeInView className="my-10 md:my-14">
                    <Suspense fallback={<SectionSkeleton />}>
                        <WhyQKMattersViz />
                    </Suspense>
                </FadeInView>

                <NarrativeDivider />

                {/* ── 4. Q meets K — we can measure importance! ── */}
                <P>
                    Now let&apos;s see what happens when one word&apos;s Query meets <em>every</em> Key
                    in the sentence. Pick a word &mdash; see its Query arrow, then compare it
                    against every Key. The closer they point, the higher the score:
                </P>

                {/* ═══ QuerySearchViz ⭐ FLAGSHIP ═══ */}
                <FadeInView className="my-10 md:my-14">
                    <Suspense fallback={<SectionSkeleton />}>
                        <QuerySearchViz />
                    </Suspense>
                </FadeInView>

                <P>
                    See? It&apos;s not magic &mdash; it&apos;s <em>geometry</em>. When Q and K point
                    the same way, the dot product is high. Different directions? Low score.
                    The arrows tell you everything.
                </P>

                <P>
                    Remember those mysterious glowing lines from earlier? The ones that seemed
                    like magic? Let&apos;s look at them again &mdash; but now with our new glasses.
                    This time, you&apos;ll see the arrows behind every connection:
                </P>

                {/* ═══ QueryKeyRelationsViz (extended exploration) ═══ */}
                <FadeInView className="my-10 md:my-14">
                    <Suspense fallback={<SectionSkeleton />}>
                        <QueryKeyRelationsViz />
                    </Suspense>
                </FadeInView>

                <P>
                    We have scores! But they&apos;re raw numbers. We need percentages &mdash;
                    how much does each word matter <em>relative to the others</em>?
                    <Highlight>Softmax</Highlight> (the same function from previous chapters)
                    converts scores into a clean distribution that sums to 100%.
                </P>

                <P>
                    <strong className="text-white/70">We did it!</strong> We can now measure exactly
                    how much each word matters to every other word. Crown gets 30%, golden 25%,
                    wore 20%... We cracked the first piece of the puzzle!
                </P>

                <P>
                    But notice something: <em>king also attends to itself</em> (about 6%).
                    This is called <Highlight>self-attention</Highlight> &mdash; a word always
                    keeps some of its own meaning. Usually it&apos;s a small percentage, because
                    the surrounding words carry the context that matters most.
                </P>

                <NarrativeDivider />

                {/* ── 5. What do we DO with these percentages? ── */}
                <P>
                    So we know <em>who matters</em> and <em>by how much</em>. Now what?
                    We want to <Highlight color="amber">blend information</Highlight> from all words
                    into a new representation for king. Take 30% of crown&apos;s meaning, 25% of
                    golden&apos;s, 20% of wore&apos;s... But <Highlight color="amber">30% of
                        WHAT exactly?</Highlight>
                </P>

                <P>
                    Crown&apos;s embedding? We already used that for Query and Key &mdash; those
                    were specialized for <em>searching</em>, not for sharing information.
                    The percentages tell us WHO matters. But we don&apos;t have the WHAT.
                </P>

                <Callout accent="amber" icon={AlertTriangle}>
                    <strong className="text-white/70">The gap:</strong>{" "}
                    <span className="text-white/50">
                        We know WHO matters and BY HOW MUCH. But we don&apos;t have the actual content to blend.
                    </span>
                </Callout>

                {/* ═══ V19 — WeightsOfWhatViz ═══ */}
                <FadeInView className="my-10 md:my-14">
                    <Suspense fallback={<SectionSkeleton />}>
                        <WeightsOfWhatViz />
                    </Suspense>
                </FadeInView>

                <NarrativeDivider />

                {/* ══════════════════════════════════════════════════════
                   §04c — THE MISSING PIECE: VALUE
                   ══════════════════════════════════════════════════════ */}

                {/* ── 1. V is discovered ── */}
                <P>
                    What if each word provided a <Highlight color="amber">third version</Highlight> of
                    itself &mdash; not for asking, not for advertising, but for <em>sharing its actual
                        information</em>?
                </P>

                <P>
                    Meet the <Highlight color="amber">Value</Highlight> vector. When king gives
                    crown 30% attention, that 30% is taken from crown&apos;s <em>Value</em> &mdash;
                    the content it wants to share. Another matrix (W<sub>V</sub>) creates this
                    third representation, optimized for carrying useful information.
                </P>

                {/* ── Three representations: one embedding → Q, K, V ── */}
                <div className="max-w-lg mx-auto my-8 sm:my-10">
                    {/* Source: the embedding */}
                    <div className="flex justify-center mb-0">
                        <div
                            className="px-4 py-1.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-semibold"
                            style={{
                                color: "rgba(255,255,255,0.3)",
                                background: "rgba(255,255,255,0.025)",
                                border: "1px solid rgba(255,255,255,0.05)",
                            }}
                        >
                            One embedding
                        </div>
                    </div>

                    {/* SVG connector: one source → three branches */}
                    <div className="flex justify-center">
                        <svg width="300" height="28" viewBox="0 0 300 28" fill="none" className="overflow-visible">
                            <line x1="150" y1="0" x2="150" y2="10" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                            <path d="M 150 10 Q 150 20, 50 26" stroke="rgba(34,211,238,0.12)" strokeWidth="1" fill="none" strokeLinecap="round" />
                            <path d="M 150 10 Q 150 18, 150 26" stroke="rgba(52,211,153,0.12)" strokeWidth="1" fill="none" strokeLinecap="round" />
                            <path d="M 150 10 Q 150 20, 250 26" stroke="rgba(251,191,36,0.12)" strokeWidth="1" fill="none" strokeLinecap="round" />
                            <circle cx="150" cy="10" r="1.5" fill="rgba(255,255,255,0.08)" />
                        </svg>
                    </div>

                    {/* Three cards */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                        {[
                            { label: "Query", icon: "🔍", subtitle: "What am I looking for?", color: "34,211,238" },
                            { label: "Key", icon: "🔑", subtitle: "What do I represent?", color: "52,211,153" },
                            { label: "Value", icon: "📦", subtitle: "Here's my info to share", color: "251,191,36" },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="rounded-xl px-2.5 sm:px-3 py-3 text-center"
                                style={{
                                    background: `linear-gradient(145deg, rgba(${item.color},0.05), transparent 80%)`,
                                    border: `1px solid rgba(${item.color},0.08)`,
                                }}
                            >
                                <p
                                    className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] font-semibold mb-0.5"
                                    style={{ color: `rgba(${item.color},0.5)` }}
                                >
                                    {item.icon} {item.label}
                                </p>
                                <p
                                    className="text-[10px] sm:text-[11px] italic leading-snug"
                                    style={{ color: `rgba(${item.color},0.25)` }}
                                >
                                    &quot;{item.subtitle}&quot;
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── 2. How it works: weighted sum ── */}
                <P>
                    Here&apos;s what we do: take each word&apos;s Value, multiply it by the attention
                    percentage, and <Highlight>add them all up</Highlight>. 30% of crown&apos;s Value +
                    25% of golden&apos;s + 20% of wore&apos;s + 6% of king&apos;s own Value + ...
                    The result? A brand new vector that represents &quot;king&quot; <em>in this specific
                        context</em>.
                </P>

                <P>
                    The result is a <em>weighted blend</em> of everyone&apos;s information.
                    Step through the process:
                </P>

                {/* ═══ V20 — ValueCompletesViz ═══ */}
                <FadeInView className="my-10 md:my-14">
                    <Suspense fallback={<SectionSkeleton />}>
                        <ValueCompletesViz />
                    </Suspense>
                </FadeInView>

                <NarrativeDivider />

                {/* ── 3. THE PAYOFF: each word depends on all others ── */}
                <P>
                    <strong className="text-white/70">This is the moment.</strong> Before attention,
                    every word was an island &mdash; same embedding no matter what surrounded it.
                    &quot;King&quot; always meant the same thing. Now, after one pass of attention, each
                    word&apos;s representation is a <Highlight>blend of all the words around it</Highlight>,
                    weighted by how much they matter.
                </P>

                <P>
                    &quot;King&quot; next to &quot;crown&quot; picks up royalty.
                    &quot;King&quot; next to &quot;chess&quot; would pick up strategy.
                    <em>The same word, different meaning, depending on context.</em> That was our goal.
                    Watch it happen &mdash; one token&apos;s journey from isolation to context:
                </P>

                {/* ═══ V26 — ContextAssemblyFilmViz ⭐ — single-word journey ═══ */}
                <FadeInView className="my-10 md:my-14">
                    <Suspense fallback={<SectionSkeleton />}>
                        <ContextAssemblyFilmViz />
                    </Suspense>
                </FadeInView>

                <P>
                    That was one word&apos;s journey. But in a transformer, this happens to
                    <em> every </em> word simultaneously. Watch the entire sentence transform at once:
                </P>

                {/* ═══ V26b — FullContextualAssemblyViz ⭐ (the living sentence) ═══ */}
                <FadeInView className="my-10 md:my-14">
                    <Suspense fallback={<SectionSkeleton />}>
                        <FullContextualAssemblyViz />
                    </Suspense>
                </FadeInView>

                <Callout icon={Sparkles}>
                    <strong className="text-white/70">We did it!</strong>{" "}
                    <span className="text-white/50">
                        Each word&apos;s meaning now depends on every other word. Context shapes representation.
                        This is the core idea behind attention &mdash; and the foundation of every modern language model.
                    </span>
                </Callout>

                <MonsterStatus>
                    👾 I can ask questions. I can find answers. I can blend information.
                    For the first time, each word I see has a meaning that depends on everything around it.
                    I don&apos;t just read words &mdash; I understand them <em>in context</em>.
                </MonsterStatus>

                <NarrativeDivider />

                {/* ══════════════════════════════════════════════════════
                   §04d — SCALING, SOFTMAX, AND THE FULL PIPELINE
                   ══════════════════════════════════════════════════════ */}

                {/* ── 1. The explosion problem ── */}
                <P>
                    Our Q·K scores work beautifully with 3 features. But real models don&apos;t use
                    3 &mdash; they use <em>hundreds</em>. GPT uses vectors with 768 dimensions.
                    Why does that matter?
                </P>

                <P>
                    A dot product is a <Highlight>sum of products across all dimensions</Highlight>.
                    With 3 dimensions, you add 3 numbers. With 768, you add 768 numbers. More terms
                    in the sum = bigger total. The scores become <em>enormous</em> &mdash; and remember
                    softmax saturation from the MLP chapter? Huge numbers go in, 99.99% comes out on
                    one word, 0.01% on everything else. The model stops blending and starts <em>ignoring</em>.
                </P>

                {/* ═══ V21 — NumbersExplodeViz ═══ */}
                <FadeInView className="my-10 md:my-14">
                    <Suspense fallback={<SectionSkeleton />}>
                        <NumbersExplodeViz />
                    </Suspense>
                </FadeInView>

                {/* ── 2. The fix: divide by √dimensions ── */}
                <P>
                    We need to calm those numbers down. What if we divided all scores by
                    some number before feeding them to softmax? But <Highlight>which number?</Highlight>{" "}
                    Try it yourself &mdash; find the divisor that makes the distribution healthy:
                </P>

                {/* ═══ V22 — ScalingFixViz ═══ */}
                <FadeInView className="my-10 md:my-14">
                    <Suspense fallback={<SectionSkeleton />}>
                        <ScalingFixViz />
                    </Suspense>
                </FadeInView>

                {/* ── 4. The full pipeline ── */}
                <P>
                    Let&apos;s put it all together. The complete attention pipeline:
                    Q·K → scale by √d → softmax → multiply by V → sum to output.
                    Five steps, each one simple, together they&apos;re extraordinary.
                </P>

                {/* ═══ V24 — FullScoringPipelineViz ⭐ ═══ */}
                <FadeInView className="my-10 md:my-14">
                    <Suspense fallback={<SectionSkeleton />}>
                        <FullScoringPipelineViz />
                    </Suspense>
                </FadeInView>

                {/* ── 5. Attention = soft retrieval ── */}
                <P>
                    Think of attention as a <Highlight>soft database lookup</Highlight>.
                    A hard lookup picks exactly one item by index. Attention picks a <em>weighted
                        blend</em> of everything, based on relevance. No information is lost &mdash;
                    every word contributes, proportional to how much it matters.
                </P>

                {/* ── 6. The formula reveal ── */}
                <P>
                    Each word becomes a function of <em>all</em> other words. That single idea
                    powers GPT, Claude, Gemini, and every modern language model. Here&apos;s
                    the formula &mdash; every symbol now has a face:
                </P>

                <FormulaBlock
                    formula="Attention(Q, K, V) = softmax(QK^T / √dim) · V"
                    caption="You built this piece by piece. Every symbol now makes sense. √dim = square root of the number of dimensions."
                />

                <MonsterStatus>
                    👾 Five steps. Q·K for similarity. Scale to keep numbers calm. Softmax for percentages.
                    Multiply by V for content. Sum for the final answer.
                    One formula. The most important formula in modern AI. And I understand every piece.
                </MonsterStatus>
            </Section>

            <SectionBreak />
            <MonsterInterlude>
                One attention head captures one pattern. But language has MANY simultaneous patterns.
                Syntax, semantics, reference, structure — all at once.
            </MonsterInterlude>

            {/* ═══════════════════════════════════════════════════
               §05 — SEEING MULTIPLE THINGS AT ONCE
               ═══════════════════════════════════════════════════ */}
            <Section id="transformer-05">
                <SectionLabel number="05" label="Seeing Multiple Things at Once" />
                <SectionAnchor id="transformer-05"><Heading>Seeing Multiple Things at Once</Heading></SectionAnchor>
                <Lead>
                    A single attention head captures one type of relationship. But language is richer than that.
                    What if we gave the model <Highlight>multiple sets of eyes</Highlight>?
                </Lead>

                {/* ── 1. Setup: feel the limitation ── */}
                <P>
                    Read this sentence carefully: <em>&quot;The professor who published the paper in Nature last
                        year won the Nobel prize.&quot;</em> Think about all the relationships &quot;professor&quot;
                    has with other words:
                </P>

                {/* Relationship cards */}
                <div className="max-w-lg mx-auto my-6 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                        { from: "professor", to: "published", type: "subject → verb", dist: "1 word apart", color: "#22d3ee" },
                        { from: "professor", to: "won", type: "subject → verb", dist: "8 words apart", color: "#22d3ee" },
                        { from: "professor", to: "Nature", type: "subject → location", dist: "6 words apart", color: "#fbbf24" },
                        { from: "professor", to: "prize", type: "subject → object", dist: "11 words apart", color: "#fbbf24" },
                    ].map((rel, i) => (
                        <div
                            key={i}
                            className="px-4 py-2.5"
                            style={{
                                borderLeft: `2px solid ${rel.color}50`,
                            }}
                        >
                            <p className="text-sm font-semibold" style={{ color: rel.color }}>
                                {rel.from} → {rel.to}
                            </p>
                            <p className="text-xs text-white/25 mt-0.5">{rel.type} ({rel.dist})</p>
                        </div>
                    ))}
                </div>

                <P>
                    Notice something: all these relationships are <em>equally important</em> for understanding
                    the sentence. Every word gathers information from the words around it, blending everything
                    together — making all representations <Highlight>richer but more similar</Highlight>,
                    because they share the same context.
                </P>

                <P>
                    One word can <em>look for</em> many things at once. A verb, a description, a location,
                    an object. Remember how &quot;king&quot; could mean a chess piece, a ruler, or a company?
                    The Query needs to search for <em>different things simultaneously</em>. But with a single
                    set of Q, K, V weights, you get <Highlight color="amber">one compromise</Highlight>.
                </P>

                <P>
                    Try it yourself. Can you make one set of attention weights capture everything?
                </P>

                {/* ═══ V27 — OneHeadDilemmaViz ═══ */}
                <FadeInView className="my-10 md:my-14">
                    <Suspense fallback={<SectionSkeleton />}>
                        <OneHeadDilemmaViz />
                    </Suspense>
                </FadeInView>

                <P>
                    See the problem? One set of weights = one compromise. Boosting one relationship
                    kills the others. A single attention head can only capture <em>one pattern</em> at a time.
                </P>

                <NarrativeDivider />

                {/* ── 2. The discovery ── */}
                <P>
                    Remember: each word is an embedding &mdash; a set of <em>features</em>. Some features
                    describe <strong>syntax</strong> (is it a verb? a noun?), others describe
                    <strong> meaning</strong> (royalty, action, location), and others describe
                    <strong> form</strong> (singular, past tense, capitalized). All packed into one vector.
                </P>

                <P>
                    What if, instead of one attention system trying to handle everything, we ran
                    <Highlight color="cyan"> multiple attention systems in parallel</Highlight>? Each with
                    its own Q, K, and V matrices. Each free to learn to focus on <em>different features</em> of
                    the embedding:
                </P>

                {/* ═══ V27b — MultiHeadIdeaViz ═══ */}
                <FadeInView className="my-8 md:my-10">
                    <Suspense fallback={<SectionSkeleton />}>
                        <MultiHeadIdeaViz />
                    </Suspense>
                </FadeInView>

                <P>
                    Here&apos;s the crucial insight: it&apos;s the <Highlight color="amber">V (Value) matrices</Highlight> that
                    make this powerful. Q and K decide <em>who to attend to</em> &mdash; but V decides
                    <em>what information to pass along</em>. A syntax head&apos;s V matrix might extract
                    &ldquo;this is a verb in past tense,&rdquo; while a meaning head&apos;s V matrix extracts
                    &ldquo;this is related to academia.&rdquo; Same word, completely different signals.
                </P>

                <P>
                    This is called <Highlight color="cyan">Multi-Head Attention</Highlight>.
                    Instead of one set of eyes forced into a single compromise, the model gets
                    <em> many sets of eyes</em>, each specialized in a different aspect of language.
                    Watch how each head sees something different:
                </P>

                {/* ═══ V28 — MultiLensViewViz ═══ */}
                <FadeInView className="my-10 md:my-14">
                    <Suspense fallback={<SectionSkeleton />}>
                        <MultiLensViewViz />
                    </Suspense>
                </FadeInView>

                <P>
                    And here&apos;s what makes it efficient: each head doesn&apos;t work with the
                    full embedding. If an embedding has 512 dimensions and we have 4 heads,
                    each head gets <Highlight color="cyan">its own exclusive slice of 128 dimensions</Highlight>.
                    The slices <em>don&apos;t overlap</em> &mdash; head 1 might own dimensions 1&ndash;128 (syntax
                    features), head 2 owns 129&ndash;256 (semantic features), and so on. Each head
                    becomes an expert in its own subset of the word&apos;s features, and none of
                    them compete for the same information.
                </P>

                <NarrativeDivider />

                {/* ── 4. Full pipeline: embedding → heads → attention → concat → output ── */}
                <P>
                    But we can&apos;t just leave 4 separate outputs. The rest of the model expects
                    <em> one vector per word</em>. So we <Highlight color="amber">concatenate</Highlight> all
                    head outputs &mdash; stacking each head&apos;s slice back together into one
                    long vector, then <Highlight color="cyan">projecting</Highlight> it back to
                    the original embedding size. The result: every word now carries information
                    from all four perspectives at once. Watch it happen:
                </P>

                {/* ═══ V32 — MultiHeadPipelineViz (flagship) ═══ */}
                <FadeInView className="my-10 md:my-14">
                    <Suspense fallback={<SectionSkeleton />}>
                        <MultiHeadPipelineViz />
                    </Suspense>
                </FadeInView>

                <NarrativeDivider />

                {/* ── 6. The budget trade-off ── */}
                <P>
                    There&apos;s a practical question: <Highlight>how many heads?</Highlight> The total
                    dimension is fixed (say 512). More heads means each one gets fewer dimensions.
                    Too few heads and you miss patterns. Too many and each head is too narrow to learn anything useful.
                </P>

                {/* ═══ V31 — HeadBudgetViz ═══ */}
                <FadeInView className="my-10 md:my-14">
                    <Suspense fallback={<SectionSkeleton />}>
                        <HeadBudgetViz />
                    </Suspense>
                </FadeInView>

                <P>
                    GPT-2 uses 12 heads with 64 dimensions each. GPT-3 uses 96 heads with 128 dimensions each.
                    The sweet spot depends on the model size, but the principle is always the same:
                    <em> split the work across specialized workers</em>.
                </P>

                <MonsterStatus>
                    👾 I have many eyes now! Each sees something different. One eye watches grammar.
                    Another watches meaning. A third tracks nearby context. Together they see
                    everything a single head never could. I am not just paying attention &mdash;
                    I am paying attention in <em>multiple ways at once</em>.
                </MonsterStatus>

                <KeyTakeaway accent="cyan">
                    Multi-head attention runs multiple independent attention systems in parallel.
                    Each head learns to capture different relationship types. Their outputs are
                    concatenated and projected back to the original dimension. This gives the model
                    the ability to simultaneously attend to grammar, meaning, position, and more.
                </KeyTakeaway>
            </Section>

            <SectionBreak />
            <MonsterInterlude>
                Our attention mechanism is powerful. But try scrambling the words:
                &quot;dog bites man&quot; and &quot;man bites dog.&quot; Same attention, same output.
                It has NO idea about order.
            </MonsterInterlude>

            {/* ═══════════════════════════════════════════════════
               §06 — WHERE AM I?
               ═══════════════════════════════════════════════════ */}
            <Section id="transformer-06">
                <SectionLabel number="06" label="Where Am I?" />
                <SectionAnchor id="transformer-06"><Heading>Where Am I?</Heading></SectionAnchor>

                {/* ── 1. THE DISASTER — attention is order-blind ── */}
                <Lead>
                    Read these two sentences: &quot;The dog bit the man&quot; and &quot;The man bit the dog.&quot;
                    Completely different stories, right? Now run them through our attention mechanism.
                    The result is <Highlight>identical</Highlight>. Same weights. Same output. Attention
                    has absolutely no idea which word came first.
                </Lead>

                <P>
                    Think about why. Attention computes a dot product between every pair of words.
                    If you shuffle the input, the exact same dot products happen &mdash; just in
                    a different order. Attention treats the sentence like a <em>bag of words</em>,
                    not a sequence. Order doesn&apos;t exist.
                </P>

                <P>
                    But order is <em>everything</em> in language. &quot;Dog bit man&quot; is a news story.
                    &quot;Man bit dog&quot; is a headline. We need to fix this &mdash; urgently.
                </P>

                {/* ═══ V32 — ShuffleDisasterViz ═══ */}
                <FadeInView className="my-10 md:my-14">
                    <Suspense fallback={<SectionSkeleton />}>
                        <ShuffleDisasterViz />
                    </Suspense>
                </FadeInView>

                <NarrativeDivider />

                {/* ── 2. FIRST ATTEMPT — just number them? ── */}
                <P>
                    Okay, let&apos;s fix it. The simplest idea: give each position a number.
                    Position 1 gets the number 1. Position 2 gets 2. Position 3 gets 3.
                    Just <Highlight>add that number</Highlight> to the embedding. Now the model
                    knows where each word sits. Problem solved?
                </P>

                <P>
                    Not quite. Think about what happens with a long text &mdash; 500 words.
                    Position 500 gets +500 added to its embedding. The actual <em>meaning</em> of the
                    word (maybe values around 0.3, -0.7, 1.2) gets completely drowned out by
                    a giant number. Position overwhelms meaning.
                </P>

                <P>
                    Fine &mdash; what about <em>small</em> numbers? Position 1 = 0.001, position 2 = 0.002,
                    position 3 = 0.003... Now the signal is so weak the model can barely tell
                    positions apart. Too loud or too quiet &mdash; neither works.
                </P>

                {/* ═══ V33 — SimpleNumbersViz ═══ */}
                <FadeInView className="my-10 md:my-14">
                    <Suspense fallback={<SectionSkeleton />}>
                        <SimpleNumbersViz />
                    </Suspense>
                </FadeInView>

                <NarrativeDivider />

                {/* ── 3. DEEPER PROBLEM — one number isn't enough ── */}
                <P>
                    But there&apos;s a deeper problem. Even if we found the perfect scale,
                    a single number can&apos;t carry enough information. Our embeddings have
                    dozens or hundreds of dimensions. We&apos;d be cramming all position
                    information into <em>one</em> dimension. That&apos;s like trying to describe
                    your exact location on Earth with a single number &mdash; you need at least
                    two (latitude and longitude).
                </P>

                <P>
                    What if each position had its own <Highlight>pattern of values</Highlight> &mdash;
                    not a single number, but a whole list? A unique fingerprint for
                    every position, spread across many numbers?
                </P>

                <NarrativeDivider />

                {/* ── 4. WHAT IF — embeddings for positions? ── */}
                <P>
                    Wait. We already solved a problem like this. Remember embeddings?
                    Each word got its own <Highlight>list of features</Highlight> &mdash;
                    a bunch of numbers that describe it. &quot;Dog&quot; might be
                    [0.9, -0.3, 0.7, 0.1] &mdash; high on &quot;animal,&quot; low on &quot;human,&quot;
                    and so on. A list of numbers like this is called a <em>vector</em>,
                    but it&apos;s really just a list of characteristics.
                </P>

                <P>
                    What if we did the <Highlight color="amber">same thing for positions</Highlight>?
                    Position 1 gets its own list of numbers. Position 2 gets a different list.
                    Position 3, another. Just like word embeddings, but instead of describing
                    <em> what</em> a word means, these describe <em>where</em> it sits.
                    We could even let the model learn these lists during training!
                </P>

                <P>
                    This actually works &mdash; and some models do exactly this (GPT-2, for example).
                    But it has a limitation: you have to decide the maximum number of positions
                    <em> in advance</em>. If you trained with 512 positions, position 513 has no
                    embedding. The model simply can&apos;t handle texts longer than what it saw in training.
                </P>

                <Callout icon={Brain} title="Two approaches to position">
                    <p>
                        <strong className="text-white/60">Learned embeddings:</strong>{" "}
                        <span className="text-white/40">
                            Train a unique list of numbers for each position. Simple and effective,
                            but fixed maximum length.
                        </span>
                    </p>
                    <p>
                        <strong className="text-white/60">Fixed patterns:</strong>{" "}
                        <span className="text-white/40">
                            Use a mathematical formula that works for ANY position.
                            No maximum length. But can the model use it?
                        </span>
                    </p>
                </Callout>

                {/* ═══ V33b — LearnedPositionEmbeddingsViz ═══ */}
                <FadeInView className="my-10 md:my-14">
                    <Suspense fallback={<SectionSkeleton />}>
                        <LearnedPositionEmbeddingsViz />
                    </Suspense>
                </FadeInView>

                {/* ── 5. THE CLEVER IDEA — waves! ── */}
                <P>
                    The original Transformer paper chose the second approach. And the idea
                    is beautiful. Instead of learning position lists of features, they used
                    <Highlight color="amber"> waves</Highlight>.
                </P>

                <P>
                    Imagine a clock with multiple hands spinning at different speeds. One hand
                    completes a full rotation every 2 positions (very fast). Another every 4
                    positions. Another every 8. Another every 16. And so on, slower and slower.
                </P>

                <P>
                    At any given position, you read off where each hand is pointing.
                    That combination of readings is <em>unique</em> for every position. Think of it
                    like a <Highlight>fingerprint made of waves</Highlight>.
                </P>

                {/* ═══ V34 — WaveFingerprintViz ⭐ ═══ */}
                <FadeInView className="my-10 md:my-14">
                    <Suspense fallback={<SectionSkeleton />}>
                        <WaveFingerprintViz />
                    </Suspense>
                </FadeInView>

                <P>
                    Each wave has a job. The <Highlight color="cyan">fast wave</Highlight> changes
                    with every single position &mdash; it tells you <em>exactly</em> where you are,
                    like knowing your seat number in a row. The <Highlight color="amber">medium
                        wave</Highlight> changes every few positions &mdash; it tells you which
                    <em> paragraph</em> you&apos;re in. The <Highlight color="amber">slow wave</Highlight> barely
                    moves &mdash; it tells you which <em>section</em> of the text you&apos;re reading,
                    near the beginning or near the end.
                </P>

                <P>
                    Together, they encode both <Highlight>fine detail</Highlight> (position 5 vs 6)
                    and <Highlight>big picture</Highlight> (beginning vs middle vs end).
                    It&apos;s like an address: the fast waves are your street number, the medium
                    waves are your neighborhood, the slow waves are your city.
                </P>

                <NarrativeDivider />

                {/* ── 6. WHY WAVES WORK — nearby = similar ── */}
                <P>
                    Here&apos;s why waves are so clever. Two positions that are <em>close together</em> (like
                    position 10 and position 11) have very <Highlight color="cyan">similar</Highlight> wave
                    readings. Two positions that are far apart (like position 10 and position 200) have
                    completely different readings.
                </P>

                <P>
                    This is exactly what we want! In language, nearby words usually have stronger relationships
                    than distant words. The position encoding naturally captures this &mdash; the model can
                    easily learn that &quot;3 positions apart&quot; means something different from &quot;100
                    positions apart.&quot;
                </P>

                {/* ═══ V35 — PositionalSimilarityViz ═══ */}
                <FadeInView className="my-10 md:my-14">
                    <Suspense fallback={<SectionSkeleton />}>
                        <PositionalSimilarityViz />
                    </Suspense>
                </FadeInView>

                <NarrativeDivider />

                {/* ── 7. THE FORMULA — sine and cosine ── */}
                <P>
                    The math behind these waves uses sine and cosine &mdash; the same functions
                    that describe how a point moves around a circle. Each number in the
                    position list uses a wave at a different frequency:
                </P>

                <FormulaBlock
                    formula="PE_{(pos, 2i)} = \sin\!\bigl(\tfrac{pos}{10000^{2i/d}}\bigr) \qquad PE_{(pos, 2i+1)} = \cos\!\bigl(\tfrac{pos}{10000^{2i/d}}\bigr)"
                    caption="Each dimension uses a different frequency. Even dimensions get sine, odd get cosine. Together they create a unique fingerprint for every position."
                />

                <P>
                    Don&apos;t worry about the formula &mdash; what matters is the idea.
                    Each position gets a <em>unique pattern</em> &mdash; a unique list of numbers
                    spread across all its features. And the pattern is generated by a formula,
                    so it works for <Highlight>any position number</Highlight> &mdash; no maximum length.
                </P>

                <NarrativeDivider />

                {/* ── 8. PUTTING IT TOGETHER — add position to meaning ── */}
                <P>
                    The final step is beautifully simple. Take the word embedding (what the word
                    <em> means</em>) and the positional encoding (where the word <em>sits</em>).
                    <Highlight color="amber">Add them together</Highlight>. That&apos;s it.
                </P>

                <FormulaBlock
                    formula="x = \text{word\_embedding} + \text{positional\_encoding}"
                    caption="Meaning + position. Now the model knows both WHAT a word is and WHERE it is."
                />

                <P>
                    After this addition, &quot;dog&quot; at position 1 has a slightly different
                    list of numbers than &quot;dog&quot; at position 5. The attention mechanism can
                    now tell them apart. &quot;Dog bit man&quot; and &quot;man bit dog&quot; finally
                    produce <em>different</em> attention patterns. Order is restored.
                </P>

                {/* ═══ V36 — AddEmbeddingsViz ═══ */}
                <FadeInView className="my-10 md:my-14">
                    <Suspense fallback={<SectionSkeleton />}>
                        <AddEmbeddingsViz />
                    </Suspense>
                </FadeInView>

                {/* ═══ V37 — PositionInActionViz ═══ */}
                <FadeInView className="my-10 md:my-14">
                    <Suspense fallback={<SectionSkeleton />}>
                        <PositionInActionViz />
                    </Suspense>
                </FadeInView>

                <MonsterStatus>
                    👾 I can finally feel WHERE things are. Position 1 feels different from position 100.
                    The same word in different places carries different meaning. Order is part of me now.
                </MonsterStatus>

                <NarrativeDivider />

                {/* ── 9. MODERN APPROACHES ── */}
                <P>
                    So which approach do modern models actually use? The original Transformer
                    (2017) used the wave-based formula. But most models today &mdash; GPT-4,
                    LLaMA, Claude &mdash; use <Highlight>learned position embeddings</Highlight>,
                    because with enough training data, the model can figure out the best
                    position representations on its own. The maximum length issue is solved
                    by simply training on very long texts (thousands of tokens).
                </P>

                <P>
                    Some cutting-edge models use <Highlight color="amber">RoPE</Highlight> (Rotary
                    Position Embeddings) &mdash; a clever hybrid that rotates the query and key
                    vectors based on position, combining the best of both worlds: it works
                    for any length <em>and</em> the model can learn from it naturally.
                    But the core idea remains the same: <em>give the model a way to know
                        where each word sits</em>.
                </P>

                <KeyTakeaway accent="cyan">
                    Attention is order-blind &mdash; it treats input as a set, not a sequence.
                    Positional encoding fixes this by adding a unique wave-based fingerprint
                    to each position. Nearby positions have similar encodings, distant ones differ.
                    The result: meaning + position, combined through simple addition.
                </KeyTakeaway>
            </Section>

            <SectionBreak />
            <MonsterInterlude>
                You have attention (communication). You have embeddings (meaning). You have positions (order).
                Time to assemble the full block.
            </MonsterInterlude>

            {/* ═══════════════════════════════════════════════════
               §07 — THE TRANSFORMER BLOCK
               ═══════════════════════════════════════════════════ */}
            <Section id="transformer-07">
                <SectionLabel number="07" label="The Transformer Block" />
                <SectionAnchor id="transformer-07"><Heading>The Transformer Block</Heading></SectionAnchor>
                <Lead>
                    You&apos;ve built attention &mdash; the ability to listen.
                    Now it&apos;s time to assemble the <Highlight>complete thinking machine</Highlight>.
                </Lead>

                {/* ══════════════════════════════════════════════
                   BEAT 1 — THE TWO HALVES (hook + problem)
                   ══════════════════════════════════════════════ */}

                <P>
                    Think about how <em>you</em> learn something new in a conversation.
                    First, you <Highlight>listen</Highlight> &mdash; you gather information
                    from what others are saying. Then you <Highlight color="amber">think</Highlight> &mdash;
                    you process what you heard, connect it to what you already know, and form
                    your own understanding.
                </P>

                <P>
                    Every intelligent process has these two parts. Listening and thinking.
                    Communication and processing. And the Transformer does both &mdash; but with
                    two completely different mechanisms.
                </P>

                <NarrativeDivider />

                <P>
                    Attention is the <Highlight>listening</Highlight> phase. Each token looks at
                    every other token, gathers relevant information, and updates itself.
                    It&apos;s social &mdash; tokens talking to each other, sharing context.
                </P>

                <P>
                    But after listening, each token needs to <em>think</em> about what it heard.
                    Process the information. Transform it into deeper understanding. This is a
                    <Highlight color="amber"> private</Highlight> operation &mdash; each token works
                    alone, digesting what it gathered.
                </P>

                {/* ═══ V38 — CommunicationVsProcessingViz ═══ */}
                <FadeInView className="my-10 md:my-14">
                    <Suspense fallback={<SectionSkeleton />}>
                        <CommunicationVsProcessingViz />
                    </Suspense>
                </FadeInView>

                <P>
                    But here&apos;s the crucial question: is listening enough? If tokens can
                    gather information from each other, is the job done? Let&apos;s see what
                    happens when attention works <em>alone</em>, without any further processing.
                </P>

                {/* ═══ V38b — AttentionAloneFailsViz ⭐⭐ ═══ */}
                <FadeInView className="my-10 md:my-14">
                    <Suspense fallback={<SectionSkeleton />}>
                        <AttentionAloneFailsViz />
                    </Suspense>
                </FadeInView>

                {/* ══════════════════════════════════════════════
                   BEAT 2 — FFN CALLBACK (recognition + reveal)
                   ══════════════════════════════════════════════ */}

                <NarrativeDivider />

                <P>
                    So what does the &quot;thinking&quot; part look like? Each token
                    takes its enriched vector (now full of context from attention) and runs
                    it through a function that transforms it &mdash; expanding it into a larger
                    space, applying an activation, then compressing back down.
                </P>

                <P>
                    Wait. That sounds familiar. Input <StyledArrow /> expand <StyledArrow /> activation <StyledArrow /> compress.
                    That&apos;s <em>exactly</em> the feedforward network you built
                    in the MLP chapter! Two layers with a non-linearity in between.
                </P>

                <Callout accent="amber" icon={Zap} title="🔗 You Built This!">
                    The feedforward network inside each Transformer layer is the same MLP
                    architecture from the previous chapter. Attention handles communication
                    between tokens. The FFN handles private processing within each token.
                </Callout>

                {/* ═══ V39 — FFNCallbackViz ═══ */}
                <FadeInView className="my-10 md:my-14">
                    <Suspense fallback={<SectionSkeleton />}>
                        <FFNCallbackViz />
                    </Suspense>
                </FadeInView>

                <P>
                    Think of the FFN as each token&apos;s <Highlight color="amber">private notebook</Highlight>.
                    After listening to the conversation (attention), each token sits alone and
                    processes what it heard. The attention decided <em>what</em> to look at.
                    The FFN processes <em>what it found</em>.
                </P>

                {/* ══════════════════════════════════════════════
                   BEAT 3 — STABILITY (problem + callback)
                   ══════════════════════════════════════════════ */}

                <NarrativeDivider />

                <P>
                    We have two powerful operations: attention (listen) and FFN (think).
                    But if we just chain them one after another, we hit a problem you&apos;ve
                    seen before &mdash; the signal degrades. Gradients vanish. The deeper
                    the network, the harder it is to train.
                </P>

                <P>
                    Remember the <Highlight>gradient highway</Highlight> from
                    the MLP chapter? When we stacked layers, gradients disappeared. The solution
                    was residual connections &mdash; adding the input back to the output, creating
                    a shortcut for information (and gradients) to flow through.
                </P>

                <P>
                    The Transformer uses the <em>exact same trick</em>. After attention,
                    add the original input back. After the FFN, add the input back again.
                    Two residual connections &mdash; two highways &mdash; keeping the signal alive.
                    Toggle below to see what happens <em>without</em> them.
                </P>

                {/* ═══ V40 — HighwayReturnsViz (with/without toggle) ═══ */}
                <FadeInView className="my-10 md:my-14">
                    <Suspense fallback={<SectionSkeleton />}>
                        <HighwayReturnsViz />
                    </Suspense>
                </FadeInView>

                {/* ══════════════════════════════════════════════
                   BEAT 4 — LAYER NORMALIZATION
                   ══════════════════════════════════════════════ */}

                <NarrativeDivider />

                <P>
                    There&apos;s one more piece. As values flow through attention and FFN,
                    some numbers grow very large while others shrink to near zero.
                    This makes training unstable &mdash; like trying to balance on a tightrope
                    while the wind keeps changing speed.
                </P>

                <P>
                    The fix: <Highlight color="amber">Layer Normalization</Highlight>.
                    Before each major operation, we normalize every token&apos;s values &mdash;
                    centering them and scaling them to a consistent range. It&apos;s like
                    taking a deep breath before each step. The values stay calm, the gradients
                    stay healthy, and training stays stable.
                </P>

                {/* ═══ V41 — LayerNormViz ═══ */}
                <FadeInView className="my-10 md:my-14">
                    <Suspense fallback={<SectionSkeleton />}>
                        <LayerNormViz />
                    </Suspense>
                </FadeInView>

                {/* ══════════════════════════════════════════════
                   BEAT 5 — ASSEMBLY CHECKLIST
                   ══════════════════════════════════════════════ */}

                <NarrativeDivider />

                <P>
                    Let&apos;s take stock. You now have every piece of the Transformer block:
                </P>

                <div className="my-6 max-w-md mx-auto space-y-3">
                    {[
                        { label: "Self-Attention", desc: "tokens listen to each other", color: "#22d3ee" },
                        { label: "Feed-Forward Network", desc: "each token thinks privately", color: "#fbbf24" },
                        { label: "Residual Connections", desc: "highway for gradients", color: "#22d3ee" },
                        { label: "Layer Normalization", desc: "keep values stable", color: "#fbbf24" },
                    ].map((item) => (
                        <motion.div
                            key={item.label}
                            className="pl-3 py-1"
                            style={{ borderLeft: `2px solid ${item.color}40` }}
                            initial={{ opacity: 0, x: -8 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 120, damping: 14 }}
                        >
                            <span className="text-[14px] font-semibold" style={{ color: item.color }}>{item.label}</span>
                            <span className="text-[14px] text-white/30"> &mdash; {item.desc}</span>
                        </motion.div>
                    ))}
                </div>

                <P>
                    These four components &mdash; arranged in the right order &mdash;
                    form one <Highlight>Transformer block</Highlight>. But the order matters.
                </P>

                {/* ══════════════════════════════════════════════
                   BEAT 5b — ORDER MATTERS (Improvement #4)
                   ══════════════════════════════════════════════ */}

                <P>
                    Why normalize <em>first</em>? Because attention compares values &mdash;
                    if some are huge and others tiny, the comparison is unfair. Normalization
                    levels the playing field before each operation.
                </P>

                <P>
                    Why add the original back <em>after</em> attention? Because attention
                    might lose important information while focusing on relationships. The
                    residual connection ensures nothing valuable gets thrown away.
                </P>

                <P>
                    Why normalize <em>again</em> before the FFN? Same reason &mdash; keep
                    the inputs balanced for processing. Each operation gets clean, stable input.
                    The recipe: <Highlight>normalize, attend, add; normalize, FFN, add</Highlight>.
                    Now put that knowledge to the test.
                </P>

                {/* ══════════════════════════════════════════════
                   BEAT 6 — HANDS-ON ASSEMBLY
                   ══════════════════════════════════════════════ */}

                {/* ═══ V42 — BlockBuilderViz ⭐⭐ ═══ */}
                <FadeInView className="my-10 md:my-14">
                    <Suspense fallback={<SectionSkeleton />}>
                        <BlockBuilderViz />
                    </Suspense>
                </FadeInView>

                {/* ══════════════════════════════════════════════
                   BEAT 7 — FLAGSHIP: EXPLORE THE BLOCK
                   ══════════════════════════════════════════════ */}

                <NarrativeDivider />

                <P>
                    Want to go deeper? <Highlight>Explore the block</Highlight> component by component.
                    Click any piece to zoom in and see exactly what happens inside.
                </P>

                {/* ═══ FLAGSHIP — TransformerBlockExplorerViz ═══ */}
                <FadeInView className="my-10 md:my-14">
                    <Suspense fallback={<SectionSkeleton />}>
                        <TransformerBlockExplorerViz />
                    </Suspense>
                </FadeInView>

                <NarrativeDivider />

                <P>
                    Let&apos;s zoom out and see the <em>net effect</em> of one complete block.
                    What do tokens look like before entering vs. after emerging?
                </P>

                {/* ═══ V44 — BeforeAfterBlockViz ⭐⭐ ═══ */}
                <FadeInView className="my-10 md:my-14">
                    <Suspense fallback={<SectionSkeleton />}>
                        <BeforeAfterBlockViz />
                    </Suspense>
                </FadeInView>

                <P>
                    Before we move on, here&apos;s your <Highlight>reference card</Highlight>.
                    Click any component to see what it does and where it was covered.
                </P>

                {/* ═══ V45 — BlockBlueprintViz ═══ */}
                <FadeInView className="my-10 md:my-14">
                    <Suspense fallback={<SectionSkeleton />}>
                        <BlockBlueprintViz />
                    </Suspense>
                </FadeInView>

                {/* ══════════════════════════════════════════════
                   BEAT 10 — MONSTER ASSEMBLY (Improvement #5)
                   ══════════════════════════════════════════════ */}

                <FadeInView className="my-12 md:my-16">
                    <div className="flex flex-col items-center gap-4">
                        {/* Assembly animation: 4 icons fly in and lock together */}
                        <div className="flex items-center justify-center gap-2">
                            {[
                                { icon: "⚖️", color: "#a78bfa", delay: 0, from: { x: -60, y: -30 } },
                                { icon: "👂", color: "#22d3ee", delay: 0.15, from: { x: 60, y: -30 } },
                                { icon: "⊕", color: "#34d399", delay: 0.3, from: { x: -60, y: 30 } },
                                { icon: "🧠", color: "#fbbf24", delay: 0.45, from: { x: 60, y: 30 } },
                            ].map((part) => (
                                <motion.div
                                    key={part.icon}
                                    className="w-14 h-14 rounded-xl flex items-center justify-center text-[22px]"
                                    style={{
                                        background: `${part.color}10`,
                                        border: `1.5px solid ${part.color}30`,
                                        boxShadow: `0 0 20px -4px ${part.color}20`,
                                    }}
                                    initial={{ opacity: 0, x: part.from.x, y: part.from.y, scale: 0.5 }}
                                    whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 200,
                                        damping: 15,
                                        delay: part.delay,
                                    }}
                                >
                                    {part.icon}
                                </motion.div>
                            ))}
                        </div>

                        {/* Glow pulse after assembly */}
                        <motion.div
                            className="w-64 h-1 rounded-full"
                            style={{
                                background: "linear-gradient(90deg, #a78bfa40, #22d3ee40, #34d39940, #fbbf2440)",
                            }}
                            initial={{ opacity: 0, scaleX: 0 }}
                            whileInView={{ opacity: 1, scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.7, type: "spring", stiffness: 100, damping: 14 }}
                        />

                        {/* Monster text */}
                        <motion.p
                            className="text-center text-lg md:text-xl font-bold bg-gradient-to-r from-cyan-400 via-amber-300 to-emerald-400 bg-clip-text text-transparent"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.9, duration: 0.5 }}
                        >
                            👾 I am assembled. Attention to hear. FFN to think.
                            Residuals to remember. Normalization to stay calm.
                            I am a Transformer block.
                        </motion.p>
                    </div>
                </FadeInView>
            </Section>

            <SectionBreak />
            <MonsterInterlude>
                One block is powerful. But what happens when we stack many blocks?
                Each layer refines the representation further.
            </MonsterInterlude>

            {/* ═══════════════════════════════════════════════════
               §08 — THE FULL ARCHITECTURE
               ═══════════════════════════════════════════════════ */}
            <Section id="transformer-08">
                <SectionLabel number="08" label="The Full Architecture" />
                <SectionAnchor id="transformer-08"><Heading>The Full Architecture</Heading></SectionAnchor>

                {/* ── Beat 1: The problem — one block isn't enough ── */}
                <Lead>
                    One Transformer block is powerful. It can listen, think, and stabilize.
                    But is one pass through attention and a feed-forward network <Highlight>really enough</Highlight> to understand language?
                </Lead>

                <P>
                    Think about it. In a single block, each token gets <em>one chance</em> to look
                    at the other tokens. One round of questions. One round of thinking. That&apos;s like
                    reading a sentence once and claiming you understand everything about it.
                </P>

                <P>
                    Language is layered. First you need to figure out which words are
                    next to each other (<Highlight color="amber">syntax</Highlight>).
                    Then you need to figure out which words <em>relate</em> to each
                    other (<Highlight color="violet">semantics</Highlight>).
                    Then you need to understand what the whole sentence <em>means</em> (<Highlight color="emerald">context</Highlight>).
                    One block can&apos;t do all three.
                </P>

                <NarrativeDivider />

                {/* ── Beat 2: Discovery — what if we stack? ── */}
                <P>
                    But wait &mdash; we&apos;ve seen this trick before. When the MLP had one hidden layer
                    and couldn&apos;t learn complex patterns, what did we do? <Highlight>We added more layers.</Highlight> Each
                    layer built on the previous one, extracting increasingly abstract features.
                </P>

                <P>
                    What if we do the same thing here? Take the output of one Transformer block
                    and feed it directly into another one. The second block gets to ask <em>new questions</em> about
                    representations that are already context-aware. The third block refines even further.
                </P>

                <Callout icon={Layers} title="The insight">
                    Stack identical Transformer blocks. Block 1 captures local patterns.
                    Block 3 captures syntax. Block 6 captures abstract meaning.
                    Same architecture, repeated — creating deeper and deeper understanding.
                </Callout>

                {/* ═══ V46 — Layer Evolution ═══ */}
                <FadeInView className="my-10 md:my-14"><Suspense fallback={<SectionSkeleton />}><LayerEvolutionViz /></Suspense></FadeInView>

                <NarrativeDivider />

                {/* ── Beat 3: The full picture ── */}
                <P>
                    Now let&apos;s zoom out and see the complete architecture. From raw text to predictions,
                    here&apos;s every piece working together:
                </P>

                <P>
                    <Highlight>Inputs</Highlight> <StyledArrow />
                    <Highlight color="rose">Embedding</Highlight> (words → vectors) <StyledArrow />
                    <Highlight color="amber">+ Positional Encoding</Highlight> (add position info) <StyledArrow />
                    <Highlight color="violet">Transformer Block × N</Highlight> (attention + FFN, repeated) <StyledArrow />
                    <Highlight color="emerald">Linear Head</Highlight> (vectors → vocabulary scores) <StyledArrow />
                    <Highlight>Softmax</Highlight> (scores → probabilities) <StyledArrow />
                    <strong className="text-white/80">Output: next-word prediction</strong>
                </P>

                <P>
                    The embedding turns each word into a vector of numbers &mdash; its &quot;meaning.&quot;
                    The positional encoding adds &quot;where am I in the sentence?&quot;
                    Then the stacked blocks refine these representations, layer after layer.
                    Finally, the <Highlight color="violet">Linear Head</Highlight> does the <em>opposite</em> of
                    the embedding: it takes each vector and produces a score for every word in the vocabulary.
                    Softmax turns those scores into probabilities. The highest probability wins.
                </P>

                {/* ═══ V47 — Architecture Tower ═══ */}
                <FadeInView className="my-10 md:my-14"><Suspense fallback={<SectionSkeleton />}><ArchitectureTowerViz /></Suspense></FadeInView>

                <NarrativeDivider />

                {/* ── Beat 4: Does depth help? ── */}
                <P>
                    But does stacking more blocks actually help? Or does it just waste computation?
                </P>

                <P>
                    Real models tell the story. GPT-2 (2019) used <strong className="text-white/60">12 blocks</strong> and
                    could write decent paragraphs. GPT-3 (2020) used <strong className="text-white/60">96 blocks</strong> and
                    could write entire essays. More depth means more rounds of refinement,
                    more chances to capture subtle patterns in language.
                </P>

                {/* ═══ V48 — Depth vs Quality ═══ */}
                <FadeInView className="my-10 md:my-14"><Suspense fallback={<SectionSkeleton />}><DepthVsQualityViz /></Suspense></FadeInView>

                <P>
                    The number of blocks is one of the most important design choices.
                    More blocks = more parameters = more compute needed.
                    But the payoff is enormous: each additional block lets the model
                    understand language at a <Highlight color="emerald">deeper level</Highlight>.
                </P>

                <MonsterStatus>
                    👾 I&apos;m no longer a single block. I&apos;m a tower of blocks, each one
                    refining my understanding. Layer by layer, I see more.
                </MonsterStatus>
            </Section>

            <SectionBreak />
            <MonsterInterlude>
                The architecture is complete. But there&apos;s a problem hiding in the training process.
                The model can see the future &mdash; and that&apos;s cheating.
            </MonsterInterlude>

            {/* ═══════════════════════════════════════════════════
               §09 — TEACHING IT TO WRITE
               ═══════════════════════════════════════════════════ */}
            <Section id="transformer-09">
                <SectionLabel number="09" label="Teaching It To Write" />
                <SectionAnchor id="transformer-09"><Heading>Teaching It To Write</Heading></SectionAnchor>

                {/* ── Beat 1: The cheating problem ── */}
                <Lead>
                    The architecture is built. Now we need to <Highlight>train</Highlight> it.
                    But there&apos;s a sneaky problem: during training, the model can see the entire sentence at once.
                </Lead>

                <P>
                    Imagine you&apos;re taking a test, and the answer sheet is lying right next to you.
                    Would you actually <em>think</em> about the questions? Of course not &mdash; you&apos;d just copy.
                </P>

                <P>
                    That&apos;s exactly what happens here. The model is supposed to predict word 5 based on words 1&ndash;4.
                    But during training, word 5 is <em>right there</em> in the input. The attention mechanism
                    can just look at it directly. <Highlight color="rose">100% accuracy, zero learning.</Highlight> It&apos;s cheating.
                </P>

                {/* ═══ V49 — The Cheating Problem ═══ */}
                <FadeInView className="my-10 md:my-14"><Suspense fallback={<SectionSkeleton />}><CheatingProblemViz /></Suspense></FadeInView>

                <NarrativeDivider />

                {/* ── Beat 2: Discovery — the causal mask ── */}
                <P>
                    So how do we stop the cheating? We need a rule:
                    when processing word N, the model can <em>only</em> see words 1 through N&minus;1.
                    The future must be invisible.
                </P>

                <P>
                    Remember how attention works? Each token computes scores against all other tokens,
                    then softmax turns those scores into weights. What if, before softmax,
                    we set all the scores for <Highlight color="amber">future tokens to negative infinity</Highlight>?
                </P>

                <P>
                    Softmax turns &minus;∞ into exactly 0. Those future tokens become completely invisible.
                    The model literally cannot see them. It&apos;s forced to actually <em>predict</em>.
                </P>

                <Callout icon={Eye} title="The causal mask">
                    An attention matrix where the upper triangle is blacked out.
                    Token 1 can only see itself. Token 2 sees tokens 1&ndash;2. Token 5 sees tokens 1&ndash;5.
                    The mask grows row by row — like a growing triangle of visibility.
                </Callout>

                {/* ═══ V50 — Causal Mask ═══ */}
                <FadeInView className="my-10 md:my-14"><Suspense fallback={<SectionSkeleton />}><CausalMaskViz /></Suspense></FadeInView>

                {/* ═══ V51 — Growing Masks ═══ */}
                <FadeInView className="my-10 md:my-14"><Suspense fallback={<SectionSkeleton />}><GrowingMasksViz /></Suspense></FadeInView>

                <NarrativeDivider />

                {/* ── Beat 3: Training efficiency ── */}
                <P>
                    Here&apos;s the beautiful part. With the mask in place,
                    <em> every position</em> in the sequence becomes a valid training example.
                </P>

                <P>
                    Think about it: position 1 predicts word 2. Position 2 predicts word 3.
                    Position 99 predicts word 100. One sequence of 100 tokens gives
                    us <Highlight color="emerald">100 training examples simultaneously</Highlight>.
                    Compare that to the MLP, where one input = one prediction. The Transformer
                    is massively more efficient.
                </P>

                {/* ═══ V52 — Training Efficiency ═══ */}
                <FadeInView className="my-10 md:my-14"><Suspense fallback={<SectionSkeleton />}><TrainingEfficiencyViz /></Suspense></FadeInView>

                {/* ═══ V53 — Training Dashboard ═══ */}
                <FadeInView className="my-10 md:my-14"><Suspense fallback={<SectionSkeleton />}><TrainingDashboardViz /></Suspense></FadeInView>

                <NarrativeDivider />

                {/* ── Beat 4: Generation ── */}
                <P>
                    Once trained, generation works step by step.
                    Give the model a prompt: <Highlight>&quot;The professor&quot;</Highlight>.
                    It predicts the next word: <Highlight color="amber">&quot;published&quot;</Highlight>.
                    Add that word to the sequence. Now the input is <em>&quot;The professor published&quot;</em>.
                    Predict again: <Highlight color="violet">&quot;the&quot;</Highlight>. And again. And again.
                </P>

                <P>
                    Each new token gets to <em>attend to the entire growing context</em>.
                    Word 50 can look back at all 49 previous words to decide what comes next.
                    This is the power of the Transformer: it doesn&apos;t just remember the last few words.
                    It remembers <Highlight color="emerald">everything</Highlight>.
                </P>

                {/* ═══ V55 — Growing Context ═══ */}
                <FadeInView className="my-10 md:my-14"><Suspense fallback={<SectionSkeleton />}><GrowingContextViz /></Suspense></FadeInView>

                <MonsterStatus gradient="cyan-amber">
                    👾 I can generate! Each word I write, I look back at everything I said before.
                    I don&apos;t just predict — I build, one token at a time, on a foundation of full context.
                </MonsterStatus>
            </Section>

            <SectionBreak />
            <MonsterInterlude>
                It generates. Token by token, drawing on everything it has seen before.
                Let&apos;s see how far we&apos;ve come.
            </MonsterInterlude>

            {/* ═══════════════════════════════════════════════════
               §10 — THE MONSTER THAT CAN SEE EVERYTHING
               ═══════════════════════════════════════════════════ */}
            <Section id="transformer-10">
                <SectionLabel number="10" label="The Monster That Can See Everything" />
                <SectionAnchor id="transformer-10"><Heading>The Monster That Can See Everything</Heading></SectionAnchor>
                <Lead>
                    From counting pairs to understanding connections. Five models, each more capable than the last.
                    Look at what you built.
                </Lead>

                <P>
                    The Transformer didn&apos;t just solve the MLP&apos;s blind spot — it created an entirely new
                    way to process information. Parallel, dynamic, scalable. The same architecture that powers
                    GPT, Claude, Gemini, and every modern language model.
                </P>

                {/* ═══ VISUALIZERS: V56-V60 ═══ */}

                <MonsterStatus gradient="cyan-amber">
                    👾 I started counting pairs. Then I learned patterns. Then you gave me eyes. Then a brain.
                    But I was blind to connections. Now I can see everything. I can ask questions. I can find answers.
                    I can generate, one token at a time, drawing on everything I&apos;ve ever seen before.
                    But I&apos;m still small. Still trained on a tiny dataset. What happens when I see the entire internet?
                </MonsterStatus>

                <PullQuote>
                    In the next chapter: tokenization, RLHF, fine-tuning, and how this architecture
                    powers GPT, Claude, and Gemini.
                </PullQuote>
            </Section>

        </article>
    );
}

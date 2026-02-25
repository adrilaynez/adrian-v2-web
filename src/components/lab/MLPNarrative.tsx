"use client";

import { lazy, Suspense, useState } from "react";
import { useRouter } from "next/navigation";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ArrowDown, Beaker, BookOpen, BrainCircuit, FlaskConical, Lightbulb } from "lucide-react";

import { ContinueToast } from "@/components/lab/ContinueToast";
import { Term } from "@/components/lab/GlossaryTooltip";
import { KeyTakeaway } from "@/components/lab/KeyTakeaway";
import { LazySection, SectionSkeleton } from "@/components/lab/LazySection";
import { ModeToggle } from "@/components/lab/ModeToggle";
import { SectionAnchor } from "@/components/lab/SectionAnchor";
import { SectionProgressBar } from "@/components/lab/SectionProgressBar";
import { useLabMode } from "@/context/LabModeContext";
import type { UseMLPGridReturn } from "@/hooks/useMLPGrid";
import { useProgressTracker } from "@/hooks/useProgressTracker";
import { useI18n } from "@/i18n/context";

/* ─── Lazy-loaded interactive visualizers ─── */
const BatchNormEffectVisualizer = lazy(() => import("@/components/lab/mlp/BatchNormEffectVisualizer").then(m => ({ default: m.BatchNormEffectVisualizer })));
const ConcatenationBottleneckVisualizer = lazy(() => import("@/components/lab/mlp/ConcatenationBottleneckVisualizer").then(m => ({ default: m.ConcatenationBottleneckVisualizer })));
const ContextWindowVisualizer = lazy(() => import("@/components/lab/mlp/ContextWindowVisualizer").then(m => ({ default: m.ContextWindowVisualizer })));
const GradientFlowVisualizer = lazy(() => import("@/components/lab/mlp/GradientFlowVisualizer").then(m => ({ default: m.GradientFlowVisualizer })));
const InitializationSensitivityVisualizer = lazy(() => import("@/components/lab/mlp/InitializationSensitivityVisualizer").then(m => ({ default: m.InitializationSensitivityVisualizer })));
const LongRangeDependencyDemo = lazy(() => import("@/components/lab/mlp/LongRangeDependencyDemo").then(m => ({ default: m.LongRangeDependencyDemo })));
const LossIntuitionVisualizer = lazy(() => import("@/components/lab/mlp/LossIntuitionVisualizer").then(m => ({ default: m.LossIntuitionVisualizer })));
const MLPArchitectureDiagram = lazy(() => import("@/components/lab/mlp/MLPArchitectureDiagram").then(m => ({ default: m.MLPArchitectureDiagram })));
const MLPGuidedExperiments = lazy(() => import("@/components/lab/mlp/MLPGuidedExperiments").then(m => ({ default: m.MLPGuidedExperiments })));
const MLPHyperparameterExplorer = lazy(() => import("@/components/lab/mlp/MLPHyperparameterExplorer").then(m => ({ default: m.MLPHyperparameterExplorer })));
const MLPNonLinearityVisualizer = lazy(() => import("@/components/lab/mlp/MLPNonLinearityVisualizer").then(m => ({ default: m.MLPNonLinearityVisualizer })));
const MLPPipelineVisualizer = lazy(() => import("@/components/lab/mlp/MLPPipelineVisualizer").then(m => ({ default: m.MLPPipelineVisualizer })));
const OneHotDimensionalityVisual = lazy(() => import("@/components/lab/mlp/OneHotDimensionalityVisual").then(m => ({ default: m.OneHotDimensionalityVisual })));
const PedagogicalEmbeddingVisualizer = lazy(() => import("@/components/lab/mlp/PedagogicalEmbeddingVisualizer").then(m => ({ default: m.PedagogicalEmbeddingVisualizer })));
const PositionSensitivityVisualizer = lazy(() => import("@/components/lab/mlp/PositionSensitivityVisualizer").then(m => ({ default: m.PositionSensitivityVisualizer })));
const SoftmaxTemperatureVisualizer = lazy(() => import("@/components/lab/mlp/SoftmaxTemperatureVisualizer").then(m => ({ default: m.SoftmaxTemperatureVisualizer })));
const ThinkFirst = lazy(() => import("@/components/lab/mlp/ThinkFirst").then(m => ({ default: m.ThinkFirst })));

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

/* ─── Accent-bound wrappers ─── */
const NA: NarrativeAccent = "violet";
const SectionLabel = (p: { number: string; label: string }) => <_SectionLabel accent={NA} {...p} />;
const Highlight = ({ color, ...p }: { children: React.ReactNode; color?: HighlightColor; tooltip?: string }) => <_Highlight color={color ?? NA} {...p} />;
const Callout = ({ accent, ...p }: Parameters<typeof _Callout>[0]) => <_Callout accent={accent ?? NA} {...p} />;
const FormulaBlock = (p: { formula: string; caption: string }) => <_FormulaBlock accent={NA} {...p} />;
const PullQuote = ({ children }: { children: React.ReactNode }) => <_PullQuote accent={NA}>{children}</_PullQuote>;

export interface MLPNarrativeProps {
    mlpGrid: UseMLPGridReturn;
}

/* ─── MLP-specific local components ─── */

function TrainingChallengePanel({ title, preview, defaultOpen = false, children }: { title: string; preview: string; defaultOpen?: boolean; children: React.ReactNode }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            className="my-6 rounded-xl border border-[var(--lab-border)] bg-[var(--lab-card)] overflow-hidden"
        >
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between w-full p-4 text-left hover:bg-[var(--lab-card)] transition-colors"
                aria-expanded={open}
            >
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-mono font-bold text-violet-300 mb-1">{title}</h4>
                    <p className="text-xs text-[var(--lab-text-subtle)]">{preview}</p>
                </div>
                <motion.div
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-3 shrink-0"
                >
                    <ArrowDown className="w-4 h-4 text-[var(--lab-text-subtle)]" />
                </motion.div>
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 pt-2 border-t border-[var(--lab-border)]">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

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
        <motion.figure
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="my-12 md:my-16 -mx-4 sm:mx-0"
        >
            <div className="rounded-2xl border border-[var(--lab-border)] bg-[var(--lab-card)] overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-3 border-b border-[var(--lab-border)] bg-[var(--lab-card)]">
                    <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[var(--lab-text-subtle)]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[var(--lab-border)]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-violet-400/40" />
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
        </motion.figure>
    );
}

/* ─────────────────────────────────────────────
   Inline visual: One-hot vs Embedding comparison
   ───────────────────────────────────────────── */

function OneHotVsEmbeddingVisual() {
    const { t } = useI18n();
    const vocab = ["the", "cat", "sat", "on", "mat"];

    return (
        <div className="grid md:grid-cols-2 gap-6 my-10">
            <div className="bg-[var(--lab-viz-bg)] border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 rounded-full bg-rose-400" />
                    <h3 className="text-lg font-bold text-white">{t("models.mlp.narrative.oneHot.title")}</h3>
                </div>
                <div className="space-y-2 mb-4">
                    {vocab.map((word, i) => (
                        <div key={word} className="flex items-center gap-3">
                            <span className="text-xs font-mono text-violet-300 w-10">{word}</span>
                            <div className="flex gap-0.5">
                                {vocab.map((_, j) => (
                                    <span
                                        key={j}
                                        className={`w-6 h-6 rounded text-[10px] font-mono flex items-center justify-center ${i === j
                                            ? "bg-rose-500/30 text-rose-300 border border-rose-500/40"
                                            : "bg-white/[0.03] text-white/20 border border-white/[0.06]"
                                            }`}
                                    >
                                        {i === j ? "1" : "0"}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <p className="text-xs text-white/40 leading-relaxed">{t("models.mlp.narrative.oneHot.sparse")}</p>
            </div>
            <div className="bg-[var(--lab-viz-bg)] border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <h3 className="text-lg font-bold text-white">{t("models.mlp.narrative.oneHot.learnedTitle")}</h3>
                </div>
                <div className="space-y-2 mb-4">
                    {[
                        { word: "the", vals: [0.12, -0.45, 0.78] },
                        { word: "cat", vals: [0.91, 0.34, -0.22] },
                        { word: "sat", vals: [0.67, 0.12, 0.55] },
                        { word: "on", vals: [-0.08, -0.61, 0.33] },
                        { word: "mat", vals: [0.85, 0.29, -0.18] },
                    ].map(({ word, vals }) => (
                        <div key={word} className="flex items-center gap-3">
                            <span className="text-xs font-mono text-violet-300 w-10">{word}</span>
                            <div className="flex gap-0.5">
                                {vals.map((v, j) => (
                                    <span
                                        key={j}
                                        className="w-12 h-6 rounded text-[10px] font-mono flex items-center justify-center bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                                    >
                                        {v.toFixed(2)}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <p className="text-xs text-white/40 leading-relaxed">{t("models.mlp.narrative.oneHot.dense")}</p>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Main narrative component
   ───────────────────────────────────────────── */

export function MLPNarrative({ mlpGrid }: MLPNarrativeProps) {
    const router = useRouter();
    const { setMode } = useLabMode();
    const { t } = useI18n();
    const { hasStoredProgress, storedSection, clearProgress } = useProgressTracker("mlp");

    return (
        <article className="max-w-[920px] mx-auto px-6 pt-8 pb-24">
            <ContinueToast
                accent="violet"
                hasStoredProgress={hasStoredProgress}
                storedSection={storedSection}
                clearProgress={clearProgress}
                sectionNames={{
                    "mlp-00": "From Blocks to Language",
                    "mlp-01": "Feeding Language to a NN",
                    "mlp-02": "The One-Hot Problem",
                    "mlp-03": "Word Embeddings",
                    "mlp-04": "Exploring Configurations",
                    "mlp-05": "Limitations",
                    "mlp-06": "Training Challenges",
                    "mlp-07": "The Path Ahead",
                }}
            />
            <SectionProgressBar
                sections={[
                    { id: "mlp-00", label: "00", name: "From Blocks to Language" },
                    { id: "mlp-01", label: "01", name: "Feeding Language" },
                    { id: "mlp-02", label: "02", name: "One-Hot Problem" },
                    { id: "mlp-03", label: "03", name: "Word Embeddings" },
                    { id: "mlp-04", label: "04", name: "Configurations" },
                    { id: "mlp-05", label: "05", name: "Limitations" },
                    { id: "mlp-06", label: "06", name: "Training Challenges" },
                    { id: "mlp-07", label: "07", name: "Path Ahead" },
                ]}
                accent="violet"
            />

            {/* ───────────────────── HERO ───────────────────── */}
            <header className="text-center mb-24 md:mb-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <span className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-violet-400/60 mb-6">
                        <BookOpen className="w-3.5 h-3.5" />
                        {t("models.mlp.narrative.hero.eyebrow")}
                    </span>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[var(--lab-text)] mb-6">
                        {t("models.mlp.narrative.hero.titlePrefix")}{" "}
                        <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-violet-400 bg-clip-text text-transparent">
                            {t("models.mlp.narrative.hero.titleHighlight")}
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-[var(--lab-text-subtle)] max-w-xl mx-auto leading-relaxed mb-12">
                        {t("models.mlp.narrative.hero.description")}
                    </p>

                    <p className="text-[11px] font-mono text-[var(--lab-text-subtle)] mb-8">
                        ~20 min read · 12 interactive demos
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

            {/* ─────────── 00 · FROM BUILDING BLOCKS TO LANGUAGE ─────────── */}
            <Section id="mlp-00">
                <SectionLabel number={t("models.mlp.narrative.sections.s00.number")} label={t("models.mlp.narrative.sections.s00.label")} />
                <SectionAnchor id="mlp-00"><Heading>{t("models.mlp.narrative.s00.heading")}</Heading></SectionAnchor>

                <Lead>{t("models.mlp.narrative.s00.lead")}</Lead>

                <P>{t("models.mlp.narrative.s00.p1")}</P>

                <LazySection>
                    <FigureWrapper
                        label={t("models.mlp.narrative.s00.figLabel1")}
                        hint={t("models.mlp.narrative.s00.figHint1")}
                    >
                        <Suspense fallback={<SectionSkeleton />}><MLPArchitectureDiagram /></Suspense>
                    </FigureWrapper>
                </LazySection>

                <P>{t("models.mlp.narrative.s00.p2")}</P>

                <FormulaBlock
                    formula="h = \sigma(W_1 x + b_1), \quad \hat{y} = \text{softmax}(W_2 h + b_2)"
                    caption={t("models.mlp.narrative.s00.formulaCaption")}
                />

                <Callout accent="violet" title={t("models.mlp.narrative.s00.calloutTitle")}>
                    <p>{t("models.mlp.narrative.s00.calloutText")}</p>
                </Callout>

                <Suspense fallback={<SectionSkeleton />}>
                    <ThinkFirst
                        question={t("models.mlp.narrative.thinkFirst.xor.question")}
                        reveal={t("models.mlp.narrative.thinkFirst.xor.reveal")}
                    />
                </Suspense>

                <LazySection>
                    <FigureWrapper
                        label={t("models.mlp.narrative.s00.figLabel2")}
                        hint={t("models.mlp.narrative.s00.figHint2")}
                    >
                        <Suspense fallback={<SectionSkeleton />}><MLPNonLinearityVisualizer /></Suspense>
                    </FigureWrapper>
                </LazySection>
            </Section>

            <SectionBreak />

            {/* ─────────── 01 · FEEDING LANGUAGE TO A NEURAL NETWORK ─────────── */}
            <Section id="mlp-01">
                <SectionLabel number={t("models.mlp.narrative.sections.s01.number")} label={t("models.mlp.narrative.sections.s01.label")} />
                <SectionAnchor id="mlp-01"><Heading>{t("models.mlp.narrative.s01.heading")}</Heading></SectionAnchor>
                <Lead>{t("models.mlp.narrative.s01.lead")}</Lead>
                <P>
                    {t("models.mlp.narrative.s01.p1")}{" "}
                    <Highlight>{t("models.mlp.narrative.s01.p1H1")}</Highlight>
                    {t("models.mlp.narrative.s01.p1Mid")}{" "}
                    <Highlight>{t("models.mlp.narrative.s01.p1H2")}</Highlight>
                    {t("models.mlp.narrative.s01.p1End")}
                </P>
                <FormulaBlock
                    formula="x = [\text{onehot}(t_{i-N}); \ldots; \text{onehot}(t_{i-1})] \in \mathbb{R}^{N \cdot V}"
                    caption={t("models.mlp.narrative.s01.formulaCaption")}
                />
                <Callout icon={AlertTriangle} accent="amber" title={t("models.mlp.narrative.s01.calloutTitle")}>
                    <p>{t("models.mlp.narrative.s01.calloutP1")}</p>
                    <p>{t("models.mlp.narrative.s01.calloutP2")}</p>
                </Callout>
                <LazySection>
                    <FigureWrapper label={t("models.mlp.narrative.s01.figLabel1")} hint={t("models.mlp.narrative.s01.figHint1")}>
                        <Suspense fallback={<SectionSkeleton />}><LossIntuitionVisualizer /></Suspense>
                    </FigureWrapper>
                </LazySection>
                <P>
                    {t("models.mlp.narrative.s01.p2")}{" "}
                    <Highlight color="emerald">{t("models.mlp.narrative.s01.p2H1")}</Highlight>
                    {t("models.mlp.narrative.s01.p2End")}
                </P>
                <P>{t("models.mlp.narrative.s01.p3")}</P>
                <Callout icon={Lightbulb} accent="emerald" title={t("models.mlp.narrative.s01.calloutTitle2")}>
                    <p>{t("models.mlp.narrative.s01.calloutText2")}</p>
                </Callout>
                <LazySection>
                    <FigureWrapper label={t("models.mlp.narrative.s01.figLabel2")} hint={t("models.mlp.narrative.s01.figHint2")}>
                        <Suspense fallback={<SectionSkeleton />}><MLPPipelineVisualizer selectedConfig={mlpGrid.selectedConfig} /></Suspense>
                    </FigureWrapper>
                </LazySection>
            </Section>

            <SectionBreak />

            {/* ─────────── 02 · THE ONE-HOT PROBLEM ─────────── */}
            <Section id="mlp-02">
                <SectionLabel number={t("models.mlp.narrative.sections.s02.number")} label={t("models.mlp.narrative.sections.s02.label")} />
                <SectionAnchor id="mlp-02"><Heading>{t("models.mlp.narrative.s02.heading")}</Heading></SectionAnchor>
                <Lead>{t("models.mlp.narrative.s02.lead")}</Lead>
                <P><Highlight color="rose">{t("models.mlp.narrative.s02.p1H1")}</Highlight>{" "}{t("models.mlp.narrative.s02.p1")}</P>
                <P><Highlight color="rose">{t("models.mlp.narrative.s02.p2H1")}</Highlight>{" "}{t("models.mlp.narrative.s02.p2")}</P>
                <P><Highlight color="rose">{t("models.mlp.narrative.s02.p3H1")}</Highlight>{" "}{t("models.mlp.narrative.s02.p3")}</P>
                <FormulaBlock
                    formula="\|\text{onehot}(\text{cat}) - \text{onehot}(\text{kitten})\|_2 = \sqrt{2} = \|\text{onehot}(\text{cat}) - \text{onehot}(\text{quantum})\|_2"
                    caption={t("models.mlp.narrative.s02.formulaCaption")}
                />
                <Callout icon={AlertTriangle} accent="rose" title={t("models.mlp.narrative.s02.calloutTitle")}>
                    <p>{t("models.mlp.narrative.s02.calloutText")}</p>
                </Callout>

                <LazySection>
                    <FigureWrapper
                        label={t("models.mlp.narrative.s02.figLabel1")}
                        hint={t("models.mlp.narrative.s02.figHint1")}
                    >
                        <Suspense fallback={<SectionSkeleton />}><OneHotDimensionalityVisual /></Suspense>
                    </FigureWrapper>
                </LazySection>
            </Section>

            <SectionBreak />

            {/* ─────────── 03 · THE GAME CHANGER: WORD EMBEDDINGS ─────────── */}
            <Section id="mlp-03">
                <SectionLabel number={t("models.mlp.narrative.sections.s03.number")} label={t("models.mlp.narrative.sections.s03.label")} />
                <SectionAnchor id="mlp-03"><Heading>{t("models.mlp.narrative.s03.heading")}</Heading></SectionAnchor>
                <Lead>{t("models.mlp.narrative.s03.lead")}</Lead>

                <Suspense fallback={<SectionSkeleton />}>
                    <ThinkFirst
                        question={t("models.mlp.narrative.thinkFirst.embedding.question")}
                        reveal={t("models.mlp.narrative.thinkFirst.embedding.reveal")}
                    />
                </Suspense>
                <P>{t("models.mlp.narrative.s03.p1")}</P>
                <FormulaBlock
                    formula="e_t = E[t] = E^\top \cdot \text{onehot}(t) \in \mathbb{R}^D"
                    caption={t("models.mlp.narrative.s03.formulaCaption")}
                />
                <P>
                    {t("models.mlp.narrative.s03.p2")}{" "}
                    <Highlight color="emerald">{t("models.mlp.narrative.s03.p2H1")}</Highlight>
                    {t("models.mlp.narrative.s03.p2End")}
                </P>
                <OneHotVsEmbeddingVisual />
                <P>
                    {t("models.mlp.narrative.s03.p3")}{" "}
                    <Highlight>{t("models.mlp.narrative.s03.p3H1")}</Highlight>
                    {t("models.mlp.narrative.s03.p3End")}
                </P>
                <P>{t("models.mlp.narrative.s03.p4")}</P>
                <PullQuote>{t("models.mlp.narrative.s03.pullQuote")}</PullQuote>
                <LazySection>
                    <FigureWrapper label={t("models.mlp.narrative.s03.figLabel1")} hint={t("models.mlp.narrative.s03.figHint1")}>
                        <Suspense fallback={<SectionSkeleton />}><PedagogicalEmbeddingVisualizer /></Suspense>
                    </FigureWrapper>
                </LazySection>

                <KeyTakeaway accent="violet">
                    <Term word="embedding">Embeddings</Term> replace wasteful <Term word="one-hot encoding">one-hot vectors</Term> with dense, learned representations where similar tokens get similar vectors. This is the key insight that makes <Term word="MLP">MLPs</Term> powerful for language.
                </KeyTakeaway>
            </Section>

            <SectionBreak />

            {/* ─────────── 04 · EXPLORING CONFIGURATIONS ─────────── */}
            <Section id="mlp-04">
                <SectionLabel number={t("models.mlp.narrative.sections.s04.number")} label={t("models.mlp.narrative.sections.s04.label")} />
                <SectionAnchor id="mlp-04"><Heading>{t("models.mlp.narrative.s04.heading")}</Heading></SectionAnchor>
                <Lead>{t("models.mlp.narrative.s04.lead")}</Lead>

                <Suspense fallback={<SectionSkeleton />}>
                    <ThinkFirst
                        question={t("models.mlp.narrative.thinkFirst.hyperparams.question")}
                        reveal={t("models.mlp.narrative.thinkFirst.hyperparams.reveal")}
                    />
                </Suspense>
                <P>
                    {t("models.mlp.narrative.s04.p1")}{" "}
                    <Highlight>{t("models.mlp.narrative.s04.p1H1")}</Highlight>
                    {t("models.mlp.narrative.s04.p1Mid1")}{" "}
                    <Highlight>{t("models.mlp.narrative.s04.p1H2")}</Highlight>
                    {t("models.mlp.narrative.s04.p1Mid2")}{" "}
                    <Highlight>{t("models.mlp.narrative.s04.p1H3")}</Highlight>
                    {t("models.mlp.narrative.s04.p1End")}
                </P>
                <P>{t("models.mlp.narrative.s04.p2")}</P>
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3 my-8"
                >
                    {(["embDim", "hiddenSize", "numLayers", "contextWindow"] as const).map((key) => (
                        <div key={key} className="rounded-lg border border-[var(--lab-border)] bg-[var(--lab-card)] p-4">
                            <p className="text-xs font-mono font-bold text-violet-400/70 mb-1.5">{t(`models.mlp.narrative.s04.hyperparamCards.${key}.title`)}</p>
                            <p className="text-sm text-[var(--lab-text-muted)] leading-relaxed">{t(`models.mlp.narrative.s04.hyperparamCards.${key}.desc`)}</p>
                        </div>
                    ))}
                </motion.div>
                <LazySection>
                    <FigureWrapper label={t("models.mlp.narrative.s04.figLabel1")} hint={t("models.mlp.narrative.s04.figHint1")}>
                        <Suspense fallback={<SectionSkeleton />}><SoftmaxTemperatureVisualizer /></Suspense>
                    </FigureWrapper>
                </LazySection>
                <Callout title={t("models.mlp.narrative.s04.calloutTitle")}>
                    <p>{t("models.mlp.narrative.s04.calloutText")}</p>
                </Callout>

                <Suspense fallback={<SectionSkeleton />}><MLPGuidedExperiments /></Suspense>

                <LazySection>
                    <FigureWrapper label={t("models.mlp.narrative.s04.figLabel2")} hint={t("models.mlp.narrative.s04.figHint2")}>
                        <Suspense fallback={<SectionSkeleton />}>
                            <MLPHyperparameterExplorer
                                configs={mlpGrid.configs}
                                selectedConfig={mlpGrid.selectedConfig}
                                onSelectClosest={mlpGrid.selectClosest}
                                timeline={mlpGrid.timeline}
                                timelineLoading={mlpGrid.timelineLoading}
                                onFetchTimeline={mlpGrid.fetchTimelineData}
                                generation={mlpGrid.generation}
                                generationLoading={mlpGrid.generationLoading}
                                onGenerate={mlpGrid.generateText}
                                gridLoading={mlpGrid.gridLoading}
                                gridError={mlpGrid.gridError}
                                isNarrativeMode={true}
                            />
                        </Suspense>
                    </FigureWrapper>
                </LazySection>
                <P>{t("models.mlp.narrative.s04.p3")}</P>
            </Section>

            <SectionBreak />

            {/* ─────────── 05 · LIMITATIONS OF MLP + EMBEDDINGS ─────────── */}
            <Section id="mlp-05">
                <SectionLabel number={t("models.mlp.narrative.sections.s05.number")} label={t("models.mlp.narrative.sections.s05.label")} />
                <SectionAnchor id="mlp-05"><Heading>{t("models.mlp.narrative.s05.heading")}</Heading></SectionAnchor>

                <Lead>{t("models.mlp.narrative.s05.lead")}</Lead>

                {/* ── Limitation 1: Fixed context window ── */}
                <P>
                    <Highlight color="amber">{t("models.mlp.narrative.s05.p1H1")}</Highlight>{" "}
                    {t("models.mlp.narrative.s05.p1")}
                </P>

                <P>{t("models.mlp.narrative.s05.p2")}</P>

                <Suspense fallback={<SectionSkeleton />}>
                    <ThinkFirst
                        question={t("models.mlp.narrative.thinkFirst.contextWindow.question")}
                        reveal={t("models.mlp.narrative.thinkFirst.contextWindow.reveal")}
                    />
                </Suspense>

                <LazySection>
                    <FigureWrapper
                        label={t("models.mlp.narrative.s05.figLabel1")}
                        hint={t("models.mlp.narrative.s05.figHint1")}
                    >
                        <Suspense fallback={<SectionSkeleton />}><ContextWindowVisualizer /></Suspense>
                    </FigureWrapper>
                </LazySection>

                {/* ── Limitation 2: Long-range dependencies ── */}
                <P>
                    <Highlight color="amber">{t("models.mlp.narrative.s05.p3H1")}</Highlight>{" "}
                    {t("models.mlp.narrative.s05.p3")}
                </P>

                <LazySection>
                    <FigureWrapper
                        label={t("models.mlp.narrative.s05.figLabel2")}
                        hint={t("models.mlp.narrative.s05.figHint2")}
                    >
                        <Suspense fallback={<SectionSkeleton />}><LongRangeDependencyDemo /></Suspense>
                    </FigureWrapper>
                </LazySection>

                {/* ── Limitation 3: Position-dependent meaning ── */}
                <P>
                    <Highlight color="amber">{t("models.mlp.narrative.s05.p4H1")}</Highlight>{" "}
                    {t("models.mlp.narrative.s05.p4")}
                </P>

                <LazySection>
                    <FigureWrapper
                        label={t("models.mlp.narrative.s05.figLabel3")}
                        hint={t("models.mlp.narrative.s05.figHint3")}
                    >
                        <Suspense fallback={<SectionSkeleton />}><PositionSensitivityVisualizer /></Suspense>
                    </FigureWrapper>
                </LazySection>

                {/* ── Limitation 4: Concatenation bottleneck ── */}
                <P>
                    <Highlight color="amber">{t("models.mlp.narrative.s05.p5H1")}</Highlight>{" "}
                    {t("models.mlp.narrative.s05.p5")}
                </P>

                <LazySection>
                    <FigureWrapper
                        label={t("models.mlp.narrative.s05.figLabel4")}
                        hint={t("models.mlp.narrative.s05.figHint4")}
                    >
                        <Suspense fallback={<SectionSkeleton />}><ConcatenationBottleneckVisualizer /></Suspense>
                    </FigureWrapper>
                </LazySection>

                <Callout icon={AlertTriangle} accent="amber" title={t("models.mlp.narrative.s05.calloutTitle")}>
                    <p>{t("models.mlp.narrative.s05.calloutText")}</p>
                </Callout>

                <KeyTakeaway accent="violet">
                    MLPs have a fixed <Term word="context window">context window</Term>, can&apos;t handle long-range dependencies, and treat position as implicit. These limitations point toward architectures that can attend to any part of the input.
                </KeyTakeaway>
            </Section>

            <SectionBreak />

            {/* ─────────── 06 · TRAINING CHALLENGES ─────────── */}
            <Section id="mlp-06">
                <SectionLabel number={t("models.mlp.narrative.sections.s06.number")} label={t("models.mlp.narrative.sections.s06.label")} />
                <SectionAnchor id="mlp-06"><Heading>{t("models.mlp.narrative.s06.heading")}</Heading></SectionAnchor>
                <Lead>{t("models.mlp.narrative.s06.lead")}</Lead>

                <TrainingChallengePanel
                    title={t("models.mlp.narrative.s06.panels.initialization.title")}
                    preview={t("models.mlp.narrative.s06.panels.initialization.preview")}
                    defaultOpen={true}
                >
                    <P><Highlight color="rose">{t("models.mlp.narrative.s06.p1H1")}</Highlight>{" "}{t("models.mlp.narrative.s06.p1")}</P>
                    <FormulaBlock
                        formula="W_{ij} \sim \mathcal{N}\!\left(0,\; \frac{2}{n_{\text{in}}}\right)"
                        caption={t("models.mlp.narrative.s06.formulaCaption1")}
                    />
                    <LazySection>
                        <FigureWrapper label={t("models.mlp.narrative.s06.figLabel1")} hint={t("models.mlp.narrative.s06.figHint1")}>
                            <Suspense fallback={<SectionSkeleton />}><InitializationSensitivityVisualizer timeline={mlpGrid.timeline} /></Suspense>
                        </FigureWrapper>
                    </LazySection>
                </TrainingChallengePanel>

                <TrainingChallengePanel
                    title={t("models.mlp.narrative.s06.panels.gradients.title")}
                    preview={t("models.mlp.narrative.s06.panels.gradients.preview")}
                >
                    <P><Highlight color="rose">{t("models.mlp.narrative.s06.p2H1")}</Highlight>{" "}{t("models.mlp.narrative.s06.p2")}</P>
                    <FormulaBlock
                        formula="\frac{\partial \mathcal{L}}{\partial W_1} = \frac{\partial \mathcal{L}}{\partial h_L} \cdot \prod_{l=2}^{L} \frac{\partial h_l}{\partial h_{l-1}} \cdot \frac{\partial h_1}{\partial W_1}"
                        caption={t("models.mlp.narrative.s06.formulaCaption2")}
                    />
                    <LazySection>
                        <FigureWrapper label={t("models.mlp.narrative.s06.figLabel2")} hint={t("models.mlp.narrative.s06.figHint2")}>
                            <Suspense fallback={<SectionSkeleton />}><GradientFlowVisualizer timeline={mlpGrid.timeline} /></Suspense>
                        </FigureWrapper>
                    </LazySection>
                    <P>{t("models.mlp.narrative.s06.p3")}</P>
                </TrainingChallengePanel>

                <TrainingChallengePanel
                    title={t("models.mlp.narrative.s06.panels.batchnorm.title")}
                    preview={t("models.mlp.narrative.s06.panels.batchnorm.preview")}
                >
                    <P><Highlight color="indigo">{t("models.mlp.narrative.s06.p4H1")}</Highlight>{" "}{t("models.mlp.narrative.s06.p4")}</P>
                    <FormulaBlock
                        formula="\hat{h} = \frac{h - \mu_B}{\sqrt{\sigma_B^2 + \epsilon}}, \quad y = \gamma \hat{h} + \beta"
                        caption={t("models.mlp.narrative.s06.formulaCaption3")}
                    />
                    <Callout icon={Lightbulb} accent="indigo" title={t("models.mlp.narrative.s06.calloutTitle")}>
                        <p>{t("models.mlp.narrative.s06.calloutText")}</p>
                    </Callout>
                    <LazySection>
                        <FigureWrapper label={t("models.mlp.narrative.s06.figLabel3")} hint={t("models.mlp.narrative.s06.figHint3")}>
                            <Suspense fallback={<SectionSkeleton />}><BatchNormEffectVisualizer /></Suspense>
                        </FigureWrapper>
                    </LazySection>
                </TrainingChallengePanel>
            </Section>

            <SectionBreak />

            {/* ─────────── 07 · THE PATH AHEAD ─────────── */}
            <Section id="mlp-07">
                <SectionLabel number={t("models.mlp.narrative.sections.s07.number")} label={t("models.mlp.narrative.sections.s07.label")} />
                <SectionAnchor id="mlp-07"><Heading>{t("models.mlp.narrative.s07.heading")}</Heading></SectionAnchor>
                <Lead>{t("models.mlp.narrative.s07.lead")}</Lead>
                <P>{t("models.mlp.narrative.s07.p1")}</P>
                <P>{t("models.mlp.narrative.s07.p2")}</P>
                <div className="my-6 space-y-3 pl-4 border-l-2 border-violet-500/20">
                    <p className="text-[var(--lab-text-muted)] text-sm leading-relaxed">{t("models.mlp.narrative.s07.rnnQ1")}</p>
                    <p className="text-[var(--lab-text-muted)] text-sm leading-relaxed">{t("models.mlp.narrative.s07.rnnQ2")}</p>
                    <p className="text-[var(--lab-text-muted)] text-sm leading-relaxed">{t("models.mlp.narrative.s07.rnnQ3")}</p>
                </div>
                <PullQuote>{t("models.mlp.narrative.s07.pullQuote")}</PullQuote>
                <P>{t("models.mlp.narrative.s07.p3")}</P>
                <P>{t("models.mlp.narrative.s07.p4")}</P>
            </Section>

            <SectionBreak />

            {/* ─────────── CALL TO ACTION ─────────── */}
            <Section>
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-[var(--lab-text)] tracking-tight mb-3">
                        {t("models.mlp.narrative.cta.heading")}
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setMode("free")}
                        className="group relative rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-950/20 to-[var(--lab-viz-bg)]/80 p-6 text-left transition-colors hover:border-violet-500/40 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        <div className="relative">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 rounded-xl bg-violet-500/15">
                                    <Beaker className="w-5 h-5 text-violet-300" />
                                </div>
                                <span className="text-lg font-bold text-[var(--lab-text)]">
                                    {t("models.mlp.narrative.cta.freeLabTitle")}
                                </span>
                            </div>
                            <p className="text-sm text-[var(--lab-text-muted)] leading-relaxed">
                                {t("models.mlp.narrative.cta.freeLabDesc")}
                            </p>
                        </div>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => router.push("/lab/rnn")}
                        className="group relative rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/20 to-[var(--lab-viz-bg)]/80 p-6 text-left transition-colors hover:border-cyan-500/40 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        <div className="relative">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 rounded-xl bg-cyan-500/15">
                                    <BrainCircuit className="w-5 h-5 text-cyan-300" />
                                </div>
                                <span className="text-lg font-bold text-[var(--lab-text)]">
                                    {t("models.mlp.narrative.cta.transformerTitle")}
                                </span>
                            </div>
                            <p className="text-sm text-[var(--lab-text-muted)] leading-relaxed">
                                {t("models.mlp.narrative.cta.transformerDesc")}
                            </p>
                        </div>
                    </motion.button>
                </div>
            </Section>

            {/* ───────────────── FOOTER ───────────────── */}
            <motion.footer
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-8 pt-12 border-t border-[var(--lab-border)] text-center"
            >
                <p className="text-sm text-[var(--lab-text-subtle)] italic max-w-md mx-auto leading-relaxed mb-10">
                    {t("models.mlp.narrative.footer.text")}
                </p>
                <div className="flex items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[var(--lab-border)]">
                    <FlaskConical className="h-3 w-3" />
                    {t("models.mlp.narrative.footer.brand")}
                </div>
            </motion.footer>
        </article>
    );
}

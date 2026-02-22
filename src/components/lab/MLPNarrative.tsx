"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, FlaskConical, ArrowDown, Lightbulb, AlertTriangle, Beaker, BrainCircuit } from "lucide-react";
import { ModeToggle } from "@/components/lab/ModeToggle";
import { useRouter } from "next/navigation";
import { useLabMode } from "@/context/LabModeContext";

import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

import { MLPNonLinearityVisualizer } from "@/components/lab/mlp/MLPNonLinearityVisualizer";
import { PedagogicalEmbeddingVisualizer } from "@/components/lab/mlp/PedagogicalEmbeddingVisualizer";
import { MLPHyperparameterExplorer } from "@/components/lab/mlp/MLPHyperparameterExplorer";
import { InitializationSensitivityVisualizer } from "@/components/lab/mlp/InitializationSensitivityVisualizer";
import { GradientFlowVisualizer } from "@/components/lab/mlp/GradientFlowVisualizer";
import { BatchNormEffectVisualizer } from "@/components/lab/mlp/BatchNormEffectVisualizer";
import { ContextWindowVisualizer } from "@/components/lab/mlp/ContextWindowVisualizer";
import { ConcatenationBottleneckVisualizer } from "@/components/lab/mlp/ConcatenationBottleneckVisualizer";
import { PositionSensitivityVisualizer } from "@/components/lab/mlp/PositionSensitivityVisualizer";
import { LongRangeDependencyDemo } from "@/components/lab/mlp/LongRangeDependencyDemo";
import { LossIntuitionVisualizer } from "@/components/lab/mlp/LossIntuitionVisualizer";
import { MLPPipelineVisualizer } from "@/components/lab/mlp/MLPPipelineVisualizer";
import { SoftmaxTemperatureVisualizer } from "@/components/lab/mlp/SoftmaxTemperatureVisualizer";
import { MLPArchitectureDiagram } from "@/components/lab/mlp/MLPArchitectureDiagram";
import { OneHotDimensionalityVisual } from "@/components/lab/mlp/OneHotDimensionalityVisual";
import { ThinkFirst } from "@/components/lab/mlp/ThinkFirst";
import { MLPGuidedExperiments } from "@/components/lab/mlp/MLPGuidedExperiments";
import type { UseMLPGridReturn } from "@/hooks/useMLPGrid";
import { useI18n } from "@/i18n/context";

export interface MLPNarrativeProps {
    mlpGrid: UseMLPGridReturn;
}

/* ─────────────────────────────────────────────
   Primitive building blocks (matches NN / Ngram narrative style)
   ───────────────────────────────────────────── */

function Section({ children }: { children: React.ReactNode }) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="mb-20 md:mb-28"
        >
            {children}
        </motion.section>
    );
}

function SectionLabel({ number, label }: { number: string; label: string }) {
    return (
        <div className="flex items-center gap-3 mb-8">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-violet-500/10 border border-violet-500/20 text-[11px] font-mono font-bold text-violet-400">
                {number}
            </span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-white/25">
                {label}
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-white/[0.06] to-transparent" />
        </div>
    );
}

function Heading({ children }: { children: React.ReactNode }) {
    return (
        <h2 className="text-2xl md:text-[2rem] font-bold text-white tracking-tight mb-6 leading-tight">
            {children}
        </h2>
    );
}

function Lead({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-lg md:text-xl text-white/50 leading-[1.8] mb-6 font-light">
            {children}
        </p>
    );
}

function P({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-[15px] md:text-base text-white/45 leading-[1.9] mb-5 last:mb-0">
            {children}
        </p>
    );
}

function Highlight({ children, color = "violet" }: { children: React.ReactNode; color?: "violet" | "amber" | "indigo" | "emerald" | "rose" }) {
    const colors = {
        violet: "text-violet-400",
        amber: "text-amber-400",
        indigo: "text-indigo-400",
        emerald: "text-emerald-400",
        rose: "text-rose-400",
    };
    return <strong className={`${colors[color]} font-semibold`}>{children}</strong>;
}

function Callout({
    icon: Icon = Lightbulb,
    accent = "violet",
    title,
    children,
}: {
    icon?: React.ComponentType<{ className?: string }>;
    accent?: "violet" | "amber" | "indigo" | "emerald" | "rose";
    title?: string;
    children: React.ReactNode;
}) {
    const accentMap = {
        violet: {
            border: "border-violet-500/20",
            bg: "bg-violet-500/[0.04]",
            icon: "text-violet-400",
            title: "text-violet-400",
            glow: "from-violet-500/[0.06]",
        },
        amber: {
            border: "border-amber-500/20",
            bg: "bg-amber-500/[0.04]",
            icon: "text-amber-400",
            title: "text-amber-400",
            glow: "from-amber-500/[0.06]",
        },
        indigo: {
            border: "border-indigo-500/20",
            bg: "bg-indigo-500/[0.04]",
            icon: "text-indigo-400",
            title: "text-indigo-400",
            glow: "from-indigo-500/[0.06]",
        },
        emerald: {
            border: "border-emerald-500/20",
            bg: "bg-emerald-500/[0.04]",
            icon: "text-emerald-400",
            title: "text-emerald-400",
            glow: "from-emerald-500/[0.06]",
        },
        rose: {
            border: "border-rose-500/20",
            bg: "bg-rose-500/[0.04]",
            icon: "text-rose-400",
            title: "text-rose-400",
            glow: "from-rose-500/[0.06]",
        },
    };
    const a = accentMap[accent];

    return (
        <motion.aside
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4 }}
            className={`relative my-8 rounded-xl border ${a.border} ${a.bg} p-5 md:p-6 overflow-hidden`}
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${a.glow} to-transparent pointer-events-none`} />
            <div className="relative flex gap-4">
                <div className="shrink-0 mt-0.5">
                    <Icon className={`w-4.5 h-4.5 ${a.icon}`} />
                </div>
                <div className="min-w-0">
                    {title && (
                        <p className={`text-xs font-bold uppercase tracking-[0.15em] ${a.title} mb-2`}>
                            {title}
                        </p>
                    )}
                    <div className="text-sm text-white/50 leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0">
                        {children}
                    </div>
                </div>
            </div>
        </motion.aside>
    );
}

function FormulaBlock({ formula, caption }: { formula: string; caption: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            className="my-10 text-center"
        >
            <div className="flex items-center justify-center mb-10">
                <div className="inline-block px-8 py-4 rounded-2xl bg-violet-500/[0.04] border border-violet-500/[0.15] backdrop-blur-sm shadow-[0_0_40px_-15px_rgba(139,92,246,0.15)]">
                    <BlockMath math={formula} />
                </div>
            </div>
            <p className="text-center text-sm md:text-base text-white/40 italic font-light max-w-2xl mx-auto">
                {caption}
            </p>
        </motion.div>
    );
}

function PullQuote({ children }: { children: React.ReactNode }) {
    return (
        <motion.blockquote
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            className="my-10 md:my-12 pl-6 border-l-2 border-violet-500/30"
        >
            <p className="text-lg md:text-xl text-white/60 font-light italic leading-relaxed">
                {children}
            </p>
        </motion.blockquote>
    );
}

function SectionBreak() {
    return (
        <div className="flex items-center justify-center gap-3 my-16 md:my-20">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/[0.08]" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/[0.08]" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/[0.08]" />
        </div>
    );
}

function TrainingChallengePanel({ title, preview, defaultOpen = false, children }: { title: string; preview: string; defaultOpen?: boolean; children: React.ReactNode }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            className="my-6 rounded-xl border border-white/[0.08] bg-white/[0.02] overflow-hidden"
        >
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between w-full p-4 text-left hover:bg-white/[0.02] transition-colors"
                aria-expanded={open}
            >
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-mono font-bold text-violet-300 mb-1">{title}</h4>
                    <p className="text-xs text-white/40">{preview}</p>
                </div>
                <motion.div
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-3 shrink-0"
                >
                    <ArrowDown className="w-4 h-4 text-white/30" />
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
                        <div className="px-4 pb-4 pt-2 border-t border-white/[0.06]">
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
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                    <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                        <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                        <span className="w-2.5 h-2.5 rounded-full bg-violet-400/40" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">
                        {label}
                    </span>
                </div>
                <div className="p-4 sm:p-6">{children}</div>
            </div>
            {hint && (
                <figcaption className="mt-3 text-center text-xs text-white/25 italic">
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
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
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
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
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

    return (
        <article className="max-w-[920px] mx-auto px-6 pt-8 pb-24">

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

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
                        {t("models.mlp.narrative.hero.titlePrefix")}{" "}
                        <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-violet-400 bg-clip-text text-transparent">
                            {t("models.mlp.narrative.hero.titleHighlight")}
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-white/35 max-w-xl mx-auto leading-relaxed mb-12">
                        {t("models.mlp.narrative.hero.description")}
                    </p>

                    <div className="flex justify-center mb-14">
                        <ModeToggle />
                    </div>

                    <motion.div
                        animate={{ y: [0, 6, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        className="text-white/10"
                    >
                        <ArrowDown className="w-5 h-5 mx-auto" />
                    </motion.div>
                </motion.div>
            </header>

            {/* ─────────── 00 · FROM BUILDING BLOCKS TO LANGUAGE ─────────── */}
            <Section>
                <SectionLabel number={t("models.mlp.narrative.sections.s00.number")} label={t("models.mlp.narrative.sections.s00.label")} />
                <Heading>{t("models.mlp.narrative.s00.heading")}</Heading>

                <Lead>{t("models.mlp.narrative.s00.lead")}</Lead>

                <P>{t("models.mlp.narrative.s00.p1")}</P>

                <FigureWrapper
                    label={t("models.mlp.narrative.s00.figLabel1")}
                    hint={t("models.mlp.narrative.s00.figHint1")}
                >
                    <MLPArchitectureDiagram />
                </FigureWrapper>

                <P>{t("models.mlp.narrative.s00.p2")}</P>

                <FormulaBlock
                    formula="h = \sigma(W_1 x + b_1), \quad \hat{y} = \text{softmax}(W_2 h + b_2)"
                    caption={t("models.mlp.narrative.s00.formulaCaption")}
                />

                <Callout accent="violet" title={t("models.mlp.narrative.s00.calloutTitle")}>
                    <p>{t("models.mlp.narrative.s00.calloutText")}</p>
                </Callout>

                <ThinkFirst
                    question={t("models.mlp.narrative.thinkFirst.xor.question")}
                    reveal={t("models.mlp.narrative.thinkFirst.xor.reveal")}
                />

                <FigureWrapper
                    label={t("models.mlp.narrative.s00.figLabel2")}
                    hint={t("models.mlp.narrative.s00.figHint2")}
                >
                    <MLPNonLinearityVisualizer />
                </FigureWrapper>
            </Section>

            <SectionBreak />

            {/* ─────────── 01 · FEEDING LANGUAGE TO A NEURAL NETWORK ─────────── */}
            <Section>
                <SectionLabel number={t("models.mlp.narrative.sections.s01.number")} label={t("models.mlp.narrative.sections.s01.label")} />
                <Heading>{t("models.mlp.narrative.s01.heading")}</Heading>
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
                <FigureWrapper label={t("models.mlp.narrative.s01.figLabel1")} hint={t("models.mlp.narrative.s01.figHint1")}>
                    <LossIntuitionVisualizer />
                </FigureWrapper>
                <P>
                    {t("models.mlp.narrative.s01.p2")}{" "}
                    <Highlight color="emerald">{t("models.mlp.narrative.s01.p2H1")}</Highlight>
                    {t("models.mlp.narrative.s01.p2End")}
                </P>
                <P>{t("models.mlp.narrative.s01.p3")}</P>
                <Callout icon={Lightbulb} accent="emerald" title={t("models.mlp.narrative.s01.calloutTitle2")}>
                    <p>{t("models.mlp.narrative.s01.calloutText2")}</p>
                </Callout>
                <FigureWrapper label={t("models.mlp.narrative.s01.figLabel2")} hint={t("models.mlp.narrative.s01.figHint2")}>
                    <MLPPipelineVisualizer selectedConfig={mlpGrid.selectedConfig} />
                </FigureWrapper>
            </Section>

            <SectionBreak />

            {/* ─────────── 02 · THE ONE-HOT PROBLEM ─────────── */}
            <Section>
                <SectionLabel number={t("models.mlp.narrative.sections.s02.number")} label={t("models.mlp.narrative.sections.s02.label")} />
                <Heading>{t("models.mlp.narrative.s02.heading")}</Heading>
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

                <FigureWrapper
                    label={t("models.mlp.narrative.s02.figLabel1")}
                    hint={t("models.mlp.narrative.s02.figHint1")}
                >
                    <OneHotDimensionalityVisual />
                </FigureWrapper>
            </Section>

            <SectionBreak />

            {/* ─────────── 03 · THE GAME CHANGER: WORD EMBEDDINGS ─────────── */}
            <Section>
                <SectionLabel number={t("models.mlp.narrative.sections.s03.number")} label={t("models.mlp.narrative.sections.s03.label")} />
                <Heading>{t("models.mlp.narrative.s03.heading")}</Heading>
                <Lead>{t("models.mlp.narrative.s03.lead")}</Lead>

                <ThinkFirst
                    question={t("models.mlp.narrative.thinkFirst.embedding.question")}
                    reveal={t("models.mlp.narrative.thinkFirst.embedding.reveal")}
                />
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
                <FigureWrapper label={t("models.mlp.narrative.s03.figLabel1")} hint={t("models.mlp.narrative.s03.figHint1")}>
                    <PedagogicalEmbeddingVisualizer />
                </FigureWrapper>
            </Section>

            <SectionBreak />

            {/* ─────────── 04 · EXPLORING CONFIGURATIONS ─────────── */}
            <Section>
                <SectionLabel number={t("models.mlp.narrative.sections.s04.number")} label={t("models.mlp.narrative.sections.s04.label")} />
                <Heading>{t("models.mlp.narrative.s04.heading")}</Heading>
                <Lead>{t("models.mlp.narrative.s04.lead")}</Lead>

                <ThinkFirst
                    question={t("models.mlp.narrative.thinkFirst.hyperparams.question")}
                    reveal={t("models.mlp.narrative.thinkFirst.hyperparams.reveal")}
                />
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
                        <div key={key} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
                            <p className="text-xs font-mono font-bold text-violet-400/70 mb-1.5">{t(`models.mlp.narrative.s04.hyperparamCards.${key}.title`)}</p>
                            <p className="text-sm text-white/40 leading-relaxed">{t(`models.mlp.narrative.s04.hyperparamCards.${key}.desc`)}</p>
                        </div>
                    ))}
                </motion.div>
                <FigureWrapper label={t("models.mlp.narrative.s04.figLabel1")} hint={t("models.mlp.narrative.s04.figHint1")}>
                    <SoftmaxTemperatureVisualizer />
                </FigureWrapper>
                <Callout title={t("models.mlp.narrative.s04.calloutTitle")}>
                    <p>{t("models.mlp.narrative.s04.calloutText")}</p>
                </Callout>

                <MLPGuidedExperiments />

                <FigureWrapper label={t("models.mlp.narrative.s04.figLabel2")} hint={t("models.mlp.narrative.s04.figHint2")}>
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
                </FigureWrapper>
                <P>{t("models.mlp.narrative.s04.p3")}</P>
            </Section>

            <SectionBreak />

            {/* ─────────── 05 · LIMITATIONS OF MLP + EMBEDDINGS ─────────── */}
            <Section>
                <SectionLabel number={t("models.mlp.narrative.sections.s05.number")} label={t("models.mlp.narrative.sections.s05.label")} />
                <Heading>{t("models.mlp.narrative.s05.heading")}</Heading>

                <Lead>{t("models.mlp.narrative.s05.lead")}</Lead>

                {/* ── Limitation 1: Fixed context window ── */}
                <P>
                    <Highlight color="amber">{t("models.mlp.narrative.s05.p1H1")}</Highlight>{" "}
                    {t("models.mlp.narrative.s05.p1")}
                </P>

                <P>{t("models.mlp.narrative.s05.p2")}</P>

                <ThinkFirst
                    question={t("models.mlp.narrative.thinkFirst.contextWindow.question")}
                    reveal={t("models.mlp.narrative.thinkFirst.contextWindow.reveal")}
                />

                <FigureWrapper
                    label={t("models.mlp.narrative.s05.figLabel1")}
                    hint={t("models.mlp.narrative.s05.figHint1")}
                >
                    <ContextWindowVisualizer />
                </FigureWrapper>

                {/* ── Limitation 2: Long-range dependencies ── */}
                <P>
                    <Highlight color="amber">{t("models.mlp.narrative.s05.p3H1")}</Highlight>{" "}
                    {t("models.mlp.narrative.s05.p3")}
                </P>

                <FigureWrapper
                    label={t("models.mlp.narrative.s05.figLabel2")}
                    hint={t("models.mlp.narrative.s05.figHint2")}
                >
                    <LongRangeDependencyDemo />
                </FigureWrapper>

                {/* ── Limitation 3: Position-dependent meaning ── */}
                <P>
                    <Highlight color="amber">{t("models.mlp.narrative.s05.p4H1")}</Highlight>{" "}
                    {t("models.mlp.narrative.s05.p4")}
                </P>

                <FigureWrapper
                    label={t("models.mlp.narrative.s05.figLabel3")}
                    hint={t("models.mlp.narrative.s05.figHint3")}
                >
                    <PositionSensitivityVisualizer />
                </FigureWrapper>

                {/* ── Limitation 4: Concatenation bottleneck ── */}
                <P>
                    <Highlight color="amber">{t("models.mlp.narrative.s05.p5H1")}</Highlight>{" "}
                    {t("models.mlp.narrative.s05.p5")}
                </P>

                <FigureWrapper
                    label={t("models.mlp.narrative.s05.figLabel4")}
                    hint={t("models.mlp.narrative.s05.figHint4")}
                >
                    <ConcatenationBottleneckVisualizer />
                </FigureWrapper>

                <Callout icon={AlertTriangle} accent="amber" title={t("models.mlp.narrative.s05.calloutTitle")}>
                    <p>{t("models.mlp.narrative.s05.calloutText")}</p>
                </Callout>
            </Section>

            <SectionBreak />

            {/* ─────────── 06 · TRAINING CHALLENGES ─────────── */}
            <Section>
                <SectionLabel number={t("models.mlp.narrative.sections.s06.number")} label={t("models.mlp.narrative.sections.s06.label")} />
                <Heading>{t("models.mlp.narrative.s06.heading")}</Heading>
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
                    <FigureWrapper label={t("models.mlp.narrative.s06.figLabel1")} hint={t("models.mlp.narrative.s06.figHint1")}>
                        <InitializationSensitivityVisualizer timeline={mlpGrid.timeline} />
                    </FigureWrapper>
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
                    <FigureWrapper label={t("models.mlp.narrative.s06.figLabel2")} hint={t("models.mlp.narrative.s06.figHint2")}>
                        <GradientFlowVisualizer timeline={mlpGrid.timeline} />
                    </FigureWrapper>
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
                    <FigureWrapper label={t("models.mlp.narrative.s06.figLabel3")} hint={t("models.mlp.narrative.s06.figHint3")}>
                        <BatchNormEffectVisualizer />
                    </FigureWrapper>
                </TrainingChallengePanel>
            </Section>

            <SectionBreak />

            {/* ─────────── 07 · THE PATH AHEAD ─────────── */}
            <Section>
                <SectionLabel number={t("models.mlp.narrative.sections.s07.number")} label={t("models.mlp.narrative.sections.s07.label")} />
                <Heading>{t("models.mlp.narrative.s07.heading")}</Heading>
                <Lead>{t("models.mlp.narrative.s07.lead")}</Lead>
                <P>{t("models.mlp.narrative.s07.p1")}</P>
                <P>{t("models.mlp.narrative.s07.p2")}</P>
                <div className="my-6 space-y-3 pl-4 border-l-2 border-violet-500/20">
                    <p className="text-white/60 text-sm leading-relaxed">{t("models.mlp.narrative.s07.rnnQ1")}</p>
                    <p className="text-white/60 text-sm leading-relaxed">{t("models.mlp.narrative.s07.rnnQ2")}</p>
                    <p className="text-white/60 text-sm leading-relaxed">{t("models.mlp.narrative.s07.rnnQ3")}</p>
                </div>
                <PullQuote>{t("models.mlp.narrative.s07.pullQuote")}</PullQuote>
                <P>{t("models.mlp.narrative.s07.p3")}</P>
                <P>{t("models.mlp.narrative.s07.p4")}</P>
            </Section>

            <SectionBreak />

            {/* ─────────── CALL TO ACTION ─────────── */}
            <Section>
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-3">
                        {t("models.mlp.narrative.cta.heading")}
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setMode("free")}
                        className="group relative rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-950/20 to-black/60 p-6 text-left transition-colors hover:border-violet-500/40 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        <div className="relative">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 rounded-xl bg-violet-500/15">
                                    <Beaker className="w-5 h-5 text-violet-300" />
                                </div>
                                <span className="text-lg font-bold text-white">
                                    {t("models.mlp.narrative.cta.freeLabTitle")}
                                </span>
                            </div>
                            <p className="text-sm text-white/45 leading-relaxed">
                                {t("models.mlp.narrative.cta.freeLabDesc")}
                            </p>
                        </div>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => router.push("/lab/rnn")}
                        className="group relative rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/20 to-black/60 p-6 text-left transition-colors hover:border-cyan-500/40 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        <div className="relative">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 rounded-xl bg-cyan-500/15">
                                    <BrainCircuit className="w-5 h-5 text-cyan-300" />
                                </div>
                                <span className="text-lg font-bold text-white">
                                    {t("models.mlp.narrative.cta.transformerTitle")}
                                </span>
                            </div>
                            <p className="text-sm text-white/45 leading-relaxed">
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
                className="mt-8 pt-12 border-t border-white/[0.06] text-center"
            >
                <p className="text-sm text-white/25 italic max-w-md mx-auto leading-relaxed mb-10">
                    {t("models.mlp.narrative.footer.text")}
                </p>
                <div className="flex items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-widest text-white/10">
                    <FlaskConical className="h-3 w-3" />
                    {t("models.mlp.narrative.footer.brand")}
                </div>
            </motion.footer>
        </article>
    );
}

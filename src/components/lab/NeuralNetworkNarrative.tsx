"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, FlaskConical, ArrowDown, Lightbulb, AlertTriangle, Beaker, Layers, ChevronDown, History } from "lucide-react";
import { ModeToggle } from "@/components/lab/ModeToggle";
import { useI18n } from "@/i18n/context";
import { useRouter } from "next/navigation";
import { useLabMode } from "@/context/LabModeContext";
import { NNPerceptronDiagram } from "@/components/lab/NNPerceptronDiagram";
import { NNActivationExplorer } from "@/components/lab/NNActivationExplorer";
import { NNTrainingDemo } from "@/components/lab/NNTrainingDemo";
import type { TrainingStep } from "@/components/lab/NNTrainingDemo";
import { NNLossLandscape } from "@/components/lab/NNLossLandscape";
import { NNBigramComparison } from "@/components/lab/NNBigramComparison";
import { OverfittingComparisonDiagram } from "@/components/lab/OverfittingComparisonDiagram";
import { TrainValLossCurveVisualizer } from "@/components/lab/TrainValLossCurveVisualizer";
import { OperationExplorer } from "@/components/lab/nn/OperationExplorer";
import { WeightSliderDemo } from "@/components/lab/nn/WeightSliderDemo";
import { BiasDemo } from "@/components/lab/nn/BiasDemo";
import { LinearStackingDemo } from "@/components/lab/nn/LinearStackingDemo";
import { ParallelNeuronsDemo } from "@/components/lab/nn/ParallelNeuronsDemo";
import { DecisionBoundaryIntro } from "@/components/lab/nn/DecisionBoundaryIntro";
import { PredictionErrorDemo } from "@/components/lab/nn/PredictionErrorDemo";
import { DerivativeIntuitionDemo } from "@/components/lab/nn/DerivativeIntuitionDemo";
import { ChainRuleBuilder } from "@/components/lab/nn/ChainRuleBuilder";
import { GradientDirectionDemo } from "@/components/lab/nn/GradientDirectionDemo";
import { LossFormulaMotivation } from "@/components/lab/nn/LossFormulaMotivation";
import { NeuronGradientCalculator } from "@/components/lab/nn/NeuronGradientCalculator";
import { NudgeWeightDemo } from "@/components/lab/nn/NudgeWeightDemo";
import { RepeatedTrainingDemo } from "@/components/lab/nn/RepeatedTrainingDemo";
import { TrainingWithTextDemo } from "@/components/lab/nn/TrainingWithTextDemo";
import { OutputLayerNetworkVisualizer } from "@/components/lab/nn/OutputLayerNetworkVisualizer";
import { SoftmaxTransformDemo } from "@/components/lab/nn/SoftmaxTransformDemo";
import { LearningRateDemo } from "@/components/lab/nn/LearningRateDemo";
import { LetterToNumberDemo } from "@/components/lab/nn/LetterToNumberDemo";
import { Challenge } from "@/components/lab/nn/Challenge";
import { WeightTrajectoryDemo } from "@/components/lab/nn/WeightTrajectoryDemo";

import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

/* ─────────────────────────────────────────────
   Primitive building blocks
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
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-rose-500/20 to-pink-500/10 border border-rose-500/25 text-[11px] font-mono font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-pink-300" style={{ WebkitBackgroundClip: 'text', backgroundImage: 'linear-gradient(135deg, #fb7185, #f9a8d4)' }}>
                {number}
            </span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-white/30">
                {label}
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-white/[0.06] to-transparent" />
        </div>
    );
}

function Heading({ children }: { children: React.ReactNode }) {
    return (
        <h2 className="text-2xl md:text-[2rem] font-extrabold text-white tracking-tight mb-6 leading-tight">
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

function Highlight({ children, color = "rose" }: { children: React.ReactNode; color?: "rose" | "amber" | "indigo" | "emerald" }) {
    const colors = {
        rose: "text-rose-400",
        amber: "text-amber-400",
        indigo: "text-indigo-400",
        emerald: "text-emerald-400",
    };
    return <strong className={`${colors[color]} font-semibold`}>{children}</strong>;
}

function Callout({
    icon: Icon = Lightbulb,
    accent = "rose",
    title,
    children,
}: {
    icon?: React.ComponentType<{ className?: string }>;
    accent?: "rose" | "amber" | "indigo" | "emerald";
    title?: string;
    children: React.ReactNode;
}) {
    const accentMap = {
        rose: {
            border: "border-rose-500/20",
            bg: "bg-rose-500/[0.04]",
            icon: "text-rose-400",
            title: "text-rose-400",
            glow: "from-rose-500/[0.06]",
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
                <div className="inline-block px-8 py-4 rounded-2xl bg-rose-500/[0.04] border border-rose-500/[0.15] backdrop-blur-sm shadow-[0_0_40px_-15px_rgba(244,63,94,0.15)]">
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
            className="my-10 md:my-12 pl-6 border-l-2 border-rose-500/30"
        >
            <p className="text-lg md:text-xl text-white/60 font-light italic leading-relaxed">
                {children}
            </p>
        </motion.blockquote>
    );
}

const FIGURE_ACCENTS = {
    default: { border: "border-white/[0.07]", bg: "bg-white/[0.015]", bar: "border-white/[0.06] bg-white/[0.02]", text: "text-white/30" },
    amber: { border: "border-amber-500/[0.12]", bg: "bg-gradient-to-br from-amber-500/[0.02] to-transparent", bar: "border-amber-500/[0.08] bg-amber-500/[0.02]", text: "text-amber-400/50" },
    emerald: { border: "border-emerald-500/[0.1]", bg: "bg-[radial-gradient(ellipse_at_top,rgba(52,211,153,0.02),transparent)]", bar: "border-emerald-500/[0.08] bg-emerald-500/[0.02]", text: "text-emerald-400/50" },
    rose: { border: "border-rose-500/[0.12]", bg: "bg-gradient-to-br from-rose-500/[0.03] to-transparent", bar: "border-rose-500/[0.08] bg-rose-500/[0.02]", text: "text-rose-400/50" },
    violet: { border: "border-violet-500/[0.12]", bg: "bg-gradient-to-br from-violet-500/[0.03] to-transparent", bar: "border-violet-500/[0.08] bg-violet-500/[0.02]", text: "text-violet-400/50" },
    indigo: { border: "border-indigo-500/[0.1]", bg: "bg-gradient-to-br from-indigo-500/[0.02] to-transparent", bar: "border-indigo-500/[0.08] bg-indigo-500/[0.02]", text: "text-indigo-400/50" },
} as const;

type FigureAccent = keyof typeof FIGURE_ACCENTS;

function FigureWrapper({ label, hint, accent = "default", children }: { label: string; hint: string; accent?: FigureAccent; children: React.ReactNode }) {
    const a = FIGURE_ACCENTS[accent];
    return (
        <div className={`my-8 -mx-2 sm:mx-0 rounded-2xl border ${a.border} ${a.bg} overflow-hidden`}>
            <div className={`flex items-center justify-between gap-3 px-4 py-2.5 border-b ${a.bar}`}>
                <span className={`text-[10px] font-mono uppercase tracking-widest ${a.text}`}>{label}</span>
            </div>
            <div className="p-4">{children}</div>
            {hint && (
                <p className="px-4 pb-3 text-[11px] text-white/25 italic">{hint}</p>
            )}
        </div>
    );
}

function Expandable({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="my-8 rounded-xl border border-white/[0.07] bg-white/[0.015] overflow-hidden">
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
            >
                <span className="text-sm font-semibold text-white/60">{title}</span>
                <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-4 h-4 text-white/25" />
                </motion.div>
            </button>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 pb-6 pt-2 border-t border-white/[0.05] space-y-0">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
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

/* ─────────────────────────────────────────────
   Collapsible History Sidebar
   ───────────────────────────────────────────── */

function HistorySidebar({ t }: { t: (key: string) => string }) {
    const [open, setOpen] = useState(false);

    const timelineEvents = [
        { year: "1943", color: "from-blue-400 to-cyan-400", label: "Birth of the Idea" },
        { year: "1958", color: "from-emerald-400 to-green-400", label: "First Learning Machine" },
        { year: "1969", color: "from-slate-400 to-gray-500", label: "AI Winter Begins" },
        { year: "1986", color: "from-amber-400 to-orange-400", label: "The Thaw" },
        { year: "2012+", color: "from-rose-400 to-indigo-400", label: "Deep Learning Era" },
    ];

    return (
        <motion.aside
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            className="my-12 rounded-2xl border border-rose-500/20 overflow-hidden relative"
        >
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center gap-4 px-6 py-5 text-left group transition-all duration-300 relative bg-gradient-to-br from-rose-500/[0.08] via-pink-500/[0.04] to-rose-500/[0.06] hover:from-rose-500/[0.12] hover:via-pink-500/[0.06] hover:to-rose-500/[0.08]"
            >
                <div className="shrink-0 p-2.5 rounded-xl bg-gradient-to-br from-rose-500/20 to-pink-500/20 ring-1 ring-rose-500/30 group-hover:ring-rose-500/50 transition-all">
                    <History className="w-5 h-5 text-rose-300" />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-200 to-rose-200 mb-1">
                        {t("neuralNetworkNarrative.history.title")}
                    </p>
                    <p className="text-xs text-white/40 leading-relaxed">
                        {t("neuralNetworkNarrative.history.summary")}
                    </p>
                </div>
                <motion.div
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="shrink-0"
                >
                    <ChevronDown className="w-5 h-5 text-rose-400/60 group-hover:text-rose-400 transition-colors" />
                </motion.div>
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden bg-black"
                    >
                        <div className="px-6 pb-6 border-t border-white/[0.04] pt-5">
                            {/* Subtitle */}
                            <p className="text-xs font-bold uppercase tracking-[0.15em] text-rose-400/50 mb-6 text-center">
                                {t("neuralNetworkNarrative.history.subtitle")}
                            </p>

                            {/* Mini Timeline Visual */}
                            <div className="mb-8 px-2">
                                <div className="relative">
                                    {/* Timeline line */}
                                    <div className="absolute left-0 right-0 top-4 h-0.5 bg-gradient-to-r from-blue-500/20 via-amber-500/30 to-rose-500/20" />

                                    {/* Timeline points */}
                                    <div className="relative flex justify-between items-start">
                                        {timelineEvents.map((event, idx) => (
                                            <motion.div
                                                key={event.year}
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ delay: idx * 0.1, duration: 0.3 }}
                                                className="flex flex-col items-center"
                                            >
                                                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${event.color} shadow-lg flex items-center justify-center ring-4 ring-black/50`}>
                                                    <div className="w-2 h-2 rounded-full bg-white/90" />
                                                </div>
                                                <span className="mt-2 text-[10px] font-bold font-mono text-white/60 whitespace-nowrap">
                                                    {event.year}
                                                </span>
                                                <span className="mt-1 text-[9px] text-white/30 text-center max-w-[60px] leading-tight">
                                                    {event.label}
                                                </span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Story paragraphs with colorful styling */}
                            <div className="space-y-5">
                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="border-l-2 border-blue-500/30 pl-4"
                                >
                                    <div className="flex items-baseline gap-3 mb-2">
                                        <span className="text-2xl font-bold text-blue-400 font-mono shrink-0">1943</span>
                                        <span className="text-xs uppercase tracking-wider text-blue-400/60 font-semibold">The Seed</span>
                                    </div>
                                    <p className="text-sm text-white/50 leading-relaxed">{t("neuralNetworkNarrative.history.p1")}</p>
                                </motion.div>

                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="border-l-2 border-emerald-500/30 pl-4"
                                >
                                    <div className="flex items-baseline gap-3 mb-2">
                                        <span className="text-2xl font-bold text-emerald-400 font-mono shrink-0">1958</span>
                                        <span className="text-xs uppercase tracking-wider text-emerald-400/60 font-semibold">First Steps</span>
                                    </div>
                                    <p className="text-sm text-white/50 leading-relaxed">{t("neuralNetworkNarrative.history.p2")}</p>
                                </motion.div>

                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="border-l-2 border-slate-500/30 pl-4"
                                >
                                    <div className="flex items-baseline gap-3 mb-2">
                                        <span className="text-2xl font-bold text-slate-400 font-mono shrink-0">1969</span>
                                        <span className="text-xs uppercase tracking-wider text-slate-400/60 font-semibold">The Winter</span>
                                    </div>
                                    <p className="text-sm text-white/50 leading-relaxed">{t("neuralNetworkNarrative.history.p3")}</p>
                                </motion.div>

                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="border-l-2 border-amber-500/30 pl-4"
                                >
                                    <div className="flex items-baseline gap-3 mb-2">
                                        <span className="text-2xl font-bold text-amber-400 font-mono shrink-0">1986</span>
                                        <span className="text-xs uppercase tracking-wider text-amber-400/60 font-semibold">The Thaw</span>
                                    </div>
                                    <p className="text-sm text-white/50 leading-relaxed">{t("neuralNetworkNarrative.history.p4")}</p>
                                </motion.div>

                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="border-l-2 border-rose-500/30 pl-4"
                                >
                                    <div className="flex items-baseline gap-3 mb-2">
                                        <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400 font-mono shrink-0">2012+</span>
                                        <span className="text-xs uppercase tracking-wider text-rose-400/60 font-semibold">The Bloom</span>
                                    </div>
                                    <p className="text-sm text-white/50 leading-relaxed">{t("neuralNetworkNarrative.history.p5")}</p>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.aside>
    );
}

/* ─────────────────────────────────────────────
   Main narrative component
   ───────────────────────────────────────────── */

export function NeuralNetworkNarrative() {
    const { t } = useI18n();
    const router = useRouter();
    const { mode, setMode } = useLabMode();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [landscapeHistory, setLandscapeHistory] = useState<TrainingStep[]>([]);
    const [landscapeTarget, setLandscapeTarget] = useState(0.8);
    const handleTrainingHistory = useCallback((history: TrainingStep[], target: number) => {
        setLandscapeHistory(history);
        setLandscapeTarget(target);
    }, []);

    return (
        <article className="max-w-[920px] mx-auto px-6 pt-8 pb-24">

            {/* ───────────────────── HERO ───────────────────── */}
            <header className="text-center mb-24 md:mb-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <span className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-rose-400/60 mb-6">
                        <BookOpen className="w-3.5 h-3.5" />
                        {t("neuralNetworkNarrative.hero.eyebrow")}
                    </span>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
                        {t("neuralNetworkNarrative.hero.titlePrefix")}{" "}
                        <span className="bg-gradient-to-r from-rose-400 via-pink-300 to-rose-400 bg-clip-text text-transparent">
                            {t("neuralNetworkNarrative.hero.titleSuffix")}
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-white/35 max-w-xl mx-auto leading-relaxed mb-4">
                        {t("neuralNetworkNarrative.hero.description")}
                    </p>

                    <p className="text-xs font-mono text-white/20 max-w-md mx-auto leading-relaxed mb-12 tracking-wide">
                        {t("neuralNetworkNarrative.hero.recap")}
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

            {/* ─────────── 01 · LET'S TEACH A MACHINE TO LEARN ─────────── */}
            <Section>
                <SectionLabel number={t("neuralNetworkNarrative.sections.discovery.number")} label={t("neuralNetworkNarrative.sections.discovery.label")} />
                <Heading>{t("neuralNetworkNarrative.discovery.heading")}</Heading>
                <Lead>
                    {t("neuralNetworkNarrative.discovery.lead")}<Highlight>{t("neuralNetworkNarrative.discovery.leadHighlight")}</Highlight>
                    {t("neuralNetworkNarrative.discovery.leadEnd")}
                </Lead>

                {/* Part A: Build the recipe step by step */}
                <P>
                    {t("neuralNetworkNarrative.discovery.hookP1")}<Highlight>{t("neuralNetworkNarrative.discovery.hookP1Highlight")}</Highlight>
                    {t("neuralNetworkNarrative.discovery.hookP1End")}
                </P>

                <P>{t("neuralNetworkNarrative.discovery.hookP2")}</P>

                <P>{t("neuralNetworkNarrative.discovery.p1")}</P>

                <FigureWrapper
                    label={t("neuralNetworkNarrative.discovery.fig1Label")}
                    hint={t("neuralNetworkNarrative.discovery.fig1Hint")}
                >
                    <OperationExplorer />
                </FigureWrapper>

                <Challenge
                    question={t("neuralNetworkNarrative.discovery.challenge1.question")}
                    hint={t("neuralNetworkNarrative.discovery.challenge1.hint")}
                    successMessage={t("neuralNetworkNarrative.discovery.challenge1.success")}
                />

                <P>{t("neuralNetworkNarrative.discovery.p2")}</P>

                <FigureWrapper
                    label={t("neuralNetworkNarrative.discovery.fig2Label")}
                    hint={t("neuralNetworkNarrative.discovery.fig2Hint")}
                >
                    <WeightSliderDemo />
                </FigureWrapper>

                <Challenge
                    question={t("neuralNetworkNarrative.discovery.challenge2.question")}
                    hint={t("neuralNetworkNarrative.discovery.challenge2.hint")}
                    successMessage={t("neuralNetworkNarrative.discovery.challenge2.success")}
                />

                <P>{t("neuralNetworkNarrative.discovery.p3")}</P>

                <FigureWrapper
                    label={t("neuralNetworkNarrative.discovery.fig3Label")}
                    hint={t("neuralNetworkNarrative.discovery.fig3Hint")}
                >
                    <BiasDemo />
                </FigureWrapper>

                <Callout accent="rose" title={t("neuralNetworkNarrative.discovery.calloutTitle")}>
                    <p>{t("neuralNetworkNarrative.discovery.calloutText")}</p>
                </Callout>

                {/* Part B: Connect to bigram — letters are numbers (moved after neuron is built) */}
                <FigureWrapper
                    label={t("neuralNetworkNarrative.discovery.letterDemoLabel")}
                    hint={t("neuralNetworkNarrative.discovery.letterDemoHint")}
                >
                    <LetterToNumberDemo />
                </FigureWrapper>

                <P>{t("neuralNetworkNarrative.discovery.bridge")}</P>
            </Section>

            <SectionBreak />

            {/* ─────────── 02 · PUTTING IT TOGETHER ─────────── */}
            <Section>
                <SectionLabel
                    number={t("models.neuralNetworks.sections.artificialNeuron.number")}
                    label={t("models.neuralNetworks.sections.artificialNeuron.label")}
                />
                <Heading>{t("neuralNetworkNarrative.artificialNeuron.title")}</Heading>

                <Lead>{t("neuralNetworkNarrative.artificialNeuron.lead")}</Lead>

                <P>{t("neuralNetworkNarrative.artificialNeuron.p1")}</P>

                <NNPerceptronDiagram />

                <P>{t("neuralNetworkNarrative.artificialNeuron.p2")}</P>

                <P>
                    {t("neuralNetworkNarrative.artificialNeuron.p3")}{" "}
                    <Highlight>{t("neuralNetworkNarrative.artificialNeuron.p3Highlight")}</Highlight>
                    {t("neuralNetworkNarrative.artificialNeuron.p3End")}
                </P>

                <Callout icon={Lightbulb} accent="indigo" title={t("neuralNetworkNarrative.artificialNeuron.calloutTitle")}>
                    <p>{t("neuralNetworkNarrative.artificialNeuron.calloutText")}</p>
                </Callout>

                <P>{t("neuralNetworkNarrative.artificialNeuron.formalizeParagraph")}</P>

                <FormulaBlock
                    formula="y = f\left(\sum_{i=1}^{n} w_i \, x_i + b\right)"
                    caption={t("neuralNetworkNarrative.artificialNeuron.formulaCaptionMoved")}
                />

                {/* ─────────── COLLAPSIBLE HISTORY SIDEBAR ─────────── */}
                <HistorySidebar t={t} />
            </Section>

            <SectionBreak />

            {/* ─────────── 03 · WHAT IF WE ADD MORE NEURONS? ─────────── */}
            <Section>
                <SectionLabel
                    number={t("models.neuralNetworks.sections.nonLinearity.number")}
                    label={t("models.neuralNetworks.sections.nonLinearity.label")}
                />
                <Heading>{t("neuralNetworkNarrative.nonLinearity.title")}</Heading>

                <Lead>{t("neuralNetworkNarrative.nonLinearity.lead")}</Lead>

                {/* Phase A: The linear problem + stacking demo */}
                <P>
                    {t("neuralNetworkNarrative.nonLinearity.linearProblem")}<Highlight color="amber">{t("neuralNetworkNarrative.nonLinearity.linearProblemHighlight")}</Highlight>
                    {t("neuralNetworkNarrative.nonLinearity.linearProblemEnd")}
                </P>

                <P>{t("neuralNetworkNarrative.nonLinearity.stackingIntro")}</P>

                <FigureWrapper
                    label={t("neuralNetworkNarrative.nonLinearity.stackingLabel")}
                    hint={t("neuralNetworkNarrative.nonLinearity.stackingHint")}
                >
                    <LinearStackingDemo />
                </FigureWrapper>

                <P>{t("neuralNetworkNarrative.nonLinearity.stackingOutro")}</P>

                {/* Phase B: Activation functions — the fix */}
                <P>{t("neuralNetworkNarrative.nonLinearity.activationIntro")}</P>

                <NNActivationExplorer />

                <P>
                    {t("neuralNetworkNarrative.nonLinearity.p3")}{" "}
                    <Highlight color="indigo">{t("neuralNetworkNarrative.nonLinearity.p3Highlight")}</Highlight>{" "}
                    {t("neuralNetworkNarrative.nonLinearity.p3End")}
                </P>

                {/* Phase C: Parallel neurons — width */}
                <P>{t("neuralNetworkNarrative.nonLinearity.parallelIntro")}</P>

                <FigureWrapper
                    label={t("neuralNetworkNarrative.parallelNeurons.title")}
                    hint=""
                >
                    <ParallelNeuronsDemo />
                </FigureWrapper>

                <P>{t("neuralNetworkNarrative.nonLinearity.parallelOutro")}</P>

                {/* Phase D: Decision boundaries — what neurons can carve together */}
                <P>{t("neuralNetworkNarrative.nonLinearity.boundaryIntro")}</P>

                <FigureWrapper
                    label={t("neuralNetworkNarrative.decisionBoundary.title")}
                    hint=""
                >
                    <DecisionBoundaryIntro />
                </FigureWrapper>

                <P>{t("neuralNetworkNarrative.nonLinearity.boundaryOutro")}</P>

                <Challenge
                    question={t("neuralNetworkNarrative.nonLinearity.xorChallenge.question")}
                    hint={t("neuralNetworkNarrative.nonLinearity.xorChallenge.hint")}
                    successMessage={t("neuralNetworkNarrative.nonLinearity.xorChallenge.success")}
                />

                <Callout icon={Layers} accent="rose" title={t("neuralNetworkNarrative.nonLinearity.summaryCalloutTitle")}>
                    <p>{t("neuralNetworkNarrative.nonLinearity.summaryCalloutText")}</p>
                </Callout>
            </Section>

            <SectionBreak />

            {/* ─────────── 04 · HOW A NETWORK LEARNS ─────────── */}
            <Section>
                <SectionLabel
                    number={t("models.neuralNetworks.sections.howItLearns.number")}
                    label={t("models.neuralNetworks.sections.howItLearns.label")}
                />
                <Heading>{t("neuralNetworkNarrative.howItLearns.title")}</Heading>

                <Lead>
                    {t("neuralNetworkNarrative.howItLearns.lead")}<Highlight color="indigo">{t("neuralNetworkNarrative.howItLearns.leadHighlight")}</Highlight>
                    {t("neuralNetworkNarrative.howItLearns.leadEnd")}
                </Lead>

                {/* Phase A: The Hook — model is wrong */}
                <P>{t("neuralNetworkNarrative.howItLearns.phaseA.p1")}</P>

                <FigureWrapper
                    label={t("neuralNetworkNarrative.howItLearns.predictionError.title")}
                    hint={t("neuralNetworkNarrative.howItLearns.phaseA.hint")}
                >
                    <PredictionErrorDemo />
                </FigureWrapper>

                <P>{t("neuralNetworkNarrative.howItLearns.phaseA.p2")}</P>

                {/* Phase B: Nudge — what if we change a weight? */}
                <P>{t("neuralNetworkNarrative.howItLearns.phaseB.intro")}</P>

                <FigureWrapper
                    label={t("neuralNetworkNarrative.howItLearns.nudge.title")}
                    hint={t("neuralNetworkNarrative.howItLearns.phaseB.nudgeHint")}
                >
                    <NudgeWeightDemo />
                </FigureWrapper>

                <P>{t("neuralNetworkNarrative.howItLearns.phaseB.discovery")}</P>

                {/* Phase C: The Derivative — measuring sensitivity */}
                <P>{t("neuralNetworkNarrative.howItLearns.phaseC.intro")}</P>

                <FigureWrapper
                    label={t("neuralNetworkNarrative.howItLearns.derivative.title")}
                    hint={t("neuralNetworkNarrative.howItLearns.phaseC.derivativeHint")}
                >
                    <DerivativeIntuitionDemo />
                </FigureWrapper>

                <P>{t("neuralNetworkNarrative.howItLearns.phaseC.nameIt")}</P>

                {/* Phase D: Chain Rule — chained operations */}
                <P>{t("neuralNetworkNarrative.howItLearns.phaseD.intro")}</P>

                <FigureWrapper
                    label={t("neuralNetworkNarrative.howItLearns.chainRule.title")}
                    hint={t("neuralNetworkNarrative.howItLearns.phaseD.chainHint")}
                >
                    <ChainRuleBuilder />
                </FigureWrapper>

                <P>{t("neuralNetworkNarrative.howItLearns.phaseD.nameIt")}</P>

                {/* Phase E: Direction — positive/negative tells us what to do */}
                <P>{t("neuralNetworkNarrative.howItLearns.phaseE.intro")}</P>

                <FigureWrapper
                    label={t("neuralNetworkNarrative.howItLearns.gradientDir.title")}
                    hint={t("neuralNetworkNarrative.howItLearns.phaseE.dirHint")}
                >
                    <GradientDirectionDemo />
                </FigureWrapper>

                <P>{t("neuralNetworkNarrative.howItLearns.phaseE.rule")}</P>

                {/* Phase F: Loss — why square the error */}
                <P>{t("neuralNetworkNarrative.howItLearns.phaseF.intro")}</P>

                <FigureWrapper
                    label={t("neuralNetworkNarrative.howItLearns.lossMotive.title")}
                    hint={t("neuralNetworkNarrative.howItLearns.phaseF.lossHint")}
                >
                    <LossFormulaMotivation />
                </FigureWrapper>

                <P>{t("neuralNetworkNarrative.howItLearns.phaseF.named")}</P>

                {/* Phase G: One Training Step */}
                <P>{t("neuralNetworkNarrative.howItLearns.phaseG.intro")}</P>

                <FigureWrapper
                    label={t("neuralNetworkNarrative.howItLearns.neuronCalc.title")}
                    hint={t("neuralNetworkNarrative.howItLearns.phaseG.calcHint")}
                >
                    <NeuronGradientCalculator />
                </FigureWrapper>

                {/* Phase G.5: One training step → naming */}
                <P>{t("neuralNetworkNarrative.howItLearns.namingTransition")}</P>

                <Callout accent="rose" title={t("neuralNetworkNarrative.howItLearns.naming.title")}>
                    <p>{t("neuralNetworkNarrative.howItLearns.naming.text")}</p>
                </Callout>
            </Section>

            <SectionBreak />

            {/* ─────────── 05 · TRAINING: FROM ONE STEP TO THOUSANDS ─────────── */}
            <Section>
                <SectionLabel
                    number={t("models.neuralNetworks.sections.training.number")}
                    label={t("models.neuralNetworks.sections.training.label")}
                />
                <Heading>{t("neuralNetworkNarrative.training.sectionTitle")}</Heading>

                <Lead>{t("neuralNetworkNarrative.training.sectionLead")}</Lead>

                {/* Phase A: Repeated training */}
                <P>{t("neuralNetworkNarrative.training.repeatedIntro")}</P>

                <FigureWrapper
                    label={t("neuralNetworkNarrative.howItLearns.repeated.title")}
                    hint={t("neuralNetworkNarrative.howItLearns.phaseH.repeatHint")}
                >
                    <RepeatedTrainingDemo />
                </FigureWrapper>

                <Challenge
                    question={t("neuralNetworkNarrative.training.repeatedChallenge.question")}
                    hint={t("neuralNetworkNarrative.training.repeatedChallenge.hint")}
                    successMessage={t("neuralNetworkNarrative.training.repeatedChallenge.success")}
                />

                {/* Phase B: Learning Rate */}
                <P>{t("neuralNetworkNarrative.training.lrIntro")}</P>

                <FigureWrapper
                    label={t("neuralNetworkNarrative.howItLearns.phaseI.lrLabel")}
                    hint={t("neuralNetworkNarrative.howItLearns.phaseI.lrHint")}
                >
                    <LearningRateDemo />
                </FigureWrapper>

                <Challenge
                    question={t("neuralNetworkNarrative.training.lrChallenge.question")}
                    hint={t("neuralNetworkNarrative.training.lrChallenge.hint")}
                    successMessage={t("neuralNetworkNarrative.training.lrChallenge.success")}
                />

                {/* Phase C: Weight Landscape */}
                <P>{t("neuralNetworkNarrative.training.trajectoryIntro")}</P>

                <FigureWrapper
                    label={t("neuralNetworkNarrative.howItLearns.phaseJ.trajectoryLabel")}
                    hint={t("neuralNetworkNarrative.howItLearns.phaseJ.trajectoryHint")}
                >
                    <WeightTrajectoryDemo />
                </FigureWrapper>

                {/* Terminology block — Step + Epoch only */}
                <P>{t("neuralNetworkNarrative.training.terminologyIntro")}</P>

                <div className="my-8 rounded-2xl border border-indigo-500/[0.15] bg-indigo-500/[0.02] p-5 sm:p-6 space-y-4">
                    <div className="flex items-start gap-3">
                        <span className="shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] font-bold text-indigo-400 mt-0.5">S</span>
                        <div>
                            <p className="text-sm font-semibold text-white/70 mb-1">{t("neuralNetworkNarrative.watchingItLearn.termStep")}</p>
                            <p className="text-xs text-white/40">{t("neuralNetworkNarrative.watchingItLearn.termStepDesc")}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] font-bold text-indigo-400 mt-0.5">E</span>
                        <div>
                            <p className="text-sm font-semibold text-white/70 mb-1">{t("neuralNetworkNarrative.watchingItLearn.termEpoch")}</p>
                            <p className="text-xs text-white/40">{t("neuralNetworkNarrative.watchingItLearn.termEpochDesc")}</p>
                        </div>
                    </div>
                </div>

                {/* Phase D: Live training demo + loss landscape */}
                <P>{t("neuralNetworkNarrative.training.liveIntro")}</P>

                <P>{t("neuralNetworkNarrative.training.liveP1")}</P>

                <NNTrainingDemo onHistoryChange={handleTrainingHistory} />

                {landscapeHistory.length > 3 &&
                    landscapeHistory[landscapeHistory.length - 1].loss > landscapeHistory[0].loss && (
                        <Callout icon={AlertTriangle} accent="amber" title={t("neuralNetworkNarrative.watchingItLearn.alertTitle")}>
                            <p>{t("neuralNetworkNarrative.watchingItLearn.alertText")}</p>
                        </Callout>
                    )}

                <p className="text-[10px] font-mono uppercase tracking-widest text-white/25 mt-8 mb-1">
                    {t("neuralNetworkNarrative.watchingItLearn.landscapeTitle")}
                </p>
                <p className="text-sm text-white/50 leading-relaxed mb-2">
                    {t("neuralNetworkNarrative.watchingItLearn.landscapeDesc")}
                </p>

                {landscapeHistory.length > 0 && (
                    <NNLossLandscape history={landscapeHistory} target={landscapeTarget} />
                )}

                {/* Phase E: Supervised learning — collapsible */}
                <Expandable title={t("neuralNetworkNarrative.training.supervisedTitle")}>
                    <p className="text-sm font-semibold text-white/60 mb-4">
                        {t("neuralNetworkNarrative.training.supervisedDef")}
                    </p>
                    <p className="text-xs font-mono uppercase tracking-widest text-white/25 mb-3">
                        {t("neuralNetworkNarrative.training.supervisedExamplesTitle")}
                    </p>
                    <ul className="space-y-2 mb-5">
                        {(["supervisedExample1", "supervisedExample2", "supervisedExample3"] as const).map((key) => (
                            <li key={key} className="flex items-start gap-2 text-sm text-white/45">
                                <span className="shrink-0 text-rose-400/50 mt-0.5">→</span>
                                {t(`neuralNetworkNarrative.training.${key}`)}
                            </li>
                        ))}
                    </ul>
                    <p className="text-xs text-white/30 italic border-t border-white/[0.06] pt-4">
                        {t("neuralNetworkNarrative.training.supervisedNote")}
                    </p>
                </Expandable>
            </Section>

            <SectionBreak />

            {/* ─────────── 06 · FROM NUMBERS TO LETTERS ─────────── */}
            <Section>
                <SectionLabel
                    number={t("models.neuralNetworks.sections.fromNumbers.number")}
                    label={t("models.neuralNetworks.sections.fromNumbers.label")}
                />
                <Heading>{t("neuralNetworkNarrative.fromNumbers.title")}</Heading>

                <Lead>{t("neuralNetworkNarrative.fromNumbers.lead")}</Lead>

                {/* Step 1: Where does training data come from? */}
                <P>
                    {t("neuralNetworkNarrative.fromNumbers.trainingDataIntro")}<Highlight>{t("neuralNetworkNarrative.fromNumbers.trainingDataIntroHighlight")}</Highlight>
                    {t("neuralNetworkNarrative.fromNumbers.trainingDataIntroEnd")}
                </P>

                <FigureWrapper
                    label={t("neuralNetworkNarrative.training.textDemo.title")}
                    hint={t("neuralNetworkNarrative.watchingItLearn.textDemoHint")}
                >
                    <TrainingWithTextDemo />
                </FigureWrapper>

                {/* Step 2: The network diagram */}
                <P>{t("neuralNetworkNarrative.fromNumbers.p1")}</P>

                <FigureWrapper
                    label={t("neuralNetworkNarrative.fromNumbers.networkViz.label")}
                    hint={t("neuralNetworkNarrative.fromNumbers.networkViz.hint")}
                >
                    <OutputLayerNetworkVisualizer />
                </FigureWrapper>

                <P>{t("neuralNetworkNarrative.fromNumbers.p2")}</P>

                <FigureWrapper
                    label={t("neuralNetworkNarrative.fromNumbers.softmax.title")}
                    hint={t("neuralNetworkNarrative.fromNumbers.softmaxHint")}
                >
                    <SoftmaxTransformDemo />
                </FigureWrapper>

                <P>{t("neuralNetworkNarrative.fromNumbers.p3")}</P>

                <P>{t("neuralNetworkNarrative.fromNumbers.p4")}</P>

                <FigureWrapper
                    label={t("neuralNetworkNarrative.fromNumbers.comparisonLabel")}
                    hint={t("neuralNetworkNarrative.fromNumbers.comparisonHint")}
                >
                    <NNBigramComparison />
                </FigureWrapper>

                <P>{t("neuralNetworkNarrative.fromNumbers.p5")}</P>

                <Callout accent="amber" title={t("neuralNetworkNarrative.fromNumbers.whyCalloutTitle")}>
                    <p>{t("neuralNetworkNarrative.fromNumbers.whyCalloutText")}</p>
                </Callout>

                <P>{t("neuralNetworkNarrative.fromNumbers.p6")}</P>
            </Section>

            <SectionBreak />

            {/* ─────────── 07 · THE RISK OF OVERFITTING ─────────── */}
            <Section>
                <SectionLabel
                    number={t("models.neuralNetworks.sections.overfitting.number")}
                    label={t("models.neuralNetworks.sections.overfitting.label")}
                />
                <Heading>{t("neuralNetworkNarrative.overfitting.heading")}</Heading>

                <Lead>{t("neuralNetworkNarrative.overfitting.lead")}</Lead>

                <P>{t("neuralNetworkNarrative.overfitting.p1")}</P>
                <P>{t("neuralNetworkNarrative.overfitting.p2")}</P>
                <P>{t("neuralNetworkNarrative.overfitting.p3")}</P>

                <Callout icon={AlertTriangle} accent="amber" title={t("neuralNetworkNarrative.overfitting.callout1Title")}>
                    <p>{t("neuralNetworkNarrative.overfitting.callout1Text")}</p>
                </Callout>

                <FigureWrapper
                    label={t("neuralNetworkNarrative.overfitting.visual1Label")}
                    hint={t("neuralNetworkNarrative.overfitting.visual1Hint")}
                >
                    <OverfittingComparisonDiagram />
                </FigureWrapper>

                <FigureWrapper
                    label={t("neuralNetworkNarrative.overfitting.visual2Label")}
                    hint={t("neuralNetworkNarrative.overfitting.visual2Hint")}
                >
                    <TrainValLossCurveVisualizer />
                </FigureWrapper>

                <P>{t("neuralNetworkNarrative.overfitting.p4")}</P>
                <P>{t("neuralNetworkNarrative.overfitting.p5")}</P>

                <Callout icon={Lightbulb} accent="emerald" title={t("neuralNetworkNarrative.overfitting.callout2Title")}>
                    <p>{t("neuralNetworkNarrative.overfitting.callout2Text")}</p>
                </Callout>

                <P>{t("neuralNetworkNarrative.overfitting.conclusion")}</P>
            </Section>

            {/* ───────────────── CTA ───────────────── */}
            <Section>
                <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-3">
                        {t("neuralNetworkNarrative.cta.title")}
                    </h2>
                    <p className="text-sm text-white/40 max-w-lg mx-auto leading-relaxed">
                        {t("neuralNetworkNarrative.cta.subtitle")}
                    </p>
                </div>

                {/* What's Next preview */}
                <div className="mb-8 rounded-2xl border border-violet-500/[0.15] bg-violet-500/[0.03] p-5 sm:p-6">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-violet-400/50 mb-4">
                        {t("neuralNetworkNarrative.cta.whatsNextTitle")}
                    </p>
                    <ul className="space-y-3">
                        {(["whatsNext1", "whatsNext2", "whatsNext3"] as const).map((key, i) => (
                            <li key={key} className="flex items-start gap-3">
                                <span className="shrink-0 w-5 h-5 rounded-full bg-violet-500/20 flex items-center justify-center text-[10px] font-bold text-violet-400 mt-0.5">
                                    {i + 1}
                                </span>
                                <span className="text-sm text-white/50 leading-relaxed">
                                    {t(`neuralNetworkNarrative.cta.${key}`)}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setMode("free")}
                        className="group relative rounded-2xl border border-rose-500/20 bg-gradient-to-br from-rose-950/20 to-black/60 p-6 text-left transition-colors hover:border-rose-500/40 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        <div className="relative">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 rounded-xl bg-rose-500/15">
                                    <Beaker className="w-5 h-5 text-rose-300" />
                                </div>
                                <span className="text-lg font-bold text-white">
                                    {t("neuralNetworkNarrative.cta.labButton")}
                                </span>
                            </div>
                            <p className="text-sm text-white/45 leading-relaxed">
                                {t("neuralNetworkNarrative.cta.labDesc")}
                            </p>
                        </div>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => router.push("/lab/mlp")}
                        className="group relative rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-950/20 to-black/60 p-6 text-left transition-colors hover:border-violet-500/40 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        <div className="relative">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 rounded-xl bg-violet-500/15">
                                    <Layers className="w-5 h-5 text-violet-300" />
                                </div>
                                <span className="text-lg font-bold text-white">
                                    {t("neuralNetworkNarrative.cta.mlpButton")}
                                </span>
                            </div>
                            <p className="text-sm text-white/45 leading-relaxed">
                                {t("neuralNetworkNarrative.cta.mlpDesc")}
                            </p>
                        </div>
                    </motion.button>
                </div>
            </Section>

            {/* ───────────────── CODA ───────────────── */}
            <motion.footer
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-8 pt-12 border-t border-white/[0.06] text-center"
            >
                <p className="text-sm text-white/25 italic max-w-md mx-auto leading-relaxed mb-10">
                    {t("neuralNetworkNarrative.footer.text")}
                </p>
                <div className="flex items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-widest text-white/10">
                    <FlaskConical className="h-3 w-3" />
                    {t("neuralNetworkNarrative.footer.brand")}
                </div>
            </motion.footer>
        </article >
    );
}

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
import { NNBackpropVisualizer } from "@/components/lab/NNBackpropVisualizer";
import { NNTrainingDemo } from "@/components/lab/NNTrainingDemo";
import type { TrainingStep } from "@/components/lab/NNTrainingDemo";
import { NNLossLandscape } from "@/components/lab/NNLossLandscape";
import { NNBigramComparison } from "@/components/lab/NNBigramComparison";
import { XORDecisionBoundary } from "@/components/lab/XORDecisionBoundary";
import { BatchGradientNoiseVisualizer } from "@/components/lab/BatchGradientNoiseVisualizer";
import { BatchSizeLossCurveComparison } from "@/components/lab/BatchSizeLossCurveComparison";
import { OverfittingComparisonDiagram } from "@/components/lab/OverfittingComparisonDiagram";
import { TrainValLossCurveVisualizer } from "@/components/lab/TrainValLossCurveVisualizer";

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
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-rose-500/10 border border-rose-500/20 text-[11px] font-mono font-bold text-rose-400">
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

function FigureWrapper({ label, hint, children }: { label: string; hint: string; children: React.ReactNode }) {
    return (
        <div className="my-8 -mx-2 sm:mx-0 rounded-2xl border border-white/[0.07] bg-white/[0.015] overflow-hidden">
            <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">{label}</span>
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

                    <p className="text-lg md:text-xl text-white/35 max-w-xl mx-auto leading-relaxed mb-12">
                        {t("neuralNetworkNarrative.hero.description")}
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

            {/* ─────────── 01 · THE ARTIFICIAL NEURON ─────────── */}
            <Section>
                <SectionLabel
                    number={t("models.neuralNetworks.sections.artificialNeuron.number")}
                    label={t("models.neuralNetworks.sections.artificialNeuron.label")}
                />
                <Heading>{t("neuralNetworkNarrative.artificialNeuron.title")}</Heading>

                <Lead>{t("neuralNetworkNarrative.artificialNeuron.lead")}</Lead>

                <P>
                    {t("neuralNetworkNarrative.artificialNeuron.p1")}{" "}
                    <Highlight>{t("neuralNetworkNarrative.artificialNeuron.p1Highlight")}</Highlight>
                    {t("neuralNetworkNarrative.artificialNeuron.p1End")}
                </P>

                <P>{t("neuralNetworkNarrative.artificialNeuron.p2")}</P>

                <FormulaBlock
                    formula="y = f\left(\sum_{i=1}^{n} w_i \, x_i + b\right)"
                    caption={t("neuralNetworkNarrative.artificialNeuron.formulaCaption")}
                />

                {/* Visual Formula Example */}
                <div className="my-8 -mx-2 sm:mx-0 rounded-2xl border border-indigo-500/[0.15] bg-indigo-500/[0.02] overflow-hidden">
                    <div className="flex items-center gap-3 px-5 py-3 border-b border-indigo-500/[0.1] bg-indigo-500/[0.03]">
                        <Lightbulb className="w-4 h-4 text-indigo-400" />
                        <span className="text-xs font-mono uppercase tracking-widest text-indigo-400/80">{t("neuralNetworkNarrative.artificialNeuron.walkthrough.title")}</span>
                    </div>
                    <div className="p-5 sm:p-6">
                        <p className="text-sm text-white/50 mb-2">
                            <strong className="text-indigo-400">{t("neuralNetworkNarrative.artificialNeuron.walkthrough.scenarioTitle")}</strong> {t("neuralNetworkNarrative.artificialNeuron.walkthrough.scenarioText")}
                        </p>
                        <p className="text-xs text-white/40 mb-6">
                            {t("neuralNetworkNarrative.artificialNeuron.walkthrough.intro")}
                        </p>

                        {/* Step 1: Inputs */}
                        <div className="mb-4 rounded-xl border border-white/[0.08] bg-white/[0.015] p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400">1</div>
                                <span className="text-sm font-semibold text-white/70">{t("neuralNetworkNarrative.artificialNeuron.walkthrough.step1")}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] px-3 py-2">
                                    <span className="text-white/40 text-xs block mb-1">{t("lab.playground.inputs.x1Label")}</span>
                                    <span className="font-mono font-bold text-white/70">0.8</span>
                                    <span className="text-[10px] text-white/30 block mt-0.5">{t("lab.playground.inputs.scaleHint")}</span>
                                </div>
                                <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] px-3 py-2">
                                    <span className="text-white/40 text-xs block mb-1">{t("lab.playground.inputs.x2Label")}</span>
                                    <span className="font-mono font-bold text-white/70">0.6</span>
                                    <span className="text-[10px] text-white/30 block mt-0.5">{t("lab.playground.inputs.scaleHint")}</span>
                                </div>
                            </div>
                        </div>

                        {/* Step 2: Multiply by Weights */}
                        <div className="mb-4 rounded-xl border border-white/[0.08] bg-white/[0.015] p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400">2</div>
                                <span className="text-sm font-semibold text-white/70">{t("neuralNetworkNarrative.artificialNeuron.walkthrough.step2")}</span>
                            </div>
                            <p className="text-xs text-white/40 mb-3">
                                {t("neuralNetworkNarrative.artificialNeuron.walkthrough.step2Desc")}
                            </p>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <code className="font-mono text-xs bg-rose-500/[0.08] border border-rose-500/[0.15] px-2 py-1 rounded text-rose-400">
                                        w₁ = 1.5
                                    </code>
                                    <span className="text-white/30">×</span>
                                    <code className="font-mono text-xs bg-white/[0.04] border border-white/[0.06] px-2 py-1 rounded">
                                        x₁ = 0.8
                                    </code>
                                    <span className="text-white/30">=</span>
                                    <code className="font-mono text-xs bg-white/[0.04] border border-white/[0.06] px-2 py-1 rounded font-bold">
                                        1.2
                                    </code>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <code className="font-mono text-xs bg-rose-500/[0.08] border border-rose-500/[0.15] px-2 py-1 rounded text-rose-400">
                                        w₂ = 0.3
                                    </code>
                                    <span className="text-white/30">×</span>
                                    <code className="font-mono text-xs bg-white/[0.04] border border-white/[0.06] px-2 py-1 rounded">
                                        x₂ = 0.6
                                    </code>
                                    <span className="text-white/30">=</span>
                                    <code className="font-mono text-xs bg-white/[0.04] border border-white/[0.06] px-2 py-1 rounded font-bold">
                                        0.18
                                    </code>
                                </div>
                            </div>
                            <p className="text-xs text-white/30 italic mt-3">
                                {t("neuralNetworkNarrative.artificialNeuron.walkthrough.step2Hint")}
                            </p>
                        </div>

                        {/* Step 3: Sum Everything */}
                        <div className="mb-4 rounded-xl border border-white/[0.08] bg-white/[0.015] p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400">3</div>
                                <span className="text-sm font-semibold text-white/70">{t("neuralNetworkNarrative.artificialNeuron.walkthrough.step3")}</span>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <code className="font-mono text-xs bg-white/[0.04] px-2 py-1 rounded border border-white/[0.06]">
                                    1.2 + 0.18 = <span className="text-white/70 font-bold">1.38</span>
                                </code>
                            </div>
                            <p className="text-xs text-white/35 italic mt-2">
                                {t("neuralNetworkNarrative.artificialNeuron.walkthrough.step3Hint")}
                            </p>
                        </div>

                        {/* Step 4: Add Bias */}
                        <div className="mb-4 rounded-xl border border-white/[0.08] bg-white/[0.015] p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400">4</div>
                                <span className="text-sm font-semibold text-white/70">{t("neuralNetworkNarrative.artificialNeuron.walkthrough.step4")}</span>
                            </div>
                            <p className="text-xs text-white/40 mb-3">
                                {t("neuralNetworkNarrative.artificialNeuron.walkthrough.step4Desc")}
                            </p>
                            <div className="flex items-center gap-2 flex-wrap">
                                <code className="font-mono text-xs bg-white/[0.04] px-2 py-1 rounded border border-white/[0.06]">
                                    1.38
                                </code>
                                <span className="text-white/30">+</span>
                                <code className="font-mono text-xs bg-amber-500/[0.08] border border-amber-500/[0.15] px-2 py-1 rounded text-amber-400">
                                    b = −0.5
                                </code>
                                <span className="text-white/30">=</span>
                                <code className="font-mono text-xs bg-white/[0.04] px-2 py-1 rounded border border-white/[0.06] font-bold">
                                    z = 0.88
                                </code>
                            </div>
                            <p className="text-xs text-white/30 italic mt-2">
                                {t("neuralNetworkNarrative.artificialNeuron.walkthrough.step4Hint")}
                            </p>
                        </div>

                        {/* Step 5: Activation */}
                        <div className="mb-4 rounded-xl border border-white/[0.08] bg-white/[0.015] p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400">5</div>
                                <span className="text-sm font-semibold text-white/70">{t("neuralNetworkNarrative.artificialNeuron.walkthrough.step5")}</span>
                            </div>
                            <p className="text-xs text-white/40 mb-3">
                                {t("neuralNetworkNarrative.artificialNeuron.walkthrough.step5Desc")}
                            </p>
                            <div className="flex items-center gap-2 flex-wrap">
                                <code className="font-mono text-xs bg-white/[0.04] px-2 py-1 rounded border border-white/[0.06]">
                                    y = ReLU(0.88) = max(0, 0.88) = <span className="text-emerald-400 font-bold">0.88</span>
                                </code>
                            </div>
                            <p className="text-xs text-white/35 italic mt-2">
                                {t("neuralNetworkNarrative.artificialNeuron.walkthrough.step5Hint")}
                            </p>
                        </div>

                        {/* Final Result */}
                        <div className="rounded-xl border border-indigo-500/[0.2] bg-gradient-to-br from-indigo-500/[0.08] to-transparent p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-semibold text-indigo-400">✓ {t("neuralNetworkNarrative.artificialNeuron.walkthrough.resultTitle")}</span>
                            </div>
                            <p className="text-sm text-white/60">
                                {t("neuralNetworkNarrative.artificialNeuron.walkthrough.resultTextPart")}{" "}
                                <code className="font-mono font-bold text-emerald-400 bg-white/[0.04] px-2 py-0.5 rounded">0.88</code>
                            </p>
                            <p className="text-xs text-indigo-300/60 mt-2">
                                {t("neuralNetworkNarrative.artificialNeuron.walkthrough.resultDesc")}
                            </p>
                        </div>

                        <div className="mt-5 pt-4 border-t border-white/[0.06] text-xs text-white/35 italic text-center">
                            {t("neuralNetworkNarrative.artificialNeuron.walkthrough.finalNote")}
                        </div>
                    </div>
                </div>

                <NNPerceptronDiagram />

                <P>
                    {t("neuralNetworkNarrative.artificialNeuron.p3")}{" "}
                    <Highlight>{t("neuralNetworkNarrative.artificialNeuron.p3Highlight")}</Highlight>
                    {t("neuralNetworkNarrative.artificialNeuron.p3End")}
                </P>

                <Callout icon={Lightbulb} accent="indigo" title={t("neuralNetworkNarrative.artificialNeuron.calloutTitle")}>
                    <p>{t("neuralNetworkNarrative.artificialNeuron.calloutText")}</p>
                </Callout>

                {/* ─────────── COLLAPSIBLE HISTORY SIDEBAR ─────────── */}
                <HistorySidebar t={t} />
            </Section>

            <SectionBreak />

            {/* ─────────── 02 · WHY NON-LINEARITY? ─────────── */}
            <Section>
                <SectionLabel
                    number={t("models.neuralNetworks.sections.nonLinearity.number")}
                    label={t("models.neuralNetworks.sections.nonLinearity.label")}
                />
                <Heading>{t("neuralNetworkNarrative.nonLinearity.title")}</Heading>

                <Lead>{t("neuralNetworkNarrative.nonLinearity.lead")}</Lead>

                <P>{t("neuralNetworkNarrative.nonLinearity.p1")}</P>

                <P>{t("neuralNetworkNarrative.nonLinearity.p2")}</P>

                <NNActivationExplorer />

                <P>
                    {t("neuralNetworkNarrative.nonLinearity.p3")}{" "}
                    <Highlight color="indigo">{t("neuralNetworkNarrative.nonLinearity.p3Highlight")}</Highlight>{" "}
                    {t("neuralNetworkNarrative.nonLinearity.p3End")}
                </P>
            </Section>

            <SectionBreak />

            {/* ─────────── 03 · HOW A NETWORK LEARNS ─────────── */}
            <Section>
                <SectionLabel
                    number={t("models.neuralNetworks.sections.howItLearns.number")}
                    label={t("models.neuralNetworks.sections.howItLearns.label")}
                />
                <Heading>{t("neuralNetworkNarrative.howItLearns.title")}</Heading>

                <Lead>{t("neuralNetworkNarrative.howItLearns.lead")}</Lead>

                <P>
                    {t("neuralNetworkNarrative.howItLearns.p1")}{" "}
                    <Highlight>{t("neuralNetworkNarrative.howItLearns.p1Highlight")}</Highlight>
                    {t("neuralNetworkNarrative.howItLearns.p1End")}
                </P>

                {/* Visual Training Example */}
                <div className="my-10 -mx-2 sm:mx-0 rounded-2xl border border-amber-500/[0.15] bg-amber-500/[0.02] overflow-hidden">
                    <div className="flex items-center gap-3 px-5 py-3 border-b border-amber-500/[0.1] bg-amber-500/[0.03]">
                        <Lightbulb className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-mono uppercase tracking-widest text-amber-400/80">{t("neuralNetworkNarrative.howItLearns.workedExample.title")}</span>
                    </div>
                    <div className="p-5 sm:p-6">
                        <p className="text-sm text-white/50 mb-6">
                            {t("neuralNetworkNarrative.howItLearns.workedExample.intro")}
                        </p>

                        {/* Step 1: Setup */}
                        <div className="mb-4 rounded-xl border border-white/[0.08] bg-white/[0.015] p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400">1</div>
                                <span className="text-sm font-semibold text-white/70">{t("neuralNetworkNarrative.howItLearns.workedExample.step1Title")}</span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                                <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] px-3 py-2">
                                    <span className="text-white/40 block mb-1">{t("lab.playground.inputs.xLabel")}</span>
                                    <span className="font-mono font-bold text-white/70">1.0</span>
                                </div>
                                <div className="rounded-lg bg-rose-500/[0.08] border border-rose-500/[0.15] px-3 py-2">
                                    <span className="text-rose-300/60 block mb-1">{t("lab.playground.inputs.wLabel")}</span>
                                    <span className="font-mono font-bold text-rose-400">0.50</span>
                                </div>
                                <div className="rounded-lg bg-amber-500/[0.08] border border-amber-500/[0.15] px-3 py-2">
                                    <span className="text-amber-300/60 block mb-1">{t("lab.playground.inputs.bLabel")}</span>
                                    <span className="font-mono font-bold text-amber-400">−0.20</span>
                                </div>
                                <div className="rounded-lg bg-indigo-500/[0.08] border border-indigo-500/[0.15] px-3 py-2">
                                    <span className="text-indigo-300/60 block mb-1">{t("lab.playground.inputs.targetLabel")}</span>
                                    <span className="font-mono font-bold text-indigo-400">0.80</span>
                                </div>
                            </div>
                            <p className="text-xs text-white/40 mt-3">{t("neuralNetworkNarrative.howItLearns.workedExample.step1Text")}</p>
                        </div>

                        {/* Step 2: Forward Pass */}
                        <div className="mb-4 rounded-xl border border-white/[0.08] bg-white/[0.015] p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400">2</div>
                                <span className="text-sm font-semibold text-white/70">{t("neuralNetworkNarrative.howItLearns.workedExample.step2Title")}</span>
                            </div>
                            <div className="space-y-2 text-sm text-white/50">
                                <div className="flex items-center gap-2">
                                    <span className="text-white/40">{t("neuralNetworkNarrative.howItLearns.workedForward")}:</span>
                                </div>
                                <p className="text-xs text-white/35 italic mt-2">
                                    {t("neuralNetworkNarrative.howItLearns.workedExample.step2Text")}
                                </p>
                            </div>
                        </div>

                        {/* Step 3: Loss */}
                        <div className="mb-4 rounded-xl border border-white/[0.08] bg-white/[0.015] p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400">3</div>
                                <span className="text-sm font-semibold text-white/70">{t("neuralNetworkNarrative.howItLearns.workedExample.step3Title")}</span>
                            </div>
                            <div className="space-y-2 text-sm text-white/50">
                                <p className="text-xs text-white/35 italic">
                                    {t("neuralNetworkNarrative.howItLearns.workedExample.step3Text")}
                                </p>
                            </div>
                        </div>

                        {/* Step 4: Backward Pass */}
                        <div className="mb-4 rounded-xl border border-white/[0.08] bg-white/[0.015] p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400">4</div>
                                <span className="text-sm font-semibold text-white/70">{t("neuralNetworkNarrative.howItLearns.workedExample.step4Title")}</span>
                            </div>
                            <div className="space-y-2 text-sm text-white/50">
                                <p className="text-xs text-white/40 mb-2">
                                    {t("neuralNetworkNarrative.howItLearns.workedExample.step4Text")}
                                </p>
                            </div>
                        </div>

                        {/* Step 5: Update */}
                        <div className="rounded-xl border border-amber-500/[0.2] bg-gradient-to-br from-amber-500/[0.08] to-transparent p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-6 h-6 rounded-full bg-amber-500/30 flex items-center justify-center text-xs font-bold text-amber-400">5</div>
                                <span className="text-sm font-semibold text-amber-400">{t("neuralNetworkNarrative.howItLearns.workedExample.step5Title")}</span>
                            </div>
                            <div className="space-y-2 text-sm text-white/50">
                                <p className="text-xs text-amber-300/60 font-semibold mt-3">
                                    {t("neuralNetworkNarrative.howItLearns.workedExample.step5Text")}
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 pt-4 border-t border-white/[0.06] text-xs text-white/35 italic text-center">
                            {t("neuralNetworkNarrative.howItLearns.workedUpdateNote")}
                        </div>
                    </div>
                </div>

                <P>
                    {t("neuralNetworkNarrative.howItLearns.p2")}{" "}
                    <Highlight color="amber">{t("neuralNetworkNarrative.howItLearns.p2Highlight")}</Highlight>
                    {t("neuralNetworkNarrative.howItLearns.p2End")}
                </P>

                <NNBackpropVisualizer />

                <FormulaBlock
                    formula="w \leftarrow w - \eta \, \frac{\partial \mathcal{L}}{\partial w}"
                    caption={t("neuralNetworkNarrative.howItLearns.formulaCaption")}
                />

                <P>{t("neuralNetworkNarrative.howItLearns.p3")}</P>
            </Section >

            <SectionBreak />

            {/* ─────────── 04 · WATCHING IT LEARN ─────────── */}
            <Section>
                <SectionLabel
                    number={t("models.neuralNetworks.sections.watchingItLearn.number")}
                    label={t("models.neuralNetworks.sections.watchingItLearn.label")}
                />
                <Heading>{t("neuralNetworkNarrative.watchingItLearn.title")}</Heading>

                <Lead>{t("neuralNetworkNarrative.watchingItLearn.lead")}</Lead>

                <P>{t("neuralNetworkNarrative.watchingItLearn.p1")}</P>

                <NNTrainingDemo onHistoryChange={handleTrainingHistory} />

                {landscapeHistory.length > 3 &&
                    landscapeHistory[landscapeHistory.length - 1].loss > landscapeHistory[0].loss && (
                        <Callout icon={AlertTriangle} accent="amber" title={t("neuralNetworkNarrative.watchingItLearn.alertTitle")}>
                            <p>
                                {t("neuralNetworkNarrative.watchingItLearn.alertText")}
                            </p>
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

                <P>{t("neuralNetworkNarrative.watchingItLearn.p2")}</P>

                {/* ─────────── THE MINI-BATCH REVOLUTION ─────────── */}
                <motion.aside
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    className="my-12 rounded-2xl border border-rose-500/20 overflow-hidden relative"
                >
                    <button
                        onClick={() => {
                            const elem = document.getElementById('minibatch-content');
                            if (elem) elem.classList.toggle('hidden');
                        }}
                        className="w-full flex items-center gap-4 px-6 py-5 text-left group transition-all duration-300 relative bg-gradient-to-br from-rose-500/[0.08] via-pink-500/[0.04] to-rose-500/[0.06] hover:from-rose-500/[0.12] hover:via-pink-500/[0.06] hover:to-rose-500/[0.08]"
                    >
                        <div className="shrink-0 p-2.5 rounded-xl bg-gradient-to-br from-rose-500/20 to-pink-500/20 ring-1 ring-rose-500/30 group-hover:ring-rose-500/50 transition-all">
                            <Beaker className="w-5 h-5 text-rose-300" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-200 to-rose-200 mb-1">
                                {t("neuralNetworkNarrative.howItLearns.batching.title")}
                            </p>
                            <p className="text-xs text-white/40 leading-relaxed">
                                {t("neuralNetworkNarrative.howItLearns.batching.lead")}
                            </p>
                        </div>
                        <motion.div
                            animate={{ rotate: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="shrink-0"
                        >
                            <ChevronDown className="w-5 h-5 text-rose-400/60 group-hover:text-rose-400 transition-colors" />
                        </motion.div>
                    </button>

                    <div id="minibatch-content" className="hidden bg-black">
                        <div className="px-6 py-6 border-t border-white/[0.04]">
                            <div className="space-y-5 mb-8">
                                <p className="text-sm text-white/50 leading-relaxed">
                                    Computing gradients one example at a time is inefficient. Modern GPUs process hundreds in parallel. Instead of updating after every example, we average gradients from a small batch — typically <span className="text-violet-400 font-semibold">32 to 256</span> — and update once per batch. This is mini-batch gradient descent.
                                </p>

                                <p className="text-sm text-white/50 leading-relaxed">
                                    Batch size controls a fundamental trade-off. Size <span className="text-red-400 font-semibold">1</span> (SGD) gives noisy gradients. <span className="text-blue-400 font-semibold">Full dataset</span> gives smooth gradients but is slow and can overfit. Mini-batches balance stable gradients with efficient computation.
                                </p>

                                <p className="text-sm text-white/50 leading-relaxed">
                                    The noise isn't just necessary — it's helpful. Noisy gradients help escape local minima and improve generalization on unseen data.
                                </p>
                            </div>

                            {/* Visual Comparison Cards */}
                            <div className="grid md:grid-cols-3 gap-4 my-8">
                                {/* Batch Size = 1 */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    viewport={{ once: true }}
                                    className="rounded-xl border border-red-500/20 p-4"
                                >
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                                            <span className="text-sm font-bold text-red-400">1</span>
                                        </div>
                                        <span className="text-xs font-semibold text-red-300">Single Example</span>
                                    </div>
                                    <p className="text-xs text-white/45 leading-relaxed mb-3">
                                        Updates after every single example. Fast iterations but noisy, erratic gradients.
                                    </p>
                                    <div className="flex items-center gap-1.5">
                                        <div className="flex-1 h-1.5 rounded-full bg-red-500/20">
                                            <div className="h-full w-3/4 rounded-full bg-red-500/60" />
                                        </div>
                                        <span className="text-[10px] text-red-400/60 font-mono">Noisy</span>
                                    </div>
                                </motion.div>

                                {/* Batch Size = 32 */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    viewport={{ once: true }}
                                    className="rounded-xl border border-violet-500/20 p-4 ring-2 ring-violet-500/30"
                                >
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                                            <span className="text-sm font-bold text-violet-300">32</span>
                                        </div>
                                        <span className="text-xs font-semibold text-violet-200">Mini-Batch ✓</span>
                                    </div>
                                    <p className="text-xs text-white/45 leading-relaxed mb-3">
                                        Sweet spot: smooth gradients, good GPU utilization, faster convergence.
                                    </p>
                                    <div className="flex items-center gap-1.5">
                                        <div className="flex-1 h-1.5 rounded-full bg-violet-500/20">
                                            <div className="h-full w-full rounded-full bg-violet-500/70" />
                                        </div>
                                        <span className="text-[10px] text-violet-300 font-mono">Optimal</span>
                                    </div>
                                </motion.div>

                                {/* Full Batch */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    viewport={{ once: true }}
                                    className="rounded-xl border border-blue-500/20 p-4"
                                >
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                            <span className="text-[10px] font-bold text-blue-400">ALL</span>
                                        </div>
                                        <span className="text-xs font-semibold text-blue-300">Full Batch</span>
                                    </div>
                                    <p className="text-xs text-white/45 leading-relaxed mb-3">
                                        Uses entire dataset. Smooth but slow, memory-hungry, poor generalization.
                                    </p>
                                    <div className="flex items-center gap-1.5">
                                        <div className="flex-1 h-1.5 rounded-full bg-blue-500/20">
                                            <div className="h-full w-2/5 rounded-full bg-blue-500/60" />
                                        </div>
                                        <span className="text-[10px] text-blue-400/60 font-mono">Slow</span>
                                    </div>
                                </motion.div>
                            </div>

                            <Callout icon={Lightbulb} accent="indigo" title={t("neuralNetworkNarrative.howItLearns.batching.calloutTitle")}>
                                <p>{t("neuralNetworkNarrative.howItLearns.batching.calloutText")}</p>
                            </Callout>

                            {/* New: Interactive Batch Size Comparison */}
                            <FigureWrapper
                                label="Interactive · Batch Size Impact on Training"
                                hint="Compare how different batch sizes affect training speed and gradient quality"
                            >
                                <BatchSizeLossCurveComparison />
                            </FigureWrapper>

                            <P>{t("neuralNetworkNarrative.howItLearns.batching.conclusion")}</P>
                        </div>
                    </div>
                </motion.aside>
            </Section>

            <SectionBreak />

            {/* ─────────── 05 · THE RISK OF OVERFITTING ─────────── */}
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

            <SectionBreak />

            {/* ─────────── 06 · THE BRIDGE: TABLES TO PARAMETERS ─────────── */}
            <Section>
                <SectionLabel
                    number={t("models.neuralNetworks.sections.bridge.number")}
                    label={t("models.neuralNetworks.sections.bridge.label")}
                />
                <Heading>{t("neuralNetworkNarrative.bridge.title")}</Heading>

                <Lead>{t("neuralNetworkNarrative.bridge.lead")}</Lead>

                <P>{t("neuralNetworkNarrative.bridge.p1")}</P>

                <P>
                    {t("neuralNetworkNarrative.bridge.p2")}{" "}
                    <Highlight color="emerald">{t("neuralNetworkNarrative.bridge.p2Highlight")}</Highlight>
                    {t("neuralNetworkNarrative.bridge.p2End")}
                </P>

                <Callout icon={Lightbulb} accent="rose" title={t("neuralNetworkNarrative.bridge.insightTitle")}>
                    <p>{t("neuralNetworkNarrative.bridge.insightText")}</p>
                </Callout>

                <NNBigramComparison />

                <P>{t("neuralNetworkNarrative.bridge.p3")}</P>
            </Section>

            <SectionBreak />

            {/* ─────────── 07 · POWER, LIMITS, AND WHAT COMES NEXT ─────────── */}
            <Section>
                <SectionLabel
                    number={t("models.neuralNetworks.sections.powerAndLimits.number")}
                    label={t("models.neuralNetworks.sections.powerAndLimits.label")}
                />
                <Heading>{t("neuralNetworkNarrative.powerAndLimits.title")}</Heading>

                <Lead>{t("neuralNetworkNarrative.powerAndLimits.lead")}</Lead>

                <P>
                    {t("neuralNetworkNarrative.powerAndLimits.p1")}{" "}
                    <Highlight>{t("neuralNetworkNarrative.powerAndLimits.p1Highlight")}</Highlight>{" "}
                    {t("neuralNetworkNarrative.powerAndLimits.p1End")}
                </P>

                <Callout icon={AlertTriangle} accent="amber" title="XOR Problem">
                    <p>{t("neuralNetworkNarrative.powerAndLimits.p2")}</p>
                </Callout>

                <XORDecisionBoundary />

                <P>{t("neuralNetworkNarrative.powerAndLimits.p3")}</P>

                <P>{t("neuralNetworkNarrative.powerAndLimits.p4")}</P>

                <Callout icon={Layers} accent="indigo" title={t("neuralNetworkNarrative.powerAndLimits.calloutTitle")}>
                    <p>{t("neuralNetworkNarrative.powerAndLimits.calloutText")}</p>
                </Callout>
            </Section>

            {/* ───────────────── CTA ───────────────── */}
            <Section>
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-3">
                        {t("neuralNetworkNarrative.cta.title")}
                    </h2>
                    <p className="text-sm text-white/35 max-w-md mx-auto leading-relaxed">
                        {t("neuralNetworkNarrative.cta.subtitle")}
                    </p>
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

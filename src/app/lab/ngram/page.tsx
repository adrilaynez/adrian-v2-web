"use client";

import { LabShell } from "@/components/lab/LabShell";
import { ModelHero } from "@/components/lab/ModelHero";
import dynamic from "next/dynamic";

import { useNgramVisualization } from "@/hooks/useNgramVisualization";
import { useNgramStepwise } from "@/hooks/useNgramStepwise";
import { useNgramGeneration } from "@/hooks/useNgramGeneration";
import { visualizeNgram } from "@/lib/lmLabClient";
import { motion, AnimatePresence } from "framer-motion";
import {
    FlaskConical,
    Database,
    Hash,
    Activity,
    Zap,
    TrendingDown,
    BarChart3,
    Eye,
    Layers,
    Type,
    Sparkles,
    AlertTriangle,
} from "lucide-react";
import { useEffect, useCallback, useRef, useState, useMemo } from "react";
import { useI18n } from "@/i18n/context";
import { useLabMode, LabModeProvider } from "@/context/LabModeContext";

const ContextControl = dynamic(() =>
    import("@/components/lab/ContextControl").then((m) => m.ContextControl)
);
const TransitionMatrix = dynamic(() =>
    import("@/components/lab/TransitionMatrix").then((m) => m.TransitionMatrix)
);
const InferenceConsole = dynamic(() =>
    import("@/components/lab/InferenceConsole").then((m) => m.InferenceConsole)
);
const StepwisePrediction = dynamic(() =>
    import("@/components/lab/StepwisePrediction").then((m) => m.StepwisePrediction)
);
const GenerationPlayground = dynamic(() =>
    import("@/components/lab/GenerationPlayground").then((m) => m.GenerationPlayground)
);
const NgramFiveGramScale = dynamic(() =>
    import("@/components/lab/NgramPedagogyPanels").then((m) => m.NgramFiveGramScale)
);
const NgramNarrative = dynamic(() =>
    import("@/components/lab/NgramNarrative").then((m) => m.NgramNarrative)
);

/* ─────────────────────────────────────────────
   Lab section wrapper
   ───────────────────────────────────────────── */

function LabSection({
    icon: Icon,
    title,
    description,
    children,
    accent = "cyan",
}: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    children: React.ReactNode;
    accent?: "cyan" | "violet" | "amber" | "emerald" | "red";
}) {
    const accentMap = {
        cyan: { icon: "text-cyan-400", bg: "bg-cyan-500/15", border: "border-cyan-500/20", bar: "bg-cyan-400" },
        violet: { icon: "text-violet-400", bg: "bg-violet-500/15", border: "border-violet-500/20", bar: "bg-violet-400" },
        amber: { icon: "text-amber-400", bg: "bg-amber-500/15", border: "border-amber-500/20", bar: "bg-amber-400" },
        emerald: { icon: "text-emerald-400", bg: "bg-emerald-500/15", border: "border-emerald-500/20", bar: "bg-emerald-400" },
        red: { icon: "text-red-400", bg: "bg-red-500/15", border: "border-red-500/20", bar: "bg-red-400" },
    };
    const a = accentMap[accent];

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
        >
            <div className={`rounded-2xl border ${a.border} bg-gradient-to-br from-white/[0.02] to-black/20 overflow-hidden`}>
                <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.015]">
                    <div className={`p-1.5 rounded-lg ${a.bg}`}>
                        <Icon className={`w-4 h-4 ${a.icon}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-white tracking-tight">{title}</h3>
                        <p className="text-[10px] text-white/35 truncate">{description}</p>
                    </div>
                </div>
                <div className="p-5">{children}</div>
            </div>
        </motion.div>
    );
}

/* ─────────────────────────────────────────────
   Sparsity indicator
   ───────────────────────────────────────────── */

function SparsityIndicator({
    training,
    diagnostics,
}: {
    training: { unique_contexts: number; context_utilization: number; sparsity: number; transition_density: number } | null;
    diagnostics: { estimated_context_space: number; context_size: number } | null;
}) {
    if (!training || !diagnostics) return null;
    const utilPct = (training.context_utilization * 100);
    const sparsityPct = (training.sparsity * 100);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-black/30 rounded-xl p-4 border border-white/[0.06]">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-white/30 mb-1">Observed Contexts</p>
                    <p className="text-xl font-bold text-cyan-300 font-mono">{training.unique_contexts.toLocaleString()}</p>
                    <p className="text-[10px] text-white/25 mt-1">of {diagnostics.estimated_context_space.toLocaleString()} possible</p>
                </div>
                <div className="bg-black/30 rounded-xl p-4 border border-white/[0.06]">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-white/30 mb-1">Avg. Transitions / Context</p>
                    <p className="text-xl font-bold text-emerald-300 font-mono">{training.transition_density.toFixed(1)}</p>
                    <p className="text-[10px] text-white/25 mt-1">next-tokens per observed context</p>
                </div>
            </div>

            <div className="space-y-3">
                <div>
                    <div className="flex justify-between text-[10px] mb-1.5">
                        <span className="font-mono uppercase tracking-widest text-white/30">Context utilization</span>
                        <span className="font-mono text-cyan-400">{utilPct.toFixed(2)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.max(1, utilPct)}%` }}
                            transition={{ duration: 0.8 }}
                            className="h-full rounded-full bg-gradient-to-r from-cyan-600/70 to-cyan-400/80"
                        />
                    </div>
                    <p className="text-[10px] text-white/20 mt-1">Fraction of possible contexts seen in training data</p>
                </div>
                <div>
                    <div className="flex justify-between text-[10px] mb-1.5">
                        <span className="font-mono uppercase tracking-widest text-white/30">Table sparsity</span>
                        <span className="font-mono text-red-400">{sparsityPct.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${sparsityPct}%` }}
                            transition={{ duration: 0.8 }}
                            className="h-full rounded-full bg-gradient-to-r from-red-600/70 to-red-400/80"
                        />
                    </div>
                    <p className="text-[10px] text-white/20 mt-1">Fraction of (context, next-token) pairs never observed</p>
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Training loss chart
   ───────────────────────────────────────────── */

function LossChart({
    lossHistory,
    perplexity,
    finalLoss,
}: {
    lossHistory: number[];
    perplexity?: number;
    finalLoss?: number;
}) {
    const maxLoss = Math.max(...lossHistory);
    const minLoss = Math.min(...lossHistory);
    const range = maxLoss - minLoss || 1;

    const points = lossHistory.map((v, i) => {
        const x = (i / (lossHistory.length - 1)) * 100;
        const y = 100 - ((v - minLoss) / range) * 90 - 5;
        return `${x},${y}`;
    }).join(" ");

    return (
        <div className="space-y-4">
            <div className="bg-black/30 rounded-xl p-4 border border-white/[0.06]">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-white/30">Training loss (NLL)</p>
                    <div className="flex gap-4 text-[10px] font-mono text-white/40">
                        {finalLoss != null && <span>Final: <span className="text-emerald-400">{finalLoss.toFixed(3)}</span></span>}
                        {perplexity != null && <span>PPL: <span className="text-amber-400">{perplexity.toFixed(1)}</span></span>}
                    </div>
                </div>
                <svg viewBox="0 0 100 100" className="w-full h-32" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="lossGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="rgb(6,182,212)" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="rgb(6,182,212)" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <polyline
                        points={points}
                        fill="none"
                        stroke="rgb(6,182,212)"
                        strokeWidth="0.8"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                    />
                    <polygon
                        points={`0,100 ${points} 100,100`}
                        fill="url(#lossGradient)"
                    />
                </svg>
                <div className="flex justify-between text-[10px] text-white/20 font-mono mt-1">
                    <span>Start</span>
                    <span>Training progress</span>
                    <span>End</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="bg-black/30 rounded-lg p-3 border border-white/[0.06]">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-white/30 mb-1">Perplexity</p>
                    <p className="text-lg font-bold text-amber-300 font-mono">{perplexity?.toFixed(1) ?? "—"}</p>
                    <p className="text-[10px] text-white/20 mt-0.5">Lower = more confident predictions</p>
                </div>
                <div className="bg-black/30 rounded-lg p-3 border border-white/[0.06]">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-white/30 mb-1">Final NLL</p>
                    <p className="text-lg font-bold text-emerald-300 font-mono">{finalLoss?.toFixed(3) ?? "—"}</p>
                    <p className="text-[10px] text-white/20 mt-0.5">Negative log-likelihood on train data</p>
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Comparison metrics overlay for multiple N
   ───────────────────────────────────────────── */

function ComparisonDashboard({
    metrics,
    currentN,
}: {
    metrics: Record<number, { perplexity: number | null; contextUtilization: number | null; contextSpace: number | null }>;
    currentN: number;
}) {
    const ns = [1, 2, 3, 4, 5];
    return (
        <div className="space-y-2">
            {ns.map((n) => {
                const m = metrics[n];
                const isActive = n === currentN;
                return (
                    <div
                        key={n}
                        className={`flex items-center gap-3 rounded-lg border px-4 py-2.5 transition-colors ${isActive
                                ? "border-cyan-500/30 bg-cyan-500/[0.06]"
                                : "border-white/[0.06] bg-white/[0.015]"
                            }`}
                    >
                        <span className={`font-mono text-xs font-bold w-12 ${isActive ? "text-cyan-300" : "text-white/40"}`}>
                            N={n}
                        </span>
                        <div className="flex-1 grid grid-cols-3 gap-2 text-[10px] font-mono">
                            <div>
                                <span className="text-white/25">PPL </span>
                                <span className={isActive ? "text-amber-300" : "text-white/50"}>
                                    {m?.perplexity != null ? m.perplexity.toFixed(1) : "—"}
                                </span>
                            </div>
                            <div>
                                <span className="text-white/25">Util </span>
                                <span className={isActive ? "text-emerald-300" : "text-white/50"}>
                                    {m?.contextUtilization != null ? `${(m.contextUtilization * 100).toFixed(1)}%` : "—"}
                                </span>
                            </div>
                            <div>
                                <span className="text-white/25">Space </span>
                                <span className={isActive ? "text-purple-300" : "text-white/50"}>
                                    {m?.contextSpace != null ? m.contextSpace.toLocaleString() : "—"}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

/* ─────────────────────────────────────────────
   Page component
   ───────────────────────────────────────────── */

function NgramPageContent() {
    const { t } = useI18n();
    const { mode } = useLabMode();
    const isEdu = mode === "educational";
    const viz = useNgramVisualization();
    const stepwise = useNgramStepwise(viz.contextSize);
    const generation = useNgramGeneration(viz.contextSize);
    const [comparisonMetrics, setComparisonMetrics] = useState<Record<number, {
        perplexity: number | null;
        contextUtilization: number | null;
        contextSpace: number | null;
    }>>({});

    const lastTextRef = useRef<string>("hello");

    useEffect(() => {
        if (!viz.data && !viz.loading && !viz.error) {
            viz.analyze("hello", 10);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (lastTextRef.current && viz.contextSize < 5) {
            viz.analyze(lastTextRef.current, 10);
        }
    }, [viz.contextSize]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        let active = true;
        const timer = setTimeout(async () => {
            const entries = await Promise.all(
                Array.from({ length: 5 }, async (_, index) => {
                    const n = index + 1;
                    try {
                        const res = await visualizeNgram("hello", n, 5);
                        return [n, {
                            perplexity: res.visualization.training?.perplexity ?? res.visualization.diagnostics?.perplexity ?? null,
                            contextUtilization: res.visualization.training?.context_utilization ?? res.visualization.diagnostics?.context_utilization ?? null,
                            contextSpace: res.visualization.training?.context_space_size ?? res.visualization.diagnostics?.estimated_context_space ?? null,
                        }] as const;
                    } catch {
                        return [n, { perplexity: null, contextUtilization: null, contextSpace: null }] as const;
                    }
                })
            );
            if (active) setComparisonMetrics(Object.fromEntries(entries) as typeof comparisonMetrics);
        }, 3000);
        return () => { active = false; clearTimeout(timer); };
    }, []);

    const handleAnalyze = useCallback((text: string, topK: number) => {
        lastTextRef.current = text;
        viz.analyze(text, topK);
    }, [viz.analyze]);

    const nGramData = viz.data;
    const diagnostics = nGramData?.visualization.diagnostics ?? null;
    const training = nGramData?.visualization.training ?? null;
    const activeSlice = nGramData?.visualization.active_slice;
    const contextDistributions = nGramData?.visualization.context_distributions;
    const vocabForScalability = diagnostics?.vocab_size ?? nGramData?.metadata.vocab_size ?? 96;
    const fallbackCurrent = contextDistributions?.current;
    const fallbackSliceMatrix = useMemo(() =>
        fallbackCurrent?.probabilities
            ? {
                shape: [1, fallbackCurrent.probabilities.length],
                data: [fallbackCurrent.probabilities],
                row_labels: [fallbackCurrent.context || "current"],
                col_labels: fallbackCurrent.row_labels ?? Array.from({ length: fallbackCurrent.probabilities.length }, (_, i) => `#${i}`),
            }
            : null,
        [fallbackCurrent]
    );

    /* ───── Educational Mode: full narrative ───── */
    if (isEdu) {
        return (
            <LabShell>
                <NgramNarrative
                    contextSize={viz.contextSize}
                    vocabSize={vocabForScalability}
                    comparisonMetrics={comparisonMetrics}
                />
            </LabShell>
        );
    }

    /* ═══════════════════════════════════════════
       FREE LAB MODE
       ═══════════════════════════════════════════ */

    const heroStats = diagnostics ? [
        {
            label: "Unique Contexts",
            value: training?.unique_contexts?.toLocaleString() ?? "?",
            icon: Activity,
            desc: t("models.ngram.hero.stats.uniqueContexts.desc"),
            color: "cyan"
        },
        {
            label: "Vocabulary",
            value: diagnostics.vocab_size?.toString() ?? "?",
            icon: Database,
            desc: "Unique characters",
            color: "blue"
        },
        {
            label: "Context Space",
            value: diagnostics.estimated_context_space?.toLocaleString() ?? "?",
            icon: Hash,
            desc: `|V|^${diagnostics.context_size}`,
            color: "purple"
        },
        {
            label: "Training Tokens",
            value: training ? `${(training.total_tokens / 1000).toFixed(1)}k` : "?",
            icon: FlaskConical,
            desc: "Total tokens seen",
            color: "emerald"
        },
    ] : undefined;

    const hasLossHistory = training?.loss_history && training.loss_history.length > 1;

    return (
        <LabShell>
            <div className="max-w-7xl mx-auto pb-24 relative">

                {/* HERO */}
                <ModelHero
                    title="N-Gram Language Model"
                    description="A character-level statistical language model with variable context size. Visualize how increasing the context window sharpens predictions at the cost of exponential sparsity."
                    customStats={heroStats}
                    showExplanationCta={false}
                />

                {/* Lab mode badge */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="max-w-6xl mx-auto px-6 mb-8 flex items-center gap-3"
                >
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <p className="text-xs uppercase tracking-[0.15em] text-cyan-300/60 font-bold">
                        Free Lab Mode · Full instrument access
                    </p>
                </motion.div>

                {/* ────────────────────────────────────────
                   ROW 1: Context Controller (full width)
                   ──────────────────────────────────────── */}
                <div className="max-w-6xl mx-auto px-6 mb-8">
                    <ContextControl
                        value={viz.contextSize}
                        onChange={viz.setContextSize}
                        disabled={viz.loading}
                    />
                </div>

                {/* ────────────────────────────────────────
                   ROW 2: Transition Matrix + Sparsity / Metrics
                   ──────────────────────────────────────── */}
                <div className="max-w-6xl mx-auto px-6 mb-8 grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Matrix — wide */}
                    <div className="lg:col-span-3">
                        <LabSection
                            icon={Eye}
                            title="Transition Probabilities"
                            description={viz.contextSize === 1
                                ? "Full bigram matrix P(next | current)"
                                : `Slice P(next | "${activeSlice?.context_tokens?.join("") ?? "..."}")`
                            }
                        >
                            {viz.contextSize >= 5 ? (
                                <NgramFiveGramScale vocabSize={vocabForScalability} />
                            ) : (
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={`matrix-${viz.contextSize}`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <TransitionMatrix
                                            data={
                                                viz.contextSize === 1
                                                    ? nGramData?.visualization.transition_matrix ?? null
                                                    : activeSlice?.matrix ?? fallbackSliceMatrix
                                            }
                                            activeContext={viz.contextSize > 1 ? activeSlice?.context_tokens : undefined}
                                            accent="cyan"
                                        />
                                        {viz.contextSize > 1 && (
                                            <div className="mt-3 flex items-center gap-2 px-1 text-cyan-300/60">
                                                <span className="text-[10px] uppercase tracking-[0.15em] font-bold">Conditioned on:</span>
                                                <span className="font-mono text-sm text-white/70">
                                                    &quot;{activeSlice?.context_tokens?.join("") ?? fallbackCurrent?.context ?? "..."}&quot;
                                                </span>
                                            </div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            )}
                        </LabSection>
                    </div>

                    {/* Right column: sparsity + model metrics */}
                    <div className="lg:col-span-2 space-y-6">
                        <LabSection
                            icon={BarChart3}
                            title="Data Sparsity"
                            description="How much of the context space is actually observed"
                            accent="red"
                        >
                            <SparsityIndicator training={training} diagnostics={diagnostics} />
                        </LabSection>

                        <LabSection
                            icon={Layers}
                            title="Model Comparison"
                            description="Metrics across N=1..5 from backend"
                            accent="violet"
                        >
                            <ComparisonDashboard metrics={comparisonMetrics} currentN={viz.contextSize} />
                        </LabSection>
                    </div>
                </div>

                {/* ────────────────────────────────────────
                   ROW 3: Loss Chart (if available)
                   ──────────────────────────────────────── */}
                {hasLossHistory && (
                    <div className="max-w-6xl mx-auto px-6 mb-8">
                        <LabSection
                            icon={TrendingDown}
                            title="Training Quality"
                            description={`Loss curve for the N=${viz.contextSize} model during training`}
                            accent="emerald"
                        >
                            <LossChart
                                lossHistory={training!.loss_history!}
                                perplexity={training!.perplexity}
                                finalLoss={training!.final_loss}
                            />
                        </LabSection>
                    </div>
                )}

                {/* ────────────────────────────────────────
                   ROW 4: Inference + Stepwise + Generation
                   ──────────────────────────────────────── */}
                <div className="max-w-6xl mx-auto px-6 mb-8">
                    {viz.contextSize >= 5 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-6 rounded-2xl border border-red-500/25 bg-gradient-to-br from-red-950/20 to-black/60 flex items-center gap-4"
                        >
                            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                            <div>
                                <p className="text-sm text-red-100/80 font-medium">Combinatorial threshold exceeded</p>
                                <p className="text-xs text-red-200/50 mt-0.5">
                                    N=5 produces over {Math.pow(vocabForScalability, 5).toLocaleString()} possible contexts.
                                    Reduce N to 1–4 for live inference, stepwise prediction, and generation.
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left: Next-token prediction */}
                            <LabSection
                                icon={Type}
                                title="Next-Token Prediction"
                                description="Type text and see the probability distribution over next characters"
                            >
                                <InferenceConsole
                                    onAnalyze={handleAnalyze}
                                    predictions={nGramData?.predictions ?? null}
                                    inferenceMs={nGramData?.metadata.inference_time_ms}
                                    device={nGramData?.metadata.device}
                                    loading={viz.loading}
                                    error={viz.error}
                                />
                            </LabSection>

                            {/* Right: Stepwise prediction */}
                            <LabSection
                                icon={Activity}
                                title="Stepwise Prediction"
                                description="Trace the context window sliding character by character"
                                accent="violet"
                            >
                                <StepwisePrediction
                                    onPredict={stepwise.predict}
                                    steps={stepwise.data?.steps ?? null}
                                    finalPrediction={stepwise.data?.final_prediction ?? null}
                                    loading={stepwise.loading}
                                    error={stepwise.error}
                                />
                            </LabSection>
                        </div>
                    )}
                </div>

                {/* Generation (full width, below inference) */}
                {viz.contextSize < 5 && (
                    <div className="max-w-6xl mx-auto px-6 mb-8">
                        <LabSection
                            icon={Sparkles}
                            title="Text Generation"
                            description="Generate text auto-regressively using the current N-gram model"
                            accent="amber"
                        >
                            <GenerationPlayground
                                onGenerate={generation.generate}
                                generatedText={generation.data?.generated_text ?? null}
                                loading={generation.loading}
                                error={generation.error}
                            />
                        </LabSection>
                    </div>
                )}

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-16 flex items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-widest text-cyan-300/15"
                >
                    <FlaskConical className="h-3 w-3" />
                    LM-Lab · Scientific Instrument v1.0
                </motion.div>
            </div>
        </LabShell>
    );
}

export default function NgramPage() {
    return (
        <LabModeProvider>
            <NgramPageContent />
        </LabModeProvider>
    );
}

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
    Gauge,
} from "lucide-react";
import { useEffect, useCallback, useRef, useState, useMemo } from "react";
import { useI18n } from "@/i18n/context";
import { useLabMode } from "@/context/LabModeContext";
import { NgramSparsityIndicator } from "@/components/lab/NgramSparsityIndicator";
import { NgramLossChart } from "@/components/lab/NgramLossChart";
import { NgramComparisonDashboard } from "@/components/lab/NgramComparisonDashboard";
import { NgramPerformanceSummary } from "@/components/lab/NgramPerformanceSummary";

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
   Flow descriptor block (lightweight)
   ───────────────────────────────────────────── */

function FlowHint({ text }: { text: string }) {
    return (
        <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="max-w-6xl mx-auto px-6 mb-4 text-[11px] text-white/30 leading-relaxed border-l-2 border-cyan-500/20 pl-3"
        >
            {text}
        </motion.p>
    );
}

/* ─────────────────────────────────────────────
   Page component
   ───────────────────────────────────────────── */

type ComparisonEntry = { perplexity: number | null; contextUtilization: number | null; contextSpace: number | null };

function NgramPageContent() {
    const { t } = useI18n();
    const { mode } = useLabMode();
    const isEdu = mode === "educational";
    const viz = useNgramVisualization();
    const stepwise = useNgramStepwise(viz.contextSize);
    const generation = useNgramGeneration(viz.contextSize);

    /* Cached per-N comparison metrics — fetch lazily on N change, never re-fetch */
    const comparisonCacheRef = useRef<Record<number, ComparisonEntry>>({});
    const fetchingNsRef = useRef<Set<number>>(new Set());
    const [comparisonMetrics, setComparisonMetrics] = useState<Record<number, ComparisonEntry>>({});

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

    /* Fetch comparison metric for the current N only; cache to avoid re-fetching */
    useEffect(() => {
        const n = viz.contextSize;
        if (comparisonCacheRef.current[n] !== undefined) return;
        if (fetchingNsRef.current.has(n)) return;
        fetchingNsRef.current.add(n);
        let active = true;
        visualizeNgram("hello", n, 5)
            .then((res) => {
                if (!active) return;
                const entry: ComparisonEntry = {
                    perplexity: res.visualization.training?.perplexity ?? res.visualization.diagnostics?.perplexity ?? null,
                    contextUtilization: res.visualization.training?.context_utilization ?? res.visualization.diagnostics?.context_utilization ?? null,
                    contextSpace: res.visualization.training?.context_space_size ?? res.visualization.diagnostics?.estimated_context_space ?? null,
                };
                comparisonCacheRef.current = { ...comparisonCacheRef.current, [n]: entry };
                setComparisonMetrics({ ...comparisonCacheRef.current });
            })
            .catch(() => {
                if (!active) return;
                comparisonCacheRef.current = { ...comparisonCacheRef.current, [n]: { perplexity: null, contextUtilization: null, contextSpace: null } };
                setComparisonMetrics({ ...comparisonCacheRef.current });
            })
            .finally(() => { fetchingNsRef.current.delete(n); });
        return () => { active = false; };
    }, [viz.contextSize]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleAnalyze = useCallback((text: string, topK: number) => {
        lastTextRef.current = text;
        viz.analyze(text, topK);
    }, [viz.analyze]); // eslint-disable-line react-hooks/exhaustive-deps

    const nGramData = viz.data;
    const diagnostics = useMemo(() => nGramData?.visualization.diagnostics ?? null, [nGramData]);
    const training = useMemo(() => nGramData?.visualization.training ?? null, [nGramData]);
    const activeSlice = nGramData?.visualization.active_slice;
    const contextDistributions = nGramData?.visualization.context_distributions;
    const vocabForScalability = useMemo(
        () => diagnostics?.vocab_size ?? nGramData?.metadata.vocab_size ?? 96,
        [diagnostics, nGramData]
    );
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
            label: t("models.ngram.lab.hero.uniqueContexts"),
            value: training?.unique_contexts?.toLocaleString() ?? "?",
            icon: Activity,
            desc: t("models.ngram.hero.stats.uniqueContexts.desc"),
            color: "cyan",
        },
        {
            label: t("models.ngram.lab.hero.vocabulary"),
            value: diagnostics.vocab_size?.toString() ?? "?",
            icon: Database,
            desc: t("models.ngram.lab.hero.uniqueChars"),
            color: "blue",
        },
        {
            label: t("models.ngram.lab.hero.contextSpace"),
            value: diagnostics.estimated_context_space?.toLocaleString() ?? "?",
            icon: Hash,
            desc: `|V|^${diagnostics.context_size}`,
            color: "purple",
        },
        {
            label: t("models.ngram.lab.hero.trainingTokens"),
            value: training ? `${(training.total_tokens / 1000).toFixed(1)}k` : "?",
            icon: FlaskConical,
            desc: t("models.ngram.lab.hero.totalTokensSeen"),
            color: "emerald",
        },
    ] : undefined;

    const hasLossHistory = training?.loss_history && training.loss_history.length > 1;
    const hasPerformanceData = nGramData?.metadata.inference_time_ms != null || !!nGramData?.metadata.device;

    const matrixDesc = viz.contextSize === 1
        ? t("models.ngram.lab.sections.transitionsDescN1")
        : `${t("models.ngram.lab.sections.transitionsDescNPlus")} "${activeSlice?.context_tokens?.join("") ?? "..."}"`;

    return (
        <LabShell>
            <div className="max-w-7xl mx-auto pb-24 relative">

                {/* HERO */}
                <ModelHero
                    title={t("models.ngram.lab.hero.title")}
                    description={t("models.ngram.lab.hero.description")}
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
                        {t("models.ngram.lab.badge")}
                    </p>
                </motion.div>

                {/* ROW 1: Context Controller */}
                <div className="max-w-6xl mx-auto px-6 mb-4">
                    <ContextControl
                        value={viz.contextSize}
                        onChange={viz.setContextSize}
                        disabled={viz.loading}
                    />
                </div>

                <FlowHint text={t("models.ngram.lab.flow.afterContext")} />

                {/* ROW 2: Transition Matrix + Sparsity / Comparison */}
                <div className="max-w-6xl mx-auto px-6 mb-4 grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-3">
                        <LabSection
                            icon={Eye}
                            title={t("models.ngram.lab.sections.transitions")}
                            description={matrixDesc}
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
                                                <span className="text-[10px] uppercase tracking-[0.15em] font-bold">
                                                    {t("models.ngram.lab.sections.conditionedOn")}
                                                </span>
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

                    <div className="lg:col-span-2 space-y-6">
                        <LabSection
                            icon={BarChart3}
                            title={t("models.ngram.lab.sparsity.title")}
                            description={t("models.ngram.lab.sparsity.description")}
                            accent="red"
                        >
                            <NgramSparsityIndicator training={training} diagnostics={diagnostics} />
                        </LabSection>

                        <LabSection
                            icon={Layers}
                            title={t("models.ngram.lab.comparison.title")}
                            description={t("models.ngram.lab.comparison.description")}
                            accent="violet"
                        >
                            <NgramComparisonDashboard metrics={comparisonMetrics} currentN={viz.contextSize} />
                        </LabSection>
                    </div>
                </div>

                <FlowHint text={t("models.ngram.lab.flow.afterMatrix")} />

                {/* ROW 3: Performance Summary */}
                {hasPerformanceData && (
                    <div className="max-w-6xl mx-auto px-6 mb-4">
                        <LabSection
                            icon={Gauge}
                            title={t("models.ngram.lab.performanceSummary.title")}
                            description={t("models.ngram.lab.performanceSummary.description")}
                            accent="emerald"
                        >
                            <NgramPerformanceSummary
                                inferenceMs={nGramData?.metadata.inference_time_ms}
                                device={nGramData?.metadata.device}
                                totalTokens={training?.total_tokens}
                                trainingDuration={(training as { training_duration_ms?: number } | null)?.training_duration_ms}
                                perplexity={training?.perplexity}
                                finalLoss={training?.final_loss}
                            />
                        </LabSection>
                    </div>
                )}

                {/* ROW 4: Loss Chart */}
                {hasLossHistory && (
                    <>
                        <FlowHint text={t("models.ngram.lab.flow.afterComparison")} />
                        <div className="max-w-6xl mx-auto px-6 mb-4">
                            <LabSection
                                icon={TrendingDown}
                                title={t("models.ngram.lab.sections.trainingQuality")}
                                description={t("models.ngram.lab.sections.trainingQualityDesc").replace("{n}", String(viz.contextSize))}
                                accent="emerald"
                            >
                                <NgramLossChart
                                    lossHistory={training!.loss_history!}
                                    perplexity={training!.perplexity}
                                    finalLoss={training!.final_loss}
                                />
                            </LabSection>
                        </div>
                    </>
                )}

                {/* ROW 5: Inference + Stepwise + Generation */}
                <div className="max-w-6xl mx-auto px-6 mb-4">
                    {viz.contextSize >= 5 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-6 rounded-2xl border border-red-500/25 bg-gradient-to-br from-red-950/20 to-black/60 flex items-start gap-4"
                        >
                            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm text-red-100/80 font-medium">
                                    {t("models.ngram.lab.warning5.title")}
                                </p>
                                <p className="text-xs text-red-200/40 mt-1">
                                    N=5 {t("models.ngram.explosion.description").split(".")[0].toLowerCase()}.
                                </p>
                                <p className="text-xs text-red-300/60 mt-1.5 font-medium">
                                    {t("models.ngram.lab.warning5.hint")}
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <LabSection
                                icon={Type}
                                title={t("models.ngram.lab.sections.nextToken")}
                                description={t("models.ngram.lab.sections.nextTokenDesc")}
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

                            <LabSection
                                icon={Activity}
                                title={t("models.ngram.lab.sections.stepwise")}
                                description={t("models.ngram.lab.sections.stepwiseDesc")}
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

                {viz.contextSize < 5 && (
                    <div className="max-w-6xl mx-auto px-6 mb-8">
                        <LabSection
                            icon={Sparkles}
                            title={t("models.ngram.lab.sections.generation")}
                            description={t("models.ngram.lab.sections.generationDesc")}
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
                    {t("models.ngram.lab.footer")}
                </motion.div>
            </div>
        </LabShell>
    );
}

export default function NgramPage() {
    return <NgramPageContent />;
}

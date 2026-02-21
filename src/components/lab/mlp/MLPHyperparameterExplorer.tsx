"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Layers, TrendingDown, Sparkles, Loader2, AlertTriangle, GitCompareArrows, Cpu, Activity, ChevronDown, ChevronUp } from "lucide-react";
import type { MLPGridConfig, MLPTimelineResponse, MLPGenerateResponse } from "@/types/lmLab";
import { EmbeddingDriftAnimator } from "./EmbeddingDriftAnimator";
import { CrossConfigScatterPlot } from "./CrossConfigScatterPlot";
import { NearestNeighborExplorer } from "./NearestNeighborExplorer";
import { GeneralizationGapHeatmap } from "./GeneralizationGapHeatmap";
import { GradientHealthHeatmap, ActivationSaturationHeatmap } from "./SnapshotDiagnostics";

/* ─────────────────────────────────────────────
   MLPHyperparameterExplorer — v2
   Research-grade, data-driven explorer.

   Key design decisions:
   1. Primary metric = validation loss (scientifically meaningful).
   2. Cost = normalized compute estimate (params × 50k steps),
      NOT wall-clock time (noisy, machine-dependent).
   3. Smoothed train loss = mean of last N logged points.
   4. "Train–Val Gap" replaces "Gen Gap" with tooltip explanation.
   5. Layout: Timeline → Generated Text → Embedding Space.
   6. Timeline intelligence: stability, variance, spike detection.
   7. Anomaly badges with micro-explanations.
   8. Gradient norm + dead neuron mini-charts from timeline.
   9. All metrics have expandable info panels.
   ───────────────────────────────────────────── */

// All models trained for exactly 50k steps
const TOTAL_TRAINING_STEPS = 50_000;

// ── Section header primitive ─────────────────────────────────────────────────

function LabSection({
    number,
    title,
    subtitle,
    children,
}: {
    number: string;
    title: string;
    subtitle: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-4">
            {/* Divider + header */}
            <div className="flex items-center gap-4 pt-2">
                <span className="flex items-center justify-center w-7 h-7 rounded-full border border-violet-500/20 bg-violet-500/[0.07] text-[10px] font-mono font-bold text-violet-300/60 shrink-0">
                    {number}
                </span>
                <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-white/50 leading-none">{title}</p>
                    <p className="text-[11px] text-white/25 leading-snug mt-0.5 font-light">{subtitle}</p>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-violet-500/10 to-transparent" />
            </div>
            {/* Content */}
            {children}
        </div>
    );
}

export interface MLPHyperparameterExplorerProps {
    configs: MLPGridConfig[];
    selectedConfig: MLPGridConfig | null;
    onSelectClosest: (params: { embeddingDim?: number; hiddenSize?: number; learningRate?: number }) => void;
    timeline: MLPTimelineResponse | null;
    timelineLoading: boolean;
    onFetchTimeline: () => Promise<void>;
    generation: MLPGenerateResponse | null;
    generationLoading: boolean;
    onGenerate: (seedText: string, maxTokens: number, temperature: number) => Promise<void>;
    gridLoading: boolean;
    gridError: string | null;
}

// ── Hover-only tooltip ─────────────────────────────────
// Wraps any element; shows explanation on hover. No icon, no dismiss.
function Tip({ children, text, align = "center" }: {
    children: React.ReactNode; text: string; align?: "left" | "center" | "right";
}) {
    const alignClass = align === "left" ? "left-0" : align === "right" ? "right-0" : "left-1/2 -translate-x-1/2";
    return (
        <span className="relative group inline-block cursor-help">
            {children}
            <span className={`pointer-events-none absolute z-40 bottom-full mb-2 w-56 rounded-lg bg-zinc-900 border border-white/10 px-3 py-2.5 text-[10px] text-white/55 leading-relaxed font-normal normal-case tracking-normal opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-xl whitespace-normal ${alignClass}`}>
                {text}
            </span>
        </span>
    );
}

// ── Expandable section wrapper ──────────────────────────

function Expandable({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="rounded-xl border border-white/[0.06] bg-black/30">
            <button onClick={() => setOpen(p => !p)} className="flex items-center justify-between w-full p-3 text-left">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/25">{title}</span>
                {open ? <ChevronUp className="w-3 h-3 text-white/20" /> : <ChevronDown className="w-3 h-3 text-white/20" />}
            </button>
            {open && <div className="px-4 pb-4">{children}</div>}
        </div>
    );
}

// ── Anomaly / sanity flags ──────────────────────────────

interface AnomalyFlags {
    lossAboveRandom: boolean;
    largeGenGap: boolean;
    lossIncreasing: boolean;
    perplexityMismatch: boolean;
    unstableGradients: boolean;
    nonDecreasingLoss: boolean;
}

function detectAnomalies(
    config: MLPGridConfig,
    timeline: MLPTimelineResponse | null,
    computedGap?: number | null,
): AnomalyFlags {
    const flags: AnomalyFlags = {
        lossAboveRandom: false,
        largeGenGap: false,
        lossIncreasing: false,
        perplexityMismatch: false,
        unstableGradients: false,
        nonDecreasingLoss: false,
    };

    if (config.expected_uniform_loss != null) {
        flags.lossAboveRandom = config.final_loss >= config.expected_uniform_loss * 0.98;
    }

    const gapValue = computedGap ?? config.generalization_gap;
    if (gapValue != null) {
        flags.largeGenGap = gapValue > 0.3;
    }

    const expectedPerp = Math.exp(config.final_loss);
    if (Math.abs(expectedPerp - config.perplexity) / expectedPerp > 0.05) {
        flags.perplexityMismatch = true;
    }

    if (timeline?.metrics_log?.val_loss) {
        const vl = timeline.metrics_log.val_loss;
        if (vl.length >= 10) {
            const last5 = vl.slice(-5).map(e => e.value);
            const prev5 = vl.slice(-10, -5).map(e => e.value);
            const lastAvg = last5.reduce((a, b) => a + b, 0) / 5;
            const prevAvg = prev5.reduce((a, b) => a + b, 0) / 5;
            if (lastAvg > prevAvg * 1.02) flags.lossIncreasing = true;
        }
        // Non-decreasing: first half avg ≈ second half avg
        if (vl.length >= 20) {
            const mid = Math.floor(vl.length / 2);
            const firstHalf = vl.slice(0, mid).map(e => e.value);
            const secondHalf = vl.slice(mid).map(e => e.value);
            const fAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
            const sAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
            if (sAvg >= fAvg * 0.99) flags.nonDecreasingLoss = true;
        }
    }

    if (timeline?.metrics_log?.grad_norms) {
        const gn = timeline.metrics_log.grad_norms;
        if (gn.length >= 2) {
            const vals = extractGradNormValues(gn);
            if (vals.length >= 2) {
                const maxGn = Math.max(...vals);
                const minGn = Math.min(...vals);
                if (maxGn / (minGn || 1e-10) > 1000) flags.unstableGradients = true;
            }
        }
    }

    return flags;
}

// grad_norms entries may be {step, value: number} or {step, value: {total: number, ...}}
function extractGradNormValues(entries: { step: number; value: unknown }[]): number[] {
    return entries.map(e => {
        if (typeof e.value === "number") return e.value;
        if (e.value && typeof e.value === "object" && "total" in e.value) return (e.value as { total: number }).total;
        return 0;
    }).filter(v => v > 0);
}

// ── SVG charts ──────────────────────────────────────────

interface LossEntry { step: number; value: number }

function downsample(data: LossEntry[], maxPoints: number): LossEntry[] {
    if (data.length <= maxPoints) return data;
    const step = Math.ceil(data.length / maxPoints);
    const result: LossEntry[] = [];
    for (let i = 0; i < data.length; i += step) result.push(data[i]);
    if (result[result.length - 1] !== data[data.length - 1]) result.push(data[data.length - 1]);
    return result;
}

function DualLossChart({ trainLoss, valLoss, expectedUniformLoss }: {
    trainLoss: LossEntry[]; valLoss: LossEntry[];
    expectedUniformLoss?: number | null;
}) {
    const hasVal = valLoss.length >= 2;
    const hasTrain = trainLoss.length >= 2;
    if (!hasTrain && !hasVal) return null;

    const w = 440, h = 150, pad = 36, padRight = 14, padTop = 16;
    const allVals = [...trainLoss.map(e => e.value), ...valLoss.map(e => e.value),
    ...(expectedUniformLoss != null ? [expectedUniformLoss] : [])];
    const allSteps = [...trainLoss.map(e => e.step), ...valLoss.map(e => e.step)];
    const minVal = Math.min(...allVals) * 0.95;
    const maxVal = Math.max(...allVals) * 1.02;
    const valRange = maxVal - minVal || 1;
    const maxStep = Math.max(...allSteps) || 1;
    const toX = (s: number) => pad + (s / maxStep) * (w - pad - padRight);
    const toY = (v: number) => padTop + (1 - (v - minVal) / valRange) * (h - padTop - pad);
    const poly = (data: LossEntry[]) => data.map(e => `${toX(e.step).toFixed(1)},${toY(e.value).toFixed(1)}`).join(" ");
    const trainDown = downsample(trainLoss, 200);
    const valDown = downsample(valLoss, 200);
    const stepTicks = [0, Math.round(maxStep * 0.25), Math.round(maxStep * 0.5), Math.round(maxStep * 0.75), maxStep];

    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ maxHeight: 200 }}>
            {[0.25, 0.5, 0.75].map(f => (
                <line key={f} x1={pad} y1={toY(minVal + f * valRange)} x2={w - padRight} y2={toY(minVal + f * valRange)}
                    stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
            ))}
            {expectedUniformLoss != null && (
                <>
                    <line x1={pad} y1={toY(expectedUniformLoss)} x2={w - padRight} y2={toY(expectedUniformLoss)}
                        stroke="rgba(251,113,133,0.25)" strokeWidth={1} strokeDasharray="4 3" />
                    <text x={w - padRight - 2} y={toY(expectedUniformLoss) - 4}
                        fontSize={8} fill="rgba(251,113,133,0.5)" fontFamily="monospace" textAnchor="end">random baseline</text>
                </>
            )}
            {hasTrain && <polyline points={poly(trainDown)} fill="none" stroke="rgba(139,92,246,0.5)" strokeWidth={1.2} strokeLinejoin="round" />}
            {hasVal && <polyline points={poly(valDown)} fill="none" stroke="rgb(52,211,153)" strokeWidth={1.8} strokeLinejoin="round" />}
            <text x={w / 2} y={h - 2} textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize={8} fontFamily="monospace">Training Steps</text>
            {stepTicks.map(s => (
                <text key={s} x={toX(s)} y={h - pad + 14} textAnchor="middle" fill="rgba(255,255,255,0.15)" fontSize={7} fontFamily="monospace">
                    {s >= 1000 ? `${(s / 1000).toFixed(0)}k` : s}
                </text>
            ))}
            {hasTrain && <text x={w - padRight} y={toY(trainDown[trainDown.length - 1].value) + 3} fontSize={8} fill="rgba(139,92,246,0.7)" fontFamily="monospace" textAnchor="end">{trainDown[trainDown.length - 1].value.toFixed(3)}</text>}
            {hasVal && <text x={w - padRight} y={toY(valDown[valDown.length - 1].value) - 5} fontSize={9} fill="rgb(52,211,153)" fontFamily="monospace" textAnchor="end" fontWeight={700}>{valDown[valDown.length - 1].value.toFixed(3)}</text>}
            <circle cx={pad + 4} cy={8} r={3} fill="rgba(139,92,246,0.5)" />
            <text x={pad + 12} y={11} fontSize={8} fill="rgba(255,255,255,0.3)" fontFamily="monospace">train</text>
            <circle cx={pad + 50} cy={8} r={3} fill="rgb(52,211,153)" />
            <text x={pad + 58} y={11} fontSize={8} fill="rgba(255,255,255,0.3)" fontFamily="monospace">val (primary)</text>
        </svg>
    );
}

// Mini sparkline for gradient norms or dead neurons
function MiniSparkline({ data, color, label }: { data: LossEntry[]; color: string; label: string }) {
    if (data.length < 2) return null;
    const w = 300, h = 72, pad = 4;
    const vals = data.map(e => e.value);
    const min = Math.min(...vals); const max = Math.max(...vals); const range = max - min || 1;
    const pts = downsample(data, 100).map(e => {
        const x = pad + (e.step / (data[data.length - 1].step || 1)) * (w - pad * 2);
        const y = pad + (1 - (e.value - min) / range) * (h - pad * 2);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");
    return (
        <div>
            <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">{label}</span>
            <svg viewBox={`0 0 ${w} ${h}`} className="w-full mt-1" style={{ maxHeight: 90 }}>
                <polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
            </svg>
            <div className="flex justify-between text-[8px] font-mono text-white/20 mt-0.5">
                <span>{min.toFixed(3)}</span><span>{max.toFixed(3)}</span>
            </div>
        </div>
    );
}

// ── Slider control ──────────────────────────────────────

function SliderControl({ label, options, value, onChange, format }: {
    label: string; options: number[]; value: number; onChange: (v: number) => void; format?: (v: number) => string;
}) {
    const idx = options.indexOf(value);
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">{label}</span>
                <span className="text-xs font-mono font-bold text-violet-400">{format ? format(value) : value}</span>
            </div>
            <input type="range" min={0} max={options.length - 1} value={idx >= 0 ? idx : 0}
                onChange={(e) => onChange(options[Number(e.target.value)])} className="w-full accent-violet-500" />
            <div className="flex justify-between">
                {options.map((o) => (
                    <span key={o} className={`text-[8px] font-mono ${o === value ? "text-violet-400" : "text-white/15"}`}>{format ? format(o) : o}</span>
                ))}
            </div>
        </div>
    );
}

// ── Helpers ─────────────────────────────────────────────

function uniqueSorted(arr: number[]): number[] { return [...new Set(arr)].sort((a, b) => a - b); }
function formatParams(n: number): string {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return n.toString();
}
function formatLR(lr: number): string { return lr >= 0.01 ? lr.toFixed(2) : lr.toExponential(1); }

// Compute cost = params × steps. Deterministic, machine-independent.
// Normalized to [0,1] across grid for relative comparison.
function computeCostInfo(config: MLPGridConfig, allConfigs: MLPGridConfig[]): { flops: number; label: string; ratio: number } {
    const params = config.total_parameters ?? 0;
    const flops = params * TOTAL_TRAINING_STEPS;
    const allFlops = allConfigs.map(c => (c.total_parameters ?? 0) * TOTAL_TRAINING_STEPS).filter(f => f > 0);
    const maxFlops = Math.max(...allFlops) || 1;
    const ratio = flops / maxFlops;
    let label: string;
    if (ratio < 0.1) label = "Minimal";
    else if (ratio < 0.25) label = "Low";
    else if (ratio < 0.5) label = "Moderate";
    else if (ratio < 0.75) label = "High";
    else label = "Very High";
    return { flops, label, ratio };
}

// Smoothed train loss: mean of last ~10% of logged points (≥10 points)
function smoothedTrainLoss(trainLossData: LossEntry[]): number | null {
    if (trainLossData.length < 2) return null;
    const n = Math.max(10, Math.floor(trainLossData.length * 0.1));
    const tail = trainLossData.slice(-n);
    return tail.reduce((s, e) => s + e.value, 0) / tail.length;
}

function lossSourceLabel(config: MLPGridConfig): string {
    if (config.final_val_loss != null) return "Val Loss";
    if (config.final_train_loss != null) return "Train Loss";
    return "Loss";
}

// ── Timeline stability analysis ─────────────────────────

interface StabilityInfo {
    valVariance: number;
    valTrend: "decreasing" | "flat" | "increasing";
    spikeSteps: number[];
    convergenceStep: number | null; // step where loss first drops below 50% of initial
}

function analyzeStability(valLoss: LossEntry[], trainLoss: LossEntry[]): StabilityInfo | null {
    const data = valLoss.length >= 2 ? valLoss : trainLoss;
    if (data.length < 5) return null;
    const vals = data.map(e => e.value);
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    const variance = vals.reduce((s, v) => s + (v - mean) ** 2, 0) / vals.length;

    // Trend: compare first and last quarter
    const q = Math.floor(vals.length / 4) || 1;
    const firstQ = vals.slice(0, q).reduce((a, b) => a + b, 0) / q;
    const lastQ = vals.slice(-q).reduce((a, b) => a + b, 0) / q;
    let valTrend: "decreasing" | "flat" | "increasing" = "flat";
    if (lastQ < firstQ * 0.95) valTrend = "decreasing";
    else if (lastQ > firstQ * 1.05) valTrend = "increasing";

    // Detect spikes: points > 2σ above local moving average
    const spikeSteps: number[] = [];
    const windowSize = Math.max(5, Math.floor(data.length / 10));
    for (let i = windowSize; i < data.length; i++) {
        const localMean = vals.slice(i - windowSize, i).reduce((a, b) => a + b, 0) / windowSize;
        const localStd = Math.sqrt(vals.slice(i - windowSize, i).reduce((s, v) => s + (v - localMean) ** 2, 0) / windowSize) || 0.01;
        if (vals[i] > localMean + 2.5 * localStd) spikeSteps.push(data[i].step);
    }

    // Convergence: first step below 50% of initial value
    const initVal = vals[0];
    const threshold = initVal * 0.5;
    let convergenceStep: number | null = null;
    for (const entry of data) {
        if (entry.value < threshold) { convergenceStep = entry.step; break; }
    }

    return { valVariance: variance, valTrend, spikeSteps, convergenceStep };
}

// ── Anomaly badges ──────────────────────────────────────

function AnomalyBadges({ flags }: { flags: AnomalyFlags }) {
    const badges: { label: string; tooltip: string }[] = [];
    if (flags.lossAboveRandom) badges.push({ label: "≥ Random", tooltip: "Final loss is at or above the random baseline — the model may not have learned meaningful patterns from the data." });
    if (flags.largeGenGap) badges.push({ label: "Overfitting", tooltip: "The train–val gap exceeds 0.3 — the model memorizes training data better than it generalizes. Consider: smaller model, more data, or regularization." });
    if (flags.lossIncreasing) badges.push({ label: "Val Loss ↑", tooltip: "Validation loss was still increasing at end of training — a sign of overfitting onset. The model may have trained too long." });
    if (flags.nonDecreasingLoss) badges.push({ label: "No Convergence", tooltip: "Loss did not meaningfully decrease over training — the learning rate may be too high or too low for this architecture." });
    if (flags.unstableGradients) badges.push({ label: "Unstable ∇", tooltip: "Gradient norms varied by >1000× during training — indicates optimization instability, often caused by too-high learning rate." });
    if (flags.perplexityMismatch) badges.push({ label: "PPL ≠ exp(L)", tooltip: "Reported perplexity does not match exp(loss). This may indicate a data pipeline issue or stale cached metrics." });
    if (badges.length === 0) return null;
    return (
        <div className="flex flex-wrap gap-1.5">
            {badges.map(b => (
                <span key={b.label} title={b.tooltip}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-amber-500/10 text-amber-400/80 border border-amber-500/20 cursor-help">
                    <AlertTriangle className="w-2.5 h-2.5" />{b.label}
                </span>
            ))}
        </div>
    );
}

// ── Config plain-English summary ────────────────────────

interface ConfigSummary { text: string; color: "emerald" | "amber" | "rose" | "blue" | "white" }

function buildConfigSummary(
    config: MLPGridConfig,
    flags: AnomalyFlags,
    computedGap: number | null,
    stability: StabilityInfo | null,
): ConfigSummary {
    if (flags.lossAboveRandom)
        return { text: "This model barely outperforms random guessing. It likely failed to learn meaningful patterns — check the learning rate and architecture.", color: "rose" };
    if (flags.nonDecreasingLoss)
        return { text: "Loss did not decrease during training. The model failed to converge — the learning rate may be too high or too low for this architecture.", color: "amber" };
    const gap = computedGap ?? config.generalization_gap ?? 0;
    if (gap > 0.3)
        return { text: "This model overfits — it memorizes training data better than it generalizes. The gap between training and validation loss is large.", color: "amber" };
    if (flags.lossIncreasing)
        return { text: "Validation loss was still rising at the end of training — a sign of late-stage overfitting. The model trained too long for its capacity.", color: "amber" };
    if (flags.unstableGradients)
        return { text: "Gradient norms varied wildly during training — the optimization was unstable. This often means the learning rate is too high.", color: "amber" };
    if (stability?.valTrend === "decreasing")
        return { text: "Training was still improving at the final step. Given more compute, this model might converge further.", color: "blue" };
    if (gap < 0.05 && config.final_loss < (config.expected_uniform_loss ?? Infinity) * 0.7)
        return { text: "This model trains stably and generalizes well. A strong, balanced configuration.", color: "emerald" };
    return { text: "Training completed. The model converged with a moderate generalization gap.", color: "white" };
}

// ── Main component ──────────────────────────────────────

export function MLPHyperparameterExplorer({
    configs, selectedConfig, onSelectClosest,
    timeline, timelineLoading, onFetchTimeline,
    generation, generationLoading, onGenerate,
    gridLoading, gridError,
}: MLPHyperparameterExplorerProps) {
    const safeConfigs = configs ?? [];
    const embDimOptions = useMemo(() => uniqueSorted(safeConfigs.map(c => c.embedding_dim)), [safeConfigs]);
    const hiddenSizeOptions = useMemo(() => uniqueSorted(safeConfigs.map(c => c.hidden_size)), [safeConfigs]);
    const lrOptions = useMemo(() => uniqueSorted(safeConfigs.map(c => c.learning_rate)), [safeConfigs]);

    const [embDim, setEmbDim] = useState(selectedConfig?.embedding_dim ?? embDimOptions[0] ?? 8);
    const [hiddenSize, setHiddenSize] = useState(selectedConfig?.hidden_size ?? hiddenSizeOptions[0] ?? 128);
    const [lr, setLr] = useState(selectedConfig?.learning_rate ?? lrOptions[0] ?? 0.01);

    useEffect(() => {
        if (selectedConfig) {
            setEmbDim(selectedConfig.embedding_dim);
            setHiddenSize(selectedConfig.hidden_size);
            setLr(selectedConfig.learning_rate);
        }
    }, [selectedConfig]);

    const handleSliderChange = useCallback(
        (field: "embDim" | "hiddenSize" | "lr", value: number) => {
            const next = { embDim, hiddenSize, lr };
            next[field] = value;
            if (field === "embDim") setEmbDim(value);
            if (field === "hiddenSize") setHiddenSize(value);
            if (field === "lr") setLr(value);
            onSelectClosest({ embeddingDim: next.embDim, hiddenSize: next.hiddenSize, learningRate: next.lr });
        },
        [embDim, hiddenSize, lr, onSelectClosest]
    );

    useEffect(() => {
        if (selectedConfig && !timeline) onFetchTimeline();
    }, [selectedConfig, timeline, onFetchTimeline]);

    // ── Derived metrics ── (order matters: each depends on the previous)
    const trainLoss = useMemo(() => timeline?.metrics_log?.train_loss ?? [], [timeline]);
    const valLoss = useMemo(() => timeline?.metrics_log?.val_loss ?? [], [timeline]);

    const smoothedTrain = useMemo(() => smoothedTrainLoss(trainLoss), [trainLoss]);

    // Gap uses smoothed train loss when available — more accurate than raw final_train_loss
    const computedGap = useMemo(() => {
        if (selectedConfig?.final_val_loss != null && smoothedTrain != null) {
            return selectedConfig.final_val_loss - smoothedTrain;
        }
        return selectedConfig?.generalization_gap ?? null;
    }, [selectedConfig, smoothedTrain]);

    const anomalyFlags = useMemo(() => selectedConfig ? detectAnomalies(selectedConfig, timeline, computedGap) : null, [selectedConfig, timeline, computedGap]);

    const gradNormData = useMemo((): LossEntry[] => {
        if (!timeline?.metrics_log?.grad_norms) return [];
        return timeline.metrics_log.grad_norms.map(e => ({
            step: e.step,
            value: typeof e.value === "number" ? e.value :
                (e.value && typeof e.value === "object" && "total" in e.value) ? (e.value as { total: number }).total : 0,
        })).filter(e => e.value > 0);
    }, [timeline]);

    const deadNeuronData = useMemo((): LossEntry[] => {
        if (!timeline?.metrics_log?.dead_neurons) return [];
        return timeline.metrics_log.dead_neurons.map(e => ({
            step: e.step,
            value: typeof e.value === "number" ? e.value : 0,
        }));
    }, [timeline]);

    const loggingInfo = useMemo(() => {
        if (trainLoss.length < 2) return null;
        const steps = trainLoss.map(e => e.step);
        const diffs = steps.slice(1).map((s, i) => s - steps[i]);
        const minInterval = Math.min(...diffs); const maxInterval = Math.max(...diffs);
        return { count: trainLoss.length, minInterval, maxInterval, isUniform: minInterval === maxInterval, totalSteps: steps[steps.length - 1] };
    }, [trainLoss]);

    const stabilityInfo = useMemo(() => analyzeStability(valLoss, trainLoss), [valLoss, trainLoss]);

    const costInfo = useMemo(() => selectedConfig ? computeCostInfo(selectedConfig, safeConfigs) : null, [selectedConfig, safeConfigs]);

    const [seedText, setSeedText] = useState("the ");
    const [temperature, setTemperature] = useState(0.8);
    const [maxTokens, setMaxTokens] = useState(80);
    const [compareOpen, setCompareOpen] = useState(false);
    const handleGenerate = useCallback(() => onGenerate(seedText, maxTokens, temperature), [seedText, maxTokens, temperature, onGenerate]);

    // ── Loading / error states ──
    if (gridLoading) return (
        <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-violet-400/50 animate-spin mb-3" />
            <p className="text-xs text-white/30 font-mono">Loading configurations…</p>
        </div>
    );
    if (gridError) return (
        <div className="flex items-center gap-2 px-3 py-3 rounded-lg bg-rose-500/[0.04] border border-rose-500/15">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
            <p className="text-[10px] text-rose-300/60 font-mono">Failed to load MLP grid: {gridError}</p>
        </div>
    );
    if (configs.length === 0) return (
        <div className="flex items-center gap-2 px-3 py-3 rounded-lg bg-amber-500/[0.04] border border-amber-500/15">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
            <p className="text-[10px] text-amber-300/60 font-mono">No MLP configurations available from backend.</p>
        </div>
    );

    return (
        <div className="space-y-10">

            {/* ══════════════════════════════════════════════════
                SECTION 1 — MODEL ZOO OVERVIEW
            ══════════════════════════════════════════════════ */}
            <LabSection
                number="01"
                title="Model Zoo Overview"
                subtitle={`${safeConfigs.length} fully-trained configurations — click any dot to select it and sync the sliders below.`}
            >
                {safeConfigs.length > 1 && (
                    <Expandable title={`Model Zoo · ${safeConfigs.length} Configurations`} defaultOpen={true}>
                        <div className="space-y-3">
                            <p className="text-[11px] text-white/30 leading-relaxed font-mono">
                                Start here. Each dot is one fully-trained model. Click any dot to select it and sync the sliders below.
                                Use filters to find the strongest configs, the worst performers, or outliers worth investigating.
                            </p>
                            <CrossConfigScatterPlot
                                configs={safeConfigs}
                                selectedConfig={selectedConfig}
                                onSelect={(c) => onSelectClosest({ embeddingDim: c.embedding_dim, hiddenSize: c.hidden_size, learningRate: c.learning_rate })}
                            />
                        </div>
                    </Expandable>
                )}
                {/* Sliders */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {embDimOptions.length > 1 && <SliderControl label="Embedding Dim" options={embDimOptions} value={embDim} onChange={v => handleSliderChange("embDim", v)} />}
                    {hiddenSizeOptions.length > 1 && <SliderControl label="Hidden Size" options={hiddenSizeOptions} value={hiddenSize} onChange={v => handleSliderChange("hiddenSize", v)} />}
                    {lrOptions.length > 1 && <SliderControl label="Learning Rate" options={lrOptions} value={lr} onChange={v => handleSliderChange("lr", v)} format={formatLR} />}
                </div>
            </LabSection>

            {/* ══════════════════════════════════════════════════
                SECTION 2 — SELECTED CONFIG PANEL
            ══════════════════════════════════════════════════ */}
            <LabSection
                number="02"
                title="Selected Configuration"
                subtitle="Metric cards, anomaly flags, and a plain-English summary of this model's training quality."
            >
                {/* ── Config badge ── */}
                {selectedConfig && (
                    <div className="flex items-center gap-2 text-[10px] font-mono text-white/25">
                        <span className="text-violet-400/60">Active:</span>
                        <span>emb={selectedConfig.embedding_dim}</span>
                        <span className="text-white/10">·</span>
                        <span>hidden={selectedConfig.hidden_size}</span>
                        <span className="text-white/10">·</span>
                        <span>ctx={selectedConfig.context_size}</span>
                        <span className="text-white/10">·</span>
                        <span>lr={formatLR(selectedConfig.learning_rate)}</span>
                        {selectedConfig.score != null && (
                            <><span className="text-white/10">·</span>
                                <Tip text="Composite quality score — higher is better. Computed as how much this config improved over the random baseline, relative to the best config in the grid.">
                                    <span className="text-emerald-400/50">score={selectedConfig.score.toFixed(2)}</span>
                                </Tip></>
                        )}
                    </div>
                )}

                {/* ── Metric cards with micro-explanations ── */}
                {selectedConfig && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {/* Val Loss (primary) + Smoothed Train */}
                        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <TrendingDown className="w-3 h-3 text-emerald-400/60" />
                                <Tip text={selectedConfig.final_val_loss != null
                                    ? "Validation loss: how well the model predicts held-out data it never saw during training. Lower = better. This is the primary metric — unlike training loss, it cannot be gamed by memorization."
                                    : "Training loss only — validation loss unavailable for this config. Training loss can be misleadingly optimistic because the model has seen these examples."}>
                                    <span className="text-[9px] font-mono uppercase tracking-widest text-white/30">{lossSourceLabel(selectedConfig)}</span>
                                </Tip>
                            </div>
                            <span className="text-lg font-mono font-bold text-white">{selectedConfig.final_loss.toFixed(3)}</span>
                            {smoothedTrain != null && (
                                <div className="mt-1.5 pt-1.5 border-t border-white/[0.05]">
                                    <Tip text="Mean of the last ~10% of logged training loss values. Smoothing removes per-batch noise, giving a stable estimate of where training loss settled.">
                                        <span className="text-[8px] font-mono uppercase tracking-widest text-white/25">Train (smoothed)</span>
                                    </Tip>
                                    <div className="text-sm font-mono font-semibold text-violet-300/70 mt-0.5">{smoothedTrain.toFixed(3)}</div>
                                </div>
                            )}
                        </div>

                        {/* Perplexity */}
                        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <Sparkles className="w-3 h-3 text-amber-400/60" />
                                <Tip text="Perplexity ≈ exp(loss). Intuition: if perplexity = 20, the model is as uncertain as randomly choosing among 20 tokens. Lower = better. A random model has perplexity equal to the vocabulary size.">
                                    <span className="text-[9px] font-mono uppercase tracking-widest text-white/30">Perplexity</span>
                                </Tip>
                            </div>
                            <span className="text-lg font-mono font-bold text-white">{selectedConfig.perplexity.toFixed(1)}</span>
                            {selectedConfig.expected_uniform_loss != null && (
                                <Tip text="Perplexity a uniform random model would achieve. Any useful model should be well below this.">
                                    <div className="text-[8px] font-mono text-white/20 mt-0.5 cursor-help">
                                        random: {Math.exp(selectedConfig.expected_uniform_loss).toFixed(1)}
                                    </div>
                                </Tip>
                            )}
                        </div>

                        {/* Train–Val Gap */}
                        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                            <div className="flex items-center justify-center gap-1 mb-1">
                                {computedGap != null ? (
                                    <>
                                        <GitCompareArrows className="w-3 h-3 text-cyan-400/60" />
                                        <Tip text="Train–Val Gap = val_loss − smoothed_train_loss. Positive = overfitting (model fits training data better than new data). Negative = healthy or underfitting. Values > 0.3 are a concern. Uses smoothed train loss for stability.">
                                            <span className="text-[9px] font-mono uppercase tracking-widest text-white/30">Train–Val Gap</span>
                                        </Tip>
                                    </>
                                ) : (
                                    <>
                                        <Layers className="w-3 h-3 text-emerald-400/60" />
                                        <Tip text="Total number of learnable weights and biases in this model configuration.">
                                            <span className="text-[9px] font-mono uppercase tracking-widest text-white/30">Params</span>
                                        </Tip>
                                    </>
                                )}
                            </div>
                            {computedGap != null ? (
                                <span className={`text-lg font-mono font-bold ${computedGap > 0.3 ? "text-amber-400" : computedGap > 0.1 ? "text-white" : "text-emerald-400"}`}>
                                    {computedGap > 0 ? "+" : ""}{computedGap.toFixed(3)}
                                </span>
                            ) : (
                                <span className="text-lg font-mono font-bold text-white">{formatParams(selectedConfig.total_parameters ?? 0)}</span>
                            )}
                        </div>

                        {/* Compute Cost (params × steps, deterministic) */}
                        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <Cpu className="w-3 h-3 text-violet-400/60" />
                                <Tip align="right" text={`Compute = parameters × training steps (${(TOTAL_TRAINING_STEPS / 1000).toFixed(0)}k). This is a deterministic proxy for compute cost — machine-independent, unlike wall-clock time. Bar shows cost relative to the most expensive config in this grid.`}>
                                    <span className="text-[9px] font-mono uppercase tracking-widest text-white/30">Compute</span>
                                </Tip>
                            </div>
                            <span className="text-sm font-mono font-bold text-white">{costInfo?.label ?? "—"}</span>
                            <Tip align="right" text={`${formatParams(selectedConfig.total_parameters ?? 0)} parameters × ${(TOTAL_TRAINING_STEPS / 1000).toFixed(0)}k steps. Larger models cost more to train but don't always generalise better.`}>
                                <div className="text-[8px] font-mono text-white/20 mt-0.5 cursor-help">
                                    {formatParams(selectedConfig.total_parameters ?? 0)} × {(TOTAL_TRAINING_STEPS / 1000).toFixed(0)}k
                                </div>
                            </Tip>
                            {/* Tiny progress bar */}
                            {costInfo && (
                                <div className="mt-1.5 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                                    <div className="h-full rounded-full bg-violet-500/40" style={{ width: `${(costInfo.ratio * 100).toFixed(0)}%` }} />
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ── Anomaly flags ── */}
                {anomalyFlags && <AnomalyBadges flags={anomalyFlags} />}

                {/* ── Plain-English config summary ── */}
                {selectedConfig && anomalyFlags && (() => {
                    const summary = buildConfigSummary(selectedConfig, anomalyFlags, computedGap, stabilityInfo);
                    const colors = {
                        emerald: "bg-emerald-500/[0.04] border-emerald-500/15 text-emerald-300/70",
                        amber: "bg-amber-500/[0.04] border-amber-500/15 text-amber-300/70",
                        rose: "bg-rose-500/[0.04] border-rose-500/15 text-rose-300/70",
                        blue: "bg-blue-500/[0.04] border-blue-500/15 text-blue-300/70",
                        white: "bg-white/[0.02] border-white/[0.06] text-white/40",
                    };
                    return (
                        <div className={`flex items-start gap-2.5 px-3 py-2.5 rounded-lg border text-[11px] leading-relaxed font-mono ${colors[summary.color]}`}>
                            <span className="shrink-0 mt-0.5">{summary.color === "rose" ? "✗" : summary.color === "amber" ? "⚠" : summary.color === "emerald" ? "✓" : summary.color === "blue" ? "↗" : "·"}</span>
                            <span>{summary.text}</span>
                        </div>
                    );
                })()}

                {/* ── Training Timeline ── */}
                <div className="rounded-xl border border-white/[0.06] bg-black/30 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <Activity className="w-3.5 h-3.5 text-white/20" />
                            <Tip text="Loss curves over training steps. Green = validation loss (on held-out data, primary). Purple = training loss. Dashed red = random baseline — a model guessing uniformly. Convergence means both curves flatten.">
                                <p className="text-[10px] font-mono uppercase tracking-widest text-white/25">Training Timeline</p>
                            </Tip>
                        </div>
                        {loggingInfo && (
                            <span className="text-[8px] font-mono text-white/15 flex items-center gap-1">
                                <Tip text="Number of metric checkpoints logged during training. More points = smoother, more informative curves.">
                                    <span className="cursor-help">{loggingInfo.count} pts</span>
                                </Tip>
                                <span className="text-white/10">·</span>
                                <Tip text={`A metric snapshot was saved every ${loggingInfo.minInterval} gradient update steps. Finer logging reveals more training dynamics but costs slightly more disk space.`}>
                                    <span className="cursor-help">every {loggingInfo.minInterval} steps</span>
                                </Tip>
                                <span className="text-white/10">·</span>
                                <Tip text={`Total gradient updates performed. All configs in this grid train for exactly ${(TOTAL_TRAINING_STEPS / 1000).toFixed(0)}k steps for fair comparison.`}>
                                    <span className="cursor-help">{loggingInfo.totalSteps >= 1000 ? `${(loggingInfo.totalSteps / 1000).toFixed(0)}k` : loggingInfo.totalSteps} total</span>
                                </Tip>
                                {!loggingInfo.isUniform && <span className="text-amber-400/40"> · non-uniform</span>}
                            </span>
                        )}
                    </div>
                    {timelineLoading ? (
                        <div className="flex items-center justify-center py-6"><Loader2 className="w-4 h-4 text-violet-400/40 animate-spin" /></div>
                    ) : (trainLoss.length > 0 || valLoss.length > 0) ? (
                        <>
                            <DualLossChart trainLoss={trainLoss} valLoss={valLoss} expectedUniformLoss={selectedConfig?.expected_uniform_loss} />
                            {/* Stability summary */}
                            {stabilityInfo && (
                                <div className="flex flex-wrap gap-3 mt-2 text-[8px] font-mono text-white/20">
                                    <Tip text="Direction of validation loss in the second half of training. Decreasing = still learning. Flat = converged. Increasing = overfitting onset.">
                                        <span className="cursor-help">Trend: <span className={stabilityInfo.valTrend === "decreasing" ? "text-emerald-400/60" : stabilityInfo.valTrend === "increasing" ? "text-rose-400/60" : "text-white/30"}>{stabilityInfo.valTrend}</span></span>
                                    </Tip>
                                    <Tip text="Statistical variance of validation loss over the full training run. Near-zero = stable training. High variance = noisy or unstable optimization.">
                                        <span className="cursor-help">Variance: {stabilityInfo.valVariance.toFixed(4)}</span>
                                    </Tip>
                                    {stabilityInfo.convergenceStep != null && (
                                        <Tip text="Training step where validation loss first fell below 50% of its initial value. Earlier = faster learning.">
                                            <span className="cursor-help">Converged ~{stabilityInfo.convergenceStep >= 1000 ? `${(stabilityInfo.convergenceStep / 1000).toFixed(0)}k` : stabilityInfo.convergenceStep} steps</span>
                                        </Tip>
                                    )}
                                </div>
                            )}
                        </>
                    ) : (
                        <p className="text-[10px] text-white/20 italic text-center py-4">No timeline data available.</p>
                    )}
                </div>

            </LabSection>

            {/* ══════════════════════════════════════════════════
                SECTION 3 — EMBEDDING SPACE
            ══════════════════════════════════════════════════ */}
            <LabSection
                number="03"
                title="Embedding Space"
                subtitle="Vocabulary tokens projected to 2D via PCA. Scrub through training snapshots to watch structure emerge from noise."
            >
                {/* ── Embedding Space + Drift + Neighbors ── */}
                <div className="rounded-xl border border-white/[0.06] bg-black/30 p-4 space-y-4">
                    <div className="flex items-center gap-2">
                        <Tip text="Each point is one vocabulary token, projected from the learned embedding space to 2D via PCA. Use the snapshot slider to watch embeddings evolve from random noise to structured clusters during training.">
                            <p className="text-[10px] font-mono uppercase tracking-widest text-white/25">PCA 2D · Training Drift</p>
                        </Tip>
                    </div>
                    <EmbeddingDriftAnimator selectedConfig={selectedConfig} />
                    <NearestNeighborExplorer selectedConfig={selectedConfig} />
                </div>
            </LabSection>

            {/* ══════════════════════════════════════════════════
                SECTION 4 — TEXT GENERATION
            ══════════════════════════════════════════════════ */}
            <LabSection
                number="04"
                title="Text Generation"
                subtitle="Generate character sequences from the selected model. Adjust temperature and length to explore the output distribution."
            >
                {/* ── Generated Text Sample ── */}
                <div className="rounded-xl border border-white/[0.06] bg-black/30 p-4">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-white/25 mb-2">Generated Sample</p>
                    <div className="flex gap-2 mb-3">
                        <input type="text" value={seedText} onChange={e => setSeedText(e.target.value)} placeholder="Seed text…"
                            className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs font-mono text-white/70 placeholder:text-white/20 focus:outline-none focus:border-violet-500/40" />
                        <button onClick={handleGenerate} disabled={generationLoading || !selectedConfig}
                            className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-violet-500/15 text-violet-300 border border-violet-500/30 hover:bg-violet-500/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                            {generationLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Generate"}
                        </button>
                    </div>
                    {/* Controls row: Temperature + Max tokens */}
                    <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="flex items-center gap-3">
                            <Tip text="Temperature controls randomness. Low (0.1) = deterministic, always picks the most likely next character. High (2.0) = creative but chaotic, samples from a flatter distribution.">
                                <span className="text-[9px] font-mono uppercase tracking-widest text-white/25 cursor-help shrink-0">Temp</span>
                            </Tip>
                            <input
                                type="range" min={1} max={20} value={Math.round(temperature * 10)}
                                onChange={e => setTemperature(Number(e.target.value) / 10)}
                                className="flex-1 accent-violet-500 cursor-pointer"
                            />
                            <span className="text-xs font-mono font-bold text-violet-400 w-8 text-right">{temperature.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Tip text="Maximum number of characters to generate. The model generates one character at a time; more tokens = longer output but slower.">
                                <span className="text-[9px] font-mono uppercase tracking-widest text-white/25 cursor-help shrink-0">Tokens</span>
                            </Tip>
                            <input
                                type="range" min={20} max={200} step={10} value={maxTokens}
                                onChange={e => setMaxTokens(Number(e.target.value))}
                                className="flex-1 accent-violet-500 cursor-pointer"
                            />
                            <span className="text-xs font-mono font-bold text-violet-400 w-8 text-right">{maxTokens}</span>
                        </div>
                    </div>
                    {generation ? (
                        <div className="space-y-2">
                            <p className="font-mono text-sm text-white/60 leading-relaxed">&quot;{generation.generated_text}&quot;</p>
                            <div className="flex items-center gap-3 text-[9px] font-mono text-white/20">
                                <Tip text="Perplexity = exp(loss). This is the model's estimated perplexity on the training distribution — lower means more confident and fluent predictions.">
                                    <span className="cursor-help">
                                        est. PPL ≈ {selectedConfig ? Math.exp(selectedConfig.final_loss).toFixed(1) : "—"}
                                    </span>
                                </Tip>
                                <span>·</span>
                                <span>{generation.length} chars</span>
                                <span>·</span>
                                <span>{generation.metadata?.inference_time_ms?.toFixed(0) ?? "—"}ms</span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-[10px] text-white/20 italic">Press Generate to produce text from the selected model.</p>
                    )}
                </div>

            </LabSection>

            {/* ══════════════════════════════════════════════════
                SECTION 5 — ADVANCED DIAGNOSTICS
            ══════════════════════════════════════════════════ */}
            <LabSection
                number="05"
                title="Advanced Training Diagnostics"
                subtitle="Gradient flow, neuron health, and overfitting patterns across the full training run."
            >
                <Expandable title="Advanced Training Diagnostics" defaultOpen={true}>
                    <div className="space-y-8 pt-1">
                        {/* Intro */}
                        <p className="text-[11px] text-white/35 leading-relaxed">
                            These diagnostics reveal internal training dynamics: gradient flow, neuron usage, and
                            overfitting patterns. They help advanced users understand how the model learns beyond
                            simple loss curves.
                        </p>

                        {/* Sparklines */}
                        {(gradNormData.length > 0 || deadNeuronData.length > 0) && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {gradNormData.length > 0 && (
                                    <div className="space-y-2">
                                        <Tip align="left" text="Gradient norm is the overall magnitude of weight updates at each training step. Stable, moderate values indicate healthy optimization. Sudden spikes suggest instability; values collapsing to zero indicate vanishing gradients.">
                                            <span className="cursor-help inline-block">
                                                <MiniSparkline data={gradNormData} color="rgb(251,146,60)" label="Gradient Norm over Steps" />
                                            </span>
                                        </Tip>
                                    </div>
                                )}
                                {deadNeuronData.length > 0 && (
                                    <div className="space-y-2">
                                        <Tip align="left" text="Fraction of neurons that never activate during training. A 'dead' neuron always outputs zero, contributing nothing to learning. High values (> 20%) indicate wasted model capacity — often caused by large learning rates or poor initialization.">
                                            <span className="cursor-help inline-block">
                                                <MiniSparkline data={deadNeuronData} color="rgb(251,113,133)" label="Dead Neuron Ratio over Steps" />
                                            </span>
                                        </Tip>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Snapshot heatmaps */}
                        {timeline && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="space-y-1">
                                    <Tip align="left" text="Shows gradient magnitudes per parameter group (C=embedding, W1/b1=hidden layer, W2/b2=output layer) across training snapshots. Balanced magnitudes across layers suggest stable, well-conditioned learning. Red cells indicate large gradients that may destabilize training.">
                                        <span className="cursor-help inline-block text-[9px] font-mono uppercase tracking-widest text-white/30 mb-2">ⓘ Gradient Norms per Layer</span>
                                    </Tip>
                                    <GradientHealthHeatmap timeline={timeline} />
                                </div>
                                <div className="space-y-1">
                                    <Tip align="left" text="Displays saturation and dead neuron statistics over training time. Saturation (left bar) means neurons are stuck near the tanh activation limits (±1) and contribute near-zero gradient. Dead fraction (right, pink) are neurons that never activate. Both indicate underutilized model capacity.">
                                        <span className="cursor-help inline-block text-[9px] font-mono uppercase tracking-widest text-white/30 mb-2">ⓘ Activation Health over Training</span>
                                    </Tip>
                                    <ActivationSaturationHeatmap timeline={timeline} />
                                </div>
                            </div>
                        )}

                        {/* Generalization gap heatmap */}
                        {safeConfigs.length > 1 && (
                            <div className="pt-4 border-t border-white/[0.06] space-y-2">
                                <Tip align="left" text="Difference between training loss and validation loss (val − train) across all configurations, averaged over learning rates. Green = model generalizes well to unseen data. Red = overfitting — the model memorizes training data but fails on new examples. Use this to identify which architecture choices cause overfitting.">
                                    <span className="cursor-help inline-block text-[10px] font-mono uppercase tracking-widest text-white/30">ⓘ Generalization Gap Heatmap · All Configs</span>
                                </Tip>
                                <GeneralizationGapHeatmap configs={safeConfigs} />
                            </div>
                        )}
                    </div>
                </Expandable>

            </LabSection>

            {/* ── Data source indicator ── */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/[0.04] border border-emerald-500/15">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <p className="text-[10px] text-emerald-300/60 font-mono">
                    Real data from {configs.length} trained configs · {TOTAL_TRAINING_STEPS / 1000}k steps each · logged every {loggingInfo?.minInterval ?? 100} steps.
                    {selectedConfig?.final_val_loss != null ? " Primary: validation loss." : " Primary: training loss (val unavailable)."}
                </p>
            </div>
        </div>
    );
}

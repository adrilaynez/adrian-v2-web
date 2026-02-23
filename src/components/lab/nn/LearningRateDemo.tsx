"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/i18n/context";
import { Slider } from "@/components/ui/slider";

/*
  Interactive learning rate demo.
  Uses the running example: w₁×1 + w₂×2, target=3.
  Starts with w₁=4, w₂=3 (output=10, loss=49).
  User picks a learning rate and watches what happens:
  - Too small (0.001): barely moves
  - Good (0.02): smooth convergence
  - Too large (0.3): overshoots and diverges
  Three preset buttons + a custom slider.
*/

const X1 = 1, X2 = 2, TARGET = 3;
const INIT_W1 = 4, INIT_W2 = 3;
const MAX_STEPS = 40;

interface Snapshot {
    step: number;
    w1: number;
    w2: number;
    output: number;
    loss: number;
}

function simulate(lr: number): Snapshot[] {
    const history: Snapshot[] = [];
    let w1 = INIT_W1, w2 = INIT_W2;
    for (let i = 0; i <= MAX_STEPS; i++) {
        const output = w1 * X1 + w2 * X2;
        const error = output - TARGET;
        const loss = error * error;
        history.push({ step: i, w1, w2, output, loss });
        // Stop if diverging badly
        if (loss > 1e6) break;
        const dLdw1 = 2 * error * X1;
        const dLdw2 = 2 * error * X2;
        w1 = w1 - lr * dLdw1;
        w2 = w2 - lr * dLdw2;
    }
    return history;
}

type Preset = "tiny" | "good" | "big";

const PRESETS: Record<Preset, { lr: number; color: string; bg: string; border: string }> = {
    tiny: { lr: 0.001, color: "text-sky-400", bg: "bg-sky-500/15", border: "border-sky-500/30" },
    good: { lr: 0.02, color: "text-emerald-400", bg: "bg-emerald-500/15", border: "border-emerald-500/30" },
    big: { lr: 0.3, color: "text-rose-400", bg: "bg-rose-500/15", border: "border-rose-500/30" },
};

export function LearningRateDemo() {
    const { t } = useI18n();
    const [preset, setPreset] = useState<Preset>("good");
    const [customLr, setCustomLr] = useState(0.02);
    const [useCustom, setUseCustom] = useState(false);
    const [animStep, setAnimStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const lr = useCustom ? customLr : PRESETS[preset].lr;
    const history = simulate(lr);
    const maxStep = history.length - 1;
    const current = history[Math.min(animStep, maxStep)];

    // Auto-play animation
    const startAnimation = useCallback(() => {
        setAnimStep(0);
        setIsPlaying(true);
    }, []);

    useEffect(() => {
        if (!isPlaying) return;
        intervalRef.current = setInterval(() => {
            setAnimStep(prev => {
                if (prev >= maxStep) {
                    setIsPlaying(false);
                    if (intervalRef.current) clearInterval(intervalRef.current);
                    return maxStep;
                }
                return prev + 1;
            });
        }, 100);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isPlaying, maxStep]);

    // Reset animation when LR changes
    useEffect(() => {
        setAnimStep(0);
        setIsPlaying(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
    }, [lr]);

    // Determine behavior category
    const finalLoss = history[maxStep].loss;
    const diverged = finalLoss > 100;
    const converged = finalLoss < 1;
    const slow = !converged && !diverged && history.length === MAX_STEPS + 1;

    // Loss chart dimensions
    const chartW = 320;
    const chartH = 80;
    const displayHistory = history.slice(0, animStep + 1);
    const maxLoss = Math.max(...history.map(s => Math.min(s.loss, 200)), 1);

    const lossPoints = displayHistory.map((s, i) => {
        const x = (i / Math.max(maxStep, 1)) * chartW;
        const y = chartH - (Math.min(s.loss, maxLoss) / maxLoss) * (chartH - 4);
        return `${x},${y}`;
    }).join(" ");

    const accentColor = diverged ? "rose" : converged ? "emerald" : "amber";

    return (
        <div className="rounded-2xl border border-white/[0.07] bg-gradient-to-br from-white/[0.02] to-transparent p-6">
            <p className="text-xs font-mono uppercase tracking-widest text-white/30 mb-5">
                {t("neuralNetworkNarrative.howItLearns.learningRate.title")}
            </p>

            {/* Preset buttons */}
            <div className="flex gap-2 mb-4 flex-wrap">
                {(Object.entries(PRESETS) as [Preset, typeof PRESETS[Preset]][]).map(([key, p]) => (
                    <button
                        key={key}
                        onClick={() => { setPreset(key); setUseCustom(false); }}
                        className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border flex items-center gap-2 ${!useCustom && preset === key
                            ? `${p.bg} ${p.border} ${p.color}`
                            : "bg-white/[0.03] border-white/[0.08] text-white/40 hover:text-white/60 hover:border-white/[0.12]"
                            }`}
                    >
                        <span className="font-mono">η = {p.lr}</span>
                        <span className="text-[10px] opacity-60">
                            {key === "tiny" ? t("neuralNetworkNarrative.howItLearns.learningRate.tooSmall")
                                : key === "good" ? t("neuralNetworkNarrative.howItLearns.learningRate.justRight")
                                    : t("neuralNetworkNarrative.howItLearns.learningRate.tooLarge")}
                        </span>
                    </button>
                ))}
            </div>

            {/* Custom slider */}
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3 mb-5">
                <div className="flex items-center justify-between mb-2">
                    <button
                        onClick={() => setUseCustom(true)}
                        className={`text-xs font-mono ${useCustom ? "text-violet-400 font-bold" : "text-white/30 hover:text-white/50"} transition-colors`}
                    >
                        {t("neuralNetworkNarrative.howItLearns.learningRate.custom")}
                    </button>
                    <span className={`text-sm font-mono font-bold ${useCustom ? "text-violet-400" : "text-white/30"}`}>
                        η = {(useCustom ? customLr : lr).toFixed(3)}
                    </span>
                </div>
                <Slider
                    min={0.001}
                    max={0.5}
                    step={0.001}
                    value={[useCustom ? customLr : lr]}
                    onValueChange={([v]) => { setCustomLr(v); setUseCustom(true); }}
                />
            </div>

            {/* Loss curve */}
            <div className="rounded-xl bg-black/30 border border-white/[0.05] p-4 mb-5">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] font-mono text-white/25 uppercase tracking-widest">
                        {t("neuralNetworkNarrative.howItLearns.learningRate.lossOverTime")}
                    </span>
                    <span className={`text-xs font-mono font-bold text-${accentColor}-400`}>
                        {t("neuralNetworkNarrative.howItLearns.learningRate.lossValue")}: {current.loss > 9999 ? "∞" : current.loss.toFixed(1)}
                    </span>
                </div>

                <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-20" preserveAspectRatio="none">
                    {/* Target line (loss = 0) */}
                    <line x1="0" y1={chartH} x2={chartW} y2={chartH} stroke="rgba(52,211,153,0.15)" strokeDasharray="4 4" />

                    {/* Loss curve */}
                    {displayHistory.length > 1 && (
                        <polyline
                            fill="none"
                            stroke={diverged ? "rgba(251,113,133,0.8)" : converged ? "rgba(52,211,153,0.8)" : "rgba(251,191,36,0.8)"}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            points={lossPoints}
                        />
                    )}

                    {/* Current point */}
                    {displayHistory.length > 0 && (
                        <circle
                            cx={(animStep / Math.max(maxStep, 1)) * chartW}
                            cy={chartH - (Math.min(current.loss, maxLoss) / maxLoss) * (chartH - 4)}
                            r="4"
                            fill={diverged ? "rgb(251,113,133)" : converged ? "rgb(52,211,153)" : "rgb(251,191,36)"}
                        />
                    )}
                </svg>

                {/* Step counter */}
                <div className="flex items-center justify-between mt-2">
                    <span className="text-[9px] font-mono text-white/20">Step 0</span>
                    <span className="text-[9px] font-mono text-white/30">
                        Step {animStep} / {maxStep}
                    </span>
                    <span className="text-[9px] font-mono text-white/20">Step {maxStep}</span>
                </div>
            </div>

            {/* Current state cards */}
            <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="rounded-lg bg-white/[0.02] border border-white/[0.06] p-3 text-center">
                    <span className="text-[9px] text-white/30 block font-mono mb-1">Output</span>
                    <span className={`text-lg font-mono font-bold ${Math.abs(current.output - TARGET) < 0.5 ? "text-emerald-400" : "text-white/60"}`}>
                        {current.output > 9999 ? "∞" : current.output.toFixed(1)}
                    </span>
                </div>
                <div className="rounded-lg bg-emerald-500/[0.03] border border-emerald-500/15 p-3 text-center">
                    <span className="text-[9px] text-emerald-400/50 block font-mono mb-1">Target</span>
                    <span className="text-lg font-mono font-bold text-emerald-400">{TARGET}</span>
                </div>
                <div className="rounded-lg bg-white/[0.02] border border-white/[0.06] p-3 text-center">
                    <span className="text-[9px] text-white/30 block font-mono mb-1">η</span>
                    <span className="text-lg font-mono font-bold text-violet-400">{lr.toFixed(3)}</span>
                </div>
            </div>

            {/* Play / Reset controls */}
            <div className="flex items-center gap-3 flex-wrap mb-5">
                <button
                    onClick={startAnimation}
                    disabled={isPlaying}
                    className={`px-5 py-2 rounded-full text-xs font-semibold border transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-${accentColor}-500/15 border-${accentColor}-500/30 text-${accentColor}-400 hover:bg-${accentColor}-500/25`}
                >
                    {isPlaying
                        ? t("neuralNetworkNarrative.howItLearns.learningRate.running")
                        : t("neuralNetworkNarrative.howItLearns.learningRate.play")}
                </button>
                <button
                    onClick={() => { setAnimStep(0); setIsPlaying(false); if (intervalRef.current) clearInterval(intervalRef.current); }}
                    className="px-4 py-2 rounded-full text-xs font-semibold bg-white/[0.04] border border-white/[0.08] text-white/50 hover:text-white/80 transition-all"
                >
                    {t("neuralNetworkNarrative.howItLearns.learningRate.reset")}
                </button>
            </div>

            {/* Verdict */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={`${lr}-${animStep >= maxStep ? "done" : "running"}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className={`rounded-xl p-4 border text-center ${diverged
                        ? "bg-rose-500/[0.06] border-rose-500/25"
                        : converged
                            ? "bg-emerald-500/[0.06] border-emerald-500/25"
                            : "bg-amber-500/[0.06] border-amber-500/25"
                        }`}
                >
                    {animStep >= maxStep ? (
                        <>
                            <p className={`text-sm font-semibold text-${accentColor}-400 mb-1`}>
                                {diverged
                                    ? t("neuralNetworkNarrative.howItLearns.learningRate.verdictDiverge")
                                    : converged
                                        ? t("neuralNetworkNarrative.howItLearns.learningRate.verdictConverge")
                                        : t("neuralNetworkNarrative.howItLearns.learningRate.verdictSlow")}
                            </p>
                            <p className="text-xs text-white/40">
                                {diverged
                                    ? t("neuralNetworkNarrative.howItLearns.learningRate.explainDiverge")
                                    : converged
                                        ? t("neuralNetworkNarrative.howItLearns.learningRate.explainConverge")
                                        : t("neuralNetworkNarrative.howItLearns.learningRate.explainSlow")}
                            </p>
                        </>
                    ) : (
                        <p className="text-xs text-white/30 italic">
                            {t("neuralNetworkNarrative.howItLearns.learningRate.watchPrompt")}
                        </p>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

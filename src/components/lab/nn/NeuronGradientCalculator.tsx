"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/i18n/context";

/*
  Simplified single training step using the running example:
  w₁=4, w₂=3, x₁=1, x₂=2, target=3.
  No bias, no ReLU. Just: forward → loss → gradients → update → verify.
  5 steps instead of 8.
*/

const X1 = 1, X2 = 2, TARGET = 3;

function run(w1: number, w2: number, lr: number) {
    const output = w1 * X1 + w2 * X2;
    const error = output - TARGET;
    const loss = error * error;
    // Gradients: ∂loss/∂w₁ = 2·error·x₁, ∂loss/∂w₂ = 2·error·x₂
    const dLdw1 = 2 * error * X1;
    const dLdw2 = 2 * error * X2;
    const w1New = w1 - lr * dLdw1;
    const w2New = w2 - lr * dLdw2;
    const outputNew = w1New * X1 + w2New * X2;
    const lossNew = (outputNew - TARGET) ** 2;
    return { output, error, loss, dLdw1, dLdw2, w1New, w2New, outputNew, lossNew };
}

type Phase = "forward" | "loss" | "gradient" | "update" | "verify";
const PHASES: Phase[] = ["forward", "loss", "gradient", "update", "verify"];

const PHASE_COLORS: Record<Phase, string> = {
    forward: "emerald",
    loss: "amber",
    gradient: "rose",
    update: "indigo",
    verify: "emerald",
};

export function NeuronGradientCalculator() {
    const { t } = useI18n();
    const [step, setStep] = useState(0);
    const lr = 0.05;
    const w1 = 4, w2 = 3;

    const r = useMemo(() => run(w1, w2, lr), []);
    const phase = PHASES[step];
    const color = PHASE_COLORS[phase];

    const phaseClasses: Record<Phase, { bg: string; text: string }> = {
        forward: { bg: "bg-emerald-500/[0.04] border-emerald-500/15", text: "text-emerald-400" },
        loss: { bg: "bg-amber-500/[0.04] border-amber-500/15", text: "text-amber-400" },
        gradient: { bg: "bg-rose-500/[0.04] border-rose-500/15", text: "text-rose-400" },
        update: { bg: "bg-indigo-500/[0.04] border-indigo-500/15", text: "text-indigo-400" },
        verify: { bg: "bg-emerald-500/[0.04] border-emerald-500/15", text: "text-emerald-400" },
    };

    return (
        <div className="rounded-2xl border border-emerald-500/[0.12] bg-gradient-to-br from-emerald-500/[0.04] to-transparent p-6">
            <p className="text-xs font-mono uppercase tracking-widest text-emerald-400/50 mb-5">
                {t("neuralNetworkNarrative.howItLearns.neuronCalc.title")}
            </p>

            {/* Step indicator */}
            <div className="flex items-center gap-1 mb-5">
                {PHASES.map((p, i) => (
                    <button
                        key={i}
                        onClick={() => setStep(i)}
                        className={`h-2 flex-1 rounded-full transition-all cursor-pointer hover:opacity-80 ${i <= step ? `bg-${PHASE_COLORS[p]}-400` : "bg-white/[0.06]"
                            }`}
                    />
                ))}
            </div>

            <p className="text-[10px] text-white/30 mb-3 font-mono">
                {t("neuralNetworkNarrative.howItLearns.neuronCalc.step").replace("{n}", String(step + 1)).replace("{total}", "5")}
            </p>

            {/* Step content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className={`rounded-xl p-5 mb-5 border ${phaseClasses[phase].bg}`}
                >
                    {/* Step 0: Forward */}
                    {step === 0 && (
                        <div>
                            <p className={`text-sm font-semibold mb-3 ${phaseClasses[phase].text}`}>
                                {t("neuralNetworkNarrative.howItLearns.neuronCalc.s1Title")}
                            </p>
                            <p className="text-xs text-white/40 mb-4">{t("neuralNetworkNarrative.howItLearns.neuronCalc.s1Desc")}</p>
                            <div className="rounded-lg bg-black/20 p-4">
                                <div className="flex items-center justify-center gap-2 flex-wrap font-mono text-sm">
                                    <span className="text-rose-400 font-bold">{w1}</span>
                                    <span className="text-white/30">×</span>
                                    <span className="text-sky-400">{X1}</span>
                                    <span className="text-white/30">+</span>
                                    <span className="text-rose-400 font-bold">{w2}</span>
                                    <span className="text-white/30">×</span>
                                    <span className="text-amber-400">{X2}</span>
                                    <span className="text-white/30">=</span>
                                    <span className="text-xl font-bold text-white/80">{r.output}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 1: Loss */}
                    {step === 1 && (
                        <div>
                            <p className={`text-sm font-semibold mb-3 ${phaseClasses[phase].text}`}>
                                {t("neuralNetworkNarrative.howItLearns.neuronCalc.s3Title")}
                            </p>
                            <p className="text-xs text-white/40 mb-4">{t("neuralNetworkNarrative.howItLearns.neuronCalc.s3Desc")}</p>
                            <div className="rounded-lg bg-black/20 p-4 space-y-2">
                                <div className="flex items-center justify-center gap-2 font-mono text-sm">
                                    <span className="text-white/40">error =</span>
                                    <span className="text-white/60">{r.output}</span>
                                    <span className="text-white/30">−</span>
                                    <span className="text-emerald-400">{TARGET}</span>
                                    <span className="text-white/30">=</span>
                                    <span className="text-rose-400 font-bold">{r.error}</span>
                                </div>
                                <div className="flex items-center justify-center gap-2 font-mono text-sm">
                                    <span className="text-white/40">loss =</span>
                                    <span className="text-white/60">{r.error}²</span>
                                    <span className="text-white/30">=</span>
                                    <span className="text-xl text-amber-400 font-bold">{r.loss}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Gradients */}
                    {step === 2 && (
                        <div>
                            <p className={`text-sm font-semibold mb-3 ${phaseClasses[phase].text}`}>
                                {t("neuralNetworkNarrative.howItLearns.neuronCalc.s6Title")}
                            </p>
                            <p className="text-xs text-white/40 mb-4">{t("neuralNetworkNarrative.howItLearns.neuronCalc.s6Desc")}</p>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-lg bg-black/20 p-3 text-center">
                                    <span className="text-[9px] text-white/30 block font-mono mb-1">∂loss/∂w₁</span>
                                    <span className="text-xs font-mono text-white/40">2 × {r.error} × {X1} = </span>
                                    <span className="text-lg font-mono font-bold text-rose-400">{r.dLdw1}</span>
                                </div>
                                <div className="rounded-lg bg-black/20 p-3 text-center">
                                    <span className="text-[9px] text-white/30 block font-mono mb-1">∂loss/∂w₂</span>
                                    <span className="text-xs font-mono text-white/40">2 × {r.error} × {X2} = </span>
                                    <span className="text-lg font-mono font-bold text-rose-400">{r.dLdw2}</span>
                                </div>
                            </div>
                            <p className="text-[11px] text-white/30 mt-3 text-center">
                                {t("neuralNetworkNarrative.howItLearns.neuronCalc.gradExplain")}
                            </p>
                        </div>
                    )}

                    {/* Step 3: Update */}
                    {step === 3 && (
                        <div>
                            <p className={`text-sm font-semibold mb-3 ${phaseClasses[phase].text}`}>
                                {t("neuralNetworkNarrative.howItLearns.neuronCalc.s7Title")}
                            </p>
                            <p className="text-xs text-white/40 mb-4">
                                {t("neuralNetworkNarrative.howItLearns.neuronCalc.s7Desc")}
                            </p>
                            <div className="space-y-3">
                                <div className="rounded-lg bg-black/20 p-3">
                                    <div className="flex items-center justify-between font-mono text-sm">
                                        <span className="text-white/40">w₁ = {w1} − {lr} × {r.dLdw1}</span>
                                        <span className="text-indigo-400 font-bold">= {r.w1New.toFixed(1)}</span>
                                    </div>
                                </div>
                                <div className="rounded-lg bg-black/20 p-3">
                                    <div className="flex items-center justify-between font-mono text-sm">
                                        <span className="text-white/40">w₂ = {w2} − {lr} × {r.dLdw2}</span>
                                        <span className="text-indigo-400 font-bold">= {r.w2New.toFixed(1)}</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-[11px] text-white/30 mt-3 text-center font-mono">
                                w_new = w − η × gradient (η = {lr})
                            </p>
                        </div>
                    )}

                    {/* Step 4: Verify */}
                    {step === 4 && (
                        <div>
                            <p className={`text-sm font-semibold mb-3 ${phaseClasses[phase].text}`}>
                                {t("neuralNetworkNarrative.howItLearns.neuronCalc.s8Title")}
                            </p>
                            <div className="rounded-lg bg-black/20 p-4 mb-4">
                                <div className="flex items-center justify-center gap-2 flex-wrap font-mono text-sm">
                                    <span className="text-indigo-400 font-bold">{r.w1New.toFixed(1)}</span>
                                    <span className="text-white/30">×</span>
                                    <span className="text-sky-400">{X1}</span>
                                    <span className="text-white/30">+</span>
                                    <span className="text-indigo-400 font-bold">{r.w2New.toFixed(1)}</span>
                                    <span className="text-white/30">×</span>
                                    <span className="text-amber-400">{X2}</span>
                                    <span className="text-white/30">=</span>
                                    <span className="text-xl font-bold text-emerald-400">{r.outputNew.toFixed(1)}</span>
                                </div>
                                <p className="text-center text-xs font-mono text-white/30 mt-2">
                                    target = <span className="text-emerald-400">{TARGET}</span>
                                </p>
                            </div>
                            {/* Loss comparison */}
                            <div className="flex items-center gap-3">
                                <div className="flex-1 rounded-lg bg-rose-500/[0.06] border border-rose-500/15 p-3 text-center">
                                    <span className="text-[9px] text-white/30 block font-mono mb-1">{t("neuralNetworkNarrative.howItLearns.neuronCalc.before")}</span>
                                    <span className="text-lg font-mono font-bold text-rose-400">{r.loss}</span>
                                </div>
                                <span className="text-white/20 text-lg">→</span>
                                <div className="flex-1 rounded-lg bg-emerald-500/[0.06] border border-emerald-500/15 p-3 text-center">
                                    <span className="text-[9px] text-white/30 block font-mono mb-1">{t("neuralNetworkNarrative.howItLearns.neuronCalc.after")}</span>
                                    <span className="text-lg font-mono font-bold text-emerald-400">{r.lossNew.toFixed(1)}</span>
                                </div>
                            </div>
                            <p className="text-xs text-emerald-400 font-semibold text-center mt-3">
                                {t("neuralNetworkNarrative.howItLearns.neuronCalc.s8Better")}
                            </p>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => setStep(s => Math.max(0, s - 1))}
                    disabled={step <= 0}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/[0.04] border border-white/[0.08] text-white/50 hover:text-white/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                    ← {t("neuralNetworkNarrative.howItLearns.neuronCalc.prev")}
                </button>
                <button
                    onClick={() => setStep(s => Math.min(4, s + 1))}
                    disabled={step >= 4}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-${color}-500/15 border-${color}-500/30 text-${color}-400 hover:bg-${color}-500/25`}
                >
                    {t("neuralNetworkNarrative.howItLearns.neuronCalc.next")} →
                </button>
            </div>
        </div>
    );
}

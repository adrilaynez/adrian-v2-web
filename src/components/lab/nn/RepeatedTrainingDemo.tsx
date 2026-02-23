"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/context";

/*
  Shows many training steps on the running example.
  Starts with w₁=4, w₂=3. Target = 3. x₁=1, x₂=2.
  Each step: compute output → loss → gradients → update weights.
  User clicks "Train one step" or "Auto-train" and watches loss decrease.
*/

const X1 = 1, X2 = 2, TARGET = 3;
const LR = 0.02;

interface Snapshot {
    step: number;
    w1: number;
    w2: number;
    output: number;
    loss: number;
}

function trainStep(w1: number, w2: number): { w1: number; w2: number; output: number; loss: number } {
    const output = w1 * X1 + w2 * X2;
    const error = output - TARGET;
    const loss = error * error;
    const dLdw1 = 2 * error * X1;
    const dLdw2 = 2 * error * X2;
    return {
        w1: w1 - LR * dLdw1,
        w2: w2 - LR * dLdw2,
        output: (w1 - LR * dLdw1) * X1 + (w2 - LR * dLdw2) * X2,
        loss,
    };
}

export function RepeatedTrainingDemo() {
    const { t } = useI18n();
    const [history, setHistory] = useState<Snapshot[]>([
        { step: 0, w1: 4, w2: 3, output: 10, loss: 49 },
    ]);
    const [autoRunning, setAutoRunning] = useState(false);

    const latest = history[history.length - 1];
    const maxLoss = Math.max(...history.map(s => s.loss), 1);

    const doStep = useCallback(() => {
        setHistory(prev => {
            const last = prev[prev.length - 1];
            const next = trainStep(last.w1, last.w2);
            return [...prev, {
                step: last.step + 1,
                w1: next.w1,
                w2: next.w2,
                output: next.output,
                loss: next.loss,
            }];
        });
    }, []);

    const doAutoTrain = useCallback(() => {
        setAutoRunning(true);
        let count = 0;
        const interval = setInterval(() => {
            doStep();
            count++;
            if (count >= 30) {
                clearInterval(interval);
                setAutoRunning(false);
            }
        }, 120);
    }, [doStep]);

    const reset = useCallback(() => {
        setHistory([{ step: 0, w1: 4, w2: 3, output: 10, loss: 49 }]);
        setAutoRunning(false);
    }, []);

    // Loss bar chart (last 20 steps)
    const displayHistory = history.slice(-25);

    return (
        <div className="rounded-2xl border border-white/[0.07] bg-gradient-to-br from-white/[0.02] to-transparent p-6">
            <p className="text-xs font-mono uppercase tracking-widest text-white/30 mb-5">
                {t("neuralNetworkNarrative.howItLearns.repeated.title")}
            </p>

            {/* Current state */}
            <div className="rounded-xl bg-black/30 border border-white/[0.05] p-4 mb-5">
                <div className="grid grid-cols-4 gap-3 text-center">
                    <div>
                        <span className="text-[9px] text-white/30 block font-mono">Step</span>
                        <span className="text-lg font-mono font-bold text-white/60">{latest.step}</span>
                    </div>
                    <div>
                        <span className="text-[9px] text-white/30 block font-mono">Output</span>
                        <span className={`text-lg font-mono font-bold ${Math.abs(latest.output - TARGET) < 0.5 ? "text-emerald-400" : "text-white/60"}`}>
                            {latest.output.toFixed(1)}
                        </span>
                    </div>
                    <div>
                        <span className="text-[9px] text-white/30 block font-mono">Target</span>
                        <span className="text-lg font-mono font-bold text-emerald-400">{TARGET}</span>
                    </div>
                    <div>
                        <span className="text-[9px] text-white/30 block font-mono">Loss</span>
                        <span className={`text-lg font-mono font-bold ${latest.loss < 1 ? "text-emerald-400" : latest.loss < 10 ? "text-amber-400" : "text-rose-400"}`}>
                            {latest.loss.toFixed(1)}
                        </span>
                    </div>
                </div>
                <div className="flex items-center justify-center gap-4 mt-3 text-xs font-mono text-white/30">
                    <span>w₁ = <span className="text-rose-400">{latest.w1.toFixed(2)}</span></span>
                    <span>w₂ = <span className="text-rose-400">{latest.w2.toFixed(2)}</span></span>
                </div>
            </div>

            {/* Loss chart */}
            <div className="rounded-xl bg-black/20 border border-white/[0.05] p-3 mb-5 overflow-hidden">
                <p className="text-[9px] font-mono text-white/25 mb-2 uppercase tracking-widest">Loss over time</p>
                <div className="flex items-end gap-[2px] h-16">
                    {displayHistory.map((s, i) => {
                        const barHeight = Math.max(2, (s.loss / maxLoss) * 60);
                        const isLatest = i === displayHistory.length - 1;
                        return (
                            <motion.div
                                key={s.step}
                                initial={{ height: 0 }}
                                animate={{ height: barHeight }}
                                transition={{ duration: 0.15 }}
                                className={`flex-1 rounded-t-sm ${
                                    s.loss < 1 ? "bg-emerald-400/60" : s.loss < 10 ? "bg-amber-400/50" : "bg-rose-400/40"
                                } ${isLatest ? "ring-1 ring-white/20" : ""}`}
                                style={{ minWidth: 3 }}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 flex-wrap">
                <button
                    onClick={doStep}
                    disabled={autoRunning}
                    className="px-4 py-2 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                    {t("neuralNetworkNarrative.howItLearns.repeated.oneStep")}
                </button>
                <button
                    onClick={doAutoTrain}
                    disabled={autoRunning}
                    className="px-4 py-2 rounded-full text-xs font-semibold bg-sky-500/15 border border-sky-500/30 text-sky-400 hover:bg-sky-500/25 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                    {autoRunning ? t("neuralNetworkNarrative.howItLearns.repeated.training") : t("neuralNetworkNarrative.howItLearns.repeated.auto")}
                </button>
                <button
                    onClick={reset}
                    className="px-4 py-2 rounded-full text-xs font-semibold bg-white/[0.04] border border-white/[0.08] text-white/50 hover:text-white/80 transition-all"
                >
                    {t("neuralNetworkNarrative.howItLearns.repeated.reset")}
                </button>
            </div>

            {latest.loss < 0.5 && (
                <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-emerald-400 font-semibold text-center mt-4"
                >
                    {t("neuralNetworkNarrative.howItLearns.repeated.converged")}
                </motion.p>
            )}
        </div>
    );
}

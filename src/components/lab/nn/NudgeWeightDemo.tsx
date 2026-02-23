"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/context";
import { Slider } from "@/components/ui/slider";

/*
  Same setup as PredictionErrorDemo: w₁×1 + w₂×2.
  User can drag w₁ and w₂ sliders and see the output change.
  Key discovery: w₂ has TWICE the effect of w₁ because x₂=2.
  This is the intuitive foundation for "derivative = sensitivity".
*/

export function NudgeWeightDemo() {
    const { t } = useI18n();

    const x1 = 1, x2 = 2;
    const target = 3;
    const [w1, setW1] = useState(4);
    const [w2, setW2] = useState(3);

    const output = w1 * x1 + w2 * x2;
    const error = output - target;
    const absError = Math.abs(error);

    // Sensitivity: how much output changes per unit change in each weight
    const sensitivityW1 = x1; // always 1
    const sensitivityW2 = x2; // always 2

    const isClose = absError < 0.5;
    const isPerfect = absError < 0.05;

    return (
        <div className="rounded-2xl border border-white/[0.07] bg-gradient-to-br from-white/[0.02] to-transparent p-6">
            <p className="text-xs font-mono uppercase tracking-widest text-white/30 mb-5">
                {t("neuralNetworkNarrative.howItLearns.nudge.title")}
            </p>

            {/* Live formula */}
            <div className="rounded-xl bg-black/30 border border-white/[0.05] p-4 mb-5">
                <div className="flex items-center justify-center gap-2 flex-wrap font-mono text-sm">
                    <span className="text-rose-400 font-bold">{w1.toFixed(1)}</span>
                    <span className="text-white/30">×</span>
                    <span className="text-sky-400">{x1}</span>
                    <span className="text-white/30">+</span>
                    <span className="text-rose-400 font-bold">{w2.toFixed(1)}</span>
                    <span className="text-white/30">×</span>
                    <span className="text-amber-400">{x2}</span>
                    <span className="text-white/30">=</span>
                    <motion.span
                        key={output.toFixed(1)}
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        className={`text-xl font-bold ${isPerfect ? "text-emerald-400" : "text-white/80"}`}
                    >
                        {output.toFixed(1)}
                    </motion.span>
                    <span className="text-white/20 mx-2">|</span>
                    <span className="text-emerald-400/60 text-xs">target = {target}</span>
                </div>
            </div>

            {/* Weight sliders — the main interaction */}
            <div className="space-y-4 mb-6">
                {/* w₁ slider */}
                <div className="rounded-xl border border-rose-500/15 bg-rose-500/[0.03] p-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-mono font-bold text-rose-400">w₁</span>
                            <span className="text-[10px] font-mono text-white/30">(multiplied by x₁ = {x1})</span>
                        </div>
                        <span className="text-lg font-mono font-bold text-rose-400">{w1.toFixed(1)}</span>
                    </div>
                    <Slider min={-2} max={8} step={0.1} value={[w1]} onValueChange={([v]) => setW1(v)} />
                    <p className="text-[11px] text-white/30 mt-2">
                        {t("neuralNetworkNarrative.howItLearns.nudge.w1Sensitivity")}
                    </p>
                </div>

                {/* w₂ slider */}
                <div className="rounded-xl border border-rose-500/15 bg-rose-500/[0.03] p-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-mono font-bold text-rose-400">w₂</span>
                            <span className="text-[10px] font-mono text-white/30">(multiplied by x₂ = {x2})</span>
                        </div>
                        <span className="text-lg font-mono font-bold text-rose-400">{w2.toFixed(1)}</span>
                    </div>
                    <Slider min={-2} max={8} step={0.1} value={[w2]} onValueChange={([v]) => setW2(v)} />
                    <p className="text-[11px] text-white/30 mt-2">
                        {t("neuralNetworkNarrative.howItLearns.nudge.w2Sensitivity")}
                    </p>
                </div>
            </div>

            {/* Sensitivity comparison */}
            <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="rounded-lg bg-sky-500/[0.04] border border-sky-500/15 p-3 text-center">
                    <span className="text-[9px] font-mono text-sky-400/50 block">{t("neuralNetworkNarrative.howItLearns.nudge.effectOfW1")}</span>
                    <span className="text-lg font-mono font-bold text-sky-400">{sensitivityW1}</span>
                    <span className="text-[10px] text-white/30 block mt-1">{t("neuralNetworkNarrative.howItLearns.nudge.perUnit")}</span>
                </div>
                <div className="rounded-lg bg-amber-500/[0.04] border border-amber-500/15 p-3 text-center">
                    <span className="text-[9px] font-mono text-amber-400/50 block">{t("neuralNetworkNarrative.howItLearns.nudge.effectOfW2")}</span>
                    <span className="text-lg font-mono font-bold text-amber-400">{sensitivityW2}</span>
                    <span className="text-[10px] text-white/30 block mt-1">{t("neuralNetworkNarrative.howItLearns.nudge.perUnit")}</span>
                </div>
            </div>

            {/* Error readout */}
            <motion.div
                className={`rounded-xl p-4 border text-center transition-all ${
                    isPerfect
                        ? "bg-emerald-500/[0.08] border-emerald-500/30 shadow-[0_0_24px_-6px_rgba(52,211,153,0.3)]"
                        : isClose
                            ? "bg-amber-500/[0.06] border-amber-500/20"
                            : "bg-rose-500/[0.04] border-rose-500/20"
                }`}
            >
                <span className="text-[10px] text-white/30 block font-mono mb-1">{t("neuralNetworkNarrative.howItLearns.predictionError.error")}</span>
                <span className={`text-2xl font-mono font-bold ${isPerfect ? "text-emerald-400" : isClose ? "text-amber-400" : "text-rose-400"}`}>
                    {error > 0 ? "+" : ""}{error.toFixed(1)}
                </span>
                {isPerfect && <p className="text-xs text-emerald-400 mt-2 font-semibold">{t("neuralNetworkNarrative.howItLearns.nudge.perfect")}</p>}
                {!isPerfect && <p className="text-[11px] text-white/30 mt-2">{t("neuralNetworkNarrative.howItLearns.nudge.keepTrying")}</p>}
            </motion.div>
        </div>
    );
}

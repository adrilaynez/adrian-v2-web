"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/i18n/context";

/*
  The simplest possible opening hook:
  Model has w₁=4, w₂=3. Inputs are 1 and 2.
  Output = 4×1 + 3×2 = 10.  We wanted 3.
  No bias. No ReLU. Just multiplication + addition.
*/

export function PredictionErrorDemo() {
    const { t } = useI18n();

    const x1 = 1, x2 = 2;
    const w1 = 4, w2 = 3;
    const output = w1 * x1 + w2 * x2; // 10
    const target = 3;
    const error = output - target; // 7

    return (
        <div className="rounded-2xl border border-rose-500/[0.15] bg-gradient-to-br from-rose-500/[0.04] to-transparent p-6">
            <p className="text-xs font-mono uppercase tracking-widest text-rose-400/50 mb-5">
                {t("neuralNetworkNarrative.howItLearns.predictionError.title")}
            </p>

            {/* The computation, step by step — big and clear */}
            <div className="space-y-4 mb-6">
                {/* The formula */}
                <div className="rounded-xl bg-black/30 border border-white/[0.05] p-5">
                    <div className="flex items-center justify-center gap-2 flex-wrap text-center">
                        {/* w1 × x1 */}
                        <div className="flex items-center gap-1.5">
                            <div className="rounded-lg bg-rose-500/10 border border-rose-500/25 px-2.5 py-1.5">
                                <span className="text-[9px] text-rose-400/60 block font-mono">w₁</span>
                                <span className="text-lg font-mono font-bold text-rose-400">{w1}</span>
                            </div>
                            <span className="text-white/30 text-lg">×</span>
                            <div className="rounded-lg bg-sky-500/10 border border-sky-500/25 px-2.5 py-1.5">
                                <span className="text-[9px] text-sky-400/60 block font-mono">x₁</span>
                                <span className="text-lg font-mono font-bold text-sky-400">{x1}</span>
                            </div>
                        </div>

                        <span className="text-white/30 text-lg">+</span>

                        {/* w2 × x2 */}
                        <div className="flex items-center gap-1.5">
                            <div className="rounded-lg bg-rose-500/10 border border-rose-500/25 px-2.5 py-1.5">
                                <span className="text-[9px] text-rose-400/60 block font-mono">w₂</span>
                                <span className="text-lg font-mono font-bold text-rose-400">{w2}</span>
                            </div>
                            <span className="text-white/30 text-lg">×</span>
                            <div className="rounded-lg bg-amber-500/10 border border-amber-500/25 px-2.5 py-1.5">
                                <span className="text-[9px] text-amber-400/60 block font-mono">x₂</span>
                                <span className="text-lg font-mono font-bold text-amber-400">{x2}</span>
                            </div>
                        </div>

                        <span className="text-white/30 text-lg">=</span>

                        {/* Result */}
                        <div className="rounded-lg bg-white/[0.04] border border-white/[0.1] px-3 py-1.5">
                            <span className="text-[9px] text-white/40 block font-mono">output</span>
                            <span className="text-2xl font-mono font-bold text-white/90">{output}</span>
                        </div>
                    </div>

                    {/* Arithmetic breakdown */}
                    <p className="text-center text-xs font-mono text-white/30 mt-3">
                        {w1} × {x1} + {w2} × {x2} = {w1 * x1} + {w2 * x2} = {output}
                    </p>
                </div>
            </div>

            {/* Comparison: got vs wanted */}
            <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="rounded-xl bg-white/[0.02] border border-white/[0.08] p-4 text-center">
                    <span className="text-[10px] text-white/30 block font-mono uppercase tracking-widest mb-1">{t("neuralNetworkNarrative.howItLearns.predictionError.got")}</span>
                    <span className="text-3xl font-mono font-bold text-white/80">{output}</span>
                </div>
                <div className="rounded-xl bg-emerald-500/[0.04] border border-emerald-500/20 p-4 text-center">
                    <span className="text-[10px] text-emerald-400/60 block font-mono uppercase tracking-widest mb-1">{t("neuralNetworkNarrative.howItLearns.predictionError.expected")}</span>
                    <span className="text-3xl font-mono font-bold text-emerald-400">{target}</span>
                </div>
            </div>

            {/* Error highlight */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="rounded-xl bg-rose-500/[0.06] border border-rose-500/25 p-5 text-center"
            >
                <span className="text-[10px] text-rose-400/60 block font-mono uppercase tracking-widest mb-2">{t("neuralNetworkNarrative.howItLearns.predictionError.error")}</span>
                <div className="flex items-center justify-center gap-3">
                    <span className="text-sm font-mono text-white/40">{output} − {target} =</span>
                    <motion.span
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
                        className="text-4xl font-mono font-bold text-rose-400"
                    >
                        {error}
                    </motion.span>
                </div>
                <p className="text-xs text-white/30 mt-3">
                    {t("neuralNetworkNarrative.howItLearns.predictionError.offBy")}
                </p>
            </motion.div>
        </div>
    );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/context";
import { Slider } from "@/components/ui/slider";

/*
  Teaches derivatives from scratch using the simplest operations:
  1. Addition:      z = x + y  →  if x goes up by 1, z goes up by 1  (derivative = 1)
  2. Multiplication: z = x × y →  if x goes up by 1, z goes up by y  (derivative = y)
  No graphs, no curves. Just numbers and plain English.
*/

type Op = "add" | "multiply";

export function DerivativeIntuitionDemo() {
    const { t } = useI18n();
    const [op, setOp] = useState<Op>("add");
    const [x, setX] = useState(3);
    const [y, setY] = useState(4);

    const z = op === "add" ? x + y : x * y;

    // What happens if x increases by 1?
    const xNudged = x + 1;
    const zNudged = op === "add" ? xNudged + y : xNudged * y;
    const zChange = zNudged - z;

    // The derivative
    const derivative = op === "add" ? 1 : y;

    return (
        <div className="rounded-2xl border border-white/[0.07] bg-gradient-to-br from-white/[0.02] to-transparent p-6">
            <p className="text-xs font-mono uppercase tracking-widest text-white/30 mb-5">
                {t("neuralNetworkNarrative.howItLearns.derivative.title")}
            </p>

            {/* Operation toggle */}
            <div className="flex gap-2 mb-5">
                <button
                    onClick={() => setOp("add")}
                    className={`px-4 py-2 rounded-full text-xs font-mono font-semibold transition-all border ${op === "add"
                        ? "bg-sky-500/15 border-sky-500/30 text-sky-400"
                        : "bg-white/[0.03] border-white/[0.08] text-white/40 hover:text-white/60"
                        }`}
                >
                    z = x + y
                </button>
                <button
                    onClick={() => setOp("multiply")}
                    className={`px-4 py-2 rounded-full text-xs font-mono font-semibold transition-all border ${op === "multiply"
                        ? "bg-amber-500/15 border-amber-500/30 text-amber-400"
                        : "bg-white/[0.03] border-white/[0.08] text-white/40 hover:text-white/60"
                        }`}
                >
                    z = x × y
                </button>
            </div>

            {/* Current values */}
            <div className="rounded-xl bg-black/30 border border-white/[0.05] p-5 mb-5">
                <div className="flex items-center justify-center gap-3 flex-wrap font-mono">
                    <div className="rounded-lg bg-sky-500/10 border border-sky-500/25 px-3 py-2 text-center">
                        <span className="text-[9px] text-sky-400/60 block">x</span>
                        <span className="text-xl font-bold text-sky-400">{x}</span>
                    </div>
                    <span className="text-white/30 text-xl">{op === "add" ? "+" : "×"}</span>
                    <div className="rounded-lg bg-amber-500/10 border border-amber-500/25 px-3 py-2 text-center">
                        <span className="text-[9px] text-amber-400/60 block">y</span>
                        <span className="text-xl font-bold text-amber-400">{y}</span>
                    </div>
                    <span className="text-white/30 text-xl">=</span>
                    <div className="rounded-lg bg-white/[0.04] border border-white/[0.1] px-3 py-2 text-center">
                        <span className="text-[9px] text-white/40 block">z</span>
                        <span className="text-xl font-bold text-white/80">{z}</span>
                    </div>
                </div>
            </div>

            {/* Sliders */}
            <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="rounded-lg border border-sky-500/15 bg-sky-500/[0.03] px-3 py-2 space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-sky-400">x</span>
                        <span className="text-sm font-mono font-bold text-sky-400">{x}</span>
                    </div>
                    <Slider min={0} max={10} step={1} value={[x]} onValueChange={([v]) => setX(v)} />
                </div>
                <div className="rounded-lg border border-amber-500/15 bg-amber-500/[0.03] px-3 py-2 space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-amber-400">y</span>
                        <span className="text-sm font-mono font-bold text-amber-400">{y}</span>
                    </div>
                    <Slider min={0} max={10} step={1} value={[y]} onValueChange={([v]) => setY(v)} />
                </div>
            </div>

            {/* The key question: what happens if x goes up by 1? */}
            <div className="rounded-xl bg-violet-500/[0.04] border border-violet-500/20 p-5 mb-4">
                <p className="text-xs text-violet-400/80 font-semibold mb-3">
                    {t("neuralNetworkNarrative.howItLearns.derivative.question")}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="rounded-lg bg-black/20 p-3 text-center">
                        <span className="text-[9px] text-white/30 block font-mono mb-1">{t("neuralNetworkNarrative.howItLearns.derivative.before")}</span>
                        <span className="text-xs font-mono text-white/40">
                            {x} {op === "add" ? "+" : "×"} {y} =
                        </span>
                        <span className="text-lg font-mono font-bold text-white/60 ml-1">{z}</span>
                    </div>
                    <div className="rounded-lg bg-black/20 p-3 text-center">
                        <span className="text-[9px] text-white/30 block font-mono mb-1">{t("neuralNetworkNarrative.howItLearns.derivative.after")}</span>
                        <span className="text-xs font-mono text-white/40">
                            <span className="text-sky-400">{xNudged}</span> {op === "add" ? "+" : "×"} {y} =
                        </span>
                        <span className="text-lg font-mono font-bold text-white/60 ml-1">{zNudged}</span>
                    </div>
                </div>

                <div className="text-center">
                    <span className="text-xs text-white/30">{t("neuralNetworkNarrative.howItLearns.derivative.zChanged")}</span>
                    <motion.span
                        key={`${op}-${x}-${y}`}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        className={`text-2xl font-mono font-bold ml-2 ${op === "add" ? "text-sky-400" : "text-amber-400"}`}
                    >
                        +{zChange}
                    </motion.span>
                </div>
            </div>

            {/* The derivative — named and explained */}
            <div className={`rounded-xl p-4 border text-center ${op === "add" ? "bg-sky-500/[0.04] border-sky-500/15" : "bg-amber-500/[0.04] border-amber-500/15"}`}>
                <span className="text-[10px] text-white/30 block font-mono mb-1">{t("neuralNetworkNarrative.howItLearns.derivative.thisIs")}</span>
                <div className="flex items-center justify-center gap-2">
                    <span className="text-sm font-mono text-white/50">∂z/∂x =</span>
                    <span className={`text-2xl font-mono font-bold ${op === "add" ? "text-sky-400" : "text-amber-400"}`}>
                        {derivative}
                    </span>
                </div>
                <p className="text-xs text-white/40 mt-2">
                    {op === "add"
                        ? t("neuralNetworkNarrative.howItLearns.derivative.addExplain")
                        : t("neuralNetworkNarrative.howItLearns.derivative.mulExplain").replace("{y}", String(y))
                    }
                </p>
            </div>
        </div>
    );
}

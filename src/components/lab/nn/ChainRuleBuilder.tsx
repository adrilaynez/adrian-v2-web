"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/context";
import { Slider } from "@/components/ui/slider";

/*
  Interactive chained-operations pipeline:
  x → [×w] → a → [+b] → result

  User changes x with a slider and sees how the change propagates.
  Step 1: x changes by +1
  Step 2: after ×w, the change becomes +w (because ×w multiplies by w)
  Step 3: after +b, the change stays +w (because +b just adds a constant)
  Total effect of x on result = w. Chain rule = multiply the local derivatives.
*/

export function ChainRuleBuilder() {
    const { t } = useI18n();
    const [x, setX] = useState(2);
    const w = 3;
    const b = 1;

    const a = x * w;       // after multiplication
    const result = a + b;   // after addition

    // If x goes up by 1
    const xNext = x + 1;
    const aNext = xNext * w;
    const resultNext = aNext + b;

    const deltaX = 1;
    const deltaA = aNext - a;     // = w = 3
    const deltaResult = resultNext - result; // = w = 3

    // Local derivatives
    const dAdX = w;        // ∂a/∂x = w
    const dResultDa = 1;   // ∂result/∂a = 1
    const dResultDx = dAdX * dResultDa; // chain rule: w × 1 = w

    return (
        <div className="rounded-2xl border border-white/[0.07] bg-gradient-to-br from-white/[0.02] to-transparent p-6">
            <p className="text-xs font-mono uppercase tracking-widest text-white/30 mb-5">
                {t("neuralNetworkNarrative.howItLearns.chainRule.title")}
            </p>

            {/* Pipeline visualization */}
            <div className="rounded-xl bg-black/30 border border-white/[0.05] p-5 mb-5">
                <div className="flex items-center justify-center gap-2 flex-wrap">
                    {/* x */}
                    <div className="rounded-lg bg-sky-500/10 border border-sky-500/25 px-3 py-2 text-center min-w-[52px]">
                        <span className="text-[9px] text-sky-400/60 block font-mono">x</span>
                        <span className="text-xl font-mono font-bold text-sky-400">{x}</span>
                    </div>

                    <span className="text-white/20 text-sm">→</span>

                    {/* ×w operation */}
                    <div className="rounded-lg bg-violet-500/10 border border-violet-500/25 px-3 py-2 text-center">
                        <span className="text-[9px] text-violet-400/60 block font-mono">× w</span>
                        <span className="text-sm font-mono font-bold text-violet-400">× {w}</span>
                    </div>

                    <span className="text-white/20 text-sm">→</span>

                    {/* a (intermediate) */}
                    <div className="rounded-lg bg-amber-500/10 border border-amber-500/25 px-3 py-2 text-center min-w-[52px]">
                        <span className="text-[9px] text-amber-400/60 block font-mono">a</span>
                        <span className="text-xl font-mono font-bold text-amber-400">{a}</span>
                    </div>

                    <span className="text-white/20 text-sm">→</span>

                    {/* +b operation */}
                    <div className="rounded-lg bg-violet-500/10 border border-violet-500/25 px-3 py-2 text-center">
                        <span className="text-[9px] text-violet-400/60 block font-mono">+ b</span>
                        <span className="text-sm font-mono font-bold text-violet-400">+ {b}</span>
                    </div>

                    <span className="text-white/20 text-sm">→</span>

                    {/* result */}
                    <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/25 px-3 py-2 text-center min-w-[52px]">
                        <span className="text-[9px] text-emerald-400/60 block font-mono">result</span>
                        <span className="text-xl font-mono font-bold text-emerald-400">{result}</span>
                    </div>
                </div>
            </div>

            {/* x slider */}
            <div className="rounded-lg border border-sky-500/15 bg-sky-500/[0.03] px-4 py-3 mb-5">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-sky-400">x</span>
                    <span className="text-sm font-mono font-bold text-sky-400">{x}</span>
                </div>
                <Slider min={0} max={8} step={1} value={[x]} onValueChange={([v]) => setX(v)} />
            </div>

            {/* The propagation: what happens if x goes up by 1? */}
            <div className="rounded-xl bg-violet-500/[0.04] border border-violet-500/20 p-5 mb-5">
                <p className="text-xs text-violet-400/80 font-semibold mb-4">
                    {t("neuralNetworkNarrative.howItLearns.chainRule.ifXChanges")}
                </p>

                <div className="space-y-3">
                    {/* Step 1: x changes */}
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-[10px] font-bold text-sky-400">1</div>
                        <span className="text-xs text-white/50 flex-1">
                            x: {x} → <span className="text-sky-400 font-bold">{xNext}</span>
                        </span>
                        <span className="text-xs font-mono text-sky-400">+{deltaX}</span>
                    </div>

                    {/* Step 2: after ×w */}
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-[10px] font-bold text-amber-400">2</div>
                        <span className="text-xs text-white/50 flex-1">
                            a = x × {w}: {a} → <span className="text-amber-400 font-bold">{aNext}</span>
                        </span>
                        <span className="text-xs font-mono text-amber-400">+{deltaA}</span>
                    </div>

                    {/* Step 3: after +b */}
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-[10px] font-bold text-emerald-400">3</div>
                        <span className="text-xs text-white/50 flex-1">
                            result = a + {b}: {result} → <span className="text-emerald-400 font-bold">{resultNext}</span>
                        </span>
                        <span className="text-xs font-mono text-emerald-400">+{deltaResult}</span>
                    </div>
                </div>
            </div>

            {/* The chain rule explanation */}
            <div className="rounded-xl bg-emerald-500/[0.04] border border-emerald-500/15 p-5 text-center">
                <p className="text-xs text-white/40 mb-2">{t("neuralNetworkNarrative.howItLearns.chainRule.totalEffect")}</p>

                <div className="flex items-center justify-center gap-2 flex-wrap font-mono text-sm mb-3">
                    <span className="text-violet-400">{dAdX}</span>
                    <span className="text-white/30">×</span>
                    <span className="text-violet-400">{dResultDa}</span>
                    <span className="text-white/30">=</span>
                    <span className="text-2xl font-bold text-emerald-400">{dResultDx}</span>
                </div>

                <p className="text-xs text-white/40">
                    {t("neuralNetworkNarrative.howItLearns.chainRule.explanation").replace("{w}", String(w))}
                </p>
            </div>
        </div>
    );
}

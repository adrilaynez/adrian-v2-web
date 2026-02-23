"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/context";
import { Slider } from "@/components/ui/slider";

export function WeightSliderDemo() {
    const { t } = useI18n();
    const x1 = 0.8;
    const x2 = 0.6;
    const [w1, setW1] = useState(1.0);
    const [w2, setW2] = useState(1.0);

    const wx1 = +(w1 * x1).toFixed(2);
    const wx2 = +(w2 * x2).toFixed(2);
    const total = +(wx1 + wx2).toFixed(2);

    const maxBar = 3;

    function GradientBar({ value, color1, color2 }: { value: number; color1: string; color2: string }) {
        const pct = Math.min(Math.abs(value) / maxBar, 1) * 100;
        const isNeg = value < 0;
        return (
            <div className="relative h-4 w-full rounded-full bg-white/[0.04] overflow-hidden">
                <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ background: isNeg ? color2 : `linear-gradient(90deg, ${color1}, ${color2})` }}
                    animate={{ width: `${pct}%` }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] p-6">
            <p className="text-xs font-mono uppercase tracking-widest text-white/40 mb-5">
                {t("neuralNetworkNarrative.discovery.weights.title")}
            </p>

            {/* Row 1: x₁ */}
            <div className="mb-6 rounded-xl border border-white/[0.08] bg-black/20 p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white/60">{t("neuralNetworkNarrative.discovery.weights.inputLabel1")}</span>
                    <span className="text-xs font-mono text-sky-200/80 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded-md">{x1}</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] text-white/40 w-10 shrink-0 font-mono font-bold">{t("neuralNetworkNarrative.discovery.weights.weightLabel")}</span>
                    <Slider
                        min={-3}
                        max={3}
                        step={0.1}
                        value={[w1]}
                        onValueChange={([v]) => setW1(v)}
                        className="flex-1"
                    />
                    <span className="text-sm font-mono font-bold text-white/70 w-12 text-right">{w1.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-white/40 w-28 shrink-0">
                        w₁ × x₁ = <motion.span layout className="text-white/70 font-bold">{wx1}</motion.span>
                    </span>
                    <GradientBar value={wx1} color1="rgba(56,189,248,0.25)" color2="rgba(56,189,248,0.65)" />
                </div>
            </div>

            {/* Row 2: x₂ */}
            <div className="mb-6 rounded-xl border border-white/[0.08] bg-black/20 p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white/60">{t("neuralNetworkNarrative.discovery.weights.inputLabel2")}</span>
                    <span className="text-xs font-mono text-amber-200/80 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">{x2}</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] text-white/40 w-10 shrink-0 font-mono font-bold">{t("neuralNetworkNarrative.discovery.weights.weightLabel")}</span>
                    <Slider
                        min={-3}
                        max={3}
                        step={0.1}
                        value={[w2]}
                        onValueChange={([v]) => setW2(v)}
                        className="flex-1"
                    />
                    <span className="text-sm font-mono font-bold text-white/70 w-12 text-right">{w2.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-white/40 w-28 shrink-0">
                        w₂ × x₂ = <motion.span layout className="text-white/70 font-bold">{wx2}</motion.span>
                    </span>
                    <GradientBar value={wx2} color1="rgba(251,191,36,0.25)" color2="rgba(251,191,36,0.65)" />
                </div>
            </div>

            {/* Sum */}
            <div className="rounded-xl p-4 flex items-center justify-between border border-white/[0.08] bg-black/20">
                <span className="text-xs font-mono text-white/40">{t("neuralNetworkNarrative.discovery.weights.sumLabel")}</span>
                <div className="text-right">
                    <span className="text-[10px] font-mono text-white/30 block">w₁·x₁ + w₂·x₂</span>
                    <motion.span
                        layout
                        className="text-xl font-mono font-bold text-emerald-300/80"
                    >
                        {total}
                    </motion.span>
                </div>
            </div>

            <p className="mt-3 text-[11px] text-white/25 italic">
                {t("neuralNetworkNarrative.discovery.weights.hint")}
            </p>
        </div>
    );
}

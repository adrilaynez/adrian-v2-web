"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/context";
import { Slider } from "@/components/ui/slider";

export function BiasDemo() {
    const { t } = useI18n();
    const x1 = 0.8;
    const x2 = 0.6;
    const [w1, setW1] = useState(1.0);
    const [w2, setW2] = useState(1.0);
    const [bias, setBias] = useState(0.0);

    const wx1 = +(w1 * x1).toFixed(2);
    const wx2 = +(w2 * x2).toFixed(2);
    const z = +(wx1 + wx2 + bias).toFixed(2);

    const status =
        z > 0.5
            ? { label: t("neuralNetworkNarrative.discovery.bias.active"), color: "text-emerald-400", glow: "shadow-[0_0_24px_-6px_rgba(52,211,153,0.35)]", border: "border-emerald-500/30", bg: "bg-emerald-500/[0.06]", ring: "ring-emerald-500/20" }
            : z > 0
                ? { label: t("neuralNetworkNarrative.discovery.bias.barelyActive"), color: "text-amber-400", glow: "shadow-[0_0_24px_-6px_rgba(251,191,36,0.3)]", border: "border-amber-500/30", bg: "bg-amber-500/[0.06]", ring: "ring-amber-500/20" }
                : { label: t("neuralNetworkNarrative.discovery.bias.inactive"), color: "text-red-400/70", glow: "", border: "border-red-500/20", bg: "bg-red-500/[0.04]", ring: "ring-red-500/10" };

    // Visual threshold meter: maps z from -2 to 3 onto 0..100%
    const meterPct = Math.max(0, Math.min(100, ((z + 2) / 5) * 100));

    return (
        <div className="rounded-2xl border border-amber-500/[0.12] bg-gradient-to-br from-amber-500/[0.03] via-transparent to-rose-500/[0.02] shadow-[inset_0_1px_0_0_rgba(251,191,36,0.06)] p-6">
            <p className="text-xs font-mono uppercase tracking-widest text-amber-400/50 mb-5">
                {t("neuralNetworkNarrative.discovery.bias.title")}
            </p>

            {/* Compact input summary */}
            <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="rounded-lg border border-sky-500/15 bg-sky-500/[0.03] px-3 py-2">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono text-sky-400/70">x₁ = {x1}</span>
                        <span className="text-xs font-mono font-bold text-rose-400">w₁</span>
                    </div>
                    <Slider min={-3} max={3} step={0.1} value={[w1]} onValueChange={([v]) => setW1(v)} />
                    <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[10px] font-mono text-white/30">{w1.toFixed(1)}</span>
                        <span className="text-[10px] font-mono text-sky-400">= {wx1}</span>
                    </div>
                </div>
                <div className="rounded-lg border border-amber-500/15 bg-amber-500/[0.03] px-3 py-2">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono text-amber-400/70">x₂ = {x2}</span>
                        <span className="text-xs font-mono font-bold text-rose-400">w₂</span>
                    </div>
                    <Slider min={-3} max={3} step={0.1} value={[w2]} onValueChange={([v]) => setW2(v)} />
                    <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[10px] font-mono text-white/30">{w2.toFixed(1)}</span>
                        <span className="text-[10px] font-mono text-amber-400">= {wx2}</span>
                    </div>
                </div>
            </div>

            {/* Bias slider — hero element */}
            <div className="mb-5 rounded-xl border border-indigo-500/20 bg-indigo-500/[0.04] p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-indigo-400">{t("neuralNetworkNarrative.discovery.bias.biasLabel")}</span>
                    <span className="text-lg font-mono font-bold text-indigo-400">{bias.toFixed(1)}</span>
                </div>
                <Slider
                    min={-2}
                    max={2}
                    step={0.1}
                    value={[bias]}
                    onValueChange={([v]) => setBias(v)}
                />
                <p className="text-[10px] text-indigo-300/40 font-mono">
                    {bias > 0 ? "↑ Positive bias pushes output up" : bias < 0 ? "↓ Negative bias pulls output down" : "— Neutral: no shift"}
                </p>
            </div>

            {/* Threshold meter */}
            <div className="mb-4 rounded-xl bg-white/[0.02] border border-white/[0.06] p-3">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Activation meter</span>
                    <span className={`text-[10px] font-semibold ${status.color}`}>{status.label}</span>
                </div>
                <div className="relative h-5 w-full rounded-full bg-white/[0.04] overflow-hidden">
                    {/* Threshold marker at z=0.5 → (0.5+2)/5 = 50% */}
                    <div className="absolute top-0 bottom-0 w-px bg-white/20" style={{ left: "50%" }} />
                    <motion.div
                        className="absolute inset-y-0 left-0 rounded-full"
                        style={{
                            background: z > 0.5
                                ? "linear-gradient(90deg, rgba(52,211,153,0.2), rgba(52,211,153,0.6))"
                                : z > 0
                                    ? "linear-gradient(90deg, rgba(251,191,36,0.2), rgba(251,191,36,0.5))"
                                    : "linear-gradient(90deg, rgba(248,113,113,0.2), rgba(248,113,113,0.4))"
                        }}
                        animate={{ width: `${meterPct}%` }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                    {/* Indicator dot */}
                    <motion.div
                        className={`absolute top-0.5 w-4 h-4 rounded-full border-2 ${z > 0.5 ? "bg-emerald-400 border-emerald-300" : z > 0 ? "bg-amber-400 border-amber-300" : "bg-red-400 border-red-300"}`}
                        animate={{ left: `calc(${meterPct}% - 8px)` }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                </div>
                <div className="flex justify-between mt-1">
                    <span className="text-[9px] font-mono text-white/20">−2</span>
                    <span className="text-[9px] font-mono text-white/20">0</span>
                    <span className="text-[9px] font-mono text-white/20">+3</span>
                </div>
            </div>

            {/* Output */}
            <div className={`rounded-xl p-4 border transition-all ${status.border} ${status.bg} ${status.glow}`}>
                <div className="text-sm font-mono text-white/50 text-center">
                    <span className="text-sky-400/60">{wx1}</span>
                    <span className="text-white/20"> + </span>
                    <span className="text-amber-400/60">{wx2}</span>
                    <span className="text-white/20"> + </span>
                    <span className="text-indigo-400/60">{bias.toFixed(1)}</span>
                    <span className="text-white/20"> = </span>
                    <motion.span
                        layout
                        className={`text-xl font-bold ${status.color}`}
                    >
                        {z}
                    </motion.span>
                </div>
            </div>

            <p className="mt-3 text-[11px] text-white/25 italic">
                {t("neuralNetworkNarrative.discovery.bias.hint")}
            </p>
        </div>
    );
}

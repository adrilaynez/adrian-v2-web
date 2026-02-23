"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/context";
import { Slider } from "@/components/ui/slider";

const CHARS = "abcdefghijklmnopqrstuvwxyz ".split("");

const LOGITS: Record<string, number> = {
    e: 2.1, " ": 1.4, a: 0.8, i: 0.5, o: 0.4, n: 0.3, s: 0.2, t: 0.1,
    r: 0.0, l: -0.1, h: -0.2, d: -0.3, c: -0.4, u: -0.5, m: -0.5,
    p: -0.6, f: -0.6, g: -0.7, b: -0.7, w: -0.8, y: -0.8, v: -0.9,
    k: -0.9, j: -1.0, x: -1.0, q: -1.0, z: -1.0,
};

function softmax(logits: Record<string, number>, temp: number): Record<string, number> {
    const scaled = Object.fromEntries(
        Object.entries(logits).map(([k, v]) => [k, v / temp])
    );
    const maxVal = Math.max(...Object.values(scaled));
    const exps = Object.fromEntries(
        Object.entries(scaled).map(([k, v]) => [k, Math.exp(v - maxVal)])
    );
    const sum = Object.values(exps).reduce((a, b) => a + b, 0);
    return Object.fromEntries(
        Object.entries(exps).map(([k, v]) => [k, v / sum])
    );
}

const sorted = [...CHARS].sort((a, b) => (LOGITS[b] ?? 0) - (LOGITS[a] ?? 0));

export function SoftmaxTransformDemo() {
    const { t } = useI18n();
    const [showSoftmax, setShowSoftmax] = useState(false);
    const [temp, setTemp] = useState(1.0);

    const probs = useMemo(() => softmax(LOGITS, temp), [temp]);
    const top3 = sorted.slice(0, 3);

    const MAX_LOGIT = 2.1;
    const MIN_LOGIT = -1.0;
    const RANGE = MAX_LOGIT - MIN_LOGIT;

    return (
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.015] p-6">
            <p className="text-xs font-mono uppercase tracking-widest text-white/30 mb-4">
                {t("neuralNetworkNarrative.fromNumbers.softmax.title")}
            </p>

            {/* Toggle + Temperature */}
            <div className="flex flex-wrap items-center gap-4 mb-5">
                <button
                    onClick={() => setShowSoftmax(false)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                        !showSoftmax
                            ? "bg-white/[0.06] border-white/[0.12] text-white/60"
                            : "bg-white/[0.02] border-white/[0.06] text-white/30 hover:text-white/50"
                    }`}
                >
                    {t("neuralNetworkNarrative.fromNumbers.softmax.rawBtn")}
                </button>
                <button
                    onClick={() => setShowSoftmax(true)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                        showSoftmax
                            ? "bg-rose-500/20 border-rose-500/30 text-rose-400"
                            : "bg-white/[0.02] border-white/[0.06] text-white/30 hover:text-white/50"
                    }`}
                >
                    {t("neuralNetworkNarrative.fromNumbers.softmax.softmaxBtn")}
                </button>

                {showSoftmax && (
                    <div className="flex items-center gap-2 ml-auto">
                        <span className="text-[10px] text-white/30">T =</span>
                        <Slider
                            min={0.1}
                            max={3.0}
                            step={0.1}
                            value={[temp]}
                            onValueChange={([v]) => setTemp(v)}
                            className="w-24"
                        />
                        <span className="text-xs font-mono text-white/50 w-8">{temp.toFixed(1)}</span>
                    </div>
                )}
            </div>

            {/* Bars */}
            <div className="space-y-[3px] mb-4">
                {sorted.map((ch) => {
                    const logit = LOGITS[ch] ?? 0;
                    const prob = probs[ch] ?? 0;
                    const isTop = top3.includes(ch);

                    const pct = showSoftmax
                        ? prob * 100 * 3 // scale for visibility (max ~40% → 120% capped)
                        : ((logit - MIN_LOGIT) / RANGE) * 100;

                    return (
                        <div key={ch} className="flex items-center gap-2 h-5">
                            <span className={`w-4 text-right font-mono text-[10px] ${isTop ? "text-rose-400 font-bold" : "text-white/30"}`}>
                                {ch === " " ? "␣" : ch}
                            </span>
                            <div className="flex-1 h-3 rounded-full bg-white/[0.03] overflow-hidden">
                                <motion.div
                                    animate={{ width: `${Math.max(1, Math.min(100, pct))}%` }}
                                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                                    className={`h-full rounded-full ${isTop ? "bg-rose-500/60" : "bg-rose-500/20"}`}
                                />
                            </div>
                            {isTop && (
                                <span className="text-[10px] font-mono text-rose-400/70 w-12 text-right">
                                    {showSoftmax ? `${(prob * 100).toFixed(0)}%` : logit.toFixed(1)}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Sum indicator */}
            {showSoftmax && (
                <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] px-3 py-2 mb-3">
                    <span className="text-xs text-white/40">
                        {t("neuralNetworkNarrative.fromNumbers.softmax.sumLabel")}: {" "}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                        {Object.values(probs).reduce((a, b) => a + b, 0).toFixed(4)}
                    </span>
                    <span className="text-xs text-white/30 ml-2">
                        ({top3.map((ch) => `${ch === " " ? "␣" : ch}: ${(probs[ch] * 100).toFixed(0)}%`).join(", ")})
                    </span>
                </div>
            )}

            <p className="text-[11px] text-white/25 italic">
                {showSoftmax
                    ? t("neuralNetworkNarrative.fromNumbers.softmax.softmaxHint")
                    : t("neuralNetworkNarrative.fromNumbers.softmax.rawHint")}
            </p>
        </div>
    );
}

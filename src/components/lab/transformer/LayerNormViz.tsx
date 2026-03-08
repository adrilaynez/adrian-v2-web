"use client";

import { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

/*
  V41 — LayerNormViz
  Before: 6 bars with wildly different heights (some dominate, others vanish).
  After LayerNorm: all bars on the same scale.
  Teaches: normalization levels the playing field for fair comparisons.
  All text ≥ 13px. Cyan/amber only. Clean underline toggle.
*/

const TOKENS = ["The", "cat", "sat", "on", "the", "mat"];

/* Raw values — wildly different magnitudes */
const RAW_VALUES = [120, 18, 85, 340, 5, 210];

/* LayerNorm: mean-center then scale to unit variance */
function layerNorm(values: number[]): number[] {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;
    const std = Math.sqrt(variance + 1e-5);
    return values.map(v => ((v - mean) / std + 2) * 50);
}

const NORM_VALUES = layerNorm(RAW_VALUES);
const MAX_RAW = Math.max(...RAW_VALUES);
const MAX_NORM = Math.max(...NORM_VALUES);

export function LayerNormViz() {
    const [normalized, setNormalized] = useState(false);

    const values = normalized ? NORM_VALUES : RAW_VALUES;
    const maxV = normalized ? MAX_NORM : MAX_RAW;
    const accent = normalized ? "#fbbf24" : "#22d3ee";

    return (
        <div className="py-6 sm:py-8 px-3 sm:px-6" style={{ minHeight: 210 }}>
            {/* Toggle */}
            <div className="flex items-center justify-center gap-2 mb-6">
                <button
                    onClick={() => setNormalized(false)}
                    className="px-4 py-1.5 text-[14px] font-semibold transition-all cursor-pointer"
                    style={{
                        borderBottom: !normalized ? "2px solid #22d3ee" : "2px solid transparent",
                        color: !normalized ? "#22d3ee" : "rgba(255,255,255,0.25)",
                        background: "transparent",
                    }}
                >
                    Before
                </button>
                <button
                    onClick={() => setNormalized(true)}
                    className="px-4 py-1.5 text-[14px] font-semibold transition-all cursor-pointer"
                    style={{
                        borderBottom: normalized ? "2px solid #fbbf24" : "2px solid transparent",
                        color: normalized ? "#fbbf24" : "rgba(255,255,255,0.25)",
                        background: "transparent",
                    }}
                >
                    After LayerNorm
                </button>
            </div>

            {/* Bars */}
            <div className="flex items-end justify-center gap-3 sm:gap-5" style={{ height: 160 }}>
                {TOKENS.map((token, i) => {
                    const barH = Math.max(4, (values[i] / maxV) * 130);
                    return (
                        <div key={i} className="flex flex-col items-center gap-2" style={{ minWidth: 44 }}>
                            <div className="flex items-end" style={{ height: 130 }}>
                                <motion.div
                                    className="rounded-t-md"
                                    style={{
                                        width: 32,
                                        background: `linear-gradient(180deg, ${accent}, ${accent}50)`,
                                    }}
                                    animate={{ height: barH }}
                                    transition={{ type: "spring", stiffness: 120, damping: 14 }}
                                />
                            </div>
                            <span
                                className="text-[14px] font-semibold"
                                style={{ color: accent, opacity: 0.7 }}
                            >
                                {token}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Caption */}
            <AnimatePresence mode="wait">
                <motion.p
                    key={normalized ? "norm" : "raw"}
                    className="text-center text-[13px] mt-4 max-w-md mx-auto leading-relaxed"
                    style={{ color: `${accent}70` }}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {normalized
                        ? "Stabilized \u2014 every token\u2019s values are on the same scale. Fair comparisons."
                        : "Wildly different scales \u2014 some values dominate, others vanish. Unfair comparisons."}
                </motion.p>
            </AnimatePresence>
        </div>
    );
}

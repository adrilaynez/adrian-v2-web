"use client";

import { useState } from "react";

import { motion } from "framer-motion";

/*
  V31 — HeadBudgetViz
  Total dim: 512. Slider: number of heads (1,2,4,8,16,32).
  Per-head dim auto-calculates. Sweet spot annotation at 8.
*/

const TOTAL_DIM = 512;
const HEAD_OPTIONS = [1, 2, 4, 8, 16, 32, 64];

function getVerdict(heads: number): { text: string; color: string } {
    if (heads === 1) return { text: "One head — sees one thing well, misses everything else", color: "#fbbf24" };
    if (heads === 2) return { text: "Two perspectives — better, but still limited", color: "#fbbf24" };
    if (heads === 4) return { text: "Four heads — starting to capture multiple patterns", color: "rgba(34,211,238,0.7)" };
    if (heads === 8) return { text: "Sweet spot — rich perspectives, each head still has room to learn", color: "#22d3ee" };
    if (heads === 16) return { text: "Many perspectives — each head is narrower but still useful", color: "rgba(34,211,238,0.7)" };
    if (heads === 32) return { text: "Very fine-grained — some heads might be redundant", color: "#fbbf24" };
    return { text: "Extreme — each head can barely represent anything (8 dims each)", color: "#fbbf24" };
}

export function HeadBudgetViz() {
    const [headIdx, setHeadIdx] = useState(3); // default = 8 heads
    const heads = HEAD_OPTIONS[headIdx];
    const perHead = TOTAL_DIM / heads;
    const verdict = getVerdict(heads);
    const isSweetSpot = heads === 8;

    return (
        <div className="py-6 sm:py-8 px-3 sm:px-4 space-y-5" style={{ minHeight: 220 }}>
            {/* Slider */}
            <div className="max-w-sm mx-auto space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40">Number of heads</span>
                    <motion.span
                        className="text-xl sm:text-2xl font-mono font-bold"
                        style={{ color: isSweetSpot ? "#22d3ee" : "rgba(255,255,255,0.6)" }}
                        key={heads}
                    >
                        {heads}
                    </motion.span>
                </div>
                <input
                    type="range"
                    min={0} max={HEAD_OPTIONS.length - 1} step={1}
                    value={headIdx}
                    onChange={e => setHeadIdx(Number(e.target.value))}
                    className="w-full accent-cyan-400"
                />
                <div className="flex justify-between text-[9px] text-white/25">
                    <span>1 head</span>
                    <span>64 heads</span>
                </div>
            </div>

            {/* Visual: head blocks */}
            <div className="max-w-lg mx-auto">
                <div className="flex gap-0.5 flex-wrap justify-center">
                    {Array.from({ length: Math.min(heads, 32) }).map((_, i) => {
                        const t = i / Math.max(1, Math.min(heads, 32) - 1);
                        /* Interpolate cyan → amber across the heads */
                        const r = Math.round(34 + t * (251 - 34));
                        const g = Math.round(211 + t * (191 - 211));
                        const b = Math.round(238 + t * (36 - 238));
                        return (
                            <motion.div
                                key={i}
                                className="rounded-sm"
                                style={{
                                    width: Math.max(8, Math.min(40, 320 / heads)),
                                    height: Math.max(24, Math.min(48, perHead / 4)),
                                    background: `rgba(${r},${g},${b},0.25)`,
                                    borderLeft: `2px solid rgba(${r},${g},${b},0.4)`,
                                }}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: i * 0.01, type: "spring", stiffness: 200 }}
                            />
                        );
                    })}
                    {heads > 32 && (
                        <span className="text-white/25 text-[10px] self-center ml-1">+{heads - 32} more</span>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-6 text-center">
                <div>
                    <p className="text-lg sm:text-xl font-mono font-bold text-white/65">{heads}</p>
                    <p className="text-[9px] text-white/30">heads</p>
                </div>
                <div className="text-white/15 self-center">×</div>
                <div>
                    <p className="text-lg sm:text-xl font-mono font-bold text-white/65">{perHead}</p>
                    <p className="text-[9px] text-white/30">dims per head</p>
                </div>
                <div className="text-white/15 self-center">=</div>
                <div>
                    <p className="text-lg sm:text-xl font-mono font-bold text-cyan-400/80">{TOTAL_DIM}</p>
                    <p className="text-[9px] text-white/30">total dims</p>
                </div>
            </div>

            {/* Verdict */}
            <motion.div
                className="max-w-sm mx-auto px-4 py-2.5 text-center"
                style={{
                    borderLeft: isSweetSpot
                        ? "2px solid rgba(34,211,238,0.4)"
                        : "2px solid rgba(255,255,255,0.08)",
                }}
                key={heads}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <p className="text-sm" style={{ color: verdict.color }}>
                    {verdict.text}
                </p>
            </motion.div>
        </div>
    );
}

"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";

/*
  V37 — PositionInActionViz
  Move word to different positions, see attention change.
  Proper brightness: cyan-400, visible bars, clear text.
*/

const SENTENCE = ["The", "dog", "bit", "the", "man"];
const TARGET_WORD = "dog";
const D = 8;

const BASE_EMBED = [0.9, -0.3, 0.7, 0.1, 0.5, -0.2, 0.4, 0.6];

function posEnc(pos: number): number[] {
    return Array.from({ length: D }, (_, i) => {
        const freq = 1 / Math.pow(10000, (2 * Math.floor(i / 2)) / D);
        return i % 2 === 0 ? Math.sin(pos * freq) : Math.cos(pos * freq);
    });
}

function computeAttention(wordPos: number): number[] {
    const embeddings = SENTENCE.map((_, i) => {
        const base = i === wordPos
            ? BASE_EMBED
            : BASE_EMBED.map((v, d) => v * (0.5 + Math.sin(i * 3 + d) * 0.5));
        const pe = posEnc(i);
        return base.map((v, d) => v + pe[d]);
    });
    const q = embeddings[wordPos];
    const scores = embeddings.map((k) =>
        q.reduce((s, v, d) => s + v * k[d], 0)
    );
    const max = Math.max(...scores);
    const exps = scores.map((s) => Math.exp((s - max) / 2));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map((e) => e / sum);
}

const POSITIONS = [0, 1, 4];

export function PositionInActionViz() {
    const [selectedPos, setSelectedPos] = useState(1);

    const attentionWeights = useMemo(() => computeAttention(selectedPos), [selectedPos]);
    const maxWeight = Math.max(...attentionWeights);

    return (
        <div className="py-6 sm:py-8 px-3 sm:px-4" style={{ minHeight: 280 }}>
            {/* Position selector */}
            <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-[12px] text-white/40">
                    Put &quot;{TARGET_WORD}&quot; at position:
                </span>
                {POSITIONS.map((pos) => (
                    <motion.button
                        key={pos}
                        onClick={() => setSelectedPos(pos)}
                        whileTap={{ scale: 0.93 }}
                        className="w-8 h-8 rounded-lg text-[13px] font-mono font-bold transition-all"
                        style={{
                            background: pos === selectedPos
                                ? "linear-gradient(135deg, rgba(34,211,238,0.15), rgba(34,211,238,0.05))"
                                : "rgba(255,255,255,0.04)",
                            color: pos === selectedPos ? "#22d3ee" : "rgba(255,255,255,0.35)",
                            border: pos === selectedPos
                                ? "1.5px solid rgba(34,211,238,0.3)"
                                : "1px solid rgba(255,255,255,0.08)",
                        }}
                    >
                        {pos + 1}
                    </motion.button>
                ))}
            </div>

            {/* Sentence display */}
            <div className="flex items-center justify-center gap-1.5 mb-5">
                {SENTENCE.map((word, i) => {
                    const isTarget = i === selectedPos;
                    return (
                        <motion.span
                            key={`${word}-${i}`}
                            layout
                            className="px-2.5 py-1 rounded-lg text-[14px] font-medium"
                            style={{
                                background: isTarget
                                    ? "linear-gradient(135deg, rgba(34,211,238,0.1), rgba(34,211,238,0.04))"
                                    : "rgba(255,255,255,0.03)",
                                color: isTarget ? "#22d3ee" : "rgba(255,255,255,0.4)",
                                border: isTarget
                                    ? "1px solid rgba(34,211,238,0.2)"
                                    : "1px solid rgba(255,255,255,0.05)",
                            }}
                        >
                            {isTarget ? TARGET_WORD : word}
                        </motion.span>
                    );
                })}
            </div>

            {/* Attention bars */}
            <div className="max-w-sm mx-auto space-y-2">
                <p className="text-center text-[11px] text-white/30 mb-2">
                    Attention from &quot;{TARGET_WORD}&quot; at position {selectedPos + 1}:
                </p>

                {SENTENCE.map((word, i) => {
                    const w = attentionWeights[i];
                    const pct = Math.round(w * 100);
                    const barWidth = (w / maxWeight) * 100;
                    const isTarget = i === selectedPos;
                    const opacity = 0.15 + w * 0.55;

                    return (
                        <div key={i} className="flex items-center gap-2">
                            <span
                                className="w-10 text-right text-[13px] font-semibold shrink-0"
                                style={{
                                    color: isTarget ? "#22d3ee" : `rgba(255,255,255,${0.25 + w * 0.5})`,
                                }}
                            >
                                {isTarget ? TARGET_WORD : word}
                            </span>
                            <div
                                className="flex-1 h-5 rounded-md overflow-hidden"
                                style={{ background: "rgba(255,255,255,0.04)" }}
                            >
                                <motion.div
                                    className="h-full rounded-md"
                                    style={{
                                        background: `rgba(34,211,238,${opacity})`,
                                    }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${barWidth}%` }}
                                    transition={{
                                        type: "spring", stiffness: 150, damping: 20,
                                        delay: i * 0.04,
                                    }}
                                />
                            </div>
                            <motion.span
                                className="w-10 text-right text-[12px] font-mono font-bold shrink-0"
                                style={{ color: `rgba(34,211,238,${0.3 + w * 0.6})` }}
                                key={`${selectedPos}-${i}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.15 + i * 0.04 }}
                            >
                                {pct}%
                            </motion.span>
                        </div>
                    );
                })}
            </div>

            <motion.p
                className="max-w-xs mx-auto mt-4 text-center text-[13px] text-white/35 leading-relaxed"
                key={selectedPos}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                Same word, different position → <strong className="text-cyan-400/80">different attention pattern</strong>.
            </motion.p>
        </div>
    );
}

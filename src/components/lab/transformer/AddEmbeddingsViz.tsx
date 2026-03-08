"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/*
  V36 — AddEmbeddingsViz
  Word + Position → Combined bar charts. Proper brightness.
  Cyan = meaning, Amber = position, White = combined.
*/

const WORDS = ["The", "king", "wore", "the", "crown"];
const DIMS = 8;

function seededVal(seed: number): number {
    const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
    return Math.round((x - Math.floor(x)) * 200 - 100) / 100;
}

const WORD_EMBEDS = WORDS.map((_, wi) =>
    Array.from({ length: DIMS }, (_, d) => seededVal(wi * 100 + d * 13))
);

function posEnc(pos: number, dim: number): number {
    const freq = 1 / Math.pow(10000, (2 * Math.floor(dim / 2)) / DIMS);
    return dim % 2 === 0 ? Math.sin(pos * freq) : Math.cos(pos * freq);
}

const POS_EMBEDS = WORDS.map((_, wi) =>
    Array.from({ length: DIMS }, (_, d) => Math.round(posEnc(wi, d) * 100) / 100)
);

export function AddEmbeddingsViz() {
    const [selectedWord, setSelectedWord] = useState(1);
    const [showSum, setShowSum] = useState(false);

    const wordEmb = WORD_EMBEDS[selectedWord];
    const posEmb = POS_EMBEDS[selectedWord];
    const combined = wordEmb.map((w, i) => Math.round((w + posEmb[i]) * 100) / 100);

    const maxVal = Math.max(
        ...wordEmb.map(Math.abs),
        ...posEmb.map(Math.abs),
        ...combined.map(Math.abs)
    );

    function BarRow({
        values, color, label, delay = 0,
    }: {
        values: number[]; color: string; label: string; delay?: number;
    }) {
        return (
            <div className="flex items-center gap-2.5">
                <span
                    className="w-28 text-right text-[12px] font-semibold shrink-0 truncate"
                    style={{ color }}
                >
                    {label}
                </span>
                <div className="flex items-center gap-0.5 flex-1">
                    {values.map((val, i) => {
                        const h = (Math.abs(val) / maxVal) * 30;
                        const isPos = val >= 0;
                        const opacity = 0.25 + (Math.abs(val) / maxVal) * 0.4;
                        return (
                            <div key={i} className="flex flex-col items-center" style={{ width: 30 }}>
                                <span className="text-[9px] font-mono text-white/30 h-3.5">
                                    {val > 0 ? "+" : ""}{val.toFixed(1)}
                                </span>
                                <div
                                    className="relative flex items-center justify-center"
                                    style={{ height: 36, width: 18 }}
                                >
                                    <div className="absolute w-full h-px bg-white/06" style={{ top: "50%" }} />
                                    <motion.div
                                        className="absolute rounded-sm"
                                        style={{
                                            width: 12,
                                            background: color.replace(")", `,${opacity})`).replace("rgb", "rgba"),
                                            bottom: isPos ? "50%" : undefined,
                                            top: isPos ? undefined : "50%",
                                        }}
                                        initial={{ height: 0 }}
                                        animate={{ height: h }}
                                        transition={{
                                            type: "spring", stiffness: 180, damping: 18,
                                            delay: delay + i * 0.03,
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="py-6 sm:py-8 px-3 sm:px-4" style={{ minHeight: 280 }}>
            {/* Word selector */}
            <div className="flex items-center justify-center gap-1.5 mb-5">
                {WORDS.map((w, i) => (
                    <motion.button
                        key={i}
                        onClick={() => { setSelectedWord(i); setShowSum(false); }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1.5 rounded-lg text-[13px] font-mono font-bold transition-all"
                        style={{
                            background: i === selectedWord
                                ? "linear-gradient(135deg, rgba(34,211,238,0.15), rgba(34,211,238,0.05))"
                                : "rgba(255,255,255,0.04)",
                            color: i === selectedWord ? "#22d3ee" : "rgba(255,255,255,0.35)",
                            border: i === selectedWord
                                ? "1.5px solid rgba(34,211,238,0.3)"
                                : "1px solid rgba(255,255,255,0.08)",
                        }}
                    >
                        {w}
                    </motion.button>
                ))}
            </div>

            {/* Bar charts */}
            <div className="space-y-3 max-w-md mx-auto">
                <BarRow
                    values={wordEmb}
                    color="rgb(34,211,238)"
                    label={`"${WORDS[selectedWord]}" meaning`}
                />

                <div className="flex items-center gap-2.5">
                    <span className="w-28 text-right text-[18px] font-bold text-white/20 shrink-0">+</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-amber-400/15 via-amber-400/06 to-transparent" />
                </div>

                <BarRow
                    values={posEmb}
                    color="rgb(251,191,36)"
                    label={`Position ${selectedWord}`}
                    delay={0.12}
                />

                <div className="flex items-center gap-2.5">
                    <span className="w-28 text-right shrink-0">
                        <motion.button
                            onClick={() => setShowSum(true)}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-1.5 rounded-lg text-[12px] font-semibold transition-all"
                            style={{
                                background: showSum
                                    ? "rgba(255,255,255,0.06)"
                                    : "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                                color: showSum ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.35)",
                                border: showSum
                                    ? "1px solid rgba(255,255,255,0.12)"
                                    : "1px solid rgba(255,255,255,0.08)",
                            }}
                        >
                            {showSum ? "= Combined" : "→ Add them"}
                        </motion.button>
                    </span>
                    <div className="flex-1 h-px bg-gradient-to-r from-white/06 via-white/03 to-transparent" />
                </div>

                <AnimatePresence>
                    {showSum && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 25 }}
                        >
                            <BarRow
                                values={combined}
                                color="rgb(255,255,255)"
                                label="Final input"
                                delay={0.08}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

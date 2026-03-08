"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/*
  V34 — SimpleNumbersViz
  Bigger text (min 13px), more vibrant bars, clearer concept.
  Cyan (meaning) + amber (position). Proper brightness.
*/

const WORDS = ["The", "dog", "bit", "the", "man"];
const EMBED_VALS = [0.4, 0.9, 0.7, 0.4, 0.8];

type ScaleMode = "big" | "small";

export function SimpleNumbersViz() {
    const [mode, setMode] = useState<ScaleMode>("big");

    const posValues = WORDS.map((_, i) =>
        mode === "big" ? (i + 1) * 100 : (i + 1) * 0.001
    );
    const combined = EMBED_VALS.map((e, i) => e + posValues[i]);

    return (
        <div className="py-6 sm:py-8 px-3 sm:px-4" style={{ minHeight: 320 }}>
            {/* Toggle */}
            <div className="flex items-center justify-center gap-2 mb-6">
                {(["big", "small"] as const).map((m) => {
                    const active = mode === m;
                    return (
                        <motion.button
                            key={m}
                            onClick={() => setMode(m)}
                            whileTap={{ scale: 0.95 }}
                            className="px-5 py-2.5 rounded-xl text-[14px] font-semibold transition-all"
                            style={{
                                background: active
                                    ? "linear-gradient(135deg, rgba(34,211,238,0.18), rgba(34,211,238,0.06))"
                                    : "rgba(255,255,255,0.04)",
                                color: active ? "#22d3ee" : "rgba(255,255,255,0.4)",
                                border: active
                                    ? "1.5px solid rgba(34,211,238,0.35)"
                                    : "1px solid rgba(255,255,255,0.08)",
                            }}
                        >
                            {m === "big" ? "Big numbers (+100, +200...)" : "Tiny numbers (+0.001, +0.002...)"}
                        </motion.button>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mb-5">
                <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-sm" style={{ background: "rgba(34,211,238,0.5)" }} />
                    <span className="text-[13px] text-white/50 font-medium">Word meaning</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-sm" style={{ background: "rgba(251,191,36,0.5)" }} />
                    <span className="text-[13px] text-white/50 font-medium">Position number</span>
                </div>
            </div>

            {/* Bar comparison */}
            <div className="space-y-3 max-w-lg mx-auto">
                {WORDS.map((word, i) => {
                    const embedPct = mode === "big"
                        ? (EMBED_VALS[i] / combined[i]) * 100
                        : 100;

                    return (
                        <motion.div
                            key={`${i}-${mode}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.06 }}
                        >
                            <div className="flex items-center gap-3">
                                <span className="w-6 text-center text-[13px] font-mono text-white/30 shrink-0">
                                    {i + 1}
                                </span>
                                <span className="w-12 text-right text-[15px] font-mono font-bold text-white/70 shrink-0">
                                    {word}
                                </span>

                                <div className="flex-1 h-10 rounded-lg overflow-hidden relative" style={{ background: "rgba(255,255,255,0.04)" }}>
                                    {/* Meaning bar (cyan) */}
                                    <motion.div
                                        className="absolute inset-y-0 left-0 rounded-lg flex items-center justify-center"
                                        style={{
                                            background: "linear-gradient(90deg, rgba(34,211,238,0.50), rgba(34,211,238,0.22))",
                                            borderRight: "1.5px solid rgba(34,211,238,0.4)",
                                        }}
                                        animate={{ width: `${Math.max(Math.min(embedPct, 100), 2)}%` }}
                                        transition={{ type: "spring", stiffness: 120, damping: 20 }}
                                    >
                                        {embedPct > 12 && (
                                            <span className="text-[13px] font-mono text-white/70 font-semibold">
                                                {EMBED_VALS[i].toFixed(1)}
                                            </span>
                                        )}
                                    </motion.div>

                                    {/* Position bar (amber) — big mode */}
                                    {mode === "big" && (
                                        <motion.div
                                            className="absolute inset-y-0 rounded-r-lg flex items-center justify-center"
                                            style={{
                                                background: "linear-gradient(90deg, rgba(251,191,36,0.40), rgba(251,191,36,0.18))",
                                                left: `${Math.min(embedPct, 100)}%`,
                                            }}
                                            animate={{ width: `${Math.max(100 - embedPct, 0)}%` }}
                                            transition={{ type: "spring", stiffness: 120, damping: 20 }}
                                        >
                                            <span className="text-[13px] font-mono font-bold text-amber-400/90 whitespace-nowrap">
                                                +{posValues[i]}
                                            </span>
                                        </motion.div>
                                    )}

                                    {/* Tiny position indicator — small mode */}
                                    {mode === "small" && (
                                        <motion.div
                                            className="absolute right-1.5 inset-y-1.5 rounded-sm"
                                            style={{ background: "rgba(251,191,36,0.2)", width: 5 }}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        />
                                    )}
                                </div>

                                <span className="w-20 text-right text-[14px] font-mono shrink-0 font-semibold text-amber-400/80">
                                    {mode === "big" ? `= ${combined[i].toFixed(0)}` : `+${posValues[i].toFixed(3)}`}
                                </span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Explanation */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={mode}
                    className="mt-6 rounded-xl p-5 max-w-lg mx-auto"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ delay: 0.3 }}
                    style={{
                        background: "linear-gradient(135deg, rgba(251,191,36,0.08), rgba(34,211,238,0.04))",
                        border: "1px solid rgba(251,191,36,0.18)",
                    }}
                >
                    <p className="text-[14px] font-semibold mb-1.5 text-amber-400">
                        {mode === "big" ? "Position drowns out meaning" : "Position signal is invisible"}
                    </p>
                    <p className="text-[14px] text-white/50 leading-relaxed">
                        {mode === "big"
                            ? `Look at "dog" — its meaning is just 0.9, but position adds +200. The model sees 200.9 and thinks "that's basically just 200." It forgot what "dog" even means.`
                            : `The difference between position 1 (+0.001) and position 5 (+0.005) is just 0.004. The model's meaning values are around 0.4–0.9. That tiny position signal gets lost in the noise.`}
                    </p>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

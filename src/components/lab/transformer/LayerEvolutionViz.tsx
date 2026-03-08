"use client";

import { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

/*
  V46 — LayerEvolutionViz
  Shows how representations evolve across stacked blocks.
  Slider: 1-6 blocks. For each block count, show token "bubbles"
  that become progressively more differentiated (separated).
  One idea: depth = more differentiation.
  Height: ~300px. All text ≥ 13px.
*/

const TOKENS = ["The", "professor", "published", "the", "paper"];
const COLORS = ["#67e8f9", "#818cf8", "#f472b6", "#fbbf24", "#34d399"];

/* Fake 2D positions per block depth — tokens start clustered, then spread */
const POSITIONS: Record<number, { x: number; y: number }[]> = {
    1: [
        { x: 42, y: 48 }, { x: 50, y: 52 }, { x: 55, y: 46 },
        { x: 47, y: 55 }, { x: 53, y: 50 },
    ],
    2: [
        { x: 35, y: 44 }, { x: 55, y: 56 }, { x: 60, y: 40 },
        { x: 38, y: 58 }, { x: 62, y: 52 },
    ],
    3: [
        { x: 25, y: 38 }, { x: 60, y: 62 }, { x: 70, y: 32 },
        { x: 30, y: 65 }, { x: 72, y: 55 },
    ],
    4: [
        { x: 18, y: 30 }, { x: 62, y: 68 }, { x: 78, y: 25 },
        { x: 22, y: 72 }, { x: 80, y: 58 },
    ],
    5: [
        { x: 12, y: 22 }, { x: 65, y: 75 }, { x: 85, y: 18 },
        { x: 15, y: 78 }, { x: 88, y: 60 },
    ],
    6: [
        { x: 8, y: 15 }, { x: 68, y: 82 }, { x: 90, y: 12 },
        { x: 10, y: 85 }, { x: 92, y: 58 },
    ],
};

const INSIGHTS: Record<number, string> = {
    1: "After 1 block: tokens barely differentiated — just local patterns.",
    2: "After 2 blocks: some separation emerges between related words.",
    3: "After 3 blocks: syntax visible — subject/verb/object clusters form.",
    4: "After 4 blocks: semantic roles clearly separated.",
    5: "After 5 blocks: abstract meaning encoded — fine distinctions appear.",
    6: "After 6 blocks: each token occupies a unique, meaningful position.",
};

export function LayerEvolutionViz() {
    const [depth, setDepth] = useState(1);
    const positions = POSITIONS[depth];

    return (
        <div className="py-6 sm:py-8 px-3 sm:px-6" style={{ minHeight: 300 }}>
            {/* Depth slider */}
            <div className="flex items-center justify-center gap-3 mb-5">
                <span className="text-[13px] font-semibold text-white/25">Blocks:</span>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                    <motion.button
                        key={n}
                        onClick={() => setDepth(n)}
                        className="w-9 h-9 rounded-lg text-[14px] font-bold"
                        style={{
                            background: depth === n
                                ? "linear-gradient(135deg, rgba(34,211,238,0.15), rgba(139,92,246,0.1))"
                                : "rgba(255,255,255,0.02)",
                            border: `1.5px solid ${depth === n ? "rgba(34,211,238,0.4)" : "rgba(255,255,255,0.05)"}`,
                            color: depth === n ? "#22d3ee" : "rgba(255,255,255,0.2)",
                        }}
                        whileTap={{ scale: 0.9 }}
                    >
                        {n}
                    </motion.button>
                ))}
            </div>

            {/* 2D scatter — token bubbles */}
            <div
                className="relative mx-auto rounded-2xl overflow-hidden"
                style={{
                    width: "100%",
                    maxWidth: 420,
                    height: 220,
                    background: "rgba(255,255,255,0.01)",
                    border: "1px solid rgba(255,255,255,0.04)",
                }}
            >
                {/* Grid lines */}
                {[25, 50, 75].map((pct) => (
                    <div key={`h-${pct}`} className="absolute left-0 right-0" style={{ top: `${pct}%`, height: 1, background: "rgba(255,255,255,0.02)" }} />
                ))}
                {[25, 50, 75].map((pct) => (
                    <div key={`v-${pct}`} className="absolute top-0 bottom-0" style={{ left: `${pct}%`, width: 1, background: "rgba(255,255,255,0.02)" }} />
                ))}

                {/* Token bubbles */}
                {positions.map((pos, i) => (
                    <motion.div
                        key={i}
                        className="absolute flex items-center justify-center rounded-full"
                        style={{
                            width: 56,
                            height: 56,
                            background: `${COLORS[i]}10`,
                            border: `2px solid ${COLORS[i]}50`,
                            boxShadow: depth >= 4 ? `0 0 16px ${COLORS[i]}20` : "none",
                        }}
                        animate={{
                            left: `${pos.x}%`,
                            top: `${pos.y}%`,
                            x: "-50%",
                            y: "-50%",
                        }}
                        transition={{ type: "spring", stiffness: 100, damping: 16 }}
                    >
                        <span className="text-[13px] font-bold" style={{ color: COLORS[i] }}>
                            {TOKENS[i].slice(0, 4)}
                        </span>
                    </motion.div>
                ))}
            </div>

            {/* Insight text */}
            <AnimatePresence mode="wait">
                <motion.p
                    key={depth}
                    className="text-center text-[14px] font-semibold mt-4 max-w-md mx-auto"
                    style={{ color: depth >= 4 ? "rgba(52,211,153,0.6)" : "rgba(34,211,238,0.5)" }}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                >
                    {INSIGHTS[depth]}
                </motion.p>
            </AnimatePresence>
        </div>
    );
}

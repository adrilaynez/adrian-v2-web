"use client";

import { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

/*
  ContextShiftsViz — v3
  Cyan/amber aesthetic. Glass panels with gradient backgrounds.
  Shows same word with different meanings. Split-identity design:
  the target word pulses between two colors. Cards have idle float.
  Connecting lines hint at which context words "pull" the meaning.
*/

interface ContextPair {
    word: string;
    contexts: [ContextExample, ContextExample];
}

interface ContextExample {
    sentence: string[];
    targetIdx: number;
    meaning: string;
    icon: string;
    color: string;
    glowColor: string;
    highlightIdxs: number[];
}

const EXAMPLES: ContextPair[] = [
    {
        word: "bank",
        contexts: [
            {
                sentence: ["I", "sat", "by", "the", "river", "bank"],
                targetIdx: 5,
                meaning: "Edge of a river",
                icon: "🏞️",
                color: "#22d3ee",
                glowColor: "rgba(34,211,238,0.08)",
                highlightIdxs: [4],
            },
            {
                sentence: ["I", "went", "to", "the", "bank", "to", "deposit", "money"],
                targetIdx: 4,
                meaning: "Financial institution",
                icon: "🏦",
                color: "#fbbf24",
                glowColor: "rgba(251,191,36,0.08)",
                highlightIdxs: [6, 7],
            },
        ],
    },
    {
        word: "light",
        contexts: [
            {
                sentence: ["The", "light", "from", "the", "window", "was", "warm"],
                targetIdx: 1,
                meaning: "Brightness, illumination",
                icon: "☀️",
                color: "#fbbf24",
                glowColor: "rgba(251,191,36,0.08)",
                highlightIdxs: [4, 6],
            },
            {
                sentence: ["This", "bag", "is", "very", "light", "and", "easy", "to", "carry"],
                targetIdx: 4,
                meaning: "Not heavy",
                icon: "🪶",
                color: "#22d3ee",
                glowColor: "rgba(34,211,238,0.08)",
                highlightIdxs: [1, 6, 8],
            },
        ],
    },
];

export function ContextShiftsViz() {
    const [exampleIdx, setExampleIdx] = useState(0);
    const pair = EXAMPLES[exampleIdx];

    return (
        <div className="py-8 sm:py-10 px-2 sm:px-4 space-y-7">
            {/* ── Word selector + big word ── */}
            <div className="flex flex-col items-center gap-3">
                <motion.p
                    className="text-xs text-white/40 tracking-wide font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    Same word. Different context. Different meaning.
                </motion.p>

                {/* Example toggle — moved to top for discoverability */}
                {EXAMPLES.length > 1 && (
                    <div className="flex items-center justify-center gap-5">
                        {EXAMPLES.map((ex, i) => {
                            const isActive = i === exampleIdx;
                            return (
                                <button
                                    key={i}
                                    onClick={() => setExampleIdx(i)}
                                    className="relative pb-1 text-xs sm:text-sm font-medium transition-colors duration-300 cursor-pointer"
                                    style={{
                                        color: isActive ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.3)",
                                    }}
                                >
                                    &ldquo;{ex.word}&rdquo;
                                    {isActive && (
                                        <motion.span
                                            className="absolute bottom-0 left-0 right-0 h-[1.5px] rounded-full"
                                            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)" }}
                                            layoutId="ctx-shift-tab"
                                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}

                <AnimatePresence mode="wait">
                    <motion.div
                        key={pair.word}
                        className="relative"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ type: "spring", stiffness: 200 }}
                    >
                        {/* Pulsing glow behind the word — alternates between two context colors */}
                        <motion.div
                            className="absolute inset-0 -inset-x-6 -inset-y-3 rounded-2xl -z-10 blur-xl"
                            animate={{
                                background: [
                                    `radial-gradient(ellipse, ${pair.contexts[0].color}20, transparent 70%)`,
                                    `radial-gradient(ellipse, ${pair.contexts[1].color}20, transparent 70%)`,
                                    `radial-gradient(ellipse, ${pair.contexts[0].color}20, transparent 70%)`,
                                ],
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <span className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                            &ldquo;{pair.word}&rdquo;
                        </span>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* ── Two context panels ── */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={exampleIdx}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.4 }}
                >
                    {pair.contexts.map((ctx, ci) => (
                        <motion.div
                            key={ci}
                            className="rounded-2xl p-5 sm:p-6 space-y-4"
                            style={{
                                border: `1px solid ${ctx.color}18`,
                                background: `linear-gradient(145deg, ${ctx.glowColor}, transparent 60%)`,
                            }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{
                                opacity: 1,
                                y: [0, -2, 0],
                            }}
                            transition={{
                                opacity: { delay: ci * 0.15, duration: 0.4 },
                                y: { duration: 3 + ci * 0.5, repeat: Infinity, ease: "easeInOut", delay: ci * 0.8 },
                            }}
                        >
                            {/* Sentence with highlights */}
                            <div className="flex flex-wrap gap-x-2.5 gap-y-1.5 justify-center">
                                {ctx.sentence.map((word, wi) => {
                                    const isTarget = wi === ctx.targetIdx;
                                    const isHighlight = ctx.highlightIdxs.includes(wi);
                                    return (
                                        <motion.span
                                            key={wi}
                                            className={`
                                                text-base sm:text-lg font-medium px-0.5
                                                ${isTarget
                                                    ? "font-bold underline underline-offset-4 decoration-2"
                                                    : isHighlight
                                                        ? "font-semibold"
                                                        : "text-white/45"
                                                }
                                            `}
                                            style={{
                                                color: isTarget
                                                    ? ctx.color
                                                    : isHighlight
                                                        ? `${ctx.color}bb`
                                                        : undefined,
                                                textDecorationColor: isTarget ? `${ctx.color}55` : undefined,
                                            }}
                                            initial={{ opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 + wi * 0.04, duration: 0.25 }}
                                        >
                                            {word}
                                        </motion.span>
                                    );
                                })}
                            </div>

                            {/* Meaning chip */}
                            <motion.div
                                className="flex justify-center"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.35, duration: 0.3 }}
                            >
                                <span
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium"
                                    style={{
                                        border: `1px solid ${ctx.color}20`,
                                        background: `${ctx.color}08`,
                                        color: ctx.color,
                                    }}
                                >
                                    {ctx.meaning}
                                </span>
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>
            </AnimatePresence>

            {/* ── Bottom insight ── */}
            <p className="text-xs sm:text-sm text-white/45 text-center leading-relaxed max-w-lg mx-auto">
                You knew the meaning <strong className="text-white/70">instantly</strong>
                {" "}because you read the surrounding words.{" "}
                <span className="text-amber-400/70">The MLP treats &ldquo;{pair.word}&rdquo; identically in both sentences.</span>
            </p>
        </div>
    );
}

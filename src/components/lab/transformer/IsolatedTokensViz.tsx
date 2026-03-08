"use client";

import { useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

/*
  IsolatedTokensViz — v6 (text-first, premium)
  Words as inline text (no boxes). Hover = word glows, others dim softly.
  Ultra-subtle vertical "wall" lines between words (amber, nearly invisible).
  Walls brighten slightly near hovered word. Modern, clean, editorial.
*/

const WORDS = ["The", "cat", "sat", "on", "the", "warm", "mat"];

export function IsolatedTokensViz() {
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
    const isActive = hoveredIdx !== null;
    const isIdle = !isActive;

    return (
        <div className="py-8 sm:py-10 px-2 sm:px-4 space-y-4">
            {/* ── Words with subtle wall barriers ── */}
            <div
                className="relative flex items-center justify-center gap-0 py-8 sm:py-10"
                onMouseLeave={() => setHoveredIdx(null)}
            >
                {/* Scanning spotlight for idle state */}
                {isIdle && (
                    <motion.div
                        className="absolute top-0 bottom-0 pointer-events-none z-0"
                        style={{
                            width: 180,
                            background: "radial-gradient(ellipse at center, rgba(255, 255, 255, 0.03), transparent 70%)",
                            filter: "blur(10px)",
                        }}
                        animate={{ left: ["8%", "72%", "8%"] }}
                        transition={{
                            duration: 7,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                )}

                {WORDS.map((word, i) => {
                    const isHovered = hoveredIdx === i;
                    const isAdjacentWall = hoveredIdx !== null && (i === hoveredIdx || i === hoveredIdx + 1);
                    const isAdjacentWallBefore = hoveredIdx !== null && i === hoveredIdx;

                    /* Color: hovered = bright white (NOT cyan), others dim softly */
                    const color = isHovered
                        ? "rgba(255, 255, 255, 0.95)"
                        : isActive
                            ? "rgba(255, 255, 255, 0.28)"
                            : "rgba(255, 255, 255, 0.7)";

                    const textShadow = isHovered
                        ? "0 0 18px rgba(255, 255, 255, 0.35), 0 0 40px rgba(255, 255, 255, 0.1)"
                        : "none";

                    return (
                        <div key={i} className="flex items-center">
                            {/* Barrier wall BEFORE this word (between i-1 and i) */}
                            {i > 0 && (
                                <div className="relative flex items-center justify-center w-4 sm:w-5 h-10 sm:h-12 shrink-0">
                                    <div
                                        className="w-[1px] h-full rounded-full transition-all duration-300"
                                        style={{
                                            background: isAdjacentWall || isAdjacentWallBefore
                                                ? "linear-gradient(to bottom, transparent 10%, rgba(251,191,36,0.12) 30%, rgba(251,191,36,0.2) 50%, rgba(251,191,36,0.12) 70%, transparent 90%)"
                                                : "linear-gradient(to bottom, transparent 10%, rgba(251,191,36,0.05) 30%, rgba(251,191,36,0.08) 50%, rgba(251,191,36,0.05) 70%, transparent 90%)",
                                            opacity: isActive ? 1 : 0.7,
                                        }}
                                    />
                                </div>
                            )}

                            {/* Word as inline text */}
                            <motion.span
                                className="relative font-medium tracking-[-0.01em] cursor-pointer select-none px-[0.15em]"
                                style={{
                                    fontSize: "clamp(1.3rem, 3vw, 1.75rem)",
                                    color,
                                    textShadow,
                                    transition: "color 0.25s ease, text-shadow 0.3s ease",
                                }}
                                onMouseEnter={() => setHoveredIdx(i)}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.06, duration: 0.4 }}
                            >
                                {/* Glow halo — WHITE */}
                                {isHovered && (
                                    <motion.span
                                        className="absolute inset-0 -inset-x-2 -inset-y-1 rounded-full pointer-events-none"
                                        style={{
                                            background: "radial-gradient(ellipse at center, rgba(255, 255, 255, 0.1) 0%, transparent 70%)",
                                            filter: "blur(6px)",
                                        }}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.25 }}
                                    />
                                )}

                                {/* Underline accent — WHITE */}
                                {isHovered && (
                                    <motion.span
                                        className="absolute -bottom-1 left-0 right-0 h-[1.5px] rounded-full pointer-events-none"
                                        style={{ background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)" }}
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ duration: 0.25 }}
                                    />
                                )}

                                <span className="relative z-10">{word}</span>
                            </motion.span>
                        </div>
                    );
                })}
            </div>

            {/* ── Hover feedback ── */}
            <div className="h-6 flex items-center justify-center">
                <AnimatePresence mode="wait">
                    {hoveredIdx !== null ? (
                        <motion.p
                            key="hover"
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -3 }}
                            transition={{ duration: 0.15 }}
                            className="text-[13px] text-center"
                        >
                            <span className="text-white/60 font-medium">&ldquo;{WORDS[hoveredIdx]}&rdquo;</span>
                            <span className="text-white/30"> lights up — but nothing else reacts. </span>
                            <span className="text-white/20 italic">Alone.</span>
                        </motion.p>
                    ) : (
                        <motion.p
                            key="idle"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="text-[13px] text-white/20 text-center italic"
                        >
                            Hover any word — notice nothing connects
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

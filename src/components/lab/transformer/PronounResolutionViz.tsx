"use client";

import { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

/*
  PronounResolutionViz — v2
  Cyan/amber aesthetic. "it" glows amber. Trophy = cyan. Suitcase = amber.
  Glass morphism buttons. Richer visual feedback on answer. Premium feel.
*/

const SENTENCE_PARTS = [
    { text: "The", normal: true },
    { text: "trophy", normal: false, id: "trophy" },
    { text: "doesn\u2019t fit in the", normal: true },
    { text: "suitcase", normal: false, id: "suitcase" },
    { text: "because", normal: true },
    { text: "it", normal: false, id: "it" },
    { text: "is too big.", normal: true },
];

export function PronounResolutionViz() {
    const [choice, setChoice] = useState<"trophy" | "suitcase" | null>(null);
    const correct = choice === "trophy";

    return (
        <div className="py-10 sm:py-14 px-3 sm:px-6 space-y-8">
            {/* ── Sentence ── */}
            <div className="flex flex-wrap items-baseline justify-center gap-x-[0.3em] gap-y-2 leading-[1.8]"
                style={{ fontSize: "clamp(1.2rem, 2.8vw, 1.6rem)" }}
            >
                {SENTENCE_PARTS.map((part, i) => {
                    const isTrophy = part.id === "trophy";
                    const isSuitcase = part.id === "suitcase";
                    const isIt = part.id === "it";

                    /* Color logic */
                    let color = "rgba(255,255,255,0.45)";
                    if (isIt) color = "rgb(251,191,36)";
                    if (isTrophy && !choice) color = "rgba(34,211,238,0.75)";
                    if (isTrophy && choice === "trophy") color = "rgb(34,211,238)";
                    if (isTrophy && choice === "suitcase") color = "rgba(255,255,255,0.3)";
                    if (isSuitcase && !choice) color = "rgba(251,191,36,0.55)";
                    if (isSuitcase && choice === "suitcase") color = "rgb(251,191,36)";
                    if (isSuitcase && choice === "trophy") color = "rgba(255,255,255,0.3)";

                    return (
                        <motion.span
                            key={i}
                            className="relative font-medium tracking-[-0.01em]"
                            style={{
                                color: part.normal ? "rgba(255,255,255,0.45)" : color,
                                fontWeight: part.normal ? 400 : 600,
                                transition: "color 0.3s ease",
                            }}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06, duration: 0.35 }}
                        >
                            {part.text}
                            {/* Pulsing glow under "it" */}
                            {isIt && !choice && (
                                <motion.span
                                    className="absolute -inset-x-2 -inset-y-1 rounded-full -z-10"
                                    style={{ background: "radial-gradient(ellipse, rgba(251,191,36,0.12), transparent 70%)", filter: "blur(4px)" }}
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                />
                            )}
                            {/* Subtle underline on key words */}
                            {(isTrophy || isSuitcase) && !choice && (
                                <span
                                    className="absolute -bottom-0.5 left-0 right-0 h-[1.5px] rounded-full"
                                    style={{
                                        background: isTrophy
                                            ? "linear-gradient(90deg, transparent, rgba(34,211,238,0.25), transparent)"
                                            : "linear-gradient(90deg, transparent, rgba(251,191,36,0.2), transparent)"
                                    }}
                                />
                            )}
                        </motion.span>
                    );
                })}
            </div>

            {/* ── Question + choices ── */}
            <AnimatePresence mode="wait">
                {!choice ? (
                    <motion.div
                        key="question"
                        className="flex flex-col items-center gap-5"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                    >
                        <p className="text-[13px] sm:text-sm text-white/40">
                            What does <span className="text-amber-300/80 font-medium">&ldquo;it&rdquo;</span> refer to?
                        </p>
                        <div className="flex items-center gap-4">
                            <motion.button
                                onClick={() => setChoice("trophy")}
                                className="px-5 py-2.5 rounded-xl text-[13px] sm:text-sm font-medium cursor-pointer
                                    transition-all duration-200"
                                style={{
                                    border: "1px solid rgba(34,211,238,0.15)",
                                    background: "rgba(34,211,238,0.04)",
                                    color: "rgba(34,211,238,0.7)",
                                }}
                                whileHover={{ scale: 1.03, boxShadow: "0 0 20px -4px rgba(34,211,238,0.15)" }}
                                whileTap={{ scale: 0.97 }}
                            >
                                The trophy
                            </motion.button>
                            <motion.button
                                onClick={() => setChoice("suitcase")}
                                className="px-5 py-2.5 rounded-xl text-[13px] sm:text-sm font-medium cursor-pointer
                                    transition-all duration-200"
                                style={{
                                    border: "1px solid rgba(251,191,36,0.15)",
                                    background: "rgba(251,191,36,0.04)",
                                    color: "rgba(251,191,36,0.7)",
                                }}
                                whileHover={{ scale: 1.03, boxShadow: "0 0 20px -4px rgba(251,191,36,0.15)" }}
                                whileTap={{ scale: 0.97 }}
                            >
                                The suitcase
                            </motion.button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="answer"
                        className="flex flex-col items-center gap-4"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {correct ? (
                            <motion.p
                                className="text-sm font-medium text-cyan-300/80"
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                ✓ Exactly — the trophy.
                            </motion.p>
                        ) : (
                            <motion.p
                                className="text-sm font-medium text-amber-300/80"
                                animate={{ x: [0, -3, 3, -3, 0] }}
                                transition={{ duration: 0.3 }}
                            >
                                ✗ Not quite — it&apos;s the trophy that&apos;s too big.
                            </motion.p>
                        )}

                        <p className="text-[13px] sm:text-sm text-white/35 text-center max-w-md leading-relaxed">
                            You resolved that <span className="text-white/55 font-medium">instantly</span> — connecting
                            &ldquo;it&rdquo; back to &ldquo;trophy&rdquo; across six words using meaning, grammar,
                            and common sense. <span className="text-amber-300/50">Our model has no mechanism to do this.</span>
                        </p>

                        <button
                            onClick={() => setChoice(null)}
                            className="text-[11px] text-white/20 hover:text-white/40 transition-colors cursor-pointer"
                        >
                            Try again
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

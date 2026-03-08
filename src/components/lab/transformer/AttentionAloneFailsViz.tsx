"use client";

import { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

/*
  V38b — AttentionAloneFailsViz ⭐⭐
  "The Parrot Problem" — Select a word, see what attention gathered,
  see a question it can't answer, toggle FFN to see the answer emerge.
  Teaches: attention = listening, FFN = thinking. Both are needed.
  All text ≥ 13px. No filters. Premium minimal design.
*/

const SENTENCE = ["The", "professor", "published", "the", "paper"];

interface WordData {
    gathered: string;
    question: string;
    attnAnswer: string;
    ffnAnswer: string;
}

const WORD_DATA: Record<number, WordData> = {
    0: {
        gathered: "Heard: a noun follows, something about academia",
        question: "Which 'the' is this — the one before 'professor' or before 'paper'?",
        attnAnswer: "...both 'the' tokens look the same. Can\u2019t tell them apart.",
        ffnAnswer: "First 'the' \u2192 subject marker. Second 'the' \u2192 object marker. Different roles.",
    },
    1: {
        gathered: "Heard: 'published' nearby, 'paper' in sentence, academic context",
        question: "Is 'professor' the one doing the action, or receiving it?",
        attnAnswer: "...it knows 'published' is nearby, but can\u2019t determine the role.",
        ffnAnswer: "'Professor' \u2192 agent (subject). The one who published. Strong subject signal.",
    },
    2: {
        gathered: "Heard: 'professor' to the left, 'paper' to the right",
        question: "Is 'published' an action, a state, or an adjective here?",
        attnAnswer: "...it gathered neighbors, but can\u2019t classify the word\u2019s function.",
        ffnAnswer: "'Published' \u2192 past-tense action verb. Connects subject to object.",
    },
    3: {
        gathered: "Heard: 'paper' follows, similar position to first 'the'",
        question: "Same word as position 0 — but does it serve the same purpose?",
        attnAnswer: "...both instances blended similarly. They look identical.",
        ffnAnswer: "This 'the' \u2192 object determiner. Distinct from the subject determiner.",
    },
    4: {
        gathered: "Heard: 'published' in sentence, 'professor' related, academic field",
        question: "Is this 'paper' a document, a material, or a newspaper?",
        attnAnswer: "...it heard 'professor' and 'published' but can\u2019t disambiguate.",
        ffnAnswer: "'Paper' \u2192 academic publication. Disambiguated by processing the gathered context.",
    },
};

type Stage = "select" | "gathered" | "question" | "resolved";

export function AttentionAloneFailsViz() {
    const [selected, setSelected] = useState<number | null>(null);
    const [stage, setStage] = useState<Stage>("select");

    const selectWord = (i: number) => {
        setSelected(i);
        setStage("gathered");
    };

    const advance = () => {
        if (stage === "gathered") setStage("question");
        else if (stage === "question") setStage("resolved");
    };

    const reset = () => {
        setSelected(null);
        setStage("select");
    };

    const data = selected !== null ? WORD_DATA[selected] : null;

    const buttonLabel =
        stage === "gathered" ? "Now ask a question \u2192"
            : stage === "question" ? "Turn on the FFN \u2192"
                : null;

    return (
        <div className="py-6 sm:py-8 px-2 sm:px-4" style={{ minHeight: 280 }}>
            {/* Sentence with clickable words */}
            <div className="flex items-baseline gap-x-2 flex-wrap justify-center py-4 leading-[2.4]">
                {SENTENCE.map((word, i) => {
                    const isSelected = selected === i;
                    const hasSelection = selected !== null;
                    return (
                        <motion.span
                            key={i}
                            onClick={() => selectWord(i)}
                            className="font-semibold cursor-pointer select-none"
                            style={{
                                fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
                                color: isSelected
                                    ? "#22d3ee"
                                    : hasSelection
                                        ? "rgba(255,255,255,0.2)"
                                        : "rgba(34,211,238,0.7)",
                                textShadow: isSelected ? "0 0 12px rgba(34,211,238,0.3)" : "none",
                                transition: "color 0.3s, text-shadow 0.3s",
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            {word}
                        </motion.span>
                    );
                })}
            </div>

            {/* Idle hint */}
            {stage === "select" && (
                <motion.p
                    className="text-center text-[13px] text-white/30 mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    Click any word to see what attention gathers for it
                </motion.p>
            )}

            {/* Content area */}
            <AnimatePresence mode="wait">
                {data && stage !== "select" && (
                    <motion.div
                        key={`${selected}-${stage}`}
                        className="max-w-lg mx-auto mt-6"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Step 1: What attention gathered */}
                        {(stage === "gathered" || stage === "question" || stage === "resolved") && (
                            <div
                                className="mb-4 pl-3"
                                style={{ borderLeft: "2px solid rgba(34,211,238,0.25)" }}
                            >
                                <p className="text-[13px] uppercase tracking-[0.15em] text-cyan-400/50 font-semibold mb-1">
                                    Attention gathered
                                </p>
                                <p className="text-[14px] text-white/45 leading-relaxed">
                                    {data.gathered}
                                </p>
                            </div>
                        )}

                        {/* Step 2: The question */}
                        {(stage === "question" || stage === "resolved") && (
                            <motion.div
                                className="mb-4 pl-3"
                                style={{ borderLeft: "2px solid rgba(251,191,36,0.25)" }}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <p className="text-[13px] uppercase tracking-[0.15em] text-amber-400/50 font-semibold mb-1">
                                    But can it answer
                                </p>
                                <p className="text-[14px] text-white/55 leading-relaxed italic">
                                    &ldquo;{data.question}&rdquo;
                                </p>

                                {/* Attention's failed answer */}
                                <motion.div
                                    className="mt-2 pl-3"
                                    style={{ borderLeft: "2px solid rgba(255,255,255,0.06)" }}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <p className="text-[13px] text-white/25 leading-relaxed">
                                        <span className="text-cyan-400/40 font-semibold">Attention alone</span>: {data.attnAnswer}
                                    </p>
                                </motion.div>
                            </motion.div>
                        )}

                        {/* Step 3: FFN resolves it */}
                        {stage === "resolved" && (
                            <motion.div
                                className="pl-3"
                                style={{ borderLeft: "2px solid rgba(251,191,36,0.4)" }}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.35 }}
                            >
                                <p className="text-[13px] uppercase tracking-[0.15em] text-amber-400/60 font-semibold mb-1">
                                    After FFN processing
                                </p>
                                <p className="text-[14px] text-amber-400/70 leading-relaxed font-medium">
                                    {data.ffnAnswer}
                                </p>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Action buttons */}
            <div className="flex items-center justify-center gap-3 mt-5">
                {buttonLabel && (
                    <motion.button
                        onClick={advance}
                        className="px-5 py-2 text-[14px] font-semibold rounded-lg cursor-pointer transition-all"
                        style={{
                            background: stage === "gathered"
                                ? "rgba(251,191,36,0.08)"
                                : "rgba(251,191,36,0.12)",
                            border: stage === "gathered"
                                ? "1.5px solid rgba(251,191,36,0.2)"
                                : "1.5px solid rgba(251,191,36,0.3)",
                            color: "#fbbf24",
                        }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        {buttonLabel}
                    </motion.button>
                )}
                {stage !== "select" && (
                    <button
                        onClick={reset}
                        className="px-3 py-2 text-[13px] text-white/25 hover:text-white/45 transition-colors cursor-pointer"
                    >
                        \u2190 Try another word
                    </button>
                )}
            </div>

            {/* Summary insight at resolved stage */}
            {stage === "resolved" && (
                <motion.p
                    className="text-center text-[13px] text-white/30 mt-4 max-w-md mx-auto leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    Attention gathers context. But only the FFN can <em>process</em> it into understanding.
                </motion.p>
            )}
        </div>
    );
}

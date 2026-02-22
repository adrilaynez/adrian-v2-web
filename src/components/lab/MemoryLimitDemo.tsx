"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock } from "lucide-react";
import { useI18n } from "@/i18n/context";

const SENTENCE = "the cat sat on the mat";
const PIVOT = 8; // predicting SENTENCE[PIVOT] = 's' in "sat"
const CONTEXT_OPTIONS = [1, 2, 3, 5] as const;
type CtxSize = (typeof CONTEXT_OPTIONS)[number];

// Bigram predictions after " " (space) — deliberately generic
const PREDICTIONS: { char: string; prob: number }[] = [
    { char: "t", prob: 0.18 },
    { char: "a", prob: 0.14 },
    { char: "s", prob: 0.10 },
    { char: "i", prob: 0.09 },
];
const TARGET = SENTENCE[PIVOT]; // "s"

export function MemoryLimitDemo() {
    const { t } = useI18n();
    const [ctxIdx, setCtxIdx] = useState(0);
    const ctxSize: CtxSize = CONTEXT_OPTIONS[ctxIdx];
    const isLocked = ctxIdx > 0;
    const contextStart = PIVOT - ctxSize;
    const chars = Array.from(SENTENCE);

    return (
        <div className="space-y-6 py-2">

            {/* Sentence with highlighted context window */}
            <div className="flex flex-wrap gap-1 justify-center items-center">
                {chars.map((ch, i) => {
                    const inContext = i >= contextStart && i < PIVOT;
                    const isTarget = i === PIVOT;
                    const isDimmed = i < contextStart || i > PIVOT;
                    return (
                        <motion.div
                            key={i}
                            layout
                            animate={{
                                opacity: isDimmed ? 0.22 : 1,
                                scale: isTarget ? 1.05 : 1,
                            }}
                            transition={{ type: "spring", stiffness: 350, damping: 28 }}
                            className={[
                                "flex items-center justify-center rounded text-sm font-mono font-medium",
                                ch === " " && !isTarget ? "w-2 h-8" : "w-7 h-8",
                                inContext ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300" : "",
                                isTarget ? "bg-white/10 border border-white/20 text-white/40 w-7 h-9" : "",
                                isDimmed && !inContext ? "text-white/25" : "",
                            ].join(" ")}
                        >
                            {isTarget ? "?" : (ch === " " ? (inContext ? "·" : "") : ch)}
                        </motion.div>
                    );
                })}
            </div>

            {/* Context label */}
            <p className="text-center text-[11px] font-mono text-white/25">
                {isLocked
                    ? <>{t("bigramWidgets.memoryLimit.context")} <span className="text-emerald-400">{ctxSize} {t("bigramWidgets.memoryLimit.chars")}</span> — {t("bigramWidgets.memoryLimit.locked")}</>
                    : <>{t("bigramWidgets.memoryLimit.modelSees")} <span className="text-emerald-300 font-semibold">"{SENTENCE[PIVOT - 1]}"</span> · {t("bigramWidgets.memoryLimit.guessingNext")}</>}
            </p>

            {/* Prediction / locked area */}
            <AnimatePresence mode="wait">
                {isLocked ? (
                    <motion.div
                        key="locked"
                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="flex flex-col items-center gap-2.5 py-7 rounded-xl border border-white/[0.06] bg-white/[0.02]"
                    >
                        <Lock className="w-4 h-4 text-white/20" />
                        <p className="text-xs font-mono text-white/25">
                            {t("bigramWidgets.memoryLimit.lockedNote").replace("{size}", ctxSize.toString())}
                        </p>
                        <a href="/lab/ngram" className="text-[11px] font-semibold text-emerald-400/60 hover:text-emerald-400 transition-colors">
                            {t("bigramWidgets.memoryLimit.ngramLink")}
                        </a>
                    </motion.div>
                ) : (
                    <motion.div
                        key="preds"
                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="space-y-2.5 px-1"
                    >
                        <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/20 mb-3">
                            {t("bigramWidgets.memoryLimit.topPredictions")}
                        </p>
                        {PREDICTIONS.map(({ char, prob }, i) => (
                            <div key={char} className="flex items-center gap-3">
                                <span className="w-5 text-center font-mono text-sm font-semibold text-white/60">
                                    {char === " " ? "·" : char}
                                </span>
                                <div className="flex-1 h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${prob * 100}%` }}
                                        transition={{ delay: i * 0.07, duration: 0.5, ease: "easeOut" }}
                                        className={`h-full rounded-full ${char === TARGET ? "bg-emerald-400" : "bg-white/20"}`}
                                    />
                                </div>
                                <span className="w-8 text-right font-mono text-[11px] text-white/35">
                                    {Math.round(prob * 100)}%
                                </span>
                            </div>
                        ))}
                        <p className="text-[10px] font-mono text-white/20 pt-1">
                            {t("bigramWidgets.memoryLimit.correctAnswer")
                                .replace("{target}", TARGET)
                                .replace("{rank}", (PREDICTIONS.findIndex(p => p.char === TARGET) + 1).toString())}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Context size tabs */}
            <div className="flex gap-2 justify-center">
                {CONTEXT_OPTIONS.map((size, idx) => (
                    <button
                        key={size}
                        onClick={() => setCtxIdx(idx)}
                        className={[
                            "flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all",
                            ctxIdx === idx
                                ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                                : "bg-white/[0.03] border border-white/[0.06] text-white/30 hover:text-white/50",
                        ].join(" ")}
                    >
                        {idx > 0 && <Lock className="w-2.5 h-2.5 shrink-0" />}
                        {size}
                    </button>
                ))}
            </div>
        </div>
    );
}

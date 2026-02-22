"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { useI18n } from "@/i18n/context";

type Round = {
    context: string;
    answer: string;
    display: string; // what to show the user (context + __)
    options: string[];
    explanation: string;
};

const ROUNDS: Round[] = [
    {
        context: "th",
        answer: "e",
        display: "t h __",
        options: ["e", "a", "x", "z"],
        explanation: "'the' is the most common word in English. After 'th', 'e' follows ~49% of the time.",
    },
    {
        context: "q",
        answer: "u",
        display: "q __",
        options: ["u", "i", "a", "e"],
        explanation: "In English, 'q' is followed by 'u' about 92% of the time. It's one of the strongest bigram rules.",
    },
    {
        context: "i",
        answer: "n",
        display: "i __",
        options: ["n", "f", "p", "b"],
        explanation: "'in' is extremely common. After 'i', 'n' follows ~36% of the time — think 'in', 'is', 'it'.",
    },
    {
        context: " ",
        answer: "t",
        display: "__ t",
        options: ["t", "q", "z", "x"],
        explanation: "After a space, 't' is the most likely character — 'the', 'to', 'that', 'this' all start with it.",
    },
    {
        context: "e",
        answer: " ",
        display: "e __",
        options: [" ", "x", "q", "z"],
        explanation: "After 'e', a space is the most likely next character — words ending in 'e' are very common.",
    },
];

export function PredictionChallenge() {
    const { t } = useI18n();
    const [roundIdx, setRoundIdx] = useState(0);
    const [chosen, setChosen] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [done, setDone] = useState(false);

    const round = ROUNDS[roundIdx];
    const isCorrect = chosen === round.answer;

    const handleChoice = (opt: string) => {
        if (chosen) return;
        setChosen(opt);
        if (opt === round.answer) setScore((s) => s + 1);
    };

    const handleNext = () => {
        if (roundIdx < ROUNDS.length - 1) {
            setRoundIdx((i) => i + 1);
            setChosen(null);
        } else {
            setDone(true);
        }
    };

    const handleRestart = () => {
        setRoundIdx(0);
        setChosen(null);
        setScore(0);
        setDone(false);
    };

    if (done) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
            >
                <div className="text-5xl font-bold text-white mb-2">
                    {score}/{ROUNDS.length}
                </div>
                <p className="text-white/40 text-sm mb-6">
                    {score === ROUNDS.length
                        ? t("bigramNarrative.predictionChallenge.perfect")
                        : score >= 3
                        ? t("bigramNarrative.predictionChallenge.good")
                        : t("bigramNarrative.predictionChallenge.tryAgain")}
                </p>
                <button
                    onClick={handleRestart}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-sm font-semibold hover:bg-emerald-500/20 transition-colors"
                >
                    <RefreshCw className="w-3.5 h-3.5" />
                    {t("bigramNarrative.predictionChallenge.restart")}
                </button>
            </motion.div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Progress */}
            <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                    {ROUNDS.map((_, i) => (
                        <div
                            key={i}
                            className={`w-8 h-1.5 rounded-full transition-colors ${
                                i < roundIdx
                                    ? "bg-emerald-500"
                                    : i === roundIdx
                                    ? "bg-emerald-500/50"
                                    : "bg-white/[0.08]"
                            }`}
                        />
                    ))}
                </div>
                <span className="text-xs font-mono text-white/30">
                    {t("bigramNarrative.predictionChallenge.score")}: {score}/{ROUNDS.length}
                </span>
            </div>

            {/* Question */}
            <div className="text-center py-4">
                <p className="text-xs font-mono uppercase tracking-widest text-white/25 mb-4">
                    {t("bigramNarrative.predictionChallenge.prompt")}
                </p>
                <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl border border-white/[0.08] bg-white/[0.03]">
                    {round.display.split(" ").map((token, i) => (
                        <span
                            key={i}
                            className={`text-3xl font-mono font-bold ${
                                token === "__"
                                    ? "w-10 h-10 rounded-lg border-2 border-dashed border-emerald-500/50 flex items-center justify-center text-emerald-500/50"
                                    : "text-white"
                            }`}
                        >
                            {token}
                        </span>
                    ))}
                </div>
            </div>

            {/* Options */}
            <div className="grid grid-cols-4 gap-2">
                {round.options.map((opt) => {
                    const isChosen = chosen === opt;
                    const correct = opt === round.answer;
                    let cls = "border-white/[0.08] bg-white/[0.03] text-white/60 hover:bg-white/[0.08] hover:text-white hover:border-white/20";
                    if (chosen) {
                        if (correct) cls = "border-emerald-500/60 bg-emerald-500/15 text-emerald-400";
                        else if (isChosen) cls = "border-rose-500/60 bg-rose-500/10 text-rose-400";
                        else cls = "border-white/[0.04] bg-white/[0.02] text-white/20";
                    }
                    return (
                        <button
                            key={opt}
                            onClick={() => handleChoice(opt)}
                            disabled={!!chosen}
                            className={`py-3 rounded-xl border font-mono text-xl font-bold transition-all duration-200 ${cls}`}
                        >
                            {opt === " " ? "·" : opt}
                        </button>
                    );
                })}
            </div>

            {/* Feedback */}
            <AnimatePresence>
                {chosen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`rounded-xl border px-5 py-4 flex gap-3 ${
                            isCorrect
                                ? "border-emerald-500/25 bg-emerald-500/[0.06]"
                                : "border-rose-500/20 bg-rose-500/[0.04]"
                        }`}
                    >
                        {isCorrect ? (
                            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        )}
                        <div className="min-w-0">
                            <p className={`text-xs font-bold mb-1 ${isCorrect ? "text-emerald-400" : "text-rose-400"}`}>
                                {isCorrect
                                    ? t("bigramNarrative.predictionChallenge.correct")
                                    : t("bigramNarrative.predictionChallenge.wrong").replace("{answer}", round.answer === " " ? "·" : round.answer)}
                            </p>
                            <p className="text-xs text-white/45 leading-relaxed">{round.explanation}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Next button */}
            {chosen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-end"
                >
                    <button
                        onClick={handleNext}
                        className="px-5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-sm font-semibold hover:bg-emerald-500/20 transition-colors"
                    >
                        {roundIdx < ROUNDS.length - 1
                            ? t("bigramNarrative.predictionChallenge.next")
                            : t("bigramNarrative.predictionChallenge.finish")}
                    </button>
                </motion.div>
            )}
        </div>
    );
}

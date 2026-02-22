"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw } from "lucide-react";
import { useI18n } from "@/i18n/context";

interface CountData {
    char: string;
    count: number;
}

export function NormalizationVisualizer() {
    const { t } = useI18n();
    const [step, setStep] = useState<0 | 1 | 2>(0); // 0=counts, 1=dividing, 2=probabilities

    // Example: After 't', what comes next?
    const exampleChar = "t";
    const counts: CountData[] = [
        { char: "h", count: 520 },
        { char: "e", count: 190 },
        { char: "i", count: 100 },
        { char: " ", count: 95 },
        { char: "o", count: 85 },
    ];

    const total = counts.reduce((sum, c) => sum + c.count, 0);
    const probabilities = counts.map((c) => ({
        char: c.char,
        probability: (c.count / total) * 100,
    }));

    const handleNextStep = () => {
        if (step < 2) {
            setStep((step + 1) as 0 | 1 | 2);
        }
    };

    const handleReset = () => {
        setStep(0);
    };

    return (
        <div className="space-y-6">
            {/* Header with context */}
            <div className="text-center space-y-2">
                <p className="text-sm text-white/40">
                    {t("bigramNarrative.normalizationViz.context")}
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <span className="text-white/50 text-sm">After</span>
                    <code className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                        {exampleChar}
                    </code>
                    <span className="text-white/50 text-sm">→ what comes next?</span>
                </div>
            </div>

            {/* Visualization area */}
            <div className="relative rounded-xl border border-white/[0.08] bg-gradient-to-br from-white/[0.02] to-black/60 p-6 min-h-[320px]">
                {/* Step indicator */}
                <div className="flex items-center justify-center gap-2 mb-6">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className={`h-1.5 w-12 rounded-full transition-all ${step >= i ? "bg-emerald-400" : "bg-white/10"
                                }`}
                        />
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {/* Step 0: Raw counts */}
                    {step === 0 && (
                        <motion.div
                            key="counts"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            <h3 className="text-center text-sm font-semibold text-emerald-400 mb-4">
                                {t("bigramNarrative.normalizationViz.step1Title")}
                            </h3>
                            <p className="text-xs text-white/40 text-center mb-4">
                                How many times each character appeared after 't' in the training text
                            </p>

                            {/* Column Headers */}
                            <div className="flex items-center gap-4 px-1 mb-2">
                                <div className="w-8 text-[10px] text-white/30 font-mono uppercase tracking-wider">
                                    Char
                                </div>
                                <div className="flex-1 text-[10px] text-white/30 font-mono uppercase tracking-wider text-center">
                                    Frequency (visual)
                                </div>
                                <div className="w-12 text-[10px] text-white/30 font-mono uppercase tracking-wider text-right">
                                    Count
                                </div>
                            </div>

                            <div className="space-y-2">
                                {counts.map((item) => (
                                    <motion.div
                                        key={item.char}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex items-center gap-4"
                                    >
                                        <code className="w-8 h-8 flex items-center justify-center rounded bg-white/5 border border-white/10 text-white font-mono text-sm">
                                            {item.char === " " ? "·" : item.char}
                                        </code>
                                        <div className="flex-1 flex items-center gap-3">
                                            <div className="relative h-8 bg-white/5 rounded flex-1 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(item.count / 520) * 100}%` }}
                                                    transition={{ duration: 0.6, delay: 0.1 }}
                                                    className="h-full bg-gradient-to-r from-white/20 to-white/10"
                                                />
                                            </div>
                                            <span className="text-white/40 font-mono text-sm w-12 text-right">
                                                {item.count}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                                <span className="text-sm text-white/40">Total transitions from 't':</span>
                                <span className="text-white font-mono font-bold">{total}</span>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 1: Division in progress */}
                    {step === 1 && (
                        <motion.div
                            key="dividing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4"
                        >
                            <h3 className="text-center text-sm font-semibold text-emerald-400 mb-4">
                                {t("bigramNarrative.normalizationViz.step2Title")}
                            </h3>
                            <div className="flex items-center justify-center">
                                <motion.div
                                    initial={{ scale: 0.9 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.4 }}
                                    className="text-center space-y-3 p-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5"
                                >
                                    <div className="text-lg text-white/70">
                                        <span className="font-mono font-bold text-emerald-300">count(t→h)</span>
                                        <span className="mx-2">/</span>
                                        <span className="font-mono font-bold text-teal-300">total</span>
                                    </div>
                                    <div className="text-2xl font-mono font-bold text-white">
                                        520 / {total}
                                    </div>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.6 }}
                                        className="text-3xl text-emerald-400"
                                    >
                                        = {((520 / total) * 100).toFixed(1)}%
                                    </motion.div>
                                </motion.div>
                            </div>
                            <p className="text-center text-xs text-white/30 italic">
                                {t("bigramNarrative.normalizationViz.step2Desc")}
                            </p>
                        </motion.div>
                    )}

                    {/* Step 2: Probabilities */}
                    {step === 2 && (
                        <motion.div
                            key="probabilities"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            <h3 className="text-center text-sm font-semibold text-emerald-400 mb-4">
                                {t("bigramNarrative.normalizationViz.step3Title")}
                            </h3>
                            <p className="text-xs text-white/40 text-center mb-4">
                                Each count divided by total (990) gives us the probability percentage
                            </p>

                            {/* Column Headers */}
                            <div className="flex items-center gap-4 px-1 mb-2">
                                <div className="w-8 text-[10px] text-white/30 font-mono uppercase tracking-wider">
                                    Char
                                </div>
                                <div className="flex-1 text-[10px] text-white/30 font-mono uppercase tracking-wider text-center">
                                    Probability (visual)
                                </div>
                                <div className="w-16 text-[10px] text-white/30 font-mono uppercase tracking-wider text-right">
                                    %
                                </div>
                            </div>

                            <div className="space-y-2">
                                {probabilities.map((item, idx) => (
                                    <motion.div
                                        key={item.char}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="flex items-center gap-4"
                                    >
                                        <code className="w-8 h-8 flex items-center justify-center rounded bg-white/5 border border-white/10 text-white font-mono text-sm">
                                            {item.char === " " ? "·" : item.char}
                                        </code>
                                        <div className="flex-1 flex items-center gap-3">
                                            <div className="relative h-8 bg-white/5 rounded flex-1 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${item.probability}%` }}
                                                    transition={{ duration: 0.6, delay: 0.1 }}
                                                    className="h-full bg-gradient-to-r from-emerald-500/40 to-emerald-500/20"
                                                />
                                            </div>
                                            <span className="text-emerald-400 font-mono text-sm font-bold w-16 text-right">
                                                {item.probability.toFixed(1)}%
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                                <span className="text-sm text-white/40">Sum of probabilities:</span>
                                <span className="text-emerald-400 font-mono font-bold">100%</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNextStep}
                    disabled={step === 2}
                    className="group relative rounded-xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-emerald-500/40 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/[0.06] to-teal-500/[0.06] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    <div className="relative flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        Next Step
                    </div>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleReset}
                    disabled={step === 0}
                    className="group relative rounded-xl border border-white/10 bg-white/[0.02] px-6 py-3 text-sm font-semibold text-white/70 transition-colors hover:border-white/20 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/[0.04] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    <div className="relative flex items-center gap-2">
                        <RotateCcw className="w-4 h-4" />
                        {t("bigramNarrative.normalizationViz.reset")}
                    </div>
                </motion.button>
            </div>
        </div>
    );
}

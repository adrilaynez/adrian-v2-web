"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Zap, Cpu, Info } from "lucide-react";
import type { Prediction } from "@/types/lmLab";
import { useI18n } from "@/i18n/context";

interface InferenceConsoleProps {
    onAnalyze: (text: string, topK: number) => void;
    predictions: Prediction[] | null;
    inferenceMs?: number;
    device?: string;
    loading: boolean;
    error: string | null;
}

export function InferenceConsole({
    onAnalyze,
    predictions,
    inferenceMs,
    device,
    loading,
    error,
}: InferenceConsoleProps) {
    const { t } = useI18n();
    const [text, setText] = useState("hello");
    const [topK, setTopK] = useState(5);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim()) onAnalyze(text.trim(), topK);
    };

    return (
        <Card className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
                {/* Educational Tooltip */}
                <div className="group relative ml-1">
                    <div className="flex items-center justify-center w-4 h-4 rounded-full bg-white/5 border border-white/10 cursor-help hover:bg-white/10 transition-colors">
                        <span className="text-[10px] font-bold text-white/40 group-hover:text-white/60">?</span>
                    </div>
                    <div className="absolute left-0 bottom-full mb-3 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-white/10 p-4 rounded-2xl z-50 w-72 text-[11px] text-slate-400 pointer-events-none shadow-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <p className="font-bold text-white mb-2 uppercase tracking-widest text-[10px]">{t("models.ngram.sections.inference.title")}</p>
                        <div className="space-y-2">
                            <p>{t("models.ngram.educationalOverlay.probabilityDistributionDescription")}</p>
                            <p><strong className="text-violet-400">Top-K:</strong> {t("models.ngram.sections.inference.distribution.desc")}</p>
                        </div>
                    </div>
                </div>

                {device && (
                    <Badge className="ml-auto bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] font-mono">
                        <Cpu className="h-3 w-3 mr-1" />
                        {device}
                    </Badge>
                )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div className="space-y-2">
                    <label className="text-[11px] font-mono uppercase tracking-widest text-white/40">
                        {t("models.ngram.sections.inference.distribution.title")}
                    </label>
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={t("models.ngram.sections.inference.placeholder")}
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/20 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/30 transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between">
                        <label className="text-[11px] font-mono uppercase tracking-widest text-white/40">
                            {t("models.ngram.sections.inference.distribution.desc")}
                        </label>
                        <span className="text-xs font-mono text-emerald-400">{topK}</span>
                    </div>
                    <input
                        type="range"
                        min={1}
                        max={26}
                        value={topK}
                        onChange={(e) => setTopK(Number(e.target.value))}
                        className="w-full accent-emerald-500 h-1"
                    />
                </div>

                <Button
                    type="submit"
                    disabled={loading || !text.trim()}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs uppercase tracking-widest h-10 transition-all disabled:opacity-40"
                >
                    {loading ? (
                        <motion.span
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            {t("common.loading")}
                        </motion.span>
                    ) : (
                        <>
                            <Zap className="h-3.5 w-3.5 mr-2" /> {t("models.ngram.sections.inference.title")}
                        </>
                    )}
                </Button>
            </form>

            {/* Error Message */}
            {error && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    {error}
                </div>
            )}

            {/* Results Section */}
            {predictions && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 pt-6 border-t border-white/5 space-y-4"
                >
                    <div className="flex items-center justify-between text-[10px] font-mono text-white/30 uppercase tracking-widest">
                        <span>{t("models.bigram.inference.lastChar")} &quot;{text.slice(-1)}&quot;</span>
                        <div className="flex items-center gap-2">
                            {device && <span>{device}</span>}
                            {inferenceMs && <span className="text-emerald-400">{inferenceMs.toFixed(2)}ms</span>}
                        </div>
                    </div>
                </motion.div>
            )}

            {loading && (
                <div className="space-y-2">
                    {Array.from({ length: topK }).map((_, i) => (
                        <Skeleton key={i} className="h-8 bg-white/[0.04] rounded-lg" />
                    ))}
                </div>
            )}

            <AnimatePresence mode="wait">
                {predictions && !loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-1.5"
                    >
                        {predictions.map((p, i) => (
                            <motion.div
                                key={p.token}
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.04 }}
                                className="flex items-center gap-3 group"
                            >
                                <span className="w-8 h-8 flex items-center justify-center rounded-md bg-white/[0.06] border border-white/[0.08] text-sm font-mono text-white group-hover:border-emerald-500/40 transition-colors">
                                    {p.token === " " ? "␣" : p.token}
                                </span>
                                <div className="flex-1 h-6 bg-white/[0.03] rounded-full overflow-hidden relative">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(p.probability * 100).toFixed(1)}%` }}
                                        transition={{ duration: 0.6, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-600/60 to-emerald-400/40 rounded-full"
                                    />
                                    <span className="absolute inset-0 flex items-center pl-3 text-[10px] font-mono text-white/60">
                                        {(p.probability * 100).toFixed(1)}%
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                        {inferenceMs !== undefined && (
                            <div className="text-right pt-1">
                                <span className="text-[10px] font-mono text-white/30">
                                    {inferenceMs.toFixed(2)}ms
                                </span>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    );
}

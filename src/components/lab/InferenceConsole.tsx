"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Terminal, Zap, Cpu, AlertCircle } from "lucide-react";
import type { Prediction } from "@/types/lmLab";

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
    const [text, setText] = useState("hello");
    const [topK, setTopK] = useState(5);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim()) onAnalyze(text.trim(), topK);
    };

    return (
        <Card className="bg-black/40 border-white/[0.06] backdrop-blur-sm">
            {/* Header */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                <Terminal className="h-4 w-4 text-emerald-400" />
                <span className="font-mono text-xs uppercase tracking-widest text-white/60">
                    Inference Console
                </span>

                {/* Educational Tooltip */}
                <div className="group relative ml-1">
                    <div className="flex items-center justify-center w-4 h-4 rounded-full bg-white/5 border border-white/10 cursor-help hover:bg-white/10 transition-colors">
                        <span className="text-[10px] font-bold text-white/40 group-hover:text-white/60">?</span>
                    </div>
                    <div className="absolute left-0 bottom-full mb-3 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-white/10 p-4 rounded-2xl z-50 w-72 text-[11px] text-slate-400 pointer-events-none shadow-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <p className="font-bold text-white mb-2 uppercase tracking-widest text-[10px]">What is Inference?</p>
                        <div className="space-y-2">
                            <p><strong className="text-emerald-400">The Process:</strong> The model takes your text, looks at the <strong className="text-white">last character</strong>, and looks up the probabilities for what comes next in its brain (the Matrix).</p>
                            <p><strong className="text-violet-400">Top-K:</strong> We only show the top winners. If K=5, you see the 5 most likely candidates.</p>
                            <div className="mt-3 pt-3 border-t border-white/5 text-[10px] italic">
                                Note: This model is "deterministic" in its probabilities but "stochastic" (random) when it actually picks a character to generate text.
                            </div>
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
                        Input Text
                    </label>
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type text to analyze..."
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/20 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/30 transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between">
                        <label className="text-[11px] font-mono uppercase tracking-widest text-white/40">
                            Top-K Predictions
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
                            Analyzing...
                        </motion.span>
                    ) : (
                        <>
                            <Zap className="h-3.5 w-3.5 mr-2" /> Analyze
                        </>
                    )}
                </Button>
            </form>

            {/* Results */}
            <div className="px-5 pb-5 space-y-3">
                {error && (
                    <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 rounded-lg px-3 py-2 border border-red-500/20">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        {error}
                    </div>
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
            </div>
        </Card>
    );
}

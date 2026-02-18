"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, Copy, Check, AlertCircle } from "lucide-react";

interface GenerationPlaygroundProps {
    onGenerate: (
        startChar: string,
        numTokens: number,
        temperature: number
    ) => void;
    generatedText: string | null;
    loading: boolean;
    error: string | null;
}

export function GenerationPlayground({
    onGenerate,
    generatedText,
    loading,
    error,
}: GenerationPlaygroundProps) {
    const [startChar, setStartChar] = useState("a");
    const [numTokens, setNumTokens] = useState(50);
    const [temperature, setTemperature] = useState(0.8);
    const [copied, setCopied] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (startChar) onGenerate(startChar, numTokens, temperature);
    };

    const handleCopy = async () => {
        if (!generatedText) return;
        await navigator.clipboard.writeText(generatedText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Card className="bg-black/40 border-white/[0.06] backdrop-blur-sm overflow-hidden" id="playground">
            {/* Header */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                <Sparkles className="h-4 w-4 text-pink-400" />
                <span className="font-mono text-xs uppercase tracking-widest text-white/60">
                    Generation Playground
                </span>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
                {/* Start Char */}
                <div className="space-y-2">
                    <label className="text-[11px] font-mono uppercase tracking-widest text-white/40">
                        Start Character
                    </label>
                    <input
                        type="text"
                        value={startChar}
                        onChange={(e) => setStartChar(e.target.value.slice(0, 1))}
                        maxLength={1}
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/20 font-mono focus:outline-none focus:ring-1 focus:ring-pink-500/50 transition-all"
                    />
                </div>

                {/* Num Tokens */}
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <label className="text-[11px] font-mono uppercase tracking-widest text-white/40">
                            Number of Tokens
                        </label>
                        <span className="text-xs font-mono text-pink-400">
                            {numTokens}
                        </span>
                    </div>
                    <input
                        type="range"
                        min={10}
                        max={200}
                        value={numTokens}
                        onChange={(e) => setNumTokens(Number(e.target.value))}
                        className="w-full accent-pink-500 h-1"
                    />
                </div>

                {/* Temperature */}
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <label className="text-[11px] font-mono uppercase tracking-widest text-white/40">
                            Temperature
                        </label>
                        <span className="text-xs font-mono text-pink-400">
                            {temperature.toFixed(2)}
                        </span>
                    </div>
                    <input
                        type="range"
                        min={0.1}
                        max={2.0}
                        step={0.05}
                        value={temperature}
                        onChange={(e) => setTemperature(Number(e.target.value))}
                        className="w-full accent-pink-500 h-1"
                    />
                </div>

                <Button
                    type="submit"
                    disabled={loading || !startChar}
                    className="w-full bg-pink-600 hover:bg-pink-500 text-white font-mono text-xs uppercase tracking-widest h-10 transition-all disabled:opacity-40"
                >
                    {loading ? (
                        <motion.span
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            Generating...
                        </motion.span>
                    ) : (
                        <>
                            <Sparkles className="h-3.5 w-3.5 mr-2" /> Generate
                        </>
                    )}
                </Button>
            </form>

            {/* Output */}
            <div className="px-5 pb-5 space-y-3">
                {error && (
                    <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 rounded-lg px-3 py-2 border border-red-500/20">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        {error}
                    </div>
                )}

                {loading && <Skeleton className="h-24 bg-white/[0.04] rounded-lg" />}

                {generatedText && !loading && (
                    <div className="relative group">
                        <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-4 font-mono text-sm text-white/80 leading-relaxed whitespace-pre-wrap break-all">
                            {generatedText}
                        </div>
                        <button
                            onClick={handleCopy}
                            className="absolute top-2 right-2 p-2 rounded-md bg-white/[0.04] border border-white/[0.08] text-white/40 hover:text-white/80 hover:bg-white/[0.08] transition-all opacity-0 group-hover:opacity-100"
                            aria-label="Copy to clipboard"
                        >
                            {copied ? (
                                <Check className="h-3.5 w-3.5 text-emerald-400" />
                            ) : (
                                <Copy className="h-3.5 w-3.5" />
                            )}
                        </button>
                    </div>
                )}
            </div>
        </Card>
    );
}

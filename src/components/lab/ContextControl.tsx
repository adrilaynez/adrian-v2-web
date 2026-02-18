"use client";

import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Layers } from "lucide-react";

interface ContextControlProps {
    value: number;
    onChange: (value: number) => void;
    disabled?: boolean;
}

export function ContextControl({ value, onChange, disabled }: ContextControlProps) {
    return (
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                        <Layers className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-sm">Context Size (N)</h3>
                        <p className="text-white/40 text-xs mt-0.5">
                            Number of previous characters to condition on
                        </p>
                    </div>
                </div>
                <Badge variant="outline" className="text-indigo-300 border-indigo-500/30 bg-indigo-500/10 font-mono text-lg px-3 py-1">
                    N = {value}
                </Badge>
            </div>

            <div className="px-2">
                <Slider
                    value={[value]}
                    min={1}
                    max={5}
                    step={1}
                    onValueChange={(vals: number[]) => onChange(vals[0])}
                    disabled={disabled}
                    className="cursor-pointer"
                />
            </div>

            <div className="flex justify-between mt-4 text-[10px] font-mono uppercase tracking-widest text-white/30">
                <span>Bigram (1)</span>
                <span>Trigram (2)</span>
                <span>4-Gram</span>
                <span>5-Gram</span>
                <span className="text-red-400/50">Explosion (5+)</span>
            </div>
        </div>
    );
}

"use client";

import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Layers } from "lucide-react";
import { useI18n } from "@/i18n/context";
import { useLabMode } from "@/context/LabModeContext";

const NGRAM_NAMES: Record<number, string> = {
    1: "Bigram",
    2: "Trigram",
    3: "4-gram",
    4: "5-gram",
    5: "5-gram",
};

interface ContextControlProps {
    value: number;
    onChange: (value: number) => void;
    disabled?: boolean;
}

export function ContextControl({ value, onChange, disabled }: ContextControlProps) {
    const { t } = useI18n();
    const { mode } = useLabMode();
    const isEdu = mode === "educational";

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`rounded-2xl p-6 md:p-7 border transition-colors ${
                isEdu
                    ? "bg-gradient-to-br from-amber-950/15 via-black/40 to-black/60 border-amber-500/15 shadow-[0_0_25px_-8px_rgba(245,158,11,0.15)]"
                    : "bg-gradient-to-br from-cyan-950/10 via-black/40 to-black/60 border-cyan-500/15 shadow-[0_0_25px_-8px_rgba(6,182,212,0.15)]"
            }`}
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${isEdu ? "bg-amber-500/15" : "bg-cyan-500/15"}`}>
                        <Layers className={`w-5 h-5 ${isEdu ? "text-amber-300" : "text-cyan-300"}`} />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-sm tracking-tight">{t("models.ngram.controls.contextSize")}</h3>
                        <p className="text-white/40 text-xs mt-0.5">
                            Number of previous characters to condition on
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge
                        variant="outline"
                        className={`font-mono text-lg px-3 py-1 ${
                            isEdu
                                ? "text-amber-300 border-amber-500/30 bg-amber-500/10"
                                : "text-cyan-300 border-cyan-500/30 bg-cyan-500/10"
                        }`}
                    >
                        N = {value}
                    </Badge>
                </div>
            </div>

            <div className="px-2 mb-4">
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

            <div className="flex justify-between px-1">
                {[1, 2, 3, 4, 5].map((n) => (
                    <button
                        key={n}
                        onClick={() => onChange(n)}
                        disabled={disabled}
                        className={`text-[10px] font-mono uppercase tracking-widest transition-all px-1 py-0.5 rounded ${
                            n === value
                                ? isEdu
                                    ? "text-amber-300 font-bold"
                                    : "text-cyan-300 font-bold"
                                : n === 5
                                    ? "text-red-400/50 hover:text-red-400/70"
                                    : "text-white/30 hover:text-white/50"
                        }`}
                    >
                        {NGRAM_NAMES[n]}
                    </button>
                ))}
            </div>
        </motion.div>
    );
}

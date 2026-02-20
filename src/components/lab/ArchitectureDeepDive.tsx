"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
    Cpu,
    Zap,
    AlertTriangle,
    CheckCircle2,
    Layers,
    Type
} from "lucide-react";
import type { ArchitectureViz } from "@/types/lmLab";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { useI18n } from "@/i18n/context";

interface ArchitectureDeepDiveProps {
    data: ArchitectureViz | null;
}

export function ArchitectureDeepDive({ data }: ArchitectureDeepDiveProps) {
    const { t } = useI18n();
    if (!data) return null;

    const stepsList = [
        { id: "matrixW", key: "models.bigram.architecture.stepsList.matrixW" },
        { id: "softmax", key: "models.bigram.architecture.stepsList.softmax" },
        { id: "loss", key: "models.bigram.architecture.stepsList.loss" }
    ];

    // Helper to detect and render LaTeX or plain text
    const renderStep = (stepId: string, label: string) => {
        if (stepId === "matrixW") {
            return (
                <div className="space-y-4">
                    <div className="flex items-start justify-between group/tip">
                        {/* We use a hardcoded structure here to match the specific 'matrix W' visualization logic but with translated label */}
                        <p className="text-white/70">{label}</p>

                        <div className="group relative ml-2 mt-1">
                            <div className="flex items-center justify-center w-4 h-4 rounded-full bg-white/5 border border-white/10 cursor-help hover:bg-white/10 transition-colors">
                                <span className="text-[10px] font-bold text-white/40 group-hover:text-white/60">?</span>
                            </div>
                            <div className="absolute right-0 bottom-full mb-3 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-white/10 p-4 rounded-2xl z-50 w-72 text-[11px] text-slate-400 pointer-events-none shadow-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <p className="font-bold text-white mb-2 uppercase tracking-widest text-[10px]">What is Matrix W?</p>
                                <p>It's essentially a lookup table of <strong className="text-white">9216 numbers</strong> (96x96 characters in the vocab). Each number represents the "unnormalized score" of how likely one character follows another.</p>
                            </div>
                        </div>
                    </div>
                    <BlockMath math="W \in \mathbb{R}^{|V| \times |V|}" />
                </div>
            );
        }
        if (stepId === "softmax") {
            return (
                <div className="space-y-4">
                    <div className="flex items-start justify-between group/tip">
                        <p className="text-white/70">{label}</p>

                        <div className="group relative ml-2 mt-1">
                            <div className="flex items-center justify-center w-4 h-4 rounded-full bg-white/5 border border-white/10 cursor-help hover:bg-white/10 transition-colors">
                                <span className="text-[10px] font-bold text-white/40 group-hover:text-white/60">?</span>
                            </div>
                            <div className="absolute right-0 bottom-full mb-3 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-white/10 p-4 rounded-2xl z-50 w-72 text-[11px] text-slate-400 pointer-events-none shadow-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <p className="font-bold text-white mb-2 uppercase tracking-widest text-[10px]">What is Softmax?</p>
                                <p>Softmax takes raw scores (logits) and squashes them into a <strong className="text-emerald-400">probability distribution</strong>. All numbers become positive and add up to 1 (100%).</p>
                                <div className="mt-2 font-mono text-[9px] text-indigo-400/70 italic">
                                    <InlineMath math="\sigma(z)_i = \frac{e^{z_i}}{\sum e^{z_j}}" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <BlockMath math="P(x_{t+1} | x_t) = \text{softmax}(W[idx])" />
                </div>
            );
        }
        if (stepId === "loss") {
            return (
                <div className="space-y-4">
                    <div className="flex items-start justify-between group/tip">
                        <p className="text-white/70">{label}</p>

                        <div className="group relative ml-2 mt-1">
                            <div className="flex items-center justify-center w-4 h-4 rounded-full bg-white/5 border border-white/10 cursor-help hover:bg-white/10 transition-colors">
                                <span className="text-[10px] font-bold text-white/40 group-hover:text-white/60">?</span>
                            </div>
                            <div className="absolute right-0 bottom-full mb-3 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-white/10 p-4 rounded-2xl z-50 w-72 text-[11px] text-slate-400 pointer-events-none shadow-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <p className="font-bold text-white mb-2 uppercase tracking-widest text-[10px]">What is Loss (Cross-Entropy)?</p>
                                <p>Loss measures the <strong className="text-white">distance</strong> between the model's prediction and the truth. If the truth is 'n' and the model gave 'n' a 0.1% chance, the loss will be very high. Training is the process of <strong className="text-indigo-400">tuning weights</strong> to minimize this distance.</p>
                            </div>
                        </div>
                    </div>
                    <BlockMath math="\mathcal{L} = -\sum_{i} y_i \log(\hat{y}_i)" />
                </div>
            );
        }
        return <p className="text-sm text-white/70 leading-relaxed pb-6">{label}</p>;
    };

    const strengths = [
        t("models.bigram.architecture.analysis.strengths.0"),
        t("models.bigram.architecture.analysis.strengths.1"),
        t("models.bigram.architecture.analysis.strengths.2"),
    ];

    const limitations = [
        t("models.bigram.architecture.analysis.limitations.0"),
        t("models.bigram.architecture.analysis.limitations.1"),
        t("models.bigram.architecture.analysis.limitations.2"),
    ];

    return (
        <section className="relative py-20 border-t border-white/[0.04] bg-white/[0.01]">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                        <Cpu className="text-indigo-400" />
                        Technical Specification
                    </h2>
                    <p className="text-white/50 max-w-2xl">
                        Detailed breakdown of the model's internal mechanism, capabilities, and constraints.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

                    {/* Column 1: Mechanism */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <h3 className="text-sm font-mono uppercase tracking-widest text-indigo-400 border-b border-indigo-500/20 pb-2 mb-4">
                            Inference Mechanism
                        </h3>
                        {stepsList.map((step, i) => (
                            <div key={step.id} className="flex gap-4 group">
                                <div className="flex flex-col items-center">
                                    <div className="w-6 h-6 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-[10px] font-mono text-white/60 group-hover:border-indigo-500/50 group-hover:text-indigo-400 transition-colors">
                                        {i + 1}
                                    </div>
                                    {i < stepsList.length - 1 && (
                                        <div className="w-px h-6 bg-white/[0.05] my-2" />
                                    )}
                                </div>
                                <div className="flex-grow pb-6">
                                    {renderStep(step.id, t(step.key))}
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    {/* Column 2: Analysis */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="space-y-8"
                    >
                        {/* Strengths */}
                        <div>
                            <h3 className="text-sm font-mono uppercase tracking-widest text-emerald-400 border-b border-emerald-500/20 pb-2 mb-4">
                                Capabilities
                            </h3>
                            <ul className="space-y-3">
                                {strengths.map((s, i) => (
                                    <li key={i} className="flex gap-3 text-sm text-white/60">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500/50 shrink-0 mt-0.5" />
                                        {s}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Limitations */}
                        <div>
                            <h3 className="text-sm font-mono uppercase tracking-widest text-amber-400 border-b border-amber-500/20 pb-2 mb-4">
                                Constraints
                            </h3>
                            <ul className="space-y-3">
                                {limitations.map((l, i) => (
                                    <li key={i} className="flex gap-3 text-sm text-white/60">
                                        <AlertTriangle className="w-4 h-4 text-amber-500/50 shrink-0 mt-0.5" />
                                        {l}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>

                    {/* Column 3: Model Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 h-fit"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <Layers className="text-white/40" />
                            <h3 className="text-lg font-bold text-white">Model Card</h3>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <div className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Architecture Type</div>
                                <div className="text-white font-mono">{data.type}</div>
                            </div>

                            <div>
                                <div className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Complexity Rating</div>
                                <Badge variant="outline" className="border-white/10 text-white/60">
                                    {data.complexity}
                                </Badge>
                            </div>

                            <div>
                                <div className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Primary Use Cases</div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {data.use_cases.map((u, i) => (
                                        <Badge
                                            key={i}
                                            className="bg-indigo-500/10 text-indigo-300 border-indigo-500/20 hover:bg-indigo-500/20"
                                        >
                                            {u}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/[0.06]">
                                <div className="text-[10px] uppercase tracking-widest text-white/30 mb-2">Description</div>
                                <p className="text-xs text-white/50 leading-relaxed">
                                    {data.description}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}

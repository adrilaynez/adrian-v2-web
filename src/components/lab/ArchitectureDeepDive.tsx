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

interface ArchitectureDeepDiveProps {
    data: ArchitectureViz | null;
}

export function ArchitectureDeepDive({ data }: ArchitectureDeepDiveProps) {
    if (!data) return null;

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
                        {data.how_it_works.map((step, i) => (
                            <div key={i} className="flex gap-4 group">
                                <div className="flex flex-col items-center">
                                    <div className="w-6 h-6 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-[10px] font-mono text-white/60 group-hover:border-indigo-500/50 group-hover:text-indigo-400 transition-colors">
                                        {i + 1}
                                    </div>
                                    {i < data.how_it_works.length - 1 && (
                                        <div className="w-px h-full bg-white/[0.05] my-2" />
                                    )}
                                </div>
                                <p className="text-sm text-white/70 leading-relaxed pb-6">
                                    {step}
                                </p>
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
                                {data.strengths.map((s, i) => (
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
                                {data.limitations.map((l, i) => (
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

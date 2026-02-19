"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Brain, Database, Layers, Zap, HelpCircle, type LucideIcon } from "lucide-react";
import type { TrainingViz } from "@/types/lmLab";

interface StatItem {
    label: string;
    value: string;
    icon: LucideIcon;
    desc: string;
    color?: string; // Tailwind color class, e.g., 'blue', 'emerald', etc.
}

interface ModelHeroProps {
    trainingData?: TrainingViz | null | undefined;
    title?: string;
    description?: string;
    customStats?: StatItem[];
}

export function ModelHero({
    trainingData,
    title = "Bigram Language Model",
    description = "The fundamental building block of sequence modeling. A probabilistic model that predicts the next character based solely on the immediate predecessor.",
    customStats,
}: ModelHeroProps) {
    const stats: StatItem[] = customStats ?? [
        {
            label: "Parameters",
            value: trainingData?.total_parameters?.toLocaleString() ?? "Unknown",
            icon: Layers,
            desc: "Trainable weights",
            color: "indigo"
        },
        {
            label: "Vocabulary",
            value: trainingData?.unique_characters?.toString() ?? "96",
            icon: Brain,
            desc: "Unique characters",
            color: "blue"
        },
        {
            label: "Training Data",
            value: trainingData ? `${(trainingData.train_data_size / 1000).toFixed(1)}k` : "Unknown",
            icon: Database,
            desc: "Total tokens",
            color: "emerald"
        },
        {
            label: "Final Loss",
            value: trainingData?.final_loss?.toFixed(4) ?? "Unknown",
            icon: Zap,
            desc: "Cross-entropy loss",
            color: "amber"
        }
    ];

    const getColorClasses = (color?: string) => {
        switch (color) {
            case "indigo": return "border-indigo-500/20 bg-indigo-500/5 text-indigo-400";
            case "blue": return "border-blue-500/20 bg-blue-500/5 text-blue-400";
            case "emerald": return "border-emerald-500/20 bg-emerald-500/5 text-emerald-400";
            case "amber": return "border-amber-500/20 bg-amber-500/5 text-amber-400";
            case "purple": return "border-purple-500/20 bg-purple-500/5 text-purple-400";
            case "pink": return "border-pink-500/20 bg-pink-500/5 text-pink-400";
            case "cyan": return "border-cyan-500/20 bg-cyan-500/5 text-cyan-400";
            default: return "border-white/10 bg-white/5 text-white/70";
        }
    };

    return (
        <section className="relative pt-10 pb-20 md:pt-20 md:pb-32 overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-30 pointer-events-none">
                <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[128px]" />
                <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px]" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Badge className="mb-6 bg-white/[0.05] hover:bg-white/[0.1] text-white/60 border-white/[0.1] px-4 py-1.5 text-xs font-mono uppercase tracking-widest backdrop-blur-sm">
                        Scientific Instrument v1.0
                    </Badge>

                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
                        {title}
                    </h1>

                    <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed mb-12">
                        {description}
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16">
                    {stats.map((stat, i) => {
                        const colorClass = getColorClasses(stat.color);
                        return (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + i * 0.1 }}
                                className={`p-4 rounded-xl backdrop-blur-sm group relative transition-all duration-300 border ${colorClass.split(' ').filter(c => c.startsWith('border-')).join(' ')} ${colorClass.split(' ').filter(c => c.startsWith('bg-')).join(' ')} hover:bg-white/[0.08]`}
                            >
                                {/* Educational Tooltip */}
                                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 border border-white/10 p-3 rounded-xl z-50 w-48 text-[10px] text-slate-400 pointer-events-none shadow-2xl leading-relaxed text-center">
                                    <p className="font-bold text-white mb-1">{stat.label}</p>
                                    {stat.label === "Parameters" && "They are like the brain's connections. This model is simple, so it doesn't need many."}
                                    {stat.label === "Vocabulary" && "It's the set of letters and symbols the model knows, like its own alphabet."}
                                    {stat.label === "Training Data" && "The amount of text the model read to learn how to write."}
                                    {stat.label === "Final Loss" && "It's the 'error' score. The lower it is, the better the model knows which letter comes next."}
                                </div>

                                <div className="flex items-center justify-center mb-3">
                                    <div className={`p-2 rounded-lg transition-all duration-300 ${colorClass.split(' ').filter(c => c.startsWith('text-')).join(' ')} group-hover:scale-110`}>
                                        <stat.icon className="w-5 h-5" />
                                    </div>
                                </div>
                                <div className="text-2xl font-bold text-white mb-1 font-mono">
                                    {stat.value}
                                </div>
                                <div className="text-xs font-mono uppercase tracking-wider text-white/40 mb-1">
                                    {stat.label}
                                </div>
                                <div className="text-[10px] text-white/30 hidden md:block">
                                    {stat.desc}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-col items-center gap-4"
                >
                    <button
                        onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                        className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-sm font-bold text-emerald-400 uppercase tracking-[0.2em] hover:bg-emerald-500/20 hover:border-emerald-500/40 hover:scale-105 transition-all group shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)]"
                    >
                        <HelpCircle className="w-4 h-4 text-emerald-400 group-hover:rotate-[360deg] transition-transform duration-500" />
                        Need an intuitive explanation?
                    </button>
                    <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.1em]">
                        Understand the core idea before diving into the math and visualizations.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}



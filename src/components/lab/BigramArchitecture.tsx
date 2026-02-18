"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ArrowRight, Braces, Grid3x3, RefreshCw, Shuffle } from "lucide-react";

export function BigramArchitecture() {
    return (
        <div className="relative py-12">
            <h3 className="text-xl font-bold text-white mb-8 border-l-2 border-indigo-500 pl-4">
                Architecture: The Computational Flow
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center justify-center">
                {/* Step 1: Input */}
                <ArchitectureNode
                    label="Input"
                    sublabel="Current Char"
                    icon={Braces}
                    color="text-white"
                    delay={0}
                />

                <FlowArrow delay={0.5} />

                {/* Step 2: Lookup */}
                <ArchitectureNode
                    label="Lookup"
                    sublabel="Select Row"
                    icon={Grid3x3}
                    color="text-emerald-400"
                    delay={1}
                />

                <FlowArrow delay={1.5} />

                {/* Step 3: Distribution */}
                <ArchitectureNode
                    label="Softmax"
                    sublabel="Probabilities"
                    icon={RefreshCw}
                    color="text-violet-400"
                    delay={2}
                />

                <FlowArrow delay={2.5} />

                {/* Step 4: Sampling */}
                <ArchitectureNode
                    label="Sampling"
                    sublabel="Next Char"
                    icon={Shuffle}
                    color="text-amber-400"
                    delay={3}
                />
            </div>

            <div className="mt-8 p-4 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-sm text-sm text-white/60 font-mono leading-relaxed">
                <span className="text-indigo-400 font-bold">P(next | current)</span>:
                The model holds a static {`V \u00D7 V`} matrix. During inference, it simply looks up the row
                corresponding to the input character. That row contains the raw logits (or pre-computed probabilities)
                for every possible next character. We then sample from this distribution to pick the winner.
            </div>
        </div>
    );
}

function ArchitectureNode({ label, sublabel, icon: Icon, color, delay }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5 }}
            className="flex flex-col items-center text-center p-4 rounded-xl bg-white/[0.05] border border-white/10 min-w-[120px]"
        >
            <div className={`mb-3 p-3 rounded-full bg-white/5 ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div className="text-white font-bold text-sm mb-1">{label}</div>
            <div className="text-white/40 text-[10px] uppercase tracking-wider font-mono">
                {sublabel}
            </div>
        </motion.div>
    );
}

function FlowArrow({ delay }: { delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5 }}
            className="hidden md:flex justify-center text-white/20"
        >
            <ArrowRight className="w-6 h-6" />
        </motion.div>
    );
}

"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const STEPS = [
    { context: "h", next: "e", pct: 32, label: "After \u201ch\u201d", n: "N=1" },
    { context: "th", next: "e", pct: 85, label: "After \u201cth\u201d", n: "N=2" },
    { context: "the", next: " ", pct: 91, label: "After \u201cthe\u201d", n: "N=3" },
];

export function ConcreteImprovementExample() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });

    return (
        <div ref={ref} className="p-4 sm:p-6 flex flex-col gap-6">
            <div className="flex flex-col gap-4">
                {STEPS.map((step, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -12 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: i * 0.5, duration: 0.35 }}
                        className="flex flex-col gap-2"
                    >
                        {/* Header row */}
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest w-8">
                                    {step.n}
                                </span>
                                <span className="text-xs text-white/40 font-mono">
                                    {step.label} →{" "}
                                    <span className="text-amber-300 font-bold">
                                        &ldquo;{step.next === " " ? "␣" : step.next}&rdquo;
                                    </span>
                                </span>
                            </div>
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={isInView ? { opacity: 1 } : {}}
                                transition={{ delay: i * 0.5 + 0.4 }}
                                className="font-mono font-black tabular-nums text-sm text-amber-300"
                            >
                                {step.pct}%
                            </motion.span>
                        </div>

                        {/* Bar */}
                        <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={isInView ? { width: `${step.pct}%` } : {}}
                                transition={{ delay: i * 0.5 + 0.15, duration: 0.6, ease: "easeOut" }}
                                className="h-full rounded-full bg-gradient-to-r from-amber-500/70 to-amber-300/80"
                            />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Caption */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 1.8 }}
                className="text-[11px] text-center text-white/25 font-mono uppercase tracking-widest"
            >
                More context = sharper predictions
            </motion.p>
        </div>
    );
}

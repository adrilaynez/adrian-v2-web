"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLabMode } from "@/context/LabModeContext";

interface SectionDividerProps {
    title: string;
    description: string;
    number: string;
    className?: string;
}

export function SectionDivider({ title, description, number, className }: SectionDividerProps) {
    const { mode } = useLabMode();
    const isEdu = mode === "educational";

    return (
        <div className={cn("relative py-16 md:py-24 overflow-hidden", className)}>

            <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                viewport={{ once: true, margin: "-20%" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                    "absolute left-0 top-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent to-transparent origin-left",
                    isEdu ? "via-amber-500/20" : "via-cyan-500/20"
                )}
            />

            <div className="relative flex flex-col items-center text-center max-w-3xl mx-auto px-6">

                <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-20%" }}
                    transition={{ duration: 0.5, ease: "backOut" }}
                    className="mb-5"
                >
                    <span className={cn(
                        "inline-flex items-center justify-center w-11 h-11 rounded-full border text-sm font-mono shadow-lg",
                        isEdu
                            ? "border-amber-500/20 bg-amber-500/[0.07] text-amber-300/70 shadow-[0_0_20px_-5px_rgba(245,158,11,0.25)]"
                            : "border-cyan-500/20 bg-cyan-500/[0.07] text-cyan-300/70 shadow-[0_0_20px_-5px_rgba(6,182,212,0.25)]"
                    )}>
                        {number}
                    </span>
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-20%" }}
                    transition={{ delay: 0.1, duration: 0.55 }}
                    className="text-2xl md:text-4xl font-bold tracking-tight mb-4 bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent"
                >
                    {title}
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-20%" }}
                    transition={{ delay: 0.2, duration: 0.55 }}
                    className="text-base md:text-lg text-white/40 leading-relaxed font-light max-w-2xl"
                >
                    {description}
                </motion.p>
            </div>
        </div>
    );
}

"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionDividerProps {
    title: string;
    description: string;
    number: string;
    className?: string;
}

export function SectionDivider({ title, description, number, className }: SectionDividerProps) {
    return (
        <div className={cn("relative py-12 md:py-20", className)}>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

            <div className="relative flex flex-col items-center text-center max-w-3xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-20%" }}
                    className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full border border-white/10 bg-black/50 backdrop-blur-sm text-lg font-mono text-white/40"
                >
                    {number}
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-20%" }}
                    transition={{ delay: 0.1 }}
                    className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight"
                >
                    {title}
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-20%" }}
                    transition={{ delay: 0.2 }}
                    className="text-base md:text-lg text-white/60 leading-relaxed font-light"
                >
                    {description}
                </motion.p>
            </div>
        </div>
    );
}

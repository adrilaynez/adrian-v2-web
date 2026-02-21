"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const PAIR_COLORS = [
    "bg-emerald-400/20 border-emerald-400/30",
    "bg-teal-400/20 border-teal-400/30",
] as const;

export function PairHighlighter({ text = "hello world" }: { text?: string }) {
    const [hovered, setHovered] = useState<number | null>(null);
    const chars = Array.from(text);

    return (
        <div className="space-y-3 mb-6">
            <div className="flex flex-wrap gap-0.5 font-mono text-lg leading-none">
                {chars.map((ch, i) => {
                    const pairIdx = i < chars.length - 1 ? i : null;
                    const memberOf = i > 0 ? i - 1 : null;
                    const activePair = hovered !== null ? hovered : null;
                    const inPair =
                        pairIdx === activePair || memberOf === activePair;
                    const colorClass =
                        pairIdx !== null
                            ? PAIR_COLORS[pairIdx % 2]
                            : memberOf !== null
                                ? PAIR_COLORS[memberOf % 2]
                                : "";

                    return (
                        <div key={i} className="relative">
                            <motion.span
                                onHoverStart={() =>
                                    setHovered(pairIdx ?? memberOf)
                                }
                                onHoverEnd={() => setHovered(null)}
                                animate={{
                                    opacity: activePair !== null && !inPair ? 0.3 : 1,
                                }}
                                className={[
                                    "inline-flex items-center justify-center w-7 h-8 rounded border text-sm font-semibold cursor-default select-none transition-colors",
                                    inPair
                                        ? colorClass
                                        : "border-transparent text-white/50",
                                    inPair ? "text-white" : "",
                                ].join(" ")}
                            >
                                {ch === " " ? "·" : ch}
                            </motion.span>

                            {/* Tooltip on the first char of each pair */}
                            <AnimatePresence>
                                {hovered === i && pairIdx !== null && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 4 }}
                                        transition={{ duration: 0.12 }}
                                        className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 rounded-md bg-black/80 border border-white/10 text-[10px] font-mono text-white/70 pointer-events-none z-20"
                                    >
                                        {ch === " " ? "·" : ch} → {chars[i + 1] === " " ? "·" : chars[i + 1]}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
            <p className="text-[10px] font-mono text-white/20">
                Hover a character to see its bigram pair
            </p>
        </div>
    );
}

"use client";

import { useMemo } from "react";

import { motion } from "framer-motion";
import { Check, ListChecks, Eye, Shuffle, MapPin, Zap } from "lucide-react";

/*
  WishlistCallbackViz — v2
  Premium architecture wishlist with individual icons per item,
  gradient accents, rich progress tracking, and dramatic solved states.
*/

interface WishlistItem {
    id: number;
    title: string;
    description: string;
    icon: React.ElementType;
    unsolvedColor: { border: string; bg: string; text: string; iconColor: string };
}

const WISHLIST_ITEMS: WishlistItem[] = [
    {
        id: 1,
        title: "Let every word see every other word",
        description: "Break the isolation walls — each word should access all other words in the sequence.",
        icon: Eye,
        unsolvedColor: { border: "border-cyan-500/20", bg: "bg-cyan-500/[0.05]", text: "text-cyan-300/70", iconColor: "text-cyan-400/50" },
    },
    {
        id: 2,
        title: "Decide dynamically which words matter",
        description: "Different contexts need different connections — not a fixed pattern but a learned one.",
        icon: Shuffle,
        unsolvedColor: { border: "border-violet-500/20", bg: "bg-violet-500/[0.05]", text: "text-violet-300/70", iconColor: "text-violet-400/50" },
    },
    {
        id: 3,
        title: "Know the order of words",
        description: '"dog bites man" \u2260 "man bites dog" \u2014 position must carry meaning.',
        icon: MapPin,
        unsolvedColor: { border: "border-amber-500/20", bg: "bg-amber-500/[0.05]", text: "text-amber-300/70", iconColor: "text-amber-400/50" },
    },
    {
        id: 4,
        title: "Do all of this in parallel",
        description: "Process the entire sequence at once \u2014 not one token at a time like RNNs.",
        icon: Zap,
        unsolvedColor: { border: "border-rose-500/20", bg: "bg-rose-500/[0.05]", text: "text-rose-300/70", iconColor: "text-rose-400/50" },
    },
];

const SOLVED_SECTIONS: Record<number, string> = {
    1: "\u00a703",
    2: "\u00a704",
    3: "\u00a706",
    4: "\u00a707",
};

interface WishlistCallbackVizProps {
    solvedItems?: number[];
}

export function WishlistCallbackViz({ solvedItems = [] }: WishlistCallbackVizProps) {
    const solvedSet = useMemo(() => new Set(solvedItems), [solvedItems]);
    const solvedCount = solvedSet.size;
    const total = WISHLIST_ITEMS.length;
    const progress = solvedCount / total;

    return (
        <div className="py-6 sm:py-10">
            <div className="w-full max-w-xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between px-1">
                    <div>
                        <h4 className="text-base sm:text-lg font-bold text-white/80 tracking-tight">Architecture Wishlist</h4>
                        <p className="text-xs text-white/30 mt-0.5">
                            {solvedCount === 0
                                ? "4 problems to solve across this chapter"
                                : solvedCount < total
                                    ? `${solvedCount} of ${total} solved`
                                    : "All solved!"}
                        </p>
                    </div>
                    {/* Circular progress indicator */}
                    <div className="relative w-10 h-10">
                        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                            <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="2" />
                            <motion.circle
                                cx="18" cy="18" r="15"
                                fill="none"
                                stroke="url(#wishlist-gradient)"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeDasharray={`${progress * 94.2} 94.2`}
                                initial={{ strokeDasharray: "0 94.2" }}
                                animate={{ strokeDasharray: `${progress * 94.2} 94.2` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            />
                            <defs>
                                <linearGradient id="wishlist-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#22d3ee" />
                                    <stop offset="100%" stopColor="#34d399" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-[11px] font-mono font-bold text-white/35">
                            {solvedCount}/{total}
                        </span>
                    </div>
                </div>

                {/* Items */}
                <div className="space-y-3">
                    {WISHLIST_ITEMS.map((item, idx) => {
                        const isSolved = solvedSet.has(item.id);
                        const section = SOLVED_SECTIONS[item.id];
                        const Icon = item.icon;

                        return (
                            <motion.div
                                key={item.id}
                                className="flex items-start gap-3.5 py-3 px-3.5 rounded-xl transition-all duration-500"
                                style={{
                                    background: isSolved
                                        ? "rgba(16, 185, 129, 0.03)"
                                        : "rgba(255, 255, 255, 0.015)",
                                }}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.08, duration: 0.4 }}
                            >
                                {/* Icon */}
                                <div className="mt-0.5 shrink-0">
                                    {isSolved ? (
                                        <motion.div
                                            className="flex items-center justify-center w-7 h-7 rounded-lg"
                                            style={{ background: "rgba(16, 185, 129, 0.12)" }}
                                            initial={{ scale: 0, rotate: -90 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                        >
                                            <Check className="w-4 h-4 text-emerald-400/80" />
                                        </motion.div>
                                    ) : (
                                        <div className="flex items-center justify-center w-7 h-7 rounded-lg"
                                            style={{ background: "rgba(255, 255, 255, 0.03)" }}
                                        >
                                            <Icon className={`w-3.5 h-3.5 ${item.unsolvedColor.iconColor}`} />
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start gap-2 flex-wrap">
                                        <span className={`text-[13px] sm:text-sm font-semibold leading-snug ${isSolved ? "text-emerald-300/60 line-through decoration-emerald-400/15" : item.unsolvedColor.text}`}>
                                            {item.title}
                                        </span>
                                        {isSolved && section && (
                                            <span className="shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded text-emerald-400/50"
                                                style={{ background: "rgba(16, 185, 129, 0.08)" }}
                                            >
                                                {section}
                                            </span>
                                        )}
                                    </div>
                                    <p className={`text-xs mt-1 leading-relaxed ${isSolved ? "text-white/15" : "text-white/30"}`}>
                                        {item.description}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Subtle footer hint */}
                <p className="text-[11px] text-white/15 text-center">
                    {solvedCount === 0
                        ? "Each item will check off as you discover the solution in later sections"
                        : solvedCount < total
                            ? `${total - solvedCount} remaining`
                            : "Every problem solved. The transformer architecture is complete."}
                </p>
            </div>
        </div>
    );
}

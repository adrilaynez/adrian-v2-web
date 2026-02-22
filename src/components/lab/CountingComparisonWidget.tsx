"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BIGRAM = [
    { context: "h", next: "e", count: 320, pct: 100 },
    { context: "h", next: "a", count: 150, pct: 47 },
    { context: "h", next: "i", count: 80, pct: 25 },
];

const TRIGRAM = [
    { context: "th", next: "e", count: 280, pct: 100 },
    { context: "th", next: "a", count: 40, pct: 14 },
    { context: "th", next: "i", count: 25, pct: 9 },
];

const TOOLTIPS: Record<string, string> = {
    "h→e": "After 'h', 'e' is the most common next character — but many other letters also follow 'h'.",
    "h→a": "After 'h', 'a' appears in words like 'have', 'hand', 'hard'.",
    "h→i": "After 'h', 'i' appears in words like 'his', 'him', 'hit'.",
    "th→e": "After 'th', 'e' is overwhelmingly likely — 'the' is the most common English word.",
    "th→a": "After 'th', 'a' appears in 'that', 'than', 'thank'.",
    "th→i": "After 'th', 'i' appears in 'this', 'thing', 'think'.",
};

function CountRow({ context, next, count, pct, tooltip }: {
    context: string; next: string; count: number; pct: number; tooltip: string;
}) {
    const [show, setShow] = useState(false);
    const key = `${context}→${next}`;
    return (
        <div
            className="relative group flex flex-col gap-1 cursor-default rounded-lg px-2 py-1.5 -mx-2 transition-colors hover:bg-white/[0.03]"
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >
            <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-xs text-white/60">
                    <span className="text-amber-300/70">{context}</span>
                    <span className="text-white/25">→</span>
                    <span className="text-white/80 font-bold">{next}</span>
                </span>
                <span className="font-mono text-[11px] text-white/30 tabular-nums">{count}</span>
            </div>
            <div className="h-1 rounded-full bg-white/[0.05] overflow-hidden">
                <motion.div
                    className="h-full rounded-full bg-amber-400/60"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.25, 0, 0, 1], delay: 0.1 }}
                />
            </div>
            <AnimatePresence>
                {show && (
                    <motion.div
                        initial={{ opacity: 0, y: 4, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-full left-0 mb-2 z-20 w-56 rounded-lg border border-amber-500/15 bg-zinc-900/98 px-3 py-2.5 text-[11px] text-white/50 leading-relaxed shadow-xl"
                    >
                        <span className="font-mono text-amber-300/80 font-bold text-xs">{key}</span>
                        <p className="mt-1">{tooltip}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export function CountingComparisonWidget() {
    return (
        <div className="grid md:grid-cols-2 gap-4 p-4 sm:p-6">
            {/* Bigram */}
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-amber-400/50">
                        Bigram (N=1)
                    </span>
                    <span className="text-[9px] font-mono text-white/15">1 char context</span>
                </div>
                <div className="flex flex-col gap-3">
                    {BIGRAM.map(r => (
                        <CountRow key={r.next} {...r} tooltip={TOOLTIPS[`${r.context}→${r.next}`]} />
                    ))}
                </div>
                <p className="text-[10px] text-white/20 leading-relaxed mt-1">
                    Wide spread — many characters plausibly follow&nbsp;&ldquo;h&rdquo;.
                </p>
            </div>

            {/* Trigram */}
            <div className="rounded-xl border border-amber-500/15 bg-amber-500/[0.03] p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-amber-400/70">
                        Trigram (N=2)
                    </span>
                    <span className="text-[9px] font-mono text-amber-400/25">2 char context</span>
                </div>
                <div className="flex flex-col gap-3">
                    {TRIGRAM.map(r => (
                        <CountRow key={r.next} {...r} tooltip={TOOLTIPS[`${r.context}→${r.next}`]} />
                    ))}
                </div>
                <p className="text-[10px] text-amber-300/30 leading-relaxed mt-1">
                    Sharper — &ldquo;th&rdquo; almost always leads to&nbsp;&ldquo;e&rdquo;.
                </p>
            </div>
        </div>
    );
}

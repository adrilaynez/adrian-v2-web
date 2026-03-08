"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

/*
  V38 — CommunicationVsProcessingViz
  Two phases: Listening (attention — words share info via arcs) vs
  Thinking (FFN — each word processes privately, no connections).
  Manual toggle, no auto-loop. All text ≥ 13px. No filters. Premium.
*/

const TOKENS = ["The", "cat", "sat", "on", "the", "mat"];

const ARCS: { from: number; to: number; w: number }[] = [
    { from: 1, to: 0, w: 0.5 }, { from: 1, to: 2, w: 0.8 },
    { from: 2, to: 1, w: 0.7 }, { from: 3, to: 1, w: 0.4 },
    { from: 5, to: 1, w: 0.9 }, { from: 5, to: 2, w: 0.5 },
    { from: 4, to: 5, w: 0.6 }, { from: 0, to: 1, w: 0.5 },
];

type Phase = "listening" | "thinking";

export function CommunicationVsProcessingViz() {
    const [phase, setPhase] = useState<Phase>("listening");
    const containerRef = useRef<HTMLDivElement>(null);
    const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const [positions, setPositions] = useState<{ x: number; y: number }[]>([]);

    const isListening = phase === "listening";

    const measure = useCallback(() => {
        if (!containerRef.current) return;
        const cRect = containerRef.current.getBoundingClientRect();
        setPositions(
            wordRefs.current.map((el) => {
                if (!el) return { x: 0, y: 0 };
                const r = el.getBoundingClientRect();
                return { x: r.left + r.width / 2 - cRect.left, y: r.top - cRect.top };
            })
        );
    }, []);

    useEffect(() => {
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, [measure]);

    return (
        <div className="py-6 sm:py-8 px-2 sm:px-4" style={{ minHeight: 200 }}>
            {/* Phase toggle */}
            <div className="flex items-center justify-center gap-2 mb-6">
                {([
                    { key: "listening" as Phase, label: "Listening", color: "#22d3ee" },
                    { key: "thinking" as Phase, label: "Thinking", color: "#fbbf24" },
                ] as const).map(({ key, label, color }) => {
                    const active = phase === key;
                    return (
                        <button
                            key={key}
                            onClick={() => setPhase(key)}
                            className="px-4 py-1.5 text-[14px] font-semibold transition-all cursor-pointer"
                            style={{
                                borderBottom: active ? `2px solid ${color}` : "2px solid transparent",
                                color: active ? color : "rgba(255,255,255,0.25)",
                                background: "transparent",
                            }}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>

            {/* Words + arcs */}
            <div ref={containerRef} className="relative max-w-md mx-auto">
                {/* SVG arcs (listening only) */}
                <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    style={{ overflow: "visible", zIndex: 1 }}
                >
                    {isListening && positions.length === TOKENS.length &&
                        ARCS.map(({ from, to, w }, i) => {
                            const pFrom = positions[from];
                            const pTo = positions[to];
                            if (!pFrom || !pTo) return null;
                            const mx = (pFrom.x + pTo.x) / 2;
                            const my = Math.min(pFrom.y, pTo.y) - Math.min(Math.abs(pFrom.x - pTo.x) * 0.3, 40);
                            return (
                                <motion.path
                                    key={i}
                                    d={`M ${pFrom.x} ${pFrom.y} Q ${mx} ${my} ${pTo.x} ${pTo.y}`}
                                    fill="none"
                                    stroke="rgba(34,211,238,0.25)"
                                    strokeWidth={0.5 + w * 2}
                                    strokeLinecap="round"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: i * 0.05 }}
                                />
                            );
                        })}
                </svg>

                {/* Token words */}
                <div className="flex items-baseline gap-x-3 flex-wrap justify-center relative z-10 py-8 leading-[2.6]">
                    {TOKENS.map((token, i) => (
                        <motion.span
                            key={i}
                            ref={(el) => { wordRefs.current[i] = el; }}
                            className="font-semibold select-none"
                            style={{
                                fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
                                color: isListening ? "#22d3ee" : "#fbbf24",
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                textShadow: !isListening
                                    ? "0 0 16px rgba(251,191,36,0.3)"
                                    : "0 0 0px transparent",
                            }}
                            transition={{ duration: 0.4, delay: i * 0.04 }}
                        >
                            {token}
                        </motion.span>
                    ))}
                </div>
            </div>

            {/* Caption */}
            <AnimatePresence mode="wait">
                <motion.p
                    key={phase}
                    className="text-center text-[13px] mt-2 max-w-sm mx-auto leading-relaxed"
                    style={{ color: isListening ? "rgba(34,211,238,0.45)" : "rgba(251,191,36,0.45)" }}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                >
                    {isListening
                        ? "Tokens share information with each other"
                        : "Each token processes privately — no connections"}
                </motion.p>
            </AnimatePresence>
        </div>
    );
}

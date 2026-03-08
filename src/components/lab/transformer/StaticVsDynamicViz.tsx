"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

/*
  StaticVsDynamicViz — V11 (v3 — interactive hover, cross-panel sync)
  Side-by-side: MLP (static) vs Attention (dynamic).
  Hover ANY word on EITHER panel → highlights it on BOTH panels.
  MLP: hovered word glows bright, all others dim heavily → only sees itself.
  Attention: hovered word glows, arcs radiate to targets, targets illuminate.
  The contrast IS the teaching. No boxes. Text-first. Premium.
*/

interface Preset {
    label: string;
    words: string[];
    dynamicWeights: number[][];
}

const PRESETS: Preset[] = [
    {
        label: "The cat sat on the mat",
        words: ["The", "cat", "sat", "on", "the", "mat"],
        dynamicWeights: [
            [.05, .40, .15, .10, .10, .20],
            [.08, .05, .35, .05, .05, .42],
            [.05, .45, .05, .20, .05, .20],
            [.05, .05, .10, .05, .30, .45],
            [.10, .05, .05, .05, .05, .70],
            [.10, .42, .15, .18, .10, .05],
        ],
    },
    {
        label: "She gave him the book",
        words: ["She", "gave", "him", "the", "book"],
        dynamicWeights: [
            [.05, .50, .10, .05, .30],
            [.35, .05, .30, .05, .25],
            [.10, .45, .05, .05, .35],
            [.05, .05, .05, .05, .80],
            [.10, .35, .15, .15, .05],
        ],
    },
    {
        label: "Dogs chase cats quickly",
        words: ["Dogs", "chase", "cats", "quickly"],
        dynamicWeights: [
            [.05, .50, .35, .10],
            [.30, .05, .45, .20],
            [.40, .40, .05, .15],
            [.10, .55, .15, .05],
        ],
    },
];

/* ─── Arc path ─── */
function arcPath(from: { x: number; y: number }, to: { x: number; y: number }): string {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const curvature = Math.min(dist * 0.35, 55);
    const midX = (from.x + to.x) / 2;
    const midY = Math.min(from.y, to.y) - curvature;
    return `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`;
}

/* ─── MLP Panel ─── */
function MLPPanel({
    words, presetIdx, hoveredIdx, onHover,
}: {
    words: string[]; presetIdx: number; hoveredIdx: number | null; onHover: (idx: number | null) => void;
}) {
    const isActive = hoveredIdx !== null;

    return (
        <div className="flex-1 space-y-2">
            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-center text-white/25">
                MLP
            </p>

            <AnimatePresence mode="wait">
                <motion.div
                    key={`mlp-${presetIdx}`}
                    className="flex items-baseline gap-x-[0.3em] sm:gap-x-[0.4em] flex-wrap justify-center py-7 sm:py-10 leading-[2.2] sm:leading-[2.4]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onMouseLeave={() => onHover(null)}
                >
                    {words.map((word, i) => {
                        const isFocused = hoveredIdx === i;

                        /* MLP: hovered word shines bright, everything else dims hard */
                        const color = isFocused
                            ? "rgba(255, 255, 255, 0.9)"
                            : isActive
                                ? "rgba(255, 255, 255, 0.15)"
                                : "rgba(255, 255, 255, 0.65)";

                        const textShadow = isFocused
                            ? "0 0 14px rgba(255, 255, 255, 0.25)"
                            : "none";

                        return (
                            <motion.span
                                key={i}
                                className="relative font-medium tracking-[-0.01em] cursor-pointer select-none"
                                style={{
                                    fontSize: "clamp(1.1rem, 2.4vw, 1.45rem)",
                                    color,
                                    textShadow,
                                    transition: "color 0.25s ease, text-shadow 0.3s ease",
                                }}
                                onMouseEnter={() => onHover(i)}
                            >
                                {/* Subtle underline for focused word */}
                                {isFocused && (
                                    <motion.span
                                        className="absolute -bottom-0.5 left-0 right-0 h-[1px] rounded-full pointer-events-none"
                                        style={{ background: "rgba(255, 255, 255, 0.2)" }}
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ duration: 0.2 }}
                                    />
                                )}
                                <span className="relative z-10">{word}</span>
                            </motion.span>
                        );
                    })}
                </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
                {isActive ? (
                    <motion.p
                        key="mlp-active"
                        className="text-[11px] text-white/20 text-center italic"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                    >
                        Only sees itself — no connections
                    </motion.p>
                ) : (
                    <motion.p
                        key="mlp-idle"
                        className="text-[11px] text-white/25 text-center italic"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                    >
                        Same connections — always uniform
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
}

/* ─── Attention Panel ─── */
function AttentionPanel({
    words, weights, presetIdx, hoveredIdx, onHover,
}: {
    words: string[]; weights: number[][]; presetIdx: number; hoveredIdx: number | null; onHover: (idx: number | null) => void;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const wordCountRef = useRef(words.length);
    wordCountRef.current = words.length;
    const [positions, setPositions] = useState<{ x: number; y: number }[]>([]);

    const measure = useCallback(() => {
        if (!containerRef.current) return;
        const cRect = containerRef.current.getBoundingClientRect();
        const count = wordCountRef.current;
        setPositions(
            Array.from({ length: count }, (_, i) => {
                const el = wordRefs.current[i];
                if (!el) return { x: 0, y: 0 };
                const r = el.getBoundingClientRect();
                return { x: r.left + r.width / 2 - cRect.left, y: r.top + r.height / 2 - cRect.top };
            })
        );
    }, []);

    useEffect(() => {
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, [measure]);

    useEffect(() => {
        const t1 = setTimeout(measure, 100);
        const t2 = setTimeout(measure, 400);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [presetIdx, measure]);

    const isActive = hoveredIdx !== null;
    const focusWeights = hoveredIdx !== null ? (weights[hoveredIdx] ?? []) : [];
    const focusPos = hoveredIdx !== null ? positions[hoveredIdx] : null;
    const rgb = "34, 211, 238";

    return (
        <div className="flex-1 space-y-2">
            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-center" style={{ color: "rgba(34, 211, 238, 0.4)" }}>
                Attention
            </p>

            <AnimatePresence mode="wait">
                <motion.div
                    key={`attn-${presetIdx}`}
                    ref={containerRef}
                    className="relative"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onMouseLeave={() => onHover(null)}
                >
                    {/* Ghost arcs from hovered word */}
                    <svg
                        className="absolute inset-0 w-full h-full pointer-events-none"
                        style={{ overflow: "visible", zIndex: 1 }}
                    >
                        <defs>
                            <filter id={`svd-glow-${presetIdx}`}>
                                <feGaussianBlur stdDeviation="3" result="blur" />
                                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                            </filter>
                        </defs>
                        <AnimatePresence>
                            {focusPos && positions.length === words.length && hoveredIdx !== null &&
                                words.map((_, i) => {
                                    if (i === hoveredIdx) return null;
                                    const w = focusWeights[i] ?? 0;
                                    if (w < 0.06) return null;
                                    const to = positions[i];
                                    if (!to) return null;
                                    const path = arcPath(focusPos, to);
                                    const opacity = Math.max(0.08, w * 0.65);
                                    const width = 0.5 + w * 2.5;
                                    const arcRgb = w >= 0.30 ? "251, 191, 36" : rgb;

                                    return (
                                        <motion.path
                                            key={`arc-${hoveredIdx}-${i}`}
                                            d={path}
                                            fill="none"
                                            stroke={`rgba(${arcRgb}, ${opacity})`}
                                            strokeWidth={width}
                                            strokeLinecap="round"
                                            filter={`url(#svd-glow-${presetIdx})`}
                                            initial={{ pathLength: 0, opacity: 0 }}
                                            animate={{ pathLength: 1, opacity: 1 }}
                                            exit={{ opacity: 0, transition: { duration: 0.15 } }}
                                            transition={{
                                                pathLength: { duration: 0.4, delay: i * 0.02, ease: "easeOut" },
                                                opacity: { duration: 0.25, delay: i * 0.02 },
                                            }}
                                        />
                                    );
                                })
                            }
                        </AnimatePresence>
                    </svg>

                    {/* Words as inline text */}
                    <div className="flex items-baseline gap-x-[0.3em] sm:gap-x-[0.4em] flex-wrap justify-center relative z-10 py-7 sm:py-10 leading-[2.2] sm:leading-[2.4]">
                        {words.map((word, i) => {
                            const isFocus = hoveredIdx === i;
                            const w = hoveredIdx !== null && i !== hoveredIdx ? (focusWeights[i] ?? 0) : 0;
                            const isStrong = !isFocus && w > 0.12;
                            const glowR = isStrong ? Math.round(6 + w * 35) : 0;
                            const isAmberW = isStrong && w >= 0.30;
                            const wRgb = isAmberW ? "251, 191, 36" : rgb;

                            const color = isFocus
                                ? `rgb(${rgb})`
                                : isAmberW
                                    ? `rgba(251, 191, 36, ${0.7 + w * 0.6})`
                                    : isStrong
                                        ? `rgba(${rgb}, ${0.5 + w * 0.9})`
                                        : isActive
                                            ? "rgba(255, 255, 255, 0.15)"
                                            : "rgba(255, 255, 255, 0.65)";

                            const textShadow = isFocus
                                ? `0 0 18px rgba(${rgb}, 0.45), 0 0 36px rgba(${rgb}, 0.15)`
                                : isStrong
                                    ? `0 0 ${glowR}px rgba(${wRgb}, ${(w * 0.5).toFixed(2)})`
                                    : "none";

                            return (
                                <motion.span
                                    key={i}
                                    ref={(el) => { wordRefs.current[i] = el; }}
                                    className="relative font-medium tracking-[-0.01em] cursor-pointer select-none"
                                    style={{
                                        fontSize: "clamp(1.1rem, 2.4vw, 1.45rem)",
                                        color,
                                        textShadow,
                                        transition: "color 0.25s ease, text-shadow 0.3s ease",
                                    }}
                                    onMouseEnter={() => {
                                        onHover(i);
                                        requestAnimationFrame(measure);
                                    }}
                                >
                                    {/* Glow halo */}
                                    {isStrong && (
                                        <motion.span
                                            className="absolute inset-0 -inset-x-1.5 -inset-y-0.5 rounded-full pointer-events-none"
                                            style={{
                                                background: `radial-gradient(ellipse at center, rgba(${wRgb}, ${(w * 0.14).toFixed(3)}) 0%, transparent 70%)`,
                                                filter: "blur(5px)",
                                            }}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    )}

                                    {/* Focus underline */}
                                    {isFocus && (
                                        <motion.span
                                            className="absolute -bottom-0.5 left-0 right-0 h-[1.5px] rounded-full pointer-events-none"
                                            style={{ background: `linear-gradient(90deg, transparent, rgba(${rgb}, 0.5), transparent)` }}
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: 1 }}
                                            transition={{ duration: 0.25 }}
                                        />
                                    )}

                                    <span className="relative z-10">{word}</span>
                                </motion.span>
                            );
                        })}
                    </div>
                </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
                {isActive ? (
                    <motion.p
                        key="attn-active"
                        className="text-[11px] text-center italic"
                        style={{ color: "rgba(34, 211, 238, 0.25)" }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                    >
                        Connects to everything relevant
                    </motion.p>
                ) : (
                    <motion.p
                        key="attn-idle"
                        className="text-[11px] text-center italic"
                        style={{ color: "rgba(34, 211, 238, 0.25)" }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                    >
                        Different connections for every sentence
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
}

export function StaticVsDynamicViz() {
    const [presetIdx, setPresetIdx] = useState(0);
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
    const preset = PRESETS[presetIdx];

    /* Reset hover on sentence change */
    const handlePreset = useCallback((idx: number) => {
        setHoveredIdx(null);
        setPresetIdx(idx);
    }, []);

    return (
        <div className="py-6 sm:py-10 px-2 sm:px-4 space-y-4" style={{ minHeight: 280 }}>
            {/* Sentence selector — editorial tabs */}
            <div className="flex items-center justify-center gap-6 sm:gap-8">
                {PRESETS.map((p, i) => {
                    const isActive = i === presetIdx;
                    return (
                        <motion.button
                            key={i}
                            onClick={() => handlePreset(i)}
                            className="relative pb-1.5 text-[13px] sm:text-sm font-medium transition-colors duration-300 cursor-pointer"
                            style={{
                                color: isActive ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.3)",
                            }}
                            whileHover={{ color: isActive ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.5)" }}
                        >
                            {p.label}
                            {isActive && (
                                <motion.span
                                    className="absolute bottom-0 left-0 right-0 h-[1.5px] rounded-full"
                                    style={{ background: "linear-gradient(90deg, transparent, rgba(34,211,238,0.5), transparent)" }}
                                    layoutId="svd-tab-indicator"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                        </motion.button>
                    );
                })}
            </div>

            {/* Two panels — shared hover state */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <MLPPanel words={preset.words} presetIdx={presetIdx} hoveredIdx={hoveredIdx} onHover={setHoveredIdx} />
                <AttentionPanel words={preset.words} weights={preset.dynamicWeights} presetIdx={presetIdx} hoveredIdx={hoveredIdx} onHover={setHoveredIdx} />
            </div>

            {/* Insight / hover hint */}
            <AnimatePresence mode="wait">
                {hoveredIdx !== null ? (
                    <motion.p
                        key="insight-active"
                        className="text-center text-[13px] sm:text-sm max-w-md mx-auto"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -3 }}
                        transition={{ duration: 0.2 }}
                    >
                        <span className="text-white/35">MLP sees only </span>
                        <span className="text-white/50 font-medium">&ldquo;{preset.words[hoveredIdx]}&rdquo;</span>
                        <span className="text-white/20 mx-1.5">·</span>
                        <span className="text-white/35">Attention sees </span>
                        <span className="text-cyan-300/50 font-medium">everything around it</span>
                    </motion.p>
                ) : (
                    <motion.p
                        key="hint"
                        className="text-center text-[13px] text-white/20 italic"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        Hover any word to compare both sides
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
}

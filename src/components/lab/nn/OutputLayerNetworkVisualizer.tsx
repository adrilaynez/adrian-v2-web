"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/i18n/context";

const CHARS = "abcdefghijklmnopqrstuvwxyz ".split("");

/* Per-input logit tables — rough English bigram-like distributions */
const LOGIT_TABLES: Record<string, Record<string, number>> = {
    t: { h: 2.4, o: 1.8, e: 1.5, i: 1.2, a: 0.9, r: 0.6, s: 0.4, " ": 0.2, u: 0.1, w: 0.0 },
    h: { e: 2.6, a: 1.9, i: 1.4, o: 1.1, " ": 0.8, r: 0.3, u: 0.2, y: 0.1 },
    e: { " ": 2.5, r: 2.0, s: 1.8, n: 1.5, d: 1.3, a: 1.0, l: 0.8, t: 0.6, x: 0.2 },
    a: { n: 2.3, t: 2.0, s: 1.7, r: 1.5, l: 1.2, " ": 1.0, d: 0.8, c: 0.5, y: 0.3 },
    i: { n: 2.4, s: 2.1, t: 1.8, o: 1.4, c: 1.1, " ": 0.9, l: 0.7, e: 0.5, d: 0.3 },
    n: { " ": 2.6, g: 2.0, d: 1.7, e: 1.4, t: 1.1, o: 0.8, s: 0.5, a: 0.3 },
    s: { " ": 2.5, t: 2.1, e: 1.8, h: 1.5, i: 1.2, o: 0.9, a: 0.6, u: 0.3 },
    o: { n: 2.3, r: 2.0, f: 1.7, " ": 1.5, u: 1.2, t: 1.0, s: 0.7, m: 0.4 },
    " ": { t: 2.5, a: 2.2, s: 1.9, i: 1.6, o: 1.4, h: 1.2, w: 1.0, b: 0.8, c: 0.6, f: 0.4 },
    r: { e: 2.4, " ": 2.0, o: 1.6, i: 1.3, a: 1.0, s: 0.7, t: 0.4 },
};

function getLogits(input: string): Record<string, number> {
    const table = LOGIT_TABLES[input] ?? {};
    const result: Record<string, number> = {};
    for (const ch of CHARS) {
        result[ch] = table[ch] ?? (Math.random() * 0.4 - 0.8);
    }
    return result;
}

function softmax(logits: Record<string, number>): Record<string, number> {
    const vals = Object.values(logits);
    const max = Math.max(...vals);
    const exps = Object.fromEntries(
        Object.entries(logits).map(([k, v]) => [k, Math.exp(v - max)])
    );
    const sum = Object.values(exps).reduce((a, b) => a + b, 0);
    return Object.fromEntries(Object.entries(exps).map(([k, v]) => [k, v / sum]));
}

/* Layout constants */
const SVG_W = 520;
const SVG_H = 340;
const INPUT_X = 52;
const HIDDEN_X = 180;
const OUTPUT_X = 360;
const HIDDEN_COUNT = 4;
const OUTPUT_COLS = 9;
const OUTPUT_ROWS = 3;
const OUT_CX = OUTPUT_X;
const OUT_START_Y = 40;
const OUT_GAP_X = 34;
const OUT_GAP_Y = 88;

function hiddenY(i: number): number {
    const total = HIDDEN_COUNT;
    return SVG_H / 2 - ((total - 1) / 2) * 60 + i * 60;
}

function outputPos(i: number): { x: number; y: number } {
    const col = i % OUTPUT_COLS;
    const row = Math.floor(i / OUTPUT_COLS);
    return {
        x: OUT_CX + col * OUT_GAP_X,
        y: OUT_START_Y + row * OUT_GAP_Y,
    };
}

interface Particle {
    id: number;
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
    delay: number;
    layer: "ih" | "ho";
}

export function OutputLayerNetworkVisualizer() {
    const { t } = useI18n();
    const [selectedInput, setSelectedInput] = useState("t");
    const [probs, setProbs] = useState<Record<string, number>>({});
    const [particles, setParticles] = useState<Particle[]>([]);
    const [animating, setAnimating] = useState(false);
    const particleIdRef = useRef(0);

    const inputY = SVG_H / 2;

    useEffect(() => {
        const logits = getLogits(selectedInput);
        setProbs(softmax(logits));
        triggerAnimation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedInput]);

    function triggerAnimation() {
        if (animating) return;
        setAnimating(true);
        const newParticles: Particle[] = [];
        /* input → hidden */
        for (let h = 0; h < HIDDEN_COUNT; h++) {
            newParticles.push({
                id: particleIdRef.current++,
                fromX: INPUT_X,
                fromY: inputY,
                toX: HIDDEN_X,
                toY: hiddenY(h),
                delay: h * 0.06,
                layer: "ih",
            });
        }
        /* hidden → output (sample 12 connections for perf) */
        for (let h = 0; h < HIDDEN_COUNT; h++) {
            for (let o = 0; o < CHARS.length; o += 3) {
                const pos = outputPos(o);
                newParticles.push({
                    id: particleIdRef.current++,
                    fromX: HIDDEN_X,
                    fromY: hiddenY(h),
                    toX: pos.x,
                    toY: pos.y,
                    delay: 0.3 + h * 0.05 + (o / CHARS.length) * 0.15,
                    layer: "ho",
                });
            }
        }
        setParticles(newParticles);
        setTimeout(() => {
            setParticles([]);
            setAnimating(false);
        }, 1400);
    }

    const sortedByProb = [...CHARS].sort((a, b) => (probs[b] ?? 0) - (probs[a] ?? 0));
    const top3 = new Set(sortedByProb.slice(0, 3));

    const QUICK_INPUTS = ["t", "h", "e", "a", "i", "n", "s", "o", " ", "r"];

    return (
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.015] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">
                    {t("neuralNetworkNarrative.fromNumbers.networkViz.label")}
                </span>
                <span className="text-[10px] text-white/20 font-mono">
                    {t("neuralNetworkNarrative.fromNumbers.networkViz.arch")}
                </span>
            </div>

            {/* Input selector */}
            <div className="px-4 pt-4 pb-2">
                <p className="text-[10px] font-mono uppercase tracking-widest text-white/25 mb-2">
                    {t("neuralNetworkNarrative.fromNumbers.networkViz.inputPrompt")}
                </p>
                <div className="flex gap-1.5 flex-wrap">
                    {QUICK_INPUTS.map((ch) => (
                        <button
                            key={ch}
                            onClick={() => setSelectedInput(ch)}
                            className={`w-8 h-8 rounded-lg text-xs font-mono font-bold transition-all border ${
                                selectedInput === ch
                                    ? "bg-sky-500/20 border-sky-500/40 text-sky-300"
                                    : "bg-white/[0.03] border-white/[0.08] text-white/40 hover:text-white/60 hover:border-white/[0.14]"
                            }`}
                        >
                            {ch === " " ? "·" : ch}
                        </button>
                    ))}
                </div>
            </div>

            {/* SVG Network */}
            <div className="px-4 pb-2 overflow-x-auto">
                <svg
                    viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                    className="w-full max-w-[520px] mx-auto"
                    style={{ minWidth: 320 }}
                >
                    {/* Connection lines: input → hidden */}
                    {Array.from({ length: HIDDEN_COUNT }, (_, h) => (
                        <line
                            key={`ih-${h}`}
                            x1={INPUT_X} y1={inputY}
                            x2={HIDDEN_X} y2={hiddenY(h)}
                            stroke="rgba(139,92,246,0.12)"
                            strokeWidth="1"
                        />
                    ))}

                    {/* Connection lines: hidden → output (every 3rd for perf) */}
                    {Array.from({ length: HIDDEN_COUNT }, (_, h) =>
                        CHARS.map((ch, o) => {
                            if (o % 4 !== 0) return null;
                            const pos = outputPos(o);
                            return (
                                <line
                                    key={`ho-${h}-${o}`}
                                    x1={HIDDEN_X} y1={hiddenY(h)}
                                    x2={pos.x} y2={pos.y}
                                    stroke="rgba(244,63,94,0.06)"
                                    strokeWidth="0.8"
                                />
                            );
                        })
                    )}

                    {/* Animated particles */}
                    <AnimatePresence>
                        {particles.map((p) => (
                            <motion.circle
                                key={p.id}
                                r={p.layer === "ih" ? 3 : 2}
                                fill={p.layer === "ih" ? "rgba(139,92,246,0.9)" : "rgba(244,63,94,0.8)"}
                                initial={{ cx: p.fromX, cy: p.fromY, opacity: 0.9 }}
                                animate={{ cx: p.toX, cy: p.toY, opacity: 0 }}
                                transition={{ duration: 0.55, delay: p.delay, ease: "easeIn" }}
                            />
                        ))}
                    </AnimatePresence>

                    {/* Input neuron */}
                    <motion.circle
                        key={`input-${selectedInput}`}
                        cx={INPUT_X} cy={inputY} r={18}
                        fill="rgba(14,165,233,0.15)"
                        stroke="rgba(14,165,233,0.5)"
                        strokeWidth="1.5"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    />
                    <text
                        x={INPUT_X} y={inputY + 1}
                        textAnchor="middle" dominantBaseline="middle"
                        fill="rgba(125,211,252,0.9)"
                        fontSize="14" fontWeight="bold" fontFamily="monospace"
                    >
                        {selectedInput === " " ? "·" : selectedInput}
                    </text>
                    <text
                        x={INPUT_X} y={inputY + 28}
                        textAnchor="middle"
                        fill="rgba(125,211,252,0.4)"
                        fontSize="8" fontFamily="monospace"
                    >
                        input
                    </text>

                    {/* Hidden neurons */}
                    {Array.from({ length: HIDDEN_COUNT }, (_, h) => (
                        <g key={`h-${h}`}>
                            <circle
                                cx={HIDDEN_X} cy={hiddenY(h)} r={13}
                                fill="rgba(139,92,246,0.12)"
                                stroke="rgba(139,92,246,0.35)"
                                strokeWidth="1.2"
                            />
                            <text
                                x={HIDDEN_X} y={hiddenY(h) + 1}
                                textAnchor="middle" dominantBaseline="middle"
                                fill="rgba(196,181,253,0.5)"
                                fontSize="7" fontFamily="monospace"
                            >
                                h{h + 1}
                            </text>
                        </g>
                    ))}
                    <text
                        x={HIDDEN_X} y={SVG_H - 8}
                        textAnchor="middle"
                        fill="rgba(139,92,246,0.3)"
                        fontSize="8" fontFamily="monospace"
                    >
                        hidden
                    </text>

                    {/* Output neurons */}
                    {CHARS.map((ch, i) => {
                        const pos = outputPos(i);
                        const prob = probs[ch] ?? 0;
                        const isTop = top3.has(ch);
                        const radius = isTop ? 13 : 10;
                        return (
                            <g key={`out-${ch}`}>
                                <motion.circle
                                    cx={pos.x} cy={pos.y}
                                    r={radius}
                                    fill={isTop ? "rgba(244,63,94,0.25)" : "rgba(255,255,255,0.04)"}
                                    stroke={isTop ? "rgba(244,63,94,0.7)" : "rgba(255,255,255,0.12)"}
                                    strokeWidth={isTop ? 1.5 : 0.8}
                                    animate={isTop ? {
                                        boxShadow: ["0 0 0px rgba(244,63,94,0)", "0 0 8px rgba(244,63,94,0.6)", "0 0 0px rgba(244,63,94,0)"],
                                    } : {}}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                />
                                <text
                                    x={pos.x} y={pos.y + 1}
                                    textAnchor="middle" dominantBaseline="middle"
                                    fill={isTop ? "rgba(253,164,175,0.95)" : "rgba(255,255,255,0.3)"}
                                    fontSize={isTop ? "8" : "7"}
                                    fontWeight={isTop ? "bold" : "normal"}
                                    fontFamily="monospace"
                                >
                                    {ch === " " ? "·" : ch}
                                </text>
                                {isTop && (
                                    <text
                                        x={pos.x} y={pos.y + 22}
                                        textAnchor="middle"
                                        fill="rgba(253,164,175,0.6)"
                                        fontSize="7" fontFamily="monospace"
                                    >
                                        {(prob * 100).toFixed(0)}%
                                    </text>
                                )}
                            </g>
                        );
                    })}
                    <text
                        x={OUT_CX + (OUTPUT_COLS - 1) * OUT_GAP_X / 2} y={SVG_H - 8}
                        textAnchor="middle"
                        fill="rgba(244,63,94,0.3)"
                        fontSize="8" fontFamily="monospace"
                    >
                        27 outputs
                    </text>
                </svg>
            </div>

            {/* Top predictions strip */}
            <div className="px-4 pb-4">
                <p className="text-[10px] font-mono uppercase tracking-widest text-white/20 mb-2">
                    {t("neuralNetworkNarrative.fromNumbers.networkViz.topPredictions")}
                </p>
                <div className="flex gap-2">
                    <AnimatePresence mode="popLayout">
                        {sortedByProb.slice(0, 5).map((ch, rank) => (
                            <motion.div
                                key={`${selectedInput}-${ch}`}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.25, delay: rank * 0.04 }}
                                className={`flex flex-col items-center px-3 py-2 rounded-xl border ${
                                    rank === 0
                                        ? "bg-rose-500/15 border-rose-500/30"
                                        : rank < 3
                                        ? "bg-white/[0.04] border-white/[0.10]"
                                        : "bg-white/[0.02] border-white/[0.06]"
                                }`}
                            >
                                <span className={`text-lg font-bold font-mono ${rank === 0 ? "text-rose-300" : "text-white/50"}`}>
                                    {ch === " " ? "·" : ch}
                                </span>
                                <span className={`text-[10px] font-mono ${rank === 0 ? "text-rose-400/70" : "text-white/25"}`}>
                                    {((probs[ch] ?? 0) * 100).toFixed(1)}%
                                </span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
                <p className="text-[11px] text-white/25 mt-3 italic">
                    {t("neuralNetworkNarrative.fromNumbers.networkViz.hint")}
                </p>
            </div>
        </div>
    );
}

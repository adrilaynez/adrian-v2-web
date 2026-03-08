"use client";

import { useEffect, useState } from "react";

import { motion } from "framer-motion";

/*
  V40 — HighwayReturnsViz
  Vertical: Input → [Attention] → Add → [FFN] → Add → Output
  Curved bypass arrows (residual connections) colored emerald.
  Animated data particles flowing through main path AND bypass.
  Labels: "output = Attention(x) + x" and "output = FFN(x) + x"
  Height: 260px. All text ≥ 13px.
  NO math beyond the simple addition formulas.
*/

/* Block definitions for the vertical stack */
const BLOCKS = [
    { id: "input", label: "Input (x)", color: "#94a3b8", type: "terminal" as const },
    { id: "attn", label: "Self-Attention", color: "#22d3ee", type: "process" as const },
    { id: "add1", label: "Add ⊕", color: "#34d399", type: "add" as const, formula: "Attention(x) + x" },
    { id: "ffn", label: "Feed-Forward", color: "#fbbf24", type: "process" as const },
    { id: "add2", label: "Add ⊕", color: "#34d399", type: "add" as const, formula: "FFN(x) + x" },
    { id: "output", label: "Output", color: "#f472b6", type: "terminal" as const },
];

/* SVG layout */
const SVG_W = 400;
const SVG_H = 400;
const CENTER_X = SVG_W / 2;
const BLOCK_W = 160;
const BLOCK_H = 36;
const START_Y = 30;
const GAP_Y = 62;

function blockY(i: number) { return START_Y + i * GAP_Y; }

export function HighwayReturnsViz() {
    const [tick, setTick] = useState(0);
    const [withHighway, setWithHighway] = useState(true);

    /* Animate particles */
    useEffect(() => {
        const timer = setInterval(() => setTick(t => t + 1), 50);
        return () => clearInterval(timer);
    }, []);

    /* Particle positions along main path */
    const mainParticlePhase = (tick % 80) / 80;
    /* Bypass particle positions */
    const bypassParticlePhase1 = ((tick + 20) % 100) / 100;
    const bypassParticlePhase2 = ((tick + 20) % 100) / 100;

    /* Without highway: particle fades as it flows */
    const mainParticleOpacity = withHighway ? 0.8 : Math.max(0.05, 1 - mainParticlePhase * 1.3);
    const mainParticleR = withHighway ? 5 : Math.max(1.5, 5 - mainParticlePhase * 4);

    return (
        <div className="py-6 sm:py-8 px-2 sm:px-4" style={{ minHeight: 260 }}>
            {/* Toggle */}
            <div className="flex items-center justify-center gap-3 mb-4">
                <motion.button
                    onClick={() => setWithHighway(false)}
                    className="px-4 py-2 rounded-xl text-[14px] font-bold transition-all"
                    style={{
                        background: !withHighway
                            ? "linear-gradient(135deg, rgba(244,63,94,0.15), rgba(244,63,94,0.05))"
                            : "rgba(255,255,255,0.03)",
                        border: `1.5px solid ${!withHighway ? "rgba(244,63,94,0.4)" : "rgba(255,255,255,0.06)"}`,
                        color: !withHighway ? "#f43f5e" : "rgba(255,255,255,0.25)",
                    }}
                    whileTap={{ scale: 0.95 }}
                >
                    Without Highway
                </motion.button>
                <motion.button
                    onClick={() => setWithHighway(true)}
                    className="px-4 py-2 rounded-xl text-[14px] font-bold transition-all"
                    style={{
                        background: withHighway
                            ? "linear-gradient(135deg, rgba(52,211,153,0.15), rgba(52,211,153,0.05))"
                            : "rgba(255,255,255,0.03)",
                        border: `1.5px solid ${withHighway ? "rgba(52,211,153,0.4)" : "rgba(255,255,255,0.06)"}`,
                        color: withHighway ? "#34d399" : "rgba(255,255,255,0.25)",
                    }}
                    whileTap={{ scale: 0.95 }}
                >
                    With Highway
                </motion.button>
            </div>
            <svg
                viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                className="w-full"
                style={{ maxWidth: 420, margin: "0 auto", display: "block" }}
            >
                <defs>
                    <filter id="v40-glow">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <filter id="v40-highway-glow">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>

                {/* ── Main vertical connectors ── */}
                {BLOCKS.slice(0, -1).map((_, i) => {
                    const y1 = blockY(i) + BLOCK_H / 2;
                    const y2 = blockY(i + 1) - BLOCK_H / 2;
                    return (
                        <line
                            key={`conn-${i}`}
                            x1={CENTER_X} y1={y1}
                            x2={CENTER_X} y2={y2}
                            stroke="rgba(255,255,255,0.08)"
                            strokeWidth={2}
                        />
                    );
                })}

                {/* ── Residual bypasses (only with highway) ── */}
                {withHighway && (() => {
                    const startY = blockY(0) + BLOCK_H / 2;
                    const endY = blockY(2);
                    const curveX = CENTER_X + BLOCK_W / 2 + 40;
                    const pathD = `M ${CENTER_X + BLOCK_W / 2 - 10} ${startY} 
                                   C ${curveX} ${startY + 10}, ${curveX} ${endY - 10}, ${CENTER_X + BLOCK_W / 2 - 10} ${endY}`;
                    const px = CENTER_X + BLOCK_W / 2 + 35;
                    const py = startY + (endY - startY) * bypassParticlePhase1;
                    return (
                        <g>
                            <motion.path
                                d={pathD}
                                fill="none"
                                stroke="#34d399"
                                strokeWidth={2.5}
                                strokeDasharray="6 4"
                                filter="url(#v40-highway-glow)"
                                animate={{ strokeOpacity: [0.2, 0.45, 0.2] }}
                                transition={{ duration: 2.5, repeat: Infinity }}
                            />
                            {/* Bypass particle */}
                            <motion.circle
                                cx={px}
                                cy={py}
                                r={4}
                                fill="#34d399"
                                filter="url(#v40-highway-glow)"
                                animate={{ opacity: [0.7, 1, 0.7] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                            />
                            {/* Label */}
                            <text
                                x={curveX + 8} y={(startY + endY) / 2 + 4}
                                fontSize={10}
                                fontFamily="ui-sans-serif, system-ui"
                                fontWeight="600"
                                fill="#34d399"
                                fillOpacity={0.5}
                            >
                                +x
                            </text>
                        </g>
                    );
                })()}

                {/* ── Residual bypass 2: Add1 → Add2 (skipping FFN) ── */}
                {withHighway && (() => {
                    const startY = blockY(2) + BLOCK_H / 2;
                    const endY = blockY(4);
                    const curveX = CENTER_X + BLOCK_W / 2 + 40;
                    const pathD = `M ${CENTER_X + BLOCK_W / 2 - 10} ${startY} 
                                   C ${curveX} ${startY + 10}, ${curveX} ${endY - 10}, ${CENTER_X + BLOCK_W / 2 - 10} ${endY}`;
                    const px = CENTER_X + BLOCK_W / 2 + 35;
                    const py = startY + (endY - startY) * bypassParticlePhase2;
                    return (
                        <g>
                            <motion.path
                                d={pathD}
                                fill="none"
                                stroke="#34d399"
                                strokeWidth={2.5}
                                strokeDasharray="6 4"
                                filter="url(#v40-highway-glow)"
                                animate={{ strokeOpacity: [0.2, 0.45, 0.2] }}
                                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                            />
                            {/* Bypass particle */}
                            <motion.circle
                                cx={px}
                                cy={py}
                                r={4}
                                fill="#34d399"
                                filter="url(#v40-highway-glow)"
                                animate={{ opacity: [0.7, 1, 0.7] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                            />
                            {/* Label */}
                            <text
                                x={curveX + 8} y={(startY + endY) / 2 + 4}
                                fontSize={10}
                                fontFamily="ui-sans-serif, system-ui"
                                fontWeight="600"
                                fill="#34d399"
                                fillOpacity={0.5}
                            >
                                +x
                            </text>
                        </g>
                    );
                })()}

                {/* ── Main path particle ── */}
                {(() => {
                    const totalY = blockY(BLOCKS.length - 1) - blockY(0);
                    const py = blockY(0) + totalY * mainParticlePhase;
                    return (
                        <motion.circle
                            cx={CENTER_X} cy={py} r={mainParticleR}
                            fill={withHighway ? "#67e8f9" : "#f43f5e"}
                            filter="url(#v40-glow)"
                            animate={{ opacity: withHighway ? [0.6, 1, 0.6] : mainParticleOpacity }}
                            transition={withHighway ? { duration: 1, repeat: Infinity } : { duration: 0.05 }}
                        />
                    );
                })()}

                {/* ── Blocks ── */}
                {BLOCKS.map((block, i) => {
                    const y = blockY(i);
                    const isProcess = block.type === "process";
                    const isAdd = block.type === "add";

                    return (
                        <g key={block.id}>
                            {/* Block rect */}
                            <motion.rect
                                x={CENTER_X - BLOCK_W / 2}
                                y={y - BLOCK_H / 2}
                                width={BLOCK_W}
                                height={BLOCK_H}
                                rx={isAdd ? BLOCK_H / 2 : 10}
                                fill={block.color}
                                stroke={block.color}
                                strokeWidth={1.5}
                                animate={{
                                    fillOpacity: isProcess ? 0.1 : isAdd ? 0.08 : 0.05,
                                    strokeOpacity: isProcess ? 0.4 : isAdd ? 0.35 : 0.2,
                                }}
                            />

                            {/* Block label */}
                            <text
                                x={CENTER_X}
                                y={y + 5}
                                textAnchor="middle"
                                fontSize={13}
                                fontFamily="ui-sans-serif, system-ui"
                                fontWeight="700"
                                fill={block.color}
                                fillOpacity={0.85}
                            >
                                {block.label}
                            </text>

                            {/* Formula label for Add blocks */}
                            {isAdd && "formula" in block && (
                                <text
                                    x={CENTER_X - BLOCK_W / 2 - 12}
                                    y={y + 4}
                                    textAnchor="end"
                                    fontSize={10}
                                    fontFamily="ui-monospace, monospace"
                                    fontWeight="600"
                                    fill={block.color}
                                    fillOpacity={0.4}
                                >
                                    {block.formula}
                                </text>
                            )}
                        </g>
                    );
                })}

                {/* ── Downward arrows between blocks ── */}
                {BLOCKS.slice(0, -1).map((_, i) => {
                    const y = blockY(i) + BLOCK_H / 2 + 8;
                    return (
                        <polygon
                            key={`arrow-${i}`}
                            points={`${CENTER_X - 4},${y} ${CENTER_X + 4},${y} ${CENTER_X},${y + 8}`}
                            fill="rgba(255,255,255,0.1)"
                        />
                    );
                })}
            </svg>
        </div>
    );
}

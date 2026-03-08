"use client";

import { useEffect, useState } from "react";

import { motion } from "framer-motion";

/*
  V39 — FFNCallbackViz
  MLP architecture miniaturized: input (d) → hidden (4d, expanded) → ReLU → output (d)
  Familiar MLP shape: narrow → wide → narrow.
  Badge: "🛠 You Built This!" — amber accent (callback color).
  Auto-animate vertical flow. Height: 220px. All text ≥ 13px.
  NO weight numbers. NO matrix values.
*/

const D_MODEL = 4;
const D_HIDDEN = D_MODEL * 4; // 16

/* Layer definitions */
const LAYERS = [
    { id: "input", label: "Input", count: D_MODEL, color: "#22d3ee", sub: `d = ${D_MODEL}` },
    { id: "hidden", label: "Expand", count: D_HIDDEN, color: "#fbbf24", sub: `4d = ${D_HIDDEN}` },
    { id: "relu", label: "ReLU ⚡", count: D_HIDDEN, color: "#f472b6", sub: "activate" },
    { id: "output", label: "Output", count: D_MODEL, color: "#34d399", sub: `d = ${D_MODEL}` },
];

export function FFNCallbackViz() {
    const [step, setStep] = useState(0);
    const [autoPlay, setAutoPlay] = useState(true);

    /* Auto-animate through steps */
    useEffect(() => {
        if (!autoPlay) return;
        const timer = setInterval(() => {
            setStep(s => (s + 1) % (LAYERS.length + 1));
        }, 1200);
        return () => clearInterval(timer);
    }, [autoPlay]);

    return (
        <div className="py-6 sm:py-8 px-3 sm:px-6 relative" style={{ minHeight: 220 }}>
            {/* Badge */}
            <motion.div
                className="flex items-center justify-center mb-5"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div
                    className="px-4 py-1.5 rounded-full text-[14px] font-bold"
                    style={{
                        background: "linear-gradient(135deg, rgba(251,191,36,0.12), rgba(251,191,36,0.04))",
                        border: "1.5px solid rgba(251,191,36,0.3)",
                        color: "#fbbf24",
                        boxShadow: "0 0 20px -4px rgba(251,191,36,0.2)",
                    }}
                >
                    🛠 You Built This!
                </div>
            </motion.div>

            {/* Vertical flow */}
            <div className="flex flex-col items-center gap-3">
                {LAYERS.map((layer, li) => {
                    const isActive = step > li;
                    const isCurrent = step === li + 1;
                    /* Scale node count for visual width */
                    const nodeCount = Math.min(layer.count, 12);
                    const nodeSize = layer.count > D_MODEL ? 10 : 14;

                    return (
                        <div key={layer.id} className="flex flex-col items-center">
                            {/* Connector arrow */}
                            {li > 0 && (
                                <motion.div
                                    className="w-px mb-2"
                                    style={{ height: 16 }}
                                    animate={{
                                        background: isActive
                                            ? `linear-gradient(180deg, ${LAYERS[li - 1].color}50, ${layer.color}50)`
                                            : "rgba(255,255,255,0.06)",
                                    }}
                                    transition={{ duration: 0.3 }}
                                />
                            )}

                            {/* Layer card — expand/contract breathing */}
                            <motion.div
                                className="rounded-xl px-4 py-3 flex flex-col items-center gap-1.5 relative"
                                style={{
                                    backdropFilter: "blur(8px)",
                                }}
                                animate={{
                                    width: isCurrent
                                        ? (layer.count > D_MODEL ? 320 : 140)
                                        : isActive
                                            ? (layer.count > D_MODEL ? 300 : 160)
                                            : (layer.count > D_MODEL ? 260 : 160),
                                    background: isCurrent
                                        ? `linear-gradient(135deg, ${layer.color}15, ${layer.color}08)`
                                        : isActive
                                            ? `${layer.color}08`
                                            : "rgba(255,255,255,0.02)",
                                    borderColor: isCurrent
                                        ? `${layer.color}45`
                                        : isActive ? `${layer.color}20` : "rgba(255,255,255,0.05)",
                                    boxShadow: isCurrent
                                        ? `0 0 24px -4px ${layer.color}30`
                                        : "none",
                                }}
                                transition={{ type: "spring", stiffness: 100, damping: 16 }}
                            >
                                {/* Glow ring */}
                                {isCurrent && (
                                    <motion.div
                                        className="absolute -inset-1 rounded-xl"
                                        style={{
                                            border: `1px solid ${layer.color}30`,
                                        }}
                                        animate={{ opacity: [0.2, 0.5, 0.2] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    />
                                )}

                                {/* Label */}
                                <span
                                    className="text-[14px] font-bold"
                                    style={{ color: isActive ? layer.color : "rgba(255,255,255,0.2)" }}
                                >
                                    {layer.label}
                                </span>

                                {/* Nodes */}
                                <div className="flex items-center justify-center gap-1 flex-wrap">
                                    {Array.from({ length: nodeCount }, (_, ni) => (
                                        <motion.div
                                            key={ni}
                                            className="rounded-full"
                                            style={{
                                                width: nodeSize,
                                                height: nodeSize,
                                                background: layer.color,
                                            }}
                                            animate={{
                                                opacity: isActive ? [0.25, 0.6, 0.25] : 0.08,
                                                scale: isCurrent ? [1, 1.15, 1] : 1,
                                            }}
                                            transition={{
                                                duration: isCurrent ? 1.5 : 0.4,
                                                repeat: isCurrent ? Infinity : 0,
                                                delay: ni * 0.03,
                                            }}
                                        />
                                    ))}
                                    {layer.count > 12 && (
                                        <span className="text-[13px] font-mono" style={{ color: `${layer.color}50` }}>
                                            +{layer.count - 12}
                                        </span>
                                    )}
                                </div>

                                {/* Sub label */}
                                <span
                                    className="text-[13px] font-mono"
                                    style={{ color: isActive ? `${layer.color}60` : "rgba(255,255,255,0.08)" }}
                                >
                                    {layer.sub}
                                </span>
                            </motion.div>
                        </div>
                    );
                })}
            </div>

            {/* Play/pause */}
            <div className="flex items-center justify-center mt-4">
                <button
                    onClick={() => { setAutoPlay(p => !p); if (!autoPlay) setStep(0); }}
                    className="text-[13px] font-semibold transition-all"
                    style={{ color: "rgba(255,255,255,0.25)" }}
                >
                    {autoPlay ? "⏸ Pause" : "▶ Play"}
                </button>
            </div>
        </div>
    );
}

"use client";

import { useState } from "react";

import { motion } from "framer-motion";

/*
  V50 — CausalMaskViz
  8×8 attention matrix. Upper triangle = masked (black). Click row to highlight visible tokens.
  Toggle mask on/off to see the difference.
*/

const TOKENS = ["The", "cat", "sat", "on", "the", "mat", "and", "slept"];
const COLORS = ["#67e8f9", "#34d399", "#a78bfa", "#fbbf24", "#f472b6", "#fb923c", "#60a5fa", "#f9a8d4"];

export function CausalMaskViz() {
    const [selectedRow, setSelectedRow] = useState(4);
    const [showMask, setShowMask] = useState(true);
    const N = TOKENS.length;

    return (
        <div className="py-5 px-4 sm:px-6">
            {/* Toggle */}
            <div className="flex items-center justify-center gap-3 mb-4">
                <motion.button
                    onClick={() => setShowMask(true)}
                    className="px-4 py-1.5 rounded-lg text-[13px] font-bold"
                    style={{
                        background: showMask ? "rgba(52,211,153,0.12)" : "rgba(255,255,255,0.02)",
                        border: `1.5px solid ${showMask ? "rgba(52,211,153,0.3)" : "rgba(255,255,255,0.06)"}`,
                        color: showMask ? "#34d399" : "rgba(255,255,255,0.2)",
                    }}
                    whileTap={{ scale: 0.95 }}
                >
                    Mask ON
                </motion.button>
                <motion.button
                    onClick={() => setShowMask(false)}
                    className="px-4 py-1.5 rounded-lg text-[13px] font-bold"
                    style={{
                        background: !showMask ? "rgba(244,63,94,0.12)" : "rgba(255,255,255,0.02)",
                        border: `1.5px solid ${!showMask ? "rgba(244,63,94,0.3)" : "rgba(255,255,255,0.06)"}`,
                        color: !showMask ? "#f43f5e" : "rgba(255,255,255,0.2)",
                    }}
                    whileTap={{ scale: 0.95 }}
                >
                    Mask OFF
                </motion.button>
            </div>

            {/* Matrix */}
            <div className="mx-auto" style={{ maxWidth: 420 }}>
                {/* Column headers */}
                <div className="flex items-center">
                    <div style={{ width: 48 }} />
                    {TOKENS.map((tok, i) => (
                        <div key={i} className="flex-1 text-center">
                            <span className="text-[9px] font-bold" style={{ color: `${COLORS[i]}60` }}>
                                {tok.slice(0, 3)}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Rows */}
                {TOKENS.map((tok, row) => {
                    const isSelected = row === selectedRow;
                    return (
                        <motion.div
                            key={row}
                            className="flex items-center cursor-pointer"
                            style={{
                                background: isSelected ? "rgba(255,255,255,0.03)" : "transparent",
                                borderRadius: 4,
                            }}
                            onClick={() => setSelectedRow(row)}
                            whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                        >
                            <div style={{ width: 48 }} className="text-right pr-2">
                                <span
                                    className="text-[10px] font-bold"
                                    style={{ color: isSelected ? COLORS[row] : `${COLORS[row]}40` }}
                                >
                                    {tok.slice(0, 3)}
                                </span>
                            </div>
                            {Array.from({ length: N }).map((_, col) => {
                                const isMasked = showMask && col > row;
                                const isVisible = !isMasked;
                                const fakeWeight = isVisible
                                    ? (1 / (row + 1)) * (1 + Math.sin(row * 3 + col * 7) * 0.3)
                                    : 0;
                                const isHighlightedCell = isSelected && isVisible;

                                return (
                                    <div key={col} className="flex-1 p-0.5">
                                        <motion.div
                                            className="w-full aspect-square rounded-sm flex items-center justify-center"
                                            style={{
                                                background: isMasked
                                                    ? "rgba(0,0,0,0.4)"
                                                    : `rgba(34,211,238,${fakeWeight * 0.5})`,
                                                border: isHighlightedCell
                                                    ? "1px solid rgba(34,211,238,0.3)"
                                                    : isMasked
                                                        ? "1px solid rgba(255,255,255,0.02)"
                                                        : "1px solid rgba(255,255,255,0.03)",
                                            }}
                                            animate={{
                                                scale: isMasked && showMask ? 1 : 1,
                                                opacity: isMasked ? 0.6 : 1,
                                            }}
                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        >
                                            {isMasked ? (
                                                <span className="text-[8px] text-white/10">−∞</span>
                                            ) : (
                                                <span
                                                    className="text-[8px] font-mono"
                                                    style={{
                                                        color: fakeWeight > 0.3
                                                            ? "rgba(255,255,255,0.5)"
                                                            : "rgba(255,255,255,0.15)",
                                                    }}
                                                >
                                                    {(fakeWeight * 100).toFixed(0)}
                                                </span>
                                            )}
                                        </motion.div>
                                    </div>
                                );
                            })}
                        </motion.div>
                    );
                })}
            </div>

            {/* Selected row info */}
            <motion.div
                className="mt-4 rounded-xl px-4 py-3 text-center"
                style={{
                    background: "rgba(34,211,238,0.04)",
                    border: "1px solid rgba(34,211,238,0.1)",
                }}
                key={`${selectedRow}-${showMask}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <p className="text-[13px]">
                    <span className="font-bold" style={{ color: COLORS[selectedRow] }}>
                        &quot;{TOKENS[selectedRow]}&quot;
                    </span>
                    <span className="text-white/30"> can see: </span>
                    {TOKENS.slice(0, showMask ? selectedRow + 1 : N).map((t, i) => (
                        <span key={i}>
                            <span className="font-semibold" style={{ color: `${COLORS[i]}90` }}>{t}</span>
                            {i < (showMask ? selectedRow : N - 1) && <span className="text-white/15">, </span>}
                        </span>
                    ))}
                    {!showMask && (
                        <span className="text-[11px] ml-2" style={{ color: "rgba(244,63,94,0.5)" }}>
                            ← sees everything (cheating!)
                        </span>
                    )}
                </p>
            </motion.div>
        </div>
    );
}

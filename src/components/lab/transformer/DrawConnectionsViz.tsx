"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, Undo2 } from "lucide-react";

/*
  DrawConnectionsViz — v7 (text-first, SpotlightViz style)
  Words as inline text (no pill boxes). Click word A → click word B = ghost arc.
  Click existing arc again = increase weight. Click weight-3 = remove.
  Demo ghost arc on mount. Reveal shows "ATTENTION" with sparkles.
*/

const WORDS = ["The", "cat", "sat", "on", "the", "warm", "mat"];
const MAX_CONNECTIONS = 10;
const REVEAL_THRESHOLD = 3;

type Weight = 1 | 2 | 3;
interface Connection { from: number; to: number; weight: Weight }

/* Arc path (same as SpotlightViz) — curve above words */
function arcPath(from: { x: number; y: number }, to: { x: number; y: number }): string {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const curvature = Math.min(dist * 0.38, 70);
    const midX = (from.x + to.x) / 2;
    const midY = Math.min(from.y, to.y) - curvature;
    return `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`;
}

const SPARKLES = Array.from({ length: 18 }, (_, i) => ({
    angle: (i / 18) * Math.PI * 2,
    dist: 25 + (i % 4) * 18,
    size: 1.5 + (i % 3),
    delay: i * 0.04,
    color: ["#22d3ee", "#fbbf24", "#34d399", "#67e8f9"][i % 4],
}));

export function DrawConnectionsViz() {
    const [connections, setConnections] = useState<Connection[]>([]);
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
    const [revealed, setRevealed] = useState(false);
    const [positions, setPositions] = useState<{ x: number; y: number }[]>([]);
    const [demoPlayed, setDemoPlayed] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

    const canReveal = connections.length >= REVEAL_THRESHOLD && !revealed;
    const canDraw = connections.length < MAX_CONNECTIONS && !revealed;

    /* Measure word centers */
    const measure = useCallback(() => {
        if (!containerRef.current) return;
        const cRect = containerRef.current.getBoundingClientRect();
        setPositions(
            wordRefs.current.map((el) => {
                if (!el) return { x: 0, y: 0 };
                const r = el.getBoundingClientRect();
                return { x: r.left + r.width / 2 - cRect.left, y: r.top + r.height / 2 - cRect.top };
            })
        );
    }, []);

    useEffect(() => {
        measure();
        const t = setTimeout(measure, 400);
        window.addEventListener("resize", measure);
        return () => { window.removeEventListener("resize", measure); clearTimeout(t); };
    }, [measure, connections, revealed]);

    useEffect(() => {
        if (connections.length > 0 && !demoPlayed) setDemoPlayed(true);
    }, [connections.length, demoPlayed]);

    const handleWordClick = useCallback((idx: number) => {
        if (revealed) return;
        if (!demoPlayed) setDemoPlayed(true);
        if (selectedIdx === null) { setSelectedIdx(idx); return; }
        if (selectedIdx === idx) { setSelectedIdx(null); return; }

        const existingIdx = connections.findIndex(
            (c) => (c.from === selectedIdx && c.to === idx) || (c.from === idx && c.to === selectedIdx)
        );
        if (existingIdx !== -1) {
            setConnections((prev) => {
                const u = [...prev];
                if (u[existingIdx].weight === 3) u.splice(existingIdx, 1);
                else u[existingIdx] = { ...u[existingIdx], weight: (u[existingIdx].weight + 1) as Weight };
                return u;
            });
        } else if (canDraw) {
            setConnections((prev) => [
                ...prev,
                { from: Math.min(selectedIdx, idx), to: Math.max(selectedIdx, idx), weight: 1 },
            ]);
        }
        setSelectedIdx(null);
        requestAnimationFrame(measure);
    }, [selectedIdx, connections, canDraw, revealed, demoPlayed, measure]);

    const handleUndo = useCallback(() => { setConnections((p) => p.slice(0, -1)); setSelectedIdx(null); }, []);
    const handleReset = useCallback(() => { setConnections([]); setSelectedIdx(null); setRevealed(false); setDemoPlayed(false); }, []);

    const lineW = (w: Weight) => w === 1 ? 1.2 : w === 2 ? 2 : 3;
    const lineOpacity = (w: Weight) => w === 1 ? 0.35 : w === 2 ? 0.5 : 0.7;

    const showDemo = !demoPlayed && connections.length === 0 && !revealed && positions.length > 0 && positions[1]?.x > 0;
    const isIdle = selectedIdx === null && connections.length === 0 && !revealed;

    return (
        <div className="py-6 sm:py-8 px-2 sm:px-4 space-y-3 select-none">
            {/* ═══ Sentence + arcs ═══ */}
            <div ref={containerRef} className="relative">
                {/* Ghost arcs SVG layer */}
                <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    style={{ overflow: "visible", zIndex: 1 }}
                >
                    <defs>
                        <filter id="draw-arc-glow">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                    </defs>

                    {/* User-drawn arcs */}
                    {connections.map((conn) => {
                        const p1 = positions[conn.from];
                        const p2 = positions[conn.to];
                        if (!p1 || !p2) return null;
                        const path = arcPath(p1, p2);
                        const isAmber = conn.weight === 3;
                        const arcRgb = isAmber ? "251, 191, 36" : "34, 211, 238";
                        return (
                            <motion.path
                                key={`${conn.from}-${conn.to}-${conn.weight}`}
                                d={path}
                                fill="none"
                                stroke={`rgba(${arcRgb}, ${lineOpacity(conn.weight)})`}
                                strokeWidth={lineW(conn.weight)}
                                strokeLinecap="round"
                                filter="url(#draw-arc-glow)"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{
                                    pathLength: { duration: 0.5, ease: "easeOut" },
                                    opacity: { duration: 0.3 },
                                }}
                            />
                        );
                    })}

                    {/* Demo ghost arc: cat → sat */}
                    {showDemo && (
                        <motion.path
                            d={arcPath(
                                positions[1] ?? { x: 0, y: 0 },
                                positions[2] ?? { x: 0, y: 0 }
                            )}
                            fill="none"
                            stroke="rgba(34, 211, 238, 0.3)"
                            strokeWidth={1.2}
                            strokeLinecap="round"
                            filter="url(#draw-arc-glow)"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{
                                pathLength: [0, 1, 1],
                                opacity: [0, 0.4, 0],
                            }}
                            transition={{
                                duration: 2.8,
                                delay: 0.8,
                                times: [0, 0.35, 1],
                                ease: "easeInOut",
                            }}
                            onAnimationComplete={() => setDemoPlayed(true)}
                        />
                    )}
                </svg>

                {/* Scanning spotlight for idle state */}
                {isIdle && (
                    <motion.div
                        className="absolute top-0 bottom-0 pointer-events-none z-0"
                        style={{
                            width: 200,
                            background: "radial-gradient(ellipse at center, rgba(34, 211, 238, 0.045), transparent 70%)",
                            filter: "blur(10px)",
                        }}
                        animate={{ left: ["5%", "75%", "5%"] }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                )}

                {/* Words as inline text */}
                <div className="flex items-baseline gap-x-[0.35em] sm:gap-x-[0.5em] flex-wrap justify-center relative z-10 py-10 sm:py-14 leading-[2.4] sm:leading-[2.6]">
                    {WORDS.map((word, i) => {
                        const isSelected = selectedIdx === i;
                        const wordConns = connections.filter((c) => c.from === i || c.to === i);
                        const hasConn = wordConns.length > 0;
                        const maxWeight = hasConn ? Math.max(...wordConns.map((c) => c.weight)) : 0;
                        const isAmberWord = maxWeight === 3;
                        const wordRgb = isAmberWord ? "251, 191, 36" : "34, 211, 238";
                        const isInvited = selectedIdx !== null && selectedIdx !== i && !revealed;

                        /* Text color states */
                        const color = isSelected
                            ? "#67e8f9"
                            : revealed
                                ? hasConn
                                    ? isAmberWord ? "rgba(251, 191, 36, 0.85)" : "rgba(165, 243, 252, 0.8)"
                                    : "rgba(255, 255, 255, 0.35)"
                                : hasConn
                                    ? isAmberWord ? "rgba(251, 191, 36, 0.75)" : "rgba(165, 243, 252, 0.7)"
                                    : isInvited
                                        ? "rgba(255, 255, 255, 0.65)"
                                        : "rgba(255, 255, 255, 0.7)";

                        const textShadow = isSelected
                            ? "0 0 20px rgba(34, 211, 238, 0.45), 0 0 40px rgba(34, 211, 238, 0.15)"
                            : hasConn
                                ? `0 0 12px rgba(${wordRgb}, 0.2)`
                                : "none";

                        return (
                            <motion.span
                                key={i}
                                ref={(el) => { wordRefs.current[i] = el; }}
                                className={`relative font-medium tracking-[-0.01em] select-none ${revealed ? "" : "cursor-pointer"}`}
                                style={{
                                    fontSize: "clamp(1.3rem, 3vw, 1.75rem)",
                                    color,
                                    textShadow,
                                    transition: "color 0.3s ease, text-shadow 0.35s ease",
                                }}
                                onClick={() => handleWordClick(i)}
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: 1,
                                    scale: isSelected ? 1.1 : 1,
                                    y: isIdle ? [0, -1.5, 0] : 0,
                                }}
                                transition={
                                    isIdle
                                        ? { y: { duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut" }, scale: { duration: 0.25 } }
                                        : { duration: 0.25, ease: "easeOut" }
                                }
                                whileHover={!revealed ? { scale: 1.08 } : undefined}
                                whileTap={!revealed ? { scale: 0.95 } : undefined}
                            >
                                {/* Glow halo behind connected/selected words */}
                                {(isSelected || hasConn) && (
                                    <motion.span
                                        className="absolute inset-0 -inset-x-2 -inset-y-1 rounded-full pointer-events-none"
                                        style={{
                                            background: `radial-gradient(ellipse at center, rgba(${isSelected ? "34, 211, 238" : wordRgb}, ${isSelected ? "0.14" : "0.08"}) 0%, transparent 70%)`,
                                            filter: "blur(6px)",
                                        }}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                )}

                                {/* Active word underline */}
                                {isSelected && (
                                    <motion.span
                                        className="absolute -bottom-1 left-0 right-0 h-[1.5px] rounded-full pointer-events-none"
                                        style={{ background: "linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.5), transparent)" }}
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                )}

                                {/* Invited pulse for non-selected words when one is selected */}
                                {isInvited && (
                                    <motion.span
                                        className="absolute -bottom-0.5 left-1/4 right-1/4 h-[1px] rounded-full pointer-events-none"
                                        style={{ background: "rgba(34, 211, 238, 0.15)" }}
                                        animate={{ opacity: [0.15, 0.35, 0.15] }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                    />
                                )}

                                <span className="relative z-10">{word}</span>
                            </motion.span>
                        );
                    })}
                </div>
            </div>

            {/* ── Controls + hint ── */}
            {!revealed && (
                <div className="space-y-2">
                    {/* Controls row */}
                    <div className="flex items-center justify-center gap-2">
                        <button
                            onClick={handleUndo}
                            disabled={connections.length === 0}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-medium
                                text-white/20 hover:text-white/40 disabled:opacity-10 disabled:cursor-not-allowed transition-all cursor-pointer"
                        >
                            <Undo2 className="w-3 h-3" /> Undo
                        </button>
                        <button
                            onClick={handleReset}
                            disabled={connections.length === 0}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-medium
                                text-white/20 hover:text-white/40 disabled:opacity-10 disabled:cursor-not-allowed transition-all cursor-pointer"
                        >
                            <RotateCcw className="w-3 h-3" /> Reset
                        </button>
                    </div>

                    {/* Hint text */}
                    <AnimatePresence mode="wait">
                        {canReveal ? (
                            <motion.div
                                key="reveal-btn"
                                className="flex justify-center"
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                            >
                                <motion.button
                                    onClick={() => setRevealed(true)}
                                    className="px-5 py-2 rounded-xl text-[13px] sm:text-sm font-medium text-cyan-200/70 transition-all duration-200 cursor-pointer"
                                    style={{
                                        background: "linear-gradient(135deg, rgba(34,211,238,0.06), rgba(34,211,238,0.02))",
                                        border: "1px solid rgba(34,211,238,0.2)",
                                    }}
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    What did you just build?
                                </motion.button>
                            </motion.div>
                        ) : (
                            <motion.p
                                key="hint"
                                className="text-[13px] text-white/30 text-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                {selectedIdx !== null ? (
                                    <>
                                        Now click another word to connect it to{" "}
                                        <span className="text-cyan-300/60 font-medium">&ldquo;{WORDS[selectedIdx]}&rdquo;</span>
                                    </>
                                ) : connections.length === 0 ? (
                                    <>
                                        <span className="text-white/40">Click any word</span>, then click another to draw a connection
                                    </>
                                ) : (
                                    <>
                                        {connections.length} connection{connections.length > 1 ? "s" : ""}{" "}
                                        <span className="text-white/20">
                                            — draw {REVEAL_THRESHOLD - connections.length} more to unlock
                                        </span>
                                    </>
                                )}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>
            )}

            {/* ═══ REVEAL ═══ */}
            <AnimatePresence>
                {revealed && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 pt-2">
                        <div className="relative flex flex-col items-center py-5">
                            {SPARKLES.map((sp, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute rounded-full"
                                    style={{ width: sp.size, height: sp.size, background: sp.color, left: "50%", top: "40%" }}
                                    initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                                    animate={{
                                        x: Math.cos(sp.angle) * sp.dist,
                                        y: Math.sin(sp.angle) * sp.dist,
                                        opacity: [0, 1, 0],
                                        scale: [0, 2, 0],
                                    }}
                                    transition={{ duration: 1.2, delay: 0.2 + sp.delay, ease: "easeOut" }}
                                />
                            ))}

                            <motion.p
                                className="text-sm text-white/35 mb-3"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                You just designed...
                            </motion.p>
                            <motion.h3
                                className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-amber-300 to-cyan-400 bg-clip-text text-transparent bg-[length:200%_auto]"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    backgroundPosition: ["0% center", "200% center"],
                                }}
                                transition={{
                                    opacity: { delay: 0.6, duration: 0.5 },
                                    scale: { delay: 0.6, duration: 0.6, type: "spring", stiffness: 150 },
                                    backgroundPosition: { delay: 1.2, duration: 4, repeat: Infinity, ease: "linear" },
                                }}
                            >
                                ATTENTION
                            </motion.h3>
                        </div>

                        <motion.div
                            className="flex justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.4 }}
                        >
                            <button
                                onClick={handleReset}
                                className="flex items-center gap-1.5 px-4 py-1.5 text-[11px] font-medium
                                    text-white/25 hover:text-white/40 transition-all cursor-pointer"
                            >
                                <RotateCcw className="w-3 h-3" />
                                Try different connections
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

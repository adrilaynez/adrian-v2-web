"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const WORDS = ["king", "wore", "the", "golden", "crown", "wisely"];

const Q_VEC: [number, number][] = [
    [0.3, 0.9], [-0.4, 0.8], [0.1, 0.2], [-0.2, 0.9], [0.9, 0.3], [-0.6, 0.7],
];
const K_VEC: [number, number][] = [
    [0.9, 0.2], [-0.3, 0.7], [0.05, 0.1], [-0.1, 0.8], [0.7, 0.6], [-0.5, 0.5],
];

function dot(a: [number, number], b: [number, number]): number {
    return +(a[0] * b[0] + a[1] * b[1]).toFixed(2);
}
function softmax(arr: number[]): number[] {
    const mx = Math.max(...arr);
    const ex = arr.map(v => Math.exp(v - mx));
    const s = ex.reduce((a, b) => a + b, 0);
    return ex.map(v => v / s);
}

const SCORES: number[][] = WORDS.map((_, qi) => WORDS.map((_, ki) => dot(Q_VEC[qi], K_VEC[ki])));
const WEIGHTS: number[][] = SCORES.map(row => softmax(row));

const EASE = [0.22, 1, 0.36, 1] as const;
const CLR_Q = "#22d3ee";
const CLR_K = ["#a78bfa", "#f472b6", "#94a3b8", "#fbbf24", "#34d399", "#fb923c"];

const INTERP: Record<number, string> = {
    0: '"king" searches for action and regality — "crown" answers loudest.',
    1: '"wore" reaches for objects — "golden" and "crown" respond.',
    2: '"the" barely searches — its Query is too weak to focus.',
    3: '"golden" searches for the noun it describes — "crown" wins.',
    4: '"crown" reaches back for "king" — its royal context.',
    5: '"wisely" searches for the action — "wore" answers.',
};

function aPts(tx: number, ty: number, s: number): string {
    const l = Math.sqrt(tx * tx + ty * ty);
    if (l < 2) return "0,0 0,0 0,0";
    const nx = tx / l, ny = ty / l;
    const bx = tx - nx * s, by = ty - ny * s;
    const px = -ny * (s * 0.45), py = nx * (s * 0.45);
    return `${tx},${ty} ${bx + px},${by + py} ${bx - px},${by - py}`;
}

type Phase = "pick" | "scan" | "rank";

function ScoreBar({ score, maxAbs, color, delay }: { score: number; maxAbs: number; color: string; delay: number }) {
    const pct = maxAbs > 0 ? Math.max(3, (Math.abs(score) / maxAbs) * 100) : 3;
    return (
        <div className="h-[5px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>
            <motion.div className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${color}88, ${color}33)` }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ delay, duration: 0.5, ease: "easeOut" }}
            />
        </div>
    );
}

export function QuerySearchViz() {
    const [qi, setQi] = useState(0);
    const [phase, setPhase] = useState<Phase>("pick");
    const [scanIdx, setScanIdx] = useState(-1);
    const [revealedScores, setRevealedScores] = useState<number[]>([]);
    const [expandedK, setExpandedK] = useState<number | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clearTimer = useCallback(() => {
        if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    }, []);

    const selectWord = useCallback((i: number) => {
        clearTimer();
        setQi(i);
        setPhase("pick");
        setScanIdx(-1);
        setRevealedScores([]);
        setExpandedK(null);
    }, [clearTimer]);

    const startScan = useCallback(() => {
        setPhase("scan");
        setScanIdx(-1);
        setRevealedScores([]);
        setExpandedK(null);
    }, []);

    useEffect(() => {
        if (phase !== "scan") return;
        if (scanIdx < WORDS.length - 1) {
            timerRef.current = setTimeout(() => {
                const next = scanIdx + 1;
                setScanIdx(next);
                setRevealedScores(prev => [...prev, next]);
            }, scanIdx < 0 ? 400 : 700);
            return clearTimer;
        } else {
            timerRef.current = setTimeout(() => setPhase("rank"), 600);
            return clearTimer;
        }
    }, [phase, scanIdx, clearTimer]);

    const sorted = useMemo(() => {
        return WORDS.map((w, ki) => ({ ki, word: w, score: SCORES[qi][ki], weight: WEIGHTS[qi][ki] }))
            .sort((a, b) => b.score - a.score);
    }, [qi]);

    const maxAbs = Math.max(...SCORES[qi].map(Math.abs));

    const qVec = Q_VEC[qi];

    return (
        <div className="py-8 sm:py-14 px-2 sm:px-4">
            <div className="max-w-2xl mx-auto space-y-8">

                {/* ═══ Word selector ═══ */}
                <div className="flex justify-center gap-2 sm:gap-3 flex-wrap">
                    {WORDS.map((word, i) => {
                        const isActive = qi === i;
                        return (
                            <motion.button key={i}
                                className="px-3.5 py-1.5 rounded-full text-[13px] sm:text-[14px] font-semibold cursor-pointer"
                                style={{
                                    background: isActive ? "rgba(34,211,238,0.1)" : "transparent",
                                    border: isActive ? "1px solid rgba(34,211,238,0.3)" : "1px solid rgba(255,255,255,0.06)",
                                    color: isActive ? "#67e8f9" : "rgba(255,255,255,0.35)",
                                }}
                                onClick={() => selectWord(i)}
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}>
                                {word}
                            </motion.button>
                        );
                    })}
                </div>

                {/* ═══ Query display ═══ */}
                <AnimatePresence mode="wait">
                    <motion.div key={`q-${qi}`} className="flex flex-col items-center gap-2"
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-400/30 font-semibold">
                            Q({WORDS[qi]}) — what this word searches for
                        </p>
                        <div className="flex items-center gap-4">
                            <svg width={100} height={100} viewBox="-50 -50 100 100" className="block">
                                <circle cx={0} cy={0} r={38} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                                {(() => {
                                    const tx = qVec[0] * 38, ty = -qVec[1] * 38;
                                    return (
                                        <>
                                            <line x1={0} y1={0} x2={tx} y2={ty} stroke={CLR_Q} strokeWidth={6} strokeLinecap="round" opacity={0.05} />
                                            <motion.line x1={0} y1={0} x2={tx} y2={ty} stroke={CLR_Q} strokeWidth={2.2} strokeLinecap="round"
                                                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, ease: EASE }} />
                                            <motion.polygon points={aPts(tx, ty, 5.5)} fill={CLR_Q}
                                                initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ delay: 0.25 }} />
                                        </>
                                    );
                                })()}
                            </svg>
                            <div className="space-y-1">
                                <div className="flex gap-2">
                                    {qVec.map((v, d) => (
                                        <span key={d} className="text-[12px] font-mono font-semibold tabular-nums"
                                            style={{ color: "rgba(34,211,238,0.65)" }}>
                                            {v >= 0 ? "+" : ""}{v.toFixed(1)}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-[10px] text-white/15">Query vector</p>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* ═══ Scan phase: Q visits each K ═══ */}
                {phase === "pick" && (
                    <motion.div className="flex justify-center"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                        <motion.button onClick={startScan}
                            className="rounded-full px-5 py-2 text-[12px] sm:text-[13px] font-semibold cursor-pointer"
                            style={{
                                background: "linear-gradient(90deg, rgba(34,211,238,0.1), rgba(34,211,238,0.04))",
                                border: "1px solid rgba(34,211,238,0.25)",
                                color: "rgba(34,211,238,0.7)",
                            }}
                            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                            Search all Keys →
                        </motion.button>
                    </motion.div>
                )}

                {phase === "scan" && (
                    <motion.div className="space-y-4"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                        <div className="flex justify-center gap-4 sm:gap-6 flex-wrap">
                            {WORDS.map((word, ki) => {
                                const isVisited = revealedScores.includes(ki);
                                const isCurrent = scanIdx === ki;
                                const score = SCORES[qi][ki];
                                const kVec = K_VEC[ki];
                                return (
                                    <motion.div key={ki} className="flex flex-col items-center gap-1"
                                        animate={{ opacity: isCurrent ? 1 : isVisited ? 0.5 : 0.2 }}
                                        transition={{ duration: 0.3 }}>
                                        <span className="text-[13px] font-bold" style={{ color: CLR_K[ki] }}>{word}</span>
                                        <svg width={60} height={60} viewBox="-30 -30 60 60" className="block">
                                            <circle cx={0} cy={0} r={22} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                                            {(() => {
                                                const tx = kVec[0] * 22, ty = -kVec[1] * 22;
                                                return (
                                                    <>
                                                        <line x1={0} y1={0} x2={tx} y2={ty} stroke={CLR_K[ki]} strokeWidth={1.5} strokeLinecap="round" opacity={0.7} />
                                                        <polygon points={aPts(tx, ty, 4)} fill={CLR_K[ki]} opacity={0.7} />
                                                    </>
                                                );
                                            })()}
                                            {isCurrent && (() => {
                                                const gx = qVec[0] * 22, gy = -qVec[1] * 22;
                                                return (
                                                    <motion.line x1={0} y1={0} x2={gx} y2={gy} stroke={CLR_Q} strokeWidth={1.2}
                                                        strokeLinecap="round" strokeDasharray="3 3" opacity={0.4}
                                                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                                                        transition={{ duration: 0.3 }} />
                                                );
                                            })()}
                                        </svg>
                                        {isVisited && (
                                            <motion.span className="text-[12px] font-mono font-bold tabular-nums"
                                                style={{ color: score > 0.3 ? "#34d399" : score < 0 ? "#f43f5e" : "rgba(255,255,255,0.3)" }}
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.25 }}>
                                                {score >= 0 ? "+" : ""}{score.toFixed(2)}
                                            </motion.span>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                        {scanIdx >= 0 && (
                            <motion.p className="text-center text-[11px] text-white/15 font-mono"
                                key={`scan-${scanIdx}`}
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                Q({WORDS[qi]}) · K({WORDS[scanIdx]}) = <span style={{
                                    color: SCORES[qi][scanIdx] > 0.3 ? "#34d399" : SCORES[qi][scanIdx] < 0 ? "#f43f5e" : "rgba(255,255,255,0.4)"
                                }}>{SCORES[qi][scanIdx].toFixed(2)}</span>
                            </motion.p>
                        )}
                    </motion.div>
                )}

                {/* ═══ Rank phase: sorted results ═══ */}
                {phase === "rank" && (
                    <motion.div className="space-y-5"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: EASE }}>
                        <p className="text-center text-[10px] uppercase tracking-[0.15em] text-white/20 font-semibold">
                            Attention weights — who {WORDS[qi]} listens to most
                        </p>
                        <div className="space-y-1.5 max-w-md mx-auto">
                            {sorted.map(({ ki, word, score, weight }, rank) => {
                                const isExpanded = expandedK === ki;
                                const barColor = weight > 0.22 ? "#fbbf24" : score < 0 ? "#f43f5e" : "#22d3ee";
                                return (
                                    <motion.div key={ki}
                                        className="rounded-lg cursor-pointer overflow-hidden"
                                        style={{
                                            background: isExpanded ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.01)",
                                            border: `1px solid ${isExpanded ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)"}`,
                                        }}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: rank * 0.06, duration: 0.35, ease: EASE }}
                                        onClick={() => setExpandedK(p => p === ki ? null : ki)}
                                        layout>
                                        <div className="flex items-center gap-3 px-3 py-2">
                                            <span className="text-[14px] font-bold shrink-0 w-16"
                                                style={{ color: CLR_K[ki] }}>{word}</span>
                                            <div className="flex-1 min-w-0 space-y-1">
                                                <ScoreBar score={score} maxAbs={maxAbs} color={barColor} delay={rank * 0.06 + 0.1} />
                                            </div>
                                            <span className="text-[12px] font-mono font-bold tabular-nums shrink-0"
                                                style={{ color: score > 0.3 ? "#34d399" : score < 0 ? "#f43f5e" : "rgba(255,255,255,0.35)" }}>
                                                {score >= 0 ? "+" : ""}{score.toFixed(2)}
                                            </span>
                                            <span className="text-[11px] font-mono text-white/20 tabular-nums shrink-0 w-10 text-right">
                                                {Math.round(weight * 100)}%
                                            </span>
                                        </div>
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div className="px-3 pb-2.5"
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.2 }}>
                                                    <div className="flex items-center gap-3 py-1.5">
                                                        <svg width={80} height={80} viewBox="-40 -40 80 80" className="block shrink-0">
                                                            <circle cx={0} cy={0} r={30} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                                                            {(() => {
                                                                const tx = qVec[0] * 30, ty = -qVec[1] * 30;
                                                                const kx = K_VEC[ki][0] * 30, ky = -K_VEC[ki][1] * 30;
                                                                return (
                                                                    <>
                                                                        <line x1={0} y1={0} x2={tx} y2={ty} stroke={CLR_Q} strokeWidth={1.8} strokeLinecap="round" opacity={0.7} />
                                                                        <polygon points={aPts(tx, ty, 4.5)} fill={CLR_Q} opacity={0.7} />
                                                                        <line x1={0} y1={0} x2={kx} y2={ky} stroke={CLR_K[ki]} strokeWidth={1.8} strokeLinecap="round" opacity={0.7} />
                                                                        <polygon points={aPts(kx, ky, 4.5)} fill={CLR_K[ki]} opacity={0.7} />
                                                                    </>
                                                                );
                                                            })()}
                                                        </svg>
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-1.5 text-[11px] font-mono flex-wrap">
                                                                {qVec.map((qv, d) => {
                                                                    const kv = K_VEC[ki][d];
                                                                    const prod = +(qv * kv).toFixed(2);
                                                                    return (
                                                                        <span key={d} className="flex items-center gap-0.5">
                                                                            {d > 0 && <span className="text-white/10 mx-0.5">+</span>}
                                                                            <span style={{ color: CLR_Q + "99" }}>{qv.toFixed(1)}</span>
                                                                            <span className="text-white/12">×</span>
                                                                            <span style={{ color: CLR_K[ki] + "99" }}>{kv.toFixed(1)}</span>
                                                                            <span className="text-white/10">=</span>
                                                                            <span className="font-bold" style={{
                                                                                color: prod > 0 ? "rgba(52,211,153,0.7)" : prod < 0 ? "rgba(244,63,94,0.6)" : "rgba(255,255,255,0.2)"
                                                                            }}>{prod >= 0 ? "+" : ""}{prod.toFixed(2)}</span>
                                                                        </span>
                                                                    );
                                                                })}
                                                                <span className="text-white/15 mx-1">=</span>
                                                                <span className="font-black text-[13px]" style={{
                                                                    color: score > 0.3 ? "#34d399" : score < 0 ? "#f43f5e" : "rgba(255,255,255,0.4)"
                                                                }}>
                                                                    {score >= 0 ? "+" : ""}{score.toFixed(2)}
                                                                </span>
                                                            </div>
                                                            <p className="text-[9px] text-white/12">
                                                                {weight > 0.25 ? "High attention — strong alignment" : weight > 0.15 ? "Moderate attention" : "Low attention — weak match"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })}
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.p key={`interp-${qi}`}
                                className="text-center text-[12px] text-white/20 italic max-w-sm mx-auto leading-relaxed"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                                {INTERP[qi]}
                            </motion.p>
                        </AnimatePresence>

                        <div className="flex justify-center gap-3">
                            <button onClick={() => setPhase("pick")}
                                className="text-[11px] text-white/20 hover:text-white/40 transition-colors cursor-pointer">
                                ↺ Replay scan
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

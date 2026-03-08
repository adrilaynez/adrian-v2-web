"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

/*
  V42 — BlockBuilderViz ⭐⭐ (MOST INTERACTIVE)
  The learner assembles the Transformer block by placing tiles in correct order.
  Desktop: click tile from bank to place in next open slot.
  Mobile: same tap interaction (no drag needed).
  Wrong placement → bounce + contextual error.
  All correct → confetti + pipeline morph + flowing particles.
  Height: ~480px. All text ≥ 13px.
*/

type TileType = "norm" | "attention" | "add" | "ffn";

interface TileDef {
    type: TileType;
    label: string;
    icon: string;
    color: string;
}

const TILE_DEFS: Record<TileType, Omit<TileDef, "type">> = {
    norm:      { label: "Normalize",    icon: "⚖️", color: "#a78bfa" },
    attention: { label: "Listen",       icon: "👂", color: "#22d3ee" },
    add:       { label: "Add Original", icon: "⊕",  color: "#34d399" },
    ffn:       { label: "Think",        icon: "🧠", color: "#fbbf24" },
};

const CORRECT_ORDER: TileType[] = ["norm", "attention", "add", "norm", "ffn", "add"];

const INITIAL_BANK: TileType[] = ["norm", "attention", "add", "norm", "ffn", "add"];

const ERROR_MESSAGES: Record<number, string> = {
    0: "Attention needs normalized input first!",
    1: "After normalizing, it's time to listen!",
    2: "After attention, add the original input back!",
    3: "The FFN needs its own normalization!",
    4: "Time to think about what was heard!",
    5: "One more residual connection to keep the signal alive!",
};

/* Confetti particle */
interface Particle {
    id: number;
    x: number;
    y: number;
    color: string;
    size: number;
    angle: number;
    velocity: number;
}

function generateConfetti(): Particle[] {
    const colors = ["#22d3ee", "#34d399", "#fbbf24", "#a78bfa", "#f472b6", "#fb923c"];
    return Array.from({ length: 36 }, (_, i) => ({
        id: i,
        x: 50 + Math.random() * 0,
        y: 50,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 4 + Math.random() * 6,
        angle: (Math.PI * 2 * i) / 36 + (Math.random() - 0.5) * 0.5,
        velocity: 120 + Math.random() * 180,
    }));
}

export function BlockBuilderViz() {
    const [placed, setPlaced] = useState<(TileType | null)[]>([null, null, null, null, null, null]);
    const [bank, setBank] = useState<(TileType | null)[]>([...INITIAL_BANK]);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [errorSlot, setErrorSlot] = useState<number | null>(null);
    const [complete, setComplete] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [shakeTile, setShakeTile] = useState<number | null>(null);
    const confettiParticles = useMemo(() => generateConfetti(), []);

    const nextSlot = placed.findIndex(s => s === null);

    /* Place a tile */
    const handlePlace = useCallback((bankIndex: number) => {
        if (complete) return;
        const tileType = bank[bankIndex];
        if (!tileType) return;
        if (nextSlot === -1) return;

        const expected = CORRECT_ORDER[nextSlot];
        if (tileType !== expected) {
            /* Wrong! */
            setErrorMsg(ERROR_MESSAGES[nextSlot]);
            setErrorSlot(nextSlot);
            setShakeTile(bankIndex);
            setTimeout(() => { setErrorMsg(null); setErrorSlot(null); setShakeTile(null); }, 2000);
            return;
        }

        /* Correct! */
        setErrorMsg(null);
        setErrorSlot(null);
        const newPlaced = [...placed];
        newPlaced[nextSlot] = tileType;
        setPlaced(newPlaced);

        const newBank = [...bank];
        newBank[bankIndex] = null;
        setBank(newBank);

        /* Check completion */
        if (newPlaced.every(s => s !== null)) {
            setTimeout(() => {
                setComplete(true);
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 2500);
            }, 400);
        }
    }, [bank, placed, nextSlot, complete]);

    /* Reset */
    const handleReset = useCallback(() => {
        setPlaced([null, null, null, null, null, null]);
        setBank([...INITIAL_BANK]);
        setComplete(false);
        setShowConfetti(false);
        setErrorMsg(null);
        setErrorSlot(null);
    }, []);

    /* Flowing particles for complete state */
    const [flowTick, setFlowTick] = useState(0);
    useEffect(() => {
        if (!complete) return;
        const t = setInterval(() => setFlowTick(v => v + 1), 60);
        return () => clearInterval(t);
    }, [complete]);

    return (
        <div className="py-6 sm:py-8 px-3 sm:px-6 relative overflow-hidden" style={{ minHeight: 480 }}>

            {/* ═══ Confetti ═══ */}
            <AnimatePresence>
                {showConfetti && confettiParticles.map((p) => (
                    <motion.div
                        key={p.id}
                        className="absolute rounded-full pointer-events-none"
                        style={{
                            width: p.size,
                            height: p.size,
                            background: p.color,
                            left: "50%",
                            top: "40%",
                            zIndex: 20,
                        }}
                        initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                        animate={{
                            x: Math.cos(p.angle) * p.velocity,
                            y: Math.sin(p.angle) * p.velocity - 40,
                            opacity: 0,
                            scale: 0.3,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                    />
                ))}
            </AnimatePresence>

            {/* ═══ Success message ═══ */}
            <AnimatePresence>
                {complete && (
                    <motion.div
                        className="text-center mb-4"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    >
                        <p className="text-[18px] sm:text-[20px] font-bold bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400 bg-clip-text text-transparent">
                            🎉 You assembled a Transformer block!
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex flex-col lg:flex-row items-start justify-center gap-6 lg:gap-10">

                {/* ═══ LEFT — Component Bank ═══ */}
                {!complete && (
                    <motion.div
                        className="flex flex-row lg:flex-col gap-2 flex-wrap justify-center lg:min-w-[160px]"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <p className="text-[14px] font-semibold text-white/30 w-full text-center lg:text-left mb-1">
                            Components
                        </p>
                        {bank.map((tileType, bi) => {
                            if (!tileType) return (
                                <div key={bi} className="w-[130px] h-[48px] rounded-xl border border-dashed border-white/5" />
                            );
                            const def = TILE_DEFS[tileType];
                            const isShaking = shakeTile === bi;
                            return (
                                <motion.button
                                    key={bi}
                                    onClick={() => handlePlace(bi)}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[14px] font-bold cursor-pointer transition-all"
                                    style={{
                                        background: `linear-gradient(135deg, ${def.color}12, ${def.color}06)`,
                                        border: `1.5px solid ${def.color}40`,
                                        color: def.color,
                                        backdropFilter: "blur(8px)",
                                        minWidth: 130,
                                    }}
                                    whileHover={{ scale: 1.04, boxShadow: `0 0 20px -4px ${def.color}30` }}
                                    whileTap={{ scale: 0.95 }}
                                    animate={isShaking ? { x: [0, -8, 8, -6, 6, 0] } : {}}
                                    transition={isShaking ? { duration: 0.4, type: "spring", stiffness: 300 } : {}}
                                >
                                    <span className="text-[16px]">{def.icon}</span>
                                    {def.label}
                                </motion.button>
                            );
                        })}
                    </motion.div>
                )}

                {/* ═══ RIGHT — Assembly Area ═══ */}
                <div className="flex flex-col items-center gap-1">
                    {/* Input label */}
                    <div
                        className="px-4 py-1.5 rounded-full text-[13px] font-semibold mb-2"
                        style={{ color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                        ↓ Input
                    </div>

                    {CORRECT_ORDER.map((_, si) => {
                        const placedType = placed[si];
                        const isNext = si === nextSlot && !complete;
                        const isError = errorSlot === si;

                        return (
                            <div key={si} className="flex flex-col items-center">
                                {/* Connector */}
                                {si > 0 && (
                                    <div className="w-px h-4" style={{
                                        background: placed[si - 1]
                                            ? `${TILE_DEFS[placed[si - 1]!].color}30`
                                            : "rgba(255,255,255,0.04)"
                                    }} />
                                )}

                                {/* Slot */}
                                <motion.div
                                    className="rounded-xl flex items-center justify-center gap-2 relative"
                                    style={{
                                        width: 200,
                                        height: 48,
                                        background: placedType
                                            ? `linear-gradient(135deg, ${TILE_DEFS[placedType].color}12, ${TILE_DEFS[placedType].color}06)`
                                            : "rgba(255,255,255,0.015)",
                                        border: placedType
                                            ? `1.5px solid ${TILE_DEFS[placedType].color}50`
                                            : isNext
                                                ? `1.5px dashed rgba(255,255,255,0.15)`
                                                : "1.5px dashed rgba(255,255,255,0.05)",
                                        backdropFilter: "blur(8px)",
                                    }}
                                    animate={
                                        isNext ? { scale: [1, 1.02, 1] } :
                                        isError ? { borderColor: ["rgba(244,63,94,0.5)", "rgba(244,63,94,0.15)"] } :
                                        placedType ? { scale: [1, 1.08, 1] } : {}
                                    }
                                    transition={
                                        isNext ? { duration: 2, repeat: Infinity, ease: "easeInOut" } :
                                        placedType ? { type: "spring", stiffness: 300, damping: 20 } :
                                        { duration: 0.3 }
                                    }
                                >
                                    {placedType ? (
                                        <>
                                            <span className="text-[16px]">{TILE_DEFS[placedType].icon}</span>
                                            <span className="text-[14px] font-bold" style={{ color: TILE_DEFS[placedType].color }}>
                                                {TILE_DEFS[placedType].label}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-[13px] font-mono" style={{ color: isNext ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.07)" }}>
                                            Step {si + 1}
                                        </span>
                                    )}

                                    {/* Flowing particle on complete */}
                                    {complete && placedType && (
                                        <motion.div
                                            className="absolute rounded-full"
                                            style={{
                                                width: 6, height: 6,
                                                background: TILE_DEFS[placedType].color,
                                                boxShadow: `0 0 8px ${TILE_DEFS[placedType].color}60`,
                                                left: "50%",
                                            }}
                                            animate={{
                                                y: [-(si % 2 === 0 ? 20 : 18), si % 2 === 0 ? 20 : 18],
                                                opacity: [0.3, 0.8, 0.3],
                                            }}
                                            transition={{
                                                duration: 1.5,
                                                repeat: Infinity,
                                                delay: si * 0.15,
                                                ease: "easeInOut",
                                            }}
                                        />
                                    )}
                                </motion.div>
                            </div>
                        );
                    })}

                    {/* Output label */}
                    <div className="w-px h-4" style={{ background: complete ? "rgba(244,114,182,0.2)" : "rgba(255,255,255,0.04)" }} />
                    <div
                        className="px-4 py-1.5 rounded-full text-[13px] font-semibold"
                        style={{
                            color: complete ? "#f472b6" : "rgba(255,255,255,0.3)",
                            border: `1px solid ${complete ? "rgba(244,114,182,0.3)" : "rgba(255,255,255,0.06)"}`,
                        }}
                    >
                        ↓ Output
                    </div>
                </div>
            </div>

            {/* ═══ Error message ═══ */}
            <AnimatePresence>
                {errorMsg && (
                    <motion.div
                        className="flex items-center justify-center mt-4"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                    >
                        <div
                            className="px-5 py-2.5 rounded-xl text-[14px] font-semibold"
                            style={{
                                background: "linear-gradient(135deg, rgba(244,63,94,0.12), rgba(244,63,94,0.04))",
                                border: "1.5px solid rgba(244,63,94,0.3)",
                                color: "#f43f5e",
                            }}
                        >
                            {errorMsg}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ═══ Reset button ═══ */}
            <div className="flex items-center justify-center mt-5">
                <motion.button
                    onClick={handleReset}
                    className="text-[13px] font-semibold text-white/20 hover:text-white/40 transition-colors"
                    whileTap={{ scale: 0.95 }}
                >
                    ↻ Reset
                </motion.button>
            </div>
        </div>
    );
}

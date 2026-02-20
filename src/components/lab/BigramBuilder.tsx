"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, FastForward, StepForward, Pause } from "lucide-react";
import { useI18n } from "@/i18n/context";

/* ─────────────────────────────────────────────
   Types
   ───────────────────────────────────────────── */
type Cell = {
    row: string;
    col: string;
    count: number;
    highlight: boolean;
};

type Step = {
    index: number;
    char: string;
    nextChar: string;
};

const DEFAULT_VOCAB = ["h", "e", "l", "o", " ", "w", "r", "d"];

/* ─────────────────────────────────────────────
   BigramBuilder Component
   ───────────────────────────────────────────── */
export function BigramBuilder() {
    const { t } = useI18n();
    const [text, setText] = useState("hello world");
    const [steps, setSteps] = useState<Step[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [cells, setCells] = useState<Cell[]>([]);
    const [vocab, setVocab] = useState<string[]>(DEFAULT_VOCAB);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize matrix and steps when text changes or on reset
    const initialize = (inputText: string = text) => {
        // 1. Parse text and build vocabulary (for this educational demo, we fix vocab to 'helo wrd' roughly)
        // or effectively just use the characters present + space.
        // For simplicity and to match the "Educational vocabulary" concept, let's derive it or stick to a set.
        // The prompt showed "h e l o _ w r d". Let's dynamically build unique chars but keep order stable-ish.

        const cleanText = inputText.toLowerCase().replace(/[^a-z ]/g, ""); // simple filter
        const uniqueChars = Array.from(new Set(cleanText.split(""))).sort();
        // Ensure space is handled visibly if present, usually it is. 
        // If sorting puts space first, that's fine.

        // However, the prompt has a specific set. Let's try to stick to the active text's vocab.
        setVocab(uniqueChars);

        // 2. Build steps
        const newSteps: Step[] = [];
        for (let i = 0; i < cleanText.length - 1; i++) {
            newSteps.push({
                index: i,
                char: cleanText[i],
                nextChar: cleanText[i + 1],
            });
        }
        setSteps(newSteps);

        // 3. Reset state
        setCurrentStepIndex(-1);
        setIsPlaying(false);

        // 4. Initialize empty cells
        const initialCells: Cell[] = [];
        for (const r of uniqueChars) {
            for (const c of uniqueChars) {
                initialCells.push({ row: r, col: c, count: 0, highlight: false });
            }
        }
        setCells(initialCells);
    };

    // Effect to stop timer on unmount
    useEffect(() => {
        return () => stopAutoPlay();
    }, []);

    const stopAutoPlay = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        setIsPlaying(false);
    };

    const handleBuild = () => {
        initialize(text);
        // Automatically reset to start
    };

    const handleNextStep = () => {
        if (currentStepIndex >= steps.length - 1) return;

        const nextIndex = currentStepIndex + 1;
        setCurrentStepIndex(nextIndex);
        updateMatrix(nextIndex);
    };

    const updateMatrix = (stepIdx: number) => {
        const step = steps[stepIdx];
        if (!step) return;

        setCells((prev) =>
            prev.map((cell) => {
                const isMatch = cell.row === step.char && cell.col === step.nextChar;
                return {
                    ...cell,
                    count: isMatch ? cell.count + 1 : cell.count,
                    highlight: isMatch, // Highlighting only the currently updated cell
                };
            })
        );
    };

    const handleAutoPlay = () => {
        if (isPlaying) {
            stopAutoPlay();
            return;
        }

        setIsPlaying(true);
        timerRef.current = setInterval(() => {
            setCurrentStepIndex((prev) => {
                if (prev >= steps.length - 1) {
                    stopAutoPlay();
                    return prev;
                }
                const next = prev + 1;
                // We need to call updateMatrix, but inside setState we can't easily.
                // So we'll use an effect or just simple logic here? 
                // Better to simple triggers.
                // Actually, let's use a ref or effect for the loop, 
                // but since state updates are async, a declarative approach is better.
                // For simplicity in this "lab" component, let's just trigger the update logic.
                // However, `updateMatrix` needs `steps` state. 
                return next;
            });
        }, 500);
    };

    // Sync matrix with step index changes (handling auto-play and manual steps)
    // We need to be careful not to double count if we just used handleNextStep.
    // Refactoring: make step index the source of truth for the visualization *if* we recompute counts?
    // OR, just make the auto-play call handleNextStep directly?

    // Let's rely on an effect that watches `currentStepIndex` to update the cells? 
    // No, that's tricky because we need to increment.
    // Easiest: Re-render matrix from scratch based on steps 0..currentStepIndex.
    useEffect(() => {
        if (currentStepIndex === -1) return;

        // Rebuild counts up to this step
        // This is O(N*M) but N is small (text length) so it's instant. Matches React paradigm better.
        const currentSteps = steps.slice(0, currentStepIndex + 1);
        const lastStep = steps[currentStepIndex];

        setCells(prevCells => {
            // We only need to reset counts? No, we need structure.
            // Let's create a map for speed or just iterate.
            const newCells = prevCells.map(c => ({ ...c, count: 0, highlight: false }));

            for (const s of currentSteps) {
                const cellIndex = newCells.findIndex(c => c.row === s.char && c.col === s.nextChar);
                if (cellIndex !== -1) {
                    newCells[cellIndex].count++;
                }
            }

            // Highlight last one
            if (lastStep) {
                const cellIndex = newCells.findIndex(c => c.row === lastStep.char && c.col === lastStep.nextChar);
                if (cellIndex !== -1) {
                    newCells[cellIndex].highlight = true;
                }
            }
            return newCells;
        });

    }, [currentStepIndex, steps]); // Dependencies matches flow


    const handleInstantComplete = () => {
        stopAutoPlay();
        setCurrentStepIndex(steps.length - 1);
    };

    const handleReset = () => {
        stopAutoPlay();
        setCurrentStepIndex(-1);
        // Cells will clear via effect or we can force it
        setCells((prev) => prev.map(c => ({ ...c, count: 0, highlight: false })));
    };

    // Initial load
    useEffect(() => {
        initialize();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps


    /* ─────────────────────────────────────────────
       Render Helpers
       ───────────────────────────────────────────── */
    const renderCell = (char: string) => (char === " " ? "␠" : char);

    return (
        <div className="w-full bg-black/40 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm">

            {/* ─── Controls Header ─── */}
            <div className="p-6 border-b border-white/10 space-y-6">

                {/* Input Area */}
                <div className="space-y-2">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-white/20"
                        placeholder={t("bigramBuilder.placeholder")}
                    />
                    <div className="flex justify-between text-xs text-white/40 font-mono px-1">
                        <span>{t("bigramBuilder.hint")}</span>
                        <span>{text.length} chars</span>
                    </div>
                </div>

                {/* Button Toolbar */}
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={handleBuild}
                        className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                        {t("bigramBuilder.buttons.build")}
                    </button>

                    <div className="w-px h-8 bg-white/10 mx-2 hidden sm:block" />

                    <button
                        onClick={handleNextStep}
                        disabled={currentStepIndex >= steps.length - 1 || isPlaying}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                        <StepForward className="w-4 h-4" />
                        {t("bigramBuilder.buttons.next")}
                    </button>

                    <button
                        onClick={handleAutoPlay}
                        disabled={currentStepIndex >= steps.length - 1}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        {isPlaying ? t("bigramBuilder.buttons.pause") : t("bigramBuilder.buttons.autoPlay")}
                    </button>

                    <button
                        onClick={handleInstantComplete}
                        disabled={currentStepIndex >= steps.length - 1}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                        <FastForward className="w-4 h-4" />
                        {t("bigramBuilder.buttons.instant")}
                    </button>

                    <div className="flex-1" />

                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 px-4 py-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                        <RotateCcw className="w-4 h-4" />
                        {t("bigramBuilder.buttons.reset")}
                    </button>
                </div>

                {/* Derived state visuals */}
                <div className="flex flex-wrap gap-4 text-xs font-mono text-white/50 bg-black/20 p-3 rounded-lg border border-white/5">
                    <div className="flex items-center gap-2">
                        <span className="text-emerald-500/70 uppercase font-bold tracking-wider text-[10px]">{t("bigramBuilder.vocab")}:</span>
                        <div className="flex gap-1">
                            {vocab.map(char => (
                                <span key={char} className="px-1.5 py-0.5 bg-white/5 rounded border border-white/5 text-white/70">
                                    {renderCell(char)}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

            </div>

            {/* ─── Visualization Area ─── */}
            <div className="p-8 overflow-x-auto bg-black/20 min-h-[400px] flex flex-col items-center justify-center">

                {steps.length > 0 && currentStepIndex >= 0 ? (
                    <div className="mb-8 p-4 border border-emerald-500/30 bg-emerald-500/5 rounded-lg flex gap-4 items-center animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="text-right">
                            <div className="text-[10px] uppercase tracking-widest text-emerald-500/60 mb-1">Current Step</div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-white font-mono">
                                    '{renderCell(steps[currentStepIndex].char)}'
                                </span>
                                <span className="text-white/30">→</span>
                                <span className="text-2xl font-bold text-emerald-400 font-mono">
                                    '{renderCell(steps[currentStepIndex].nextChar)}'
                                </span>
                            </div>
                        </div>
                        <div className="h-8 w-px bg-emerald-500/20" />
                        <div className="text-xs text-white/60 font-mono">
                            Updating cell at row <span className="text-white font-bold">'{renderCell(steps[currentStepIndex].char)}'</span>,
                            col <span className="text-emerald-400 font-bold">'{renderCell(steps[currentStepIndex].nextChar)}'</span>
                        </div>
                    </div>
                ) : (
                    <div className="mb-8 h-[74px] flex items-center justify-center text-white/20 text-sm italic font-mono">
                        {t("bigramBuilder.pressBuild")}
                    </div>
                )}

                {/* Grid */}
                <div className="inline-block border border-white/10 rounded-lg p-4 bg-[#0A0A0A] shadow-2xl">
                    <table>
                        <thead>
                            <tr>
                                <td className="p-2 text-[10px] text-white/20 font-mono text-right italic pr-4">cur \ nxt</td>
                                {vocab.map((colChar) => (
                                    <th key={colChar} className="p-1 w-10 text-center text-sm font-mono text-emerald-400/80 font-normal">
                                        {renderCell(colChar)}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {vocab.map((rowChar) => (
                                <tr key={rowChar}>
                                    <th className="p-1 pr-4 text-center text-sm font-mono text-white/40 font-normal">
                                        {renderCell(rowChar)}
                                    </th>
                                    {vocab.map((colChar) => {
                                        const cell = cells.find(c => c.row === rowChar && c.col === colChar);
                                        const count = cell?.count || 0;
                                        const isHighlight = cell?.highlight;
                                        return (
                                            <td key={colChar} className="p-1">
                                                <motion.div
                                                    layout
                                                    className={`
                                                         w-10 h-10 rounded flex items-center justify-center text-sm font-mono transition-colors duration-300
                                                         ${isHighlight ? 'bg-emerald-500 text-black font-bold scale-110 shadow-[0_0_15px_rgba(16,185,129,0.5)] z-10 relative border border-emerald-400' :
                                                            count > 0 ? 'bg-emerald-900/30 text-emerald-100 border border-emerald-500/10' :
                                                                'bg-white/[0.02] text-white/10 border border-white/[0.02]'}
                                                     `}
                                                >
                                                    {count}
                                                </motion.div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>

        </div>
    );
}

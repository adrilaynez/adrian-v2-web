"use client";

import { useState, useMemo, useCallback } from "react";

const CHARS = ["a", "b", "c", "d", "e"];

const BIGRAM_COUNTS = [
    [0, 50, 10, 5, 35],
    [20, 0, 30, 10, 40],
    [40, 15, 0, 25, 20],
    [10, 30, 20, 0, 40],
    [30, 25, 15, 30, 0],
];

function normalizeRows(matrix: number[][]): number[][] {
    return matrix.map(row => {
        const sum = row.reduce((a, b) => a + b, 0);
        return sum > 0 ? row.map(v => v / sum) : row.map(() => 1 / row.length);
    });
}

function softmaxRows(logits: number[][]): number[][] {
    return logits.map(row => {
        const max = Math.max(...row);
        const exps = row.map(v => Math.exp(v - max));
        const sum = exps.reduce((a, b) => a + b, 0);
        return exps.map(e => e / sum);
    });
}

function initWeights(rows: number, cols: number): number[][] {
    return Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => (Math.random() - 0.5) * 0.5)
    );
}

const BIGRAM_PROBS = normalizeRows(BIGRAM_COUNTS);

function trainStep(weights: number[][], lr: number): number[][] {
    const probs = softmaxRows(weights);
    return weights.map((row, i) =>
        row.map((w, j) => w - lr * (probs[i][j] - BIGRAM_PROBS[i][j]))
    );
}

function matrixDistance(a: number[][], b: number[][]): number {
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < a[i].length; j++) {
            sum += (a[i][j] - b[i][j]) ** 2;
        }
    }
    return Math.sqrt(sum);
}

function HeatCell({ value, maxVal }: { value: number; maxVal: number }) {
    const intensity = maxVal > 0 ? value / maxVal : 0;
    const alpha = Math.max(0.03, Math.min(0.9, intensity));
    return (
        <td className="p-0">
            <div
                className="w-full aspect-square flex items-center justify-center text-[9px] font-mono transition-all duration-200"
                style={{ backgroundColor: `rgba(251,113,133,${alpha})`, color: alpha > 0.4 ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.3)" }}
            >
                {value.toFixed(2)}
            </div>
        </td>
    );
}

export function NNBigramComparison() {
    const [weights, setWeights] = useState(() => initWeights(5, 5));
    const [stepCount, setStepCount] = useState(0);

    const neuralProbs = useMemo(() => softmaxRows(weights), [weights]);
    const distance = useMemo(() => matrixDistance(neuralProbs, BIGRAM_PROBS), [neuralProbs]);
    const bigramMax = useMemo(() => Math.max(...BIGRAM_PROBS.flat()), []);
    const neuralMax = useMemo(() => Math.max(...neuralProbs.flat()), [neuralProbs]);

    const doStep = useCallback(() => {
        setWeights(prev => trainStep(prev, 0.5));
        setStepCount(s => s + 1);
    }, []);

    const doAutoTrain = useCallback(() => {
        setWeights(prev => {
            let w = prev;
            for (let i = 0; i < 20; i++) w = trainStep(w, 0.5);
            return w;
        });
        setStepCount(s => s + 20);
    }, []);

    const handleReset = useCallback(() => {
        setWeights(initWeights(5, 5));
        setStepCount(0);
    }, []);

    return (
        <figure className="my-10 -mx-2 sm:mx-0">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden shadow-[0_0_60px_-15px_rgba(244,63,94,0.05)]">
                <div className="flex items-center gap-3 px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                    <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">
                        Interactive · Bigram vs. Neural Network
                    </span>
                </div>

                <div className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Bigram matrix */}
                        <div>
                            <p className="text-[10px] font-mono uppercase tracking-widest text-emerald-400/60 mb-3">
                                Bigram Probabilities (counting)
                            </p>
                            <div className="overflow-hidden rounded-lg border border-white/[0.06]">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="p-1 text-[9px] font-mono text-white/20 w-8"></th>
                                            {CHARS.map(c => (
                                                <th key={c} className="p-1 text-[9px] font-mono text-white/30 text-center">{c}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {BIGRAM_PROBS.map((row, i) => (
                                            <tr key={i}>
                                                <td className="p-1 text-[9px] font-mono text-white/30 text-center">{CHARS[i]}</td>
                                                {row.map((val, j) => (
                                                    <HeatCell key={j} value={val} maxVal={bigramMax} />
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Neural weights */}
                        <div>
                            <p className="text-[10px] font-mono uppercase tracking-widest text-rose-400/60 mb-3">
                                Neural Network Weights (learned)
                            </p>
                            <div className="overflow-hidden rounded-lg border border-white/[0.06]">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="p-1 text-[9px] font-mono text-white/20 w-8"></th>
                                            {CHARS.map(c => (
                                                <th key={c} className="p-1 text-[9px] font-mono text-white/30 text-center">{c}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {neuralProbs.map((row, i) => (
                                            <tr key={i}>
                                                <td className="p-1 text-[9px] font-mono text-white/30 text-center">{CHARS[i]}</td>
                                                {row.map((val, j) => (
                                                    <HeatCell key={j} value={val} maxVal={neuralMax} />
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-x-5 gap-y-2 mt-5 mb-5 text-[11px] font-mono">
                        <span className="text-white/30">Training steps: <span className="text-white/60 font-bold">{stepCount}</span></span>
                        <span className="text-white/30">Distance: <span className={`font-bold ${distance < 0.1 ? "text-emerald-400" : distance < 0.3 ? "text-amber-400" : "text-rose-400"}`}>
                            {distance.toFixed(4)}
                        </span></span>
                        {distance < 0.1 && (
                            <span className="text-emerald-400/70">✓ Neural weights closely match bigram probabilities</span>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button onClick={doStep}
                            className="px-4 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-mono font-bold hover:bg-rose-500/20 transition-colors">
                            Train 1 Step
                        </button>
                        <button onClick={doAutoTrain}
                            className="px-4 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono font-bold hover:bg-indigo-500/20 transition-colors">
                            Auto-Train ×20
                        </button>
                        <button onClick={handleReset}
                            className="px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/40 text-[11px] font-mono font-bold hover:text-white/60 transition-colors">
                            Reset
                        </button>
                    </div>
                </div>
            </div>
            <figcaption className="mt-3 text-center text-xs text-white/25 italic">
                The neural network learns weights that converge to the same transition probabilities the bigram model computes by counting.
            </figcaption>
        </figure>
    );
}

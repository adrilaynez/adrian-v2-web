"use client";

import { useState, useCallback, useRef } from "react";

function sigmoid(x: number) { return 1 / (1 + Math.exp(-x)); }

const INPUT = 1.0;
const TARGET = 0.8;
const LR = 1.0;
const INITIAL_W = 0.5;
const INITIAL_B = -0.2;

interface TrainingStep {
    step: number;
    w: number;
    b: number;
    yhat: number;
    loss: number;
}

function trainOnce(w: number, b: number): { newW: number; newB: number; yhat: number; loss: number } {
    const z = w * INPUT + b;
    const yhat = sigmoid(z);
    const loss = (yhat - TARGET) ** 2;
    const dLdyhat = 2 * (yhat - TARGET);
    const dyhatdz = yhat * (1 - yhat);
    const dLdz = dLdyhat * dyhatdz;
    return {
        newW: w - LR * dLdz * INPUT,
        newB: b - LR * dLdz,
        yhat,
        loss,
    };
}

export function NNTrainingDemo() {
    const [w, setW] = useState(INITIAL_W);
    const [b, setB] = useState(INITIAL_B);
    const [history, setHistory] = useState<TrainingStep[]>(() => {
        const z = INITIAL_W * INPUT + INITIAL_B;
        const yhat = sigmoid(z);
        return [{ step: 0, w: INITIAL_W, b: INITIAL_B, yhat, loss: (yhat - TARGET) ** 2 }];
    });

    const scrollRef = useRef<HTMLDivElement>(null);

    const doStep = useCallback(() => {
        setW(prev => {
            setB(prevB => {
                const { newW, newB, yhat, loss } = trainOnce(prev, prevB);
                setHistory(h => {
                    const next = [...h, { step: h.length, w: newW, b: newB, yhat, loss }];
                    setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }), 50);
                    return next;
                });
                setW(newW);
                return newB;
            });
            return prev;
        });
    }, []);

    const doAutoTrain = useCallback(() => {
        let currentW = w;
        let currentB = b;
        const newSteps: TrainingStep[] = [];
        let nextIdx = history.length;

        for (let i = 0; i < 10; i++) {
            const { newW, newB, yhat, loss } = trainOnce(currentW, currentB);
            newSteps.push({ step: nextIdx++, w: newW, b: newB, yhat, loss });
            currentW = newW;
            currentB = newB;
        }

        setW(currentW);
        setB(currentB);
        setHistory(h => [...h, ...newSteps]);
        setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }), 50);
    }, [w, b, history.length]);

    const handleReset = useCallback(() => {
        setW(INITIAL_W);
        setB(INITIAL_B);
        const z = INITIAL_W * INPUT + INITIAL_B;
        const yhat = sigmoid(z);
        setHistory([{ step: 0, w: INITIAL_W, b: INITIAL_B, yhat, loss: (yhat - TARGET) ** 2 }]);
    }, []);

    const latest = history[history.length - 1];
    const maxLoss = Math.max(...history.map(h => h.loss), 0.001);

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
                        Interactive · Training Loop
                    </span>
                </div>

                <div className="p-4 sm:p-6">
                    {/* Current state */}
                    <div className="flex flex-wrap gap-x-5 gap-y-2 mb-5">
                        <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] px-3 py-2 text-center">
                            <p className="text-[9px] font-mono text-white/25 mb-0.5">Step</p>
                            <p className="text-lg font-mono font-bold text-white/70">{latest.step}</p>
                        </div>
                        <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] px-3 py-2 text-center">
                            <p className="text-[9px] font-mono text-white/25 mb-0.5">Weight</p>
                            <p className="text-lg font-mono font-bold text-rose-400">{latest.w.toFixed(4)}</p>
                        </div>
                        <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] px-3 py-2 text-center">
                            <p className="text-[9px] font-mono text-white/25 mb-0.5">Bias</p>
                            <p className="text-lg font-mono font-bold text-amber-400">{latest.b.toFixed(4)}</p>
                        </div>
                        <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] px-3 py-2 text-center">
                            <p className="text-[9px] font-mono text-white/25 mb-0.5">Prediction</p>
                            <p className="text-lg font-mono font-bold text-indigo-400">{latest.yhat.toFixed(4)}</p>
                        </div>
                        <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] px-3 py-2 text-center">
                            <p className="text-[9px] font-mono text-white/25 mb-0.5">Loss</p>
                            <p className="text-lg font-mono font-bold text-emerald-400">{latest.loss.toFixed(6)}</p>
                        </div>
                    </div>

                    {/* Mini loss sparkline */}
                    <div className="mb-5">
                        <p className="text-[9px] font-mono uppercase tracking-widest text-white/25 mb-2">Loss over training steps</p>
                        <div className="flex items-end gap-px h-12 bg-white/[0.02] rounded-lg border border-white/[0.04] px-1 py-1 overflow-hidden">
                            {history.slice(-50).map((h, i) => (
                                <div
                                    key={i}
                                    className="flex-1 min-w-[2px] max-w-[8px] bg-rose-500/50 rounded-sm transition-all duration-100"
                                    style={{ height: `${Math.max((h.loss / maxLoss) * 100, 2)}%` }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* History table */}
                    <div ref={scrollRef} className="max-h-40 overflow-y-auto rounded-lg border border-white/[0.06] mb-5">
                        <table className="w-full text-[10px] font-mono">
                            <thead>
                                <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                                    <th className="px-3 py-2 text-left text-white/30 font-bold">#</th>
                                    <th className="px-3 py-2 text-right text-white/30 font-bold">w</th>
                                    <th className="px-3 py-2 text-right text-white/30 font-bold">b</th>
                                    <th className="px-3 py-2 text-right text-white/30 font-bold">ŷ</th>
                                    <th className="px-3 py-2 text-right text-white/30 font-bold">Loss</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map(h => (
                                    <tr key={h.step} className="border-b border-white/[0.03] last:border-0">
                                        <td className="px-3 py-1.5 text-white/40">{h.step}</td>
                                        <td className="px-3 py-1.5 text-right text-rose-400/70">{h.w.toFixed(4)}</td>
                                        <td className="px-3 py-1.5 text-right text-amber-400/70">{h.b.toFixed(4)}</td>
                                        <td className="px-3 py-1.5 text-right text-indigo-400/70">{h.yhat.toFixed(4)}</td>
                                        <td className="px-3 py-1.5 text-right text-white/50">{h.loss.toFixed(6)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button onClick={doStep}
                            className="px-4 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-mono font-bold hover:bg-rose-500/20 transition-colors">
                            Train 1 Step
                        </button>
                        <button onClick={doAutoTrain}
                            className="px-4 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono font-bold hover:bg-indigo-500/20 transition-colors">
                            Auto-Train ×10
                        </button>
                        <button onClick={handleReset}
                            className="px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/40 text-[11px] font-mono font-bold hover:text-white/60 transition-colors">
                            Reset
                        </button>
                    </div>
                </div>
            </div>
            <figcaption className="mt-3 text-center text-xs text-white/25 italic">
                Each step adjusts weights to reduce the loss. Watch how the prediction converges toward the target ({TARGET}).
            </figcaption>
        </figure>
    );
}

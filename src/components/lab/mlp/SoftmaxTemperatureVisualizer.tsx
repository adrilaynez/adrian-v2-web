"use client";

import { useState, useMemo } from "react";

/*
  SoftmaxTemperatureVisualizer
  Shows how temperature reshapes a fixed logit distribution via softmax.
  Pure math — no backend.

  Conceptual: static logits, temperature slider 0.1 → 3.0
*/

// Fixed illustrative logits — intentionally asymmetric
const TOKENS = ["e", "t", "a", "o", "i", "n", "s", "h", "r", " "];
const LOGITS = [3.2, 2.8, 2.1, 1.9, 1.7, 1.4, 1.1, 0.8, 0.5, 2.5];

function softmax(logits: number[], temp: number): number[] {
    const scaled = logits.map(l => l / Math.max(temp, 0.01));
    const maxVal = Math.max(...scaled);
    const exps = scaled.map(l => Math.exp(l - maxVal));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map(e => e / sum);
}

const TEMP_PRESETS = [
    { label: "0.1 — Deterministic", t: 0.1 },
    { label: "0.7 — Balanced", t: 0.7 },
    { label: "1.0 — Neutral", t: 1.0 },
    { label: "2.5 — Creative", t: 2.5 },
];

function lerp(a: string, b: string, t: number): string {
    // Interpolate between two hex colors
    const parse = (hex: string) => [
        parseInt(hex.slice(1, 3), 16),
        parseInt(hex.slice(3, 5), 16),
        parseInt(hex.slice(5, 7), 16),
    ];
    const [r1, g1, b1] = parse(a);
    const [r2, g2, b2] = parse(b);
    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const bl = Math.round(b1 + (b2 - b1) * t);
    return `rgb(${r},${g},${bl})`;
}

export function SoftmaxTemperatureVisualizer() {
    const [temp, setTemp] = useState(1.0);

    const probs = useMemo(() => softmax(LOGITS, temp), [temp]);
    const maxProb = Math.max(...probs);

    const topToken = TOKENS[probs.indexOf(maxProb)];
    const entropy = -probs.reduce((s, p) => s + (p > 0 ? p * Math.log(p) : 0), 0);
    const uniformEntropy = Math.log(TOKENS.length);
    const entropyPct = Math.min(entropy / uniformEntropy, 1);

    const getModeLabel = () => {
        if (temp < 0.4) return { label: "Deterministic", sub: "Always picks the top token. No creativity.", color: "text-violet-400" };
        if (temp < 0.8) return { label: "Conservative", sub: "Mostly picks top tokens with occasional variety.", color: "text-blue-400" };
        if (temp < 1.2) return { label: "Neutral", sub: "Standard sampling — balanced quality and diversity.", color: "text-emerald-400" };
        if (temp < 2.0) return { label: "Creative", sub: "Explores less likely options. More surprising output.", color: "text-amber-400" };
        return { label: "Chaotic", sub: "Nearly uniform — picks almost any token at random.", color: "text-rose-400" };
    };

    const mode = getModeLabel();

    return (
        <div className="rounded-xl border border-white/[0.06] bg-black/30 p-5 space-y-5">
            <div className="space-y-1">
                <p className="text-[10px] font-mono uppercase tracking-widest text-white/25">Softmax Temperature · Conceptual</p>
                <p className="text-sm text-white/50 leading-relaxed">
                    Temperature reshapes the probability distribution without changing the ranking of tokens.
                    Low temperature sharpens the distribution; high temperature flattens it.
                </p>
            </div>

            {/* Temperature slider */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">Temperature</span>
                    <span className="text-sm font-mono font-bold text-violet-300">{temp.toFixed(2)}</span>
                </div>
                <input
                    type="range" min={5} max={300} step={5}
                    value={Math.round(temp * 100)}
                    onChange={e => setTemp(Number(e.target.value) / 100)}
                    className="w-full accent-violet-500 cursor-pointer"
                />
                <div className="flex justify-between text-[8px] font-mono text-white/15">
                    <span>0.05 Deterministic</span>
                    <span>1.0 Neutral</span>
                    <span>3.0 Chaotic</span>
                </div>
            </div>

            {/* Mode label */}
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                <span className={`text-sm font-mono font-bold ${mode.color}`}>{mode.label}</span>
                <span className="text-[10px] font-mono text-white/30 max-w-xs text-right">{mode.sub}</span>
            </div>

            {/* Bar chart */}
            <div className="space-y-1.5">
                <p className="text-[9px] font-mono uppercase tracking-widest text-white/20">Probability distribution</p>
                {TOKENS.map((tok, i) => {
                    const p = probs[i];
                    const isTop = tok === topToken;
                    const barColor = isTop
                        ? "rgb(167,139,250)"
                        : lerp("#1e3a2f", "#3b82f6", p / maxProb);
                    return (
                        <div key={tok} className="flex items-center gap-2">
                            <span className={`text-[10px] font-mono w-4 text-center shrink-0 ${isTop ? "text-violet-300 font-bold" : "text-white/30"}`}>
                                {tok === " " ? "⎵" : tok}
                            </span>
                            <div className="flex-1 h-5 rounded bg-white/[0.03] overflow-hidden relative">
                                <div
                                    className="absolute left-0 top-0 h-full rounded transition-all duration-200"
                                    style={{ width: `${(p * 100).toFixed(1)}%`, backgroundColor: barColor }}
                                />
                            </div>
                            <span className="text-[9px] font-mono text-white/30 w-10 text-right">
                                {(p * 100).toFixed(1)}%
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                    <p className="text-[8px] font-mono uppercase tracking-widest text-white/20 mb-1">Top token</p>
                    <p className="text-lg font-mono font-bold text-violet-300">{topToken === " " ? "⎵" : topToken}</p>
                    <p className="text-[9px] font-mono text-white/30">{(maxProb * 100).toFixed(1)}%</p>
                </div>
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                    <p className="text-[8px] font-mono uppercase tracking-widest text-white/20 mb-1">Entropy</p>
                    <p className="text-lg font-mono font-bold text-white/60">{entropy.toFixed(2)}</p>
                    <p className="text-[9px] font-mono text-white/30">{(entropyPct * 100).toFixed(0)}% of max</p>
                </div>
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                    <p className="text-[8px] font-mono uppercase tracking-widest text-white/20 mb-1">Spread</p>
                    <div className="h-3 rounded bg-white/[0.04] overflow-hidden mt-2">
                        <div
                            className="h-full rounded bg-violet-500/50 transition-all duration-200"
                            style={{ width: `${(entropyPct * 100).toFixed(0)}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-2">
                {TEMP_PRESETS.map(({ label, t }) => (
                    <button
                        key={label}
                        onClick={() => setTemp(t)}
                        className={`px-2.5 py-1 rounded text-[9px] font-mono border transition-all ${
                            Math.abs(temp - t) < 0.05
                                ? "bg-violet-500/20 text-violet-300 border-violet-500/40"
                                : "bg-white/[0.03] text-white/30 border-white/[0.06] hover:text-white/50"
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <div className="rounded-lg border border-violet-500/10 bg-violet-500/[0.03] px-4 py-3 text-[11px] text-white/40 leading-relaxed">
                <span className="text-violet-400/70 font-semibold">Note: </span>
                Temperature does not change the model&apos;s knowledge — only how randomly it samples from what it knows.
                The token rankings stay the same; only the sharpness of the distribution changes.
            </div>
        </div>
    );
}

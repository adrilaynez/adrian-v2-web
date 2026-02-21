"use client";

import { useState } from "react";

/*
  LossIntuitionVisualizer
  Interactive cross-entropy loss explainer.
  Pure math — no backend needed.

  - Slider: predicted probability p ∈ [0, 1]
  - Displays loss = -log(p)
  - "Surprise meter" bar
  - Pedagogical labels: confident/right vs confident/wrong
*/

function lossFn(p: number): number {
    return p <= 0 ? 20 : -Math.log(Math.max(p, 1e-7));
}

const PRESETS = [
    { label: "99% confident", p: 0.99, tag: "Nearly certain" },
    { label: "50% guess", p: 0.5, tag: "Random guess" },
    { label: "10% likely", p: 0.1, tag: "Unlikely" },
    { label: "1% chance", p: 0.01, tag: "Almost impossible" },
];

export function LossIntuitionVisualizer() {
    const [prob, setProb] = useState(0.7);

    const loss = lossFn(prob);
    const maxLoss = lossFn(0.01);
    const barFraction = Math.min(loss / maxLoss, 1);

    const getEmoji = () => {
        if (prob >= 0.8) return { icon: "😌", label: "Confident and correct. Tiny loss.", color: "text-emerald-400" };
        if (prob >= 0.5) return { icon: "🤔", label: "Uncertain. Moderate loss.", color: "text-yellow-400" };
        if (prob >= 0.2) return { icon: "😬", label: "Mostly wrong. High loss.", color: "text-amber-400" };
        return { icon: "😱", label: "Confident and wrong. Massive loss. Model punished hard.", color: "text-rose-400" };
    };

    const { icon, label, color } = getEmoji();

    return (
        <div className="rounded-xl border border-white/[0.06] bg-black/30 p-5 space-y-5">
            <div className="space-y-1">
                <p className="text-[10px] font-mono uppercase tracking-widest text-white/25">Loss Intuition · Cross-Entropy</p>
                <p className="text-sm text-white/50 leading-relaxed">
                    Drag the slider to set how confident the model is that the <em>correct</em> token comes next.
                </p>
            </div>

            {/* Slider */}
            <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono text-white/30">
                    <span>0% — completely wrong</span>
                    <span>100% — perfectly correct</span>
                </div>
                <input
                    type="range" min={1} max={99} step={1}
                    value={Math.round(prob * 100)}
                    onChange={e => setProb(Number(e.target.value) / 100)}
                    className="w-full accent-violet-500 cursor-pointer"
                />
                <div className="flex justify-between items-center">
                    <span className="text-xs font-mono font-bold text-violet-300">
                        Model assigns <span className="text-white">{(prob * 100).toFixed(0)}%</span> probability to correct token
                    </span>
                </div>
            </div>

            {/* Main display */}
            <div className="grid grid-cols-2 gap-4">
                {/* Loss value */}
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 text-center">
                    <p className="text-[9px] font-mono uppercase tracking-widest text-white/25 mb-2">Loss = −log(p)</p>
                    <p className="text-3xl font-mono font-bold text-white/80">{loss.toFixed(2)}</p>
                    <p className="text-[9px] font-mono text-white/20 mt-1">
                        −log({prob.toFixed(2)}) = {loss.toFixed(3)}
                    </p>
                </div>

                {/* Surprise meter */}
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
                    <p className="text-[9px] font-mono uppercase tracking-widest text-white/25 mb-3">Surprise Meter</p>
                    <div className="h-4 rounded bg-white/[0.04] overflow-hidden mb-2">
                        <div
                            className="h-full rounded transition-all duration-300"
                            style={{
                                width: `${(barFraction * 100).toFixed(0)}%`,
                                background: `linear-gradient(to right, rgb(52,211,153), rgb(251,146,60) 50%, rgb(244,63,94))`,
                            }}
                        />
                    </div>
                    <p className={`text-[10px] font-mono ${color}`}>
                        {icon} {label}
                    </p>
                </div>
            </div>

            {/* Presets */}
            <div className="space-y-2">
                <p className="text-[9px] font-mono uppercase tracking-widest text-white/20">Try these scenarios</p>
                <div className="flex flex-wrap gap-2">
                    {PRESETS.map(({ label: l, p, tag }) => (
                        <button
                            key={l}
                            onClick={() => setProb(p)}
                            className={`px-2.5 py-1 rounded text-[9px] font-mono border transition-all ${
                                Math.abs(prob - p) < 0.01
                                    ? "bg-violet-500/20 text-violet-300 border-violet-500/40"
                                    : "bg-white/[0.03] text-white/30 border-white/[0.06] hover:text-white/50 hover:border-white/15"
                            }`}
                        >
                            {l} <span className="text-white/20">· {tag}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Key insight */}
            <div className="rounded-lg border border-amber-500/15 bg-amber-500/[0.03] px-4 py-3 text-[11px] text-white/40 leading-relaxed">
                <span className="text-amber-400/70 font-semibold">Key insight: </span>
                The loss is not linear — it blows up as confidence approaches zero.
                A model that says &quot;1% chance&quot; when the right answer was obvious suffers 4.6× more loss than a model that said &quot;50%.&quot;
                Training forces the model to avoid being confidently wrong.
            </div>
        </div>
    );
}

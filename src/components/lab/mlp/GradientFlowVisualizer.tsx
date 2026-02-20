"use client";

import { useState } from "react";

/* ─────────────────────────────────────────────
   GradientFlowVisualizer
   Conceptual illustration of vanishing vs
   exploding gradients across network layers.
   ───────────────────────────────────────────── */

type GradientMode = "vanishing" | "stable" | "exploding";

const MODES: { value: GradientMode; label: string; color: string; border: string; bg: string }[] = [
    { value: "vanishing",  label: "Vanishing",  color: "text-rose-400",    border: "border-rose-500/40",    bg: "bg-rose-500/20" },
    { value: "stable",     label: "Stable",     color: "text-emerald-400", border: "border-emerald-500/40", bg: "bg-emerald-500/20" },
    { value: "exploding",  label: "Exploding",  color: "text-amber-400",   border: "border-amber-500/40",   bg: "bg-amber-500/20" },
];

const NUM_LAYERS = 8;

function getGradientMagnitudes(mode: GradientMode): number[] {
    const mags: number[] = [];
    for (let i = 0; i < NUM_LAYERS; i++) {
        const layerFromOutput = NUM_LAYERS - 1 - i; // gradient flows backward
        if (mode === "vanishing") {
            mags.push(Math.pow(0.55, layerFromOutput));
        } else if (mode === "stable") {
            mags.push(0.8 + Math.sin(i * 0.7) * 0.15);
        } else {
            mags.push(Math.pow(1.6, layerFromOutput));
        }
    }
    // Normalize to [0,1] for display
    const max = Math.max(...mags);
    return mags.map((m) => m / (max || 1));
}

function getBarColor(mode: GradientMode, magnitude: number): string {
    if (mode === "vanishing") {
        const alpha = 0.15 + magnitude * 0.85;
        return `rgba(251,113,133,${alpha.toFixed(2)})`;
    } else if (mode === "stable") {
        const alpha = 0.5 + magnitude * 0.5;
        return `rgba(52,211,153,${alpha.toFixed(2)})`;
    } else {
        const alpha = 0.15 + magnitude * 0.85;
        return `rgba(251,146,60,${alpha.toFixed(2)})`;
    }
}

function getDescription(mode: GradientMode): string {
    switch (mode) {
        case "vanishing":
            return "Gradients shrink exponentially as they flow backward through layers. Early layers receive almost no learning signal — the network effectively stops learning in its deepest parts.";
        case "stable":
            return "With proper initialization and normalization, gradient magnitudes remain roughly consistent across all layers. Every layer receives meaningful updates.";
        case "exploding":
            return "Gradients grow exponentially as they flow backward. Early layers receive enormous updates that destabilize training — weights oscillate wildly and loss diverges.";
    }
}

export function GradientFlowVisualizer() {
    const [mode, setMode] = useState<GradientMode>("vanishing");
    const magnitudes = getGradientMagnitudes(mode);

    return (
        <div className="space-y-4">
            {/* Mode toggle */}
            <div className="flex flex-wrap gap-2">
                {MODES.map((m) => (
                    <button
                        key={m.value}
                        onClick={() => setMode(m.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                            mode === m.value
                                ? `${m.color} ${m.bg} ${m.border} border`
                                : "text-white/30 bg-white/[0.02] border border-white/[0.06] hover:border-white/15"
                        }`}
                    >
                        {m.label}
                    </button>
                ))}
            </div>

            {/* Layer stack */}
            <div className="rounded-xl border border-white/[0.06] bg-black/30 p-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/25">
                        ← Gradient flows backward from output
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/25">
                        |∇| magnitude
                    </span>
                </div>

                {/* Layers */}
                <div className="space-y-2">
                    {magnitudes.map((mag, i) => {
                        const isOutput = i === NUM_LAYERS - 1;
                        const isInput = i === 0;
                        const label = isInput ? "Input Layer" : isOutput ? "Output Layer" : `Hidden ${i}`;
                        const barWidth = Math.max(3, mag * 100);

                        return (
                            <div key={i} className="flex items-center gap-3">
                                <span className="text-[10px] font-mono text-white/30 w-20 text-right shrink-0">
                                    {label}
                                </span>
                                <div className="flex-1 h-6 rounded bg-white/[0.03] border border-white/[0.04] overflow-hidden relative">
                                    <div
                                        className="h-full rounded transition-all duration-500 ease-out"
                                        style={{
                                            width: `${barWidth}%`,
                                            backgroundColor: getBarColor(mode, mag),
                                        }}
                                    />
                                </div>
                                <span className="text-[10px] font-mono text-white/25 w-10 text-right shrink-0">
                                    {mag < 0.01 ? "≈0" : mag.toFixed(2)}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Direction arrow */}
                <div className="flex items-center justify-center gap-2 mt-4 text-white/15">
                    <svg width="16" height="10" viewBox="0 0 16 10">
                        <path d="M0 5 L12 5 M8 1 L12 5 L8 9" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    </svg>
                    <span className="text-[9px] font-mono uppercase tracking-widest">Forward pass direction</span>
                    <svg width="16" height="10" viewBox="0 0 16 10">
                        <path d="M0 5 L12 5 M8 1 L12 5 L8 9" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    </svg>
                </div>
            </div>

            {/* Description */}
            <p className="text-[11px] text-white/30 leading-relaxed">{getDescription(mode)}</p>
        </div>
    );
}

"use client";

import { useState, useMemo } from "react";

function relu(x: number) { return Math.max(0, x); }

function Slider({ label, value, min, max, step, onChange, accent = "rose" }: {
    label: string; value: number; min: number; max: number; step: number;
    onChange: (v: number) => void; accent?: string;
}) {
    const cls: Record<string, string> = {
        rose: "accent-rose-400", amber: "accent-amber-400", white: "accent-white",
    };
    return (
        <label className="block">
            <div className="flex justify-between mb-1">
                <span className="text-[10px] font-mono text-white/40">{label}</span>
                <span className="text-[11px] font-mono font-bold text-white/60">{value.toFixed(2)}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={value}
                onChange={e => onChange(+e.target.value)}
                className={`w-full cursor-pointer ${cls[accent] || cls.rose}`} />
        </label>
    );
}

function ContribBar({ label, value, color, maxRange = 4 }: {
    label: string; value: number; color: string; maxRange?: number;
}) {
    const pct = (value / maxRange) * 50;
    const barLeft = value >= 0 ? 50 : 50 + pct;
    const barWidth = Math.min(Math.abs(pct), 50);
    const barColor = value >= 0
        ? "bg-rose-500/50 border-rose-500/30"
        : "bg-indigo-500/50 border-indigo-500/30";

    return (
        <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-white/40 w-12 text-right shrink-0">{label}</span>
            <div className="flex-1 h-5 bg-white/[0.03] rounded relative border border-white/[0.04]">
                <div className="absolute top-0 bottom-0 w-px bg-white/10 left-1/2" />
                <div
                    className={`absolute top-0.5 bottom-0.5 rounded-sm ${barColor} border transition-all duration-150`}
                    style={{ left: `${barLeft}%`, width: `${barWidth}%` }}
                />
            </div>
            <span className={`text-[11px] font-mono font-bold w-14 text-right shrink-0 ${color}`}>
                {value >= 0 ? "+" : ""}{value.toFixed(2)}
            </span>
        </div>
    );
}

export function NNWeightBiasExplorer() {
    const [w1, setW1] = useState(1.2);
    const [w2, setW2] = useState(-0.8);
    const [b, setB] = useState(0.3);
    const [x1, setX1] = useState(1.0);
    const [x2, setX2] = useState(0.5);

    const contrib1 = useMemo(() => w1 * x1, [w1, x1]);
    const contrib2 = useMemo(() => w2 * x2, [w2, x2]);
    const z = useMemo(() => contrib1 + contrib2 + b, [contrib1, contrib2, b]);
    const y = useMemo(() => relu(z), [z]);

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
                        Interactive · Weight &amp; Bias Explorer
                    </span>
                </div>

                <div className="p-4 sm:p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Contribution breakdown */}
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-mono uppercase tracking-widest text-white/25 mb-4">
                                Contribution Breakdown
                            </p>
                            <div className="space-y-2.5">
                                <ContribBar label="w₁·x₁" value={contrib1} color="text-rose-400" />
                                <ContribBar label="w₂·x₂" value={contrib2} color="text-rose-400" />
                                <ContribBar label="bias" value={b} color="text-amber-400" />
                                <div className="border-t border-white/[0.06] pt-2.5">
                                    <ContribBar label="z" value={z} color="text-white/70" />
                                </div>
                            </div>

                            {/* Output gauge */}
                            <div className="mt-5 flex items-center gap-3 rounded-lg bg-white/[0.03] border border-white/[0.06] px-4 py-3">
                                <span className="text-[10px] font-mono text-white/40">ReLU(z)</span>
                                <div className="flex-1 h-3 bg-white/[0.04] rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-emerald-500/60 to-emerald-400/80 rounded-full transition-all duration-200"
                                        style={{ width: `${Math.min(Math.max(y / 4 * 100, 0), 100)}%` }}
                                    />
                                </div>
                                <span className="text-sm font-mono font-bold text-emerald-400">{y.toFixed(3)}</span>
                            </div>
                        </div>

                        {/* Sliders */}
                        <div className="shrink-0 w-full lg:w-52 space-y-3">
                            <p className="text-[10px] font-mono uppercase tracking-widest text-white/25 mb-3">Parameters</p>
                            <Slider label="Weight w₁" value={w1} min={-2} max={2} step={0.05} onChange={setW1} accent="rose" />
                            <Slider label="Weight w₂" value={w2} min={-2} max={2} step={0.05} onChange={setW2} accent="rose" />
                            <Slider label="Bias b" value={b} min={-2} max={2} step={0.05} onChange={setB} accent="amber" />
                            <div className="border-t border-white/[0.06] pt-3 mt-4">
                                <p className="text-[10px] font-mono uppercase tracking-widest text-white/25 mb-3">Test Inputs</p>
                                <Slider label="Input x₁" value={x1} min={-2} max={2} step={0.1} onChange={setX1} accent="white" />
                                <div className="mt-3">
                                    <Slider label="Input x₂" value={x2} min={-2} max={2} step={0.1} onChange={setX2} accent="white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <figcaption className="mt-3 text-center text-xs text-white/25 italic">
                Drag weight sliders to see how each input&#39;s importance changes. The bias shifts the baseline.
            </figcaption>
        </figure>
    );
}

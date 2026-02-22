"use client";

import { useMemo, useState } from "react";

const W = 440;
const H = 180;
const PAD = { left: 40, right: 20, top: 20, bottom: 30 };
const CHART_W = W - PAD.left - PAD.right;
const CHART_H = H - PAD.top - PAD.bottom;
const STEPS = 100;
const Y_MAX = 2.2;
const Y_MIN = 0;
const GRID_Y = [0.5, 1.0, 1.5, 2.0];

function gaussian(): number {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function baseLoss(t: number): number {
    return 2.0 * Math.exp(-0.03 * t) + 0.1;
}

function toSvgX(t: number, total: number): number {
    return PAD.left + (t / (total - 1)) * CHART_W;
}

function toSvgY(loss: number): number {
    return PAD.top + CHART_H - ((loss - Y_MIN) / (Y_MAX - Y_MIN)) * CHART_H;
}

function polyline(pts: [number, number][]): string {
    return pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
}

type Curve = { pts: [number, number][]; color: string; label: string; batchLabel: string };

export function BatchSizeLossCurveComparison() {
    const [seed, setSeed] = useState(0);

    const curves: Curve[] = useMemo(() => {
        void seed;
        const sgd: [number, number][] = [];
        for (let t = 0; t < STEPS; t++) {
            sgd.push([toSvgX(t, STEPS), toSvgY(Math.max(0.05, baseLoss(t) + gaussian() * 0.15))]);
        }

        const mini: [number, number][] = [];
        for (let t = 0; t < STEPS; t++) {
            mini.push([toSvgX(t, STEPS), toSvgY(Math.max(0.05, baseLoss(t) + gaussian() * 0.15 / Math.sqrt(32)))]);
        }

        const full: [number, number][] = [];
        const fullSteps = 20;
        for (let t = 0; t < fullSteps; t++) {
            full.push([toSvgX(t * (STEPS / fullSteps), STEPS), toSvgY(baseLoss(t * (STEPS / fullSteps)))]);
        }

        return [
            { pts: sgd,  color: "rgb(251,113,133)", label: "SGD",       batchLabel: "batch=1" },
            { pts: mini, color: "rgb(52,211,153)",  label: "Mini-batch", batchLabel: "batch=32" },
            { pts: full, color: "rgb(96,165,250)",  label: "Full-batch", batchLabel: "full dataset" },
        ];
    }, [seed]);

    const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

    return (
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 space-y-2">
            <svg
                viewBox={`0 0 ${W} ${H}`}
                className="w-full"
                style={{ maxHeight: H }}
                onMouseLeave={() => setTooltip(null)}
            >
                {/* Grid lines */}
                {GRID_Y.map(y => {
                    const sy = toSvgY(y);
                    return (
                        <g key={y}>
                            <line x1={PAD.left} y1={sy} x2={W - PAD.right} y2={sy}
                                stroke="rgba(255,255,255,0.05)" strokeWidth={1} strokeDasharray="3,3" />
                            <text x={PAD.left - 4} y={sy + 3.5} textAnchor="end"
                                fill="rgba(255,255,255,0.2)" fontSize={8} fontFamily="monospace">{y.toFixed(1)}</text>
                        </g>
                    );
                })}

                {/* Axes */}
                <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + CHART_H}
                    stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
                <line x1={PAD.left} y1={PAD.top + CHART_H} x2={W - PAD.right} y2={PAD.top + CHART_H}
                    stroke="rgba(255,255,255,0.12)" strokeWidth={1} />

                {/* Axis labels */}
                <text x={PAD.left + CHART_W / 2} y={H - 2} textAnchor="middle"
                    fill="rgba(255,255,255,0.2)" fontSize={8} fontFamily="monospace">Training Steps</text>
                <text x={8} y={PAD.top + CHART_H / 2} textAnchor="middle"
                    fill="rgba(255,255,255,0.2)" fontSize={8} fontFamily="monospace"
                    transform={`rotate(-90,8,${PAD.top + CHART_H / 2})`}>Loss</text>

                {/* Curves */}
                {curves.map(({ pts, color, label }) => (
                    <g key={label}>
                        <polyline
                            points={polyline(pts)}
                            fill="none"
                            stroke={color}
                            strokeWidth={1.5}
                            strokeLinejoin="round"
                            opacity={0.85}
                        />
                        {pts.map(([px, py], i) => (
                            <circle key={i} cx={px} cy={py} r={3} fill="transparent"
                                onMouseEnter={() => setTooltip({ x: px, y: py, text: `step ${Math.round(i * (STEPS / pts.length))}, loss ${((py - PAD.top) / CHART_H * -(Y_MAX - Y_MIN) + Y_MAX).toFixed(3)}` })}
                            />
                        ))}
                    </g>
                ))}

                {/* Tooltip */}
                {tooltip && (
                    <g>
                        <rect x={tooltip.x + 6} y={tooltip.y - 16} width={110} height={16}
                            rx={3} fill="rgba(0,0,0,0.7)" />
                        <text x={tooltip.x + 10} y={tooltip.y - 4}
                            fill="rgba(255,255,255,0.7)" fontSize={8} fontFamily="monospace">
                            {tooltip.text}
                        </text>
                    </g>
                )}
            </svg>

            {/* Legend */}
            <div className="flex items-center justify-center gap-5 pt-1">
                {curves.map(({ color, label, batchLabel }) => (
                    <div key={label} className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                        <span className="text-[10px] font-mono text-white/40">
                            {label} <span className="text-white/20">({batchLabel})</span>
                        </span>
                    </div>
                ))}
                <button
                    onClick={() => setSeed(s => s + 1)}
                    className="text-[9px] font-mono text-white/20 hover:text-white/40 border border-white/10 rounded px-1.5 py-0.5 transition-colors"
                >
                    resample
                </button>
            </div>
        </div>
    );
}

"use client";

import { useState, useMemo } from "react";
import { useI18n } from "@/i18n/context";

const PK = "models.neuralNetworks.sections.playground";

function relu(x: number) {
    return Math.max(0, x);
}

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

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";

export function NNPerceptronDiagram() {
    const { t } = useI18n();
    const [x1, setX1] = useState(1.0);
    const [x2, setX2] = useState(0.5);
    const [w1, setW1] = useState(0.7);
    const [w2, setW2] = useState(-0.3);
    const [b, setB] = useState(0.1);

    const z = useMemo(() => w1 * x1 + w2 * x2 + b, [w1, x1, w2, x2, b]);
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
                        Interactive · Perceptron
                    </span>
                </div>

                <div className="p-4 sm:p-6">
                    <svg viewBox="0 0 640 245" className="w-full mb-6" role="img" aria-label="Perceptron flow diagram">
                        {/* Connections */}
                        <line x1="86" y1="70" x2="250" y2="116" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
                        <line x1="86" y1="180" x2="250" y2="134" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
                        <line x1="317" y1="125" x2="385" y2="125" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
                        <line x1="460" y1="125" x2="531" y2="125" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
                        <line x1="285" y1="207" x2="285" y2="158" stroke="rgba(251,191,36,0.2)" strokeWidth="1.5" strokeDasharray="4 3" />

                        {/* Arrowheads */}
                        <polygon points="253,116 245,111 245,121" fill="rgba(255,255,255,0.08)" />
                        <polygon points="253,134 245,129 245,139" fill="rgba(255,255,255,0.08)" />
                        <polygon points="388,125 380,120 380,130" fill="rgba(255,255,255,0.08)" />
                        <polygon points="534,125 526,120 526,130" fill="rgba(255,255,255,0.08)" />
                        <polygon points="285,158 280,166 290,166" fill="rgba(251,191,36,0.15)" />

                        {/* Weight labels */}
                        <text x="160" y="82" textAnchor="middle" fontSize="10" fontFamily={FONT} fill="rgb(251,113,133)" fontWeight="600">
                            w₁ = {w1.toFixed(2)}
                        </text>
                        <text x="160" y="166" textAnchor="middle" fontSize="10" fontFamily={FONT} fill="rgb(251,113,133)" fontWeight="600">
                            w₂ = {w2.toFixed(2)}
                        </text>

                        {/* Input x₁ */}
                        <circle cx="60" cy="70" r="26" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                        <text x="60" y="63" textAnchor="middle" fontSize="9" fontFamily={FONT} fill="rgba(255,255,255,0.3)">x₁</text>
                        <text x="60" y="79" textAnchor="middle" fontSize="14" fontFamily={FONT} fill="rgba(255,255,255,0.7)" fontWeight="700">{x1.toFixed(1)}</text>

                        {/* Input x₂ */}
                        <circle cx="60" cy="180" r="26" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                        <text x="60" y="173" textAnchor="middle" fontSize="9" fontFamily={FONT} fill="rgba(255,255,255,0.3)">x₂</text>
                        <text x="60" y="189" textAnchor="middle" fontSize="14" fontFamily={FONT} fill="rgba(255,255,255,0.7)" fontWeight="700">{x2.toFixed(1)}</text>

                        {/* Sum + bias node */}
                        <circle cx="285" cy="125" r="32" fill="rgba(251,113,133,0.04)" stroke="rgba(251,113,133,0.2)" strokeWidth="1.5" />
                        <text x="285" y="118" textAnchor="middle" fontSize="9" fontFamily={FONT} fill="rgba(255,255,255,0.3)">Σ + b</text>
                        <text x="285" y="136" textAnchor="middle" fontSize="14" fontFamily={FONT} fill="rgb(251,113,133)" fontWeight="700">{z.toFixed(2)}</text>

                        {/* Bias label */}
                        <text x="285" y="228" textAnchor="middle" fontSize="10" fontFamily={FONT} fill="rgba(251,191,36,0.6)" fontWeight="600">
                            b = {b.toFixed(2)}
                        </text>

                        {/* Activation node */}
                        <rect x="388" y="97" width="72" height="56" rx="10" fill="rgba(129,140,248,0.04)" stroke="rgba(129,140,248,0.2)" strokeWidth="1.5" />
                        <text x="424" y="118" textAnchor="middle" fontSize="9" fontFamily={FONT} fill="rgba(255,255,255,0.3)">ReLU</text>
                        <text x="424" y="136" textAnchor="middle" fontSize="14" fontFamily={FONT} fill="rgb(129,140,248)" fontWeight="700">{y.toFixed(2)}</text>

                        {/* Output node */}
                        <circle cx="560" cy="125" r="26" fill="rgba(52,211,153,0.04)" stroke="rgba(52,211,153,0.2)" strokeWidth="1.5" />
                        <text x="560" y="118" textAnchor="middle" fontSize="9" fontFamily={FONT} fill="rgba(255,255,255,0.3)">output</text>
                        <text x="560" y="136" textAnchor="middle" fontSize="14" fontFamily={FONT} fill="rgb(52,211,153)" fontWeight="700">{y.toFixed(2)}</text>
                    </svg>

                    {/* Sliders */}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-4">
                        <Slider label={t(`${PK}.diagram.inputX1`)} value={x1} min={-2} max={2} step={0.1} onChange={setX1} accent="white" />
                        <Slider label={t(`${PK}.diagram.inputX2`)} value={x2} min={-2} max={2} step={0.1} onChange={setX2} accent="white" />
                        <Slider label={t(`${PK}.diagram.weightW1`)} value={w1} min={-2} max={2} step={0.05} onChange={setW1} accent="rose" />
                        <Slider label={t(`${PK}.diagram.weightW2`)} value={w2} min={-2} max={2} step={0.05} onChange={setW2} accent="rose" />
                    </div>
                    <div className="max-w-[calc(50%-0.75rem)]">
                        <Slider label={t(`${PK}.diagram.biasB`)} value={b} min={-2} max={2} step={0.05} onChange={setB} accent="amber" />
                    </div>

                    {/* Equation */}
                    <div className="mt-5 rounded-lg bg-white/[0.03] border border-white/[0.06] px-4 py-2.5 text-center overflow-x-auto">
                        <span className="text-[11px] font-mono text-white/30 whitespace-nowrap">
                            z = ({w1.toFixed(2)} × {x1.toFixed(1)}) + ({w2.toFixed(2)} × {x2.toFixed(1)}) + {b.toFixed(2)} ={" "}
                            <span className="text-rose-400 font-bold">{z.toFixed(3)}</span>
                            {" → ReLU → "}
                            <span className="text-emerald-400 font-bold">{y.toFixed(3)}</span>
                        </span>
                    </div>
                </div>
            </div>
            <figcaption className="mt-3 text-center text-xs text-white/25 italic">
                {t(`${PK}.diagram.caption`)}
            </figcaption>
        </figure>
    );
}

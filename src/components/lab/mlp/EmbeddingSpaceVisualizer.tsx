"use client";

import { useState, useMemo, useCallback } from "react";

/* ─────────────────────────────────────────────
   EmbeddingSpaceVisualizer
   2D projection of token embeddings showing
   how similar tokens cluster in embedding space.
   ───────────────────────────────────────────── */

interface Token {
    label: string;
    x: number;
    y: number;
    group: string;
}

const GROUPS: Record<string, { color: string; dot: string }> = {
    animal:   { color: "rgb(139,92,246)",  dot: "bg-violet-500"  },
    food:     { color: "rgb(251,146,60)",  dot: "bg-orange-400"  },
    verb:     { color: "rgb(52,211,153)",  dot: "bg-emerald-400" },
    place:    { color: "rgb(96,165,250)",  dot: "bg-blue-400"    },
    adjective:{ color: "rgb(251,113,133)", dot: "bg-rose-400"    },
};

// Mock 2D embedding projections (as if PCA/t-SNE reduced)
const TOKENS: Token[] = [
    // Animals
    { label: "cat",     x: 0.18, y: 0.22, group: "animal" },
    { label: "dog",     x: 0.22, y: 0.18, group: "animal" },
    { label: "kitten",  x: 0.16, y: 0.26, group: "animal" },
    { label: "puppy",   x: 0.25, y: 0.15, group: "animal" },
    { label: "bird",    x: 0.12, y: 0.30, group: "animal" },
    { label: "fish",    x: 0.10, y: 0.35, group: "animal" },
    // Food
    { label: "pizza",   x: 0.75, y: 0.20, group: "food" },
    { label: "pasta",   x: 0.78, y: 0.25, group: "food" },
    { label: "bread",   x: 0.72, y: 0.28, group: "food" },
    { label: "cake",    x: 0.80, y: 0.18, group: "food" },
    { label: "rice",    x: 0.70, y: 0.32, group: "food" },
    // Verbs
    { label: "run",     x: 0.45, y: 0.75, group: "verb" },
    { label: "walk",    x: 0.42, y: 0.80, group: "verb" },
    { label: "jump",    x: 0.48, y: 0.72, group: "verb" },
    { label: "eat",     x: 0.55, y: 0.70, group: "verb" },
    { label: "sleep",   x: 0.38, y: 0.82, group: "verb" },
    // Places
    { label: "house",   x: 0.82, y: 0.72, group: "place" },
    { label: "school",  x: 0.85, y: 0.78, group: "place" },
    { label: "park",    x: 0.78, y: 0.80, group: "place" },
    { label: "city",    x: 0.88, y: 0.68, group: "place" },
    // Adjectives
    { label: "big",     x: 0.15, y: 0.72, group: "adjective" },
    { label: "small",   x: 0.18, y: 0.78, group: "adjective" },
    { label: "fast",    x: 0.22, y: 0.68, group: "adjective" },
    { label: "slow",    x: 0.20, y: 0.75, group: "adjective" },
    { label: "hot",     x: 0.12, y: 0.80, group: "adjective" },
];

const CANVAS = { w: 440, h: 360 };
const PAD = 36;

function toSvgX(v: number) { return PAD + v * (CANVAS.w - PAD * 2); }
function toSvgY(v: number) { return PAD + v * (CANVAS.h - PAD * 2); }

function dist(a: Token, b: Token) {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

export function EmbeddingSpaceVisualizer() {
    const [selected, setSelected] = useState<string | null>(null);

    const neighbors = useMemo(() => {
        if (!selected) return new Set<string>();
        const tok = TOKENS.find((t) => t.label === selected);
        if (!tok) return new Set<string>();
        const sorted = [...TOKENS]
            .filter((t) => t.label !== selected)
            .sort((a, b) => dist(tok, a) - dist(tok, b));
        return new Set(sorted.slice(0, 4).map((t) => t.label));
    }, [selected]);

    const selectedToken = TOKENS.find((t) => t.label === selected);

    const handleClick = useCallback((label: string) => {
        setSelected((prev) => (prev === label ? null : label));
    }, []);

    return (
        <div className="space-y-4">
            {/* SVG canvas */}
            <div className="rounded-xl border border-white/[0.06] bg-black/30 overflow-hidden">
                <svg viewBox={`0 0 ${CANVAS.w} ${CANVAS.h}`} className="w-full" style={{ maxHeight: 400 }}>
                    {/* Grid lines */}
                    {[0.25, 0.5, 0.75].map((v) => (
                        <g key={v}>
                            <line x1={toSvgX(v)} y1={PAD} x2={toSvgX(v)} y2={CANVAS.h - PAD} stroke="rgba(255,255,255,0.03)" strokeWidth={1} />
                            <line x1={PAD} y1={toSvgY(v)} x2={CANVAS.w - PAD} y2={toSvgY(v)} stroke="rgba(255,255,255,0.03)" strokeWidth={1} />
                        </g>
                    ))}

                    {/* Neighbor lines */}
                    {selected && selectedToken && TOKENS.filter((t) => neighbors.has(t.label)).map((t) => (
                        <line
                            key={t.label}
                            x1={toSvgX(selectedToken.x)}
                            y1={toSvgY(selectedToken.y)}
                            x2={toSvgX(t.x)}
                            y2={toSvgY(t.y)}
                            stroke="rgba(139,92,246,0.3)"
                            strokeWidth={1.5}
                            strokeDasharray="4 3"
                        />
                    ))}

                    {/* Tokens */}
                    {TOKENS.map((tok) => {
                        const g = GROUPS[tok.group];
                        const isSelected = tok.label === selected;
                        const isNeighbor = neighbors.has(tok.label);
                        const dimmed = selected && !isSelected && !isNeighbor;

                        return (
                            <g
                                key={tok.label}
                                onClick={() => handleClick(tok.label)}
                                className="cursor-pointer"
                                opacity={dimmed ? 0.2 : 1}
                            >
                                <circle
                                    cx={toSvgX(tok.x)}
                                    cy={toSvgY(tok.y)}
                                    r={isSelected ? 8 : isNeighbor ? 6.5 : 5}
                                    fill={g.color}
                                    stroke={isSelected ? "white" : isNeighbor ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.15)"}
                                    strokeWidth={isSelected ? 2 : 1}
                                />
                                <text
                                    x={toSvgX(tok.x)}
                                    y={toSvgY(tok.y) - (isSelected ? 12 : 9)}
                                    textAnchor="middle"
                                    fill={isSelected || isNeighbor ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.35)"}
                                    fontSize={isSelected ? 11 : 9}
                                    fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                                    fontWeight={isSelected ? 700 : 400}
                                >
                                    {tok.label}
                                </text>
                            </g>
                        );
                    })}

                    {/* Axis labels */}
                    <text x={CANVAS.w / 2} y={CANVAS.h - 6} textAnchor="middle" fill="rgba(255,255,255,0.15)" fontSize={9} fontFamily="monospace">Dimension 1 (PCA)</text>
                    <text x={10} y={CANVAS.h / 2} textAnchor="middle" fill="rgba(255,255,255,0.15)" fontSize={9} fontFamily="monospace" transform={`rotate(-90,10,${CANVAS.h / 2})`}>Dimension 2 (PCA)</text>
                </svg>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3">
                {Object.entries(GROUPS).map(([group, g]) => (
                    <div key={group} className="flex items-center gap-1.5">
                        <div className={`w-2.5 h-2.5 rounded-full ${g.dot}`} />
                        <span className="text-[10px] font-mono text-white/40 capitalize">{group}s</span>
                    </div>
                ))}
            </div>

            {/* Info */}
            <p className="text-[11px] text-white/25 leading-relaxed">
                {selected
                    ? `Click another token or click "${selected}" again to deselect. Dashed lines connect to the 4 nearest neighbors in embedding space.`
                    : "Click any token to highlight its nearest neighbors. Tokens in the same semantic category naturally cluster together."}
            </p>
        </div>
    );
}

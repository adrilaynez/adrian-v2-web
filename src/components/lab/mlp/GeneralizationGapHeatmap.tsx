"use client";

import { useMemo, useState } from "react";
import type { MLPGridConfig } from "@/types/lmLab";

/*
  GeneralizationGapHeatmap
  X = embedding_dim, Y = hidden_size
  Color = generalization_gap (averaged across learning rates)
  Click cell → tooltip with full info
*/

function gapColor(gap: number | null): string {
    if (gap == null) return "rgba(255,255,255,0.03)";
    if (gap < 0) return "rgba(52,211,153,0.5)";    // underfitting / healthy
    if (gap < 0.1) return "rgba(52,211,153,0.35)";
    if (gap < 0.2) return "rgba(250,204,21,0.35)";
    if (gap < 0.3) return "rgba(251,146,60,0.45)";
    return "rgba(244,63,94,0.5)";                    // heavy overfitting
}

function gapLabel(gap: number | null): string {
    if (gap == null) return "—";
    return gap > 0 ? `+${gap.toFixed(3)}` : gap.toFixed(3);
}

export interface GeneralizationGapHeatmapProps {
    configs: MLPGridConfig[];
}

interface CellData {
    embDim: number;
    hiddenSize: number;
    avgGap: number | null;
    bestLoss: number;
    count: number;
    configs: MLPGridConfig[];
}

export function GeneralizationGapHeatmap({ configs }: GeneralizationGapHeatmapProps) {
    const [hovered, setHovered] = useState<CellData | null>(null);

    const { embDims, hiddenSizes, cells } = useMemo(() => {
        const eds = [...new Set(configs.map(c => c.embedding_dim))].sort((a, b) => a - b);
        const hss = [...new Set(configs.map(c => c.hidden_size))].sort((a, b) => a - b);

        // Group by (emb_dim, hidden_size), average gap across learning rates
        const cellMap = new Map<string, CellData>();
        for (const c of configs) {
            const key = `${c.embedding_dim}-${c.hidden_size}`;
            if (!cellMap.has(key)) {
                cellMap.set(key, { embDim: c.embedding_dim, hiddenSize: c.hidden_size, avgGap: null, bestLoss: Infinity, count: 0, configs: [] });
            }
            const cell = cellMap.get(key)!;
            cell.configs.push(c);
            cell.count++;
            if (c.final_loss < cell.bestLoss) cell.bestLoss = c.final_loss;
        }

        // Compute average gap per cell
        for (const cell of cellMap.values()) {
            const gaps = cell.configs.map(c => c.generalization_gap).filter((g): g is number => g != null);
            cell.avgGap = gaps.length > 0 ? gaps.reduce((s, v) => s + v, 0) / gaps.length : null;
        }

        return { embDims: eds, hiddenSizes: hss, cells: cellMap };
    }, [configs]);

    if (configs.length === 0) return null;

    const cellW = Math.min(72, Math.floor(360 / embDims.length));
    const cellH = 36;

    return (
        <div className="space-y-3">
            <div className="overflow-x-auto">
                <table className="border-collapse">
                    <thead>
                        <tr>
                            <th className="text-[8px] font-mono text-white/20 pr-2 pb-1 text-right align-bottom">
                                hidden ↓ / emb →
                            </th>
                            {embDims.map(ed => (
                                <th key={ed} className="text-[9px] font-mono text-white/30 text-center pb-1" style={{ width: cellW }}>
                                    {ed}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {hiddenSizes.map(hs => (
                            <tr key={hs}>
                                <td className="text-[9px] font-mono text-white/30 pr-2 text-right">{hs}</td>
                                {embDims.map(ed => {
                                    const cell = cells.get(`${ed}-${hs}`);
                                    const gap = cell?.avgGap ?? null;
                                    const isHovered = hovered?.embDim === ed && hovered?.hiddenSize === hs;
                                    return (
                                        <td
                                            key={ed}
                                            className="p-0.5"
                                            onMouseEnter={() => cell && setHovered(cell)}
                                            onMouseLeave={() => setHovered(null)}
                                        >
                                            <div
                                                className={`flex items-center justify-center rounded transition-all cursor-default ${isHovered ? "ring-1 ring-white/30" : ""}`}
                                                style={{
                                                    width: cellW - 4,
                                                    height: cellH,
                                                    backgroundColor: gapColor(gap),
                                                }}
                                            >
                                                <span className="text-[8px] font-mono text-white/50">
                                                    {gapLabel(gap)}
                                                </span>
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Color legend */}
            <div className="flex items-center gap-3 text-[8px] font-mono text-white/25">
                <span>Gap:</span>
                {[
                    { label: "< 0 (healthy)", color: "rgba(52,211,153,0.5)" },
                    { label: "0–0.1", color: "rgba(52,211,153,0.35)" },
                    { label: "0.1–0.2", color: "rgba(250,204,21,0.35)" },
                    { label: "0.2–0.3", color: "rgba(251,146,60,0.45)" },
                    { label: "> 0.3 (overfit)", color: "rgba(244,63,94,0.5)" },
                ].map(({ label, color }) => (
                    <span key={label} className="inline-flex items-center gap-1">
                        <span className="inline-block w-3 h-3 rounded" style={{ backgroundColor: color }} />
                        {label}
                    </span>
                ))}
            </div>

            {/* Hover detail */}
            {hovered && (
                <div className="text-[9px] font-mono text-white/40 leading-relaxed">
                    <span className="text-white/60">emb={hovered.embDim} hidden={hovered.hiddenSize}</span>
                    {" · "}{hovered.count} configs (across LRs)
                    {" · "}avg gap={gapLabel(hovered.avgGap)}
                    {" · "}best loss={hovered.bestLoss.toFixed(3)}
                </div>
            )}

            <p className="text-[9px] font-mono text-white/15">
                Each cell averages the train–val gap across all learning rates for that (emb_dim, hidden_size) pair.
                Red = overfitting. Green = healthy generalization.
            </p>
        </div>
    );
}

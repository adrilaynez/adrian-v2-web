"use client";

import { useRef, useEffect, useState, useCallback, memo } from "react";
import { Card } from "@/components/ui/card";
import { Grid3x3, Search, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TransitionMatrixViz } from "@/types/lmLab";

interface TransitionMatrixProps {
    data: TransitionMatrixViz | null;
    activeContext?: string[]; // If present, we are viewing an active slice
    onCellClick?: (rowLabel: string, colLabel: string) => void;
}

export const TransitionMatrix = memo(function TransitionMatrix({ data, activeContext, onCellClick }: TransitionMatrixProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [tooltip, setTooltip] = useState<{
        x: number;
        y: number;
        row: string;
        col: string;
        value: number;
    } | null>(null);
    const [searchChar, setSearchChar] = useState("");
    const [highlightIdx, setHighlightIdx] = useState<number | null>(null);

    useEffect(() => {
        if (searchChar && data) {
            const idx = data.row_labels.findIndex(
                (l) => l === searchChar
            );
            setHighlightIdx(idx === -1 ? null : idx);
        } else {
            setHighlightIdx(null);
        }
    }, [searchChar, data]);

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!data || !onCellClick || !canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        const padding = 32;
        const rows = data.row_labels.length;
        const cols = data.col_labels.length;
        const canvasW = Math.min(rect.width, 800);
        const cellW = (canvasW - padding * 2) / cols;
        const cellH = rows === cols ? cellW : Math.min(Math.max(cellW, 20), 40);

        const col = Math.floor((mx - padding) / cellW);
        const row = Math.floor((my - padding) / cellH);

        if (
            row >= 0 &&
            row < rows &&
            col >= 0 &&
            col < cols
        ) {
            const rowLabel = data.row_labels[row];
            const colLabel = data.col_labels[col];
            onCellClick(rowLabel, colLabel);
        }
    };

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container || !data) return;

        const { data: matrix, row_labels, col_labels } = data;
        const rows = row_labels.length;
        const cols = col_labels.length;
        const dpr = window.devicePixelRatio || 1;

        const padding = 32;
        const canvasW = Math.min(container.clientWidth, 800);
        const cellW = (canvasW - padding * 2) / cols;
        const cellH = rows === cols ? cellW : Math.min(Math.max(cellW, 20), 40);
        const totalH = padding * 2 + rows * cellH;

        canvas.width = canvasW * dpr;
        canvas.height = totalH * dpr;
        canvas.style.width = `${canvasW}px`;
        canvas.style.height = `${totalH}px`;

        const ctx = canvas.getContext("2d")!;
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, canvasW, totalH);

        // Draw cells
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const v = matrix[r][c];
                const x = padding + c * cellW;
                const y = padding + r * cellH;

                // Color: black → emerald via opacity
                const alpha = Math.pow(v, 0.5); // sqrt for better visibility
                const dimmed =
                    highlightIdx !== null && highlightIdx !== r && highlightIdx !== c;

                ctx.fillStyle = dimmed
                    ? `rgba(16, 185, 129, ${alpha * 0.15})`
                    : `rgba(16, 185, 129, ${alpha * 0.9})`;
                ctx.fillRect(x, y, cellW - 0.5, cellH - 0.5);
            }
        }

        // Labels
        const colFontSize = Math.min(cellW * 0.7, 11);
        const rowFontSize = Math.min(cellH * 0.7, 11);
        ctx.font = `${colFontSize}px monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";

        const getLabelColor = (char: string, highlighted: boolean) => {
            if (highlighted) return "rgba(16, 185, 129, 1)"; // Emerald-500
            if (/[A-Z]/.test(char)) return "rgba(251, 191, 36, 1)"; // Amber-400
            if (/[a-z]/.test(char)) return "rgba(34, 211, 238, 1)"; // Cyan-400
            return "rgba(255,255,255,0.4)"; // Gray
        };

        for (let c = 0; c < cols; c++) {
            const char = col_labels[c];
            const x = padding + c * cellW + cellW / 2;
            ctx.fillStyle = getLabelColor(char, highlightIdx === c);
            ctx.fillText(char === " " ? "␣" : char, x, padding - 4);
        }

        ctx.font = `${rowFontSize}px monospace`;
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        for (let r = 0; r < rows; r++) {
            const char = row_labels[r];
            const y = padding + r * cellH + cellH / 2;
            ctx.fillStyle = getLabelColor(char, highlightIdx === r);
            ctx.fillText(
                char === " " ? "␣" : char,
                padding - 6,
                y
            );
        }
    }, [data, highlightIdx]);

    useEffect(() => {
        draw();
        const handleResize = () => draw();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [draw]);

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!data || !canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        const padding = 32;
        const rows = data.row_labels.length;
        const cols = data.col_labels.length;
        const canvasW = Math.min(rect.width, 800);
        const cellW = (canvasW - padding * 2) / cols;
        const cellH = rows === cols ? cellW : Math.min(Math.max(cellW, 20), 40);

        const col = Math.floor((mx - padding) / cellW);
        const row = Math.floor((my - padding) / cellH);

        if (
            row >= 0 &&
            row < rows &&
            col >= 0 &&
            col < cols
        ) {
            setTooltip({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
                row: data.row_labels[row],
                col: data.col_labels[col],
                value: data.data[row][col],
            });
        } else {
            setTooltip(null);
        }
    };

    // Construct context string for display
    const contextStr = activeContext
        ? activeContext.map(c => c === " " ? "␣" : c).join("")
        : "";

    return (
        <Card className="bg-black/40 border-white/[0.06] backdrop-blur-sm">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                <div className="flex items-center gap-2">
                    {activeContext ? (
                        <Layers className="h-4 w-4 text-indigo-400" />
                    ) : (
                        <Grid3x3 className="h-4 w-4 text-violet-400" />
                    )}

                    <span className="font-mono text-xs uppercase tracking-widest text-white/60">
                        {activeContext ? "Active Slice Transition" : "Transition Matrix"}
                    </span>

                    <div className="group relative ml-1">
                        <div className="flex items-center justify-center w-4 h-4 rounded-full bg-white/5 border border-white/10 cursor-help hover:bg-white/10 transition-colors">
                            <span className="text-[10px] font-bold text-white/40 group-hover:text-white/60">?</span>
                        </div>
                        <div className="absolute left-0 bottom-full mb-3 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-white/10 p-4 rounded-2xl z-50 w-72 text-[11px] text-slate-400 pointer-events-none shadow-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <p className="font-bold text-white mb-2 uppercase tracking-widest text-[10px]">How to read this chart?</p>
                            <div className="space-y-2">
                                <p><strong className="text-violet-400">Rows (Y):</strong> The letter the model just wrote.</p>
                                <p><strong className="text-emerald-400">Columns (X):</strong> The letter the model is trying to guess.</p>
                                <p><strong className="text-white">Brightness:</strong> The brighter a square is, the more likely that pair of letters appears in the text.</p>
                                <div className="mt-3 pt-3 border-t border-white/5 text-[10px] italic">
                                    Example: If the row is 'q' and the 'u' column shines brightly, it means the model knows that after 'q' almost always comes 'u'.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {activeContext && (
                    <div className="text-xs font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                        Slice: &apos;{contextStr}&apos;
                    </div>
                )}
            </div>

            {/* Search */}
            <div className="px-5 pt-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
                    <input
                        type="text"
                        value={searchChar}
                        onChange={(e) => setSearchChar(e.target.value.slice(0, 1))}
                        placeholder="Highlight character…"
                        maxLength={1}
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-white/20 font-mono focus:outline-none focus:ring-1 focus:ring-violet-500/50 transition-all"
                    />
                </div>
            </div>

            {/* Canvas */}
            <div ref={containerRef} className="p-5 relative">
                {!data ? (
                    <div className="flex items-center justify-center h-64 text-white/30 text-xs font-mono">
                        Run inference to generate the transition matrix
                    </div>
                ) : (
                    <div className="relative">
                        <canvas
                            ref={canvasRef}
                            onClick={handleCanvasClick}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={() => setTooltip(null)}
                            className={cn("cursor-crosshair", onCellClick ? "cursor-pointer" : "")}
                        />
                        {tooltip && (
                            <div
                                className="absolute z-50 pointer-events-none bg-black/90 border border-white/10 backdrop-blur-lg rounded-lg px-3 py-2 text-xs font-mono shadow-xl whitespace-nowrap"
                                style={{
                                    left: tooltip.x + 12,
                                    top: tooltip.y - 40,
                                }}
                            >
                                <span className="text-white/50">
                                    P(
                                    <span className="text-emerald-400">
                                        {tooltip.col === " " ? "␣" : tooltip.col}
                                    </span>
                                    {" | "}
                                    {activeContext && (
                                        <span className="text-indigo-400">
                                            {contextStr}
                                        </span>
                                    )}
                                    <span className="text-violet-400">
                                        {tooltip.row === " " ? "␣" : tooltip.row}
                                    </span>
                                    ) ={" "}
                                </span>
                                <span className="text-white font-bold">
                                    {(tooltip.value * 100).toFixed(2)}%
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
}, (prev, next) => {
    // Custom comparison
    return prev.data === next.data && prev.activeContext === next.activeContext;
});

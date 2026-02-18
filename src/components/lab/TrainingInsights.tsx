"use client";

import { useRef, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, Activity } from "lucide-react";
import type { TrainingViz } from "@/types/lmLab";

interface TrainingInsightsProps {
    data: TrainingViz | null;
}

export function TrainingInsights({ data }: TrainingInsightsProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container || !data) return;

        const { loss_history } = data;
        if (!loss_history || loss_history.length < 2) return;

        const dpr = window.devicePixelRatio || 1;

        const w = container.clientWidth;
        const h = 160;

        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;

        const ctx = canvas.getContext("2d")!;
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, w, h);

        if (loss_history.length < 2) return;

        const pad = { left: 10, right: 10, top: 10, bottom: 10 };
        const plotW = w - pad.left - pad.right;
        const plotH = h - pad.top - pad.bottom;

        const maxLoss = Math.max(...loss_history);
        const minLoss = Math.min(...loss_history);
        const range = maxLoss - minLoss || 1;

        const xStep = plotW / (loss_history.length - 1);

        // Gradient fill
        const gradient = ctx.createLinearGradient(0, pad.top, 0, h - pad.bottom);
        gradient.addColorStop(0, "rgba(99, 102, 241, 0.25)");
        gradient.addColorStop(1, "rgba(99, 102, 241, 0)");

        ctx.beginPath();
        ctx.moveTo(pad.left, pad.top + plotH);
        for (let i = 0; i < loss_history.length; i++) {
            const x = pad.left + i * xStep;
            const y = pad.top + plotH - ((loss_history[i] - minLoss) / range) * plotH;
            ctx.lineTo(x, y);
        }
        ctx.lineTo(pad.left + (loss_history.length - 1) * xStep, pad.top + plotH);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

        // Line
        ctx.beginPath();
        for (let i = 0; i < loss_history.length; i++) {
            const x = pad.left + i * xStep;
            const y = pad.top + plotH - ((loss_history[i] - minLoss) / range) * plotH;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = "rgba(99, 102, 241, 0.8)";
        ctx.lineWidth = 2;
        ctx.lineJoin = "round";
        ctx.stroke();

        // End dot
        const lastX = pad.left + (loss_history.length - 1) * xStep;
        const lastY =
            pad.top +
            plotH -
            ((loss_history[loss_history.length - 1] - minLoss) / range) * plotH;
        ctx.beginPath();
        ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(99, 102, 241, 1)";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(lastX, lastY, 7, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(99, 102, 241, 0.3)";
        ctx.lineWidth = 2;
        ctx.stroke();
    }, [data]);

    useEffect(() => {
        draw();
        const h = () => draw();
        window.addEventListener("resize", h);
        return () => window.removeEventListener("resize", h);
    }, [draw]);

    const stats = data
        ? [
            { label: "Final Loss", value: data.final_loss?.toFixed(4) ?? "N/A" },
            { label: "Steps", value: data.training_steps?.toLocaleString() ?? "N/A" },
            { label: "Batch Size", value: data.batch_size?.toString() ?? "N/A" },
            { label: "Learning Rate", value: data.learning_rate?.toExponential(1) ?? "N/A" },
            { label: "Parameters", value: data.total_parameters?.toLocaleString() ?? "N/A" },
        ]
        : [];

    return (
        <Card className="bg-black/40 border-white/[0.06] backdrop-blur-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                <TrendingDown className="h-4 w-4 text-indigo-400" />
                <span className="font-mono text-xs uppercase tracking-widest text-white/60">
                    Training Insights
                </span>
            </div>

            {/* Chart */}
            <div ref={containerRef} className="px-5 pt-5">
                {!data ? (
                    <div className="flex items-center justify-center h-40 text-white/30 text-xs font-mono">
                        Run inference to view training data
                    </div>
                ) : (
                    <canvas ref={canvasRef} />
                )}
            </div>

            {/* Stats */}
            {data && (
                <div className="px-5 pb-5 pt-4 flex flex-wrap gap-2">
                    {stats.map((s) => (
                        <Badge
                            key={s.label}
                            className="bg-white/[0.04] border-white/[0.06] text-white/70 text-[10px] font-mono py-1 px-2.5 hover:bg-white/[0.06] transition-colors"
                        >
                            <Activity className="h-3 w-3 mr-1 text-indigo-400" />
                            {s.label}: <span className="text-white ml-1">{s.value}</span>
                        </Badge>
                    ))}
                </div>
            )}
        </Card>
    );
}

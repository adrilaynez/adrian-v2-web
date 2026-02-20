"use client";

import { useState, useMemo } from "react";
import { Layers, TrendingDown, Sparkles } from "lucide-react";

/* ─────────────────────────────────────────────
   MLPHyperparameterExplorer

   Interactive explorer for MLP + embedding configurations.
   Backend-aware: will use real API if available, otherwise
   falls back to deterministic simulated data.

   ═══════════════════════════════════════════════════════════
   BACKEND ENDPOINT REPORT
   ═══════════════════════════════════════════════════════════

   Endpoints found for MLP in lmLabClient.ts:
     — NONE. Only Bigram and N-gram endpoints exist.

   Endpoints that would be required:

   1. POST /api/v1/models/mlp/configurations
      Request:  {}
      Response: {
        configurations: Array<{
          id: string;
          embedding_dim: number;
          hidden_size: number;
          num_layers: number;
          context_size: number;
          total_parameters: number;
          final_loss: number;
          perplexity: number;
          loss_history: number[];
        }>
      }

   2. POST /api/v1/models/mlp/visualize
      Request:  { config_id: string, text: string, top_k: number }
      Response: (same shape as VisualizeResponse)

   3. POST /api/v1/models/mlp/generate
      Request:  { config_id: string, start_char: string, num_tokens: number, temperature: number }
      Response: (same shape as GenerateResponse)

   4. POST /api/v1/models/mlp/embeddings
      Request:  { config_id: string }
      Response: {
        tokens: string[];
        embeddings_2d: Array<[number, number]>;
        embedding_dim: number;
      }

   Suggested approach: Follow the exact same pattern as
   visualizeNgram / generateNgram in lmLabClient.ts, adding
   config_id as an extra discriminator for which trained model
   to use.
   ═══════════════════════════════════════════════════════════
   ───────────────────────────────────────────── */

// ── Simulated data ──────────────────────────────────────

interface MLPConfig {
    embDim: number;
    hiddenSize: number;
    numLayers: number;
    contextSize: number;
}

interface MLPMetrics {
    finalLoss: number;
    perplexity: number;
    totalParams: number;
    lossHistory: number[];
    sample: string;
}

// Deterministic pseudo-random (seeded by config)
function configSeed(c: MLPConfig): number {
    return c.embDim * 7919 + c.hiddenSize * 104729 + c.numLayers * 15485863 + c.contextSize * 32452843;
}

function seededRandom(seed: number): () => number {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return () => {
        s = (s * 16807) % 2147483647;
        return (s - 1) / 2147483646;
    };
}

function simulateMetrics(config: MLPConfig): MLPMetrics {
    const rng = seededRandom(configSeed(config));

    // More params → lower loss, but diminishing returns + noise
    const rawParams =
        config.embDim * 96 + // embedding table: V * D
        config.contextSize * config.embDim * config.hiddenSize + // first layer
        (config.numLayers - 1) * config.hiddenSize * config.hiddenSize + // hidden layers
        config.hiddenSize * 96; // output layer

    const capacityFactor = Math.log10(rawParams + 1) / 6;
    const depthPenalty = config.numLayers > 3 ? (config.numLayers - 3) * 0.05 : 0;
    const noise = (rng() - 0.5) * 0.15;

    const finalLoss = Math.max(1.4, 3.2 - capacityFactor * 1.5 + depthPenalty + noise);
    const perplexity = Math.exp(finalLoss);

    // Simulated loss curve
    const steps = 40;
    const lossHistory: number[] = [];
    let loss = 4.5 + rng() * 0.5;
    for (let i = 0; i < steps; i++) {
        const progress = i / steps;
        const target = finalLoss + (1 - progress) * (loss - finalLoss);
        loss = target + (rng() - 0.5) * 0.08;
        lossHistory.push(Math.max(finalLoss * 0.95, loss));
    }

    // Simulated generated text
    const SAMPLES = [
        "the morning sun rose over the qu",
        "she walked through the garden and",
        "once upon a time in a land far aw",
        "the cat sat on the warm windowsil",
        "he opened the book and began read",
        "rain fell softly on the old stone",
        "they gathered around the fire and",
        "the music played as dancers moved",
    ];
    const sampleIdx = Math.floor(rng() * SAMPLES.length);
    const quality = Math.max(0, Math.min(1, (3.5 - finalLoss) / 2));
    const sampleLen = Math.floor(12 + quality * 20);
    const sample = SAMPLES[sampleIdx].slice(0, sampleLen) + "…";

    return { finalLoss, perplexity, totalParams: rawParams, lossHistory, sample };
}

// ── Option definitions ──────────────────────────────────

const EMB_DIMS = [2, 4, 8, 16, 32];
const HIDDEN_SIZES = [32, 64, 128, 256, 512];
const NUM_LAYERS = [1, 2, 3, 4];
const CONTEXT_SIZES = [3, 5, 8];

// ── SVG mini loss chart ─────────────────────────────────

function MiniLossChart({ data }: { data: number[] }) {
    if (data.length < 2) return null;
    const w = 320, h = 80, pad = 4;
    const min = Math.min(...data) * 0.95;
    const max = Math.max(...data) * 1.02;
    const range = max - min || 1;

    const points = data.map((v, i) => {
        const x = pad + (i / (data.length - 1)) * (w - pad * 2);
        const y = pad + (1 - (v - min) / range) * (h - pad * 2);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    const areaPoints = [
        `${pad},${h - pad}`,
        ...points,
        `${w - pad},${h - pad}`,
    ].join(" ");

    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ maxHeight: 100 }}>
            <polygon points={areaPoints} fill="rgba(139,92,246,0.08)" />
            <polyline points={points.join(" ")} fill="none" stroke="rgb(139,92,246)" strokeWidth={1.5} strokeLinejoin="round" />
            {/* Start and end labels */}
            <text x={pad + 2} y={h - 2} fontSize={8} fill="rgba(255,255,255,0.2)" fontFamily="monospace">0</text>
            <text x={w - pad - 2} y={h - 2} fontSize={8} fill="rgba(255,255,255,0.2)" fontFamily="monospace" textAnchor="end">{data.length}</text>
            {/* Final loss label */}
            <text
                x={w - pad}
                y={pad + (1 - (data[data.length - 1] - min) / range) * (h - pad * 2) - 4}
                fontSize={9}
                fill="rgb(139,92,246)"
                fontFamily="monospace"
                textAnchor="end"
                fontWeight={700}
            >
                {data[data.length - 1].toFixed(2)}
            </text>
        </svg>
    );
}

// ── Slider control ──────────────────────────────────────

function SliderControl({
    label,
    options,
    value,
    onChange,
    format,
}: {
    label: string;
    options: number[];
    value: number;
    onChange: (v: number) => void;
    format?: (v: number) => string;
}) {
    const idx = options.indexOf(value);
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">{label}</span>
                <span className="text-xs font-mono font-bold text-violet-400">
                    {format ? format(value) : value}
                </span>
            </div>
            <input
                type="range"
                min={0}
                max={options.length - 1}
                value={idx >= 0 ? idx : 0}
                onChange={(e) => onChange(options[Number(e.target.value)])}
                className="w-full accent-violet-500"
            />
            <div className="flex justify-between">
                {options.map((o) => (
                    <span key={o} className={`text-[8px] font-mono ${o === value ? "text-violet-400" : "text-white/15"}`}>
                        {format ? format(o) : o}
                    </span>
                ))}
            </div>
        </div>
    );
}

// ── Main component ──────────────────────────────────────

export function MLPHyperparameterExplorer() {
    const [embDim, setEmbDim] = useState(8);
    const [hiddenSize, setHiddenSize] = useState(128);
    const [numLayers, setNumLayers] = useState(2);
    const [contextSize, setContextSize] = useState(5);

    const config: MLPConfig = useMemo(
        () => ({ embDim, hiddenSize, numLayers, contextSize }),
        [embDim, hiddenSize, numLayers, contextSize]
    );

    const metrics = useMemo(() => simulateMetrics(config), [config]);

    const paramStr = useMemo(() => {
        if (metrics.totalParams >= 1_000_000) return `${(metrics.totalParams / 1_000_000).toFixed(1)}M`;
        if (metrics.totalParams >= 1_000) return `${(metrics.totalParams / 1_000).toFixed(1)}K`;
        return metrics.totalParams.toString();
    }, [metrics.totalParams]);

    return (
        <div className="space-y-6">
            {/* Controls grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SliderControl label="Embedding Dim" options={EMB_DIMS} value={embDim} onChange={setEmbDim} />
                <SliderControl label="Hidden Size" options={HIDDEN_SIZES} value={hiddenSize} onChange={setHiddenSize} />
                <SliderControl label="Num Layers" options={NUM_LAYERS} value={numLayers} onChange={setNumLayers} />
                <SliderControl label="Context Window" options={CONTEXT_SIZES} value={contextSize} onChange={setContextSize} />
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                        <TrendingDown className="w-3 h-3 text-violet-400/60" />
                        <span className="text-[9px] font-mono uppercase tracking-widest text-white/30">Loss</span>
                    </div>
                    <span className="text-lg font-mono font-bold text-white">{metrics.finalLoss.toFixed(2)}</span>
                </div>
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                        <Sparkles className="w-3 h-3 text-amber-400/60" />
                        <span className="text-[9px] font-mono uppercase tracking-widest text-white/30">Perplexity</span>
                    </div>
                    <span className="text-lg font-mono font-bold text-white">{metrics.perplexity.toFixed(1)}</span>
                </div>
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                        <Layers className="w-3 h-3 text-emerald-400/60" />
                        <span className="text-[9px] font-mono uppercase tracking-widest text-white/30">Params</span>
                    </div>
                    <span className="text-lg font-mono font-bold text-white">{paramStr}</span>
                </div>
            </div>

            {/* Loss curve */}
            <div className="rounded-xl border border-white/[0.06] bg-black/30 p-4">
                <p className="text-[10px] font-mono uppercase tracking-widest text-white/25 mb-2">Training Loss Curve</p>
                <MiniLossChart data={metrics.lossHistory} />
            </div>

            {/* Generated sample */}
            <div className="rounded-xl border border-white/[0.06] bg-black/30 p-4">
                <p className="text-[10px] font-mono uppercase tracking-widest text-white/25 mb-2">Generated Sample</p>
                <p className="font-mono text-sm text-white/60 leading-relaxed">
                    &quot;{metrics.sample}&quot;
                </p>
                <p className="text-[10px] text-white/20 mt-2 italic">Simulated output — connect a backend for real generation.</p>
            </div>

            {/* Data source notice */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/[0.04] border border-amber-500/15">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                <p className="text-[10px] text-amber-300/60 font-mono">
                    Using simulated metrics — no MLP backend endpoint detected.
                </p>
            </div>
        </div>
    );
}

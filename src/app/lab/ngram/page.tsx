"use client";

import { LabShell } from "@/components/lab/LabShell";
import { InferenceConsole } from "@/components/lab/InferenceConsole";
import { TransitionMatrix } from "@/components/lab/TransitionMatrix";
import { ArchitectureDeepDive } from "@/components/lab/ArchitectureDeepDive";
import { SectionDivider } from "@/components/lab/SectionDivider";
import { ContextControl } from "@/components/lab/ContextControl";
import { CombinatorialExplosion } from "@/components/lab/CombinatorialExplosion";
import { NgramDiagnostics } from "@/components/lab/NgramDiagnostics";
import { NgramTrainingInsights } from "@/components/lab/NgramTrainingInsights";
import { HistoricalContextPanel } from "@/components/lab/HistoricalContextPanel";
import { DatasetExplorerModal } from "@/components/lab/DatasetExplorerModal";
import { ModelHero } from "@/components/lab/ModelHero";

import { useNgramVisualization } from "@/hooks/useNgramVisualization";
import { useNgramDatasetLookup } from "@/hooks/useNgramDatasetLookup";
import { motion, AnimatePresence } from "framer-motion";
import { FlaskConical, Database, Hash, Activity, Layers } from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";

export default function NgramPage() {
    const viz = useNgramVisualization();
    const dataset = useNgramDatasetLookup();

    // Track last text for re-fetch on context size change
    const lastTextRef = useRef<string>("hello");

    // Dataset Explorer Modal state (mirrors Bigram page pattern)
    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        contextChar: string;
        nextChar: string;
    }>({
        isOpen: false,
        contextChar: "",
        nextChar: "",
    });

    // Initial fetch
    useEffect(() => {
        if (!viz.data && !viz.loading && !viz.error) {
            viz.analyze("hello", 10);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Re-fetch when context size changes
    useEffect(() => {
        if (lastTextRef.current) {
            viz.analyze(lastTextRef.current, 10);
        }
    }, [viz.contextSize]); // eslint-disable-line react-hooks/exhaustive-deps

    // Wrap analyze to track last text
    const handleAnalyze = useCallback((text: string, topK: number) => {
        lastTextRef.current = text;
        viz.analyze(text, topK);
    }, [viz.analyze]);

    // Matrix cell click → dataset lookup modal
    const handleCellClick = useCallback((rowLabel: string, colLabel: string) => {
        if (!viz.data) return;
        const contextTokens = viz.data.visualization.active_slice?.context_tokens ?? [];
        // For active slice, row is part of the context label, col is next token
        // Pass context tokens + row as context, col as next token
        setModalState({
            isOpen: true,
            contextChar: rowLabel,
            nextChar: colLabel,
        });
    }, [viz.data]);

    const closeModal = useCallback(() => {
        setModalState(prev => ({ ...prev, isOpen: false }));
    }, []);

    // Extract data for convenience
    const nGramData = viz.data;
    const activeSlice = nGramData?.visualization.active_slice;
    const diagnostics = nGramData?.visualization.diagnostics;
    const training = nGramData?.visualization.training;
    const architecture = nGramData?.visualization.architecture;
    const historicalContext = nGramData?.visualization.historical_context;

    // Build hero stats from diagnostics/training
    const heroStats = diagnostics ? [
        {
            label: "Vocabulary",
            value: diagnostics.vocab_size?.toString() ?? "?",
            icon: Database,
            desc: "Unique characters",
        },
        {
            label: "Context Space",
            value: diagnostics.estimated_context_space?.toLocaleString() ?? "?",
            icon: Hash,
            desc: `|V|^${diagnostics.context_size}`,
        },
        {
            label: "Sparsity",
            value: diagnostics.sparsity != null ? `${(diagnostics.sparsity * 100).toFixed(1)}%` : "N/A",
            icon: Activity,
            desc: "Unseen contexts",
        },
        {
            label: "Contexts Used",
            value: diagnostics.observed_contexts?.toLocaleString() ?? "N/A",
            icon: Layers,
            desc: `${diagnostics.context_utilization != null ? (diagnostics.context_utilization * 100).toFixed(1) : "?"}% utilization`,
        },
    ] : undefined;

    // Context-aware dataset lookup for modal
    const handleDatasetLookup = useCallback((context: string[], nextToken: string) => {
        dataset.lookup(context, nextToken);
    }, [dataset]);

    return (
        <LabShell>
            <div className="max-w-7xl mx-auto pb-24 relative">

                {/* 1. HERO SECTION */}
                <ModelHero
                    title="N-Gram Language Model"
                    description="A character-level statistical language model with variable context size. Visualize how increasing the context window sharpens predictions at the cost of exponential sparsity."
                    customStats={heroStats}
                />

                {/* 2. HISTORICAL CONTEXT */}
                {historicalContext && (
                    <div className="max-w-5xl mx-auto px-6">
                        <HistoricalContextPanel data={historicalContext} />
                    </div>
                )}

                {/* 3. TRAINING INSIGHTS */}
                {training && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="max-w-5xl mx-auto px-6 mb-24"
                    >
                        <NgramTrainingInsights
                            data={training}
                            contextSize={viz.contextSize}
                        />
                    </motion.div>
                )}

                {/* 4. CONTEXT SIZE SELECTOR */}
                <SectionDivider
                    number="01"
                    title="Context Size"
                    description="Adjust the context size (N) to condition predictions on more history."
                />

                <div className="max-w-4xl mx-auto px-6 mb-12">
                    <ContextControl
                        value={viz.contextSize}
                        onChange={viz.setContextSize}
                        disabled={viz.loading}
                    />
                </div>

                {/* 5. DIAGNOSTICS HUD */}
                {diagnostics && (
                    <div className="max-w-6xl mx-auto px-6 mb-12">
                        <NgramDiagnostics data={diagnostics} />
                    </div>
                )}

                {/* 6. VISUALIZATION (Matrix / Active Slice) */}
                <SectionDivider
                    number="02"
                    title="Active Slice"
                    description={
                        viz.contextSize > 1
                            ? "For N>1, we visualize the conditional slice P(next | context). Click cells to trace examples."
                            : "For N=1 (Bigram), we visualize the simple Markov transition matrix P(next | current)."
                    }
                />

                <div className="max-w-4xl mx-auto px-6 mb-24 min-h-[400px]">
                    <AnimatePresence mode="wait">
                        {viz.isCombinatorialExplosion ? (
                            <CombinatorialExplosion key="explosion" />
                        ) : (
                            <motion.div
                                key="matrix"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="relative"
                            >
                                {/* Show full transition matrix for N=1, active slice for N>1 */}
                                <TransitionMatrix
                                    data={
                                        viz.contextSize === 1
                                            ? nGramData?.visualization.transition_matrix ?? null
                                            : activeSlice?.matrix ?? null
                                    }
                                    activeContext={
                                        viz.contextSize > 1
                                            ? activeSlice?.context_tokens
                                            : undefined
                                    }
                                    onCellClick={handleCellClick}
                                />

                                <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-lg p-3 mt-6 text-center backdrop-blur-sm">
                                    <p className="text-sm text-emerald-200/80 font-mono">
                                        <span className="text-emerald-400 font-bold uppercase tracking-wider mr-2">Try it:</span>
                                        Click any colored cell in the matrix to see <span className="text-white font-semibold">real training examples</span>.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* 7. INFERENCE CONSOLE */}
                <SectionDivider
                    number="03"
                    title="Inference & Generation"
                    description="Interact with the model in real-time. Observe how it selects the next token based on the learned probabilities."
                />

                <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Left: Inference Console */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-white pl-1 border-l-2 border-emerald-500">
                                1. Probability Distribution
                            </h3>
                            <p className="text-sm text-white/50 pl-1.5 mb-2">
                                Type a phrase to see the top-k most likely next characters.
                            </p>
                            <InferenceConsole
                                onAnalyze={handleAnalyze}
                                predictions={nGramData?.predictions ?? null}
                                inferenceMs={nGramData?.metadata.inference_time_ms}
                                device={nGramData?.metadata.device}
                                loading={viz.loading}
                                error={viz.error}
                            />
                        </div>
                    </div>

                    {/* Right: Stepwise + Generation (Coming Soon) */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-white pl-1 border-l-2 border-violet-500">
                                2. Stepwise Prediction
                            </h3>
                            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-8 text-center">
                                <div className="text-white/20 text-sm font-mono uppercase tracking-widest mb-2">Coming Soon</div>
                                <p className="text-white/40 text-xs">
                                    N-Gram stepwise prediction requires a dedicated backend endpoint. Stay tuned.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-white pl-1 border-l-2 border-amber-500">
                                3. Text Generation
                            </h3>
                            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-8 text-center">
                                <div className="text-white/20 text-sm font-mono uppercase tracking-widest mb-2">Coming Soon</div>
                                <p className="text-white/40 text-xs">
                                    N-Gram text generation requires a dedicated backend endpoint. Stay tuned.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 8. ARCHITECTURE DEEP DIVE */}
                <ArchitectureDeepDive
                    data={architecture ?? null}
                />

                {/* Footer Note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-32 flex items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-widest text-white/20"
                >
                    <FlaskConical className="h-3 w-3" />
                    LM-Lab · Scientific Instrument v1.0
                </motion.div>

                {/* MODALS */}
                <DatasetExplorerModal
                    isOpen={modalState.isOpen}
                    onClose={closeModal}
                    contextChar={modalState.contextChar}
                    nextChar={modalState.nextChar}
                    modelType="ngram"
                    contextTokens={activeSlice?.context_tokens}
                />
            </div>
        </LabShell>
    );
}

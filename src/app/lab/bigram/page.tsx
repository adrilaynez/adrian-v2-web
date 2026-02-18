"use client";

import { LabShell } from "@/components/lab/LabShell";
import { InferenceConsole } from "@/components/lab/InferenceConsole";
import { TransitionMatrix } from "@/components/lab/TransitionMatrix";
import { TrainingInsights } from "@/components/lab/TrainingInsights";
import { ArchitectureDeepDive } from "@/components/lab/ArchitectureDeepDive";
import { GenerationPlayground } from "@/components/lab/GenerationPlayground";
import { StepwisePrediction } from "@/components/lab/StepwisePrediction";
import { ModelHero } from "@/components/lab/ModelHero";
import { SectionDivider } from "@/components/lab/SectionDivider";
import { HistoricalContextPanel } from "@/components/lab/HistoricalContextPanel";
import { DatasetExplorerModal } from "@/components/lab/DatasetExplorerModal";

import { useBigramVisualization } from "@/hooks/useBigramVisualization";
import { useBigramGeneration } from "@/hooks/useBigramGeneration";
import { useBigramStepwise } from "@/hooks/useBigramStepwise";
import { motion } from "framer-motion";
import { FlaskConical } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

export default function BigramPage() {
    const viz = useBigramVisualization();
    const gen = useBigramGeneration();
    const step = useBigramStepwise();

    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        contextChar: string;
        nextChar: string;
    }>({
        isOpen: false,
        contextChar: "",
        nextChar: "",
    });

    // Initial fetch to get training stats for the hero
    useEffect(() => {
        if (!viz.data && !viz.loading) {
            viz.analyze("hello", 10);
        }
    }, []); // Run once on mount

    const handleCellClick = useCallback((rowLabel: string, colLabel: string) => {
        setModalState({
            isOpen: true,
            contextChar: rowLabel,
            nextChar: colLabel,
        });
    }, []);

    const closeModal = useCallback(() => {
        setModalState(prev => ({ ...prev, isOpen: false }));
    }, []);

    return (
        <LabShell>
            <div className="max-w-7xl mx-auto pb-24">

                {/* 1. HERO SECTION */}
                <ModelHero trainingData={viz.data?.visualization.training} />



                {/* 2. TRAINING INSIGHTS */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="max-w-5xl mx-auto px-6 mb-24"
                >
                    <TrainingInsights
                        data={viz.data?.visualization.training ?? null}
                    />
                </motion.div>

                {/* 3. VISUALIZATION SECTION */}
                <SectionDivider
                    number="01"
                    title="Character-Level Transition Matrix"
                    description="Visualizing the probability distribution. For a Bigram model (Context Size = 1), this 2D matrix represents the entire knowledge of the model: 'Given Row, predict Column'."
                />

                <div className="max-w-4xl mx-auto px-6 mb-24">
                    <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-lg p-3 mb-6 text-center backdrop-blur-sm">
                        <p className="text-sm text-emerald-200/80 font-mono">
                            <span className="text-emerald-400 font-bold uppercase tracking-wider mr-2">Try it:</span>
                            Click any colored cell in the matrix to see <span className="text-white font-semibold">real training examples</span>.
                        </p>
                    </div>
                    <TransitionMatrix
                        data={viz.data?.visualization.transition_matrix ?? null}
                        onCellClick={handleCellClick}
                    />
                </div>

                {/* 4. EXPERIMENTATION SECTION */}
                <SectionDivider
                    number="02"
                    title="Inference & Generation"
                    description="Interact with the model in real-time. Observe how it selects the next token based on the learned probabilities."
                />

                <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Left: Interactive Tools */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-white pl-1 border-l-2 border-emerald-500">
                                1. Probability Distribution
                            </h3>
                            <p className="text-sm text-white/50 pl-1.5 mb-2">
                                Type a phrase to see the top-k most likely next characters.
                            </p>
                            <InferenceConsole
                                onAnalyze={viz.analyze}
                                predictions={viz.data?.predictions ?? null}
                                inferenceMs={viz.data?.metadata.inference_time_ms}
                                device={viz.data?.metadata.device}
                                loading={viz.loading}
                                error={viz.error}
                            />
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-white pl-1 border-l-2 border-violet-500">
                                2. Stepwise Prediction
                            </h3>
                            <p className="text-sm text-white/50 pl-1.5 mb-2">
                                Watch the model predict a sequence character-by-character.
                            </p>
                            <StepwisePrediction
                                onPredict={step.predict}
                                steps={step.data?.steps ?? null}
                                finalPrediction={step.data?.final_prediction ?? null}
                                loading={step.loading}
                                error={step.error}
                            />
                        </div>
                    </div>

                    {/* Right: Generation & Architecture */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-white pl-1 border-l-2 border-amber-500">
                                3. Text Generation
                            </h3>
                            <p className="text-sm text-white/50 pl-1.5 mb-2">
                                Let the model hallucinate text by sampling from the distribution.
                            </p>
                            <GenerationPlayground
                                onGenerate={gen.generate}
                                generatedText={gen.data?.generated_text ?? null}
                                loading={gen.loading}
                                error={gen.error}
                            />
                        </div>
                    </div>
                </div>

                {/* 5. ARCHITECTURE DEEP DIVE */}
                <ArchitectureDeepDive
                    data={viz.data?.visualization.architecture ?? null}
                />

                {/* 6. HISTORICAL CONTEXT (reflective conclusion) */}
                {viz.data?.historical_context && (
                    <div className="max-w-5xl mx-auto px-6 mt-24">
                        <HistoricalContextPanel data={viz.data.historical_context} collapsible />
                    </div>
                )}

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
                />
            </div>
        </LabShell>
    );
}

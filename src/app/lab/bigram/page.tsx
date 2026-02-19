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
import { FlaskConical, BookOpen, Brain, Zap, Layers, Activity } from "lucide-react";
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





                {/* 3. VISUALIZATION SECTION */}
                <SectionDivider
                    number="01"
                    title="Visualization: Transition Matrix"
                    description="This is where the model's 'knowledge' lives. For a Bigram model, this grid represents which letters typically follow others."
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
                    title="Inference and Generation"
                    description="Interact with the model in real-time. Watch how it 'guesses' the next character based on learned probabilities."
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
                <SectionDivider
                    number="03"
                    title="Model Architecture"
                    description="A technical look at the 'neurons' and layers that process information."
                />
                <ArchitectureDeepDive
                    data={viz.data?.visualization.architecture ?? null}
                />

                {/* 5. TRAINING INSIGHTS (at the bottom now) */}
                <SectionDivider
                    number="04"
                    title="Training Insights"
                    description="Observing the learning process. These metrics show how the model optimized its parameters by reducing prediction error (loss) over 5000 iterations."
                />
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

                {/* 6. HISTORICAL CONTEXT (reflective conclusion) */}
                {viz.data?.historical_context && (
                    <div className="max-w-5xl mx-auto px-6 mt-24">
                        <HistoricalContextPanel data={viz.data.historical_context} collapsible />
                    </div>
                )}

                {/* Footer Note */}
                {/* 7. BIGRAM FOR HUMANS (Parent-friendly section) */}
                <section id="how-it-works" className="container mx-auto px-6 py-20 border-t border-white/5 mt-32">
                    <div className="max-w-4xl mx-auto space-y-16">
                        <div className="text-center space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                                <BookOpen className="w-3 h-3" />
                                Guide for Non-Technical Explorers
                            </div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent italic">
                                How does this "Brain" work?
                            </h2>
                            <p className="text-slate-400 leading-relaxed text-sm max-w-2xl mx-auto font-mono">
                                Explaining the Bigram model so even my mom can understand it (with lots of love).
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all duration-500">
                                <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center border border-violet-500/30 mb-6 group-hover:scale-110 transition-transform">
                                    <Brain className="w-5 h-5 text-violet-400" />
                                </div>
                                <h4 className="font-bold text-slate-200 mb-3">Goldfish Memory</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    A **Bigram** model has the shortest memory in the world: it only remembers the **last letter** it wrote. To decide which letter comes next, it can only look at the previous one. It has no context of entire words or phrases.
                                </p>
                            </div>
                            <div className="group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all duration-500">
                                <div className="w-10 h-10 rounded-xl bg-[#FF6C6C]/20 flex items-center justify-center border border-[#FF6C6C]/30 mb-6 group-hover:scale-110 transition-transform">
                                    <Zap className="w-5 h-5 text-[#FF6C6C]" />
                                </div>
                                <h4 className="font-bold text-slate-200 mb-3">Darts Throw</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    The model doesn't "read". It just has a giant table that says: "If the last letter was 'a', there's a 10% probability that the next is 'n'". Throwing the dart (sampling) is what generates text in a random but coherent way.
                                </p>
                            </div>
                            <div className="group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all duration-500">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 mb-6 group-hover:scale-110 transition-transform">
                                    <Layers className="w-5 h-5 text-emerald-400" />
                                </div>
                                <h4 className="font-bold text-slate-200 mb-3">The Heatmap</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    The colored grid (Matrix) is the **heart** of the model. The bright squares are the most frequent "routes" the model found in the books it read during its training.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

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

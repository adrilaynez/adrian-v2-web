"use client";

import { LabShell } from "@/components/lab/LabShell";
import { ModelHero } from "@/components/lab/ModelHero";
import { SectionDivider } from "@/components/lab/SectionDivider";
import { HistoricalContextPanel } from "@/components/lab/HistoricalContextPanel";
import { DatasetExplorerModal } from "@/components/lab/DatasetExplorerModal";
import { LabSectionHeader } from "@/components/lab/LabSectionHeader";
import dynamic from "next/dynamic";

import { useBigramVisualization } from "@/hooks/useBigramVisualization";
import { useBigramGeneration } from "@/hooks/useBigramGeneration";
import { useBigramStepwise } from "@/hooks/useBigramStepwise";
import { motion } from "framer-motion";
import { FlaskConical, Brain, Zap, BookOpen, Layers } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useI18n } from "@/i18n/context";
import { useLabMode } from "@/context/LabModeContext";
import { TrainingInsights } from "@/components/lab/TrainingInsights";

const TransitionMatrix = dynamic(() =>
    import("@/components/lab/TransitionMatrix").then((m) => m.TransitionMatrix)
);

const BigramNarrative = dynamic(() =>
    import("@/components/lab/BigramNarrative").then((m) => m.BigramNarrative)
);
const BigramDiagramExperience = dynamic(() =>
    import("@/components/lab/BigramDiagramExperience").then((m) => m.BigramDiagramExperience)
);
const InferenceConsole = dynamic(() =>
    import("@/components/lab/InferenceConsole").then((m) => m.InferenceConsole)
);
const StepwisePrediction = dynamic(() =>
    import("@/components/lab/StepwisePrediction").then((m) => m.StepwisePrediction)
);
const GenerationPlayground = dynamic(() =>
    import("@/components/lab/GenerationPlayground").then((m) => m.GenerationPlayground)
);
const ArchitectureDeepDive = dynamic(() =>
    import("@/components/lab/ArchitectureDeepDive").then((m) => m.ArchitectureDeepDive)
);


export default function BigramPage() {
    const { t } = useI18n();
    const { mode } = useLabMode();
    const isEducational = mode === "educational";

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
            {isEducational ? (
                /* ═══════════════════════════════════════════
                   EDUCATIONAL MODE — Narrative blog layout
                   ═══════════════════════════════════════════ */
                <BigramNarrative
                    matrixData={viz.data?.visualization.transition_matrix ?? null}
                    trainingData={viz.data?.visualization.training ?? null}
                    onCellClick={handleCellClick}
                    onAnalyze={viz.analyze}
                    predictions={viz.data?.predictions ?? null}
                    inferenceMs={viz.data?.metadata.inference_time_ms}
                    device={viz.data?.metadata.device}
                    vizLoading={viz.loading}
                    vizError={viz.error}
                    onGenerate={gen.generate}
                    generatedText={gen.data?.generated_text ?? null}
                    genLoading={gen.loading}
                    genError={gen.error}
                />
            ) : (
                /* ═══════════════════════════════════════════
                   FREE LAB MODE — Full interactive playground
                   ═══════════════════════════════════════════ */
                <div className="max-w-7xl mx-auto pb-24">

                    {/* ─── HERO ─── */}
                    <ModelHero />

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

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl mx-auto px-6 mb-28"
                    >
                        <BigramDiagramExperience
                            mode="lab"
                            matrixData={viz.data?.visualization.transition_matrix ?? null}
                            trainingData={viz.data?.visualization.training ?? null}
                            onCellClick={handleCellClick}
                        />
                    </motion.div>

                    {/* ─── 02 · INFERENCE & GENERATION ─── */}
                    <SectionDivider
                        number="02"
                        title={t("models.bigram.sections.inference.title")}
                        description={t("models.bigram.sections.inference.description")}
                    />

                    <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-28">
                        {/* Left: Probability + Stepwise */}
                        <div className="space-y-16">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ duration: 0.6 }}
                                className="space-y-4"
                            >
                                <LabSectionHeader
                                    number="2.1"
                                    title={t("models.bigram.inference.probDist")}
                                    description={t("models.bigram.inference.probDistDesc")}
                                    accent="emerald"
                                />
                                <InferenceConsole
                                    onAnalyze={viz.analyze}
                                    predictions={viz.data?.predictions ?? null}
                                    inferenceMs={viz.data?.metadata.inference_time_ms}
                                    device={viz.data?.metadata.device}
                                    loading={viz.loading}
                                    error={viz.error}
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="space-y-4"
                            >
                                <LabSectionHeader
                                    number="2.2"
                                    title={t("models.bigram.stepwise.mainTitle")}
                                    description={t("models.bigram.stepwise.description")}
                                    accent="violet"
                                />
                                <StepwisePrediction
                                    onPredict={step.predict}
                                    steps={step.data?.steps ?? null}
                                    finalPrediction={step.data?.final_prediction ?? null}
                                    loading={step.loading}
                                    error={step.error}
                                />
                            </motion.div>
                        </div>

                        {/* Right: Generation */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.6, delay: 0.15 }}
                            className="space-y-4"
                        >
                            <LabSectionHeader
                                number="2.3"
                                title={t("models.bigram.generation.mainTitle")}
                                description={t("models.bigram.generation.description")}
                                accent="amber"
                            />
                            <GenerationPlayground
                                onGenerate={gen.generate}
                                generatedText={gen.data?.generated_text ?? null}
                                loading={gen.loading}
                                error={gen.error}
                            />
                        </motion.div>
                    </div>

                    {/* ─── 03 · ARCHITECTURE ─── */}
                    <SectionDivider
                        number="03"
                        title={t("models.bigram.sections.architecture.title")}
                        description={t("models.bigram.sections.architecture.description")}
                    />
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.6 }}
                        className="mb-28"
                    >
                        <ArchitectureDeepDive
                            data={viz.data?.visualization.architecture ?? null}
                        />
                    </motion.div>



                    {/* ─── HISTORICAL CONTEXT ─── */}
                    {viz.data?.historical_context && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.6 }}
                            className="max-w-5xl mx-auto px-6 mt-28"
                        >
                            <HistoricalContextPanel
                                data={{
                                    description: t("models.bigram.historicalContext.description"),
                                    limitations: [
                                        t("models.bigram.historicalContext.limitations.0"),
                                        t("models.bigram.historicalContext.limitations.1")
                                    ],
                                    modern_evolution: t("models.bigram.historicalContext.evolution")
                                }}
                                collapsible
                            />
                        </motion.div>
                    )}

                    {/* ─── FOOTER ─── */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="mt-32 border-t border-white/[0.05] pt-12 flex flex-col items-center gap-3"
                    >
                        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-white/20">
                            <FlaskConical className="h-3 w-3" />
                            <span>LM-Lab · {t("models.bigram.hero.scientificInstrument")}</span>
                        </div>
                        <p className="text-[10px] text-white/15 font-mono">
                            Switch to Story Mode for the guided narrative experience
                        </p>
                    </motion.div>
                </div>
            )}

            {/* MODALS */}
            <DatasetExplorerModal
                isOpen={modalState.isOpen}
                onClose={closeModal}
                contextChar={modalState.contextChar}
                nextChar={modalState.nextChar}
            />
        </LabShell>
    );
}

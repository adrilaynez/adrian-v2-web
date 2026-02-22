"use client";

import { motion } from "framer-motion";
import { BookOpen, FlaskConical, ArrowDown, Lightbulb, ArrowRight, Beaker } from "lucide-react";
import { ModeToggle } from "@/components/lab/ModeToggle";
import { InferenceConsole } from "@/components/lab/InferenceConsole";
import { GenerationPlayground } from "@/components/lab/GenerationPlayground";
import { TransitionMatrix } from "@/components/lab/TransitionMatrix";
import type { TransitionMatrixViz, Prediction, TrainingViz } from "@/types/lmLab";
import { useI18n } from "@/i18n/context";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import Link from "next/link";
import { useLabMode } from "@/context/LabModeContext";
import { BigramBuilder } from "@/components/lab/BigramBuilder";
import { TextToNumbersWidget } from "@/components/lab/TextToNumbersWidget";
import { PairHighlighter } from "@/components/lab/PairHighlighter";
import { HeroAutoComplete } from "@/components/lab/HeroAutoComplete";
import { TinyMatrixExample } from "@/components/lab/TinyMatrixExample";
import { PredictionChallenge } from "@/components/lab/PredictionChallenge";
import { MemoryLimitDemo } from "@/components/lab/MemoryLimitDemo";
import { NormalizationVisualizer } from "@/components/lab/NormalizationVisualizer";
import { MatrixGuidedOverlay } from "@/components/lab/MatrixGuidedOverlay";
import { SoftmaxTemperatureVisualizer } from "@/components/lab/mlp/SoftmaxTemperatureVisualizer";

/* ─────────────────────────────────────────────
   Primitive building blocks
   ───────────────────────────────────────────── */

function Section({ children }: { children: React.ReactNode }) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="mb-20 md:mb-28"
        >
            {children}
        </motion.section>
    );
}

function SectionLabel({ number, label }: { number: string; label: string }) {
    return (
        <div className="flex items-center gap-3 mb-8">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono font-bold text-emerald-400">
                {number}
            </span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-white/25">
                {label}
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-white/[0.06] to-transparent" />
        </div>
    );
}

function Heading({ children }: { children: React.ReactNode }) {
    return (
        <h2 className="text-2xl md:text-[2rem] font-bold text-white tracking-tight mb-6 leading-tight">
            {children}
        </h2>
    );
}

function Lead({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-lg md:text-xl text-white/50 leading-[1.8] mb-6 font-light">
            {children}
        </p>
    );
}

function P({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-[15px] md:text-base text-white/45 leading-[1.9] mb-5 last:mb-0">
            {children}
        </p>
    );
}

function Highlight({ children }: { children: React.ReactNode }) {
    return <strong className="text-emerald-400 font-semibold">{children}</strong>;
}

function Callout({
    icon: Icon = Lightbulb,
    title,
    children,
}: {
    icon?: React.ComponentType<{ className?: string }>;
    title?: string;
    children: React.ReactNode;
}) {
    return (
        <motion.aside
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4 }}
            className="my-8 pl-4 border-l-2 border-emerald-400/50"
        >
            <div className="flex gap-4">
                <div className="shrink-0 mt-0.5">
                    <Icon className="w-4.5 h-4.5 text-emerald-400" />
                </div>
                <div className="min-w-0">
                    {title && (
                        <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                            {title}
                        </p>
                    )}
                    <div className="text-sm text-white/60 leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0">
                        {children}
                    </div>
                </div>
            </div>
        </motion.aside>
    );
}

function FormulaBlock({ formula, caption }: { formula: string; caption: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            className="my-10 text-center"
        >
            <div className="flex items-center justify-center mb-6">
                <div className="inline-block px-8 py-4 rounded-xl border border-emerald-400/20">
                    <BlockMath math={formula} />
                </div>
            </div>
            <p className="text-center text-sm md:text-base text-white/45 italic font-light max-w-2xl mx-auto">
                {caption}
            </p>
        </motion.div>
    );
}

function PullQuote({ children }: { children: React.ReactNode }) {
    return (
        <motion.blockquote
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            className="my-10 md:my-12 pl-6 border-l-2 border-emerald-400/40"
        >
            <p className="text-lg md:text-xl text-white/60 font-light italic leading-relaxed">
                {children}
            </p>
        </motion.blockquote>
    );
}

function SectionBreak() {
    return (
        <div className="flex items-center justify-center gap-3 my-16 md:my-20">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/[0.08]" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/[0.08]" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/[0.08]" />
        </div>
    );
}

function FigureWrapper({
    label,
    hint,
    showWindowDots = true,
    children,
}: {
    label: string;
    hint?: string;
    showWindowDots?: boolean;
    children: React.ReactNode;
}) {
    return (
        <motion.figure
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="my-12 md:my-16 -mx-4 sm:mx-0"
        >
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                    {showWindowDots && (
                        <div className="flex gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
                            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
                            <span className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
                        </div>
                    )}
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">
                        {label}
                    </span>
                </div>
                <div className="p-4 sm:p-6">{children}</div>
            </div>
            {hint && (
                <figcaption className="mt-3 text-center text-xs text-white/25 italic">
                    {hint}
                </figcaption>
            )}
        </motion.figure>
    );
}

/* ─────────────────────────────────────────────
   Main narrative component
   ───────────────────────────────────────────── */

interface BigramNarrativeProps {
    matrixData: TransitionMatrixViz | null;
    trainingData?: TrainingViz | null;
    onCellClick: (row: string, col: string) => void;

    onAnalyze: (text: string, topK: number) => void;
    predictions: Prediction[] | null;
    inferenceMs?: number;
    device?: string;
    vizLoading: boolean;
    vizError: string | null;

    onGenerate: (startChar: string, numTokens: number, temperature: number) => void;
    generatedText: string | null;
    genLoading: boolean;
    genError: string | null;
}

export function BigramNarrative({
    matrixData,
    trainingData,
    onCellClick,
    onAnalyze,
    predictions,
    inferenceMs,
    device,
    vizLoading,
    vizError,
    onGenerate,
    generatedText,
    genLoading,
    genError,
}: BigramNarrativeProps) {
    const { t } = useI18n();
    const { setMode } = useLabMode();

    return (
        <article className="max-w-[920px] mx-auto px-6 pt-8 pb-24">

            {/* ───────────────────── HERO ───────────────────── */}
            <header className="text-center mb-24 md:mb-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <span className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-emerald-400/60 mb-6">
                        <BookOpen className="w-3.5 h-3.5" />
                        {t("bigramNarrative.hero.eyebrow")}
                    </span>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
                        {t("bigramNarrative.hero.titlePrefix")}{" "}
                        <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                            {t("bigramNarrative.hero.titleSuffix")}
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-white/35 max-w-xl mx-auto leading-relaxed mb-12">
                        {t("bigramNarrative.hero.description")}
                    </p>

                    <div className="flex justify-center mb-14">
                        <ModeToggle />
                    </div>

                    <div className="mt-10 max-w-lg mx-auto">
                        <p className="text-xs text-center text-white/40 mb-3">{t("bigramNarrative.hero.autoCompleteHint")}</p>
                        <HeroAutoComplete />
                    </div>

                    <motion.div
                        animate={{ y: [0, 6, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        className="mt-8 text-white/10"
                    >
                        <ArrowDown className="w-5 h-5 mx-auto" />
                    </motion.div>
                </motion.div>
            </header>

            {/* ─────────── §1 · HOW COMPUTERS SEE TEXT ─────────── */}
            <Section>
                <SectionLabel number="1" label={t("bigramNarrative.textToNumbers.label")} />
                <Heading>{t("bigramNarrative.textToNumbers.title")}</Heading>
                <Lead>{t("bigramNarrative.textToNumbers.lead")}</Lead>
                <P>{t("bigramNarrative.textToNumbers.p1")}</P>
                <FigureWrapper
                    label={t("bigramNarrative.textToNumbers.label")}
                    hint={t("bigramNarrative.textToNumbers.bridge")}
                >
                    <TextToNumbersWidget />
                </FigureWrapper>
                <P>{t("bigramNarrative.textToNumbers.bridge")}</P>
            </Section>

            <SectionBreak />

            {/* ─────────── §2 · THE PROBLEM ─────────── */}
            <Section>
                <SectionLabel number="2" label={t("bigramNarrative.problem.label")} />
                <Heading>{t("bigramNarrative.problem.title")}</Heading>
                <Lead>{t("bigramNarrative.problem.lead")}</Lead>
                <P>
                    {t("bigramNarrative.problem.p1")}
                    <Highlight>{t("bigramNarrative.problem.p1Highlight")}</Highlight>
                    {t("bigramNarrative.problem.p2")}
                </P>
                <P>{t("bigramNarrative.problem.p3")}</P>
                <PullQuote>{t("bigramNarrative.problem.quote")}</PullQuote>
                <P>
                    {t("bigramNarrative.problem.p4")}
                    <Highlight>{t("bigramNarrative.problem.h1")}</Highlight>,{" "}
                    <Highlight>{t("bigramNarrative.problem.h2")}</Highlight>, and{" "}
                    <Highlight>{t("bigramNarrative.problem.h3")}</Highlight>
                    {t("bigramNarrative.problem.p5")}
                </P>
                <FigureWrapper
                    label={t("bigramNarrative.predictionChallenge.label")}
                    hint={t("bigramNarrative.predictionChallenge.lead")}
                >
                    <PredictionChallenge />
                </FigureWrapper>
            </Section>

            <SectionBreak />

            {/* ─────────── §3 · THE BIGRAM IDEA: JUST COUNT PAIRS ─────────── */}
            <Section>
                <SectionLabel number="3" label={t("bigramNarrative.coreIdea.label")} />
                <Heading>{t("bigramNarrative.coreIdea.title")}</Heading>
                <Lead>{t("bigramNarrative.coreIdea.lead")}</Lead>
                <P>
                    {t("bigramNarrative.coreIdea.p1")}
                    <Highlight>{t("bigramNarrative.coreIdea.h1")}</Highlight>
                    {t("bigramNarrative.coreIdea.p2")}
                </P>
                <FormulaBlock
                    formula="P(x_{t+1} \mid x_t)"
                    caption={t("bigramNarrative.coreIdea.caption")}
                />
                <P>{t("bigramNarrative.coreIdea.p3")}</P>
                <Callout title={t("bigramNarrative.coreIdea.calloutTitle")}>
                    <p>
                        {t("bigramNarrative.coreIdea.calloutP1")}
                        <strong>{t("bigramNarrative.coreIdea.calloutH1")}</strong>
                        {t("bigramNarrative.coreIdea.calloutP2")}
                    </p>
                </Callout>

                <P>{t("bigramNarrative.counting.p1")}</P>
                <P>{t("bigramNarrative.counting.p2")}</P>
                <FigureWrapper
                    label={t("bigramNarrative.counting.builderTitle")}
                    hint={t("bigramNarrative.counting.builderDesc")}
                >
                    <BigramBuilder />
                </FigureWrapper>
                <Callout title={t("bigramNarrative.counting.calloutTitle")}>
                    <p>{t("bigramNarrative.counting.calloutText")}</p>
                </Callout>
            </Section>

            <SectionBreak />

            {/* ─────────── §4 · THE FULL PICTURE: TRANSITION MATRIX ─────────── */}
            <Section>
                <SectionLabel number="4" label={t("bigramNarrative.mechanics.label")} />
                <Heading>{t("bigramNarrative.mechanics.title")}</Heading>
                <Lead>{t("bigramNarrative.mechanics.lead")}</Lead>
                <P>
                    {t("bigramNarrative.mechanics.p1")}
                    <Highlight>{t("bigramNarrative.mechanics.h1")}</Highlight>
                    {t("bigramNarrative.mechanics.p2")}
                </P>
                <P>{t("bigramNarrative.mechanics.p3")}</P>
                <FigureWrapper
                    label={t("bigramNarrative.mechanics.tinyMatrixLabel")}
                    hint={t("bigramNarrative.mechanics.tinyMatrixHint")}
                >
                    <TinyMatrixExample />
                </FigureWrapper>
                <Callout title={t("bigramNarrative.mechanics.dataSourceTitle")}>
                    <p className="mb-2">{t("bigramNarrative.mechanics.dataSourceP1")}</p>
                    <p className="mb-2">{t("bigramNarrative.mechanics.dataSourceP2")}</p>
                    <p>{t("bigramNarrative.mechanics.dataSourceP3")}</p>
                </Callout>
                <FigureWrapper
                    label={t("bigramNarrative.mechanics.label")}
                    hint={t("bigramNarrative.mechanics.calloutP1")}
                >
                    <TransitionMatrix
                        data={matrixData}
                        onCellClick={onCellClick}
                        accent="emerald"
                    />
                </FigureWrapper>
                <Callout title={t("bigramNarrative.mechanics.calloutTitle")}>
                    <p>{t("bigramNarrative.mechanics.calloutP1")}</p>
                </Callout>
            </Section>

            <SectionBreak />

            {/* ─────────── §5 · NORMALIZATION ─────────── */}
            <Section>
                <SectionLabel number="5" label={t("bigramNarrative.normalization.label")} />
                <Heading>{t("bigramNarrative.normalization.title")}</Heading>
                <Lead>{t("bigramNarrative.normalization.lead")}</Lead>
                <P>
                    {t("bigramNarrative.normalization.p1")}
                    <Highlight>{t("bigramNarrative.normalization.h1")}</Highlight>
                    {t("bigramNarrative.normalization.p2")}
                </P>
                <FormulaBlock
                    formula="P(x_{t+1} \mid x_t) = \frac{\text{count}(x_t, x_{t+1})}{\sum_c \text{count}(x_t, c)}"
                    caption={t("bigramNarrative.coreIdea.caption")}
                />
                <Callout title={t("bigramNarrative.normalization.plainEnglishTitle")}>
                    <p>{t("bigramNarrative.normalization.plainEnglish")}</p>
                </Callout>
                <FigureWrapper
                    label="NORMALIZATION VISUALIZER"
                    hint="Watch the conversion from raw counts to probabilities step by step"
                    showWindowDots={false}
                >
                    <NormalizationVisualizer />
                </FigureWrapper>
                <P>{t("bigramNarrative.normalization.p3")}</P>
                <P>
                    {t("bigramNarrative.normalization.p4")}
                    <Highlight>{t("bigramNarrative.normalization.h2")}</Highlight>
                    {t("bigramNarrative.normalization.p5")}
                </P>
                <P>{t("bigramNarrative.probabilities.inferenceIntro")}</P>
                <FigureWrapper
                    label={t("bigramNarrative.probabilities.overlayTitle")}
                    hint={t("bigramNarrative.probabilities.overlayDesc")}
                >
                    <InferenceConsole
                        onAnalyze={onAnalyze}
                        predictions={predictions}
                        inferenceMs={inferenceMs}
                        device={device}
                        loading={vizLoading}
                        error={vizError}
                    />
                </FigureWrapper>
            </Section>

            <SectionBreak />

            {/* ─────────── §6 · GENERATING TEXT ─────────── */}
            <Section>
                <SectionLabel number="6" label={t("bigramNarrative.sampling.label")} />
                <Heading>{t("bigramNarrative.sampling.title")}</Heading>
                <Lead>{t("bigramNarrative.sampling.lead")}</Lead>
                <P>
                    {t("bigramNarrative.sampling.p1")}
                    <Highlight>{t("bigramNarrative.sampling.h1")}</Highlight>
                    {t("bigramNarrative.sampling.p2")}
                </P>
                <P>
                    {t("bigramNarrative.sampling.tempP1")}
                    <Highlight>{t("bigramNarrative.sampling.tempH1")}</Highlight>
                    {t("bigramNarrative.sampling.tempP2")}
                </P>
                <FigureWrapper
                    label={t("bigramNarrative.sampling.softmaxFigureLabel")}
                    hint={t("bigramNarrative.sampling.softmaxFigureHint")}
                    showWindowDots={false}
                >
                    <SoftmaxTemperatureVisualizer />
                </FigureWrapper>
                <P>{t("bigramNarrative.sampling.tempBridge")}</P>
                <FigureWrapper
                    label={t("bigramNarrative.sampling.playgroundLabel")}
                    hint={t("bigramNarrative.sampling.playgroundHint")}
                >
                    <GenerationPlayground
                        onGenerate={onGenerate}
                        generatedText={generatedText}
                        loading={genLoading}
                        error={genError}
                    />
                </FigureWrapper>
                <P>
                    {t("bigramNarrative.sampling.p3")}
                    <Highlight>{t("bigramNarrative.sampling.h2")}</Highlight>
                    {t("bigramNarrative.sampling.p4")}
                </P>
            </Section>

            <SectionBreak />

            {/* ─────────── §7 · THE ONE-CHARACTER TRAP ─────────── */}
            <Section>
                <SectionLabel number="7" label={t("bigramNarrative.cliffhanger.label")} />
                <Heading>{t("bigramNarrative.cliffhanger.title")}</Heading>
                <Lead>{t("bigramNarrative.cliffhanger.lead")}</Lead>
                <P>{t("bigramNarrative.cliffhanger.p1")}</P>
                <FigureWrapper label={t("bigramNarrative.cliffhanger.label")}>
                    <MemoryLimitDemo />
                </FigureWrapper>
                <PullQuote>{t("bigramNarrative.cliffhanger.hookLine")}</PullQuote>
            </Section>

            <SectionBreak />

            {/* ─────────── CTA ─────────── */}
            <Section>
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-3">
                        {t("bigramNarrative.cta.title")}
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setMode("free")}
                        className="group relative rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/20 to-black/60 p-6 text-left transition-colors hover:border-emerald-500/40 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        <div className="relative">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 rounded-xl bg-emerald-500/15">
                                    <Beaker className="w-5 h-5 text-emerald-300" />
                                </div>
                                <span className="text-lg font-bold text-white">
                                    {t("bigramNarrative.cta.freeLabButton")}
                                </span>
                            </div>
                            <p className="text-sm text-white/45 leading-relaxed">
                                {t("bigramNarrative.cta.freeLabDesc")}
                            </p>
                        </div>
                    </motion.button>

                    <Link href="/lab/ngram">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="group relative rounded-2xl border border-teal-500/20 bg-gradient-to-br from-teal-950/20 to-black/60 p-6 text-left transition-colors hover:border-teal-500/40 overflow-hidden h-full"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            <div className="relative">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 rounded-xl bg-teal-500/15">
                                        <ArrowRight className="w-5 h-5 text-teal-300" />
                                    </div>
                                    <span className="text-lg font-bold text-white">
                                        {t("bigramNarrative.cta.nextTitle")}
                                    </span>
                                </div>
                                <p className="text-sm text-white/45 leading-relaxed">
                                    {t("bigramNarrative.cta.nextDesc")}
                                </p>
                            </div>
                        </motion.div>
                    </Link>
                </div>
            </Section>

            {/* ───────────────── FOOTER ───────────────── */}
            <motion.footer
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-8 pt-12 border-t border-white/[0.06] text-center"
            >
                <div className="flex items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-widest text-white/10">
                    <FlaskConical className="h-3 w-3" />
                    {t("bigramNarrative.footer.brand")}
                </div>
            </motion.footer>
        </article>
    );
}
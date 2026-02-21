"use client";

import { motion } from "framer-motion";
import { BookOpen, FlaskConical, ArrowDown, Lightbulb, ArrowRight } from "lucide-react";
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
import { MemoryLimitDemo } from "@/components/lab/MemoryLimitDemo";
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
                <div className="inline-block px-8 py-4 rounded-xl bg-black/50 border border-emerald-400/20">
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

                <FigureWrapper label={t("bigramNarrative.textToNumbers.label")}>
                    <TextToNumbersWidget />
                </FigureWrapper>

                <P>{t("bigramNarrative.textToNumbers.bridge")}</P>
            </Section>

            <SectionBreak />

            {/* ─────────── §2 · THE PROBLEM ─────────── */}
            <Section>
                <SectionLabel number="2" label={t("bigramNarrative.problem.label")} />
                <Heading>{t("bigramNarrative.problem.title")}</Heading>

                <Lead>
                    {t("bigramNarrative.problem.lead")}
                </Lead>

                <P>
                    {t("bigramNarrative.problem.p1")}<Highlight>{t("bigramNarrative.problem.p1Highlight")}</Highlight>{t("bigramNarrative.problem.p2")}
                </P>

                <P>
                    {t("bigramNarrative.problem.p3")}
                </P>

                <PullQuote>
                    {t("bigramNarrative.problem.quote")}
                </PullQuote>

                <P>
                    {t("bigramNarrative.problem.p4")}
                    <Highlight>{t("bigramNarrative.problem.h1")}</Highlight>
                    {t("bigramNarrative.problem.p5")}
                </P>
            </Section>

            <SectionBreak />

            {/* ─────────── §3 · THE BIGRAM IDEA ─────────── */}
            <Section>
                <SectionLabel number="3" label={t("bigramNarrative.coreIdea.label")} />
                <Heading>{t("bigramNarrative.counting.title")}</Heading>
                <Lead>{t("bigramNarrative.coreIdea.lead")}</Lead>
                <P>
                    {t("bigramNarrative.coreIdea.p1")}
                    <Highlight>{t("bigramNarrative.coreIdea.h1")}</Highlight>
                    {t("bigramNarrative.coreIdea.p2")}
                </P>
                <P>{t("bigramNarrative.coreIdea.p3")}</P>
                <Callout title={t("bigramNarrative.coreIdea.calloutTitle")}>
                    <p>
                        {t("bigramNarrative.coreIdea.calloutP1")}
                        <Highlight>{t("bigramNarrative.coreIdea.calloutH1")}</Highlight>
                        {t("bigramNarrative.coreIdea.calloutP2")}
                    </p>
                </Callout>
                <Lead>{t("bigramNarrative.counting.lead")}</Lead>
                <P>{t("bigramNarrative.counting.p1")}</P>
                <P>{t("bigramNarrative.counting.p2")}</P>
                <FigureWrapper label={t("bigramNarrative.counting.title")}>
                    <PairHighlighter />
                    <BigramBuilder />
                </FigureWrapper>
                <Callout title={t("bigramNarrative.counting.calloutTitle")}>
                    <p>{t("bigramNarrative.counting.calloutText")}</p>
                </Callout>
            </Section>

            <SectionBreak />

            {/* ─────────── §4 · THE TRANSITION MATRIX ─────────── */}
            <Section>
                <SectionLabel number="4" label={t("bigramNarrative.mechanics.label")} />
                <Heading>{t("bigramNarrative.mechanics.title")}</Heading>
                <Lead>{t("bigramNarrative.mechanics.lead")}</Lead>
                <P>
                    {t("bigramNarrative.mechanics.p1")}
                    <Highlight>{t("bigramNarrative.mechanics.h1")}</Highlight>
                    {t("bigramNarrative.mechanics.p2")}
                </P>
                <FigureWrapper label={t("bigramNarrative.mechanics.title")}>
                    <MatrixGuidedOverlay />
                    <TransitionMatrix
                        data={matrixData}
                        onCellClick={onCellClick}
                        datasetMeta={{
                            corpusName: "Paul Graham essays (paulgraham.com)",
                            rawTextSize: trainingData?.raw_text_size,
                            trainDataSize: trainingData?.train_data_size,
                            vocabSize: trainingData?.unique_characters,
                        }}
                    />
                </FigureWrapper>
                <P>{t("bigramNarrative.mechanics.p3")}</P>
                <Callout title={t("bigramNarrative.mechanics.calloutTitle")}>
                    <p>{t("bigramNarrative.mechanics.calloutP1")}</p>
                </Callout>
            </Section>

            <SectionBreak />

            {/* ─────────── §5 · FROM COUNTS TO PROBABILITIES ─────────── */}
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

            {/* ─────────── §7 · CHARACTERS VS WORDS ─────────── */}
            <Section>
                <SectionLabel number="7" label={t("bigramNarrative.tokens.label")} />
                <Heading>{t("bigramNarrative.tokens.title")}</Heading>
                <Lead>{t("bigramNarrative.tokens.lead")}</Lead>
                <div className="grid md:grid-cols-2 gap-6 my-10">
                    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-2 h-2 rounded-full bg-emerald-400" />
                            <h3 className="text-lg font-bold text-white">{t("bigramNarrative.tokens.charLevelTitle")}</h3>
                        </div>
                        <p className="text-white/50 text-sm leading-relaxed">{t("bigramNarrative.tokens.charLevelBody")}</p>
                    </div>
                    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-2 h-2 rounded-full bg-white/20" />
                            <h3 className="text-lg font-bold text-white">{t("bigramNarrative.tokens.wordLevelTitle")}</h3>
                        </div>
                        <p className="text-white/50 text-sm leading-relaxed">{t("bigramNarrative.tokens.wordLevelBody")}</p>
                    </div>
                </div>
            </Section>

            <SectionBreak />

            {/* ─────────── §8 · THE ONE-CHARACTER TRAP ─────────── */}
            <Section>
                <SectionLabel number="8" label={t("bigramNarrative.cliffhanger.label")} />
                <Heading>{t("bigramNarrative.cliffhanger.title")}</Heading>
                <Lead>{t("bigramNarrative.cliffhanger.lead")}</Lead>
                <P>{t("bigramNarrative.cliffhanger.p1")}</P>
                <FigureWrapper label={t("bigramNarrative.cliffhanger.label")}>
                    <MemoryLimitDemo />
                </FigureWrapper>
                <PullQuote>{t("bigramNarrative.cliffhanger.hookLine")}</PullQuote>
            </Section>

            {/* ───────────────── CODA ───────────────── */}
            <motion.footer
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-8 pt-12 border-t border-white/[0.06] text-center"
            >
                <p className="text-sm text-white/25 italic max-w-md mx-auto leading-relaxed mb-10">
                    {t("bigramNarrative.footer.text")}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                    <button
                        onClick={() => setMode("free")}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-emerald-400 text-sm font-semibold transition-colors"
                    >
                        <FlaskConical className="w-4 h-4" />
                        {t("bigramNarrative.cta.freeLabButton")}
                    </button>
                    <Link
                        href="/lab/ngram"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white/70 hover:text-white text-sm font-semibold transition-colors"
                    >
                        {t("bigramNarrative.cta.nextTitle")}
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="flex items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-widest text-white/10">
                    <FlaskConical className="h-3 w-3" />
                    {t("bigramNarrative.footer.brand")}
                </div>
            </motion.footer>
        </article>
    );
}
"use client";

import { motion } from "framer-motion";
import { BookOpen, FlaskConical, ArrowDown, Lightbulb, AlertTriangle } from "lucide-react";
import { ModeToggle } from "@/components/lab/ModeToggle";
import { useI18n } from "@/i18n/context";
import { NNPerceptronDiagram } from "@/components/lab/NNPerceptronDiagram";
import { NNWeightBiasExplorer } from "@/components/lab/NNWeightBiasExplorer";
import { NNActivationExplorer } from "@/components/lab/NNActivationExplorer";
import { NNBackpropVisualizer } from "@/components/lab/NNBackpropVisualizer";
import { NNTrainingDemo } from "@/components/lab/NNTrainingDemo";
import { NNBigramComparison } from "@/components/lab/NNBigramComparison";

import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

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
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-rose-500/10 border border-rose-500/20 text-[11px] font-mono font-bold text-rose-400">
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

function Highlight({ children, color = "rose" }: { children: React.ReactNode; color?: "rose" | "amber" | "indigo" | "emerald" }) {
    const colors = {
        rose: "text-rose-400",
        amber: "text-amber-400",
        indigo: "text-indigo-400",
        emerald: "text-emerald-400",
    };
    return <strong className={`${colors[color]} font-semibold`}>{children}</strong>;
}

function Callout({
    icon: Icon = Lightbulb,
    accent = "rose",
    title,
    children,
}: {
    icon?: React.ComponentType<{ className?: string }>;
    accent?: "rose" | "amber" | "indigo" | "emerald";
    title?: string;
    children: React.ReactNode;
}) {
    const accentMap = {
        rose: {
            border: "border-rose-500/20",
            bg: "bg-rose-500/[0.04]",
            icon: "text-rose-400",
            title: "text-rose-400",
            glow: "from-rose-500/[0.06]",
        },
        amber: {
            border: "border-amber-500/20",
            bg: "bg-amber-500/[0.04]",
            icon: "text-amber-400",
            title: "text-amber-400",
            glow: "from-amber-500/[0.06]",
        },
        indigo: {
            border: "border-indigo-500/20",
            bg: "bg-indigo-500/[0.04]",
            icon: "text-indigo-400",
            title: "text-indigo-400",
            glow: "from-indigo-500/[0.06]",
        },
        emerald: {
            border: "border-emerald-500/20",
            bg: "bg-emerald-500/[0.04]",
            icon: "text-emerald-400",
            title: "text-emerald-400",
            glow: "from-emerald-500/[0.06]",
        },
    };
    const a = accentMap[accent];

    return (
        <motion.aside
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4 }}
            className={`relative my-8 rounded-xl border ${a.border} ${a.bg} p-5 md:p-6 overflow-hidden`}
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${a.glow} to-transparent pointer-events-none`} />
            <div className="relative flex gap-4">
                <div className="shrink-0 mt-0.5">
                    <Icon className={`w-4.5 h-4.5 ${a.icon}`} />
                </div>
                <div className="min-w-0">
                    {title && (
                        <p className={`text-xs font-bold uppercase tracking-[0.15em] ${a.title} mb-2`}>
                            {title}
                        </p>
                    )}
                    <div className="text-sm text-white/50 leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0">
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
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            className="my-10 text-center"
        >
            <div className="flex items-center justify-center mb-10">
                <div className="inline-block px-8 py-4 rounded-2xl bg-rose-500/[0.04] border border-rose-500/[0.15] backdrop-blur-sm shadow-[0_0_40px_-15px_rgba(244,63,94,0.15)]">
                    <BlockMath math={formula} />
                </div>
            </div>
            <p className="text-center text-sm md:text-base text-white/40 italic font-light max-w-2xl mx-auto">
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
            className="my-10 md:my-12 pl-6 border-l-2 border-rose-500/30"
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

function ActivationCard({ title, description }: { title: string; description: string }) {
    return (
        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="text-xs font-mono font-bold text-rose-400/70 mb-1.5">{title}</p>
            <p className="text-sm text-white/40 leading-relaxed">{description}</p>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Main narrative component
   ───────────────────────────────────────────── */

export function NeuralNetworkNarrative() {
    const { t } = useI18n();

    return (
        <article className="max-w-[920px] mx-auto px-6 pt-8 pb-24">

            {/* ───────────────────── HERO ───────────────────── */}
            <header className="text-center mb-24 md:mb-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <span className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-rose-400/60 mb-6">
                        <BookOpen className="w-3.5 h-3.5" />
                        {t("neuralNetworkNarrative.hero.eyebrow")}
                    </span>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
                        {t("neuralNetworkNarrative.hero.titlePrefix")}{" "}
                        <span className="bg-gradient-to-r from-rose-400 via-pink-300 to-rose-400 bg-clip-text text-transparent">
                            {t("neuralNetworkNarrative.hero.titleSuffix")}
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-white/35 max-w-xl mx-auto leading-relaxed mb-12">
                        {t("neuralNetworkNarrative.hero.description")}
                    </p>

                    <div className="flex justify-center mb-14">
                        <ModeToggle />
                    </div>

                    <motion.div
                        animate={{ y: [0, 6, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        className="text-white/10"
                    >
                        <ArrowDown className="w-5 h-5 mx-auto" />
                    </motion.div>
                </motion.div>
            </header>

            {/* ─────────── 01 · HISTORICAL ORIGINS ─────────── */}
            <Section>
                <SectionLabel
                    number={t("models.neuralNetworks.sections.historicalOrigins.number")}
                    label={t("models.neuralNetworks.sections.historicalOrigins.label")}
                />
                <Heading>{t("neuralNetworkNarrative.historical.title")}</Heading>

                <Lead>{t("neuralNetworkNarrative.historical.lead")}</Lead>

                <P>
                    {t("neuralNetworkNarrative.historical.p1")}{" "}
                    <Highlight>{t("neuralNetworkNarrative.historical.p1Highlight")}</Highlight>{" "}
                    {t("neuralNetworkNarrative.historical.p1End")}
                </P>

                <P>{t("neuralNetworkNarrative.historical.p2")}</P>

                <P>
                    {t("neuralNetworkNarrative.historical.p3")}{" "}
                    <Highlight>{t("neuralNetworkNarrative.historical.p3Highlight")}</Highlight>{" "}
                    {t("neuralNetworkNarrative.historical.p3End")}
                </P>

                <PullQuote>{t("neuralNetworkNarrative.historical.quote")}</PullQuote>

                <P>{t("neuralNetworkNarrative.historical.p4")}</P>
            </Section>

            <SectionBreak />

            {/* ─────────── 02 · FROM COUNTING TO LEARNING ─────────── */}
            <Section>
                <SectionLabel
                    number={t("models.neuralNetworks.sections.countingToLearning.number")}
                    label={t("models.neuralNetworks.sections.countingToLearning.label")}
                />
                <Heading>{t("neuralNetworkNarrative.countingToLearning.title")}</Heading>

                <Lead>{t("neuralNetworkNarrative.countingToLearning.lead")}</Lead>

                <P>
                    {t("neuralNetworkNarrative.countingToLearning.p1")}{" "}
                    <Highlight>{t("neuralNetworkNarrative.countingToLearning.p1Highlight")}</Highlight>{" "}
                    {t("neuralNetworkNarrative.countingToLearning.p1End")}
                </P>

                <P>
                    {t("neuralNetworkNarrative.countingToLearning.p2")}{" "}
                    <Highlight>{t("neuralNetworkNarrative.countingToLearning.p2Highlight")}</Highlight>{" "}
                    {t("neuralNetworkNarrative.countingToLearning.p2End")}
                </P>

                <Callout icon={Lightbulb} accent="rose" title={t("neuralNetworkNarrative.countingToLearning.insightTitle")}>
                    <p>{t("neuralNetworkNarrative.countingToLearning.insightText")}</p>
                </Callout>

                <P>{t("neuralNetworkNarrative.countingToLearning.p3")}</P>
            </Section>

            <SectionBreak />

            {/* ─────────── 03 · THE PERCEPTRON ─────────── */}
            <Section>
                <SectionLabel
                    number={t("models.neuralNetworks.sections.perceptron.number")}
                    label={t("models.neuralNetworks.sections.perceptron.label")}
                />
                <Heading>{t("neuralNetworkNarrative.perceptron.title")}</Heading>

                <Lead>{t("neuralNetworkNarrative.perceptron.lead")}</Lead>

                <P>
                    {t("neuralNetworkNarrative.perceptron.p1")}{" "}
                    <Highlight>{t("neuralNetworkNarrative.perceptron.p1Highlight")}</Highlight>{" "}
                    {t("neuralNetworkNarrative.perceptron.p1End")}
                </P>

                <P>{t("neuralNetworkNarrative.perceptron.p2")}</P>

                <FormulaBlock
                    formula="y = f\left(\sum_{i=1}^{n} w_i \, x_i + b\right)"
                    caption={t("neuralNetworkNarrative.perceptron.formulaCaption")}
                />

                <NNPerceptronDiagram />

                <P>
                    {t("neuralNetworkNarrative.perceptron.p3")}{" "}
                    <Highlight>{t("neuralNetworkNarrative.perceptron.p3Highlight")}</Highlight>{" "}
                    {t("neuralNetworkNarrative.perceptron.p3End")}
                </P>

                <P>{t("neuralNetworkNarrative.perceptron.p4")}</P>
            </Section>

            <SectionBreak />

            {/* ─────────── 04 · WEIGHTS AND BIAS ─────────── */}
            <Section>
                <SectionLabel
                    number={t("models.neuralNetworks.sections.weightsAndBias.number")}
                    label={t("models.neuralNetworks.sections.weightsAndBias.label")}
                />
                <Heading>{t("neuralNetworkNarrative.weightsAndBias.title")}</Heading>

                <Lead>{t("neuralNetworkNarrative.weightsAndBias.lead")}</Lead>

                <P>
                    {t("neuralNetworkNarrative.weightsAndBias.p1")}{" "}
                    <Highlight>{t("neuralNetworkNarrative.weightsAndBias.p1Highlight")}</Highlight>{" "}
                    {t("neuralNetworkNarrative.weightsAndBias.p1End")}
                </P>

                <P>
                    {t("neuralNetworkNarrative.weightsAndBias.p2")}{" "}
                    <Highlight>{t("neuralNetworkNarrative.weightsAndBias.p2Highlight")}</Highlight>{" "}
                    {t("neuralNetworkNarrative.weightsAndBias.p2End")}
                </P>

                <NNWeightBiasExplorer />

                <P>{t("neuralNetworkNarrative.weightsAndBias.p3")}</P>

                <Callout icon={Lightbulb} accent="indigo" title={t("neuralNetworkNarrative.weightsAndBias.calloutTitle")}>
                    <p>{t("neuralNetworkNarrative.weightsAndBias.calloutText")}</p>
                </Callout>
            </Section>

            <SectionBreak />

            {/* ─────────── 05 · ACTIVATION FUNCTIONS ─────────── */}
            <Section>
                <SectionLabel
                    number={t("models.neuralNetworks.sections.activationFunctions.number")}
                    label={t("models.neuralNetworks.sections.activationFunctions.label")}
                />
                <Heading>{t("neuralNetworkNarrative.activations.title")}</Heading>

                <Lead>{t("neuralNetworkNarrative.activations.lead")}</Lead>

                <P>{t("neuralNetworkNarrative.activations.p1")}</P>

                <P>{t("neuralNetworkNarrative.activations.p2")}</P>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    className="grid grid-cols-1 gap-3 my-8"
                >
                    <ActivationCard
                        title={t("neuralNetworkNarrative.activations.reluTitle")}
                        description={t("neuralNetworkNarrative.activations.reluDesc")}
                    />
                    <ActivationCard
                        title={t("neuralNetworkNarrative.activations.sigmoidTitle")}
                        description={t("neuralNetworkNarrative.activations.sigmoidDesc")}
                    />
                    <ActivationCard
                        title={t("neuralNetworkNarrative.activations.tanhTitle")}
                        description={t("neuralNetworkNarrative.activations.tanhDesc")}
                    />
                </motion.div>

                <NNActivationExplorer />

                <P>
                    {t("neuralNetworkNarrative.activations.p3")}{" "}
                    <Highlight color="indigo">{t("neuralNetworkNarrative.activations.p3Highlight")}</Highlight>{" "}
                    {t("neuralNetworkNarrative.activations.p3End")}
                </P>
            </Section>

            <SectionBreak />

            {/* ─────────── 06 · BACKPROPAGATION ─────────── */}
            <Section>
                <SectionLabel
                    number={t("models.neuralNetworks.sections.backpropagation.number")}
                    label={t("models.neuralNetworks.sections.backpropagation.label")}
                />
                <Heading>{t("neuralNetworkNarrative.backpropagation.title")}</Heading>

                <Lead>{t("neuralNetworkNarrative.backpropagation.lead")}</Lead>

                <P>
                    {t("neuralNetworkNarrative.backpropagation.p1")}{" "}
                    <Highlight>{t("neuralNetworkNarrative.backpropagation.p1Highlight")}</Highlight>{" "}
                    {t("neuralNetworkNarrative.backpropagation.p1End")}
                </P>

                <FormulaBlock
                    formula="\mathcal{L}(y, \hat{y})"
                    caption={t("neuralNetworkNarrative.backpropagation.lossCaption")}
                />

                <P>
                    {t("neuralNetworkNarrative.backpropagation.p2")}{" "}
                    <Highlight color="amber">{t("neuralNetworkNarrative.backpropagation.p2Highlight")}</Highlight>{" "}
                    {t("neuralNetworkNarrative.backpropagation.p2End")}
                </P>

                <P>
                    {t("neuralNetworkNarrative.backpropagation.p3")}{" "}
                    <Highlight color="indigo">{t("neuralNetworkNarrative.backpropagation.p3Highlight")}</Highlight>{" "}
                    {t("neuralNetworkNarrative.backpropagation.p3End")}
                </P>

                <NNBackpropVisualizer />

                <P>{t("neuralNetworkNarrative.backpropagation.p4")}</P>

                <FormulaBlock
                    formula="w \leftarrow w - \eta \, \frac{\partial \mathcal{L}}{\partial w}"
                    caption={t("neuralNetworkNarrative.backpropagation.updateCaption")}
                />

                <P>{t("neuralNetworkNarrative.backpropagation.p5")}</P>
            </Section>

            <SectionBreak />

            {/* ─────────── 07 · LEARNING AS PARAMETER UPDATES ─────────── */}
            <Section>
                <SectionLabel
                    number={t("models.neuralNetworks.sections.parameterUpdates.number")}
                    label={t("models.neuralNetworks.sections.parameterUpdates.label")}
                />
                <Heading>{t("neuralNetworkNarrative.parameterUpdates.title")}</Heading>

                <Lead>{t("neuralNetworkNarrative.parameterUpdates.lead")}</Lead>

                <P>
                    {t("neuralNetworkNarrative.parameterUpdates.p1")}{" "}
                    <Highlight>{t("neuralNetworkNarrative.parameterUpdates.p1Highlight")}</Highlight>{" "}
                    {t("neuralNetworkNarrative.parameterUpdates.p1End")}
                </P>

                <P>{t("neuralNetworkNarrative.parameterUpdates.p2")}</P>

                <Callout icon={Lightbulb} accent="amber" title={t("neuralNetworkNarrative.parameterUpdates.insightTitle")}>
                    <p>{t("neuralNetworkNarrative.parameterUpdates.insightText")}</p>
                </Callout>

                <P>{t("neuralNetworkNarrative.parameterUpdates.p3")}</P>

                <NNTrainingDemo />
            </Section>

            <SectionBreak />

            {/* ─────────── 08 · CONNECTION TO BIGRAM MODELS ─────────── */}
            <Section>
                <SectionLabel
                    number={t("models.neuralNetworks.sections.bigramConnection.number")}
                    label={t("models.neuralNetworks.sections.bigramConnection.label")}
                />
                <Heading>{t("neuralNetworkNarrative.bigramConnection.title")}</Heading>

                <Lead>{t("neuralNetworkNarrative.bigramConnection.lead")}</Lead>

                <P>{t("neuralNetworkNarrative.bigramConnection.p1")}</P>

                <P>
                    {t("neuralNetworkNarrative.bigramConnection.p2")}{" "}
                    <Highlight color="emerald">{t("neuralNetworkNarrative.bigramConnection.p2Highlight")}</Highlight>{" "}
                    {t("neuralNetworkNarrative.bigramConnection.p2End")}
                </P>

                <Callout icon={Lightbulb} accent="rose" title={t("neuralNetworkNarrative.bigramConnection.insightTitle")}>
                    <p>{t("neuralNetworkNarrative.bigramConnection.insightText")}</p>
                </Callout>

                <NNBigramComparison />

                <P>{t("neuralNetworkNarrative.bigramConnection.p3")}</P>
            </Section>

            <SectionBreak />

            {/* ─────────── 09 · POWER AND LIMITATIONS ─────────── */}
            <Section>
                <SectionLabel
                    number={t("models.neuralNetworks.sections.limitations.number")}
                    label={t("models.neuralNetworks.sections.limitations.label")}
                />
                <Heading>{t("neuralNetworkNarrative.limitations.title")}</Heading>

                <Lead>{t("neuralNetworkNarrative.limitations.lead")}</Lead>

                <P>
                    {t("neuralNetworkNarrative.limitations.p1")}{" "}
                    <Highlight>{t("neuralNetworkNarrative.limitations.p1Highlight")}</Highlight>{" "}
                    {t("neuralNetworkNarrative.limitations.p1End")}
                </P>

                <Callout icon={AlertTriangle} accent="amber" title="XOR Problem">
                    <p>{t("neuralNetworkNarrative.limitations.p2")}</p>
                </Callout>

                <P>{t("neuralNetworkNarrative.limitations.p3")}</P>

                <PullQuote>{t("neuralNetworkNarrative.limitations.quote")}</PullQuote>

                <P>{t("neuralNetworkNarrative.limitations.p4")}</P>
            </Section>

            {/* ───────────────── CODA ───────────────── */}
            <motion.footer
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-8 pt-12 border-t border-white/[0.06] text-center"
            >
                <p className="text-sm text-white/25 italic max-w-md mx-auto leading-relaxed mb-10">
                    {t("neuralNetworkNarrative.footer.text")}
                </p>
                <div className="flex items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-widest text-white/10">
                    <FlaskConical className="h-3 w-3" />
                    {t("neuralNetworkNarrative.footer.brand")}
                </div>
            </motion.footer>

            {/*
                ═══════════════════════════════════════════════════════════
                TODO: Future Interactive Enhancements
                ═══════════════════════════════════════════════════════════
                - Multi-layer network extension: add a hidden layer to the
                  perceptron diagram to show how depth adds expressivity.
                - Deeper micrograd-style computation graph: expand the
                  backprop visualizer with intermediate multiply/add nodes
                  for a full Karpathy-style trace.
                - Real-time training curves: plot loss over steps as a
                  smooth SVG line chart alongside the training demo.
                - Advanced N-gram comparison: extend the bigram comparison
                  to show how N-gram context matrices compare to multi-layer
                  neural approaches.
                - i18n for interactive component labels: translate all
                  button labels, headings, and captions in the viz components.
                ═══════════════════════════════════════════════════════════
            */}
        </article>
    );
}

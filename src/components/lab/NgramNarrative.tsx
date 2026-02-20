"use client";

import { motion } from "framer-motion";
import {
    BookOpen,
    FlaskConical,
    ArrowDown,
    Lightbulb,
    AlertTriangle,
    ArrowRight,
    Beaker,
    BrainCircuit,
} from "lucide-react";
import { ModeToggle } from "@/components/lab/ModeToggle";
import { useI18n } from "@/i18n/context";
import { useRouter } from "next/navigation";
import { useLabMode } from "@/context/LabModeContext";

import { NgramContextGrowthAnimation } from "@/components/lab/NgramPedagogyPanels";
import { NgramMiniTransitionTable } from "@/components/lab/NgramPedagogyPanels";
import { NgramComparison } from "@/components/lab/NgramPedagogyPanels";
import { NgramFiveGramScale } from "@/components/lab/NgramPedagogyPanels";

/* ─────────────────────────────────────────────
   Primitive building blocks (matches Bigram / NN narrative style)
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
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] font-mono font-bold text-amber-400">
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
    return <strong className="text-amber-400 font-semibold">{children}</strong>;
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
            className="relative my-8 rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-5 md:p-6 overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.06] to-transparent pointer-events-none" />
            <div className="relative flex gap-4">
                <div className="shrink-0 mt-0.5">
                    <Icon className="w-4.5 h-4.5 text-amber-400" />
                </div>
                <div className="min-w-0">
                    {title && (
                        <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-400 mb-2">
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

function PullQuote({ children }: { children: React.ReactNode }) {
    return (
        <motion.blockquote
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            className="my-10 md:my-12 pl-6 border-l-2 border-amber-400/40"
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
    children,
}: {
    label: string;
    hint?: string;
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
                    <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                        <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400/40" />
                    </div>
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
   Interactive context window visualizer
   ───────────────────────────────────────────── */

function ContextWindowVisualizer() {
    const tokens = ["I", " ", "w", "a", "n", "t", " ", "t", "o", " ", "e", "a", "t", " ", "p", "i", "z", "z", "a"];
    const display = "I want to eat pizza";

    const examples: { n: number; label: string; ctx: string }[] = [
        { n: 1, label: "Bigram", ctx: "a" },
        { n: 2, label: "Trigram", ctx: "za" },
        { n: 3, label: "3-gram", ctx: "zza" },
        { n: 4, label: "4-gram", ctx: "izza" },
        { n: 5, label: "5-gram", ctx: "pizza" },
    ];

    return (
        <div className="space-y-3">
            <div className="mb-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold mb-3">
                    Predicting the next character after:
                </p>
                <div className="font-mono text-lg text-white/70 bg-black/30 rounded-lg px-4 py-3 border border-white/[0.06]">
                    {display}
                    <span className="text-amber-400 animate-pulse">|</span>
                </div>
            </div>
            {examples.map(({ n, label, ctx }) => {
                const ctxStart = tokens.length - n;
                return (
                    <motion.div
                        key={n}
                        initial={{ opacity: 0, x: -12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: n * 0.08, duration: 0.4 }}
                        className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3"
                    >
                        <span className="shrink-0 w-16 text-[11px] font-mono font-bold text-amber-400/80">
                            N={n}
                        </span>
                        <span className="shrink-0 text-xs text-white/30 w-16">{label}</span>
                        <div className="flex-1 font-mono text-sm">
                            <span className="text-white/15">
                                {tokens.slice(0, ctxStart).join("")}
                            </span>
                            <span className="text-amber-300 font-bold bg-amber-500/10 px-1 rounded">
                                {ctx}
                            </span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-white/20 shrink-0" />
                        <span className="text-emerald-400 font-mono font-bold shrink-0">?</span>
                    </motion.div>
                );
            })}
        </div>
    );
}

/* ─────────────────────────────────────────────
   Vocabulary scale comparison
   ───────────────────────────────────────────── */

function VocabularyScaleVisual() {
    return (
        <div className="grid md:grid-cols-2 gap-6 my-10">
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                    <h3 className="text-lg font-bold text-white">Character-level</h3>
                </div>
                <div className="font-mono text-3xl font-bold text-amber-300 mb-2">~96</div>
                <p className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-3">tokens</p>
                <p className="text-white/50 text-sm leading-relaxed">
                    Small tables, but individual characters carry almost no semantic meaning. Easy to manage, hard to capture intent.
                </p>
                <div className="mt-4 h-2 rounded-full bg-white/[0.06] overflow-hidden">
                    <div className="h-full rounded-full bg-amber-500/50 w-[2%]" />
                </div>
                <p className="text-[10px] text-white/30 mt-1">Relative vocabulary size</p>
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <h3 className="text-lg font-bold text-white">Word-level</h3>
                </div>
                <div className="font-mono text-3xl font-bold text-red-300 mb-2">50,000+</div>
                <p className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-3">tokens</p>
                <p className="text-white/50 text-sm leading-relaxed">
                    Rich semantics per token, but even a bigram matrix needs 2.5 billion cells. Trigrams require trillions.
                </p>
                <div className="mt-4 h-2 rounded-full bg-white/[0.06] overflow-hidden">
                    <div className="h-full rounded-full bg-red-500/50 w-full" />
                </div>
                <p className="text-[10px] text-white/30 mt-1">Relative vocabulary size</p>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Metrics legend for comparison chart
   ───────────────────────────────────────────── */

function MetricsLegend() {
    const { t } = useI18n();
    const items = [
        { color: "bg-amber-400", label: t("ngramNarrative.complexity.metricsLegend.perplexity") },
        { color: "bg-emerald-400", label: t("ngramNarrative.complexity.metricsLegend.utilization") },
        { color: "bg-white/40", label: t("ngramNarrative.complexity.metricsLegend.contextSpace") },
    ];
    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="my-6 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-2"
        >
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 font-bold mb-2">Reading the chart</p>
            {items.map((item) => (
                <div key={item.color} className="flex items-start gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${item.color} shrink-0 mt-1`} />
                    <p className="text-xs text-white/45 leading-relaxed">{item.label}</p>
                </div>
            ))}
        </motion.div>
    );
}

/* ─────────────────────────────────────────────
   Main narrative component
   ───────────────────────────────────────────── */

interface NgramNarrativeProps {
    contextSize: number;
    vocabSize: number;
    comparisonMetrics: Record<number, {
        perplexity: number | null;
        contextUtilization: number | null;
        contextSpace: number | null;
    }>;
}

export function NgramNarrative({
    contextSize,
    vocabSize,
    comparisonMetrics,
}: NgramNarrativeProps) {
    const { t } = useI18n();
    const router = useRouter();
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
                    <span className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-amber-400/60 mb-6">
                        <BookOpen className="w-3.5 h-3.5" />
                        {t("ngramNarrative.hero.eyebrow")}
                    </span>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
                        {t("ngramNarrative.hero.titlePrefix")}{" "}
                        <span className="bg-gradient-to-r from-amber-400 to-orange-300 bg-clip-text text-transparent">
                            {t("ngramNarrative.hero.titleSuffix")}
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-white/35 max-w-xl mx-auto leading-relaxed mb-12">
                        {t("ngramNarrative.hero.description")}
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

            {/* ─────────── 1 · THE NEW IDEA: MORE CONTEXT ─────────── */}
            <Section>
                <SectionLabel number="01" label={t("ngramNarrative.moreContext.label")} />
                <Heading>{t("ngramNarrative.moreContext.title")}</Heading>

                <Lead>
                    {t("ngramNarrative.moreContext.lead")}
                </Lead>

                <P>
                    {t("ngramNarrative.moreContext.p1")}{" "}
                    <Highlight>{t("ngramNarrative.moreContext.p1Highlight")}</Highlight>{" "}
                    {t("ngramNarrative.moreContext.p1End")}
                </P>

                <P>{t("ngramNarrative.moreContext.p2")}</P>

                <P>{t("ngramNarrative.moreContext.p3")}</P>

                <Callout title={t("ngramNarrative.moreContext.calloutTitle")}>
                    <p>{t("ngramNarrative.moreContext.calloutText")}</p>
                </Callout>
            </Section>

            <SectionBreak />

            {/* ─────────── 2 · INTERACTIVE CONTEXT WINDOW VISUALIZER ─────────── */}
            <Section>
                <SectionLabel number="02" label={t("ngramNarrative.contextWindow.label")} />
                <Heading>{t("ngramNarrative.contextWindow.title")}</Heading>

                <Lead>
                    {t("ngramNarrative.contextWindow.lead")}
                </Lead>

                <FigureWrapper
                    label="Context window · Natural language example"
                    hint="How the context window looks on a real sentence. Each N value highlights a different amount of history."
                >
                    <ContextWindowVisualizer />
                </FigureWrapper>

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center text-sm text-amber-300/60 italic font-light my-6"
                >
                    {t("ngramNarrative.contextWindow.caption")}
                </motion.p>

                <FigureWrapper
                    label="Context growth · Character-level"
                    hint={t("ngramNarrative.contextWindow.hint")}
                >
                    <NgramContextGrowthAnimation />
                </FigureWrapper>

                <P>{t("ngramNarrative.contextWindow.p1")}</P>
            </Section>

            <SectionBreak />

            {/* ─────────── 3 · HOW N-GRAM WORKS INTERNALLY ─────────── */}
            <Section>
                <SectionLabel number="03" label={t("ngramNarrative.howItWorks.label")} />
                <Heading>{t("ngramNarrative.howItWorks.title")}</Heading>

                <Lead>
                    {t("ngramNarrative.howItWorks.lead")}
                </Lead>

                <P>
                    {t("ngramNarrative.howItWorks.p1")}{" "}
                    <Highlight>{t("ngramNarrative.howItWorks.p1Highlight")}</Highlight>
                    {t("ngramNarrative.howItWorks.p1End")}
                </P>

                <P>{t("ngramNarrative.howItWorks.p2")}</P>

                <FigureWrapper
                    label="Transition examples · Training corpus evidence"
                    hint="Expand any row to see real passages from the training data where this transition was observed."
                >
                    <NgramMiniTransitionTable n={contextSize} />
                </FigureWrapper>
            </Section>

            <SectionBreak />

            {/* ─────────── 4 · PURELY STATISTICAL MODEL ─────────── */}
            <Section>
                <SectionLabel number="04" label={t("ngramNarrative.statistical.label")} />
                <Heading>{t("ngramNarrative.statistical.title")}</Heading>

                <Lead>
                    {t("ngramNarrative.statistical.lead")}
                </Lead>

                <P>
                    {t("ngramNarrative.statistical.p1")}{" "}
                    <Highlight>{t("ngramNarrative.statistical.p1Highlight")}</Highlight>{" "}
                    {t("ngramNarrative.statistical.p1End")}
                </P>

                <P>{t("ngramNarrative.statistical.p2")}</P>

                <Callout icon={AlertTriangle} title={t("ngramNarrative.statistical.calloutTitle")}>
                    <p>{t("ngramNarrative.statistical.calloutText")}</p>
                </Callout>
            </Section>

            <SectionBreak />

            {/* ─────────── 5 · INCREASING CONTEXT VS EXPLODING COMPLEXITY ─────────── */}
            <Section>
                <SectionLabel number="05" label={t("ngramNarrative.complexity.label")} />
                <Heading>{t("ngramNarrative.complexity.title")}</Heading>

                <Lead>
                    {t("ngramNarrative.complexity.lead")}
                </Lead>

                <P>
                    {t("ngramNarrative.complexity.p1")}{" "}
                    <Highlight>{t("ngramNarrative.complexity.p1Highlight")}</Highlight>
                    {t("ngramNarrative.complexity.p1End")}
                </P>

                <P>{t("ngramNarrative.complexity.p2")}</P>

                <FigureWrapper
                    label={t("ngramNarrative.complexity.comparisonLabel")}
                    hint={t("ngramNarrative.complexity.comparisonHint")}
                >
                    <NgramComparison vocabSize={vocabSize} metricsByN={comparisonMetrics} />
                </FigureWrapper>

                <MetricsLegend />

                <div className="my-10">
                    <NgramFiveGramScale vocabSize={vocabSize} />
                </div>
            </Section>

            <SectionBreak />

            {/* ─────────── 6 · CHARACTERS VS WORDS: VOCABULARY EXPLOSION ─────────── */}
            <Section>
                <SectionLabel number="06" label={t("ngramNarrative.vocabulary.label")} />
                <Heading>{t("ngramNarrative.vocabulary.title")}</Heading>

                <Lead>
                    {t("ngramNarrative.vocabulary.lead")}
                </Lead>

                <P>
                    {t("ngramNarrative.vocabulary.p1")}{" "}
                    <Highlight>{t("ngramNarrative.vocabulary.p1Highlight")}</Highlight>
                    {t("ngramNarrative.vocabulary.p1End")}
                </P>

                <P>{t("ngramNarrative.vocabulary.p2")}</P>

                <VocabularyScaleVisual />
            </Section>

            <SectionBreak />

            {/* ─────────── 7 · LACK OF TRUE UNDERSTANDING ─────────── */}
            <Section>
                <SectionLabel number="07" label={t("ngramNarrative.noUnderstanding.label")} />
                <Heading>{t("ngramNarrative.noUnderstanding.title")}</Heading>

                <Lead>
                    {t("ngramNarrative.noUnderstanding.lead")}
                </Lead>

                <P>{t("ngramNarrative.noUnderstanding.p1")}</P>

                <P>
                    {t("ngramNarrative.noUnderstanding.p2")}{" "}
                    <Highlight>{t("ngramNarrative.noUnderstanding.p2Highlight")}</Highlight>{" "}
                    {t("ngramNarrative.noUnderstanding.p2End")}
                </P>

                <P>{t("ngramNarrative.noUnderstanding.p3")}</P>
            </Section>

            <SectionBreak />

            {/* ─────────── 8 · CONCLUSION ─────────── */}
            <Section>
                <SectionLabel number="08" label={t("ngramNarrative.conclusion.label")} />
                <Heading>{t("ngramNarrative.conclusion.title")}</Heading>

                <Lead>
                    {t("ngramNarrative.conclusion.lead")}
                </Lead>

                <P>{t("ngramNarrative.conclusion.p1")}</P>
                <P>{t("ngramNarrative.conclusion.p2")}</P>
                <P>{t("ngramNarrative.conclusion.p3")}</P>
                <P>{t("ngramNarrative.conclusion.p4")}</P>

                <PullQuote>
                    {t("ngramNarrative.conclusion.quote")}
                </PullQuote>
            </Section>

            <SectionBreak />

            {/* ─────────── 9 · CALL TO ACTION ─────────── */}
            <Section>
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-3">
                        {t("ngramNarrative.cta.title")}
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setMode("free")}
                        className="group relative rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-950/20 to-black/60 p-6 text-left transition-colors hover:border-amber-500/40 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        <div className="relative">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 rounded-xl bg-amber-500/15">
                                    <Beaker className="w-5 h-5 text-amber-300" />
                                </div>
                                <span className="text-lg font-bold text-white">
                                    {t("ngramNarrative.cta.labButton")}
                                </span>
                            </div>
                            <p className="text-sm text-white/45 leading-relaxed">
                                {t("ngramNarrative.cta.labDesc")}
                            </p>
                        </div>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => router.push("/lab/neural-networks")}
                        className="group relative rounded-2xl border border-rose-500/20 bg-gradient-to-br from-rose-950/20 to-black/60 p-6 text-left transition-colors hover:border-rose-500/40 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        <div className="relative">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 rounded-xl bg-rose-500/15">
                                    <BrainCircuit className="w-5 h-5 text-rose-300" />
                                </div>
                                <span className="text-lg font-bold text-white">
                                    {t("ngramNarrative.cta.neuralButton")}
                                </span>
                            </div>
                            <p className="text-sm text-white/45 leading-relaxed">
                                {t("ngramNarrative.cta.neuralDesc")}
                            </p>
                        </div>
                    </motion.button>
                </div>
            </Section>

            {/* ───────────────── FOOTER ───────────────── */}
            <motion.footer
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-8 pt-12 border-t border-white/[0.06] text-center"
            >
                <p className="text-sm text-white/25 italic max-w-md mx-auto leading-relaxed mb-10">
                    {t("ngramNarrative.footer.text")}
                </p>
                <div className="flex items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-widest text-white/10">
                    <FlaskConical className="h-3 w-3" />
                    {t("ngramNarrative.footer.brand")}
                </div>
            </motion.footer>
        </article>
    );
}

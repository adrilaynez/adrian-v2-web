"use client";

import { motion } from "framer-motion";
import { BookOpen, FlaskConical, ArrowDown, Lightbulb, AlertTriangle, ArrowRight, Beaker, BrainCircuit } from "lucide-react";
import { ModeToggle } from "@/components/lab/ModeToggle";
import { useRouter } from "next/navigation";
import { useLabMode } from "@/context/LabModeContext";

import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

import { MLPNonLinearityVisualizer } from "@/components/lab/mlp/MLPNonLinearityVisualizer";
import { PedagogicalEmbeddingVisualizer } from "@/components/lab/mlp/PedagogicalEmbeddingVisualizer";
import { MLPHyperparameterExplorer } from "@/components/lab/mlp/MLPHyperparameterExplorer";
import { InitializationSensitivityVisualizer } from "@/components/lab/mlp/InitializationSensitivityVisualizer";
import { GradientFlowVisualizer } from "@/components/lab/mlp/GradientFlowVisualizer";
import { BatchNormEffectVisualizer } from "@/components/lab/mlp/BatchNormEffectVisualizer";
import { ContextWindowVisualizer } from "@/components/lab/mlp/ContextWindowVisualizer";
import { ConcatenationBottleneckVisualizer } from "@/components/lab/mlp/ConcatenationBottleneckVisualizer";
import { PositionSensitivityVisualizer } from "@/components/lab/mlp/PositionSensitivityVisualizer";
import { LongRangeDependencyDemo } from "@/components/lab/mlp/LongRangeDependencyDemo";
import { LossIntuitionVisualizer } from "@/components/lab/mlp/LossIntuitionVisualizer";
import { MLPPipelineVisualizer } from "@/components/lab/mlp/MLPPipelineVisualizer";
import { SoftmaxTemperatureVisualizer } from "@/components/lab/mlp/SoftmaxTemperatureVisualizer";
import type { UseMLPGridReturn } from "@/hooks/useMLPGrid";

export interface MLPNarrativeProps {
    mlpGrid: UseMLPGridReturn;
}

/* ─────────────────────────────────────────────
   Primitive building blocks (matches NN / Ngram narrative style)
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
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-violet-500/10 border border-violet-500/20 text-[11px] font-mono font-bold text-violet-400">
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

function Highlight({ children, color = "violet" }: { children: React.ReactNode; color?: "violet" | "amber" | "indigo" | "emerald" | "rose" }) {
    const colors = {
        violet: "text-violet-400",
        amber: "text-amber-400",
        indigo: "text-indigo-400",
        emerald: "text-emerald-400",
        rose: "text-rose-400",
    };
    return <strong className={`${colors[color]} font-semibold`}>{children}</strong>;
}

function Callout({
    icon: Icon = Lightbulb,
    accent = "violet",
    title,
    children,
}: {
    icon?: React.ComponentType<{ className?: string }>;
    accent?: "violet" | "amber" | "indigo" | "emerald" | "rose";
    title?: string;
    children: React.ReactNode;
}) {
    const accentMap = {
        violet: {
            border: "border-violet-500/20",
            bg: "bg-violet-500/[0.04]",
            icon: "text-violet-400",
            title: "text-violet-400",
            glow: "from-violet-500/[0.06]",
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
        rose: {
            border: "border-rose-500/20",
            bg: "bg-rose-500/[0.04]",
            icon: "text-rose-400",
            title: "text-rose-400",
            glow: "from-rose-500/[0.06]",
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
                <div className="inline-block px-8 py-4 rounded-2xl bg-violet-500/[0.04] border border-violet-500/[0.15] backdrop-blur-sm shadow-[0_0_40px_-15px_rgba(139,92,246,0.15)]">
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
            className="my-10 md:my-12 pl-6 border-l-2 border-violet-500/30"
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
                        <span className="w-2.5 h-2.5 rounded-full bg-violet-400/40" />
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
   Inline visual: One-hot vs Embedding comparison
   ───────────────────────────────────────────── */

function OneHotVsEmbeddingVisual() {
    const vocab = ["the", "cat", "sat", "on", "mat"];

    return (
        <div className="grid md:grid-cols-2 gap-6 my-10">
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 rounded-full bg-rose-400" />
                    <h3 className="text-lg font-bold text-white">One-Hot Encoding</h3>
                </div>
                <div className="space-y-2 mb-4">
                    {vocab.map((word, i) => (
                        <div key={word} className="flex items-center gap-3">
                            <span className="text-xs font-mono text-violet-300 w-10">{word}</span>
                            <div className="flex gap-0.5">
                                {vocab.map((_, j) => (
                                    <span
                                        key={j}
                                        className={`w-6 h-6 rounded text-[10px] font-mono flex items-center justify-center ${i === j
                                            ? "bg-rose-500/30 text-rose-300 border border-rose-500/40"
                                            : "bg-white/[0.03] text-white/20 border border-white/[0.06]"
                                            }`}
                                    >
                                        {i === j ? "1" : "0"}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <p className="text-xs text-white/40 leading-relaxed">
                    Sparse, high-dimensional. Every token is equally distant from every other.
                    No notion of similarity.
                </p>
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <h3 className="text-lg font-bold text-white">Learned Embeddings</h3>
                </div>
                <div className="space-y-2 mb-4">
                    {[
                        { word: "the", vals: [0.12, -0.45, 0.78] },
                        { word: "cat", vals: [0.91, 0.34, -0.22] },
                        { word: "sat", vals: [0.67, 0.12, 0.55] },
                        { word: "on", vals: [-0.08, -0.61, 0.33] },
                        { word: "mat", vals: [0.85, 0.29, -0.18] },
                    ].map(({ word, vals }) => (
                        <div key={word} className="flex items-center gap-3">
                            <span className="text-xs font-mono text-violet-300 w-10">{word}</span>
                            <div className="flex gap-0.5">
                                {vals.map((v, j) => (
                                    <span
                                        key={j}
                                        className="w-12 h-6 rounded text-[10px] font-mono flex items-center justify-center bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                                    >
                                        {v.toFixed(2)}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <p className="text-xs text-white/40 leading-relaxed">
                    Dense, low-dimensional. Similar words (&quot;cat&quot; and &quot;mat&quot;) get
                    similar vectors — the model can generalize.
                </p>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Inline visual: MLP architecture diagram (static)
   ───────────────────────────────────────────── */

function MLPArchitectureDiagram() {
    const layers = [
        { label: "Input", desc: "Context tokens (one-hot or embeddings)", nodes: 5, color: "violet" },
        { label: "Hidden 1", desc: "Learned features", nodes: 4, color: "indigo" },
        { label: "Hidden 2", desc: "Higher-order patterns", nodes: 4, color: "blue" },
        { label: "Output", desc: "Next-token probabilities", nodes: 3, color: "emerald" },
    ];

    const colorMap: Record<string, { dot: string; label: string; border: string }> = {
        violet: { dot: "bg-violet-400", label: "text-violet-400", border: "border-violet-500/30" },
        indigo: { dot: "bg-indigo-400", label: "text-indigo-400", border: "border-indigo-500/30" },
        blue: { dot: "bg-blue-400", label: "text-blue-400", border: "border-blue-500/30" },
        emerald: { dot: "bg-emerald-400", label: "text-emerald-400", border: "border-emerald-500/30" },
    };

    return (
        <div className="flex items-stretch justify-center gap-4 md:gap-8 py-6 overflow-x-auto">
            {layers.map((layer, li) => {
                const c = colorMap[layer.color];
                return (
                    <div key={layer.label} className="flex items-center gap-4 md:gap-8">
                        <div className="flex flex-col items-center gap-2">
                            <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${c.label}`}>
                                {layer.label}
                            </span>
                            <div className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border ${c.border} bg-white/[0.02]`}>
                                {Array.from({ length: layer.nodes }).map((_, i) => (
                                    <div key={i} className={`w-4 h-4 rounded-full ${c.dot} opacity-70`} />
                                ))}
                            </div>
                            <span className="text-[9px] text-white/25 text-center max-w-[80px]">
                                {layer.desc}
                            </span>
                        </div>
                        {li < layers.length - 1 && (
                            <ArrowRight className="w-4 h-4 text-white/15 shrink-0" />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

/* ─────────────────────────────────────────────
   Main narrative component
   ───────────────────────────────────────────── */

export function MLPNarrative({ mlpGrid }: MLPNarrativeProps) {
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
                    <span className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-violet-400/60 mb-6">
                        <BookOpen className="w-3.5 h-3.5" />
                        Educational Narrative
                    </span>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
                        Beyond Tables:{" "}
                        <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-violet-400 bg-clip-text text-transparent">
                            MLP + Embeddings
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-white/35 max-w-xl mx-auto leading-relaxed mb-12">
                        How multi-layer perceptrons and learned vector representations transformed
                        language modeling — from counting co-occurrences to learning distributed
                        representations of meaning.
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

            {/* ─────────── 00 · BRIDGE FROM N-GRAMS ─────────── */}
            <Section>
                <SectionLabel number="00" label="Starting Point" />
                <Heading>Why N-grams Weren&apos;t Enough</Heading>

                <Lead>
                    We already know N-grams can count. After working through bigrams and trigrams,
                    one question naturally follows: what can&apos;t they do?
                </Lead>

                <P>
                    N-gram models store a table of counts — how often each sequence of N characters
                    appeared in training data. This works, but it has hard limits. If a 3-character
                    sequence never appeared in training, the model assigns it{" "}
                    <Highlight color="rose">zero probability</Highlight>, even if it&apos;s
                    completely reasonable. The table also grows exponentially: a vocabulary of 70
                    characters gives 70³ = 343,000 possible trigrams, and most are never observed.
                    Larger N means exponentially more empty cells.
                </P>

                <P>
                    Worse, N-grams have{" "}
                    <Highlight color="rose">no notion of similarity</Highlight>. The model treats
                    every character as an isolated symbol. It has no way to know that &quot;a&quot;
                    and &quot;e&quot; are both vowels, or that patterns learned for one context
                    might transfer to a slightly different one. Every context is learned from
                    scratch, in isolation.
                </P>

                <Callout accent="violet" title="The core insight">
                    <p>
                        A table can only memorize. What we need is a <em>function</em> — something
                        that can generalize from patterns it has seen to patterns it hasn&apos;t.
                        A function can learn that vowels behave similarly, that certain character
                        sequences share structure, and that unseen combinations aren&apos;t random.
                        That function is a neural network.
                    </p>
                </Callout>
            </Section>

            <SectionBreak />

            {/* ─────────── 01 · WHAT IS AN MLP? ─────────── */}
            <Section>
                <SectionLabel number="01" label="Foundations" />
                <Heading>What Is a Multi-Layer Perceptron?</Heading>

                <Lead>
                    Before talking about layers and architectures, start with the smallest unit:
                    a single artificial neuron. One neuron, one decision. Stack enough of them
                    and you can approximate almost any pattern in data.
                </Lead>

                <P>
                    A neuron takes a list of numbers as input, multiplies each by a{" "}
                    <Highlight>weight</Highlight> — a dial that says how important that input is —
                    sums everything up, and passes the result through an{" "}
                    <Highlight>activation function</Highlight> that introduces a curve. Think of it
                    as a tiny decision: &quot;given these inputs and these weights, how strongly
                    should I fire?&quot; That&apos;s it. One neuron is unimpressive on its own.
                    But the idea scales.
                </P>

                <Callout accent="violet" title="What is a weight?">
                    <p>
                        A weight is a trainable number — a dial the network adjusts during learning.
                        A large positive weight means &quot;pay close attention to this input.&quot;
                        A weight near zero means &quot;mostly ignore it.&quot; Training is the
                        process of finding the right dial settings by repeatedly checking how wrong
                        a prediction was and nudging every weight slightly in the direction that
                        reduces the mistake. This is called <em>gradient descent</em>.
                    </p>
                </Callout>

                <P>
                    Arrange many neurons side by side, all reading the same input, and you get a{" "}
                    <Highlight>layer</Highlight>. Each neuron in that layer learns a different
                    pattern. Stack two or more layers and the second layer reads the first
                    layer&apos;s detections, not the raw input — it learns patterns of patterns.
                    This stack is a <Highlight>Multi-Layer Perceptron (MLP)</Highlight>.
                </P>

                <FigureWrapper
                    label="MLP Architecture · Schematic"
                    hint="A feedforward network with input, hidden, and output layers connected by learned weight matrices."
                >
                    <MLPArchitectureDiagram />
                </FigureWrapper>

                <P>
                    Without the activation function between layers, stacking would be pointless —
                    multiple linear transformations collapse into a single one. The non-linearity
                    (Tanh, ReLU) is what makes depth meaningful. Each layer can bend and warp the
                    representation in ways a single flat mapping never could. This is why deep
                    networks can learn hierarchical features: strokes → letters → words → meaning.
                </P>

                <FormulaBlock
                    formula="h = \sigma(W_1 x + b_1), \quad \hat{y} = \text{softmax}(W_2 h + b_2)"
                    caption="Every symbol here is just the 'weighted sum + squish' described above. σ is the activation function, W₁ and W₂ are weight matrices the network learns, and softmax converts the final numbers into probabilities that sum to 1."
                />

                <Callout title="Why depth matters">
                    <p>
                        A single hidden layer can theoretically approximate any function, but in practice
                        deeper networks learn hierarchical representations more efficiently — fewer parameters,
                        better generalization. Each layer can build on abstractions learned by the previous one.
                    </p>
                </Callout>

                <FigureWrapper
                    label="Interactive · Non-Linearity & Decision Boundaries"
                    hint="Toggle between linear, shallow, and deep models to see how non-linear layers enable complex boundaries."
                >
                    <MLPNonLinearityVisualizer />
                </FigureWrapper>
            </Section>

            <SectionBreak />

            {/* ─────────── 02 · MLP APPLIED TO LANGUAGE ─────────── */}
            <Section>
                <SectionLabel number="02" label="Language Modeling" />
                <Heading>MLP Applied to Language (Without Embeddings)</Heading>

                <Lead>
                    The simplest way to use an MLP for language: take the previous N tokens,
                    convert each to a number vector, concatenate them, and feed the result into
                    the network to predict the next token.
                </Lead>

                <P>
                    To feed characters into a neural network, we first need to turn them into
                    numbers. The most straightforward method is a{" "}
                    <Highlight>one-hot vector</Highlight>: a list of zeros the length of the
                    vocabulary, with a single 1 in the slot for that character. For a vocabulary
                    of 70 characters, &quot;a&quot; becomes [1, 0, 0, …, 0], &quot;b&quot; becomes
                    [0, 1, 0, …, 0], and so on. With a context window of size N, we concatenate
                    N such vectors to form an input of dimension{" "}
                    <Highlight>N × V</Highlight>, then pass it through one or more hidden layers
                    to produce a probability distribution over the next token.
                </P>

                <FormulaBlock
                    formula="x = [\text{onehot}(t_{i-N}); \ldots; \text{onehot}(t_{i-1})] \in \mathbb{R}^{N \cdot V}"
                    caption="The input to the MLP is a concatenation of N one-hot vectors, one per context token."
                />

                <Callout icon={AlertTriangle} accent="amber" title="What does loss actually mean?">
                    <p>
                        Loss is a measure of surprise. After each prediction, the model compares
                        what it said — a probability for every possible next character — with what
                        actually came next.
                    </p>
                    <p>
                        If the model gave the correct character a probability of 0.9, it was
                        confident and right. Low surprise. Low loss.
                    </p>
                    <p>
                        If it gave the correct character a probability of 0.02, it was nearly
                        certain something else would appear. Big surprise. High loss.
                    </p>
                    <p>
                        Training is the process of reducing this average surprise — over millions
                        of characters — until the model&apos;s predictions stop being shocking.
                    </p>
                </Callout>

                <FigureWrapper
                    label="Interactive · Loss Intuition"
                    hint="Drag the slider to set how confident the model is in the correct token. See how cross-entropy loss explodes as confidence approaches zero."
                >
                    <LossIntuitionVisualizer />
                </FigureWrapper>

                <P>
                    This already represents a major step forward from N-gram tables. Instead of
                    memorizing exact co-occurrence counts, the model{" "}
                    <Highlight color="emerald">learns a function</Highlight> that maps context
                    patterns to predictions. It can interpolate between seen patterns and generalize
                    to novel combinations — at least in principle.
                </P>

                <P>
                    The MLP can discover that certain character sequences behave similarly, even
                    if it has never seen the exact N-gram before. This is because the hidden layers
                    learn internal features that compress and abstract the raw input patterns.
                </P>

                <Callout icon={Lightbulb} accent="emerald" title="Key improvement over N-grams">
                    <p>
                        N-gram models assign zero probability to any context they never observed in
                        training. An MLP, by contrast, can assign non-zero probability to unseen
                        contexts because it learns a smooth function — not a lookup table.
                    </p>
                </Callout>

                <FigureWrapper
                    label="Interactive · MLP Forward Pass"
                    hint="Type a short seed and step through each stage of the forward pass — from raw tokens to final probability distribution."
                >
                    <MLPPipelineVisualizer selectedConfig={mlpGrid.selectedConfig} />
                </FigureWrapper>
            </Section>

            <SectionBreak />

            {/* ─────────── 03 · SCALABILITY PROBLEMS ─────────── */}
            <Section>
                <SectionLabel number="03" label="Scalability Wall" />
                <Heading>The Problem With One-Hot Inputs</Heading>

                <Lead>
                    One-hot encoding seems natural, but it creates severe scalability problems
                    that become catastrophic as vocabularies grow.
                </Lead>

                <P>
                    <Highlight color="rose">Input dimensionality explosion.</Highlight>{" "}
                    With a character-level vocabulary of ~96 tokens and a context of 8 characters,
                    the input vector has 768 dimensions — manageable. But with a word-level vocabulary
                    of 50,000 tokens and a context of 5 words, the input jumps to 250,000 dimensions.
                    The first weight matrix alone would have tens of billions of parameters.
                </P>

                <P>
                    <Highlight color="rose">Massive first-layer weight matrices.</Highlight>{" "}
                    The matrix W₁ connecting the input to the first hidden layer has shape
                    (N·V) × H, where H is the hidden size. For large vocabularies, this single
                    matrix dominates the entire parameter budget, making training slow and
                    memory-prohibitive.
                </P>

                <P>
                    <Highlight color="rose">No notion of similarity.</Highlight>{" "}
                    In one-hot space, every token is equidistant from every other token. The vectors
                    for &quot;cat&quot; and &quot;kitten&quot; are just as far apart as &quot;cat&quot;
                    and &quot;quantum&quot;. The model must learn every relationship from scratch,
                    with no structural prior that semantically related tokens should behave similarly.
                </P>

                <FormulaBlock
                    formula="\|\text{onehot}(\text{cat}) - \text{onehot}(\text{kitten})\|_2 = \sqrt{2} = \|\text{onehot}(\text{cat}) - \text{onehot}(\text{quantum})\|_2"
                    caption="All one-hot vectors are equidistant — the model gets zero information about semantic similarity from the encoding itself."
                />

                <Callout icon={AlertTriangle} accent="rose" title="The scalability wall">
                    <p>
                        These three problems — dimensional explosion, huge weight matrices, and
                        orthogonal representations — together form a scalability wall. The naive
                        one-hot MLP simply cannot scale to real-world vocabularies. We need a
                        fundamentally better way to represent tokens.
                    </p>
                </Callout>
            </Section>

            <SectionBreak />

            {/* ─────────── 04 · WORD EMBEDDINGS ─────────── */}
            <Section>
                <SectionLabel number="04" label="The Breakthrough" />
                <Heading>The Game Changer: Word Embeddings</Heading>

                <Lead>
                    Instead of representing each token as a sparse one-hot vector, we learn a
                    dense, low-dimensional vector for every token in the vocabulary. These are
                    called embeddings.
                </Lead>

                <P>
                    An embedding is a lookup table — a matrix E of shape V × D, where V is the
                    vocabulary size and D is the embedding dimension (typically 10–300). To get the
                    representation of token t, we simply select the t-th row of E. This is
                    equivalent to multiplying E by the one-hot vector, but much more efficient.
                </P>

                <FormulaBlock
                    formula="e_t = E[t] = E^\top \cdot \text{onehot}(t) \in \mathbb{R}^D"
                    caption="An embedding lookup: selecting row t from the embedding matrix E gives a dense D-dimensional vector."
                />

                <P>
                    The key insight is that{" "}
                    <Highlight color="emerald">each dimension of the embedding captures a latent semantic property</Highlight>.
                    These dimensions are not hand-designed — they emerge automatically from
                    training. One dimension might encode something like &quot;animate vs. inanimate,&quot;
                    another might capture &quot;verb tense,&quot; and others might encode more abstract
                    patterns that humans cannot easily name.
                </P>

                <OneHotVsEmbeddingVisual />

                <P>
                    Because embeddings are dense and continuous, similar tokens naturally cluster
                    together in embedding space. The model can leverage this structure to{" "}
                    <Highlight>generalize across semantically related tokens</Highlight>. If the
                    model has learned something about &quot;cat,&quot; it can partially transfer
                    that knowledge to &quot;kitten&quot; because their embedding vectors are close.
                </P>

                <P>
                    This dramatically reduces the effective input dimensionality. Instead of
                    N × V (potentially hundreds of thousands), the MLP now receives N × D
                    (perhaps a few hundred) — orders of magnitude smaller, with richer information.
                </P>

                <PullQuote>
                    Embeddings transform tokens from isolated symbols into points in a continuous
                    semantic space, where proximity encodes meaning. This single idea unlocked a
                    new era of language modeling.
                </PullQuote>

                <FigureWrapper
                    label="Illustrative · Embedding Space (Simplified)"
                    hint="This is a pedagogical illustration — not real model data. Click tokens to explore how similar characters cluster together."
                >
                    <PedagogicalEmbeddingVisualizer />
                </FigureWrapper>
            </Section>

            <SectionBreak />

            {/* ─────────── 05 · LIMITATIONS OF MLP + EMBEDDINGS ─────────── */}
            <Section>
                <SectionLabel number="05" label="Structural Limits" />
                <Heading>New Limitations of MLP + Embeddings</Heading>

                <Lead>
                    Embeddings solve the representation problem, but the MLP architecture itself
                    introduces structural limitations that no amount of tuning can overcome.
                </Lead>

                {/* ── Limitation 1: Fixed context window ── */}
                <P>
                    <Highlight color="amber">Fixed-size context window.</Highlight>{" "}
                    An MLP must receive a fixed number of input tokens. It cannot dynamically attend
                    to longer or shorter contexts — every prediction uses exactly N previous tokens,
                    no more, no less. Information outside this window is completely invisible to the
                    model. This is not a training failure — it is a hard architectural constraint.
                </P>

                <P>
                    The consequence is stark for language: pronouns, references, and topic
                    continuity all depend on context that may be many tokens back. Drag the slider
                    below to see how a window of 3 tokens blinds the model to who &quot;she&quot;
                    is — even though the answer is right there in the sentence.
                </P>

                <FigureWrapper
                    label="Interactive · Context Window Blindness"
                    hint="Drag the slider to grow the context window. Watch when 'Mary' (the referent) comes into view — and notice how small the window must be to hide it entirely."
                >
                    <ContextWindowVisualizer />
                </FigureWrapper>

                {/* ── Limitation 2: Long-range dependencies ── */}
                <P>
                    <Highlight color="amber">Long-range dependencies are out of reach.</Highlight>{" "}
                    The problem compounds over longer texts. In real language, a pronoun may
                    refer to a noun introduced dozens of tokens earlier. No practically-sized
                    fixed window can reliably bridge these gaps — and even when it can, the signal
                    is buried in N−1 other tokens competing for the network&apos;s attention.
                </P>

                <FigureWrapper
                    label="Demo · Long-Range Dependency Failure"
                    hint="A 19-word sentence where the pronoun 'she' refers to 'scientist' 15 tokens back. Compare how the MLP's prediction changes as the window grows, versus a model with full context."
                >
                    <LongRangeDependencyDemo />
                </FigureWrapper>

                {/* ── Limitation 3: Position-dependent meaning ── */}
                <P>
                    <Highlight color="amber">Position-dependent token meaning.</Highlight>{" "}
                    Because the MLP concatenates embeddings end to end, the same token at
                    position 1 and position 3 occupies different slices of the input vector —
                    and therefore activates different columns of W₁. The model learns entirely
                    separate weights for &quot;the at position 1&quot; versus &quot;the at position
                    3.&quot; There is no shared, position-invariant representation of what a token
                    means.
                </P>

                <FigureWrapper
                    label="Interactive · Position Sensitivity"
                    hint="Toggle 'the' between position 1 and position 3. The highlighted columns in W₁ show which parameters each instance activates — completely different sets."
                >
                    <PositionSensitivityVisualizer />
                </FigureWrapper>

                {/* ── Limitation 4: Concatenation bottleneck ── */}
                <P>
                    <Highlight color="amber">Parameter explosion and signal dilution.</Highlight>{" "}
                    Even with embeddings, the first weight matrix W₁ has shape (N · D) × H.
                    Doubling the context window doubles the size of this layer. For long contexts
                    this becomes the dominant cost. At the same time, as N grows each token&apos;s
                    embedding shrinks to a smaller fraction of the total input — from 100% at N=1
                    to just 6% at N=16 — diluting every signal without adding any mechanism to
                    focus on the most informative tokens.
                </P>

                <FigureWrapper
                    label="Interactive · Concatenation Bottleneck"
                    hint="Switch between Parameter Growth and Signal Dilution views. Drag the context size slider and watch W₁ expand — and each token's share of the input shrink."
                >
                    <ConcatenationBottleneckVisualizer />
                </FigureWrapper>

                <Callout icon={AlertTriangle} accent="amber" title="The same root cause">
                    <p>
                        All four limitations share a common origin: the MLP treats its entire
                        context as a single flat vector. It has no mechanism to reason about
                        the structure, ordering, or relative importance of individual tokens.
                        Overcoming this requires architectures that process sequences{" "}
                        <em>as sequences</em> — not as concatenated blobs. That architecture
                        is the Transformer.
                    </p>
                </Callout>
            </Section>

            <SectionBreak />

            {/* ─────────── 06 · EXPLORING CONFIGURATIONS ─────────── */}
            <Section>
                <SectionLabel number="06" label="Empirical Exploration" />
                <Heading>Exploring MLP + Embedding Configurations</Heading>

                <Lead>
                    With embeddings in place, the MLP language model has several key hyperparameters
                    that control its capacity, efficiency, and behavior. Understanding their impact
                    requires systematic experimentation.
                </Lead>

                <P>
                    The core architectural choices include the{" "}
                    <Highlight>embedding dimension</Highlight> (how many latent features per token),
                    the <Highlight>hidden layer size</Highlight> (how many neurons in each hidden layer),
                    the <Highlight>number of hidden layers</Highlight> (depth of the network), and the
                    context window size (how many previous tokens the model sees).
                </P>

                <P>
                    To understand how these choices affect model behavior, we trained many MLP language
                    models with different hyperparameter configurations on the same dataset. This
                    systematic sweep reveals key trade-offs: larger embeddings capture richer
                    semantics but risk overfitting on small data, wider hidden layers increase
                    capacity but slow training, and deeper networks can learn more abstract features
                    but are harder to optimize.
                </P>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3 my-8"
                >
                    {[
                        { title: "Embedding Dimension", desc: "Controls the richness of token representations. Larger values capture more semantic nuance but require more data to train effectively." },
                        { title: "Hidden Layer Size", desc: "Determines the model's computational width. Wider layers can detect more patterns per layer but increase memory and compute." },
                        { title: "Number of Layers", desc: "Controls representational depth. Deeper models can compose features hierarchically but face training stability challenges." },
                        { title: "Context Window", desc: "How many previous tokens the model considers. Larger windows give more information but increase input dimensionality linearly." },
                    ].map(({ title, desc }) => (
                        <div key={title} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
                            <p className="text-xs font-mono font-bold text-violet-400/70 mb-1.5">{title}</p>
                            <p className="text-sm text-white/40 leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </motion.div>

                <FigureWrapper
                    label="Interactive · Softmax Temperature"
                    hint="Adjust temperature to see how it sharpens or flattens the probability distribution over next tokens. Low temperature = deterministic; high = creative."
                >
                    <SoftmaxTemperatureVisualizer />
                </FigureWrapper>

                <Callout title="Why systematic exploration matters">
                    <p>
                        There is no single &quot;best&quot; configuration — the optimal hyperparameters
                        depend on the dataset size, vocabulary, and the computational budget. The only
                        way to develop intuition is to explore the space empirically and observe how
                        each choice affects loss, perplexity, and generation quality.
                    </p>
                </Callout>

                <FigureWrapper
                    label="Interactive · Hyperparameter Explorer"
                    hint="Adjust sliders to explore how embedding dimension, hidden size, and learning rate affect validation loss, compute cost, training dynamics, and learned embeddings."
                >
                    <MLPHyperparameterExplorer
                        configs={mlpGrid.configs}
                        selectedConfig={mlpGrid.selectedConfig}
                        onSelectClosest={mlpGrid.selectClosest}
                        timeline={mlpGrid.timeline}
                        timelineLoading={mlpGrid.timelineLoading}
                        onFetchTimeline={mlpGrid.fetchTimelineData}
                        generation={mlpGrid.generation}
                        generationLoading={mlpGrid.generationLoading}
                        onGenerate={mlpGrid.generateText}
                        gridLoading={mlpGrid.gridLoading}
                        gridError={mlpGrid.gridError}
                    />
                </FigureWrapper>

                <P>
                    The interactive explorer above lets you compare models across these
                    dimensions, visualizing validation loss, perplexity, training stability,
                    compute cost, generated text quality, and the learned embedding space.
                    Anomaly badges flag concerning patterns like overfitting or unstable
                    gradients. This empirical approach is how practitioners develop real
                    intuition about model design.
                </P>
            </Section>

            <SectionBreak />

            {/* ─────────── 07 · TRAINING CHALLENGES ─────────── */}
            <Section>
                <SectionLabel number="07" label="Training Stability" />
                <Heading>Deep Training Challenges for Large MLPs</Heading>

                <Lead>
                    Making deep MLPs actually train well was one of the hardest practical problems
                    in the history of neural networks. Without careful techniques, deep networks
                    simply fail to learn.
                </Lead>

                <P>
                    <Highlight color="rose">Weight initialization.</Highlight>{" "}
                    If weights are initialized too large, activations explode through the layers.
                    Too small, and gradients vanish before reaching the early layers. Proper
                    initialization schemes (like Xavier or Kaiming) set the initial scale based on
                    layer dimensions to maintain stable signal propagation.
                </P>

                <FormulaBlock
                    formula="W_{ij} \sim \mathcal{N}\!\left(0,\; \frac{2}{n_{\text{in}}}\right)"
                    caption="Kaiming initialization: weights are drawn from a Gaussian scaled by the fan-in, keeping variance stable through ReLU layers."
                />

                <FigureWrapper
                    label="Interactive · Initialization Sensitivity"
                    hint="Compare loss curves under different initialization scales. Well-scaled initialization is critical for convergence."
                >
                    <InitializationSensitivityVisualizer timeline={mlpGrid.timeline} />
                </FigureWrapper>

                <P>
                    <Highlight color="rose">Vanishing and exploding gradients.</Highlight>{" "}
                    During backpropagation, gradients are multiplied through each layer. In a deep
                    network, if these multipliers are consistently less than 1, gradients shrink
                    exponentially (vanishing). If greater than 1, they grow exponentially (exploding).
                    Either way, the network fails to learn effectively.
                </P>

                <FormulaBlock
                    formula="\frac{\partial \mathcal{L}}{\partial W_1} = \frac{\partial \mathcal{L}}{\partial h_L} \cdot \prod_{l=2}^{L} \frac{\partial h_l}{\partial h_{l-1}} \cdot \frac{\partial h_1}{\partial W_1}"
                    caption="The chain rule through L layers: gradients are products of per-layer Jacobians. If each factor is slightly < 1 or > 1, the product vanishes or explodes."
                />

                <FigureWrapper
                    label="Interactive · Gradient Flow Across Layers"
                    hint="Toggle between vanishing, stable, and exploding gradient regimes to see how gradient magnitude changes per layer."
                >
                    <GradientFlowVisualizer timeline={mlpGrid.timeline} />
                </FigureWrapper>

                <P>
                    For many years, training networks deeper than 2–3 layers was extremely unreliable.
                    Researchers discovered that the combination of activation function choice (ReLU
                    replaced Sigmoid/Tanh for hidden layers), proper initialization, and
                    normalization techniques was essential for stable training.
                </P>

                <P>
                    <Highlight color="indigo">Batch Normalization</Highlight>{" "}
                    was a key breakthrough. By normalizing the activations within each layer to
                    have zero mean and unit variance (across a mini-batch), it keeps the internal
                    distributions stable as the network trains. This dramatically reduces the
                    sensitivity to initialization and learning rate, enabling reliable training of
                    much deeper networks.
                </P>

                <FormulaBlock
                    formula="\hat{h} = \frac{h - \mu_B}{\sqrt{\sigma_B^2 + \epsilon}}, \quad y = \gamma \hat{h} + \beta"
                    caption="Batch Normalization: normalize activations h using batch statistics (μ_B, σ²_B), then rescale with learned parameters γ and β."
                />

                <Callout icon={Lightbulb} accent="indigo" title="Why BatchNorm changed everything">
                    <p>
                        Before BatchNorm, training deep networks required meticulous hyperparameter
                        tuning. After it, practitioners could reliably train 10, 20, or even 100+
                        layer networks. It acts as a stabilizer that smooths the loss landscape,
                        allowing gradient descent to converge faster and more reliably.
                    </p>
                </Callout>

                <FigureWrapper
                    label="Interactive · Batch Normalization Effect"
                    hint="Toggle BatchNorm on and off to see how it stabilizes activation distributions across layers."
                >
                    <BatchNormEffectVisualizer />
                </FigureWrapper>
            </Section>

            <SectionBreak />

            {/* ─────────── 08 · HISTORICAL TRANSITION ─────────── */}
            <Section>
                <SectionLabel number="08" label="Looking Forward" />
                <Heading>Final Limitations and the Path Ahead</Heading>

                <Lead>
                    Even with embeddings, deep architectures, and modern training techniques, the
                    MLP fundamentally operates on fixed-size windows — and this ceiling defines
                    its era in the history of language modeling.
                </Lead>

                <P>
                    The MLP processes each context window independently. It has no memory of what
                    came before the window, no mechanism to dynamically attend to distant tokens,
                    and no way to handle variable-length sequences without padding or truncation.
                    Every prediction is made from the same fixed-size snapshot.
                </P>

                <P>
                    This means MLPs cannot model long-range dependencies — the kind of structure
                    that makes natural language coherent across sentences and paragraphs. A pronoun
                    referring to a noun 50 tokens ago is simply out of reach for an MLP with a
                    context of 8.
                </P>

                <P>
                    These structural limitations motivated a series of architectural innovations that
                    define the modern trajectory of language modeling:{" "}
                    <Highlight color="emerald">Recurrent Neural Networks (RNNs)</Highlight>{" "}
                    introduced sequential memory, processing one token at a time while maintaining
                    a hidden state.{" "}
                    <Highlight color="amber">Convolutional architectures (like WaveNet)</Highlight>{" "}
                    applied dilated convolutions to capture hierarchical patterns over sequences.
                    And ultimately,{" "}
                    <Highlight color="rose">Transformers</Highlight>{" "}
                    introduced self-attention — a mechanism that allows every token to directly
                    attend to every other token, regardless of distance.
                </P>

                <PullQuote>
                    The MLP was the first architecture to show that neural networks could learn
                    language — but its fixed window revealed that learning language requires
                    architectures that understand sequences, not just snapshots.
                </PullQuote>

                <P>
                    Despite these limitations, the MLP + Embeddings framework established concepts
                    that remain foundational in every modern language model: learned token
                    representations, non-linear feature hierarchies, and end-to-end gradient-based
                    training. Every Transformer still uses embedding layers and feedforward MLP
                    blocks — the ideas introduced here never went away; they evolved.
                </P>
            </Section>

            <SectionBreak />

            {/* ─────────── CALL TO ACTION ─────────── */}
            <Section>
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-3">
                        Continue Exploring
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setMode("free")}
                        className="group relative rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-950/20 to-black/60 p-6 text-left transition-colors hover:border-violet-500/40 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        <div className="relative">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 rounded-xl bg-violet-500/15">
                                    <Beaker className="w-5 h-5 text-violet-300" />
                                </div>
                                <span className="text-lg font-bold text-white">
                                    Open Free Lab
                                </span>
                            </div>
                            <p className="text-sm text-white/45 leading-relaxed">
                                Experiment with MLP + Embedding models interactively. Train, visualize
                                embeddings, and generate text with different hyperparameters.
                            </p>
                        </div>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => router.push("/lab/transformer")}
                        className="group relative rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/20 to-black/60 p-6 text-left transition-colors hover:border-cyan-500/40 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        <div className="relative">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 rounded-xl bg-cyan-500/15">
                                    <BrainCircuit className="w-5 h-5 text-cyan-300" />
                                </div>
                                <span className="text-lg font-bold text-white">
                                    Next: Transformers
                                </span>
                            </div>
                            <p className="text-sm text-white/45 leading-relaxed">
                                Discover how self-attention overcomes the MLP&apos;s fixed-window
                                limitation and enables truly contextual language understanding.
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
                    From counting tables to learned representations — the MLP + Embeddings model
                    marked the moment language modeling became truly neural.
                </p>
                <div className="flex items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-widest text-white/10">
                    <FlaskConical className="h-3 w-3" />
                    LM-Lab · MLP + Embeddings Narrative
                </div>
            </motion.footer>
        </article>
    );
}

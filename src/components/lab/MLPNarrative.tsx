"use client";

import { motion } from "framer-motion";
import { BookOpen, FlaskConical, ArrowDown, Lightbulb, AlertTriangle, ArrowRight, Beaker, BrainCircuit } from "lucide-react";
import { ModeToggle } from "@/components/lab/ModeToggle";
import { useRouter } from "next/navigation";
import { useLabMode } from "@/context/LabModeContext";

import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

import { MLPNonLinearityVisualizer } from "@/components/lab/mlp/MLPNonLinearityVisualizer";
import { EmbeddingSpaceVisualizer } from "@/components/lab/mlp/EmbeddingSpaceVisualizer";
import { MLPHyperparameterExplorer } from "@/components/lab/mlp/MLPHyperparameterExplorer";
import { InitializationSensitivityVisualizer } from "@/components/lab/mlp/InitializationSensitivityVisualizer";
import { GradientFlowVisualizer } from "@/components/lab/mlp/GradientFlowVisualizer";
import { BatchNormEffectVisualizer } from "@/components/lab/mlp/BatchNormEffectVisualizer";

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

export function MLPNarrative() {
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

            {/* ─────────── 01 · WHAT IS AN MLP? ─────────── */}
            <Section>
                <SectionLabel number="01" label="Foundations" />
                <Heading>What Is a Multi-Layer Perceptron?</Heading>

                <Lead>
                    A multi-layer perceptron (MLP) is a feedforward neural network with one or more
                    hidden layers and non-linear activation functions — the simplest architecture
                    capable of learning complex, non-linear functions from data.
                </Lead>

                <P>
                    In the previous chapters, we explored N-gram models and single-layer neural
                    networks. N-grams memorize statistical tables of token co-occurrences, while
                    single-layer networks learn a linear mapping from inputs to outputs. Both have
                    a fundamental ceiling:{" "}
                    <Highlight>they cannot capture complex, non-linear relationships</Highlight>{" "}
                    between tokens.
                </P>

                <P>
                    An MLP changes this by stacking multiple layers of neurons, each followed by a
                    non-linear activation function (like ReLU or Tanh). This composition of layers
                    gives the network the theoretical ability to approximate any continuous function —
                    the famous Universal Approximation Theorem.
                </P>

                <FigureWrapper
                    label="MLP Architecture · Schematic"
                    hint="A feedforward network with input, hidden, and output layers connected by learned weight matrices."
                >
                    <MLPArchitectureDiagram />
                </FigureWrapper>

                <P>
                    Each hidden layer transforms its input through a learned weight matrix and a
                    non-linearity, progressively building higher-level features. The output layer
                    then maps these features to a probability distribution over the vocabulary via
                    softmax.
                </P>

                <FormulaBlock
                    formula="h = \sigma(W_1 x + b_1), \quad \hat{y} = \text{softmax}(W_2 h + b_2)"
                    caption="A two-layer MLP: the hidden layer applies weights and a non-linearity σ, and the output layer produces next-token probabilities."
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
                    The simplest way to use an MLP for language: take the previous N tokens as
                    one-hot vectors, concatenate them, and feed the result into the network to
                    predict the next token.
                </Lead>

                <P>
                    Suppose we have a vocabulary of V characters and a context window of size N.
                    Each token is represented as a one-hot vector of dimension V. We concatenate
                    N such vectors to form an input of dimension{" "}
                    <Highlight>N × V</Highlight>, then pass it through one or more hidden layers
                    to produce a probability distribution over the next token.
                </P>

                <FormulaBlock
                    formula="x = [\text{onehot}(t_{i-N}); \ldots; \text{onehot}(t_{i-1})] \in \mathbb{R}^{N \cdot V}"
                    caption="The input to the MLP is a concatenation of N one-hot vectors, one per context token."
                />

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
                    label="Interactive · Embedding Space (2D Projection)"
                    hint="Click any token to see its nearest neighbors. Semantically related tokens cluster together."
                >
                    <EmbeddingSpaceVisualizer />
                </FigureWrapper>
            </Section>

            <SectionBreak />

            {/* ─────────── 05 · EXPLORING CONFIGURATIONS ─────────── */}
            <Section>
                <SectionLabel number="05" label="Empirical Exploration" />
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
                    hint="Adjust sliders to explore how embedding dimension, hidden size, depth, and context window affect model performance."
                >
                    <MLPHyperparameterExplorer />
                </FigureWrapper>

                <P>
                    The interactive explorer above lets you compare models across these
                    dimensions, visualizing how training loss, perplexity, and generated text
                    quality change as you vary each hyperparameter. This empirical approach is
                    how practitioners develop real intuition about model design.
                </P>
            </Section>

            <SectionBreak />

            {/* ─────────── 06 · LIMITATIONS OF MLP + EMBEDDINGS ─────────── */}
            <Section>
                <SectionLabel number="06" label="Structural Limits" />
                <Heading>New Limitations of MLP + Embeddings</Heading>

                <Lead>
                    Embeddings solve the representation problem, but the MLP architecture itself
                    introduces structural limitations that no amount of tuning can overcome.
                </Lead>

                <P>
                    <Highlight color="amber">Fixed-size context window.</Highlight>{" "}
                    An MLP must receive a fixed number of input tokens. It cannot dynamically attend
                    to longer or shorter contexts — every prediction uses exactly N previous tokens,
                    no more, no less. Information outside this window is invisible to the model.
                </P>

                <P>
                    <Highlight color="amber">Position-dependent token meaning.</Highlight>{" "}
                    Because the MLP concatenates embeddings, the same token contributes different
                    features depending on which position it occupies in the context window. The
                    model treats &quot;the&quot; at position 1 and &quot;the&quot; at position 3
                    as fundamentally different inputs — it has no built-in notion of
                    position-invariant token identity.
                </P>

                <P>
                    <Highlight color="amber">Information dilution with longer contexts.</Highlight>{" "}
                    As the context window grows, each token&apos;s embedding becomes a smaller
                    fraction of the total input vector. The hidden layers must work harder to
                    extract relevant signal from an increasingly noisy concatenation, and the
                    model&apos;s ability to focus on the most informative tokens degrades.
                </P>

                <P>
                    <Highlight color="amber">First-layer scaling.</Highlight>{" "}
                    Even with embeddings, the first weight matrix W₁ has shape (N · D) × H.
                    Doubling the context window doubles the number of parameters in this layer.
                    For long contexts, this becomes the dominant cost.
                </P>

                <Callout icon={AlertTriangle} accent="amber" title="The concatenation bottleneck">
                    <p>
                        All of these limitations stem from the same root cause: the MLP treats its
                        input as a single flat vector. It has no mechanism to reason about the
                        structure, ordering, or relative importance of individual tokens within
                        the context. Overcoming this requires architectures that process sequences
                        as sequences — not as concatenated vectors.
                    </p>
                </Callout>
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
                    <InitializationSensitivityVisualizer />
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
                    <GradientFlowVisualizer />
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

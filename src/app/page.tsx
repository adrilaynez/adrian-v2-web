"use client";
import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Button } from "@/components/ui/button";
import { NebulaBackground } from "@/components/ui/nebula-background";
import {
  Cpu,
  FlaskConical,
  Github,
  Linkedin,
  Mail,
  ArrowRight,
  ChevronDown,
  Layers,
  Database,
  Sigma,
  ExternalLink,
  Sparkles,
} from "lucide-react";

/* ─── Staggered Character Reveal ─── */
function AnimatedTitle({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <motion.span className={className} aria-label={text}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 50, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.6,
            delay: delay + i * 0.025,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

/* ─── Fade-Up Block ─── */
function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Scroll Reveal Block ─── */
function ScrollReveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Animated Counter ─── */
function Counter({ value, suffix = "" }: { value: string; suffix?: string }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {value}{suffix}
    </motion.span>
  );
}

/* ─── Floating Orb Background ─── */
function FloatingOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
      <motion.div
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -40, 20, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute left-1/2 top-1/4 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-violet-500/[0.07] blur-[150px]"
      />
      <motion.div
        animate={{
          x: [0, -40, 30, 0],
          y: [0, 20, -30, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-cyan-500/[0.05] blur-[130px]"
      />
      <motion.div
        animate={{
          x: [0, 20, -30, 0],
          y: [0, 30, -20, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute left-1/4 bottom-1/3 h-[300px] w-[300px] rounded-full bg-rose-500/[0.04] blur-[120px]"
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.95]);

  return (
    <div className="flex flex-col min-h-screen relative">
      <NebulaBackground particleCount={80} baseColor="rgba(140, 140, 255, 0.06)" />

      {/* ────────── HERO ────────── */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 text-center"
      >
        <FloatingOrbs />

        <div className="container max-w-6xl space-y-8 relative z-10">
          {/* Status Chip */}
          <FadeUp delay={0.1}>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-5 py-2 text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground backdrop-blur-xl">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              System Online :: v2.2
            </span>
          </FadeUp>

          {/* Name — single line, scales with viewport */}
          <div className="w-full text-center">
            <h1
              className="font-extrabold tracking-[-0.03em] leading-none text-white"
              style={{ fontSize: "clamp(2rem, 6.5vw, 5.5rem)" }}
            >
              <AnimatedTitle
                text="ADRIAN LAYNEZ ORTIZ"
                delay={0.3}
                className="text-white"
              />
            </h1>
          </div>

          {/* Divider */}
          <FadeUp delay={1.0}>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-white/20" />
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground/40">Research & Engineering</span>
              <div className="h-px w-12 bg-white/20" />
            </div>
          </FadeUp>

          {/* Tagline */}
          <FadeUp delay={1.15} className="space-y-2">
            <p className="mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground/80 font-light leading-relaxed tracking-tight">
              Mathematics & Computer Science.
            </p>
            <p className="mx-auto max-w-xl text-sm md:text-base text-muted-foreground/50 font-light">
              <span className="text-primary/80 font-medium">Mechanistic Interpretability</span> · High-Performance Engineering.
            </p>
          </FadeUp>

          {/* CTA */}
          <FadeUp delay={1.4} className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button
              size="lg"
              className="h-13 px-8 rounded-full text-sm font-medium shadow-lg shadow-primary/10 transition-all duration-300 hover:shadow-primary/25 hover:scale-[1.04] active:scale-[0.98]"
              asChild
            >
              <Link href="/projects">
                View Lab Work <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="h-13 px-8 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/[0.05] transition-all duration-300"
              asChild
            >
              <Link href="/notes">Read Notes</Link>
            </Button>
          </FadeUp>
        </div>

        {/* Scroll Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 2.5, duration: 1.5 }}
          className="absolute bottom-10"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ────────── METRICS RIBBON ────────── */}
      <section className="relative z-10 border-y border-white/[0.06] bg-white/[0.01] backdrop-blur-sm">
        <div className="container mx-auto max-w-screen-xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.06]">
            {[
              { value: "4+", label: "Years of Research" },
              { value: "12+", label: "Open Source Repos" },
              { value: "3", label: "Active Projects" },
              { value: "∞", label: "Curiosity" },
            ].map((stat, i) => (
              <ScrollReveal key={stat.label}>
                <div className="py-10 px-6 text-center group">
                  <div className="text-3xl md:text-4xl font-bold text-foreground mb-1 transition-colors group-hover:text-primary">
                    <Counter value={stat.value} />
                  </div>
                  <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground/60">{stat.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ────────── ABOUT ────────── */}
      <section className="relative z-10 border-b border-white/[0.06]">
        <div className="container py-32 mx-auto max-w-screen-xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Image Column */}
            <ScrollReveal>
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/[0.06] shadow-2xl group">
                <Image
                  src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop"
                  alt="Abstract Mathematics Visualization"
                  fill
                  className="object-cover opacity-60 transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

                {/* Floating Status Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="absolute bottom-0 left-0 right-0 p-6"
                >
                  <div className="bg-background/50 backdrop-blur-xl rounded-xl border border-white/[0.08] p-5 shadow-2xl">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-400">Currently Building</span>
                    </div>
                    <p className="text-sm font-medium text-foreground">Deep Learning Engine — CUDA / C++</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">Custom kernels for matrix operations and backpropagation</p>
                  </div>
                </motion.div>

                {/* Corner Accent */}
                <div className="absolute top-4 right-4 flex gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-red-500/60" />
                  <div className="h-2 w-2 rounded-full bg-yellow-500/60" />
                  <div className="h-2 w-2 rounded-full bg-green-500/60" />
                </div>
              </div>
            </ScrollReveal>

            {/* Copy Column */}
            <ScrollReveal className="space-y-10">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.2em] text-primary">
                  <Sparkles className="h-3 w-3" /> About
                </div>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.1]">
                  Bridging Abstract Mathematics
                  <br className="hidden md:block" />
                  <span className="text-muted-foreground"> & Machine Intelligence</span>
                </h2>
              </div>

              <div className="space-y-5 text-[15px] leading-[1.8] text-muted-foreground">
                <p>
                  I am pursuing a double degree in{" "}
                  <strong className="text-foreground">Mathematics and Computer Science</strong> at
                  the Universidad Complutense de Madrid. My research focuses on understanding
                  neural networks at their deepest level — from gradient dynamics
                  to kernel-level optimization.
                </p>
                <p>
                  I specialize in{" "}
                  <strong className="text-foreground">Mechanistic Interpretability</strong> — the
                  science of reverse-engineering how neural networks represent and process
                  information internally. Rather than treating models as black boxes, I decompose
                  their circuits to understand{" "}
                  <em className="text-foreground/80">why they work</em>.
                </p>
                <p className="text-muted-foreground/60 border-l-2 border-primary/30 pl-4 italic">
                  My mission: make AI systems transparent through rigorous mathematical
                  analysis and low-level engineering.
                </p>
              </div>

              {/* Skills */}
              <div className="space-y-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/40">Technical Proficiencies</p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Python", "C++", "CUDA", "Rust", "PyTorch",
                    "Linear Algebra", "Topology", "Convex Optimization",
                    "Docker", "LaTeX", "Git",
                  ].map((s) => (
                    <motion.span
                      key={s}
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.08)" }}
                      className="rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-xs text-muted-foreground transition-colors cursor-default"
                    >
                      {s}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="flex gap-3 pt-2">
                <Button variant="outline" size="sm" className="rounded-full border-white/[0.08] hover:bg-white/[0.04] text-xs h-9 px-5 group/btn" asChild>
                  <Link href="https://github.com/adrilaynez" target="_blank">
                    <Github className="mr-1.5 h-3.5 w-3.5 transition-transform group-hover/btn:rotate-12" /> GitHub
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="rounded-full border-white/[0.08] hover:bg-white/[0.04] text-xs h-9 px-5 group/btn" asChild>
                  <Link href="https://linkedin.com" target="_blank">
                    <Linkedin className="mr-1.5 h-3.5 w-3.5 transition-transform group-hover/btn:rotate-12" /> LinkedIn
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="rounded-full border-white/[0.08] hover:bg-white/[0.04] text-xs h-9 px-5 group/btn" asChild>
                  <Link href="mailto:contact@adrianlaynez.dev">
                    <Mail className="mr-1.5 h-3.5 w-3.5 transition-transform group-hover/btn:rotate-12" /> Contact
                  </Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ────────── SELECTED WORK ────────── */}
      <section className="relative z-10 border-b border-white/[0.06]">
        <div className="container py-32 mx-auto max-w-screen-xl px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-20">
            <ScrollReveal className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.2em] text-primary mb-4">
                <FlaskConical className="h-3 w-3" /> Selected Work
              </div>
              <h3 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.1]">
                Engineering from
                <br className="hidden md:block" />
                <span className="text-muted-foreground"> First Principles</span>
              </h3>
              <p className="mt-5 text-muted-foreground text-[15px] leading-relaxed max-w-xl">
                Every project begins with a question. From reimplementing seminal papers to
                writing bare-metal GPU kernels, each one is an exercise in deep understanding.
              </p>
            </ScrollReveal>
            <ScrollReveal>
              <Button
                variant="outline"
                className="rounded-full border-white/[0.08] hover:bg-white/[0.04] h-10 px-6 text-xs group"
                asChild
              >
                <Link href="/projects">
                  View All Projects <ExternalLink className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </Button>
            </ScrollReveal>
          </div>

          <BentoGrid className="max-w-5xl">
            {items.map((item, i) => (
              <BentoGridItem
                key={i}
                title={item.title}
                description={item.description}
                header={item.header}
                icon={item.icon}
                className={i === 0 || i === 3 ? "md:col-span-2" : ""}
              />
            ))}
          </BentoGrid>
        </div>
      </section>

      {/* ────────── CONTACT CTA ────────── */}
      <section className="relative z-10">
        <div className="container py-32 mx-auto max-w-3xl px-6 text-center">
          <ScrollReveal className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.2em] text-primary">
              <Mail className="h-3 w-3" /> Open to Opportunities
            </div>
            <h4 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.1]">
              Let&apos;s Build
              <span className="text-muted-foreground"> Something</span>
              <br />
              <span className="text-muted-foreground">Together</span>
            </h4>
            <p className="text-muted-foreground text-[15px] leading-relaxed max-w-xl mx-auto">
              Whether it&apos;s a research collaboration, an internship opportunity, or just a
              conversation about the mathematics of intelligence — I&apos;d love to hear from you.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Button
                size="lg"
                className="h-13 px-8 rounded-full text-sm font-medium shadow-lg shadow-primary/10 transition-all duration-300 hover:shadow-primary/25 hover:scale-[1.04] active:scale-[0.98]"
                asChild
              >
                <Link href="mailto:contact@adrianlaynez.dev">
                  Get in Touch <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="h-13 px-8 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/[0.05]"
                asChild
              >
                <Link href="https://github.com/adrilaynez" target="_blank">
                  <Github className="mr-2 h-4 w-4" /> GitHub Profile
                </Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}

/* ─── Bento Card Visual Headers ─── */
const GradientSkeleton = ({ from, to }: { from: string; to: string }) => (
  <div
    className={`flex flex-1 w-full h-full min-h-[6rem] rounded-xl border border-white/[0.04] transition-all duration-700 group-hover/bento:border-primary/20 overflow-hidden relative`}
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${from} ${to} opacity-60 group-hover/bento:opacity-100 transition-opacity duration-700`} />
    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />
  </div>
);

const items = [
  {
    title: "Nano-Transformer",
    description:
      "Ground-up reproduction of 'Attention Is All You Need' in PyTorch — Multi-Head Attention, Positional Encodings, and LayerNorm implemented without pre-built Transformer modules.",
    header: <GradientSkeleton from="from-violet-500/10" to="to-indigo-500/10" />,
    icon: <Cpu className="h-4 w-4 text-violet-400" />,
  },
  {
    title: "CUDA Matrix Kernels",
    description:
      "Handwritten CUDA kernels exploring SGEMM optimization — from naive implementations to tiled shared-memory strategies, benchmarked against cuBLAS.",
    header: <GradientSkeleton from="from-cyan-500/10" to="to-blue-500/10" />,
    icon: <Layers className="h-4 w-4 text-cyan-400" />,
  },
  {
    title: "Autograd Engine",
    description:
      "Lightweight reverse-mode automatic differentiation library. Dynamically constructs computation graphs and propagates gradients via the chain rule.",
    header: <GradientSkeleton from="from-amber-500/10" to="to-orange-500/10" />,
    icon: <Sigma className="h-4 w-4 text-amber-400" />,
  },
  {
    title: "The Mathematics of Deep Learning",
    description:
      "Interactive articles exploring the rigorous theory behind modern AI — SGD convergence analysis, the linear algebra of LoRA, and differential geometry on neural manifolds.",
    header: <GradientSkeleton from="from-rose-500/10" to="to-pink-500/10" />,
    icon: <FlaskConical className="h-4 w-4 text-rose-400" />,
  },
  {
    title: "Distributed Inference",
    description:
      "Architectural explorations in data-parallel training, model sharding, and optimized inference pipelines for large-scale neural networks.",
    header: <GradientSkeleton from="from-emerald-500/10" to="to-teal-500/10" />,
    icon: <Database className="h-4 w-4 text-emerald-400" />,
  },
];

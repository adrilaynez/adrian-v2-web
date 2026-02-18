"use client";

import { ProjectCard } from "@/components/project-card";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import {
    Brain,
    FlaskConical,
    Boxes,
    Sparkles,
    ArrowRight,
    ExternalLink,
} from "lucide-react";

const projects = [
    {
        title: "Distri-KV",
        description: "A distributed key-value store implemented in Go, featuring Raft consensus and sharding.",
        tags: ["Go", "gRPC", "Raft", "Distributed Systems"],
        githubUrl: "#",
    },
    {
        title: "NeuroVis",
        description: "Interactive visualization tool for neural network activations in real-time.",
        tags: ["TypeScript", "WebGL", "Three.js", "React"],
        githubUrl: "#",
        demoUrl: "#",
    },
    {
        title: "Auto-Agent",
        description: "A lightweight autonomous agent framework focused on coding tasks.",
        tags: ["Python", "LangChain", "Docker"],
        githubUrl: "#",
    },
];

export function ProjectsContent() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative py-24 px-4 overflow-hidden border-b border-border/40">
                <div className="absolute inset-0 -z-10 bg-background">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                </div>

                <div className="container mx-auto max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-4"
                    >
                        <Badge variant="secondary" className="px-4 py-1 text-xs uppercase tracking-widest rounded-full border border-primary/20">
                            Research & Development
                        </Badge>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
                            Constructing the <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50">
                                Digital Frontier.
                            </span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl">
                            A curated collection of my work in distributed systems, AI infrastructure, and high-performance computing.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <section className="container py-16 mx-auto max-w-screen-xl px-4">

                {/* Flagship — LM-Lab */}
                <div className="mb-24">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-px bg-border flex-1"></div>
                        <span className="text-sm font-mono text-muted-foreground uppercase tracking-widest">Flagship Project</span>
                        <div className="h-px bg-border flex-1"></div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card className="relative overflow-hidden border-emerald-500/20 bg-gradient-to-br from-black via-emerald-950/20 to-black group hover:border-emerald-500/30 transition-all duration-700">
                            {/* Animated background grid */}
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:32px_32px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                            {/* Floating orb */}
                            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-emerald-500/[0.06] blur-[100px] group-hover:bg-emerald-500/[0.12] transition-all duration-1000" />
                            <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-violet-500/[0.04] blur-[80px] group-hover:bg-violet-500/[0.08] transition-all duration-1000" />

                            <div className="relative z-10 p-8 md:p-12">
                                {/* Top badges */}
                                <div className="flex items-center gap-2 mb-6 flex-wrap">
                                    <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-mono text-[10px] uppercase tracking-widest">
                                        Featured
                                    </Badge>
                                    <Badge className="bg-white/[0.04] text-white/60 border-white/[0.06] font-mono text-[10px] uppercase tracking-widest">
                                        Live Demo Available
                                    </Badge>
                                </div>

                                {/* Title */}
                                <div className="flex items-center gap-3 mb-4">
                                    <FlaskConical className="h-8 w-8 text-emerald-400" />
                                    <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                                        LM-Lab
                                    </h2>
                                </div>

                                {/* Description */}
                                <p className="text-base md:text-lg text-white/60 max-w-2xl mb-6 leading-relaxed">
                                    An interactive platform for exploring language model architectures
                                    from first principles. Visualize transition matrices, probe
                                    inference dynamics, and generate text — all powered by a live
                                    FastAPI backend with PyTorch.
                                </p>

                                {/* Tech Stack */}
                                <div className="flex flex-wrap gap-1.5 mb-8">
                                    {["Python", "PyTorch", "FastAPI", "Next.js", "TypeScript", "Canvas API"].map(
                                        (tag) => (
                                            <Badge
                                                key={tag}
                                                variant="secondary"
                                                className="font-mono text-xs bg-white/[0.04] border-white/[0.06] text-white/50"
                                            >
                                                {tag}
                                            </Badge>
                                        )
                                    )}
                                </div>

                                {/* Feature highlights */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                                    {[
                                        {
                                            icon: Brain,
                                            title: "Live Inference",
                                            desc: "Real-time next-character prediction with probability distributions",
                                        },
                                        {
                                            icon: Boxes,
                                            title: "Transition Matrix",
                                            desc: "Interactive canvas heatmap of the learned bigram probabilities",
                                        },
                                        {
                                            icon: Sparkles,
                                            title: "Text Generation",
                                            desc: "Generate text with configurable temperature and step-by-step tracing",
                                        },
                                    ].map((feat) => (
                                        <div
                                            key={feat.title}
                                            className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 hover:bg-white/[0.04] hover:border-emerald-500/20 transition-all duration-300 group/feat"
                                        >
                                            <feat.icon className="h-5 w-5 text-emerald-400/60 mb-2 group-hover/feat:text-emerald-400 transition-colors" />
                                            <h4 className="text-sm font-semibold text-white mb-1">
                                                {feat.title}
                                            </h4>
                                            <p className="text-xs text-white/40 leading-relaxed">
                                                {feat.desc}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* CTAs */}
                                <div className="flex flex-wrap gap-3">
                                    <Button
                                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs uppercase tracking-widest h-11 px-6 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25 transition-all duration-300"
                                        asChild
                                    >
                                        <Link href="/lab/bigram">
                                            <Brain className="h-4 w-4 mr-2" />
                                            Open Bigram Explorer
                                            <ArrowRight className="h-3.5 w-3.5 ml-2" />
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="border-white/[0.08] hover:bg-white/[0.04] text-white/70 font-mono text-xs uppercase tracking-widest h-11 px-6 transition-all"
                                        asChild
                                    >
                                        <Link href="/lab/bigram#architecture">
                                            <Boxes className="h-4 w-4 mr-2" />
                                            View Architecture
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="border-white/[0.08] hover:bg-white/[0.04] text-white/70 font-mono text-xs uppercase tracking-widest h-11 px-6 transition-all"
                                        asChild
                                    >
                                        <Link href="/lab/bigram#playground">
                                            <Sparkles className="h-4 w-4 mr-2" />
                                            Run Interactive Demo
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </div>

                {/* Other Projects Grid */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold tracking-tight mb-8 border-l-4 border-primary pl-4">Selected Experiments</h2>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {projects.map((project, i) => (
                            <motion.div
                                key={project.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <ProjectCard {...project} />
                            </motion.div>
                        ))}
                    </div>
                </div>

            </section>
        </div>
    );
}

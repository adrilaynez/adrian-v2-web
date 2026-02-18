"use client";

import { ProjectCard } from "@/components/project-card";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const projects = [
    {
        title: "Large Model Lab",
        description: "An experimental platform for testing LLM inference optimization techniques, including quantization and speculative decoding.",
        tags: ["Python", "PyTorch", "CUDA", "Streamlit"],
        githubUrl: "https://github.com/adrilaynez/lm-lab",
        demoUrl: "#",
    },
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

                {/* Featured Project - Nebula */}
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
                        <ProjectCard
                            title="Project NEBULA"
                            description="A next-generation distributed knowledge graph engine designed for autonomous AI agents. Features self-healing mesh topology, millisecond-latency query resolution, and real-time neural indexing. (Simulated Case Study)"
                            tags={["Rust", "WebAssembly", "Distributed Systems", "Graph Neural Networks"]}
                            demoUrl="/projects/nebula"
                            featured={true}
                            image="/nebula-preview.png" // Placeholder
                        />
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

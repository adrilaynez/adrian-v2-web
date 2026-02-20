"use client";

import ModelSelector from "@/components/ModelSelector";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
    Brain,
    Activity,
    Layers,
    Cpu,
    ChevronRight,
    BookOpen,
    FlaskConical,
    ArrowRight,
    Sparkles,
    BarChart3,
    GraduationCap,
    Zap,
    Network,
} from "lucide-react";

const accentStyles: Record<string, { icon: string; border: string; glow: string; bar: string }> = {
    emerald: {
        icon: "text-emerald-400",
        border: "group-hover:border-emerald-500/30",
        glow: "group-hover:shadow-[0_0_40px_-12px_rgba(16,185,129,0.25)]",
        bar: "bg-emerald-500",
    },
    blue: {
        icon: "text-blue-400",
        border: "group-hover:border-blue-500/30",
        glow: "group-hover:shadow-[0_0_40px_-12px_rgba(59,130,246,0.25)]",
        bar: "bg-blue-500",
    },
    violet: {
        icon: "text-violet-400",
        border: "group-hover:border-violet-500/30",
        glow: "group-hover:shadow-[0_0_40px_-12px_rgba(139,92,246,0.25)]",
        bar: "bg-violet-500",
    },
    amber: {
        icon: "text-amber-400",
        border: "group-hover:border-amber-500/30",
        glow: "group-hover:shadow-[0_0_40px_-12px_rgba(245,158,11,0.25)]",
        bar: "bg-amber-500",
    },
    rose: {
        icon: "text-rose-400",
        border: "group-hover:border-rose-500/30",
        glow: "group-hover:shadow-[0_0_40px_-12px_rgba(244,63,94,0.25)]",
        bar: "bg-rose-500",
    },
};

const highlights = [
    { icon: BarChart3, labelKey: "visualizations", color: "text-emerald-400" },
    { icon: Zap, labelKey: "inference", color: "text-blue-400" },
    { icon: GraduationCap, labelKey: "guided", color: "text-violet-400" },
    { icon: Sparkles, labelKey: "backend", color: "text-amber-400" },
];

import { useI18n } from "@/i18n/context";

export default function LabLandingPage() {
    const { t } = useI18n();

    const models = [
        {
            id: "bigram",
            name: t("lab.models.bigram.name"),
            subtitle: t("lab.models.bigram.subtitle"),
            description: t("lab.models.bigram.description"),
            status: "ready" as const,
            icon: Brain,
            href: "/lab/bigram",
            accent: "emerald",
            complexity: 1,
        },
        {
            id: "neural-networks",
            name: t("lab.models.neuralNetworks.name"),
            subtitle: t("lab.models.neuralNetworks.subtitle"),
            description: t("lab.models.neuralNetworks.description"),
            status: "ready" as const,
            icon: Network,
            href: "/lab/neural-networks",
            accent: "rose",
            complexity: 2,
        },
        {
            id: "ngram",
            name: t("lab.models.ngram.name"),
            subtitle: t("lab.models.ngram.subtitle"),
            description: t("lab.models.ngram.description"),
            status: "ready" as const,
            icon: Activity,
            href: "/lab/ngram",
            accent: "blue",
            complexity: 3,
        },
        {
            id: "mlp",
            name: t("lab.models.mlp.name"),
            subtitle: t("lab.models.mlp.subtitle"),
            description: t("lab.models.mlp.description"),
            status: "coming" as const,
            icon: Layers,
            href: "/lab/mlp",
            accent: "violet",
            complexity: 4,
        },
        {
            id: "transformer",
            name: t("lab.models.transformer.name"),
            subtitle: t("lab.models.transformer.subtitle"),
            description: t("lab.models.transformer.description"),
            status: "coming" as const,
            icon: Cpu,
            href: "/lab/transformer",
            accent: "amber",
            complexity: 5,
        },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/3 w-[460px] h-[460px] bg-emerald-500/[0.06] rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-1/4 w-[340px] h-[340px] bg-violet-500/[0.03] rounded-full blur-[80px]" />
            </div>

            <div className="relative z-10">
                {/* ─── Hero ─── */}
                <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
                    <div className="max-w-5xl mx-auto px-6 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45 }}
                        >
                            <Badge className="mb-8 bg-white/[0.05] hover:bg-white/[0.08] text-white/60 border-white/[0.1] px-4 py-1.5 text-xs font-mono uppercase tracking-widest">
                                {t("lab.landing.hero.badge")}
                            </Badge>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.06 }}
                            className="mb-8"
                        >
                            <div className="flex items-center justify-center gap-4 mb-2">
                                <motion.div
                                    initial={{ scale: 0.84, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.18 }}
                                    className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center"
                                >
                                    <FlaskConical className="w-6 h-6 md:w-7 md:h-7 text-emerald-400" />
                                </motion.div>
                                <motion.h1
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    className="text-5xl md:text-7xl font-extrabold tracking-tight"
                                >
                                    <span className="text-white">LM</span>
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200 ml-3">
                                        Lab
                                    </span>
                                </motion.h1>
                            </div>
                            <p className="text-[11px] font-mono text-white/20 uppercase tracking-[0.3em]">
                                {t("lab.landing.hero.subtitle")}
                            </p>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.15 }}
                            className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed mb-5"
                        >
                            {t("lab.landing.hero.description")}
                        </motion.p>

                        <motion.p
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.2 }}
                            className="text-sm text-white/30 max-w-lg mx-auto leading-relaxed mb-10"
                        >
                            {t("lab.landing.hero.subDescription")}
                        </motion.p>

                        {/* Highlights strip */}
                        <motion.div
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.26 }}
                            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mb-12"
                        >
                            {highlights.map((h, idx) => (
                                <motion.div
                                    key={h.labelKey}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.35, delay: 0.3 + idx * 0.05 }}
                                    className="flex items-center gap-2"
                                >
                                    <h.icon className={cn("w-3.5 h-3.5", h.color)} />
                                    <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider">
                                        {t(`lab.landing.highlights.${h.labelKey}`)}
                                    </span>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.34 }}
                        >
                            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="inline-flex">
                                <Link
                                    href="/lab/bigram"
                                    className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-sm font-bold text-emerald-400 uppercase tracking-[0.15em] hover:bg-emerald-500/20 hover:border-emerald-500/40 hover:scale-[1.02] transition-all group shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)]"
                                >
                                    <Brain className="w-4 h-4" />
                                    {t("lab.landing.hero.start")}
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </motion.div>
                            <p className="mt-3 text-[10px] font-mono text-white/20 uppercase tracking-widest">
                                {t("lab.landing.hero.recommended")}
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* ─── Journey Progression ─── */}
                <section className="max-w-4xl mx-auto px-6 pb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.65 }}
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-px bg-white/[0.06] flex-1" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/25 shrink-0">
                                {t("lab.landing.learningPath.title")}
                            </span>
                            <div className="h-px bg-white/[0.06] flex-1" />
                        </div>

                        {/* Horizontal timeline */}
                        <div className="relative flex items-center justify-between px-4 py-6">
                            {/* Connecting line */}
                            <div className="absolute top-1/2 left-8 right-8 h-px bg-gradient-to-r from-emerald-500/40 via-blue-500/30 via-violet-500/20 to-white/[0.06] -translate-y-1/2" />

                            {models.map((model, idx) => {
                                const a = accentStyles[model.accent];
                                const isReady = model.status === "ready";
                                return (
                                    <motion.div
                                        key={model.id}
                                        initial={{ opacity: 0, scale: 0.88 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.35, delay: idx * 0.07 }}
                                        className="relative flex flex-col items-center gap-2 z-10"
                                    >
                                        <div
                                            className={cn(
                                                "w-11 h-11 rounded-xl border flex items-center justify-center transition-all",
                                                isReady
                                                    ? `bg-[#0a0a0f] border-white/[0.1] ${a.icon}`
                                                    : "bg-[#0a0a0f] border-white/[0.06] text-white/20"
                                            )}
                                        >
                                            <model.icon className="w-5 h-5" />
                                        </div>
                                        <span
                                            className={cn(
                                                "text-[10px] font-mono uppercase tracking-wider",
                                                isReady ? "text-white/50" : "text-white/20"
                                            )}
                                        >
                                            {model.id === "mlp" ? "MLP" : model.id === "neural-networks" ? "Neural Nets" : model.id.charAt(0).toUpperCase() + model.id.slice(1)}
                                        </span>
                                        {!isReady && (
                                            <span className="text-[8px] font-mono text-white/15 uppercase">
                                                {t("lab.landing.learningPath.status.soon")}
                                            </span>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                </section>

                {/* ─── Modes explanation ─── */}
                <section className="max-w-5xl mx-auto px-6 pb-24">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-px bg-white/[0.06] flex-1" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/25 shrink-0">
                            {t("lab.landing.modes.title")}
                        </span>
                        <div className="h-px bg-white/[0.06] flex-1" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <motion.div
                            initial={{ opacity: 0, x: -18 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.45 }}
                            className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-7 relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 right-0 h-px bg-emerald-500" />
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                    <BookOpen className="w-4 h-4 text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white">
                                        {t("lab.landing.modes.educational.title")}
                                    </h3>
                                    <p className="text-[10px] font-mono text-emerald-400/50 uppercase tracking-wider">
                                        {t("lab.landing.modes.educational.subtitle")}
                                    </p>
                                </div>
                            </div>
                            <p className="text-xs text-white/40 leading-relaxed">
                                {t("lab.landing.modes.educational.description")}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 18 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.45, delay: 0.08 }}
                            className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-7 relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 right-0 h-px bg-blue-500" />
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                    <FlaskConical className="w-4 h-4 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white">
                                        {t("lab.landing.modes.freeLab.title")}
                                    </h3>
                                    <p className="text-[10px] font-mono text-blue-400/50 uppercase tracking-wider">
                                        {t("lab.landing.modes.freeLab.subtitle")}
                                    </p>
                                </div>
                            </div>
                            <p className="text-xs text-white/40 leading-relaxed">
                                {t("lab.landing.modes.freeLab.description")}
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* ─── Model Cards ─── */}
                <section className="max-w-5xl mx-auto px-6 pb-32">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-px bg-white/[0.06] flex-1" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/25 shrink-0">
                            {t("lab.landing.availableModels.title")}
                        </span>
                        <div className="h-px bg-white/[0.06] flex-1" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {models.map((model, idx) => {
                            const a = accentStyles[model.accent];
                            const isReady = model.status === "ready";

                            return (
                                <motion.div
                                    key={model.id}
                                    initial={{ opacity: 0, y: 22 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-60px" }}
                                    transition={{ duration: 0.48, delay: idx * 0.06 }}
                                >
                                    <Link
                                        href={isReady ? model.href : "#"}
                                        className={cn(
                                            "group block h-full",
                                            !isReady && "pointer-events-none"
                                        )}
                                        tabIndex={isReady ? undefined : -1}
                                    >
                                        <div
                                            className={cn(
                                                "relative h-full rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-300 overflow-hidden",
                                                isReady && a.border,
                                                isReady && a.glow,
                                            )}
                                        >
                                            {/* Accent top bar */}
                                            <div className={cn("absolute top-0 left-0 right-0 h-px", isReady ? a.bar : "bg-white/[0.04]")} />

                                            <div className="flex items-start justify-between mb-4">
                                                <div
                                                    className={cn(
                                                        "w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center transition-transform duration-300",
                                                        isReady && "group-hover:scale-110",
                                                        a.icon,
                                                    )}
                                                >
                                                    <model.icon className="w-5 h-5" />
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {/* Complexity dots */}
                                                    <div className="flex items-center gap-1">
                                                        {[1, 2, 3, 4, 5].map((dot) => (
                                                            <div
                                                                key={dot}
                                                                className={cn(
                                                                    "w-1.5 h-1.5 rounded-full transition-colors",
                                                                    dot <= model.complexity
                                                                        ? isReady ? a.bar : "bg-white/20"
                                                                        : "bg-white/[0.06]"
                                                                )}
                                                            />
                                                        ))}
                                                    </div>
                                                    <Badge
                                                        className={cn(
                                                            "text-[8px] font-mono uppercase tracking-widest py-0 px-2",
                                                            isReady
                                                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                                : "bg-white/[0.03] text-white/20 border-white/[0.06]"
                                                        )}
                                                    >
                                                        {isReady ? t("lab.landing.learningPath.status.ready") : t("lab.landing.learningPath.status.soon")}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <h3 className="text-base font-bold text-white mb-0.5">
                                                {model.name}
                                            </h3>
                                            <p className="text-[11px] font-mono text-white/25 uppercase tracking-wider mb-3">
                                                {model.subtitle}
                                            </p>
                                            <p className="text-sm text-white/40 leading-relaxed mb-5">
                                                {model.description}
                                            </p>

                                            {isReady ? (
                                                <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-white/30 group-hover:text-emerald-400 transition-colors uppercase tracking-widest">
                                                    <span>{t("lab.landing.availableModels.enter")}</span>
                                                    <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            ) : (
                                                <div className="text-[10px] font-mono font-bold text-white/15 uppercase tracking-widest">
                                                    {t("lab.landing.availableModels.locked")}
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>

                {/* ─── Footer ─── */}
                <footer className="max-w-5xl mx-auto px-6 pb-12 pt-8 border-t border-white/[0.04]">
                    <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-white/20 uppercase tracking-widest">
                        <FlaskConical className="w-3 h-3" />
                        <span>{t("lab.landing.footer.text")}</span>
                    </div>
                </footer>
            </div>
        </div>
    );
}

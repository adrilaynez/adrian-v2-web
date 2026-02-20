"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft,
    FlaskConical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useI18n } from "@/i18n/context";

export function LabShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { t } = useI18n();

    const models = [
        { id: "bigram", label: t("lab.bigram"), href: "/lab/bigram", ready: true },
        { id: "neural-networks", label: t("lab.neuralNetworks"), href: "/lab/neural-networks", ready: true },
        { id: "ngram", label: t("lab.ngram"), href: "/lab/ngram", ready: true },
        { id: "mlp", label: t("lab.mlp"), href: "/lab/mlp", ready: false },
        { id: "transformer", label: t("lab.transformer"), href: "/lab/transformer", ready: false },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white font-sans">
            {/* Top Bar */}
            <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0a0a0f]/95">
                <div className="container mx-auto flex items-center justify-between h-14 px-4 md:px-8 max-w-screen-2xl">
                    {/* Left */}
                    <div className="flex items-center gap-4">
                        <Link
                            href="/projects"
                            className="flex items-center gap-2 text-xs text-white/50 hover:text-white/80 transition-colors font-mono"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">{t("lab.shell.allModels")}</span>
                        </Link>

                        <div className="h-4 w-px bg-white/[0.08]" />

                        <div className="flex items-center gap-2">
                            <FlaskConical className="h-4 w-4 text-emerald-400" />
                            <span className="font-bold text-sm tracking-tight">LM-Lab</span>
                            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[9px] font-mono uppercase tracking-widest">
                                v1.0
                            </Badge>
                        </div>
                    </div>

                    {/* Center — Model Tabs */}
                    <nav className="flex items-center gap-1">
                        {models.map((model) => {
                            const isActive = pathname?.startsWith(model.href);
                            return (
                                <Link
                                    key={model.id}
                                    href={model.href}
                                    className={cn(
                                        "relative px-4 py-2 text-xs font-mono uppercase tracking-widest transition-colors rounded-md",
                                        isActive
                                            ? "text-white"
                                            : model.ready
                                                ? "text-white/40 hover:text-white/60"
                                                : "text-white/20 pointer-events-none"
                                    )}
                                >
                                    {model.label}
                                    {!model.ready && (
                                        <Badge className="ml-1.5 bg-white/[0.04] text-white/20 border-white/[0.04] text-[8px] font-mono py-0 px-1">
                                            Soon
                                        </Badge>
                                    )}
                                    {isActive && (
                                        <motion.div
                                            layoutId="labTab"
                                            className="absolute inset-0 bg-white/[0.06] rounded-md -z-10"
                                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="flex items-center">
                        <LanguageToggle />
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="container mx-auto max-w-screen-2xl px-4 md:px-8 py-6 md:py-8">
                {children}
            </main>
        </div>
    );
}

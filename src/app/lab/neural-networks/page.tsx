"use client";

import dynamic from "next/dynamic";
import { LabShell } from "@/components/lab/LabShell";
import { ModelHero } from "@/components/lab/ModelHero";
import { SectionDivider } from "@/components/lab/SectionDivider";

import { motion } from "framer-motion";
import { FlaskConical } from "lucide-react";
import { useI18n } from "@/i18n/context";
import { useLabMode } from "@/context/LabModeContext";

const NeuralNetworkNarrative = dynamic(
    () => import("@/components/lab/NeuralNetworkNarrative").then((m) => ({ default: m.NeuralNetworkNarrative })),
    { ssr: false, loading: () => <NeuralNetworksLoadingPlaceholder /> }
);

const NNPlayground = dynamic(
    () => import("@/components/lab/NNPlayground").then((m) => ({ default: m.NNPlayground })),
    { ssr: false, loading: () => <NeuralNetworksLoadingPlaceholder /> }
);

function NeuralNetworksLoadingPlaceholder() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-24 flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-8 h-8 rounded-full border-2 border-rose-500/30 border-t-rose-400 animate-spin mb-6" />
            <p className="text-sm text-white/30 font-mono">Loading…</p>
        </div>
    );
}

export default function NeuralNetworksPage() {
    const { t } = useI18n();
    const { mode } = useLabMode();

    const isEducational = mode === "educational";

    return (
        <LabShell>
            {isEducational ? (
                /* ═══════════════════════════════════════════
                   EDUCATIONAL MODE — Narrative blog layout
                   ═══════════════════════════════════════════ */
                <NeuralNetworkNarrative />
            ) : (
                /* ═══════════════════════════════════════════
                   FREE LAB MODE — Interactive playground
                   ═══════════════════════════════════════════ */
                <div className="max-w-7xl mx-auto pb-24">

                    {/* ─── HERO ─── */}
                    <ModelHero
                        title={t("models.neuralNetworks.title")}
                        description={t("models.neuralNetworks.description")}
                        customStats={[]}
                    />

                    {/* ─── PLAYGROUND ─── */}
                    <SectionDivider
                        number="01"
                        title={t("models.neuralNetworks.freeLab.title")}
                        description={t("models.neuralNetworks.freeLab.description")}
                    />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.6 }}
                        className="max-w-5xl mx-auto px-6 mb-28"
                    >
                        <NNPlayground />
                    </motion.div>

                    {/* ─── FOOTER ─── */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="mt-32 border-t border-white/[0.05] pt-12 flex flex-col items-center gap-3"
                    >
                        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-white/20">
                            <FlaskConical className="h-3 w-3" />
                            <span>LM-Lab · {t("models.neuralNetworks.hero.badge")}</span>
                        </div>
                        <p className="text-[10px] text-white/15 font-mono">
                            Switch to Educational Mode for the guided narrative experience
                        </p>
                    </motion.div>
                </div>
            )}
        </LabShell>
    );
}

"use client";

import dynamic from "next/dynamic";
import { LabShell } from "@/components/lab/LabShell";
import { motion } from "framer-motion";
import { FlaskConical, Layers, Lock } from "lucide-react";
import { useLabMode } from "@/context/LabModeContext";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const MLPNarrative = dynamic(
    () => import("@/components/lab/MLPNarrative").then((m) => ({ default: m.MLPNarrative })),
    { ssr: false, loading: () => <MLPLoadingPlaceholder /> }
);

function MLPLoadingPlaceholder() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-24 flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-8 h-8 rounded-full border-2 border-violet-500/30 border-t-violet-400 animate-spin mb-6" />
            <p className="text-sm text-white/30 font-mono">Loading…</p>
        </div>
    );
}

function MlpPageContent() {
    const { mode } = useLabMode();
    const isEducational = mode === "educational";

    return (
        <LabShell>
            {isEducational ? (
                /* ═══════════════════════════════════════════
                   EDUCATIONAL MODE — Narrative blog layout
                   ═══════════════════════════════════════════ */
                <MLPNarrative />
            ) : (
                /* ═══════════════════════════════════════════
                   FREE LAB MODE — Placeholder (to be implemented)
                   ═══════════════════════════════════════════ */
                <div className="max-w-7xl mx-auto pb-24">
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Card className="bg-black/40 border-white/[0.06] backdrop-blur-sm p-12 text-center max-w-md mx-auto">
                                <div className="flex items-center justify-center mb-6">
                                    <div className="relative">
                                        <Layers className="h-12 w-12 text-violet-400/50" />
                                        <Lock className="h-5 w-5 text-white/30 absolute -bottom-1 -right-1" />
                                    </div>
                                </div>
                                <h2 className="text-xl font-bold text-white mb-2">
                                    MLP Free Lab
                                </h2>
                                <p className="text-sm text-white/40 mb-4 leading-relaxed">
                                    Interactive MLP + Embeddings playground. Currently under
                                    development — switch to Educational Mode for the guided narrative.
                                </p>
                                <Badge className="bg-violet-500/10 text-violet-400 border-violet-500/20 text-[10px] font-mono uppercase tracking-widest">
                                    Coming Soon
                                </Badge>
                            </Card>
                        </motion.div>
                    </div>

                    {/* ─── FOOTER ─── */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="mt-32 border-t border-white/[0.05] pt-12 flex flex-col items-center gap-3"
                    >
                        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-white/20">
                            <FlaskConical className="h-3 w-3" />
                            <span>LM-Lab · MLP + Embeddings</span>
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

export default function MlpPage() {
    return <MlpPageContent />;
}

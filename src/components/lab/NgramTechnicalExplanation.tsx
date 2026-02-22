"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, FlaskConical } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/i18n/context";

interface NgramTechnicalExplanationProps {
    contextSize: number;
    vocabSize: number;
    totalTokens?: number;
    uniqueContexts?: number;
    perplexity?: number;
    finalLoss?: number;
    corpusName?: string;
    smoothingAlpha?: number;
}

interface SpecRowProps {
    label: string;
    value: string;
    mono?: boolean;
}

function SpecRow({ label, value, mono }: SpecRowProps) {
    return (
        <div className="flex flex-col gap-0.5 py-3 border-b border-white/[0.05] last:border-0">
            <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-white/30">
                {label}
            </span>
            <span className={`text-sm text-white/70 leading-snug ${mono ? "font-mono" : ""}`}>
                {value}
            </span>
        </div>
    );
}

export function NgramTechnicalExplanation({
    contextSize,
    vocabSize,
    totalTokens,
    uniqueContexts,
    perplexity,
    finalLoss,
    corpusName = "Paul Graham Essays",
    smoothingAlpha = 1.0,
}: NgramTechnicalExplanationProps) {
    const { t } = useI18n();
    const [open, setOpen] = useState(false);

    const contextSpace = Math.pow(vocabSize, contextSize);
    const contextSpaceStr = contextSpace > 1e12
        ? `${(contextSpace / 1e12).toFixed(1)}T`
        : contextSpace > 1e9
            ? `${(contextSpace / 1e9).toFixed(1)}B`
            : contextSpace > 1e6
                ? `${(contextSpace / 1e6).toFixed(1)}M`
                : contextSpace.toLocaleString();

    const paramCount = contextSpace * vocabSize;
    const paramCountStr = paramCount > 1e12
        ? `${(paramCount / 1e12).toFixed(1)}T`
        : paramCount > 1e9
            ? `${(paramCount / 1e9).toFixed(1)}B`
            : paramCount > 1e6
                ? `${(paramCount / 1e6).toFixed(1)}M`
                : paramCount.toLocaleString();

    const formula = `P(c_t | c_{t-${contextSize}}, …, c_{t-1})\n  = count(c_{t-${contextSize}}…c_t) / count(c_{t-${contextSize}}…c_{t-1})`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4 }}
            className="max-w-6xl mx-auto px-6 mb-6"
        >
            {/* Toggle header */}
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center gap-3 px-5 py-3.5 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.035] transition-colors group"
            >
                <FlaskConical className="w-4 h-4 text-white/30 shrink-0" />
                <div className="flex-1 text-left">
                    <span className="text-sm font-bold text-white/50 group-hover:text-white/70 transition-colors">
                        {t("models.ngram.lab.technicalExplanation.title")}
                    </span>
                    <span className="ml-2.5 text-[10px] font-mono text-white/20 uppercase tracking-widest">
                        {t("models.ngram.lab.technicalExplanation.description")}
                    </span>
                </div>
                <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-4 h-4 text-white/20" />
                </motion.div>
            </button>

            {/* Expanded body */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="pt-4 space-y-6">
                            {/* Model Card — 2-column grid */}
                            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
                                <div className="px-5 py-3 border-b border-white/[0.06] bg-white/[0.01]">
                                    <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-white/30">
                                        Model Card · N = {contextSize}
                                    </p>
                                </div>
                                <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/[0.05]">
                                    {/* Left column */}
                                    <div className="px-5">
                                        <SpecRow
                                            label={t("models.ngram.lab.technicalExplanation.modelType")}
                                            value={t("models.ngram.lab.technicalExplanation.modelTypeValue")
                                                .replace("{n}", String(contextSize))
                                                .replace("{nPlusOne}", String(contextSize + 1))}
                                        />
                                        <SpecRow
                                            label={t("models.ngram.lab.technicalExplanation.parameterCount")}
                                            value={`|V|^${contextSize} × |V| = ${paramCountStr} probability entries`}
                                            mono
                                        />
                                        <SpecRow
                                            label={t("models.ngram.lab.technicalExplanation.trainingMethod")}
                                            value={t("models.ngram.lab.technicalExplanation.trainingMethodValue")}
                                        />
                                        <SpecRow
                                            label={t("models.ngram.lab.technicalExplanation.smoothing")}
                                            value={t("models.ngram.lab.technicalExplanation.smoothingValue")
                                                .replace("{alpha}", String(smoothingAlpha))}
                                        />
                                    </div>
                                    {/* Right column */}
                                    <div className="px-5">
                                        <SpecRow
                                            label={t("models.ngram.lab.technicalExplanation.corpusInfo")}
                                            value={corpusName}
                                        />
                                        {totalTokens != null && (
                                            <SpecRow
                                                label="Training Tokens"
                                                value={`${(totalTokens / 1000).toFixed(1)}k characters`}
                                                mono
                                            />
                                        )}
                                        {uniqueContexts != null && (
                                            <SpecRow
                                                label="Unique Contexts Seen"
                                                value={`${uniqueContexts.toLocaleString()} / ${contextSpaceStr} possible`}
                                                mono
                                            />
                                        )}
                                        {perplexity != null && (
                                            <SpecRow
                                                label="Perplexity"
                                                value={perplexity.toFixed(2)}
                                                mono
                                            />
                                        )}
                                        {finalLoss != null && (
                                            <SpecRow
                                                label="Final Loss"
                                                value={finalLoss.toFixed(4)}
                                                mono
                                            />
                                        )}
                                        <SpecRow
                                            label={t("models.ngram.lab.technicalExplanation.inferenceComplexity")}
                                            value={t("models.ngram.lab.technicalExplanation.inferenceComplexityValue")}
                                            mono
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Mathematical formulation */}
                            <div className="rounded-xl border border-white/[0.08] bg-black/30 overflow-hidden">
                                <div className="px-5 py-3 border-b border-white/[0.06]">
                                    <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-white/30">
                                        {t("models.ngram.lab.technicalExplanation.mathematicalFormulation")}
                                    </p>
                                </div>
                                <div className="p-5">
                                    <pre className="font-mono text-sm text-amber-200/70 leading-relaxed whitespace-pre-wrap break-all">
                                        {formula}
                                    </pre>
                                    <p className="mt-4 text-xs text-white/35 leading-relaxed">
                                        {t("models.ngram.lab.technicalExplanation.formulaDesc")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

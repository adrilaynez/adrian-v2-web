"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useI18n } from "@/i18n/context";

const ALLOWED_VOCABULARY = "abcdefghijklmnopqrstuvwxyz ";
const MAX_EDUCATIONAL_VOCAB = 12;
const ANIMATION_DELAY_MS = 380;

type BuildStep = {
    from: string;
    to: string;
    row: number;
    col: number;
    position: number;
};

function createZeroMatrix(size: number): number[][] {
    return Array.from({ length: size }, () => Array(size).fill(0));
}

function normalizeToVocabulary(input: string): string {
    const allowed = new Set(ALLOWED_VOCABULARY.split(""));
    return input
        .toLowerCase()
        .split("")
        .filter((char) => allowed.has(char))
        .join("");
}

function buildEducationalVocabulary(text: string): string[] {
    const seen = new Set<string>();
    const chars: string[] = [];

    for (const char of text) {
        if (!seen.has(char)) {
            seen.add(char);
            chars.push(char);
        }
        if (chars.length >= MAX_EDUCATIONAL_VOCAB) {
            break;
        }
    }

    return chars.length > 0 ? chars : ["a", "b", " "];
}

function formatCharLabel(char: string): string {
    return char === " " ? "␠" : char;
}

export function BigramMatrixBuilder() {
    const { t } = useI18n();
    const [inputText, setInputText] = useState("hello world");
    const [normalizedText, setNormalizedText] = useState("hello world");
    const [currentStepIndex, setCurrentStepIndex] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [vocab, setVocab] = useState<string[]>(() =>
        buildEducationalVocabulary("hello world")
    );

    const charToIndex = useMemo(
        () => new Map(vocab.map((char, index) => [char, index])),
        [vocab]
    );

    const steps = useMemo<BuildStep[]>(() => {
        const entries: BuildStep[] = [];
        for (let i = 0; i < normalizedText.length - 1; i += 1) {
            const from = normalizedText[i];
            const to = normalizedText[i + 1];
            const row = charToIndex.get(from) ?? -1;
            const col = charToIndex.get(to) ?? -1;

            if (row >= 0 && col >= 0) {
                entries.push({ from, to, row, col, position: i });
            }
        }
        return entries;
    }, [charToIndex, normalizedText]);

    const activeStep =
        currentStepIndex >= 0 && currentStepIndex < steps.length
            ? steps[currentStepIndex]
            : null;

    const matrix = useMemo(() => {
        const nextMatrix = createZeroMatrix(vocab.length);
        const lastAppliedStep = Math.min(currentStepIndex, steps.length - 1);
        for (let i = 0; i <= lastAppliedStep; i += 1) {
            const step = steps[i];
            if (step) {
                nextMatrix[step.row][step.col] += 1;
            }
        }
        return nextMatrix;
    }, [currentStepIndex, steps, vocab.length]);

    const handleBuild = useCallback(() => {
        const normalized = normalizeToVocabulary(inputText);
        const nextVocab = buildEducationalVocabulary(normalized);
        setNormalizedText(normalized);
        setVocab(nextVocab);
        setCurrentStepIndex(-1);
        setIsPlaying(false);
    }, [inputText]);

    const applyNextStep = useCallback(() => {
        setCurrentStepIndex((prevIndex) => {
            const nextIndex = prevIndex + 1;
            if (nextIndex >= steps.length) {
                setIsPlaying(false);
                return prevIndex;
            }
            return nextIndex;
        });
    }, [steps]);

    const handleResetProgress = useCallback(() => {
        setCurrentStepIndex(-1);
        setIsPlaying(false);
    }, []);

    const handleInstantComplete = useCallback(() => {
        if (steps.length === 0 || currentStepIndex >= steps.length - 1) {
            return;
        }
        setCurrentStepIndex(steps.length - 1);
        setIsPlaying(false);
    }, [currentStepIndex, steps]);

    const skippedCharacters = useMemo(() => {
        const uniqueChars = new Set(normalizedText.split(""));
        return Math.max(0, uniqueChars.size - vocab.length);
    }, [normalizedText, vocab.length]);

    useEffect(() => {
        if (!isPlaying) {
            return;
        }
        if (steps.length === 0 || currentStepIndex >= steps.length - 1) {
            setIsPlaying(false);
            return;
        }

        const timer = window.setTimeout(() => {
            applyNextStep();
        }, ANIMATION_DELAY_MS);

        return () => window.clearTimeout(timer);
    }, [applyNextStep, currentStepIndex, isPlaying, steps.length]);

    return (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.03] p-4 md:p-6">
            <p className="text-center text-[15px] md:text-base text-white/55 leading-relaxed max-w-2xl mx-auto">
                {t("bigramBuilder.description")}
            </p>

            <div className="mt-6 max-w-2xl mx-auto">
                <textarea
                    value={inputText}
                    onChange={(event) => setInputText(event.target.value)}
                    rows={4}
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/85 outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/30 resize-y"
                    placeholder={t("bigramBuilder.placeholder")}
                />
                <p className="text-center text-xs text-white/35 mt-2">
                    {t("bigramBuilder.hint")}
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <button
                        type="button"
                        onClick={handleBuild}
                        className="px-4 py-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 text-xs font-mono uppercase tracking-wider hover:bg-emerald-500/15 transition-colors cursor-pointer"
                    >
                        {t("bigramBuilder.buttons.build")}
                    </button>
                    <button
                        type="button"
                        onClick={applyNextStep}
                        disabled={steps.length === 0 || currentStepIndex >= steps.length - 1}
                        className="px-4 py-2 rounded-lg border border-indigo-500/35 bg-indigo-500/10 text-indigo-300 text-xs font-mono uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-500/15 transition-colors cursor-pointer"
                    >
                        {t("bigramBuilder.buttons.next")}
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsPlaying((prev) => !prev)}
                        disabled={steps.length === 0 || currentStepIndex >= steps.length - 1}
                        className="px-4 py-2 rounded-lg border border-amber-500/35 bg-amber-500/10 text-amber-300 text-xs font-mono uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed hover:bg-amber-500/15 transition-colors cursor-pointer"
                    >
                        {isPlaying ? t("bigramBuilder.buttons.pause") : t("bigramBuilder.buttons.autoPlay")}
                    </button>
                    <button
                        type="button"
                        onClick={handleInstantComplete}
                        disabled={steps.length === 0 || currentStepIndex >= steps.length - 1}
                        className="px-4 py-2 rounded-lg border border-cyan-500/35 bg-cyan-500/10 text-cyan-300 text-xs font-mono uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cyan-500/15 transition-colors cursor-pointer"
                    >
                        {t("bigramBuilder.buttons.instant")}
                    </button>
                    <button
                        type="button"
                        onClick={handleResetProgress}
                        disabled={steps.length === 0}
                        className="px-4 py-2 rounded-lg border border-white/20 bg-white/[0.04] text-white/60 text-xs font-mono uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/[0.08] transition-colors cursor-pointer"
                    >
                        {t("bigramBuilder.buttons.reset")}
                    </button>
                </div>
            </div>

            <div className="mt-6 text-center">
                <p className="text-[11px] font-mono uppercase tracking-widest text-white/35">
                    {t("bigramBuilder.vocab")} ({vocab.length}/{MAX_EDUCATIONAL_VOCAB}):{" "}
                    {vocab.map(formatCharLabel).join(" ")}
                </p>
                <p className="text-sm text-white/45 mt-2">
                    {t("bigramBuilder.normalized")}{" "}
                    <span className="font-mono text-white/70">
                        {normalizedText.length > 0 ? normalizedText : t("bigramBuilder.empty")}
                    </span>
                </p>
                {skippedCharacters > 0 && (
                    <p className="text-xs text-amber-300/70 mt-2">
                        {t("bigramBuilder.skipped").replace("{max}", MAX_EDUCATIONAL_VOCAB.toString()).replace("{count}", skippedCharacters.toString())}
                    </p>
                )}
            </div>

            <div className="mt-4 text-center text-sm text-white/55">
                {activeStep ? (
                    <p>
                        {t("bigramBuilder.step1")} {currentStepIndex + 1} / {steps.length}:{" "}
                        <span className="font-mono text-emerald-300">
                            {formatCharLabel(activeStep.from)}
                        </span>{" "}
                        →{" "}
                        <span className="font-mono text-emerald-300">
                            {formatCharLabel(activeStep.to)}
                        </span>{" "}
                        {t("bigramBuilder.step2")}
                        <span className="font-mono text-indigo-300">
                            {formatCharLabel(activeStep.from)}
                        </span>
                        ,{" "}
                        <span className="font-mono text-indigo-300">
                            {formatCharLabel(activeStep.to)}
                        </span>
                        {t("bigramBuilder.step3")}
                    </p>
                ) : (
                    <p>
                        {t("bigramBuilder.pressBuild")}
                    </p>
                )}
            </div>

            <div className="mt-6 overflow-auto rounded-xl border border-white/10 bg-black/20">
                <table className="w-max min-w-full border-collapse text-[10px] font-mono">
                    <thead className="sticky top-0 z-10 bg-[#11131a]">
                        <tr>
                            <th className="px-2 py-2 text-white/60 border-b border-r border-white/10">
                                {t("bigramBuilder.table.curnxt")}
                            </th>
                            {vocab.map((colChar) => (
                                <th
                                    key={`col-${colChar}`}
                                    className="px-2 py-2 text-white/60 border-b border-r border-white/10"
                                >
                                    {formatCharLabel(colChar)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {matrix.map((row, rowIndex) => (
                            <tr key={`row-${vocab[rowIndex]}`}>
                                <th className="px-2 py-1.5 text-white/60 border-r border-b border-white/10 bg-[#11131a] sticky left-0">
                                    {formatCharLabel(vocab[rowIndex])}
                                </th>
                                {row.map((value, colIndex) => {
                                    const isActiveCell =
                                        activeStep?.row === rowIndex &&
                                        activeStep?.col === colIndex;
                                    return (
                                        <td
                                            key={`cell-${rowIndex}-${colIndex}`}
                                            className={`px-2 py-1.5 text-center border-r border-b border-white/10 transition-colors ${isActiveCell
                                                ? "bg-emerald-500/30 text-emerald-100 font-bold"
                                                : "text-white/70"
                                                }`}
                                        >
                                            {value}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
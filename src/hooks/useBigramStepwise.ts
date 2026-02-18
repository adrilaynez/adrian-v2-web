"use client";

import { useState, useCallback } from "react";
import type { StepwiseResponse } from "@/types/lmLab";
import { predictStepwise } from "@/lib/lmLabClient";

export function useBigramStepwise() {
    const [data, setData] = useState<StepwiseResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const predict = useCallback(async (text: string, steps: number) => {
        setLoading(true);
        setError(null);
        try {
            const res = await predictStepwise(text, steps);
            setData(res);
        } catch (err) {
            setError((err as Error).message || "Failed to predict");
            setData(null);
        } finally {
            setLoading(false);
        }
    }, []);

    return { data, loading, error, predict };
}

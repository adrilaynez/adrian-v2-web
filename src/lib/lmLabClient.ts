import type {
    VisualizeResponse,
    GenerateResponse,
    StepwiseResponse,
    NGramInferenceResponse,
    DatasetLookupResponse,
    MLPGridResponse,
    MLPTimelineResponse,
    MLPEmbeddingResponse,
    MLPEmbeddingQualityResponse,
    MLPGenerateResponse,
    MLPPredictResponse,
    MLPInternalsResponse,
} from "@/types/lmLab";

const BASE_URL =
    process.env.NEXT_PUBLIC_LM_LAB_API_URL ?? "";

const TIMEOUT_MS = 15_000;

class LmLabError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.name = "LmLabError";
        this.status = status;
    }
}

async function request<T>(
    path: string,
    body: Record<string, unknown>
): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
        const res = await fetch(`${BASE_URL}${path}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            signal: controller.signal,
        });

        if (!res.ok) {
            const text = await res.text().catch(() => "Unknown error");
            throw new LmLabError(text, res.status);
        }

        return (await res.json()) as T;
    } catch (err) {
        if (err instanceof LmLabError) throw err;
        if ((err as Error).name === "AbortError") {
            throw new LmLabError("Request timed out", 408);
        }
        throw new LmLabError(
            (err as Error).message || "Network error",
            0
        );
    } finally {
        clearTimeout(timer);
    }
}

async function requestGet<T>(
    path: string,
    params?: Record<string, string | number | undefined>
): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
        let url = `${BASE_URL}${path}`;
        if (params) {
            const sp = new URLSearchParams();
            for (const [k, v] of Object.entries(params)) {
                if (v !== undefined) sp.set(k, String(v));
            }
            const qs = sp.toString();
            if (qs) url += `?${qs}`;
        }

        const res = await fetch(url, {
            method: "GET",
            headers: { "Accept": "application/json" },
            signal: controller.signal,
        });

        if (!res.ok) {
            const text = await res.text().catch(() => "Unknown error");
            throw new LmLabError(text, res.status);
        }

        return (await res.json()) as T;
    } catch (err) {
        if (err instanceof LmLabError) throw err;
        if ((err as Error).name === "AbortError") {
            throw new LmLabError("Request timed out", 408);
        }
        throw new LmLabError(
            (err as Error).message || "Network error",
            0
        );
    } finally {
        clearTimeout(timer);
    }
}

// ─── Public API ──────────────────────────────────────────────────────────────

export function visualizeBigram(
    text: string,
    top_k: number
): Promise<VisualizeResponse> {
    return request<VisualizeResponse>(
        "/api/v1/models/bigram/visualize",
        { text, top_k }
    );
}

export function generateBigram(
    start_char: string,
    num_tokens: number,
    temperature: number
): Promise<GenerateResponse> {
    return request<GenerateResponse>(
        "/api/v1/models/bigram/generate",
        { start_char, num_tokens, temperature }
    );
}

export function predictStepwise(
    text: string,
    steps: number
): Promise<StepwiseResponse> {
    return request<StepwiseResponse>(
        "/api/v1/models/bigram/predict_stepwise",
        { text, steps }
    );
}

export function visualizeNgram(
    text: string,
    context_size: number,
    top_k: number
): Promise<NGramInferenceResponse> {
    return request<NGramInferenceResponse>(
        "/api/v1/models/ngram/visualize",
        { text, context_size, top_k }
    );
}

export function datasetLookup(
    context: string[],
    next_token: string
): Promise<DatasetLookupResponse> {
    return request<DatasetLookupResponse>(
        "/api/v1/models/ngram/dataset_lookup",
        { context, next_token }
    );
}

export function bigramDatasetLookup(
    context: string[],
    next_token: string
): Promise<DatasetLookupResponse> {
    return request<DatasetLookupResponse>(
        "/api/v1/models/bigram/dataset_lookup",
        { context, next_token }
    );
}

export function ngramStepwise(
    text: string,
    steps: number,
    context_size: number
): Promise<StepwiseResponse> {
    return request<StepwiseResponse>(
        "/api/v1/models/ngram/predict_stepwise",
        { text, steps, context_size }
    );
}

export function generateNgram(
    start_char: string,
    num_tokens: number,
    temperature: number,
    context_size: number
): Promise<GenerateResponse> {
    return request<GenerateResponse>(
        "/api/v1/models/ngram/generate",
        { start_char, num_tokens, temperature, context_size }
    );
}

// ─── MLP Grid API ────────────────────────────────────────────────────────────

export function fetchMLPGrid(): Promise<MLPGridResponse> {
    return requestGet<MLPGridResponse>("/api/v1/mlp-grid");
}

export function predictMLP(
    embedding_dim: number,
    hidden_size: number,
    learning_rate: number,
    text: string,
    top_k: number = 10
): Promise<MLPPredictResponse> {
    return request<MLPPredictResponse>(
        "/api/v1/mlp-grid/predict",
        { embedding_dim, hidden_size, learning_rate, text, top_k }
    );
}

export function generateMLP(
    embedding_dim: number,
    hidden_size: number,
    learning_rate: number,
    seed_text: string,
    max_tokens: number,
    temperature: number
): Promise<MLPGenerateResponse> {
    return request<MLPGenerateResponse>(
        "/api/v1/mlp-grid/generate",
        { embedding_dim, hidden_size, learning_rate, seed_text, max_tokens, temperature }
    );
}

export function fetchMLPTimeline(
    embedding_dim: number,
    hidden_size: number,
    learning_rate: number
): Promise<MLPTimelineResponse> {
    return requestGet<MLPTimelineResponse>(
        "/api/v1/mlp-grid/timeline",
        { embedding_dim, hidden_size, learning_rate }
    );
}

export function fetchMLPEmbedding(
    embedding_dim: number,
    hidden_size: number,
    learning_rate: number,
    snapshot_step?: number
): Promise<MLPEmbeddingResponse> {
    const params: Record<string, string | number | undefined> = {
        embedding_dim,
        hidden_size,
        learning_rate,
    };
    if (snapshot_step !== undefined) {
        params.snapshot_step = `step_${snapshot_step}`;
    }
    return requestGet<MLPEmbeddingResponse>(
        "/api/v1/mlp-grid/embedding",
        params
    );
}

export function fetchMLPEmbeddingQuality(
    embedding_dim: number,
    hidden_size: number,
    learning_rate: number,
    snapshot_step?: number
): Promise<MLPEmbeddingQualityResponse> {
    const params: Record<string, string | number | undefined> = {
        embedding_dim,
        hidden_size,
        learning_rate,
    };
    if (snapshot_step !== undefined) {
        params.snapshot_step = `step_${snapshot_step}`;
    }
    return requestGet<MLPEmbeddingQualityResponse>(
        "/api/v1/mlp-grid/embedding-quality",
        params
    );
}

export function fetchMLPInternals(
    embedding_dim: number,
    hidden_size: number,
    learning_rate: number,
    text: string,
    top_k = 10
): Promise<MLPInternalsResponse> {
    return request<MLPInternalsResponse>(
        "/api/v1/mlp-grid/internals",
        { embedding_dim, hidden_size, learning_rate, text, top_k }
    );
}

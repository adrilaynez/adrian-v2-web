import axios, { AxiosInstance, AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://lm-lab.onrender.com/api/v1";

export const apiClient: AxiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.code === "ERR_NETWORK") {
            return Promise.reject(new Error("Conexión fallida: ¿Está encendido el servidor FastAPI?"));
        }
        return Promise.reject(error.response?.data || error);
    }
);

export interface Model {
    id: string;
    name: string;
    type: "bigram" | "ngram" | "mlp" | "transformer";
    description: string;
    status: "ready" | "loading" | "error";
    metadata?: Record<string, any>;
}

export const lmApi = {
    // Lista los modelos disponibles
    getModels: async (): Promise<Model[]> => {
        try {
            const response = await apiClient.get<Model[]>("/models");
            return response.data;
        } catch (err) {
            console.warn("Usando modelos por defecto (backend no respondió /models)");
            return [
                { id: "bigram-v1", name: "Bigram Explorer", type: "bigram", description: "Análisis de primer orden y matrices de transición.", status: "ready" },
                { id: "ngram-v1", name: "N-Gram Lab", type: "ngram", description: "Estudio de contextos variables y explosión combinatoria.", status: "ready" },
                { id: "mlp-v1", name: "MLP Neural", type: "mlp", description: "Representaciones densas y perceptrones multicapa.", status: "loading" },
            ];
        }
    },

    // Visualización Bigram/N-Gram
    visualize: async (modelType: string, text: string, contextSize: number = 1) => {
        const path = modelType === 'bigram' ? '/models/bigram/visualize' : '/models/ngram/visualize';
        const body = modelType === 'bigram' ? { text } : { text, context_size: contextSize };
        const response = await apiClient.post(path, body);
        return response.data;
    },

    // Generación de texto
    generate: async (modelId: string, prompt: string, numTokens: number = 50, temperature: number = 1.0) => {
        // Nota: Ajustamos el path según la estructura esperada por el usuario
        const response = await apiClient.post(`/models/${modelId}/generate`, {
            prompt,
            num_tokens: numTokens,
            temperature
        });
        return response.data;
    }
};

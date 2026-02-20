export interface Prediction {
    token: string;
    probability: number;
}

export interface TransitionMatrixViz {
    shape: number[];
    data: number[][];
    row_labels: string[];
    col_labels: string[];
}

export interface TrainingViz {
    loss_history: number[];
    final_loss: number;
    training_steps: number;
    batch_size: number;
    learning_rate: number;
    total_parameters: number;
    trainable_parameters: number;
    raw_text_size: number;
    train_data_size: number;
    val_data_size: number;
    unique_characters: number;
}

export interface ArchitectureViz {
    name: string;
    description: string;
    complexity: string;
    type: string;
    how_it_works: string[];
    strengths: string[];
    limitations: string[];
    use_cases: string[];
}

export interface VisualizationData {
    transition_matrix: TransitionMatrixViz;
    training: TrainingViz;
    architecture: ArchitectureViz;
}

export interface VisualizeResponse {
    model_id: string;
    model_name: string;
    input: {
        text: string;
        token_ids: number[];
    };
    predictions: Prediction[];
    full_distribution: number[];
    visualization: VisualizationData;
    historical_context?: HistoricalContext;
    metadata: {
        inference_time_ms: number;
        device: string;
        vocab_size: number;
    };
}

export interface GenerateResponse {
    model_id: string;
    generated_text: string;
    length: number;
    temperature: number;
    start_char: string;
    metadata: {
        inference_time_ms: number;
        device: string;
        vocab_size: number;
    };
}

export interface StepDetail {
    step: number;
    char: string;
    probability: number;
}

export interface StepwiseResponse {
    model_id: string;
    input_text: string;
    steps: StepDetail[];
    final_prediction: string;
    metadata: {
        inference_time_ms: number;
        device: string;
        vocab_size: number;
    };
}

// ============ N-Gram Visualization ============

export interface HistoricalContext {
    description: string;
    limitations: string[];
    modern_evolution: string;
}

export interface NGramTrainingInfo {
    total_tokens: number;
    unique_chars: number;
    unique_contexts: number;
    context_space_size: number;
    context_utilization: number;
    sparsity: number;
    transition_density: number;
    loss_history?: number[];
    final_loss?: number;
    perplexity?: number;
}

export interface NGramDiagnostics {
    vocab_size: number;
    context_size: number;
    estimated_context_space: number;
    sparsity?: number;
    observed_contexts?: number;
    context_utilization?: number;
    perplexity?: number;
}

export interface ActiveSlice {
    context_tokens: string[];
    matrix: TransitionMatrixViz;
    next_token_probs: Record<string, number>;
}

export interface NGramInferenceResponse {
    model_id: string;
    model_name: string;
    context_size: number;
    input: {
        text: string;
        token_ids: number[];
    };
    predictions: Prediction[];
    full_distribution: number[];
    visualization: {
        transition_matrix: TransitionMatrixViz | null;
        active_slice: ActiveSlice | null;
        context_distributions?: Record<string, {
            context: string;
            probabilities: number[];
            row_labels?: string[];
        }> | null;
        training: NGramTrainingInfo;
        diagnostics: NGramDiagnostics;
        architecture: ArchitectureViz;
        historical_context: HistoricalContext;
    };
    metadata: {
        inference_time_ms: number;
        device: string;
        vocab_size: number;
    };
}

export interface DatasetLookupResponse {
    query: string;
    count: number;
    examples: string[];
    source: string;
}

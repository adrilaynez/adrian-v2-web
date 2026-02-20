import re

new_text = """    bigramNarrative: {
        hero: {
            eyebrow: "Understanding Language Models",
            titlePrefix: "The Bigram",
            titleSuffix: "Model",
            description: "A first-principles exploration of the simplest statistical language model — and why it still matters."
        },
        problem: {
            title: "The Problem of Prediction",
            lead: "Language is fundamentally sequential. Every word you read right now is informed by the words that came before it.",
            p1: "This property — that each token in a sequence carries ",
            p1Highlight: "expectations about what follows",
            p2: " — is what makes language both expressive and predictable. It's also what makes it so hard to model computationally.",
            p3: "The central challenge of language modeling is deceptively simple to state:",
            quote: "Given what we have already seen, what should come next?",
            p4: "This question has driven decades of research in ",
            h1: "computational linguistics",
            h2: "information theory",
            h3: "deep learning",
            p5: ". To build a model that can answer it, we need a way to capture the statistical structure of language. Let's start with the simplest possible approach.",
            label: "Foundation"
        },
        coreIdea: {
            label: "Core Idea",
            title: "The Simplest Statistical Idea",
            lead: "What if, instead of trying to understand meaning, we simply observed patterns?",
            p1: "Specifically: ",
            h1: "how often does one character follow another?",
            p2: " This is the core insight behind the Bigram model. It ignores grammar, semantics, and long-range dependencies entirely. It asks only one question: given the current token, what is the probability distribution over the next token?",
            caption: "The Bigram assumption: the next token depends only on the current one.",
            p3: "We model P(x_{t+1} | x_t) — the chance of seeing a particular next token given only the token we just observed. Nothing more, nothing less. This radical simplification is what makes the model both tractable and limited.",
            calloutTitle: "Key Insight",
            calloutP1: "The \\"bi\\" in Bigram means ",
            calloutH1: "two",
            calloutP2: ". The model considers pairs of tokens — the current one and the next one. It has zero memory of anything before the current token."
        },
        mechanics: {
            label: "Mechanics",
            title: "Building a Transition Table",
            lead: "To learn these probabilities, the model scans through a training corpus and counts every pair of consecutive tokens.",
            p1: "For each token A, it records how often each possible token B appears immediately after it. These counts form a ",
            h1: "matrix",
            p2: " — a two-dimensional table where rows represent the current token and columns represent the next token. Each cell holds the number of times that specific transition was observed in the training data.",
            p3: "The visualization below is a live rendering of this transition matrix. Brighter cells indicate more frequent pairings — patterns the model has learned from real text.",
            calloutTitle: "Reading the Matrix",
            calloutP1: "Each row represents a \\"given\\" character. Each column represents a \\"next\\" character. The brightness of a cell encodes how likely that transition is. Notice how some rows are nearly uniform (the model is unsure) while others have sharp peaks (strong preferences)."
        },
        normalization: {
            label: "Normalization",
            title: "From Counts to Probabilities",
            lead: "Raw counts alone don't tell us much. To make predictions, we need to convert them into probabilities.",
            p1: "We do this by ",
            h1: "normalizing each row",
            p2: " of the count matrix — dividing every count by the total number of transitions from that row's token. After normalization, each row sums to 1.0, forming a valid probability distribution.",
            p3: "The model can now make concrete statements: \\"After the letter h, there is a 32% chance the next character is e, a 15% chance it's a, and so on.\\"",
            p4: "Try it yourself below. Type any text to see what the model predicts will come next — based ",
            h2: "solely on the very last character",
            p5: " of your input."
        },
        sampling: {
            label: "Sampling",
            title: "Generating New Text",
            lead: "Once we have a probability distribution, we can do something remarkable: generate entirely new text.",
            p1: "The process is called ",
            h1: "autoregressive sampling",
            p2: ". Start with a seed character, sample the next one from its probability distribution, then use that new character as the seed for the next step. Repeat indefinitely.",
            calloutTitle: "Temperature",
            calloutP1: "The ",
            calloutH1: "temperature",
            calloutP2: " parameter controls how \\"creative\\" the generation is. At ",
            calloutH2: "low temperatures",
            calloutP3: ", the model almost always picks the most likely next token. At ",
            calloutH3: "high temperatures",
            calloutP4: ", it samples more uniformly — producing surprising and often nonsensical output.",
            p3: "Generate some text below and observe how a model with ",
            h2: "only one character of memory",
            p4: " produces output that is statistically plausible at the character level, yet meaningless at any higher level."
        },
        reflection: {
            label: "Reflection",
            title: "Power and Limitations",
            lead: "The Bigram model is powerful precisely because of its simplicity.",
            p1: "It requires very few parameters — just a V × V matrix, where V is the vocabulary size. It trains instantly. And it provides a clear ",
            h1: "probabilistic baseline",
            p2: " for language generation that every more sophisticated model must beat.",
            calloutTitle: "The Fundamental Limitation",
            calloutP1: "The model has ",
            calloutH1: "no memory beyond a single token",
            calloutP2: ". It cannot learn that \\"th\\" is often followed by \\"e\\", because by the time it sees \\"h\\", it has already forgotten the \\"t\\". It captures local co-occurrence but nothing about words, phrases, or meaning.",
            p3: "This limitation is exactly what motivates the progression to more sophisticated architectures: ",
            h2: "N-grams",
            p4: " extend the context window, ",
            h3: "MLPs",
            p5: " learn dense representations, and ",
            h4: "Transformers",
            p6: " attend to the entire sequence at once.",
            quote: "Each model in this lab builds on the same core question: given context, what comes next?"
        },
        tokens: {
            title: "Representing text",
            lead: "We split text into tokens.",
            charTitle: "Characters:",
            charDesc: "small vocab, easy to see.",
            wordTitle: "Words:",
            wordDesc: "richer, huge vocab.",
            note: "We use characters here.",
            charLevelTitle: "Character-level tokens",
            charLevelBody: "Small vocabulary, easy to visualize.",
            wordLevelTitle: "Word-level tokens",
            wordLevelBody: "More expressive; vocabulary can be huge."
        },
        counting: {
            title: "The Bigram idea",
            lead: "Count pairs: current -> next. More counts = more likely.",
            builderTitle: "Step-by-step builder",
            builderDesc: "Walk through text; each pair adds +1 to a cell."
        },
        matrix: {
            title: "The transition table",
            lead: "Rows = current token, columns = next.",
            desc: "Build below, then see the full matrix."
        },
        probabilities: {
            title: "Counts to probabilities",
            lead: "Normalize each row to 100%.",
            desc: "Model reads last token's row and samples the next.",
            overlayTitle: "Counts -> Probabilities -> Sampling",
            overlayDesc: "Pick token, normalize row, sample next.",
            step1: "1) Row values",
            step2: "2) Normalize",
            step3: "3) Sample next token",
            currentToken: "Current token",
            typeChar: "Type a character",
            normalizeSimple: "Simple normalize",
            softmax: "Softmax",
            sampleNext: "Sample next token",
            mostLikely: "Most likely:",
            remaining: "Remaining:",
            stochastic: "Sampling is random."
        },
        limitations: {
            title: "Limitations",
            lead: "Bigram has no memory—only the last token.",
            desc: "No long context. Hence N-grams and neural nets."
        },
        footer: {
            text: "Continue exploring the other models in the lab to see how each one addresses the limitations of its predecessor.",
            brand: "LM-Lab · Educational Mode"
        }
    }"""

def update_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find where bigramNarrative starts
    match = re.search(r'^[ \t]*bigramNarrative:\s*\{', content, flags=re.MULTILINE)
    if not match:
        print(f"Could not find bigramNarrative in {filepath}")
        return

    start_idx = match.start()
    
    # Simple brace matching to find end_idx
    brace_count = 0
    in_block = False
    end_idx = start_idx
    
    for i in range(start_idx, len(content)):
        if content[i] == '{':
            brace_count += 1
            in_block = True
        elif content[i] == '}':
            brace_count -= 1
            if in_block and brace_count == 0:
                end_idx = i + 1
                break
                
    # Extract the block to replace
    old_block = content[start_idx:end_idx]
    
    # We replace but match the original file's newline style if we can, or just use python replace
    new_content = content[:start_idx] + new_text + content[end_idx:]
    
    with open(filepath, 'w', encoding='utf-8', newline="") as f:
        f.write(new_content)
    
    print(f"Updated {filepath}")

update_file('src/i18n/en.ts')
update_file('src/i18n/es.ts')

import { TranslationDictionary } from './types';

export const es: TranslationDictionary = {
    common: {
        language: "Idioma",
        loading: "Cargando...",
        error: "Error",
        comingSoon: "Próximamente",
        backToProjects: "Volver a Proyectos",
        toggleLanguage: "Cambiar idioma",
        code: "Código",
        liveDemo: "Demo en Vivo",
        viewCaseStudy: "Ver Caso de Estudio",
    },
    nav: {
        home: "Inicio",
        projects: "Proyectos",
        lab: "Laboratorio",
        notes: "Notas",
    },
    projects: {
        hero: {
            badge: "Investigación y Desarrollo",
            titlePrefix: "Construyendo la",
            titleSuffix: "Frontera Digital.",
            description: "Una colección curada de mi trabajo en sistemas distribuidos, infraestructura de IA y computación de alto rendimiento.",
        },
        flagship: {
            badge: "Proyecto Insignia",
            featured: "Destacado",
            liveDemo: "Demo en Vivo Disponible",
            title: "LM-Lab",
            description: "Una plataforma interactiva para explorar arquitecturas de modelos de lenguaje desde primeros principios. Visualiza matrices de transición, sondea dinámicas de inferencia y genera texto — todo impulsado por un backend FastAPI en vivo con PyTorch.",
            highlights: {
                inference: {
                    title: "Inferencia en Vivo",
                    desc: "Predicción del siguiente carácter en tiempo real con distribuciones de probabilidad",
                },
                matrix: {
                    title: "Matriz de Transición",
                    desc: "Mapa de calor interactivo de las probabilidades bigrama aprendidas",
                },
                generation: {
                    title: "Generación de Texto",
                    desc: "Genera texto con temperatura configurable y seguimiento paso a paso",
                },
            },
            cta: {
                explorer: "Abrir Laboratorio",
                architecture: "Ver Arquitectura",
                demo: "Ejecutar Demo Interactiva",
            },
        },
        experiments: {
            title: "Experimentos Seleccionados",
            items: {
                distriKv: {
                    title: "Distri-KV",
                    desc: "Un almacén clave-valor distribuido implementado en Go, con consenso Raft y sharding.",
                },
                neuroVis: {
                    title: "NeuroVis",
                    desc: "Herramienta de visualización interactiva para activaciones de redes neuronales en tiempo real.",
                },
                autoAgent: {
                    title: "Auto-Agent",
                    desc: "Un framework de agente autónomo ligero enfocado en tareas de codificación.",
                },
            },
        },
    },
    notes: {
        hero: {
            est: "EST. 2024",
            archive: "ARCHIVO DE INVESTIGACIÓN",
            titlePrefix: "El Cuaderno de",
            titleSuffix: "Ingeniería",
            description: "Exploraciones en <strong class='text-primary'>inteligencia distribuida</strong>, topología de alta dimensión y la mecánica del software moderno.",
        },
        featured: {
            badge: "ÚLTIMA INVESTIGACIÓN",
            readTime: "{minutes} min de lectura",
            figure: "Figura 1.0: Visualización del Espacio Latente",
        },
        grid: {
            title: "Entradas Anteriores",
        },
        backToNotes: "Volver a Notas",
        noteNotFound: "Nota no encontrada",
    },
    lab: {
        bigram: "Bigrama",
        ngram: "N-Gram",
        mlp: "MLP",
        transformer: "Transformer",
        neuralNetworks: "Redes Neuronales",
        shell: {
            allModels: "Volver al Lab",
        },
        active: "Lab. Activo",
        waking: "Despertando",
        serverWarning: {
            title: "ARRANQUE EN FRÍO DETECTADO",
            subtitle: "PROTOCOLO DE CONTENCIÓN ACTIVO",
            message: "El servidor está despertando de su hibernación. Las instancias gratuitas de Render se apagan tras inactividad — sí, lo hosteo en un servidor gratis porque soy un estudiante sin un duro.",
            donate: "Si la espera de 30s te resulta insoportable, invítame a un café para que pueda pagar un servidor de verdad. O simplemente espera, es entretenimiento gratis.",
            status: "INTENTANDO CONEXIÓN",
            dismiss: "SOBREVIVIRÉ",
            connected: "SEÑAL ADQUIRIDA",
        },
        mode: {
            educational: "Educativo",
            educationalDescription: "Experiencia guiada con explicaciones narrativas y progresivas.",
            freeLab: "Lab Libre",
            freeLabDescription: "Acceso completo a herramientas y visualizaciones para experimentación manual y análisis.",
            selectViewingMode: "Selecciona el Modo de Visualización",
            availableModels: "Modelos Disponibles",
        },
        status: {
            ready: "Listo",
            coming: "Próximo",
        },
        models: {
            bigram: {
                name: "Explorador Bigrama",
                description: "Análisis de primer orden y matrices de transición.",
            },
            ngram: {
                name: "Laboratorio N-Gram",
                description: "Contextos variables y explosión combinatoria.",
            },
            mlp: {
                name: "MLP Neural",
                description: "Representaciones densas y perceptrones neuronales.",
            },
            transformer: {
                name: "Transformer",
                description: "Mecanismos de atención y arquitectura LLM moderna.",
            },
        },
        dashboard: {
            chip: "Laboratorio de Interpretabilidad de Modelos",
            suite: "Suite",
            description1: "Explora el funcionamiento interno de los modelos de lenguaje mediante visualizaciones interactivas.",
            description2: "Sigue una ruta guiada o experimenta libremente en el sandbox.",
            launchUnit: "INICIAR UNIDAD",
            secureLock: "BLOQUEO SEGURO",
            footerCopyright: "© 2026 LM-LAB INSTRUMENTS",
            footerSystem: "SISTEMA_INTERPRETABILIDAD",
            secureConnection: "Conexión Segura",
            hardwareMock: "Hardware: v4-8 TPU MOCK",
        },
        placeholders: {
            mlp: {
                title: "Explorador MLP",
                description: "Explorador de modelos de lenguaje Multi-Layer Perceptron. Actualmente en desarrollo - vuelve pronto.",
            },
            transformer: {
                title: "Explorador Transformer",
                description: "Explorador de modelos transformer basados en atención. Actualmente en desarrollo - vuelve pronto.",
            },
        },
        landing: {
            hero: {
                badge: "Unidad de Investigación",
                subtitle: "Laboratorio de Interpretabilidad Interactiva",
                description: "Desmitificando los Modelos de Lenguaje a través de la ingeniería de primeros principios y evidencia visual.",
                subDescription: "Esta unidad se centra en la interpretabilidad mecanística: la ingeniería inversa de los pesos neuronales en conceptos humanos comprensibles.",
                start: "Inicializar Modelo Base",
                recommended: "Recomendado para principiantes",
            },
            highlights: {
                visualizations: "Visualización Interactiva",
                inference: "Inferencia en Vivo",
                guided: "Ruta Guiada",
                backend: "Backend PyTorch",
            },
            learningPath: {
                title: "Ruta de Aprendizaje",
                status: {
                    soon: "En Desarrollo",
                    ready: "Unidad Activa",
                },
            },
            modes: {
                title: "Protocolos de Laboratorio",
                educational: {
                    title: "Modo Educativo",
                    subtitle: "Descubrimiento Guiado",
                    description: "Narrativa paso a paso que explica el 'porqué' detrás de las matemáticas. Ideal para el aprendizaje conceptual.",
                },
                freeLab: {
                    title: "Modo Lab Libre",
                    subtitle: "Entorno Sandbox",
                    description: "Acceso total a todas las herramientas de visualización y parámetros de generación. Para experimentación avanzada.",
                },
            },
            availableModels: {
                title: "Unidades Biológicas Disponibles",
                enter: "Entrar al Lab",
                locked: "Protocolo Restringido",
            },
            footer: {
                text: "Instrumento Científico v2.2 // Build 2026",
            },
        },
    },
    footer: {
        builtBy: "Construido por",
        sourceAvailable: "El código fuente está disponible en",
    },
    datasetExplorer: {
        title: "Evidencia del Corpus",
        subtitle: "¿Por qué el modelo aprendió '{context}' -> '{next}'?",
        scanning: "Escaneando corpus de entrenamiento...",
        occurrencesFound: "Ocurrencias Encontradas",
        source: "Fuente",
        contextSnippets: "Fragmentos de Contexto",
        noExamples: "No se encontraron ejemplos para esta transición.",
        fetchError: "No se pudieron obtener ejemplos del dataset",
        explorerTitle: "Explorador del Corpus",
        searching: "Buscando en el Dataset...",
        querySequence: "Secuencia Consultada",
        found: "Se encontraron {count} ocurrencias",
        exampleContexts: "Contextos de Ejemplo",
        noExamplesValidation: "No se encontraron ejemplos en el fragmento de validación.",
    },
    training: {
        title: "Insight del Entrenamiento",
        noData: "Ejecuta inferencia para ver datos de entrenamiento",
        tooltip: {
            lossTitle: "¿Qué es la Pérdida (Loss)?",
            lossErrorPrefix: "Error de Predicción:",
            lossError: "La pérdida mide cuán 'sorprendido' está el modelo. Una pérdida alta significa que adivina mal frecuentemente.",
            lossBenchmarkPrefix: "El Referente:",
            lossBenchmark: "Adivinar al azar daría una pérdida de ~4.56 (-ln(1/96)). ¡Cualquier valor menor significa que el modelo ha aprendido algo!",
            lossCurve: "La curva descendente muestra al modelo descubriendo patrones lentamente en tu texto.",
        },
        stats: {
            finalLoss: "Pérdida Final",
            steps: "Pasos",
            batchSize: "Tamaño de Lote",
            learningRate: "Ratio de Aprendizaje",
            parameters: "Parámetros",
            tooltips: {
                finalLoss: "El nivel de error. Al final del entrenamiento, debería ser lo más bajo posible.",
                steps: "Cuántas veces el modelo practicó para mejorar sus predicciones.",
                batchSize: "La cantidad de piezas de información que el modelo procesa a la vez.",
                learningRate: "La velocidad de aprendizaje. Ni muy rápido para no pasarse, ni muy lento para no tardar demasiado.",
                parameters: "El tamaño de la red neuronal o 'cerebro' del modelo.",
            },
        },
    },
    ngram: {
        training: {
            title: "Insights del Entrenamiento",
            stats: {
                totalTokens: "Tokens Totales",
                uniqueContexts: "Contextos Únicos",
                utilization: "Utilización de Contexto",
                sparsity: "Espasidad",
                transitionDensity: "Densidad de Transición",
                subs: {
                    possiblePrefix: "de",
                    possibleSuffix: "posibles",
                    fractionObserved: "Fracción de contextos observados",
                    unseen: "Fracción de contexto no visto",
                },
            },
        },
    },
    landing: {
        hero: {
            status: "Sistema Online :: v2.2",
            role: "Investigación e Ingeniería",
            title: "ADRIAN LAYNEZ ORTIZ",
            tagline1: "Matemáticas e Informática.",
            tagline2: "Interpretabilidad Mecanística · Ingeniería de Alto Rendimiento.",
            cta: {
                lab: "Ver Laboratorio",
                notes: "Leer Notas",
            },
        },
        metrics: {
            research: "Años de Investigación",
            repos: "Repos Open Source",
            projects: "Proyectos Activos",
            curiosity: "Curiosidad",
        },
        about: {
            badge: "Sobre Mí",
            building: "Desarrollando",
            projectTitle: "Motor de Deep Learning — CUDA / C++",
            projectDesc: "Kernels personalizados para operaciones matriciales y retropropagación",
            bio: {
                titlePrefix: "Uniendo Matemáticas Abstractas",
                titleSuffix: "e Inteligencia Artificial",
                p1: "Estudio el Doble Grado en <strong class='text-foreground'>Matemáticas e Ingeniería Informática</strong> en la Universidad Complutense de Madrid. Mi investigación se centra en comprender las redes neuronales a su nivel más profundo — desde la dinámica de gradientes hasta la optimización a nivel de kernel.",
                p2: "Me especializo en <strong class='text-foreground'>Interpretabilidad Mecanística</strong> — la ciencia de realizar ingeniería inversa sobre cómo las redes neuronales representan y procesan la información internamente. En lugar de tratar los modelos como cajas negras, descompongo sus circuitos para entender <em class='text-foreground/80'>por qué funcionan</em>.",
                mission: "Mi misión: hacer los sistemas de IA transparentes a través de un análisis matemático riguroso e ingeniería de bajo nivel.",
            },
        },
        skills: {
            title: "Competencias Técnicas",
            linearAlgebra: "Álgebra Lineal",
            topology: "Topología",
            convexOpt: "Optimización Convexa",
        },
        work: {
            badge: "Trabajo Seleccionado",
            titlePrefix: "Ingeniería desde",
            titleSuffix: "Primeros Principios",
            description: "Cada proyecto comienza con una pregunta. Desde reimplementar papers seminales hasta escribir kernels de GPU desde cero, cada uno es un ejercicio de comprensión profunda.",
            viewAll: "Ver Todos los Proyectos",
            items: {
                nanoTransformer: {
                    title: "Nano-Transformer",
                    desc: "Reproducción desde cero de 'Attention Is All You Need' en PyTorch — Multi-Head Attention, Positional Encodings y LayerNorm implementados sin módulos preconstruidos.",
                },
                cudaKernels: {
                    title: "Kernels Matriciales CUDA",
                    desc: "Kernels de CUDA escritos a mano explorando la optimización SGEMM — desde implementaciones ingenuas hasta estrategias de memoria compartida en mosaico, comparadas con cuBLAS.",
                },
                autograd: {
                    title: "Motor Autograd",
                    desc: "Librería ligera de diferenciación automática en modo inverso. Construye dinámicamente grafos de computación y propaga gradientes mediante la regla de la cadena.",
                },
                mathDl: {
                    title: "Matemáticas del Deep Learning",
                    desc: "Artículos interactivos explorando la teoría rigurosa detrás de la IA moderna — análisis de convergencia SGD, el álgebra lineal de LoRA y geometría diferencial en variedades neuronales.",
                },
                distributed: {
                    title: "Inferencia Distribuida",
                    desc: "Exploraciones arquitectónicas en entrenamiento paralelo de datos, fragmentación de modelos y tuberías de inferencia optimizadas para redes neuronales a gran escala.",
                },
            },
        },
        contact: {
            badge: "Abierto a Oportunidades",
            titlePrefix: "Construyamos",
            titleMiddle: "Algo",
            titleSuffix: "Juntos",
            description: "Ya sea una colaboración de investigación, una oportunidad de pasantía o simplemente una conversación sobre las matemáticas de la inteligencia — me encantaría saber de ti.",
            email: "Contactar",
            github: "Perfil de GitHub",
        },
    },
    models: {
        bigram: {
            title: "Modelo de Lenguaje Bigrama",
            description: "El bloque fundamental del modelado de secuencias. Un modelo probabilístico que predice el siguiente carácter basándose únicamente en el predecesor inmediato.",
            params: "Parámetros",
            vocab: "Vocabulario",
            trainingData: "Datos de Entrenamiento",
            loss: "Pérdida Final",
            unknown: "Desconocido",
            tooltips: {
                params: "Son como las conexiones del cerebro. Este modelo es simple, por lo que no necesita muchas.",
                vocab: "Es el conjunto de letras y símbolos que el modelo conoce, como su propio alfabeto.",
                trainingData: "La cantidad de texto que el modelo leyó para aprender a escribir.",
                loss: "Es la puntuación de 'error'. Cuanto más baja sea, mejor sabe el modelo qué letra viene a continuación.",
            },
            sections: {
                visualization: {
                    title: "Visualización: Matriz de Transición",
                    description: "Aquí es donde vive el 'conocimiento' del modelo. Para un modelo Bigrama, esta cuadrícula representa qué letras suelen seguir a otras."
                },
                inference: {
                    title: "Inferencia y Generación",
                    description: "Interactúa con el modelo en tiempo real. Observa cómo 'adivina' el siguiente carácter basándose en probabilidades aprendidas."
                },
                architecture: {
                    title: "Arquitectura del Modelo",
                    description: "Una mirada técnica a las 'neuronas' y capas que procesan la información."
                },
                training: {
                    title: "Insights de Entrenamiento",
                    description: "Observando el proceso de aprendizaje. Estas métricas muestran cómo el modelo optimizó sus parámetros reduciendo el error de predicción (pérdida) durante 5000 iteraciones."
                },
            },
            hero: {
                scientificInstrument: "Instrumento Científico v1.0",
                explanationButton: "¿Necesitas una explicación intuitiva?",
                explanationSub: "Entiende la idea central antes de sumergirte en las matemáticas y visualizaciones.",
            },
            matrix: {
                title: "Matriz de Transición",
                activeSlice: "Transición de Slice Activo",
                tryIt: {
                    label: "Pruébalo:",
                    text: "Haz clic en cualquier celda coloreada para ver",
                    highlight: "ejemplos reales de entrenamiento",
                },
                searchPlaceholder: "Resaltar carácter…",
                runInference: "Ejecuta inferencia para generar la matriz de transición",
                tooltip: {
                    title: "¿Cómo leer este gráfico?",
                    desc: "Las filas representan el carácter actual y las columnas el siguiente carácter. Las celdas más brillantes indican mayor probabilidad de transición.",
                    rows: "Filas (Y):",
                    rowsDesc: "La letra que el modelo acaba de escribir.",
                    cols: "Columnas (X):",
                    colsDesc: "La letra que el modelo intenta adivinar.",
                    brightness: "Brillo:",
                    brightnessDesc: "Cuanto más brillante sea un cuadrado, más probable es que ese par de letras aparezca en el texto.",
                    example: "Ejemplo: Si la fila es 'q' y la columna 'u' brilla intensamente, significa que el modelo sabe que después de 'q' casi siempre viene 'u'.",
                },
                slice: "Slice:",
                datasetMeta: {
                    learnedFrom: "Aprendido de",
                    summarizes: "resume",
                    rawChars: "caracteres brutos",
                    inTrain: "en el split de entrenamiento",
                    vocab: "a través de",
                    symbols: "símbolos únicos",
                    corpus: "Nombre del Corpus:",
                    rawText: "Texto Bruto Total:",
                    trainingSplit: "Datos de Entrenamiento:",
                    vocabulary: "Tamaño del Vocabulario:",
                    charTokens: "caracteres",
                },
            },
            inference: {
                title: "Consola de Inferencia",
                probDist: "1. Distribución de Probabilidad",
                probDistDesc: "Escribe una frase para ver los top-k caracteres más probables a continuación.",
                tooltip: {
                    title: "¿Qué es la Inferencia?",
                    process: "El Proceso:",
                    processDesc: "El modelo toma tu texto, mira el",
                    processHighlight: "último carácter",
                    processEnd: ", y busca las probabilidades de lo que viene después en su cerebro (la Matriz).",
                    topK: "Top-K:",
                    topKDesc: "Solo mostramos los ganadores principales. Si K=5, ves los 5 candidatos más probables.",
                    note: "Nota: Este modelo es \"determinista\" en sus probabilidades pero \"estocástico\" (aleatorio) cuando realmente elige un carácter para generar texto.",
                },
                form: {
                    input: "Texto de Entrada",
                    placeholder: "Escribe texto para analizar...",
                    topK: "Predicciones Top-K",
                    analyze: "Analizar",
                    analyzing: "Analizando...",
                },
            },
            stepwise: {
                title: "Predicción Paso a Paso",
                mainTitle: "2. Predicción Paso a Paso",
                description: "Observa al modelo predecir una secuencia carácter por carácter.",
                form: {
                    input: "Texto de Entrada",
                    placeholder: "Texto inicial...",
                    steps: "Pasos de Predicción",
                    predict: "Predecir Pasos",
                    predicting: "Prediciendo...",
                },
                table: {
                    step: "Paso",
                    char: "Carácter",
                    prob: "Probabilidad",
                },
                result: "Resultado:",
            },
            generation: {
                title: "Patio de Generación",
                mainTitle: "3. Generación de Texto",
                description: "Deja que el modelo alucine texto muestreando de la distribución.",
                tooltip: {
                    title: "¿Cómo se genera el texto?",
                    sampling: "Muestreo:",
                    samplingDesc: "El modelo no solo elige la respuesta #1. \"Tira un dado\" ponderado por probabilidades. Por eso puede generar texto diferente cada vez.",
                    temp: "Temperatura:",
                    tempDesc: "Valores más altos hacen que el dado sea más \"loco\" (más aleatorio). Valores más bajos lo hacen más \"seguro\" y repetitivo.",
                    note: "¡Prueba temperatura 2.0 para ver galimatías, o 0.1 para verlo atascarse en bucles!",
                },
                form: {
                    startChar: "Carácter Inicial",
                    numTokens: "Número de Tokens",
                    temp: "Temperatura",
                    generate: "Generar",
                    generating: "Generando...",
                },
                copyToClipboard: "Copiar texto generado",
            },
            architecture: {
                title: "Especificación Técnica",
                subtitle: "Desglose detallado del mecanismo interno del modelo, capacidades y restricciones.",
                mechanism: "Mecanismo de Inferencia",
                capabilities: "Capacidades",
                constraints: "Restricciones",
                modelCard: {
                    title: "Tarjeta del Modelo",
                    type: "Tipo de Arquitectura",
                    complexity: "Clasificación de Complejidad",
                    useCases: "Casos de Uso Principales",
                    description: "Descripción",
                },
                tooltips: {
                    matrixW: {
                        title: "¿Qué es la Matriz W?",
                        desc: "Es esencialmente una tabla de búsqueda de 9216 números (96x96 caracteres en el vocabulario). Cada número representa la \"puntuación no normalizada\" de cuán probable es que un carácter siga a otro.",
                    },
                    softmax: {
                        title: "¿Qué es Softmax?",
                        desc: "Softmax toma puntuaciones brutas (logits) y las aplasta en una distribución de probabilidad. Todos los números se vuelven positivos y suman 1 (100%).",
                    },
                    loss: {
                        title: "¿Qué es la Pérdida (Entropía Cruzada)?",
                        desc: "La pérdida mide la distancia entre la predicción del modelo y la verdad. Si la verdad es 'n' y el modelo dio a 'n' un 0.1% de probabilidad, la pérdida será muy alta. El entrenamiento es el proceso de ajustar los pesos para minimizar esta distancia.",
                    },
                },
                steps: {
                    predicts: "Predice el siguiente carácter vía:",
                    optimizes: "Optimiza parámetros usando:",
                },
            },
            guide: {
                badge: "Guía para Exploradores No Técnicos",
                title: "¿Cómo funciona este \"Cerebro\"?",
                subtitle: "Explicando el modelo Bigrama para que hasta mi madre lo entienda (con mucho amor).",
                switchHint: "Cambia al Modo Educativo para ver la guía conceptual",
                cards: {
                    memory: {
                        title: "Memoria de Pez",
                        desc: "Un modelo **Bigrama** tiene la memoria más corta del mundo: solo recuerda la **última letra** que escribió. Para decidir qué letra viene después, solo puede mirar la anterior. No tiene contexto de palabras o frases enteras.",
                    },
                    darts: {
                        title: "Lanzamiento de Dardos",
                        desc: "El modelo no \"lee\". Solo tiene una tabla gigante que dice: \"Si la última letra fue 'a', hay un 10% de probabilidad de que la siguiente sea 'n'\". Lanzar el dardo (muestreo) es lo que genera texto de manera aleatoria pero coherente.",
                    },
                    heatmap: {
                        title: "El Mapa de Calor",
                        desc: "La cuadrícula coloreada (Matriz) es el **corazón** del modelo. Los cuadrados brillantes son las \"rutas\" más frecuentes que el modelo encontró en los libros que leyó durante su entrenamiento.",
                    },
                },
            },
            educationalOverlay: {
                visualGuideTitle: "Guía de Visualización",
                visualGuideDescription: "Cada celda de esta matriz representa P(siguiente | actual), la probabilidad de que un carácter siga a otro. Las celdas más brillantes indican parejas de caracteres más frecuentes en el corpus de entrenamiento.",
                probabilityAnalysisTitle: "Análisis de Probabilidad",
                probabilityAnalysisDescription: "Escribe cualquier texto para ver qué caracteres predice el modelo como siguientes, ordenados por probabilidad aprendida. El modelo solo mira el último carácter: no tiene memoria del contexto anterior.",
                generationLabTitle: "Laboratorio de Generación",
                generationLabDescription: "La generación de texto funciona muestreando repetidamente la distribución de probabilidades. La temperatura controla cuán aleatoria es cada muestra: valores bajos producen resultados más predecibles; valores altos, secuencias más creativas (o sin sentido).",
            },
        },
        ngram: {
            title: "Modelo de Lenguaje N-Grama",
            description: "Un modelo de lenguaje estadístico a nivel de carácter con tamaño de contexto variable. Visualiza cómo aumentar la ventana de contexto agudiza las predicciones a costa de una escasez exponencial.",
            sections: {
                context: {
                    title: "Tamaño del Contexto",
                    description: "Ajusta el tamaño del contexto (N) para condicionar las predicciones en más historia.",
                },
                slice: {
                    title: "Slice Activo",
                    descriptionN1: "Para N=1 (Bigrama), visualizamos la matriz de transición de Markov simple P(siguiente | actual).",
                    descriptionNPlus: "Para N>1, visualizamos el slice condicional P(siguiente | contexto). Haz clic en las celdas para rastrear ejemplos.",
                },
                inference: {
                    title: "Inferencia y Generación",
                    description: "Interactúa con el modelo en tiempo real. Observa cómo selecciona el siguiente token basándose en las probabilidades aprendidas.",
                    distribution: {
                        title: "Distribución de Probabilidad",
                        desc: "Escribe una frase para ver los top-k caracteres siguientes más probables.",
                    },
                    stepwise: {
                        title: "Predicción Paso a Paso",
                        desc: "Observa al modelo predecir una secuencia carácter por carácter.",
                    },
                    generation: {
                        title: "Generación de Texto",
                        desc: "Deja que el modelo alucine texto muestreando de la distribución.",
                    },
                },
            },
            hero: {
                stats: {
                    uniqueContexts: { label: "Contextos Únicos", desc: "N-gramas observados" },
                    vocab: { label: "Vocabulario", desc: "Caracteres únicos" },
                    contextSpace: { label: "Espacio de Contexto", desc: "|V|^{n}" },
                    tokens: { label: "Tokens de Entrenamiento", desc: "Total tokens vistos" },
                },
            },
            viz: {
                hint: {
                    label: "Pruébalo:",
                    text: "Haz clic en cualquier celda coloreada de la matriz para ver <strong class='text-white font-semibold'>ejemplos reales de entrenamiento</strong>.",
                },
            },
            controls: {
                contextSize: "Tamaño de Contexto (N)",
                contextDesc: "Número de caracteres previos para condicionar",
                bigram: "Bigrama (1)",
                trigram: "Trigrama (2)",
                fourgram: "4-Grama",
                fivegram: "5-Grama",
                explosion: "Explosión (5+)",
            },
            training: {
                title: "Insights de Entrenamiento",
                stats: {
                    totalTokens: "Total Tokens",
                    uniqueContexts: "Contextos Únicos",
                    utilization: "Utilización",
                    sparsity: "Espasidad",
                    transitionDensity: "Densidad de Matriz",
                    subs: {
                        possiblePrefix: "de",
                        possibleSuffix: "posibles",
                        fractionObserved: "fracción de contextos posibles observados",
                        unseen: "de contextos nunca vistos",
                    },
                },
            },
            historical: {
                title: "Significado Histórico y Contexto",
                learnMore: "Aprender Más",
                description: "Descripción",
                limitations: "Limitaciones Clave",
                evolution: "Evolución a la IA Moderna",
            },
            explosion: {
                title: "Contexto Demasiado Grande — Explosión Combinatoria",
                description: "A medida que aumenta N, el número de contextos posibles crece exponencialmente (|V|^N). Para este tamaño de vocabulario, calcular la matriz de transición completa se vuelve computacionalmente impracticable y requiere un conjunto de datos enorme para evitar la escasez.",
                complexity: "|V|^N = Complejidad Espacial",
                limit: "Límite Clásico Alcanzado",
            },
            diagnostics: {
                vocabSize: "Vocabulario",
                contextSize: "Tamaño de Contexto (N)",
                contextSpace: "Espacio de Contexto (|V|^N)",
                sparsity: "Espasidad",
                sub: {
                    observed: "{count} observados",
                    possible: "Contextos Posibles",
                    utilized: "{percent}% utilizado",
                },
            },
            educationalOverlay: {
                contextControlTitle: "Control del Tamaño de Contexto",
                contextControlDescription: "Aumentar N permite al modelo condicionar con más historia, pero el número de contextos posibles crece como |V|^N. Esa explosión exponencial es la tensión central de los modelos n-grama: más contexto da predicciones más finas, pero también más dispersión de datos.",
                sliceVisualizationTitle: "Vista por Slice de Matriz",
                sliceVisualizationDescription: "Para N > 1, el tensor de transición completo es demasiado grande para mostrarse. En su lugar, fijamos el contexto actual y mostramos la fila de probabilidad resultante: un slice de la tabla de alta dimensión.",
                probabilityDistributionTitle: "Distribución de Probabilidad",
                probabilityDistributionDescription: "El modelo toma los últimos N caracteres de tu entrada, encuentra el contexto correspondiente en su tabla y devuelve la distribución de probabilidad sobre los posibles siguientes caracteres.",
                generationPredictionTitle: "Generación y Predicción",
                generationPredictionDescription: "En modo educativo nos centramos en entender cómo se elige un único token siguiente. Cambia a Lab Libre para desbloquear el trazador paso a paso completo y el playground de generación.",
                simplifiedSimulation: "La predicción paso a paso y la generación completa están disponibles en modo Lab Libre.",
            },
        },
    },
    bigramNarrative: {
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
            calloutP1: "The \"bi\" in Bigram means ",
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
            calloutP1: "Each row represents a \"given\" character. Each column represents a \"next\" character. The brightness of a cell encodes how likely that transition is. Notice how some rows are nearly uniform (the model is unsure) while others have sharp peaks (strong preferences)."
        },
        normalization: {
            label: "Normalization",
            title: "From Counts to Probabilities",
            lead: "Raw counts alone don't tell us much. To make predictions, we need to convert them into probabilities.",
            p1: "We do this by ",
            h1: "normalizing each row",
            p2: " of the count matrix — dividing every count by the total number of transitions from that row's token. After normalization, each row sums to 1.0, forming a valid probability distribution.",
            p3: "The model can now make concrete statements: \"After the letter h, there is a 32% chance the next character is e, a 15% chance it's a, and so on.\"",
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
            calloutP2: " parameter controls how \"creative\" the generation is. At ",
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
            calloutP2: ". It cannot learn that \"th\" is often followed by \"e\", because by the time it sees \"h\", it has already forgotten the \"t\". It captures local co-occurrence but nothing about words, phrases, or meaning.",
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
    },
    bigramBuilder: {
        description: "Construimos la matriz bigrama escaneando el texto carácter por carácter. Por cada par de caracteres consecutivos (actual → siguiente), incrementamos la celda [actual, siguiente]. Esta tabla captura con qué frecuencia un carácter es seguido por otro.",
        placeholder: "Escribe texto aquí...",
        hint: "Introduce algún texto para ver cómo se construye la matriz bigrama.",
        buttons: {
            build: "Construir Matriz",
            next: "Siguiente Paso",
            autoPlay: "Auto-Reproducir",
            pause: "Pausar",
            instant: "Completar",
            reset: "Reiniciar"
        },
        vocab: "Vocabulario educativo",
        normalized: "Texto normalizado:",
        empty: "(vacío tras filtrar)",
        skipped: "Mostrando los primeros {max} caracteres únicos por claridad (omitiendo {count} carácter(es) único(s)).",
        step1: "Paso",
        step2: "actualiza celda [",
        step3: "].",
        pressBuild: "Pulsa Construir Matriz y empieza a iterar sobre los pares de caracteres.",
        table: {
            curnxt: "act \\ sig"
        }
    }
};

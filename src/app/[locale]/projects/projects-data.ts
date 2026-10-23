/* ============================================================
   Projects — data source for the editorial "Híbrida" layout.
   Structural fields are language-agnostic; prose is Localized
   ({ en, es }) and picked at render time via useI18n().language.
   ES copy ported from the original wireframe; EN translated.
   ============================================================ */

export type Lang = "en" | "es";
export type Localized<T> = Record<Lang, T>;

export type ProjectStatus = "live" | "wip" | "essay";
export type MockKind = "term" | "dash" | "app" | "article";

export interface ProjectColor {
  a: string; // accent
  d: string; // accent-deep (hover)
  ink: string; // text on accent
}

export interface CodeSample {
  fn: string;
  lines: string[];
  out?: string[];
}

export interface Project {
  id: string; // also the URL slug
  name: string;
  year: string;
  status: ProjectStatus;
  featured: boolean;
  color: ProjectColor;
  mock: MockKind;
  image?: string; // /projects/<id>.png — overrides the SVG mock when present
  href?: string; // demo / live link
  repo?: string; // source code link

  tags: Localized<string[]>;
  kind: Localized<string>;
  statusLabel: Localized<string>;
  lead: Localized<string>;
  long: Localized<string>;
  desc: Localized<string>;

  detail: {
    tagline: Localized<string>;
    overview: Localized<string[]>;
    features: Localized<string[]>;
    steps: Localized<string[]>;
    facts: Localized<string[]>;
    spec: Localized<Record<string, string>>;
    code?: CodeSample;
  };
}

const GITHUB = "https://github.com/adrilaynez";

export const PROJECTS: Project[] = [
  {
    id: "lm-lab",
    name: "LM LAB",
    year: "2025",
    status: "live",
    featured: true,
    color: { a: "#34d399", d: "#10b981", ink: "#06120c" },
    mock: "dash",
    image: "/projects/lm0-bigram.webp", // real capture of lm0.dev/es/bigram (18 oct 2026)
    href: "https://lm0.dev",
    repo: `${GITHUB}/lm0`,
    tags: { en: ["Next.js", "AI"], es: ["Next.js", "AI"] },
    kind: { en: "Interactive notebook", es: "Cuaderno interactivo" },
    statusLabel: { en: "live demo", es: "live demo" },
    lead: {
      en: "Learn how ChatGPT works — from the ground up.",
      es: "Aprende cómo funciona ChatGPT desde el principio.",
    },
    long: {
      en: "An interactive notebook that walks, chapter by chapter, through the ideas behind language models. Not a course or a tutorial: a tour of the concepts with visualizations you can touch — from the simplest bigram to attention and text generation.",
      es: "Un cuaderno interactivo que recorre, capítulo a capítulo, las ideas detrás de los modelos de lenguaje. No es un curso ni un tutorial: es un paseo por los conceptos con visualizaciones que puedes tocar — del bigrama más simple hasta la atención y la generación de texto.",
    },
    desc: {
      en: "Learn how ChatGPT works from the ground up. Not a course or a tutorial — a walk through the ideas behind language models.",
      es: "Aprende cómo funciona ChatGPT desde el principio. No es un curso ni un tutorial — un recorrido por las ideas detrás de los modelos de lenguaje.",
    },
    detail: {
      tagline: {
        en: "Learn how ChatGPT works — from the ground up.",
        es: "Aprende cómo funciona ChatGPT — desde el principio.",
      },
      overview: {
        en: [
          "<b>LM LAB</b> is an interactive notebook that walks through the ideas behind language models. Not a course or a tutorial: a tour of the concepts, chapter by chapter, with visualizations you can touch.",
          "From the simplest bigram to attention and text generation, each idea builds on the last.",
        ],
        es: [
          "<b>LM LAB</b> es un cuaderno interactivo que recorre las ideas detrás de los modelos de lenguaje. No es un curso ni un tutorial: es un paseo por los conceptos, capítulo a capítulo, con visualizaciones que puedes tocar.",
          "Desde el bigrama más simple hasta la atención y la generación de texto, cada idea se construye sobre la anterior.",
        ],
      },
      features: {
        en: [
          "Interactive visualizations",
          "5 guided chapters",
          "Live inference",
          "Bilingual (EN · ES)",
        ],
        es: [
          "Visualizaciones interactivas",
          "5 capítulos guiados",
          "Inferencia en vivo",
          "Bilingüe (EN · ES)",
        ],
      },
      steps: {
        en: [
          "<b>Read</b> each chapter at your own pace — concepts first, jargon later.",
          "<b>Play</b> with the demos: change inputs and watch the model react.",
          "<b>Connect</b> the ideas until you understand how it predicts the next word.",
        ],
        es: [
          "<b>Lee</b> cada capítulo a tu ritmo — conceptos primero, jerga después.",
          "<b>Juega</b> con las demos: cambia entradas y observa el modelo reaccionar.",
          "<b>Conecta</b> las ideas hasta entender cómo predice la siguiente palabra.",
        ],
      },
      facts: {
        en: ["5 chapters", "~45 min", "Next.js"],
        es: ["5 capítulos", "~45 min", "Next.js"],
      },
      spec: {
        en: {
          Type: "Interactive notebook",
          Chapters: "05",
          Duration: "~45 min",
          Stack: "Next.js",
          Language: "EN · ES",
        },
        es: {
          Tipo: "Cuaderno interactivo",
          Capítulos: "05",
          Duración: "~45 min",
          Stack: "Next.js",
          Idioma: "EN · ES",
        },
      },
    },
  },
  {
    id: "sova",
    name: "sova",
    year: "2025",
    status: "wip",
    featured: true,
    color: { a: "#a78bfa", d: "#8b6df0", ink: "#130a20" },
    mock: "term",
    image: "/projects/sova-demo.svg",
    repo: `${GITHUB}/sova`,
    tags: { en: ["JFlex", "CUP", "WebAssembly"], es: ["JFlex", "CUP", "WebAssembly"] },
    kind: { en: "Language + compiler", es: "Lenguaje + compilador" },
    statusLabel: { en: "in progress", es: "en progreso" },
    lead: {
      en: "Write pseudocode in Spanish. Compile to WebAssembly.",
      es: "Escribe pseudocódigo en español. Compila a WebAssembly.",
    },
    long: {
      en: "A small, expressive language whose keywords read like Spanish pseudocode, with a full compiler that turns it into runnable WebAssembly. You write FUNCION, MIENTRAS, MOSTRAR… and get a .wasm module that runs in Node.js or the browser.",
      es: "Un lenguaje pequeño y expresivo cuyas palabras clave leen como pseudocódigo en español, con un compilador completo que lo convierte en WebAssembly ejecutable. Escribes FUNCION, MIENTRAS, MOSTRAR… y obtienes un módulo .wasm que corre en Node.js o en el navegador.",
    },
    desc: {
      en: "Write pseudocode in Spanish, compile to WebAssembly. A small, expressive language with a full compiler (lexer + LALR parser) that emits runnable .wasm.",
      es: "Escribe pseudocódigo en español, compila a WebAssembly. Un lenguaje pequeño y expresivo con un compilador completo (lexer + parser LALR) que genera .wasm ejecutable.",
    },
    detail: {
      tagline: {
        en: "Write pseudocode in Spanish. Compile to WebAssembly.",
        es: "Escribe pseudocódigo en español. Compila a WebAssembly.",
      },
      overview: {
        en: [
          "<b>sova</b> is a small, expressive programming language whose keywords read like Spanish pseudocode, and a full compiler that turns it into runnable <b>WebAssembly</b>.",
          "Built to teach and prototype: you write <span>FUNCION</span>, <span>MIENTRAS</span>, <span>MOSTRAR</span>… and get a <b>.wasm</b> module that runs in Node.js or the browser.",
        ],
        es: [
          "<b>sova</b> es un lenguaje de programación pequeño y expresivo cuyas palabras clave leen como pseudocódigo en español, y un compilador completo que lo convierte en <b>WebAssembly</b> ejecutable.",
          "Pensado para enseñar y prototipar: escribes <span>FUNCION</span>, <span>MIENTRAS</span>, <span>MOSTRAR</span>… y obtienes un módulo <b>.wasm</b> que corre en Node.js o en el navegador.",
        ],
      },
      features: {
        en: [
          "Static types",
          "Functions by value and reference",
          "Arrays and records",
          "Runs in Node.js and the browser",
        ],
        es: [
          "Tipos estáticos",
          "Funciones por valor y referencia",
          "Arrays y registros",
          "Ejecución en Node.js y navegador",
        ],
      },
      steps: {
        en: [
          "<b>Write</b> your algorithm in Spanish pseudocode.",
          "<b>Compile</b>: the lexer (JFlex) and LALR parser (CUP) emit WebAssembly.",
          "<b>Run</b> the <b>.wasm</b> with <span>node loader.js</span> or in the browser.",
        ],
        es: [
          "<b>Escribe</b> tu algoritmo en pseudocódigo español.",
          "<b>Compila</b>: el lexer (JFlex) y el parser LALR (CUP) generan WebAssembly.",
          "<b>Ejecuta</b> el <b>.wasm</b> con <span>node loader.js</span> o en el navegador.",
        ],
      },
      facts: {
        en: ["WebAssembly", "Lexer + Parser", "Node · Web"],
        es: ["WebAssembly", "Lexer + Parser", "Node · Web"],
      },
      spec: {
        en: {
          Language: "Spanish pseudocode",
          Target: "WebAssembly (.wasm)",
          Lexer: "JFlex",
          Parser: "CUP (LALR)",
          License: "MIT",
        },
        es: {
          Lenguaje: "Pseudocódigo ES",
          Objetivo: "WebAssembly (.wasm)",
          Lexer: "JFlex",
          Parser: "CUP (LALR)",
          Licencia: "MIT",
        },
      },
      code: {
        fn: "factorial.sova",
        lines: [
          '<span class="kw">FUNCION</span> MAIN() {',
          '  <span class="kw">ENT</span> n := 4;',
          '  <span class="kw">ENT</span> fact := 1;',
          '  <span class="kw">MIENTRAS</span> n &gt; 1 {',
          "    fact := fact * n;",
          "    n := n - 1;",
          "  }",
          '  <span class="kw">MOSTRAR</span>(fact);',
          "}",
        ],
        out: ["&gt; node loader.js", '<span class="out">24</span>'],
      },
    },
  },
  {
    id: "latent",
    name: "My Latent Space",
    year: "2025",
    status: "essay",
    featured: false,
    color: { a: "#f0884a", d: "#e0703a", ink: "#1a0f06" },
    mock: "article",
    href: "/latent-space",
    repo: `${GITHUB}/adrian-v2-web`,
    tags: { en: ["Essays", "Notes"], es: ["Ensayos", "Notas"] },
    kind: { en: "Digital garden", es: "Jardín digital" },
    statusLabel: { en: "writing", es: "escritos" },
    lead: {
      en: "Notes, ideas and unfinished thinking.",
      es: "Notas, ideas y pensamiento sin terminar.",
    },
    long: {
      en: "A personal system for thinking out loud: exploring ideas, connecting concepts and mapping meaning. It has two modes — a map of connected thoughts and longer essays. It's messy, evolving and alive.",
      es: "Un sistema personal para pensar en voz alta: explorar ideas, conectar conceptos y cartografiar el significado. Tiene dos modos — un mapa de pensamientos conectados y ensayos más largos. Es desordenado, evoluciona y está vivo.",
    },
    desc: {
      en: "Notes, ideas and unfinished thinking. A personal system to explore concepts and map meaning.",
      es: "Notas, ideas y pensamiento sin terminar. Un sistema personal para explorar conceptos y cartografiar el significado.",
    },
    detail: {
      tagline: {
        en: "Notes, ideas and unfinished thinking.",
        es: "Notas, ideas y pensamiento sin terminar.",
      },
      overview: {
        en: [
          "<b>My Latent Space</b> is a personal system for thinking out loud: exploring ideas, connecting concepts and mapping meaning. It's messy, evolving and alive.",
          "Two modes: <b>Mind</b> (a map of connected thoughts) and <b>Essays</b> (longer writing).",
        ],
        es: [
          "<b>My Latent Space</b> es un sistema personal para pensar en voz alta: explorar ideas, conectar conceptos y cartografiar el significado. Es desordenado, evoluciona y está vivo.",
          "Dos modos: <b>Mind</b> (un mapa de pensamientos conectados) y <b>Essays</b> (escritos más largos).",
        ],
      },
      features: {
        en: ["Thought map", "Notes and essays", "Linked concepts", "Always evolving"],
        es: [
          "Mapa de pensamiento",
          "Notas y ensayos",
          "Conceptos enlazados",
          "Siempre en evolución",
        ],
      },
      steps: {
        en: [
          "<b>Explore</b> the map: each node is an idea connected to others.",
          "<b>Read</b> the current threads — what I'm thinking about now.",
          "<b>Jump</b> between notes and ideas by following the links.",
        ],
        es: [
          "<b>Explora</b> el mapa: cada nodo es una idea conectada a otras.",
          "<b>Lee</b> los hilos actuales — lo que estoy pensando ahora.",
          "<b>Salta</b> entre notas e ideas siguiendo los enlaces.",
        ],
      },
      facts: {
        en: ["Mind · Essays", "Notes", "Evolving"],
        es: ["Mind · Essays", "Notas", "En evolución"],
      },
      spec: {
        en: {
          Type: "Digital garden",
          Modes: "Mind · Essays",
          Format: "Notes · Essays",
          Status: "Alive",
        },
        es: {
          Tipo: "Jardín digital",
          Modos: "Mind · Essays",
          Formato: "Notas · Ensayos",
          Estado: "Vivo",
        },
      },
    },
  },
  {
    id: "titan-engine",
    name: "titan-engine",
    year: "2026",
    status: "wip",
    featured: false,
    color: { a: "#5b9df5", d: "#3d82e8", ink: "#06101f" },
    mock: "term",
    repo: `${GITHUB}/titan-engine`,
    tags: { en: ["Python", "PyTorch"], es: ["Python", "PyTorch"] },
    kind: { en: "Models from scratch", es: "Modelos desde cero" },
    statusLabel: { en: "paused", es: "parado" },
    lead: {
      en: "GPT, built from scratch in Python.",
      es: "Un GPT hecho desde cero, en Python.",
    },
    long: {
      en: "My notebooks following Andrej Karpathy's Zero to Hero: autograd from scratch (micrograd), character models (bigram, MLP, WaveNet) and a small GPT trained on Don Quixote. The C++/CUDA inference engine on the README's roadmap is not built yet.",
      es: "Mis cuadernos siguiendo «Zero to Hero» de Andrej Karpathy: autograd desde cero (micrograd), modelos de letras (bigrama, MLP, WaveNet) y un GPT pequeño entrenado con El Quijote. El motor de inferencia en C++ y CUDA de la hoja de ruta del README aún no está hecho.",
    },
    desc: {
      en: "Autograd, character models and a small GPT trained on Don Quixote, from scratch in Python. Paused since February 2026.",
      es: "Autograd, modelos de letras y un GPT pequeño entrenado con El Quijote, desde cero en Python. Parado desde febrero de 2026.",
    },
    detail: {
      tagline: {
        en: "GPT, built from scratch in Python.",
        es: "Un GPT hecho desde cero, en Python.",
      },
      overview: {
        en: [
          "<b>titan-engine</b> holds my notebooks following Andrej Karpathy's <i>Zero to Hero</i>: autograd from scratch, character-level models and a small GPT trained on <b>Don Quixote</b>.",
          "The name comes from the original plan, a GPT-2 inference engine in C++ and CUDA. That part is not built: the repo is Python only.",
        ],
        es: [
          "<b>titan-engine</b> guarda mis cuadernos siguiendo <i>Zero to Hero</i> de Andrej Karpathy: autograd desde cero, modelos de letras y un GPT pequeño entrenado con <b>El Quijote</b>.",
          "El nombre viene del plan inicial, un motor de inferencia de GPT-2 en C++ y CUDA. Esa parte no está hecha: el repo es solo Python.",
        ],
      },
      features: {
        en: [
          "Autograd from scratch",
          "Bigram, MLP and WaveNet",
          "GPT trained on Don Quixote",
          "GPT-2 training script",
        ],
        es: [
          "Autograd desde cero",
          "Bigrama, MLP y WaveNet",
          "GPT entrenado con El Quijote",
          "Script de entrenamiento de GPT-2",
        ],
      },
      steps: {
        en: [
          "<b>micrograd</b>: backpropagation on a tiny computation graph.",
          "<b>makemore</b>: from counting letter pairs to an MLP and WaveNet.",
          "<b>GPT</b>: self-attention, trained on the full text of Don Quixote.",
        ],
        es: [
          "<b>micrograd</b>: retropropagación sobre un grafo de cálculo diminuto.",
          "<b>makemore</b>: de contar parejas de letras a un MLP y WaveNet.",
          "<b>GPT</b>: autoatención, entrenado con el texto entero de El Quijote.",
        ],
      },
      facts: {
        en: ["Python · PyTorch", "8 notebooks", "Paused"],
        es: ["Python · PyTorch", "8 cuadernos", "Parado"],
      },
      spec: {
        en: {
          Type: "Study notebooks",
          Language: "Python · PyTorch",
          Status: "Paused (last commit Feb 2026)",
          Year: "2026",
        },
        es: {
          Tipo: "Cuadernos de estudio",
          Lenguaje: "Python · PyTorch",
          Estado: "Parado (último commit, feb 2026)",
          Año: "2026",
        },
      },
      code: {
        fn: "output.txt",
        lines: [
          "cizando de ha mobre españor",
          " acha lubino",
          "a, bino pla.",
          "",
          "Esos pofecigo y, puerese si gunóle; que sarríi, que en corontene",
        ],
      },
    },
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.id === slug);
}

export function getProjectSlugs(): string[] {
  return PROJECTS.map((p) => p.id);
}

export function getRelated(slug: string, n = 3): Project[] {
  return PROJECTS.filter((p) => p.id !== slug).slice(0, n);
}

export const FEATURED = PROJECTS.filter((p) => p.featured);
export const REST = PROJECTS.filter((p) => !p.featured);

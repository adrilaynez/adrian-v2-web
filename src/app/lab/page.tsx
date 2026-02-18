import ModelSelector from "@/components/ModelSelector";
import { Sparkles, Terminal, Activity } from "lucide-react";

export default function LabDashboard() {
    return (
        <main className="min-h-screen bg-[#0E1117] text-slate-200 overflow-hidden relative">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#FF6C6C]/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
                <div className="absolute inset-0 bg-grid opacity-10 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            </div>

            <div className="relative z-10 container mx-auto px-6 py-24 flex flex-col items-center">
                {/* Hero Header */}
                <section className="text-center mb-24 max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/50 border border-slate-800 backdrop-blur-md mb-8">
                        <Sparkles className="w-4 h-4 text-[#FF6C6C]" />
                        <span className="text-[10px] font-bold text-[#FF6C6C] tracking-[0.2em] uppercase">Laboratorio de Interpretabilidad</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-8">
                        LM-Lab <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6C6C] to-white italic font-light">Suite</span>
                    </h1>

                    <p className="text-lg text-slate-400 leading-relaxed font-light">
                        Plataforma avanzada para la inspección y análisis de modelos de lenguaje.
                        Visualiza pesos, activa matrices de transición y desglosa la probabilidad de cada token en tiempo real.
                    </p>
                </section>

                {/* Categories / Stats Brief */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16 w-full max-w-4xl">
                    <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/50 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#FF6C6C]/10 flex items-center justify-center text-[#FF6C6C]">
                            <Terminal className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Interface</p>
                            <p className="text-sm font-mono text-slate-300">v2.0.4-beta</p>
                        </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/50 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Inferencia</p>
                            <p className="text-sm font-mono text-slate-300">45ms @ CUDA</p>
                        </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/50 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Disponibilidad</p>
                            <p className="text-sm font-mono text-slate-300 text-emerald-400 font-bold uppercase">Online</p>
                        </div>
                    </div>
                </div>

                {/* Model Selection Grid */}
                <ModelSelector />

                {/* Footer */}
                <footer className="mt-32 pt-12 border-t border-slate-800/50 w-full flex flex-col md:flex-row justify-between items-center gap-6 text-slate-600 font-mono text-[10px]">
                    <div className="flex items-center gap-4">
                        <span>© 2024 LM-LAB INSTRUMENTS</span>
                        <span className="w-1 h-1 rounded-full bg-slate-800" />
                        <span>SISTEMA DE CONTROL DE PESOS</span>
                    </div>
                    <div className="flex items-center gap-6 uppercase tracking-widest">
                        <span className="text-[#FF6C6C]">Secure Connection</span>
                        <span>Inferred Hardware: RTX 4080 (Mock)</span>
                    </div>
                </footer>
            </div>
        </main>
    );
}

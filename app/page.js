"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Download, ImageIcon, Loader2, Zap, 
  ShieldCheck, Terminal, Cpu, HardDrive, Share2 
} from 'lucide-react';

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);

  // Sistema de barra de progreso simulada para dar feedback visual real
  useEffect(() => {
    if (loading) {
      setProgress(0);
      timerRef.current = setInterval(() => {
        setProgress(prev => (prev < 95 ? prev + 1 : prev));
      }, 150);
    } else {
      clearInterval(timerRef.current);
      setProgress(0);
    }
    return () => clearInterval(timerRef.current);
  }, [loading]);

  const runGeneration = async () => {
    if (!prompt || loading) return;
    setLoading(true);
    setError(null);
    setImage(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setImage(data.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-12 lg:p-20 relative flex flex-col items-center justify-start overflow-x-hidden">
      {/* --- CAPA DE DECORACIÓN TECNOLÓGICA --- */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500/20 blur-[180px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-orange-600/10 blur-[180px] rounded-full animate-pulse"></div>
      </div>

      <main className="relative z-10 w-full max-w-[1800px] flex flex-col gap-12">
        {/* --- CABECERA MONUMENTAL --- */}
        <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-12">
          <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <div className="flex items-center gap-3 text-yellow-500 mb-4 font-mono tracking-widest uppercase text-sm">
              <Cpu size={20} /> <span className="animate-pulse">Neural Core v4.0 Active</span>
            </div>
            <h1 className="text-[12vw] md:text-[8rem] font-black leading-[0.8] tracking-tighter italic">
              GIGA<span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600">FORCE</span>
            </h1>
          </motion.div>
          
          <div className="text-right font-mono text-neutral-500 hidden md:block">
            <p>LATENCY: 12ms</p>
            <p>UPTIME: 99.9%</p>
            <p>MODEL: SDXL_STABLE_V1</p>
          </div>
        </header>

        {/* --- SECCIÓN DE CONTROL --- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 flex items-center gap-2">
                <Terminal size={14} /> Entrada de Comando Vectorial
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="DESCRIBE TU VISIÓN... EJ: UN DIOS ROBÓTICO EN EL ESPACIO..."
                className="w-full bg-neutral-900/50 border-2 border-white/5 p-8 text-2xl md:text-3xl font-bold uppercase italic outline-none focus:border-yellow-500/50 transition-all min-h-[250px] rounded-[30px]"
              />
            </div>

            <button
              onClick={runGeneration}
              disabled={loading}
              className="group relative w-full overflow-hidden bg-white text-black py-10 rounded-[30px] transition-all hover:scale-[0.98] active:scale-95 disabled:opacity-20"
            >
              <div className="relative z-10 flex items-center justify-center gap-6 text-4xl font-black italic uppercase">
                {loading ? <Loader2 className="animate-spin" size={48} /> : <Zap size={48} fill="currentColor" />}
                {loading ? `GENERANDO ${progress}%` : "INICIAR SECUENCIA"}
              </div>
              {loading && (
                <motion.div 
                  className="absolute inset-0 bg-yellow-400 z-0"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              )}
            </button>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 bg-red-500/10 border-l-8 border-red-500 text-red-200">
                <h3 className="font-black uppercase mb-2">Error de Sistema detectado</h3>
                <p className="text-lg opacity-80 font-mono">{error}</p>
              </motion.div>
            )}
          </div>

          {/* --- DISPLAY DE IMAGEN MONUMENTAL --- */}
          <div className="lg:col-span-7">
            <div className="relative aspect-square md:aspect-video bg-neutral-900/40 rounded-[60px] border border-white/5 overflow-hidden backdrop-blur-3xl shadow-2xl flex items-center justify-center">
              <AnimatePresence mode="wait">
                {image ? (
                  <motion.div key="img" initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} className="w-full h-full group">
                    <img src={image} alt="AI Generated" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-6">
                      <a href={image} download className="p-8 bg-white text-black rounded-full hover:scale-110 transition-transform shadow-2xl">
                        <Download size={40} />
                      </a>
                      <button className="p-8 bg-neutral-800 text-white rounded-full hover:scale-110 transition-transform border border-white/10">
                        <Share2 size={40} />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center gap-8">
                    {loading ? (
                      <div className="relative">
                        <div className="w-48 h-48 border-[16px] border-white/5 border-t-yellow-500 rounded-full animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Zap size={50} className="text-yellow-500 animate-pulse" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center opacity-5">
                        <ImageIcon size={250} strokeWidth={0.5} />
                        <span className="text-4xl font-black uppercase tracking-widest mt-4">Sistema IDLE</span>
                      </div>
                    )}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* --- FOOTER DE DATOS --- */}
        <footer className="mt-auto pt-12 flex flex-wrap gap-10 border-t border-white/5 opacity-40">
          <div className="flex items-center gap-2 font-mono uppercase text-xs">
            <ShieldCheck size={16} /> Encryption: AES-256
          </div>
          <div className="flex items-center gap-2 font-mono uppercase text-xs">
            <HardDrive size={16} /> Storage: Cloud Neural
          </div>
        </header>
      </main>
    </div>
  );
}

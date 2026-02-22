"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Download, Image as ImageIcon, Loader2, Zap, ShieldCheck, HardDrive, Terminal } from 'lucide-react';

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (loading) {
      setProgress(0);
      timerRef.current = setInterval(() => {
        setProgress(prev => (prev < 98 ? prev + 1 : prev));
      }, 200);
    } else {
      clearInterval(timerRef.current);
      setProgress(0);
    }
    return () => clearInterval(timerRef.current);
  }, [loading]);

  const generateImage = async () => {
    if (!prompt || loading) return;
    setLoading(true);
    setError(null);
    setImage(null);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      
      setImage(data.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white p-6 md:p-12 overflow-x-hidden selection:bg-yellow-500 selection:text-black flex flex-col items-center">
      
      {/* Decoración de fondo */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-600/10 blur-[180px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-orange-600/10 blur-[180px] rounded-full" />
      </div>

      <main className="relative z-10 w-full max-w-[1400px] flex flex-col gap-16">
        
        {/* CABECERA GIGANTE */}
        <header className="border-b border-white/10 pb-10">
          <div className="flex items-center gap-3 text-yellow-500 mb-6 font-mono text-sm tracking-widest uppercase">
            <Terminal size={18} /> Neural Engine Online
          </div>
          <h1 className="text-[12vw] md:text-[9rem] font-black leading-[0.8] tracking-tighter italic uppercase">
            GIGA<span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">GEN</span>
          </h1>
        </header>

        <section className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-start">
          
          {/* PANEL DE CONTROL */}
          <div className="space-y-8">
            <textarea
              rows="4"
              placeholder="Ej: Un samurai cyberpunk en Tokio lluvioso..."
              className="w-full bg-neutral-900/60 border border-white/10 p-8 text-3xl md:text-5xl font-black uppercase italic outline-none focus:border-yellow-500 transition-colors rounded-[40px] resize-none placeholder:text-neutral-800 shadow-2xl"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            
            <button
              onClick={generateImage}
              disabled={loading}
              className="relative overflow-hidden w-full bg-white text-black py-12 rounded-[40px] transition-transform active:scale-95 disabled:opacity-50"
            >
              <div className="relative z-10 flex items-center justify-center gap-6 text-4xl font-black italic uppercase">
                {loading ? <Loader2 className="animate-spin" size={50} /> : <Zap size={50} fill="currentColor" />}
                {loading ? `SINTETIZANDO [${progress}%]` : "GENERAR AHORA"}
              </div>
              {loading && (
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-yellow-400 z-0 transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              )}
            </button>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 border-2 border-red-500/30 bg-red-500/10 text-red-400 text-xl font-bold uppercase rounded-3xl">
                Error de sistema: {error}
              </motion.div>
            )}
          </div>

          {/* ÁREA DE IMAGEN */}
          <div className="relative aspect-square w-full bg-black border border-white/10 rounded-[60px] overflow-hidden flex items-center justify-center shadow-[0_0_100px_rgba(0,0,0,0.5)] group">
            <AnimatePresence mode="wait">
              {image ? (
                <motion.div key="img" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full relative">
                  <img src={image} alt="Generada" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <a href={image} download="gigagen_art.jpg" className="p-10 bg-white text-black rounded-full hover:scale-110 transition-transform">
                      <Download size={50} />
                    </a>
                  </div>
                </motion.div>
              ) : (
                <div className="text-neutral-800 flex flex-col items-center">
                  {loading ? (
                    <div className="w-40 h-40 border-[16px] border-white/5 border-t-yellow-500 rounded-full animate-spin" />
                  ) : (
                    <ImageIcon size={200} strokeWidth={0.5} />
                  )}
                </div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* PIE DE PÁGINA (ESTE ERA EL ERROR, AHORA ESTÁ PERFECTO) */}
        <footer className="mt-20 pt-10 border-t border-white/10 flex flex-wrap gap-10 opacity-50">
          <div className="flex items-center gap-2 font-mono uppercase text-sm">
            <ShieldCheck size={20} /> Vercel Hosted
          </div>
          <div className="flex items-center gap-2 font-mono uppercase text-sm">
            <HardDrive size={20} /> HuggingFace SDXL Core
          </div>
        </footer>

      </main>
    </div>
  );
}

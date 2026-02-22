"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Download, Image as ImageIcon, Loader2, Zap, AlertTriangle } from 'lucide-react';

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

      if (!response.ok) {
        throw new Error(data.error || "Error inesperado");
      }
      
      setImage(data.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-yellow-400 p-4 md:p-10 font-sans overflow-x-hidden">
      {/* Luces de ambiente */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
        {/* Header Monumental */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16 mt-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-yellow-500 text-sm font-bold tracking-[0.3em] uppercase mb-8">
            <Zap size={16} fill="currentColor" /> Free Open Source Engine
          </div>
          <h1 className="text-[14vw] md:text-[11rem] font-black leading-[0.75] tracking-tighter italic uppercase">
            GIGA<span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">GEN</span>
          </h1>
          <p className="text-xl md:text-3xl text-neutral-500 font-light mt-6 max-w-3xl mx-auto">
            Crea arte digital de alta resolución gratis y sin límites.
          </p>
        </motion.div>

        {/* Input Barra Gigante */}
        <div className="w-full max-w-6xl mb-12">
          <div className="bg-neutral-900/40 backdrop-blur-3xl border border-white/10 p-3 rounded-[45px] shadow-2xl flex flex-col md:flex-row gap-4 items-center">
            <input
              type="text"
              placeholder="Describe tu obra maestra (en inglés funciona mejor)..."
              className="w-full bg-transparent px-10 py-8 text-2xl md:text-4xl outline-none border-none placeholder:text-neutral-700 font-bold"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && generateImage()}
            />
            <button
              onClick={generateImage}
              disabled={loading}
              className="w-full md:w-auto bg-yellow-400 hover:bg-white text-black text-3xl font-black px-16 py-8 rounded-[35px] flex items-center justify-center gap-4 transition-all active:scale-95 disabled:opacity-20 shadow-[0_0_50px_rgba(251,191,36,0.2)]"
            >
              {loading ? <Loader2 className="animate-spin" size={40} /> : <Sparkles size={40} />}
              {loading ? "GENERANDO" : "CREAR"}
            </button>
          </div>
          
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 flex items-center justify-center gap-3 text-yellow-500 bg-yellow-500/10 p-6 rounded-3xl border border-yellow-500/20">
              <AlertTriangle size={24} />
              <p className="text-xl font-bold uppercase tracking-tight">{error}</p>
            </motion.div>
          )}
        </div>

        {/* Galería / Imagen GIGANTE */}
        <div className="w-full max-w-6xl relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-[60px] blur-3xl opacity-10 group-hover:opacity-20 transition duration-1000" />
          <div className="relative aspect-square w-full bg-neutral-900/20 border border-white/5 rounded-[60px] overflow-hidden flex items-center justify-center shadow-inner">
            <AnimatePresence mode="wait">
              {image ? (
                <motion.div key="img" initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} className="w-full h-full relative">
                  <img src={image} alt="Generada" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <a href={image} download="imagen_ia.jpg" className="p-10 bg-white text-black rounded-full hover:scale-110 transition-transform shadow-2xl">
                      <Download size={50} />
                    </a>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center opacity-10 p-10">
                  {loading ? (
                    <div className="flex flex-col items-center gap-10">
                      <div className="w-32 h-32 border-8 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin" />
                      <h2 className="text-5xl font-black italic animate-pulse">PINTANDO...</h2>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-6">
                      <ImageIcon size={180} strokeWidth={0.5} />
                      <p className="text-5xl font-black tracking-tighter uppercase italic">LIENZO VACÍO</p>
                    </div>
                  )}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}

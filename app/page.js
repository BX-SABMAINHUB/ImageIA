"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Download, Image as ImageIcon, Loader2, Zap, Clock } from 'lucide-react';

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
      if (!response.ok) throw new Error(data.error);
      setImage(data.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 overflow-x-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* TITULO ULTRA GIGANTE */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-16">
          <h1 className="text-[15vw] md:text-[13rem] font-black leading-[0.8] tracking-tighter uppercase italic">
            GIGA<span className="text-yellow-500">FREE</span>
          </h1>
          <p className="text-2xl text-neutral-500 font-bold mt-4 uppercase tracking-[0.5em]">High Precision Engine</p>
        </motion.div>

        {/* CONTENEDOR DE CONTROL */}
        <div className="w-full max-w-6xl mb-12 space-y-6">
          <div className="bg-neutral-900 border-4 border-white/5 p-4 rounded-[50px] flex flex-col md:flex-row gap-4 items-center shadow-[0_0_100px_rgba(0,0,0,1)]">
            <input
              type="text"
              placeholder="Describe una visión cinematográfica..."
              className="w-full bg-transparent px-10 py-8 text-3xl md:text-5xl outline-none border-none placeholder:text-neutral-800 font-black italic uppercase"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && generateImage()}
            />
            <button
              onClick={generateImage}
              disabled={loading}
              className="w-full md:w-auto bg-white hover:bg-yellow-400 text-black px-16 py-10 rounded-[40px] text-4xl font-black transition-all active:scale-90 disabled:opacity-10"
            >
              {loading ? <Loader2 className="animate-spin" size={50} /> : <Zap size={50} fill="currentColor" />}
            </button>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-yellow-500/10 border-2 border-yellow-500/30 p-8 rounded-[30px] flex items-center gap-6">
              <Clock className="text-yellow-500" size={40} />
              <p className="text-2xl font-bold text-yellow-500 uppercase">{error}</p>
            </motion.div>
          )}
        </div>

        {/* AREA DE IMAGEN MONUMENTAL */}
        <div className="w-full max-w-6xl aspect-square bg-neutral-900/50 rounded-[80px] border-2 border-white/5 overflow-hidden flex items-center justify-center relative shadow-2xl">
          <AnimatePresence mode="wait">
            {image ? (
              <motion.div key="img" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full relative">
                <img src={image} alt="Generada" className="w-full h-full object-cover" />
                <a href={image} download className="absolute bottom-12 right-12 p-10 bg-white text-black rounded-full hover:scale-110 transition-transform shadow-2xl">
                  <Download size={40} />
                </a>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center gap-12">
                {loading ? (
                  <div className="flex flex-col items-center gap-8">
                    <div className="w-40 h-40 border-[16px] border-yellow-500/10 border-t-yellow-500 rounded-full animate-spin" />
                    <h2 className="text-6xl font-black animate-pulse text-yellow-500">PENSANDO...</h2>
                  </div>
                ) : (
                  <ImageIcon size={200} className="opacity-5" />
                )}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

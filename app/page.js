"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Download, Zap, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';

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
      if (!response.ok) throw new Error(data.error || "Error de conexión");
      setImage(data.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-12 selection:bg-cyan-500">
      {/* Luces de fondo decorativas */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-6xl mx-auto flex flex-col items-center">
        {/* Título Gigante */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-[12vw] md:text-[10rem] font-black leading-none tracking-tighter italic uppercase">
            FLUX<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">.VISION</span>
          </h1>
          <p className="text-xl md:text-3xl text-neutral-500 font-medium mt-4">
            Generador de imágenes profesional de alto impacto.
          </p>
        </motion.div>

        {/* Input y Botón Gigante */}
        <div className="w-full space-y-8">
          <div className="bg-neutral-900/80 backdrop-blur-3xl border border-white/10 p-4 rounded-[40px] flex flex-col md:flex-row gap-4 shadow-2xl">
            <input
              type="text"
              placeholder="Ej: Un caballero medieval hecho de neón azul..."
              className="flex-1 bg-transparent px-8 py-6 text-2xl md:text-3xl outline-none placeholder:text-neutral-700 font-bold"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && generateImage()}
            />
            <button
              onClick={generateImage}
              disabled={loading}
              className="w-full md:w-auto bg-white hover:bg-cyan-400 text-black px-12 py-6 rounded-[30px] text-2xl font-black flex items-center justify-center gap-4 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-30"
            >
              {loading ? <Loader2 className="animate-spin" size={32} /> : <Zap size={32} />}
              {loading ? "CREANDO..." : "GENERAR"}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2 text-red-500 font-black text-xl bg-red-500/10 p-4 rounded-2xl border border-red-500/20">
              <AlertCircle /> ERROR: {error}
            </motion.div>
          )}

          {/* Área de Visualización (GIGANTE) */}
          <div className="relative group min-h-[500px] w-full bg-neutral-900/30 border border-white/5 rounded-[50px] overflow-hidden flex items-center justify-center shadow-inner">
            <AnimatePresence mode="wait">
              {image ? (
                <motion.div key="img" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full relative">
                  <img src={image} alt="Generada" className="w-full h-full object-cover" />
                  <a href={image} download className="absolute bottom-8 right-8 p-6 bg-white text-black rounded-full hover:scale-110 transition-transform shadow-2xl">
                    <Download size={32} />
                  </a>
                </motion.div>
              ) : (
                <div className="text-center opacity-10 flex flex-col items-center gap-6">
                  {loading ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 border-8 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                      <p className="text-2xl font-black">SINTETIZANDO...</p>
                    </div>
                  ) : (
                    <>
                      <ImageIcon size={120} />
                      <p className="text-4xl font-black italic">LISTO PARA CREAR</p>
                    </>
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

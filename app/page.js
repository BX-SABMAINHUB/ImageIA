"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Download, Zap, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    if (!prompt || loading) return;
    setLoading(true);
    setImage(null);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      if (data.url) setImage(data.url);
    } catch (err) {
      alert("Algo salió mal. Revisa la consola.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Efectos de luces de fondo */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="z-10 w-full max-w-3xl"
      >
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-yellow-500 text-sm font-medium mb-4">
            <Zap size={14} /> Powered by Nano Banana
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter">
            IMAGINA <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">CUALQUIER COSA</span>
          </h1>
        </header>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-2 rounded-3xl shadow-2xl flex flex-col md:flex-row gap-2">
          <input
            type="text"
            placeholder="Describe una ciudad cyberpunk bañada por la lluvia..."
            className="flex-1 bg-transparent px-6 py-4 outline-none text-lg border-none focus:ring-0"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && generateImage()}
          />
          <button
            onClick={generateImage}
            disabled={loading}
            className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-8 py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
            {loading ? "Calculando..." : "Generar"}
          </button>
        </div>

        <div className="mt-8 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative aspect-square md:aspect-video w-full bg-black/40 border border-white/10 rounded-[2rem] overflow-hidden flex items-center justify-center shadow-inner">
            <AnimatePresence mode='wait'>
              {image ? (
                <motion.div 
                  key="image"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative w-full h-full"
                >
                  <img src={image} alt="Generada" className="w-full h-full object-cover" />
                  <a 
                    href={image} 
                    download 
                    className="absolute bottom-4 right-4 p-4 bg-black/60 backdrop-blur-md rounded-full hover:bg-black/80 transition-all border border-white/20"
                  >
                    <Download size={24} />
                  </a>
                </motion.div>
              ) : (
                <motion.div 
                  key="placeholder"
                  className="text-center p-10"
                >
                  <ImageIcon size={60} className="mx-auto mb-4 opacity-10" />
                  <p className="text-white/30 font-medium">La IA está lista para pintar tus ideas</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

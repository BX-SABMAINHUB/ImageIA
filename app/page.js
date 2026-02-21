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

      if (!response.ok) throw new Error(data.error || "Error desconocido");
      if (data.url) {
        setImage(data.url);
      } else {
        throw new Error("La IA no devolvió ninguna imagen.");
      }
    } catch (err) {
      console.error("Error visual:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-mesh min-h-screen flex flex-col items-center justify-start p-6 md:p-20">
      {/* Decoración superior */}
      <motion.div initial={{ y: -50 }} animate={{ y: 0 }} className="mb-12 text-center">
        <span className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 px-6 py-2 rounded-full text-sm font-bold tracking-widest uppercase mb-6 inline-block">
          Engine: Nano Banana v2.5
        </span>
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-4 italic">
          NANO <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-600">BANANA</span>
        </h1>
        <p className="text-gray-400 text-xl md:text-2xl max-w-2xl mx-auto font-light">
          La IA de generación de imágenes más rápida del mundo. Si puedes pensarlo, puedes verlo.
        </p>
      </motion.div>

      {/* Contenedor Principal */}
      <div className="w-full max-w-6xl space-y-10">
        <div className="glass p-4 rounded-[40px] flex flex-col md:flex-row gap-4 items-center">
          <input
            type="text"
            placeholder="Ej: Un samurái robótico en un bosque de cerezos de cristal, estilo cinemático..."
            className="w-full bg-transparent px-8 py-6 text-2xl outline-none border-none placeholder:text-gray-600 font-medium"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && generateImage()}
          />
          <button
            onClick={generateImage}
            disabled={loading}
            className="w-full md:w-auto whitespace-nowrap bg-yellow-400 hover:bg-yellow-300 text-black text-2xl font-black px-12 py-6 rounded-[30px] flex items-center justify-center gap-3 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 shadow-[0_0_30px_rgba(251,191,36,0.3)]"
          >
            {loading ? <Loader2 className="animate-spin" size={32} /> : <Sparkles size={32} />}
            {loading ? "PROCESANDO..." : "GENERAR"}
          </button>
        </div>

        {/* Mensaje de Error */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-red-500/20 border border-red-500/50 p-6 rounded-2xl flex items-center gap-4 text-red-200">
              <AlertCircle size={24} />
              <p className="font-bold">ERROR: {error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Área de la Imagen (GIGANTE) */}
        <div className="relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-[50px] blur-2xl opacity-10 group-hover:opacity-25 transition duration-1000"></div>
          <div className="relative min-h-[600px] w-full glass rounded-[50px] overflow-hidden flex items-center justify-center">
            {image ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full relative">
                <img src={image} alt="Generada" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-10">
                  <a href={image} download className="bg-white text-black p-6 rounded-full hover:scale-110 transition-transform shadow-2xl">
                    <Download size={40} />
                  </a>
                </div>
              </motion.div>
            ) : (
              <div className="text-center">
                {loading ? (
                  <div className="flex flex-col items-center gap-6">
                    <div className="w-24 h-24 border-8 border-yellow-400/20 border-t-yellow-400 rounded-full animate-spin"></div>
                    <p className="text-yellow-400 font-black text-3xl animate-pulse">ESTRUCTURANDO PÍXELES...</p>
                  </div>
                ) : (
                  <div className="opacity-20 flex flex-col items-center gap-4">
                    <ImageIcon size={120} />
                    <p className="text-4xl font-black">EL LIENZO ESTÁ VACÍO</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

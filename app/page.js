"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Download, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      if (data.url) setImage(data.url);
    } catch (error) {
      console.error("Error al generar:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full text-center"
      >
        <h1 className="text-6xl font-bold mb-4 tracking-tight">
          Nano <span className="banana-gradient">Banana</span> AI
        </h1>
        <p className="text-gray-400 mb-12 text-lg">Transforma tus palabras en arte digital instantáneo.</p>

        <div className="glass-card p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe lo que imaginas..."
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-6 py-4 outline-none focus:ring-2 ring-yellow-400 transition-all text-white"
            />
            <button
              onClick={generateImage}
              disabled={loading}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
              {loading ? "Generando..." : "Crear Imagen"}
            </button>
          </div>
        </div>

        <div className="relative min-h-[400px] w-full glass-card overflow-hidden flex items-center justify-center">
          {image ? (
            <motion.img 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              src={image} 
              alt="Generada por IA" 
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-gray-500 flex flex-col items-center">
              <ImageIcon size={64} className="mb-4 opacity-20" />
              <p>Tu creación aparecerá aquí</p>
            </div>
          )}
        </div>
      </motion.div>
    </main>
  );
}

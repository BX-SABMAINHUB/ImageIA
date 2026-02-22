"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Download, ImageIcon, Loader2, AlertCircle } from 'lucide-react';

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const startGeneration = async () => {
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
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6 md:p-20 selection:bg-yellow-500">
      <div className="w-full max-w-6xl">
        {/* TÍTULO GIGANTE */}
        <header className="mb-20">
          <h1 className="text-[15vw] md:text-[12rem] font-black italic leading-none tracking-tighter">
            GIGA<span className="text-yellow-500 underline">GEN</span>
          </h1>
          <p className="text-2xl text-neutral-600 font-bold uppercase tracking-[0.3em]">Neural Engine v4.0</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="flex flex-col gap-8">
            <textarea
              className="w-full bg-neutral-900 border-4 border-neutral-800 p-8 text-3xl font-black uppercase outline-none focus:border-yellow-500 rounded-[30px] min-h-[250px]"
              placeholder="Describe tu idea..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            
            <button
              onClick={startGeneration}
              disabled={loading}
              className="w-full bg-white text-black py-10 rounded-[30px] text-4xl font-black uppercase flex items-center justify-center gap-4 hover:bg-yellow-500 transition-all disabled:opacity-20"
            >
              {loading ? <Loader2 className="animate-spin" size={40} /> : <Zap size={40} fill="currentColor" />}
              {loading ? "CREANDO..." : "GENERAR"}
            </button>

            {error && (
              <div className="flex items-center gap-4 text-yellow-500 bg-yellow-500/10 p-6 rounded-2xl border border-yellow-500/20">
                <AlertCircle size={30} />
                <p className="text-xl font-bold uppercase">{error}</p>
              </div>
            )}
          </div>

          {/* ÁREA DE IMAGEN */}
          <div className="aspect-square bg-neutral-900 rounded-[50px] overflow-hidden border-2 border-white/5 flex items-center justify-center shadow-2xl relative">
            {image ? (
              <>
                <img src={image} alt="AI Result" className="w-full h-full object-cover" />
                <a href={image} download="art.jpg" className="absolute bottom-8 right-8 p-6 bg-white text-black rounded-full hover:scale-110 transition-transform">
                  <Download size={32} />
                </a>
              </>
            ) : (
              <div className="text-neutral-800">
                {loading ? <div className="w-24 h-24 border-8 border-yellow-500 border-t-transparent animate-spin rounded-full" /> : <ImageIcon size={150} />}
              </div>
            )}
          </div>
        </div>

        {/* PIE DE PÁGINA CORREGIDO */}
        <footer className="mt-20 border-t border-neutral-900 pt-10 text-neutral-600 font-mono text-sm flex gap-10">
          <span>AI: SDXL-BASE</span>
          <span>STATUS: ONLINE</span>
          <span>COST: $0.00</span>
        </footer>
      </div>
    </div>
  );
}

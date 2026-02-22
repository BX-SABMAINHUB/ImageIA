"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Download, Image as ImageIcon, Loader2, Zap } from 'lucide-react';

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
    <div className="min-h-screen bg-black text-white p-4 md:p-10 font-sans flex flex-col items-center">
      {/* HEADER TITÁNICO */}
      <header className="text-center mt-10 mb-20">
        <h1 className="text-[18vw] md:text-[14rem] font-black leading-[0.7] tracking-tighter uppercase italic text-white">
          INSTA<span className="text-yellow-500">GEN</span>
        </h1>
        <p className="text-xl md:text-3xl text-neutral-500 font-bold tracking-[0.4em] mt-4 uppercase">Unlimited Free AI</p>
      </header>

      {/* INPUT BOX */}
      <div className="w-full max-w-6xl space-y-8">
        <div className="bg-neutral-900 border-[6px] border-white/5 rounded-[50px] p-4 flex flex-col md:flex-row gap-4 items-center shadow-2xl transition-all hover:border-yellow-500/20">
          <input
            type="text"
            placeholder="¿Qué quieres ver creado?"
            className="w-full bg-transparent px-10 py-8 text-3xl md:text-5xl outline-none font-black uppercase placeholder:text-neutral-800"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && generateImage()}
          />
          <button
            onClick={generateImage}
            disabled={loading}
            className="w-full md:w-auto bg-yellow-500 hover:bg-white text-black px-16 py-10 rounded-[40px] text-5xl font-black transition-all active:scale-90 disabled:opacity-20"
          >
            {loading ? <Loader2 className="animate-spin" size={60} /> : <Zap size={60} fill="currentColor" />}
          </button>
        </div>

        {error && (
          <div className="text-center p-6 bg-red-500/10 border-2 border-red-500/20 rounded-3xl text-red-500 font-bold text-2xl uppercase italic">
            {error}
          </div>
        )}

        {/* ÁREA DE IMAGEN GIGANTE */}
        <div className="relative w-full aspect-square bg-neutral-900 rounded-[80px] border-4 border-white/5 overflow-hidden flex items-center justify-center shadow-2xl">
          {image ? (
            <div className="w-full h-full relative group">
              <img src={image} alt="Generada" className="w-full h-full object-cover animate-in fade-in duration-1000" />
              <a href={image} download="ia-art.jpg" className="absolute bottom-12 right-12 p-10 bg-white text-black rounded-full hover:scale-110 transition-transform">
                <Download size={50} />
              </a>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-10">
              {loading ? (
                <div className="flex flex-col items-center gap-6">
                  <div className="w-48 h-48 border-[16px] border-yellow-500/10 border-t-yellow-500 rounded-full animate-spin" />
                  <h2 className="text-5xl font-black text-yellow-500 animate-pulse tracking-widest">SINTETIZANDO...</h2>
                </div>
              ) : (
                <ImageIcon size={200} className="opacity-5" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "El campo está vacío" }, { status: 400 });
    }

    // Usamos Stable Diffusion XL (SDXL) - El mejor modelo gratuito
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    // Si Hugging Face está cargando el modelo (Error 503)
    if (response.status === 503) {
      const result = await response.json();
      return NextResponse.json({ 
        error: `La IA se está despertando... Reintenta en ${Math.round(result.estimated_time || 20)} segundos.` 
      }, { status: 503 });
    }

    if (!response.ok) {
      throw new Error("Error en la conexión con Hugging Face");
    }

    // Convertimos la imagen recibida a Base64
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');
    
    return NextResponse.json({ url: `data:image/jpeg;base64,${base64Image}` });

  } catch (error) {
    console.error("DEBUG:", error);
    return NextResponse.json({ error: "Servidor saturado. Intenta de nuevo." }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    const HF_TOKEN = process.env.HF_TOKEN;

    // Usamos un modelo que suele estar siempre activo para evitar esperas
    const MODEL_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1";

    const query = async (retryCount = 0) => {
      const response = await fetch(MODEL_URL, {
        headers: { Authorization: `Bearer ${HF_TOKEN}`, "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ 
          inputs: prompt,
          parameters: { wait_for_model: true } 
        }),
      });

      if (response.status === 503 && retryCount < 10) {
        // Si el modelo está cargando, esperamos 5 segundos y reintentamos automáticamente
        const result = await response.json();
        console.log(`Modelo cargando... reintento ${retryCount + 1}`);
        await new Promise(resolve => setTimeout(resolve, 5000));
        return query(retryCount + 1);
      }

      if (!response.ok) throw new Error("Error en la respuesta de la IA");

      return response;
    };

    const imageResponse = await query();
    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');
    
    return NextResponse.json({ url: `data:image/jpeg;base64,${base64Image}` });

  } catch (error) {
    return NextResponse.json({ error: "La IA está tardando más de lo normal. Reintenta el botón una vez más." }, { status: 500 });
  }
}

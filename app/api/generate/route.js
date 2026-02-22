import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    if (!prompt) return NextResponse.json({ error: "Prompt vacío" }, { status: 400 });

    // Mejoramos el prompt internamente para asegurar calidad máxima
    const enhancedPrompt = `${prompt}, 8k resolution, highly detailed, masterpiece, cinematic lighting, professional photography`;

    const queryIA = async (retries = 10) => {
      for (let i = 0; i < retries; i++) {
        const response = await fetch(
          "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
          {
            headers: {
              Authorization: `Bearer ${process.env.HF_TOKEN}`,
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({ 
              inputs: enhancedPrompt,
              parameters: { wait_for_model: true, guidance_scale: 8.5 }
            }),
          }
        );

        if (response.ok) return response;

        // Si el modelo está cargando (503), esperamos 5 segundos y reintentamos
        if (response.status === 503) {
          await new Promise(resolve => setTimeout(resolve, 5000));
          continue;
        }

        const errorMsg = await response.text();
        throw new Error(errorMsg);
      }
      throw new Error("Tiempo de espera agotado. La IA está muy solicitada.");
    };

    const result = await queryIA();
    const arrayBuffer = await result.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');
    
    return NextResponse.json({ url: `data:image/jpeg;base64,${base64Image}` });

  } catch (error) {
    console.error("Critical Error:", error.message);
    return NextResponse.json({ error: "La IA está procesando mucha información. Reintenta en 5 segundos." }, { status: 500 });
  }
}

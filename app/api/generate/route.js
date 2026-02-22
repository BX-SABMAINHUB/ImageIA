import { NextResponse } from 'next/server';

export const maxDuration = 60; // Permite a Vercel procesar hasta 60 segundos
export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt || prompt.trim().length < 3) {
      return NextResponse.json({ error: "Describe la imagen con más detalle." }, { status: 400 });
    }

    // Filtro de calidad profesional inyectado automáticamente
    const enhancedPrompt = `${prompt}, high resolution, 8k, masterpiece, cinematic lighting, highly detailed, photorealistic`;

    // Función recursiva: si la IA está ocupada, espera e insiste (hasta 10 veces)
    const fetchFromAI = async (retries = 10) => {
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
              parameters: {
                wait_for_model: true,
                guidance_scale: 8.5
              }
            }),
          }
        );

        if (response.ok) return response;

        // Si la IA está "arrancando" (503), esperamos 5 segundos
        if (response.status === 503) {
          console.log(`Intento ${i + 1}: IA despertando. Esperando 5 segundos...`);
          await new Promise(resolve => setTimeout(resolve, 5000));
          continue;
        }

        const errorText = await response.text();
        throw new Error(`Error del servidor IA: ${errorText}`);
      }
      throw new Error("Tiempo de espera agotado tras múltiples intentos.");
    };

    const imageResponse = await fetchFromAI();
    const arrayBuffer = await imageResponse.arrayBuffer();
    
    // Convertimos la imagen recibida para que la web pueda leerla sin guardarla en disco
    const base64Image = Buffer.from(arrayBuffer).toString('base64');
    
    return NextResponse.json({ url: `data:image/jpeg;base64,${base64Image}` });

  } catch (error) {
    console.error("Fallo crítico en el motor:", error.message);
    return NextResponse.json({ 
      error: "Sincronización con la IA pausada por alta demanda. Por favor, pulsa generar de nuevo." 
    }, { status: 500 });
  }
}

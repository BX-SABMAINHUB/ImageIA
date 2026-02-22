import { NextResponse } from 'next/server';

export const maxDuration = 60; 

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) return NextResponse.json({ error: "Escribe algo primero" }, { status: 400 });

    // Inyectamos comandos de ultra calidad para que la IA gratuita no falle
    const masterPrompt = `${prompt}, cinematic 8k, masterpiece, highly detailed, professional photography, realistic lighting`;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ 
          inputs: masterPrompt,
          parameters: {
            wait_for_model: true, // CLAVE: Le dice a la IA "tómate tu tiempo"
            guidance_scale: 7.5
          },
          options: {
            use_cache: false
          }
        }),
      }
    );

    // Si la IA está despertando, enviamos un mensaje claro al usuario
    if (response.status === 503) {
      return NextResponse.json({ 
        error: "LA IA ESTÁ ARRANCANDO: Vuelve a dar al botón en 15 segundos." 
      }, { status: 503 });
    }

    if (!response.ok) throw new Error("Fallo en el servidor gratuito");

    const arrayBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');
    
    return NextResponse.json({ url: `data:image/jpeg;base64,${base64Image}` });

  } catch (error) {
    return NextResponse.json({ error: "El servidor está ocupado. Intenta de nuevo en un momento." }, { status: 500 });
  }
}

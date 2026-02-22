import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    if (!prompt) return NextResponse.json({ error: "Campo vacío" }, { status: 400 });

    const HF_MODEL = "stabilityai/stable-diffusion-xl-base-1.0";
    
    // Función para llamar a Hugging Face con reintentos automáticos
    const query = async (retries = 5) => {
      for (let i = 0; i < retries; i++) {
        const response = await fetch(
          `https://api-inference.huggingface.co/models/${HF_MODEL}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.HF_TOKEN}`,
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({ 
              inputs: prompt,
              parameters: {
                wait_for_model: true, // Esto le dice a HF que no corte la conexión
                guidance_scale: 7.5,
                num_inference_steps: 50
              }
            }),
          }
        );

        if (response.ok) return response;

        const errorData = await response.json();
        
        // Si el modelo está cargando (503), esperamos y reintentamos
        if (response.status === 503 && i < retries - 1) {
          const waitTime = (errorData.estimated_time || 5) * 1000;
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
        
        throw new Error(errorData.error || "Error en Hugging Face");
      }
    };

    const imageResponse = await query();
    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');
    
    return NextResponse.json({ url: `data:image/jpeg;base64,${base64Image}` });

  } catch (error) {
    console.error("DEBUG:", error.message);
    return NextResponse.json({ error: "La IA necesita un momento para despertar. Pulsa generar de nuevo en 10 segundos." }, { status: 500 });
  }
}

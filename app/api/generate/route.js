import { NextResponse } from 'next/server';

// Sistema de configuración avanzada para evitar desconexiones
export const maxDuration = 60; // Aumenta el timeout en Vercel Pro/Hobby a 60s
export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt || prompt.length < 3) {
      return NextResponse.json({ error: "El prompt es demasiado corto para procesar." }, { status: 400 });
    }

    // --- SISTEMA DE MEJORA DE PROMPT (Prompt Engineering Interno) ---
    // Esto asegura que la IA gratuita siempre entregue algo de calidad profesional
    const qualityBoosters = "masterpiece, 8k, highly detailed, professional lighting, cinematic, sharp focus, intricate textures, unreal engine 5 render, global illumination";
    const finalPrompt = `${prompt}, ${qualityBoosters}`;

    // --- LÓGICA DE REINTENTO INDUSTRIAL ---
    const callAIEngine = async (attempts = 0) => {
      const maxAttempts = 12; // Intentará durante 60 segundos si es necesario
      
      const response = await fetch(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
        {
          headers: {
            Authorization: `Bearer ${process.env.HF_TOKEN}`,
            "Content-Type": "application/json",
            "x-use-cache": "false" // Forzamos generación nueva
          },
          method: "POST",
          body: JSON.stringify({ 
            inputs: finalPrompt,
            parameters: {
              wait_for_model: true,
              negative_prompt: "blurry, distorted, low quality, bad anatomy, text, watermark, grainy",
              guidance_scale: 9.0,
              num_inference_steps: 40
            }
          }),
        }
      );

      // Caso 1: Éxito total
      if (response.ok) return response;

      // Caso 2: El modelo se está cargando (Error 503)
      if (response.status === 503 && attempts < maxAttempts) {
        console.log(`IA durmiendo. Reintento ${attempts + 1}...`);
        await new Promise(resolve => setTimeout(resolve, 5000)); // Espera 5 seg
        return callAIEngine(attempts + 1);
      }

      // Caso 3: Error de cuota o saturación
      const errorData = await response.text();
      throw new Error(errorData);
    };

    const imageResult = await callAIEngine();
    
    // --- PROCESAMIENTO DE BINARIOS A BASE64 ---
    const arrayBuffer = await imageResult.arrayBuffer();
    if (arrayBuffer.byteLength < 100) throw new Error("Imagen corrupta recibida.");
    
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    
    return NextResponse.json({ 
      url: `data:image/jpeg;base64,${base64}`,
      stats: {
        model: "SDXL-Base-1.0",
        status: "success",
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("CRITICAL ENGINE FAILURE:", error.message);
    
    // Respuesta amigable pero técnica
    return NextResponse.json({ 
      error: "Sincronización fallida. La red neuronal está recalculando. Por favor, pulsa GENERAR de nuevo ahora.",
      details: error.message 
    }, { status: 500 });
  }
}

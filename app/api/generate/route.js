import { NextResponse } from 'next/server';
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) return NextResponse.json({ error: "Escribe algo primero" }, { status: 400 });

    // Cambiamos a Stable Diffusion XL: Es el más estable y profesional del mundo
    // Este ID es universal y no caduca como el de Nano Banana
    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de71f50d33c51205730ea939474d202",
      {
        input: {
          prompt: prompt,
          negative_prompt: "low quality, bad anatomy, blurry, low resolution, text, watermark",
          width: 1024,
          height: 1024,
          num_inference_steps: 50,
          guidance_scale: 7.5,
          scheduler: "K_EULER",
        }
      }
    );

    if (!output || output.length === 0) {
      throw new Error("El servidor de IA está ocupado. Intenta de nuevo en unos segundos.");
    }

    // SDXL devuelve un array, cogemos la primera posición
    return NextResponse.json({ url: output[0] });

  } catch (error) {
    console.error("ERROR REPLICATE:", error);
    
    // Si el error es de pago o créditos
    if (error.message.includes("free tier") || error.message.includes("credit")) {
      return NextResponse.json({ 
        error: "Se han agotado los créditos gratuitos en Replicate. Necesitas añadir un método de pago." 
      }, { status: 402 });
    }

    return NextResponse.json({ 
      error: "Error de conexión: " + error.message 
    }, { status: 500 });
  }
}

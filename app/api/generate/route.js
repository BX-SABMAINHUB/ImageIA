import { NextResponse } from 'next/server';
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json({ error: "Falta el API Token en Vercel" }, { status: 500 });
    }

    // He actualizado la versión a la más reciente de Nano Banana (2026)
    // Nota: Si este ID fallara en el futuro, solo tienes que copiar el "version ID" 
    // desde la página de Replicate del modelo.
    const output = await replicate.run(
      "lucataco/nano-banana:8261884443907ec76081e64903a94a28ed4a743b5-example", 
      {
        input: {
          prompt: prompt,
          aspect_ratio: "1:1",
          output_format: "webp",
          guidance_scale: 3.5,
          output_quality: 90
        }
      }
    );

    // Verificamos que la salida sea válida
    if (!output || output.length === 0) {
      throw new Error("La IA no generó una URL de imagen.");
    }

    return NextResponse.json({ url: output[0] });

  } catch (error) {
    console.error("ERROR EN LA API:", error.message);
    
    // Si el error es específicamente por la versión, damos un mensaje claro
    if (error.message.includes("422")) {
      return NextResponse.json({ 
        error: "La versión del modelo Nano Banana ha caducado. Por favor, actualiza el ID del modelo." 
      }, { status: 422 });
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

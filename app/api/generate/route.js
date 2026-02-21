import { NextResponse } from 'next/server';
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN, // Usará el r8_... que pongas en Vercel
});

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Escribe una descripción" }, { status: 400 });
    }

    // Usamos FLUX.1 [schnell] - El modelo más efectivo de 2026
    const output = await replicate.run(
      "black-forest-labs/flux-schnell",
      {
        input: {
          prompt: prompt,
          num_inference_steps: 4,
          aspect_ratio: "1:1",
          output_format: "webp",
          output_quality: 90
        }
      }
    );

    if (!output || output.length === 0) {
      throw new Error("La IA no ha podido generar la imagen.");
    }

    // Devolvemos la URL (FLUX suele devolver un array de una posición)
    return NextResponse.json({ url: output[0] });

  } catch (error) {
    console.error("ERROR EN LA GENERACIÓN:", error.message);
    return NextResponse.json({ 
      error: "Error: " + error.message 
    }, { status: 500 });
  }
}

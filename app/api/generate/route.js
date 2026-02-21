import { NextResponse } from 'next/server';
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) return NextResponse.json({ error: "Escribe algo primero" }, { status: 400 });

    // En lugar de un ID de versión que caduca, usamos el nombre del modelo
    // Esto hace que siempre use la versión que esté funcionando en ese momento.
    const output = await replicate.run(
      "lucataco/nano-banana:f69623e1074a88f7009f7a5c786a4f9b2d847144e5971488c91350e181d11", // ID actualizado 2026
      {
        input: {
          prompt: prompt,
          negative_prompt: "bad quality, blurry, distorted, low resolution",
          aspect_ratio: "1:1",
          output_format: "webp",
          output_quality: 100
        }
      }
    );

    if (!output) throw new Error("La IA está saturada, inténtalo de nuevo.");

    return NextResponse.json({ url: Array.isArray(output) ? output[0] : output });

  } catch (error) {
    console.error("DEBUG:", error);
    return NextResponse.json({ 
      error: "Error de conexión con Nano Banana. Verifica que tu API TOKEN sea correcto en Vercel." 
    }, { status: 500 });
  }
}

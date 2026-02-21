import { NextResponse } from 'next/server';
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "El prompt es obligatorio" }, { status: 400 });
    }

    // Llamada al modelo Nano Banana
    // Nota: El ID "lucataco/nano-banana" es el estándar en Replicate para este modelo
    const output = await replicate.run(
      "lucataco/nano-banana:a4a7b39a3ad8278f3523f66c98687a41e974f07a123602d38586b245a403d6d0",
      {
        input: {
          prompt: prompt,
          aspect_ratio: "1:1",
          output_format: "webp",
          output_quality: 90,
        }
      }
    );

    // Replicate devuelve un array, tomamos el primer elemento (la imagen)
    return NextResponse.json({ url: output[0] });
  } catch (error) {
    console.error("Error en el servidor:", error);
    return NextResponse.json({ error: "Error al generar la imagen. Revisa tu API Token." }, { status: 500 });
  }
}

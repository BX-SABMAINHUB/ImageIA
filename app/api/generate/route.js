import { NextResponse } from 'next/server';
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json({ error: "No has configurado la API Key en Vercel" }, { status: 500 });
    }

    // Usamos el ID de modelo más estable para Nano Banana en 2026
    const prediction = await replicate.predictions.create({
      version: "lucataco/nano-banana:a4a7b3...", // VERIFICA ESTE ID EN REPLICATE
      input: {
        prompt: prompt,
        negative_prompt: "bad quality, blurry, watermark",
        output_format: "webp"
      },
    });

    // Esperamos a que la imagen se genere (polling)
    let response = await replicate.predictions.get(prediction.id);
    while (response.status !== "succeeded" && response.status !== "failed") {
      await new Promise(resolve => setTimeout(resolve, 1000));
      response = await replicate.predictions.get(prediction.id);
    }

    if (response.status === "failed") {
      throw new Error("La IA falló al procesar la imagen.");
    }

    return NextResponse.json({ url: response.output[0] });

  } catch (error) {
    console.error("ERROR CRÍTICO:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

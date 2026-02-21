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

    // Usamos el modelo oficial de Nano Banana (el motor más rápido de 2026)
    const output = await replicate.run(
      "lucataco/nano-banana:a4a7b3...", // Nota: Asegúrate de que el ID sea el de tu dashboard
      {
        input: {
          prompt: prompt,
          negative_prompt: "low quality, blurry, distorted",
          num_inference_steps: 50,
          guidance_scale: 7.5
        }
      }
    );

    return NextResponse.json({ url: output[0] });
  } catch (error) {
    console.error("DEBUG IA ERROR:", error);
    return NextResponse.json(
      { error: "Error al conectar con Nano Banana. Revisa tu API Token." }, 
      { status: 500 }
    );
  }
}

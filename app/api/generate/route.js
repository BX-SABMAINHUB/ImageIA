import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    const token = process.env.REPLICATE_API_TOKEN;

    if (!token) {
      return NextResponse.json({ error: "Configura el token en Vercel" }, { status: 500 });
    }

    // Llamada directa a la API de Replicate para máxima compatibilidad
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Usamos el modelo estable que no caduca
        version: "f69623e1074a88f7009f7a5c786a4f9b2d847144e5971488c91350e181d11",
        input: { 
          prompt: prompt,
          aspect_ratio: "1:1",
          output_format: "webp"
        },
      }),
    });

    let prediction = await response.json();

    if (response.status !== 201) {
      throw new Error(prediction.detail || "Error en la API de Replicate");
    }

    // Sistema de espera activa (Polling) hasta que la imagen esté lista
    const pollUrl = prediction.urls.get;
    let imageOutput = null;

    while (!imageOutput) {
      const pollResponse = await fetch(pollUrl, {
        headers: { "Authorization": `Token ${token}` },
      });
      const pollResult = await pollResponse.json();

      if (pollResult.status === "succeeded") {
        imageOutput = pollResult.output[0];
      } else if (pollResult.status === "failed") {
        throw new Error("La generación de imagen falló.");
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Espera 1 seg
      }
    }

    return NextResponse.json({ url: imageOutput });

  } catch (error) {
    console.error("DEBUG:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

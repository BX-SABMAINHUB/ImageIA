import { NextResponse } from 'next/server';

export async function POST(req) {
  const { prompt } = await req.json();

  // Aquí llamamos al servicio que aloja Nano Banana (ej. Replicate o similar)
  // Por ahora, configuramos el puente:
  try {
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "nano-banana-model-id", // Aquí iría el ID real del modelo
        input: { prompt: prompt }
      }),
    });

    const data = await response.json();
    // Nota: Dependiendo de la API, puede que necesites esperar a que termine
    return NextResponse.json({ url: data.output[0] });
  } catch (error) {
    return NextResponse.json({ error: "Error de conexión" }, { status: 500 });
  }
}

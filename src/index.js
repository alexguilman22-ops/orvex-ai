
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/chat" && request.method === "POST") {
      try {
        const body = await request.json();
        const message = body.message;

        if (!message || typeof message !== "string") {
          return Response.json(
            { error: "Escribí un mensaje válido." },
            { status: 400 }
          );
        }

        const result = await env.AI.run(
          "@cf/meta/llama-3.1-8b-instruct",
          {
            messages: [
              {
                role: "system",
                content: "Sos ORVEX AI, un asistente útil que responde en español."
              },
              {
                role: "user",
                content: message.slice(0, 4000)
              }
            ]
          }
        );

        return Response.json({
          reply: result.response || "No pude generar una respuesta."
        });
      } catch (error) {
        return Response.json(
          { error: "No se pudo procesar el mensaje. Revisá la conexión de IA." },
          { status: 500 }
        );
      }
    }

    return env.ASSETS.fetch(request);
  }
};

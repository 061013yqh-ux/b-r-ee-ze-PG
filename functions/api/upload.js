export async function onRequestPost(context) {
  const upstream = "http://154.201.87.141/upload";
  const req = context.request;

  try {
    const body = await req.arrayBuffer();

    const r = await fetch(upstream, {
      method: "POST",
      headers: {
        "Content-Type": req.headers.get("content-type") || "application/octet-stream",
        "Content-Length": String(body.byteLength)
      },
      body
    });

    const text = await r.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return new Response(text, {
        status: r.status,
        headers: {"Content-Type": r.headers.get("content-type") || "text/plain; charset=utf-8"}
      });
    }

    // Rewrite any absolute backend URL so the browser stays on HTTPS.
    if (data && typeof data === "object") {
      if (typeof data.url === "string") {
        data.url = data.url.replace(/^http:\/\/154\.201\.87\.141/, "");
        if (!data.url.startsWith("/")) data.url = "/" + data.url;
      }
      if (typeof data.filename === "string" && !data.url) {
        data.url = "/images/" + encodeURIComponent(data.filename);
      }
    }

    return Response.json(data, { status: r.status });
  } catch (e) {
    return Response.json(
      { success: false, message: String(e?.message || e) },
      { status: 502 }
    );
  }
}

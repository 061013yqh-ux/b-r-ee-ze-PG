export async function onRequest(context) {
  const path = context.params.path || "";
  if (!path) return new Response("Not Found", { status: 404 });

  const upstream = "http://154.201.87.141/images/" +
    path.split("/").map(encodeURIComponent).join("/");

  try {
    const r = await fetch(upstream, {
      method: context.request.method,
      headers: context.request.headers
    });

    const headers = new Headers(r.headers);
    headers.set("Cache-Control", "public, max-age=3600");

    return new Response(r.body, {
      status: r.status,
      headers
    });
  } catch (e) {
    return new Response("Image proxy error", { status: 502 });
  }
}

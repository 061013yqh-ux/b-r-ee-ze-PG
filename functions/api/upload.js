export async function onRequestPost(context) {
  const upstream = "http://154.201.87.141/upload";

  try {
    const form = await context.request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return Response.json(
        { success: false, message: "没有上传文件" },
        { status: 400 }
      );
    }

    const body = new FormData();
    body.append("file", file, file.name);

    const r = await fetch(upstream, {
      method: "POST",
      body
    });

    const text = await r.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return Response.json(
        {
          success: false,
          message: `图片服务器返回了无效响应（HTTP ${r.status}）：${text.slice(0, 300)}`
        },
        { status: 502 }
      );
    }

    if (data && typeof data.url === "string") {
      data.url = data.url.replace(
        /^https?:\/\/154\.201\.87\.141/,
        ""
      );

      if (!data.url.startsWith("/")) {
        data.url = "/" + data.url;
      }
    }

    if (data && typeof data.filename === "string" && !data.url) {
      data.url = "/images/" + encodeURIComponent(data.filename);
    }

    return Response.json(data, { status: r.status });
  } catch (e) {
    return Response.json(
      {
        success: false,
        message: `连接图片服务器失败：${String(e?.message || e)}`
      },
      { status: 502 }
    );
  }
}

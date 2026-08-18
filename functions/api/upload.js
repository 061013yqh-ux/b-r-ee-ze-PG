function json(x, status=200){
  return new Response(JSON.stringify(x), {
    status,
    headers: {"content-type":"application/json;charset=utf-8", "cache-control":"no-store"}
  });
}

function authorized(request, env){
  const expected = env.ADMIN_PASSWORD;
  if(!expected) return false;
  return (request.headers.get("Authorization") || "") === "Bearer " + expected;
}

export async function onRequestPost(context) {
  const {request, env} = context;
  if(!env.ADMIN_PASSWORD) return json({success:false,message:"Cloudflare 未配置 ADMIN_PASSWORD"},500);
  if(!authorized(request, env)) return json({success:false,message:"未授权"},401);

  const upstream = "https://img.youyouyh.xyz/upload";

  try {
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) return json({success:false,message:"没有上传文件"},400);
    if (file.size > 5 * 1024 * 1024) return json({success:false,message:"图片不能超过5MB"},413);

    const allowed = new Set(["image/jpeg","image/png","image/webp","image/gif"]);
    if (!allowed.has(file.type)) return json({success:false,message:"只允许上传 JPG、PNG、WebP 或 GIF 图片"},415);

    const body = new FormData();
    body.append("file", file, file.name);

    const r = await fetch(upstream, {method:"POST", body});
    const text = await r.text();

    let data;
    try { data = JSON.parse(text); }
    catch { return json({success:false,message:`图片服务器返回了无效响应（HTTP ${r.status}）`},502); }

    if (data && typeof data.url === "string") {
  if (!/^https?:\/\//i.test(data.url)) {
    data.url = "/" + data.url.replace(/^\/+/, "");
  }
}
    if (data && typeof data.filename === "string" && !data.url) {
      data.url = "/images/" + encodeURIComponent(data.filename);
    }
    return json(data, r.status);
  } catch (e) {
    return json({success:false,message:`连接图片服务器失败：${String(e?.message || e)}`},502);
  }
}

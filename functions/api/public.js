async function init(env){
  if(!env.DB)throw new Error("D1 binding DB 未配置");
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS settings(key TEXT PRIMARY KEY,value TEXT NOT NULL)").run();
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS banners(id INTEGER PRIMARY KEY AUTOINCREMENT,image_url TEXT NOT NULL,link_url TEXT NOT NULL,sort INTEGER DEFAULT 0)").run();
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS platforms(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,logo_url TEXT,description TEXT,link_url TEXT NOT NULL,tag TEXT,sort INTEGER DEFAULT 0)").run();
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS tips(id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT NOT NULL,content TEXT NOT NULL,sort INTEGER DEFAULT 0)").run();
}
function j(x,s=200){
  return new Response(JSON.stringify(x),{status:s,headers:{"content-type":"application/json;charset=utf-8","cache-control":"public, max-age=30"}});
}
export async function onRequestGet({env}){
  try{
    await init(env);
    const [s,b,p,t]=await Promise.all([
      env.DB.prepare("SELECT key,value FROM settings WHERE key IN ('title','sectionTitle','pg_simulator_url','tipsTitle')").all(),
      env.DB.prepare("SELECT id,image_url,link_url,sort FROM banners ORDER BY sort,id DESC").all(),
      env.DB.prepare("SELECT id,name,logo_url,description,link_url,tag,sort FROM platforms ORDER BY sort,id DESC").all(),
      env.DB.prepare("SELECT id,title,content,sort FROM tips ORDER BY sort,id DESC").all()
    ]);
    const settings={};
    for(const x of s.results) settings[x.key]=x.value;
    return j({settings,banners:b.results,platforms:p.results,tips:t.results});
  }catch(e){
    return j({error:e?.message||"服务器错误"},500);
  }
}

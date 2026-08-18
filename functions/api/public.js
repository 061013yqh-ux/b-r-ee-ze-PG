function j(x,s=200){
  return new Response(JSON.stringify(x),{status:s,headers:{"content-type":"application/json;charset=utf-8","cache-control":"public, max-age=30"}});
}
export async function onRequestGet({env}){
  try{
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

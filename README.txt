部署说明

1. 把 functions/ 文件夹放进 Cloudflare Pages 项目的仓库根目录。
2. 把 admin.html 替换项目原来的后台 HTML（如果你现在的后台文件名不同，就只取里面的上传地址修改）。
3. 提交并推送到 GitHub，让 Cloudflare Pages 自动重新部署。
4. 部署完成后，后台上传接口会变成：
   https://breezepg.pages.dev/api/upload
5. 图片访问会变成：
   https://breezepg.pages.dev/images/文件名

注意：
- 图片服务器仍然是 http://154.201.87.141，不需要现在改它。
- 浏览器只访问 HTTPS 的 breezepg.pages.dev，Cloudflare Pages Function 再从服务器取数据。

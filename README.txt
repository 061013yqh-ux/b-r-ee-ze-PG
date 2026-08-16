全新独立导航站 v1
1. 创建新的 Cloudflare Pages 项目并连接此仓库。
2. 创建新的 D1 数据库。
3. Pages -> Settings -> Functions -> D1 bindings，Variable name 填 DB。
4. 添加环境变量 ADMIN_PASSWORD，设置后台密码。
5. 首次访问会自动创建 D1 表。
6. 前台：/
7. 后台：/admin.html
8. 第一版图片使用图片 URL；后续可以再接 R2，实现后台直接上传图片。

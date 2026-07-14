# Kason Marketing OS — 云部署指南

两种免费方案可选，都只需 5 分钟。

---

## 方案A：Render.com（推荐，最简单）

### 1. GitHub 上创建仓库

- 打开 https://github.com/new
- 名称: `kason-marketing-os`
- 选 Public
- 不要勾选任何初始化选项
- 创建后记下仓库地址: `https://github.com/你的用户名/kason-marketing-os.git`

### 2. 推送代码

```bash
cd kason-marketing-os-v3
git remote add origin https://github.com/你的用户名/kason-marketing-os.git
git branch -M main
git commit -m "Kason Marketing OS V3.0"
git push -u origin main
```

### 3. Render 部署

- 打开 https://render.com → Sign up with GitHub
- Dashboard → New → Web Service
- 选择你的 kason-marketing-os 仓库
- 配置:
  - Name: `kason-marketing-os`
  - Runtime: Node
  - Build Command: `npm install`
  - Start Command: `node server.js`
- 点击 「Advanced」→ Add Environment Variables:
  - `FEISHU_APP_ID` = cli_aadf39938c789d23
  - `FEISHU_APP_SECRET` = 你的密钥
  - (复制 .env 文件中的其他变量)
- 点击 「Create Web Service」

### 4. 更新飞书 Webhook

部署完成后 Render 会给你一个 URL（如 `https://kason-marketing-os.onrender.com`）
把飞书后台的 Webhook URL 改为 `https://你的URL.onrender.com/webhook/feishu`

---

## 方案B：Railway.app

### 1. 同上，先推送代码到 GitHub

### 2. Railway 部署

- 打开 https://railway.app → Login with GitHub
- New Project → Deploy from GitHub repo
- 选择 kason-marketing-os
- Variables 标签页添加: FEISHU_APP_ID, FEISHU_APP_SECRET 等
- 自动部署

### 3. 更新飞书 Webhook 同上

---

## 方案C：自备 VPS

如果你有阿里云/腾讯云服务器:

```bash
# SSH 登录后
git clone https://github.com/你的用户名/kason-marketing-os.git
cd kason-marketing-os
cp .env.example .env
# 编辑 .env 填入真实值
npm install
# 用 pm2 保持运行
npm install -g pm2
pm2 start server.js --name kason-os
pm2 save
pm2 startup
```

然后在飞书后台填入 `https://你的服务器IP/webhook/feishu`

---

> 推荐方案A（Render）：免费 750小时/月，自动续期，只需要 GitHub 账号。

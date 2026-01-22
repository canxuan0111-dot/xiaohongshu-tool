# 小红书爆文生成器

基于 Dify API 的小红书种草文案生成工具，适合商家快速生成营销文案。

## 功能特点

- 📝 输入商品信息，AI 自动生成小红书风格文案
- 🎨 精美的 UI 界面，支持移动端
- 🔒 API Key 安全保护（后端转发）
- 📋 一键复制生成的文案

## 部署步骤

### 1. 部署到 Vercel

1. Fork 或 Clone 本项目
2. 在 [Vercel](https://vercel.com) 导入项目
3. 在 Vercel 的 `Settings` → `Environment Variables` 中添加：
   - Name: `DIFY_API_KEY`
   - Value: 你的 Dify API Key
4. 部署完成！

### 2. 本地开发

```bash
# 安装 Vercel CLI（如果还没安装）
npm i -g vercel

# 在项目目录运行
vercel dev
```

## 技术栈

- 纯前端 HTML/CSS/JavaScript
- Vercel Serverless Functions
- Dify API

## 许可

MIT

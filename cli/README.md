# MCreator CLI

MCreator 命令行工具，帮助快速创建和管理 AIGC 创作者网站项目。

## ⚠️ 关于零构建架构

**重要说明**：此 CLI 用于**初始化项目脚手架**，会创建基础文件结构。

初始化完成后，项目本身仍然是**零构建**的：

- ✅ **生产环境**：直接打开 `index.html` 即可运行，无需 `node_modules`
- ✅ **package.json** 仅用于开发工具（如 `serve`、CSS 构建）
- ✅ **npm install** 是可选的，仅在你需要开发工具时执行
- ❌ **不强制** `npm install`，项目可直接使用

**零构建的意义**：

1. 无构建依赖，5 年后双击 HTML 还能运行
2. 无 node_modules 臃肿问题
3. 部署简单，直接上传静态文件
4. 降低学习门槛，专注内容创作

## 安装

```bash
# 全局安装
npm install -g mcreator-cli

# 或使用 npx
npx mcreator init my-project
```

## 使用方法

### 创建新项目

```bash
# 使用默认模板（basic）
mcreator init my-portfolio

# 指定模板
mcreator init my-gallery gallery
mcreator init my-blog cms
```

### 列出可用模板

```bash
mcreator list
```

### 帮助

```bash
mcreator help
```

## 可用模板

| 模板 | 说明 |
|------|------|
| basic | 纯 HTML + CSS + 最小 JS |
| react | React + Vite + TypeScript |
| gallery | 完整作品集展示 |
| cms | 内容管理 + 博客 |

## 项目命令

在项目目录中：

```bash
# 开发服务器
npm run dev

# 构建
npm run build

# 部署到 Vercel
npm run deploy

# 部署到 EdgeOne
npm run deploy:edge
```

## 目录结构

```
my-project/
├── src/
│   ├── components/   # 组件
│   ├── styles/       # 样式
│   ├── utils/       # 工具函数
│   └── pages/       # 页面
├── public/          # 静态资源
├── docs/            # 文档
├── vercel.json      # Vercel 配置
├── edgeone.config.js # EdgeOne 配置
└── package.json
```

## 配置

### Vercel 部署

项目已包含 `vercel.json` 配置文件，包含：
- 安全头（CSP、X-Frame-Options 等）
- 重定向规则
- 缓存策略

### EdgeOne 部署

使用 `edgeone.config.js` 进行配置：

```javascript
module.exports = {
  cache: {
    '/styles/*': '1y',
    '/vendor/*': '1y',
    '/*.html': '1h'
  },
  security: {
    csp: true,
    hsts: true
  }
};
```

## 更新日志

### v1.0.0
- 初始版本
- 支持 4 种项目模板
- 内置 Vercel 和 EdgeOne 部署配置


## 零构建（Zero-Build）架构详解

### 核心理念

MCreator CLI 坚持"零构建"原则：开发者生成模板后，在任何环境下直接运行，无需 Node.js 构建流水线。

### 原理

| 层级 | 职责 | 技术 |
|------|------|------|
| **HTML** | 页面结构 | 纯静态 HTML |
| **CDN** | 资源分发 | unpkg/jsdelivr（有版本锁定）|
| **配置** | 内容控制 | site.config.json（无数据库）|
| **交互** | 动态功能 | 轻量 JS（helpers.js、image-fallback.js）|

### CDN 版本锁定机制

所有 CDN 依赖通过 vendor/versions.json 锁定版本：
```json
{
  "tailwindcss": "3.4.17",
  "animate.css": "4.1.1"
}
```

### 构建流程（可选）

如需自定义 Tailwind CSS，可运行：
```bash
npm run build:css   # 仅构建 CSS
npm run dev         # 本地预览
```

推荐仅在需要自定义样式时使用构建步骤。

### 与传统框架对比

| 特性 | 传统框架（Next.js） | MCreator |
|------|---------------------|----------|
| 构建时间 | 30s - 5min | 0s |
| Node 环境 | 必须 | 可选 |
| 部署复杂度 | 高 | 极低 |
| CDN 依赖 | bundle 内 | 直接引用 |
| 更新策略 | 全量更新 | 按需增量 |

### 部署到 OSS

```bash
mc init my-site
cd my-site
mc upload --provider oss
```

# 🎨 MCreator - AIGC 创作者网站工作流标准项目

<p>

![GitHub stars](https://img.shields.io/github/stars/MiLab-Bit/MCreator)
![GitHub language count](https://img.shields.io/github/languages/count/MiLab-Bit/MCreator)
![License](https://img.shields.io/badge/License-MIT-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)
![EdgeOne](https://img.shields.io/badge/Deploy-EdgeOne-FF5C00?logo=tencentcloud&logoColor=white)

</p>

> 基于「零构建 · 国内优先 · 个人站/产品站通用」原则

<p>

**🚀 预览地址**：[https://mcreator.vercel.app](https://mcreator.vercel.app)

</p>

---

## 🏗️ 架构概览

```
MCreator/
│
├── vendor/                    # 本地化依赖（核心原则）
│   ├── images/                # 媒体资源备份目录（离线兜底）
│   └── fonts/                 # 字体子集化存储
│
├── templates/                 # 基础模板
│   ├── basic.html             # 纯HTML基础模板（默认推荐）
│   └── react.html             # 带React的进阶模板
│
├── components/                # 标准媒体组件
│   ├── cn/                    # 国内可访问组件（默认）
│   │   ├── oss-image.html     # ✅ OSS 图片组件（主）
│   │   ├── netease-player.html# ✅ 网易云播放器
│   │   ├── bilibili-player.html# ✅ B站视频
│   │   └── wechat-article.html# ✅ 微信公众号文章
│   │
│   └── global/                # 海外专用组件
│       ├── imgur-image.html   # ⚠️ Imgur 图片（备份）
│       ├── spotify-player.html# ⚠️ Spotify 音乐
│       └── youtube-player.html# ⚠️ YouTube 视频
│
├── styles/                    # 标准样式
│   ├── tailwind-built.css     # Tailwind 构建产物（生产用）
│   ├── typography.css         # 字体系统
│   └── standard-animations.css# 标准动效库
│
├── utils/                     # 标准工具函数
│   └── helpers.js             # 懒加载、滚动动画、防抖等
│
├── features/                  # 特色功能库（可插拔）
│   ├── spotlight-cursor/      # 鼠标跟随聚光灯
│   ├── interactive-gallery/   # 交互式画廊切换
│   └── vertical-marquee/      # 纵向滚动文字流
│
├── content/                   # 内容管理
│   ├── images/works/          # 作品图片（待上传）
│   ├── audio/                 # 音频资源
│   ├── videos.json            # 视频列表配置
│   └── articles.json          # 文章列表配置
│
├── .site/                     # CLI 内部状态
│   ├── cache/                 # 缓存数据
│   └── cdn-mapping.json       # CDN 映射记录
│
├── examples/                  # 使用示例
│   ├── portfolio-example.html # 作品集风格示例
│   └── dashboard-example.html # 仪表盘风格示例
│
├── docs/                      # 扩展文档
│   ├── deployment-guide.md    # 部署指南
│   └── component-api.md       # 组件 API 文档
│
├── site.config.json           # 核心配置文件
└── README.md                  # 本文件
```

---

## 📦 四层架构

### 第一层 · 基础层（所有网站通用）

| 模块 | 路径 | 说明 |
|------|------|------|
| 零构建架构 | `templates/` | 纯 HTML/CSS/JS，无需构建 |
| 设计系统 | `styles/` | Tailwind + 动效库 + 字体系统 |
| 媒体组件 | `components/` | OSS/网易云/B站等标准组件 |
| 工具函数 | `utils/` | 懒加载、防抖、图片回退等 |

### 第二层 · 特色功能层（按需引入）

| 功能 | 路径 | 适用场景 |
|------|------|---------|
| 🖱️ 鼠标聚光灯 | `features/spotlight-cursor/` | 深色主题、沉浸式网站 |
| 🖼️ 交互画廊 | `features/interactive-gallery/` | 作品展示、分类浏览 |
| 📜 纵向滚动 | `features/vertical-marquee/` | 歌词展示、文字流 |

### 第三层 · 内容层（配置驱动）

| 内容类型 | 路径 | 说明 |
|---------|------|------|
| 🖼️ 图片资源 | `content/images/` | 待上传到 OSS/Imgur |
| 🎵 音频资源 | `content/audio/` | 音乐文件或配置 |
| 📹 视频配置 | `content/videos.json` | B站/YouTube 视频列表 |
| 📝 文章配置 | `content/articles.json` | 微信公众号文章列表 |

### 第四层 · 自动化层（CLI 工具）

| 功能 | 配置文件 | 说明 |
|------|---------|------|
| ⚙️ 站点配置 | `site.config.json` | 驱动整个站点生成 |
| 🌐 CDN 映射 | `.site/cdn-mapping.json` | 记录上传结果 |
| 💾 缓存状态 | `.site/cache/` | CLI 内部缓存 |

---

## 🚀 快速开始

### 0. 构建 Tailwind CSS（首次使用必须）

```bash
# 安装 Tailwind CSS 并构建
npm install -D tailwindcss
npm run build:css
```

> ⚠️ `styles/tailwind-built.css` 是所有模板依赖的核心样式文件，生产环境必须使用构建版本

### 1. 初始化配置

编辑 `site.config.json`，填写站点基本信息：

```json
{
  "site": {
    "name": "我的作品集",
    "url": "https://mysite.com"
  },
  "storage": {
    "primary": {
      "provider": "aliyun-oss",
      "bucket": "your-bucket",
      "region": "oss-cn-shanghai"
    }
  }
}
```

### 2. 添加内容

```
📷 图片 → content/images/works/
🎵 音乐 → content/audio/playlist.json
📹 视频 → content/videos.json
```

### 3. 选择模板

| 模板 | 路径 | 适用场景 |
|------|------|---------|
| 简单站点 | `templates/basic.html` | 个人主页、作品集 |
| 复杂交互 | `templates/react.html` | 需 React 的高级场景 |

### 4. 部署

参考 `docs/deployment-guide.md`：

| 平台 | 适用场景 | 仓库 |
|------|---------|------|
| **EdgeOne** | 国内优先 🎯 | `.github/workflows/deploy-edgeone.yml` |
| **Vercel** | 海外访问 | `.github/workflows/deploy-vercel.yml` |

---

## 🎯 核心设计原则

| 原则 | 说明 |
|------|------|
| ⚡ **零构建信仰** | 禁止 npm install、打包工具、node_modules |
| 🌐 **CDN优先** | 所有依赖通过 CDN 引入，写死精确版本号 |
| 🇨🇳 **国内优先** | 国内用户访问优先，海外作为可选增强 |
| ♾️ **长期主义** | 今天写的代码，5年后双击 HTML 还能运行 |
| 💾 **本地化依赖** | 核心依赖下载到 vendor/，CDN 仅作备用 |

---

## 📂 目录职责

| 目录 | 说明 |
|------|------|
| `vendor/` | 核心图片/字体本地备份，CDN 失效时的离线兜底 |
| `components/` | 媒体组件（国内/海外分开，国内默认） |
| `features/` | 特色功能，每个功能独立目录，按需引入 |
| `content/` | 原始内容，CLI 上传后自动更新 CDN 映射 |
| `.site/` | CLI 内部数据，用户无需关心 |

---

## 📄 扩展原则

- 🏗️ **基础设施只增不改** - 已标准化的模块不要修改
- ✨ **特色功能持续积累** - 新功能抽象后加入 features/
- 🔧 **工具函数持续沉淀** - 通用逻辑加入 utils/helpers.js
- 🎨 **动效设计统一风格** - 新动效保持相同节奏和质感

---

## 📋 版本历史

| 版本 | 日期 | 更新内容 |
|------|------|---------|
| **v1.1** | 2026.05.03 | 新增国内优先原则、字体系统、OSS 图片组件 |
| **v1.0** | 2026.05.03 | 初始正式发布版本 |

---

<p align="center">

Made with ❤️ by [MiLab-Bit](https://github.com/MiLab-Bit)

</p>
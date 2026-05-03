# MCreator - AIGC创作者网站工作流标准项目

> 基于「零构建 · 国内优先 · 个人站/产品站通用」原则
> **版本：v1.1（2026.05.03）**

---

## 架构概览

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

## 分层架构说明

### 第一层：基础层（所有网站通用）

| 模块 | 路径 | 说明 |
|------|------|------|
| 零构建架构 | `templates/` | 纯 HTML/CSS/JS，无需构建 |
| 设计系统 | `styles/` | Tailwind + 动效库 + 字体系统 |
| 媒体组件 | `components/` | OSS/网易云/B站等标准组件 |
| 工具函数 | `utils/` | 懒加载、防抖、图片回退等 |

### 第二层：特色功能层（按需引入）

| 功能 | 路径 | 适用场景 |
|------|------|---------|
| 鼠标聚光灯 | `features/spotlight-cursor/` | 深色主题、沉浸式网站 |
| 交互画廊 | `features/interactive-gallery/` | 作品展示、分类浏览 |
| 纵向滚动 | `features/vertical-marquee/` | 歌词展示、文字流 |

### 第三层：内容层（配置驱动）

| 内容类型 | 路径 | 说明 |
|---------|------|------|
| 图片资源 | `content/images/` | 待上传到 OSS/Imgur |
| 音频资源 | `content/audio/` | 音乐文件或配置 |
| 视频配置 | `content/videos.json` | B站/YouTube 视频列表 |
| 文章配置 | `content/articles.json` | 微信公众号文章列表 |

### 第四层：自动化层（CLI 工具）

| 功能 | 配置文件 | 说明 |
|------|---------|------|
| 站点配置 | `site.config.json` | 驱动整个站点生成 |
| CDN 映射 | `.site/cdn-mapping.json` | 记录上传结果 |
| 缓存状态 | `.site/cache/` | CLI 内部缓存 |

---

## 快速开始

### 0. 构建 Tailwind CSS（首次使用必须）

⚠️ **首次使用必须执行此步骤！**

```bash
# 方案 A：安装 Tailwind CSS 并构建（推荐）
npm install -D tailwindcss
npm run build:css

# 方案 B：使用 CDN 版本（仅开发预览）
# 在 HTML 中将 ../styles/tailwind-built.css 替换为：
# <script src="https://cdn.tailwindcss.com"></script>
```

**为什么需要构建？**
- `styles/tailwind-built.css` 是项目所有模板依赖的核心样式文件
- 生产环境必须使用构建版本以获得最佳性能
- CDN 版本适合快速开发，但不推荐用于生产

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

- 图片 → `content/images/works/`
- 音乐 → `content/audio/playlist.json`
- 视频 → `content/videos.json`

### 3. 选择模板

- 简单站点 → `templates/basic.html`
- 复杂交互 → `templates/react.html`

### 4. 部署

参考 `docs/deployment-guide.md` 选择部署方案：
- 国内用户 → EdgeOne
- 海外用户 → Vercel

---

## 核心设计原则

| 原则 | 说明 |
|------|------|
| **零构建信仰** | 禁止 npm install、打包工具、node_modules |
| **CDN优先** | 所有依赖通过 CDN 引入，写死精确版本号 |
| **国内优先** | 国内用户访问优先，海外作为可选增强 |
| **长期主义** | 今天写的代码，5年后双击 HTML 还能运行 |
| **本地化依赖** | 核心依赖下载到 vendor/，CDN 仅作备用 |

---

## 目录职责说明

### vendor/ - 本地化依赖

存放必须本地化的资源：
- `vendor/images/` - 核心图片的本地备份（离线兜底）
- `vendor/fonts/` - 字体子集化文件（.woff2）

**原则**：CDN 可能失效，本地文件永远可用。

### components/ - 媒体组件

**cn/** - 国内可访问（默认推荐）：
- OSS 图片（阿里云/腾讯云）
- 网易云音乐
- B站视频
- 微信公众号

**global/** - 海外专用（国内不保证可用）：
- Imgur 图片
- Spotify 音乐
- YouTube 视频

### features/ - 特色功能

每个功能独立目录，包含：
- `*.js` - 功能逻辑
- `*.css` - 功能样式
- `README.md` - 使用说明

按需引入，不使用不加载。

### content/ - 内容管理

所有待处理的原始内容：
- 图片上传前放在 `content/images/`
- CLI 上传后自动更新 CDN 映射
- 配置文件驱动内容展示

### .site/ - CLI 内部状态

CLI 工具的内部数据，用户无需关心：
- 上传记录
- CDN 映射
- 缓存状态

---

## 扩展原则

1. **基础设施只增不改** - 已标准化的模块不要修改
2. **特色功能持续积累** - 新功能抽象后加入 features/
3. **工具函数持续沉淀** - 通用逻辑加入 utils/helpers.js
4. **动效设计统一风格** - 新动效保持相同节奏和质感

---

## 版本历史

- **v1.1（2026.05.03）** - 新增国内优先原则、字体系统、OSS 图片组件
- **v1.0（2026.05.03）** - 初始正式发布版本

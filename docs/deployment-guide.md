# MCreator 网站部署配置

支持 Vercel 和 EdgeOne (腾讯云) 两种部署方式。

---

## 快速开始

### Vercel 部署

```bash
# 方法一：使用 Vercel CLI
npm i -g vercel
vercel login
vercel

# 方法二：使用 GitHub Actions（推荐）
# 推送代码到 main 分支自动部署
```

### EdgeOne 部署

```bash
# 安装 EdgeOne CLI
npm i -g edgeone-cli

# 登录
edgeone login

# 部署
edgeone deploy
```

---

## Vercel 配置

### vercel.json

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": null,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://unpkg.com; style-src 'self' 'unsafe-inline' https://api.fontshare.com; img-src 'self' data: https://*.oss-cn-shanghai.aliyuncs.com https://i.imgur.com; frame-src //music.163.com //player.bilibili.com https://open.spotify.com https://www.youtube-nocookie.com; object-src 'none'"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    },
    {
      "source": "/styles/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/vendor/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/*.html",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=3600"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/http/(.*)",
      "destination": "/https/$1",
      "permanent": true
    }
  ],
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    }
  ]
}
```

### 环境变量

在 Vercel Dashboard → Project → Settings → Environment Variables 配置：

| 变量 | 说明 | 示例 |
|------|------|------|
| `OSS_ACCESS_KEY_ID` | OSS AccessKey | LTAIxxx |
| `OSS_ACCESS_KEY_SECRET` | OSS SecretKey | xxx |
| `OSS_BUCKET` | OSS 存储桶名称 | my-bucket |
| `OSS_REGION` | OSS 区域 | cn-shanghai |
| `ANALYTICS_ID` | 分析工具 ID | G-XXXXXXXX |

---

## EdgeOne 配置

### edgeone.config.js

```javascript
module.exports = {
  // 站点 ID（从 EdgeOne 控制台获取）
  siteId: process.env.EDGEONE_SITE_ID,
  
  // 构建命令
  build: {
    command: 'npm run build',
    output: 'dist'
  },
  
  // 缓存策略
  cache: {
    // 静态资源 - 1年
    '/styles/*': { maxAge: '1y', immutable: true },
    '/vendor/*': { maxAge: '1y', immutable: true },
    '/fonts/*': { maxAge: '1y', immutable: true },
    
    // 图片 - 1年
    '/*.webp': { maxAge: '1y', immutable: true },
    '/*.jpg': { maxAge: '1y', immutable: true },
    '/*.png': { maxAge: '1y', immutable: true },
    
    // HTML - 1小时
    '/*.html': { maxAge: '1h' },
    
    // 默认 - 10分钟
    '/ *': { maxAge: '10m' }
  },
  
  // 安全配置
  security: {
    // CSP
    csp: {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'", 'https://unpkg.com'],
      'style-src': ["'self'", "'unsafe-inline'", 'https://api.fontshare.com'],
      'img-src': ["'self'", 'data:', 'https://*.oss-cn-shanghai.aliyuncs.com', 'https://i.imgur.com'],
      'frame-src': [
        '//music.163.com',
        '//player.bilibili.com',
        'https://open.spotify.com',
        'https://www.youtube-nocookie.com'
      ],
      'object-src': ["'none'"]
    },
    
    // HSTS
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    
    // 其他安全头
    xFrameOptions: 'DENY',
    xContentTypeOptions: 'nosniff',
    xXSSProtection: '1; mode=block',
    referrerPolicy: 'strict-origin-when-cross-origin',
    permissionsPolicy: {
      camera: [],
      microphone: [],
      geolocation: []
    }
  },
  
  // 压缩
  compression: {
    brotli: true,
    gzip: true
  },
  
  // 重定向规则
  redirects: [
    {
      from: '/http/:path*',
      to: '/https/:path*',
      status: 301
    },
    {
      from: '/old-path',
      to: '/new-path',
      status: 302
    }
  ]
};
```

### edgeone.json（替代配置）

```json
{
  "version": 2,
  "routes": [
    {
      "match": "/styles/*",
      "handle": ["cache"],
      "cache": {
        "maxAge": 31536000
      }
    },
    {
      "match": "/*",
      "handle": ["document", "compress"]
    }
  ],
  "headers": [
    {
      "match": "/*",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

---

## 构建脚本

### package.json scripts

```json
{
  "scripts": {
    "dev": "npx serve . -l 3000",
    "build": "node scripts/build.js",
    "preview": "npm run build && npx serve dist",
    "deploy": "vercel --prod",
    "deploy:edge": "edgeone deploy",
    "analyze": "npx serve . -l 3000 & npx lighthouse http://localhost:3000"
  }
}
```

### 构建脚本示例

```javascript
// scripts/build.js
const fs = require('fs');
const path = require('path');

const dist = path.join(__dirname, '..', 'dist');

// 清理
if (fs.existsSync(dist)) {
  fs.rmSync(dist, { recursive: true });
}
fs.mkdirSync(dist, { recursive: true });

// 复制静态文件
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 示例：复制 public 目录
const publicDir = path.join(__dirname, '..', 'public');
if (fs.existsSync(publicDir)) {
  copyDir(publicDir, dist);
}

// 示例：复制根目录 HTML
const htmlFiles = ['index.html', '404.html'];
for (const file of htmlFiles) {
  const src = path.join(__dirname, '..', file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(dist, file));
  }
}

console.log('✅ Build complete!');
```

---

## 域名配置

### Vercel

1. 在 Vercel Dashboard 添加域名
2. 按照指示配置 DNS 记录
3. 等待验证（通常几分钟）

### EdgeOne

1. 在 EdgeOne 控制台添加域名
2. 按照指示配置 NS 记录或 CNAME
3. 等待生效（通常 10-30 分钟）

---

## 常见问题

### Q: 构建失败怎么办？

```bash
# 本地构建测试
npm run build

# 查看详细错误
npm run build -- --verbose
```

### Q: 部署后样式丢失？

检查：
1. CSS 路径是否正确
2. CSP 是否允许 CDN 域名
3. 浏览器控制台错误信息

### Q: 如何回滚版本？

- **Vercel**: Dashboard → Deployments → 选择版本 → Promote to Production
- **EdgeOne**: 控制台 → 部署历史 → 回滚

### Q: 自定义域名 HTTPS？

两个平台都自动提供 Let's Encrypt 证书，自定义域名后自动生效。

---

## 相关文档

- [Vercel 文档](https://vercel.com/docs)
- [EdgeOne 文档](https://cloud.tencent.com/document/product/1552)
- [CI/CD 工作流](../ci/README.md)
- [安全配置指南](./security-guide.md)

# 安全配置指南

MCreator 安全最佳实践完整指南。

---

## 目录

- [CSP 内容安全策略](#csp-内容安全策略)
- [iframe Sandbox 策略](#iframe-sandbox-策略)
- [SRI 子资源完整性校验](#sri-子资源完整性校验)
- [图片源白名单](#图片源白名单)
- [HTTPS 强制配置](#https-强制配置)
- [敏感信息保护](#敏感信息保护)
- [第三方脚本风险评估](#第三方脚本风险评估)
- [部署平台安全配置](#部署平台安全配置)
- [安全检查清单](#安全检查清单)

---

## CSP 内容安全策略

### 推荐配置（Vercel / EdgeOne）

在 HTML `<head>` 中添加 meta 标签，或在部署平台配置 HTTP 响应头。

**国内站 CSP：**

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline'
    https://unpkg.com;
  style-src 'self' 'unsafe-inline'
    https://api.fontshare.com;
  img-src 'self' data:
    https://your-bucket.oss-cn-shanghai.aliyuncs.com
    https://img.youtube.com
    https://i.imgur.com;
  font-src 'self'
    https://api.fontshare.com;
  frame-src
    //music.163.com
    //player.bilibili.com;
  connect-src 'self';
  media-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
">
```

**海外站 CSP：**

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline'
    https://unpkg.com;
  style-src 'self' 'unsafe-inline'
    https://api.fontshare.com;
  img-src 'self' data:
    https://i.imgur.com
    https://img.youtube.com
    https://your-bucket.oss-cn-shanghai.aliyuncs.com;
  font-src 'self'
    https://api.fontshare.com;
  frame-src
    https://open.spotify.com
    https://www.youtube.com
    https://www.youtube-nocookie.com;
  connect-src 'self';
  media-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
">
```

### Vercel 配置（vercel.json）

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://unpkg.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://*.oss-cn-shanghai.aliyuncs.com https://i.imgur.com; frame-src //music.163.com //player.bilibili.com https://open.spotify.com https://www.youtube-nocookie.com; object-src 'none'"
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
    }
  ]
}
```

### EdgeOne 配置

在 EdgeOne 控制台 → 站点加速 → HTTP 响应头 中添加上述安全头。

---

## iframe Sandbox 策略

### 各组件推荐 sandbox 值

| 组件 | sandbox 值 | 说明 |
|------|-----------|------|
| 网易云音乐 | `allow-scripts allow-same-origin allow-popups` | 需要脚本和同源来播放音乐 |
| B站视频 | `allow-scripts allow-same-origin allow-popups` | 同上 |
| Spotify | `allow-scripts allow-same-origin allow-popups` | 同上 |
| YouTube | `allow-scripts allow-same-origin allow-popups` | 同上 |

### 禁止使用的 sandbox 值

| 值 | 原因 |
|-----|------|
| `allow-top-navigation` | 允许 iframe 控制父页面导航，存在钓鱼风险 |
| `allow-forms` | 播放器不需要表单提交 |
| `allow-modals` | 不允许弹出模态框 |

### 最严格配置（如果播放器正常工作）

```
sandbox="allow-scripts allow-same-origin"
```

> ⚠️ 部分播放器需要 `allow-popups` 才能正常跳转到原站。

---

## SRI 子资源完整性校验

### React CDN SRI 示例

```html
<script
  src="https://unpkg.com/react@18.2.0/umd/react.production.min.js"
  integrity="sha256-cHu5M1Fhn26Utk8VMDmWWK5p6q4gN2ZCUsIwpL0v1+I="
  crossorigin="anonymous"
></script>
<script
  src="https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js"
  integrity="sha256-k8Wv8jK8qSz5f9M7q5S8Ji3r7N7a6t7F8u5S8K9L0M1I="
  crossorigin="anonymous"
></script>
```

### 获取 SRI Hash 方法

```bash
# 方法一：curl + openssl
curl -s https://unpkg.com/react@18.2.0/umd/react.production.min.js | \
  openssl dgst -sha384 -binary | openssl base64 -A

# 方法二：使用 srihash.org
# 浏览器访问 https://www.srihash.org/
# 输入 URL 自动生成
```

### 何时使用 SRI

| 场景 | 是否需要 SRI |
|------|-------------|
| CDN 引入 React/Vue | ✅ 强烈推荐 |
| CDN 引入 CSS 框架 | ✅ 推荐 |
| 自托管 JS/CSS | ❌ 不需要（自有文件） |
| iframe 嵌入 | ❌ 不适用（SRI 不支持 iframe） |

---

## 图片源白名单

### CSP img-src 允许的域名

| 域名 | 用途 | 地区 |
|------|------|------|
| `https://your-bucket.oss-cn-shanghai.aliyuncs.com` | 阿里云 OSS 主存储 | 国内 |
| `https://your-bucket.cos.ap-shanghai.myqcloud.com` | 腾讯云 COS | 国内 |
| `https://your-bucket.qiniucdn.com` | 七牛云 CDN | 国内 |
| `https://i.imgur.com` | Imgur 备份 | 海外 |
| `https://img.youtube.com` | YouTube 封面 | 海外 |
| `data:` | SVG 占位符 | 通用 |

### 配置示例

```
img-src 'self' data:
  https://*.oss-cn-shanghai.aliyuncs.com
  https://*.cos.ap-shanghai.myqcloud.com
  https://i.imgur.com
  https://img.youtube.com;
```

---

## HTTPS 强制配置

### Vercel（自动 HTTPS）

Vercel 默认强制 HTTPS，无需额外配置。如需自定义：

```json
{
  "redirects": [
    {
      "source": "http://(.*)",
      "destination": "https://$1",
      "permanent": true
    }
  ]
}
```

### EdgeOne（自动 HTTPS）

EdgeOne 默认强制 HTTPS，在控制台 → SSL/TLS 中开启「始终使用 HTTPS」。

### HSTS 头

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

> ⚠️ 首次配置 HSTS 时建议先用短 `max-age`（如 300）测试，确认无问题后再改为 31536000（1年）。

---

## 敏感信息保护

### 绝对不提交的内容

| 类型 | 说明 | 处理方式 |
|------|------|---------|
| API Key | OSS/S3/COS 密钥 | 环境变量 |
| 数据库连接串 | 含密码的连接信息 | 环境变量 |
| CDN Token | CDN 鉴权 Token | 环境变量 |
| OAuth Secret | 第三方登录密钥 | 环境变量 |

### .gitignore 必须包含

```gitignore
# 环境变量
.env
.env.local
.env.*.local

# 构建产物
node_modules/
.site/cache/

# 系统文件
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/

# 日志
*.log
```

### 环境变量使用方式

**Vercel：**
```bash
vercel env add OSS_ACCESS_KEY
vercel env add OSS_SECRET_KEY
```

**代码中读取：**
```javascript
// Vercel Serverless Function
const accessKey = process.env.OSS_ACCESS_KEY;
```

> ⚠️ 纯静态站点无法使用环境变量（前端 JS 对用户可见）。敏感操作必须在 Serverless Function 中完成。

---

## 第三方脚本风险评估

### 风险等级

| 组件 | 风险等级 | 风险说明 | 缓解措施 |
|------|---------|---------|---------|
| 网易云音乐 iframe | 🟡 中 | 第三方 Cookie、追踪 | sandbox + CSP |
| B站视频 iframe | 🟡 中 | 第三方 Cookie、追踪 | sandbox + CSP |
| Spotify iframe | 🟡 中 | 第三方 Cookie、追踪 | sandbox + CSP |
| YouTube iframe | 🟠 中高 | Google 追踪、广告 | sandbox + nocookie + CSP |
| React CDN | 🟢 低 | unpkg 可能被篡改 | SRI 校验 |
| Babel Standalone | 🟡 中 | 运行时编译、体积大 | 仅开发使用 |
| Fontshare | 🟢 低 | 字体 CDN | CSP 白名单 |

### YouTube 隐私增强

始终使用 `youtube-nocookie.com` 域名：

```html
<!-- ✅ 推荐 -->
<iframe src="https://www.youtube-nocookie.com/embed/VIDEO_ID"></iframe>

<!-- ❌ 不推荐 -->
<iframe src="https://www.youtube.com/embed/VIDEO_ID"></iframe>
```

### Babel Standalone 安全

```html
<!-- ⚠️ 仅开发使用 -->
<script src="https://unpkg.com/@babel/standalone@7.23.0/babel.min.js"></script>

<!-- ✅ 生产环境：使用构建工具预编译 -->
<!-- npm run build → 直接引入编译后的 JS -->
```

---

## 部署平台安全配置

### Vercel 安全头

在 `vercel.json` 中配置：

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" },
        { "key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains" }
      ]
    },
    {
      "source": "/styles/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/vendor/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

### EdgeOne 缓存与安全

在 EdgeOne 控制台配置：

**缓存规则：**

| 路径 | 缓存时间 | 说明 |
|------|---------|------|
| `/styles/*` | 1 年 | CSS 文件，带版本号 |
| `/vendor/*` | 1 年 | 字体/图片，带版本号 |
| `/components/*` | 1 天 | 组件模板 |
| `/features/*` | 1 天 | 功能脚本 |
| `/*.html` | 1 小时 | 页面 |
| `/` | 10 分钟 | 首页 |

**安全配置：**

| 项目 | 值 |
|------|-----|
| HTTPS | 始终开启 |
| HTTP/2 | 开启 |
| HTTP/3 (QUIC) | 开启 |
| Brotli 压缩 | 开启 |
| CC 防护 | 开启 |
| BOT 防护 | 开启 |

---

## 安全检查清单

### 上线前必查

- [ ] **CSP 已配置** — 至少配置 `default-src`、`script-src`、`img-src`、`frame-src`
- [ ] **所有 iframe 有 sandbox** — 值为 `allow-scripts allow-same-origin allow-popups`
- [ ] **CDN 脚本有 SRI** — React/Babel 等 CDN 引入必须校验完整性
- [ ] **无 API Key 泄露** — 前端代码不包含任何密钥
- [ ] **.gitignore 完整** — 排除 `.env`、`node_modules` 等
- [ ] **HTTPS 强制** — 所有请求重定向到 HTTPS
- [ ] **安全头已设置** — X-Content-Type-Options、X-Frame-Options 等
- [ ] **YouTube 使用 nocookie** — `youtube-nocookie.com` 域名
- [ ] **图片回退已配置** — 所有图片有 `data-fallback-1`
- [ ] **alt 文本完整** — 所有 `<img>` 有描述性 alt
- [ ] **Babel 不在生产使用** — 生产环境使用预编译 JS
- [ ] **第三方域名最小化** — CSP 白名单仅包含必要域名
- [ ] **Cookie SameSite** — 如使用 Cookie，设置 `SameSite=Strict` 或 `Lax`
- [ ] **控制台无错误** — 浏览器控制台无 CSP 违规报告
- [ ] **Lighthouse 安全审计通过** — 所有安全相关审计项通过

### 定期复查

- [ ] **依赖更新** — 每月检查 npm/pip 依赖安全更新
- [ ] **SRI 更新** — CDN 资源版本更新后重新生成 SRI hash
- [ ] **CSP 审计** — 每季度检查 CSP 是否需要调整
- [ ] **渗透测试** — 每半年进行一次安全扫描

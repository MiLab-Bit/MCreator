# 安全配置指南

> CSP、SRI、HTTPS 强制等安全最佳实践

---

## 一、CSP（内容安全策略）

### 什么是 CSP？

Content Security Policy（内容安全策略）用于限制浏览器可加载的资源来源，防止 XSS 攻击。

### 推荐配置

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 
    'self' 
    https://cdn.tailwindcss.com 
    https://unpkg.com 
    https://cdn.jsdelivr.net 
    https://cdnjs.cloudflare.com;
  style-src 
    'self' 
    'unsafe-inline' 
    https://cdn.tailwindcss.com 
    https://fonts.googleapis.com 
    https://api.fontshare.com;
  font-src 
    'self' 
    https://fonts.gstatic.com 
    https://api.fontshare.com;
  img-src 
    'self' 
    data: 
    https: 
    blob:;
  connect-src 
    'self' 
    https://*.aliyuncs.com 
    https://i.imgur.com;
  frame-src 
    'self' 
    https://player.bilibili.com 
    https://www.youtube.com 
    https://open.spotify.com;
  media-src 
    'self' 
    https: 
    blob:;
">
```

### 配置说明

| 指令 | 说明 | 允许来源 |
|------|------|---------|
| `default-src` | 默认策略 | 仅同源 |
| `script-src` | JavaScript 来源 | 可信 CDN |
| `style-src` | CSS 来源 | 可信 CDN + inline（Tailwind 需要） |
| `font-src` | 字体来源 | 可信字体 CDN |
| `img-src` | 图片来源 | 同源 + 所有 HTTPS + data URI |
| `connect-src` | XHR/Fetch 目标 | OSS/Imgur API |
| `frame-src` | iframe 来源 | B站/YouTube/Spotify |
| `media-src` | 音视频来源 | 所有 HTTPS |

### 动态生成 CSP

```javascript
// utils/csp.js
function generateCSP(config) {
  const { cdn, storage, embed } = config;
  
  const scriptSrc = [
    "'self'",
    ...cdn.scripts || []
  ].join(' ');
  
  const styleSrc = [
    "'self'",
    "'unsafe-inline'", // Tailwind 需要
    ...cdn.styles || []
  ].join(' ');
  
  const imgSrc = [
    "'self'",
    "data:",
    "https:",
    storage.oss,
    storage.imgur
  ].join(' ');
  
  return `
    default-src 'self';
    script-src ${scriptSrc};
    style-src ${styleSrc};
    img-src ${imgSrc};
  `.trim();
}
```

---

## 二、SRI（子资源完整性）

### 什么是 SRI？

Subresource Integrity（子资源完整性）通过加密哈希验证外部资源未被篡改。

### 使用方式

```html
<!-- 带 SRI 的 script 标签 -->
<script 
  src="https://cdn.tailwindcss.com/3.4.1"
  integrity="sha384-abc123..."
  crossorigin="anonymous"
></script>

<!-- 带 SRI 的 link 标签 -->
<link 
  rel="stylesheet" 
  href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism.min.css"
  integrity="sha384-def456..."
  crossorigin="anonymous"
>
```

### 生成 SRI 哈希

**方式一：CLI 命令**

```bash
# 生成单个文件的 SRI
site sri --file https://cdn.tailwindcss.com/3.4.1

# 批量生成并更新 HTML
site sri --update
```

**方式二：在线工具**

- https://www.srihash.org/
- 输入 CDN URL，自动生成完整标签

**方式三：命令行**

```bash
# 使用 openssl
curl -s https://cdn.tailwindcss.com/3.4.1 | \
  openssl dgst -sha384 -binary | \
  openssl base64 -A

# 输出：sha384-abc123...
```

### SRI 校验脚本

```javascript
// scripts/generate-sri.js
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

async function generateSRI(filePath) {
  const content = fs.readFileSync(filePath);
  const hash = crypto
    .createHash('sha384')
    .update(content)
    .digest('base64');
  
  return `sha384-${hash}`;
}

async function updateHTMLSRI(htmlPath) {
  let html = fs.readFileSync(htmlPath, 'utf-8');
  
  // 匹配所有带 src 的 script 标签
  html = html.replace(
    /<script src="([^"]+)"(?![^>]*integrity)/g,
    async (match, src) => {
      if (src.startsWith('http')) {
        const response = await fetch(src);
        const content = await response.text();
        const hash = crypto
          .createHash('sha384')
          .update(content)
          .digest('base64');
        
        return `<script src="${src}" integrity="sha384-${hash}" crossorigin="anonymous"`;
      }
      return match;
    }
  );
  
  fs.writeFileSync(htmlPath, html);
}
```

---

## 三、HTTPS 强制

### 方式一：Meta 标签（仅限当前页面）

```html
<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
```

### 方式二：服务器配置

**Nginx：**

```nginx
server {
    listen 80;
    server_name example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name example.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # HSTS（强制 HTTPS）
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
}
```

**Vercel/EdgeOne：**

自动强制 HTTPS，无需配置。

---

## 四、其他安全头

### 推荐配置

```html
<!-- 禁止 MIME 类型嗅探 -->
<meta http-equiv="X-Content-Type-Options" content="nosniff">

<!-- 禁止 iframe 嵌套（防点击劫持） -->
<meta http-equiv="X-Frame-Options" content="DENY">

<!-- XSS 保护（现代浏览器默认开启） -->
<meta http-equiv="X-XSS-Protection" content="1; mode=block">

<!-- 引用来源策略 -->
<meta name="referrer" content="strict-origin-when-cross-origin">
```

### Nginx 配置

```nginx
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
```

---

## 五、安全 Checklist

### 部署前检查

```
□ 配置 CSP（至少限制 script-src）
□ 外部资源添加 SRI
□ 强制 HTTPS（HSTS）
□ 设置安全响应头
□ 敏感信息不提交 Git（.gitignore）
□ OSS/CDN 访问权限最小化
□ API Key 不暴露在前端代码
```

### 定期检查

```
□ 依赖版本更新（安全漏洞）
□ CDN 可用性监控
□ CSP 违规报告分析
□ SSL 证书有效期
```

---

## 六、CSP 违规报告

### 启用报告

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  report-uri /csp-report;
">
```

### 报告处理

```javascript
// server.js (Node.js 示例)
app.post('/csp-report', (req, res) => {
  const report = req.body['csp-report'];
  
  console.error('CSP Violation:', {
    documentUri: report['document-uri'],
    violatedDirective: report['violated-directive'],
    blockedUri: report['blocked-uri'],
    originalPolicy: report['original-policy']
  });
  
  res.status(204).end();
});
```

---

## 七、常见问题

### Q: CSP 阻止了 Tailwind Play CDN？

A: Tailwind Play CDN 需要 `'unsafe-inline'` 在 `style-src` 中：

```html
style-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com;
```

### Q: SRI 导致 CDN 资源加载失败？

A: SRI 校验失败时浏览器会拒绝加载。确保：
1. 哈希值正确（使用工具生成）
2. 添加 `crossorigin="anonymous"` 属性
3. CDN 支持 CORS

### Q: 如何处理动态生成的脚本？

A: 动态脚本无法使用 SRI，可通过 CSP 的 `script-src` 限制来源：

```html
script-src 'self' 'unsafe-inline' https://trusted-cdn.com;
```

### Q: 本地开发时 CSP 太严格？

A: 使用环境变量区分：

```javascript
const csp = process.env.NODE_ENV === 'development'
  ? "default-src 'self' 'unsafe-inline' 'unsafe-eval';"
  : "default-src 'self'; script-src ...;";
```

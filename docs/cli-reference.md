# CLI 工具

> 零构建网站命令行工具

## 安装

```bash
# 全局安装
npm install -g mcreator-cli

# 或使用 npx
npx site --help
```

---

## 命令列表

| 命令 | 说明 |
|------|------|
| `site init` | 初始化新项目 |
| `site validate` | 验证配置文件 |
| `site upload` | 上传图片到 CDN |
| `site build` | 构建 Tailwind CSS |
| `site dev` | 启动开发服务器 |
| `site sri` | 生成 SRI 哈希 |
| `site clean` | 清理缓存 |

---

## site init

初始化新项目。

```bash
# 使用默认模板
site init

# 指定项目名称
site init --name my-portfolio

# 指定主题
site init --theme light

# 使用 React 模板
site init react
```

**选项：**

| 选项 | 说明 | 默认值 |
|------|------|--------|
| `-n, --name <name>` | 项目名称 | `my-site` |
| `-t, --theme <theme>` | 主题 (dark/light) | `dark` |

---

## site validate

验证 `site.config.json` 配置文件。

```bash
# 验证默认配置
site validate

# 指定配置文件
site validate --config custom.config.json

# 自动修复常见问题
site validate --fix
```

**选项：**

| 选项 | 说明 | 默认值 |
|------|------|--------|
| `-c, --config <path>` | 配置文件路径 | `site.config.json` |
| `--fix` | 自动修复常见问题 | `false` |

---

## site upload

上传图片到 OSS/CDN。

```bash
# 上传目录所有图片
site upload ./content/images/works

# 上传并备份到 Imgur
site upload ./content/images/works --backup

# 强制重新上传（忽略缓存）
site upload ./content/images/works --force

# 设置并发数
site upload ./content/images/works -c 10
```

**选项：**

| 选项 | 说明 | 默认值 |
|------|------|--------|
| `--backup` | 同步备份到 Imgur | `false` |
| `--force` | 强制重新上传 | `false` |
| `-c, --concurrency <n>` | 并发数量 | `5` |

**执行流程：**

```
1. 扫描目录所有图片 (.jpg/.png/.gif/.webp)
2. 检查 .site/cdn-mapping.json 缓存
3. 并发上传到阿里云 OSS
4. (--backup) 同步上传到 Imgur
5. 更新 cdn-mapping.json
6. 打印上传结果
```

---

## site build

构建 Tailwind CSS。

```bash
# 默认构建
site build

# 指定输入输出
site build -i styles/custom.css -o styles/output.css

# 压缩输出
site build --minify
```

**选项：**

| 选项 | 说明 | 默认值 |
|------|------|--------|
| `-i, --input <path>` | 输入文件 | `styles/input.css` |
| `-o, --output <path>` | 输出文件 | `styles/tailwind-built.css` |
| `--minify` | 压缩输出 | `false` |

---

## site dev

启动本地开发服务器。

```bash
# 默认端口 3000
site dev

# 指定端口
site dev -p 8080

# 自动打开浏览器
site dev --open
```

**选项：**

| 选项 | 说明 | 默认值 |
|------|------|--------|
| `-p, --port <port>` | 端口号 | `3000` |
| `-o, --open` | 自动打开浏览器 | `false` |

---

## site sri

生成 SRI（子资源完整性）哈希。

```bash
# 生成单个文件的 SRI
site sri --file https://cdn.tailwindcss.com/3.4.1

# 批量更新 HTML 中的 integrity 属性
site sri --update

# 指定目录
site sri --file ./vendor/js/
```

**选项：**

| 选项 | 说明 | 默认值 |
|------|------|--------|
| `-f, --file <path>` | 指定文件或 URL | - |
| `--update` | 更新 HTML 中的 integrity 属性 | `false` |

**输出示例：**

```
✓ sha384-abc123def456...
  integrity="sha384-abc123def456..."
  crossorigin="anonymous"
```

---

## site clean

清理缓存和临时文件。

```bash
# 清理所有缓存
site clean --all

# 仅清理上传缓存
site clean --uploads
```

**选项：**

| 选项 | 说明 | 默认值 |
|------|------|--------|
| `--all` | 清理所有缓存 | `false` |
| `--uploads` | 仅清理上传缓存 | `false` |

---

## 配置文件

CLI 读取 `site.config.json` 配置：

```json
{
  "site": {
    "name": "我的网站",
    "url": "https://example.com"
  },
  "storage": {
    "oss": {
      "bucket": "your-bucket",
      "region": "oss-cn-shanghai"
    },
    "imgur": {
      "clientId": "your-client-id"
    }
  },
  "cdn": {
    "scripts": [
      "https://cdn.tailwindcss.com"
    ],
    "styles": [
      "https://fonts.googleapis.com"
    ]
  }
}
```

---

## 环境变量

敏感信息通过环境变量配置：

```bash
# OSS 配置
export OSS_ACCESS_KEY_ID="your-access-key-id"
export OSS_ACCESS_KEY_SECRET="your-access-key-secret"

# Imgur 配置
export IMGUR_CLIENT_ID="your-client-id"
```

或使用 `.env` 文件：

```env
OSS_ACCESS_KEY_ID=your-access-key-id
OSS_ACCESS_KEY_SECRET=your-access-key-secret
IMGUR_CLIENT_ID=your-client-id
```

---

## 示例工作流

### 新项目初始化

```bash
# 1. 初始化项目
site init --name my-portfolio

# 2. 进入项目目录
cd my-portfolio

# 3. 验证配置
site validate

# 4. 构建样式
site build

# 5. 启动开发服务器
site dev --open
```

### 图片上传

```bash
# 1. 添加图片到 content/images/works/
cp ~/photos/*.jpg content/images/works/

# 2. 上传到 CDN
site upload ./content/images/works --backup

# 3. 查看映射结果
cat .site/cdn-mapping.json
```

### 部署前检查

```bash
# 1. 验证配置
site validate

# 2. 构建 CSS
site build --minify

# 3. 生成 SRI
site sri --update

# 4. 清理缓存
site clean --all

# 5. 提交代码
git add .
git commit -m "准备部署"
git push
```

# 组件 API 文档

MCreator 所有组件的完整 API 参考。

---

## 目录

- [样式系统](#样式系统)
  - [typography.css](#typographycss)
  - [standard-animations.css](#standard-animationscss)
  - [input.css (Tailwind)](#inputcss-tailwind)
- [工具函数库](#工具函数库)
  - [helpers.js](#helpersjs)
- [CN 组件](#cn-组件)
  - [OSS 图片](#oss-图片)
  - [网易云音乐播放器](#网易云音乐播放器)
  - [B站视频播放器](#b站视频播放器)
  - [微信公众号文章](#微信公众号文章)
- [Global 组件](#global-组件)
  - [Imgur 图片](#imgur-图片)
  - [Spotify 播放器](#spotify-播放器)
  - [YouTube 播放器](#youtube-播放器)
- [图片回退加载器](#图片回退加载器)
  - [image-fallback.js](#image-fallbackjs)
- [特色功能](#特色功能)
  - [鼠标聚光灯](#鼠标聚光灯)
  - [交互式画廊](#交互式画廊)
  - [纵向滚动文字流](#纵向滚动文字流)

---

## 样式系统

### typography.css

字体系统，支持三种方案。

**引入方式：**
```html
<link rel="stylesheet" href="styles/typography.css">
```

**CSS 变量：**

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `--font-body-cn` | `"PingFang SC", "Hiragino Sans GB", ...` | 中文正文字体栈 |
| `--font-display` | `"New York", "Georgia", "Songti SC", ...` | 展示字体（衬线） |
| `--font-body` | `var(--font-body-cn)` | 当前正文默认字体 |
| `--font-mono` | `"SF Mono", "Fira Code", ...` | 等宽字体 |

**方案切换：**

| 方案 | 说明 | 启用方式 |
|------|------|---------|
| A（默认） | 系统字体，零网络请求 | 无需操作 |
| B | 字体子集化 | 取消 `typography.css` 中方案 B 的注释 |
| C | 按地区按需加载 | 调用 `loadFontsForLocale()` |

**排版类：**

| 元素 | 字号 | 行高 |
|------|------|------|
| `h1` | 2.25rem (36px) | 1.2 |
| `h2` | 1.875rem (30px) | 1.25 |
| `h3` | 1.5rem (24px) | 1.3 |
| `h4` | 1.25rem (20px) | 1.4 |
| `h5` | 1.125rem (18px) | 1.4 |
| `h6` | 1rem (16px) | 1.5 |
| `p` | 继承 | 1.7 |

---

### standard-animations.css

标准动效库，所有网站统一复用。

**引入方式：**
```html
<link rel="stylesheet" href="styles/standard-animations.css">
```

**动画类一览：**

| 类名 | 效果 | 持续时间 |
|------|------|---------|
| `.hover-scale` | 悬停缩放 1.02 | 0.3s |
| `.hover-scale-lg` | 悬停缩放 1.05 | 0.3s |
| `.fade-in-up` | 入场渐显上移 | 0.6s |
| `.fade-in-up-delay-1` | 延迟 0.1s | 0.6s |
| `.fade-in-up-delay-2` | 延迟 0.2s | 0.6s |
| `.fade-in-up-delay-3` | 延迟 0.3s | 0.6s |
| `.animate-spin-slow` | 慢速旋转 | 8s |
| `.animate-spin-medium` | 中速旋转 | 4s |
| `.animate-paused` | 暂停动画 | — |
| `.animate-marquee-v` | 纵向滚动 | 50s |
| `.animate-marquee-h` | 横向滚动 | 30s |
| `.animate-pulse` | 脉冲 | 2s |
| `.animate-blink` | 闪烁 | 1s |
| `.animate-bounce` | 弹跳 | 1s |

**过渡类：**

| 类名 | 说明 |
|------|------|
| `.transition-all-300` | 全属性过渡 0.3s |
| `.transition-all-500` | 全属性过渡 0.5s |
| `.transition-colors` | 颜色过渡 0.3s |
| `.transition-opacity` | 透明度过渡 0.3s |
| `.transition-transform` | 变换过渡 0.3s |

**遮罩类：**

| 类名 | 说明 |
|------|------|
| `.mask-fade-bottom` | 底部渐隐 |
| `.mask-fade-top` | 顶部渐隐 |
| `.mask-fade-both` | 两端渐隐 |

**滚动触发类：**

```html
<div class="scroll-animate">滚动到此处时淡入</div>
```

需配合 JS 调用 `setupScrollAnimation()` 或手动添加 `.visible` 类。

---

### input.css (Tailwind)

Tailwind CSS 构建输入文件。

**引入方式：** 不直接引入，用于构建生成 `tailwind-built.css`。

**自定义组件类：**

| 类名 | 说明 |
|------|------|
| `.glass-card` | 玻璃拟态卡片（深色） |
| `.glass-card-light` | 玻璃拟态卡片（浅色） |
| `.btn` | 按钮基础样式 |
| `.btn-primary` | 主按钮 |
| `.btn-secondary` | 次按钮 |
| `.text-gradient` | 文字渐变 |
| `.scrollbar-hide` | 隐藏滚动条 |

---

## 工具函数库

### helpers.js

标准工具函数库，所有网站统一复用。

**引入方式：**
```html
<script src="utils/helpers.js"></script>
```

> ⚠️ 引入后自动初始化：懒加载、滚动动画、图片回退、动态 alt。

**函数签名：**

#### `setupLazyLoad(selector)`

通用懒加载器，处理 `data-src` 属性。

```javascript
// 默认选择器
setupLazyLoad();

// 自定义选择器
setupLazyLoad('.my-lazy-img');
```

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `selector` | string | `'[data-src]'` | CSS 选择器 |

#### `setupScrollAnimation(animationClass)`

滚动入场动画触发器。

```javascript
setupScrollAnimation('fade-in-up');
```

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `animationClass` | string | `'fade-in-up'` | 动画类名 |

#### `preloadImages(urls)`

图片预加载。

```javascript
await preloadImages(['img1.jpg', 'img2.jpg']);
```

| 参数 | 类型 | 说明 |
|------|------|------|
| `urls` | string[] | 图片 URL 数组 |
| 返回 | `Promise<void[]>` | 所有图片加载完成 |

#### `debounce(func, wait)`

防抖函数。

```javascript
const handleResize = debounce(() => {
  console.log('resized');
}, 300);
window.addEventListener('resize', handleResize);
```

| 参数 | 类型 | 说明 |
|------|------|------|
| `func` | Function | 要防抖的函数 |
| `wait` | number | 等待时间 (ms) |
| 返回 | Function | 防抖后的函数 |

#### `throttle(func, limit)`

节流函数。

```javascript
const handleScroll = throttle(() => {
  console.log('scrolling');
}, 100);
window.addEventListener('scroll', handleScroll);
```

| 参数 | 类型 | 说明 |
|------|------|------|
| `func` | Function | 要节流的函数 |
| `limit` | number | 时间限制 (ms) |
| 返回 | Function | 节流后的函数 |

#### `setupImageFallback()`

多级图片回退，处理 `data-fallback-1/2/3` 属性。自动初始化。

#### `setupDynamicAlt()`

动态 alt 文本，处理 `data-alt` 属性。自动初始化。

#### `loadFontsForLocale()`

按地区加载字体（方案 C）。检测中文环境，非中文加载 Fontshare Satoshi。

#### `smoothScrollTo(target, offset)`

平滑滚动。

```javascript
smoothScrollTo('#section', 80);
smoothScrollTo(element, 50);
```

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `target` | string \| HTMLElement | — | 目标 |
| `offset` | number | 0 | 偏移量 (px) |

#### `copyToClipboard(text)`

复制文本到剪贴板。

```javascript
const ok = await copyToClipboard('Hello');
```

| 参数 | 类型 | 说明 |
|------|------|------|
| `text` | string | 要复制的文本 |
| 返回 | `Promise<boolean>` | 是否成功 |

#### `getQueryParam(name)`

获取 URL 参数。

```javascript
const id = getQueryParam('id'); // ?id=123 → "123"
```

#### `setCSSVar(name, value, el)` / `getCSSVar(name, el)`

操作 CSS 变量。

```javascript
setCSSVar('color-primary', '#ff0000');
const val = getCSSVar('color-primary');
```

#### `isMobile()` / `isTouchDevice()`

设备检测。

```javascript
if (isMobile()) { /* 移动端逻辑 */ }
if (isTouchDevice()) { /* 触屏逻辑 */ }
```

#### `waitForElement(selector, timeout)`

等待 DOM 元素出现。

```javascript
const el = await waitForElement('.dynamic-content', 3000);
```

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `selector` | string | — | CSS 选择器 |
| `timeout` | number | 5000 | 超时 (ms) |
| 返回 | `Promise<Element>` | 找到的元素 |

---

## CN 组件

### OSS 图片

国内主存储方案，支持阿里云 OSS / 腾讯云 COS / 七牛云。

**引入方式：** 直接使用 HTML 片段。

**标准版本：**
```html
<img
  src="https://your-bucket.oss-cn-shanghai.aliyuncs.com/works/image.webp"
  alt="作品名称"
  loading="lazy"
  decoding="async"
>
```

**多级回退版本：**
```html
<img
  src="https://your-bucket.oss-cn-shanghai.aliyuncs.com/works/image.webp"
  data-fallback-1="https://i.imgur.com/xxx.webp"
  data-fallback-2="../vendor/images/image.jpg"
  alt="作品名称"
  loading="lazy"
  decoding="async"
>
```

**响应式版本（picture）：**
```html
<picture>
  <source srcset="image.webp 1600w, image-small.webp 800w"
          sizes="(max-width: 768px) 100vw, 50vw" type="image/webp">
  <source srcset="image.jpg 1600w, image-small.jpg 800w"
          sizes="(max-width: 768px) 100vw, 50vw" type="image/jpeg">
  <img src="image.jpg" alt="作品名称" loading="lazy">
</picture>
```

**占位符 + 懒加载版本：**
```html
<img
  src="data:image/svg+xml,..." 
  data-src="实际图片地址"
  data-fallback-1="备份1"
  data-fallback-2="备份2"
  alt="作品名称"
  decoding="async"
>
```

**数据属性：**

| 属性 | 说明 |
|------|------|
| `data-fallback-1` | 第一级回退源 |
| `data-fallback-2` | 第二级回退源 |
| `data-fallback-3` | 第三级回退源 |
| `data-alt` | 动态 alt 文本 |
| `data-src` | 懒加载真实地址 |
| `data-full` | 画廊全尺寸地址 |

---

### 网易云音乐播放器

**iframe 参数：**

| 参数 | 值 | 说明 |
|------|-----|------|
| `type` | `0` | 歌单 |
| | `1` | 专辑 |
| | `2` | 单曲 |
| `id` | 数字 | 音乐 ID |
| `auto` | `0` / `1` | 不自动/自动播放 |
| `height` | 数字 | 播放器高度（不含边框） |

**推荐高度：**

| 类型 | height 值 | iframe height |
|------|-----------|---------------|
| 单曲 | 66 | 86 |
| 歌单 | 430 | 450 |
| 专辑 | 430 | 450 |

**获取 ID：** 分享 → 复制链接 → 链接中 `id=` 后的数字。

---

### B站视频播放器

**iframe 参数：**

| 参数 | 值 | 说明 |
|------|-----|------|
| `bvid` | `BV1xx411c7mD` | BV 号（推荐） |
| `aid` | 数字 | AV 号（旧版） |
| `page` | 数字 | 分 P 编号（默认 1） |
| `high_quality` | `0` / `1` | 默认/最高画质 |
| `danmaku` | `0` / `1` | 关闭/开启弹幕 |
| `autoplay` | `0` / `1` | 不自动/自动播放 |

**响应式容器 CSS：**
```css
.bilibili-container {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 */
  height: 0;
  overflow: hidden;
  border-radius: 12px;
  background: #000;
}
.bilibili-container iframe {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  border: none;
}
```

**带封面版本：** 点击封面后加载播放器（优化首屏），使用 `loadBilibiliPlayer(this)` 函数。

---

### 微信公众号文章

三种卡片样式：

**1. 标准卡片** — 带封面图 + 标题 + 摘要 + 来源

**2. 简约卡片** — 图标 + 标题 + 摘要（无封面）

**3. 列表项** — 标题 + 日期 + 箭头

所有卡片链接格式：`https://mp.weixin.qq.com/s/文章永久链接`

**获取永久链接：** 公众号文章 → 右上角「...」 → 复制链接

---

## Global 组件

### Imgur 图片

海外备份方案，仅作为 OSS 失败时的回退。

**图片尺寸后缀：**

| 后缀 | 尺寸 |
|------|------|
| （无） | 原图 |
| `l` | 大图 1024px |
| `m` | 中图 640px |
| `s` | 小图 320px |
| `t` | 缩略图 160px |

**国内使用：** 仅作为 `data-fallback-1` 使用，不作为主图源。

---

### Spotify 播放器

**URL 格式：**

| 类型 | URL 路径 |
|------|---------|
| 单曲 | `embed/track/{TRACK_ID}` |
| 专辑 | `embed/album/{ALBUM_ID}` |
| 播放列表 | `embed/playlist/{PLAYLIST_ID}` |
| 艺术家 | `embed/artist/{ARTIST_ID}` |

**可选参数：**

| 参数 | 说明 |
|------|------|
| `theme=0` | 深色主题（默认） |
| `theme=1` | 浅色主题 |
| `view=compact` | 紧凑视图 |

**推荐高度：**

| 类型 | height |
|------|--------|
| 单曲（小） | 80 |
| 单曲（大） | 152 |
| 专辑/播放列表/艺术家 | 352 |

---

### YouTube 播放器

**URL 格式：** `https://www.youtube.com/embed/{VIDEO_ID}`

**隐私增强模式：** 使用 `youtube-nocookie.com` 替代 `youtube.com`

**常用参数：**

| 参数 | 说明 |
|------|------|
| `autoplay=1` | 自动播放 |
| `start=30` | 从第 30 秒开始 |
| `end=120` | 到第 120 秒结束 |
| `rel=0` | 不显示相关视频 |
| `modestbranding=1` | 减少品牌元素 |
| `controls=0` | 隐藏控制条 |
| `loop=1` | 循环播放 |

**封面图 URL：** `https://img.youtube.com/vi/{VIDEO_ID}/maxresdefault.jpg`

**带封面版本：** 使用 `loadYouTubePlayer(this)` 函数，点击后加载播放器。

---

## 图片回退加载器

### image-fallback.js

多级图片回退 + WebP 检测 + 响应式选择。

**引入方式：**
```html
<script src="components/image-fallback.js"></script>
```

> ⚠️ 引入后自动初始化 `setupImageFallback()`。

**函数签名：**

#### `setupImageFallback()`

自动处理所有带 `data-fallback-1/2/3` 的图片。自动初始化。

#### `checkImageAvailable(url)`

检测图片是否可用。

```javascript
const ok = await checkImageAvailable('https://example.com/img.jpg');
```

| 参数 | 类型 | 说明 |
|------|------|------|
| `url` | string | 图片 URL |
| 返回 | `Promise<boolean>` | 是否可用 |

#### `selectBestImageSource(sources, timeout)`

并行检测所有源，返回最快响应的可用源。

```javascript
const best = await selectBestImageSource([
  'https://oss.example.com/img.webp',
  'https://i.imgur.com/xxx.jpg',
  '../vendor/images/img.jpg'
], 3000);
```

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `sources` | string[] | — | 图片源数组 |
| `timeout` | number | 3000 | 超时 (ms) |
| 返回 | `Promise<string\|null>` | 最优源 URL |

#### `preloadImagesWithProgress(urls, onProgress)`

批量预加载。

```javascript
await preloadImagesWithProgress(
  ['img1.jpg', 'img2.jpg', 'img3.jpg'],
  (loaded, total) => console.log(`${loaded}/${total}`)
);
```

#### `getResponsiveImageSource(sources)`

根据屏幕宽度选择图片。

```javascript
const src = getResponsiveImageSource({
  small: 'img-640.jpg',
  medium: 'img-1024.jpg',
  large: 'img-1600.jpg'
});
```

#### `supportsWebP()`

检测 WebP 支持。

```javascript
const ok = await supportsWebP();
```

#### `getOptimalFormatSource(sources)`

自动选择最优格式。

```javascript
const src = await getOptimalFormatSource({
  webp: 'img.webp',
  jpg: 'img.jpg',
  png: 'img.png'
});
```

---

## 特色功能

### 鼠标聚光灯

**引入方式：**
```html
<link rel="stylesheet" href="features/spotlight-cursor/spotlight-cursor.css">
<script src="features/spotlight-cursor/spotlight-cursor.js"></script>
```

**快速初始化：**
```html
<body data-spotlight>
```

**手动初始化：**
```javascript
const spotlight = initSpotlightCursor({
  radius: 200,
  color: 'rgba(255, 255, 255, 0.08)'
});
```

**配置选项：**

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `radius` | number | 200 | 聚光灯半径 (px) |
| `color` | string | `'rgba(255,255,255,0.08)'` | 聚光灯颜色 |
| `blur` | number | 0.5 | 边缘模糊 (0-1) |
| `showRing` | boolean | true | 显示外圈 |
| `ringColor` | string | `'rgba(255,255,255,0.15)'` | 外圈颜色 |
| `ringWidth` | number | 1 | 外圈宽度 (px) |
| `transitionDuration` | number | 150 | 过渡时间 (ms) |
| `disableOnMobile` | boolean | true | 移动端禁用 |
| `zIndex` | number | 9999 | z-index |

**CSS 主题类：** `spotlight-theme-light` / `blue` / `purple` / `gold`

**CSS 尺寸类：** `spotlight-size-sm` / `md` / `lg` / `xl`

**API 方法：** `show()` / `hide()` / `updateConfig(obj)` / `destroy()`

---

### 交互式画廊

**引入方式：**
```html
<script src="features/interactive-gallery/interactive-gallery.js"></script>
```

**HTML 结构：**
```html
<div class="gallery-container">
  <img class="gallery-item" src="thumb.jpg" data-full="full.jpg" alt="描述">
</div>
```

**初始化：**
```javascript
const gallery = initInteractiveGallery({
  containerSelector: '.gallery-container',
  itemSelector: '.gallery-item'
});
```

**配置选项：**

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `containerSelector` | string | `'.gallery-container'` | 容器选择器 |
| `itemSelector` | string | `'.gallery-item'` | 图片项选择器 |
| `enableKeyboard` | boolean | true | 键盘导航 |
| `enableTouch` | boolean | true | 触摸滑动 |
| `showCounter` | boolean | true | 显示计数器 |
| `showThumbnails` | boolean | false | 显示缩略图 |
| `backdropOpacity` | number | 0.95 | 背景透明度 |
| `animationDuration` | number | 300 | 动画时间 (ms) |

**交互方式：** 鼠标点击 / 键盘 ←→ Esc / 触摸滑动

**API 方法：** `open(index)` / `close()` / `prev()` / `next()` / `goTo(index)` / `destroy()`

**自定义事件：**

| 事件 | detail | 说明 |
|------|--------|------|
| `gallery:open` | `{ index }` | 画廊打开 |
| `gallery:close` | — | 画廊关闭 |

---

### 纵向滚动文字流

**引入方式：**
```html
<link rel="stylesheet" href="features/vertical-marquee/vertical-marquee.css">
<script src="features/vertical-marquee/vertical-marquee.js"></script>
```

**HTML 结构：**
```html
<div class="marquee-container">
  <div class="marquee-content">
    <p>第一行</p>
    <p>第二行</p>
  </div>
</div>
```

**初始化：**
```javascript
const marquee = initVerticalMarquee({
  speed: 50,
  pauseOnHover: true
});
```

**配置选项：**

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `containerSelector` | string | `'.marquee-container'` | 容器选择器 |
| `contentSelector` | string | `'.marquee-content'` | 内容选择器 |
| `speed` | number | 50 | 滚动速度 (px/s) |
| `autoPlay` | boolean | true | 自动播放 |
| `pauseOnHover` | boolean | true | 悬停暂停 |
| `showProgress` | boolean | false | 显示进度条 |
| `loop` | boolean | true | 循环 |
| `loopDelay` | number | 2000 | 循环间隔 (ms) |
| `maskHeight` | number | 60 | 遮罩高度 (px) |

**CSS 遮罩类：** `marquee-no-mask` / `mask-sm` / `mask-md` / `mask-lg`

**CSS 内容样式：** `marquee-lyrics` / `marquee-announcements`

**API 方法：** `play()` / `pause()` / `resume()` / `stop()` / `scrollTo(px)` / `scrollToProgress(0-1)` / `setSpeed(px/s)` / `updateContent()` / `destroy()`

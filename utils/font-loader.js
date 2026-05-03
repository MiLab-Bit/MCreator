/* ============================================
   字体策略加载器
   根据 site.config.json 的 fonts.strategy 动态加载字体
   策略 A: 系统字体（无需加载）
   策略 B: 本地子集化字体（加载 vendor/fonts/）
   策略 C: 按地区 CDN 加载（加载 Google Fonts 等）
   ============================================ */

/**
 * 加载字体策略
 * @param {string} strategy - 策略名称：A / B / C
 * @param {object} fontConfig - fonts 配置对象（来自 site.config.json）
 */
function loadFontStrategy(strategy = 'A', fontConfig = {}) {
  console.log(`[FontLoader] 加载字体策略: ${strategy}`);

  switch (strategy) {
    case 'A':
      // 策略 A：系统字体，无需加载
      console.log('[FontLoader] 策略 A - 使用系统字体，零网络请求');
      break;

    case 'B':
      // 策略 B：本地子集化字体
      loadLocalFonts(fontConfig);
      break;

    case 'C':
      // 策略 C：按地区按需加载 CDN 字体
      loadCdnFonts(fontConfig);
      break;

    default:
      console.warn(`[FontLoader] 未知策略 "${strategy}"，使用策略 A（系统字体）`);
  }
}

/**
 * 策略 B：加载本地子集化字体
 * @param {object} fontConfig
 */
function loadLocalFonts(fontConfig = {}) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  // 默认使用 Noto Serif SC 子集化版本
  const fontPath = fontConfig.localPath || '../vendor/fonts/NotoSerifSC-subset.woff2';
  // 注意：woff2 文件需要实际存在才能加载，此处仅做演示
  // 实际项目中请使用 @font-face 在 CSS 中定义
  console.log('[FontLoader] 策略 B - 加载本地子集化字体:', fontPath);
}

/**
 * 策略 C：按地区加载 CDN 字体
 * @param {object} fontConfig
 */
function loadCdnFonts(fontConfig = {}) {
  const head = document.head || document.getElementsByTagName('head')[0];

  // 英文用户：Fontshare Satoshi
  const fontshareLink = document.createElement('link');
  fontshareLink.rel = 'stylesheet';
  fontshareLink.href = 'https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap';
  head.appendChild(fontshareLink);

  // 中文用户：Google Fonts Noto Serif SC
  const notoLink = document.createElement('link');
  notoLink.rel = 'stylesheet';
  notoLink.href = 'https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;700&display=swap';
  head.appendChild(notoLink);

  console.log('[FontLoader] 策略 C - 加载 CDN 字体（Fontshare + Noto Serif SC）');
}

/**
 * 初始化字体策略
 * 从 site.config.json 读取配置（需在页面中内联或 fetch 获取）
 */
function initFontLoader() {
  // 方式 1: 从页面内联的配置读取（推荐）
  const configEl = document.querySelector('#site-config-data');
  if (configEl) {
    try {
      const config = JSON.parse(configEl.textContent);
      const strategy = config.theme?.fonts?.strategy || 'A';
      loadFontStrategy(strategy, config.theme?.fonts);
      return;
    } catch (e) {
      console.warn('[FontLoader] 配置解析失败，使用策略 A');
    }
  }

  // 方式 2: 尝试从相对路径加载（需配置 CORS）
  fetch('./site.config.json')
    .then(r => r.json())
    .then(config => {
      const strategy = config.theme?.fonts?.strategy || 'A';
      loadFontStrategy(strategy, config.theme?.fonts);
    })
    .catch(() => {
      console.log('[FontLoader] 未能加载配置，使用策略 A（系统字体）');
    });
}

// 自动初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFontLoader);
} else {
  initFontLoader();
}
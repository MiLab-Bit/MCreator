/* ============================================
   图片多级回退加载器
   支持 OSS → Imgur → 本地 三级回退
   ============================================ */

/**
 * 初始化图片多级回退
 * 支持 data-fallback-1, data-fallback-2, data-fallback-3 属性
 * 
 * 使用示例：
 * <img 
 *   src="https://oss.example.com/image.jpg"
 *   data-fallback-1="https://i.imgur.com/xxx.jpg"
 *   data-fallback-2="../vendor/images/image.jpg"
 *   alt="作品名称"
 * >
 */

async function setupImageFallback() {
  const supported = await supportsWebP();
  if (supported) document.documentElement.classList.add('webp-supported');
  const images = document.querySelectorAll('img[data-fallback-1], img[data-fallback-2], img[data-fallback-3]');
  
  images.forEach(img => {
    // 收集所有回退源
    const fallbacks = [
      img.dataset.fallback1,
      img.dataset.fallback2,
      img.dataset.fallback3
    ].filter(Boolean);
    
    // 如果没有回退源，跳过
    if (fallbacks.length === 0) return;
    
    let currentLevel = 0;
    const originalSrc = img.src;
    
    // 错误处理函数
    const handleError = () => {
      if (currentLevel < fallbacks.length) {
        // 尝试下一级回退
        const nextSrc = fallbacks[currentLevel];
        console.log(`[Image Fallback] Level ${currentLevel + 1}: ${nextSrc}`);
        img.src = nextSrc;
        currentLevel++;
      } else {
        // 所有源都失败，显示占位
        showPlaceholder(img);
        console.warn('[Image Fallback] All sources failed:', originalSrc);
      }
    };
    
    // 监听错误事件
    img.addEventListener('error', handleError);
    
    // 如果图片已经加载失败，立即触发回退
    if (img.complete && img.naturalHeight === 0) {
      handleError();
    }
  });
}

/**
 * 显示占位图
 * @param {HTMLImageElement} img - 图片元素
 */
function showPlaceholder(img) {
  // 设置占位样式
  img.style.background = 'linear-gradient(135deg, #f4f2ed 0%, #e8e4db 100%)';
  img.style.minHeight = '200px';
  img.style.display = 'flex';
  img.style.alignItems = 'center';
  img.style.justifyContent = 'center';
  
  // 如果没有 alt 文本，添加提示
  if (!img.alt || img.alt === '') {
    img.alt = '图片加载失败';
  }
  
  // 添加错误类（可用于自定义样式）
  img.classList.add('image-load-error');
}

/**
 * 预检查图片源可用性
 * @param {string} url - 图片 URL
 * @returns {Promise<boolean>} 是否可用
 */
function checkImageAvailable(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

/**
 * 智能选择最优图片源
 * 并行检测所有源，返回最快响应的可用源
 * @param {string[]} sources - 图片源数组
 * @param {number} timeout - 超时时间(ms)
 * @returns {Promise<string|null>} 最优源
 */
async function selectBestImageSource(sources, timeout = 3000) {
  const results = await Promise.all(
    sources.map(async (src) => {
      const start = Date.now();
      const available = await Promise.race([
        checkImageAvailable(src),
        new Promise((resolve) => setTimeout(() => resolve(false), timeout))
      ]);
      const latency = Date.now() - start;
      
      return { src, available, latency };
    })
  );
  
  // 筛选可用源，按延迟排序
  const available = results
    .filter(r => r.available)
    .sort((a, b) => a.latency - b.latency);
  
  return available.length > 0 ? available[0].src : null;
}

/**
 * 批量预加载图片
 * @param {string[]} urls - 图片 URL 数组
 * @param {Function} onProgress - 进度回调 (loaded, total)
 * @returns {Promise<void>}
 */
async function preloadImagesWithProgress(urls, onProgress) {
  let loaded = 0;
  const total = urls.length;
  
  await Promise.all(
    urls.map(url => 
      new Promise((resolve) => {
        const img = new Image();
        img.onload = img.onerror = () => {
          loaded++;
          if (onProgress) onProgress(loaded, total);
          resolve();
        };
        img.src = url;
      })
    )
  );
}

/**
 * 响应式图片加载
 * 根据屏幕宽度选择合适的图片尺寸
 * @param {Object} sources - 图片源对象 { small, medium, large }
 * @returns {string} 合适的图片源
 */
function getResponsiveImageSource(sources) {
  const width = window.innerWidth;
  
  if (width < 640 && sources.small) {
    return sources.small;
  } else if (width < 1024 && sources.medium) {
    return sources.medium;
  } else {
    return sources.large || sources.medium || sources.small;
  }
}

// WebP 支持缓存（闭包变量）
let _supportsWebP = null;

/**
 * WebP 支持检测
 * @returns {Promise<boolean>}
 */
async function supportsWebP() {
  if (_supportsWebP !== null) {
    return _supportsWebP;
  }
  
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      _supportsWebP = img.width > 0 && img.height > 0;
      resolve(_supportsWebP);
    };
    img.onerror = () => {
      _supportsWebP = false;
      resolve(false);
    };
    img.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';
  });
}

/**
 * 自动选择最优格式
 * @param {Object} sources - 图片源对象 { webp, jpg, png }
 * @returns {Promise<string>} 最优图片源
 */
async function getOptimalFormatSource(sources) {
  const webpSupported = await supportsWebP();
  
  if (webpSupported && sources.webp) {
    return sources.webp;
  }
  
  return sources.jpg || sources.png || sources.webp;
}

// 标记已加载，避免 helpers.js 重复初始化
window.imageFallbackLoaded = true;

// 自动初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupImageFallback);
} else {
  setupImageFallback();
}

// 导出函数（供外部调用）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    setupImageFallback,
    checkImageAvailable,
    selectBestImageSource,
    preloadImagesWithProgress,
    getResponsiveImageSource,
    supportsWebP,
    getOptimalFormatSource
  };
}

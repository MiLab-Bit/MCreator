/* ============================================
   标准工具函数库 - 所有网站统一复用
   ============================================ */

/**
 * 通用懒加载器 - 自动处理所有带 data-src 的元素
 * @param {string} selector - CSS选择器
 */
function setupLazyLoad(selector = '[data-src]') {
  if (!('IntersectionObserver' in window)) {
    // 降级处理：直接加载所有
    document.querySelectorAll(selector).forEach(el => {
      if (el.dataset.src) el.src = el.dataset.src;
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        if (el.dataset.src) {
          el.src = el.dataset.src;
          delete el.dataset.src;
        }
        observer.unobserve(el);
      }
    });
  }, { rootMargin: '200px' });
  
  document.querySelectorAll(selector).forEach(el => observer.observe(el));
}

/**
 * 滚动入场动画触发器
 * @param {string} animationClass - 动画类名
 */
function setupScrollAnimation(animationClass = 'fade-in-up') {
  if (!('IntersectionObserver' in window)) {
    // 降级处理：直接显示所有
    document.querySelectorAll(`.${animationClass}-trigger`).forEach(el => {
      el.classList.add(animationClass);
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add(animationClass);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll(`.${animationClass}-trigger`).forEach(el => {
    observer.observe(el);
  });
}

/**
 * 图片预加载器
 * @param {string[]} urls - 图片URL数组
 * @returns {Promise<void[]>} 所有图片加载完成的Promise
 */
function preloadImages(urls) {
  return Promise.all(
    urls.map(url => new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = resolve;
      img.onerror = reject;
      img.src = url;
    }))
  );
}

/**
 * 防抖函数
 * @param {Function} func - 要防抖的函数
 * @param {number} wait - 等待时间(ms)
 * @param {boolean} immediate - 是否立即执行
 * @returns {Function} 防抖后的函数
 */
function debounce(func, wait, immediate = false) {
  let timeout;
  return function executedFunction(...args) {
    const context = this;
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

/**
 * 节流函数
 * @param {Function} func - 要节流的函数
 * @param {number} limit - 时间限制(ms)
 * @returns {Function} 节流后的函数
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * 多级图片回退加载器（兼容层）
 * 
 * ⚠️ 完整版请使用 components/image-fallback.js
 * 此处仅做兜底检查，避免重复初始化
 */
function setupImageFallback() {
  if (window.imageFallbackLoaded) return;
  console.warn('[Helpers] 图片回退完整实现请使用 components/image-fallback.js');
}

/**
 * 动态 alt 文本设置
 * 支持 data-alt 属性延迟设置 alt
 */
function setupDynamicAlt() {
  document.querySelectorAll('img[data-alt]').forEach(img => {
    if (!img.alt || img.alt === '') {
      img.alt = img.dataset.alt;
    }
  });
}

/**
 * 按地区加载字体（方案 C）
 * 根据用户语言自动加载合适的字体
 */
function loadFontsForLocale() {
  const lang = navigator.language || 'zh';
  const isChinese = lang.startsWith('zh') || 
    /[\u4e00-\u9fff]/.test(document.title);
  
  if (!isChinese) {
    // 英文用户加载 Fontshare Satoshi（国内可访问）
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap';
    document.head.appendChild(link);
  }
}

/**
 * 平滑滚动到指定位置
 * @param {string|HTMLElement} target - 目标元素或选择器
 * @param {number} offset - 偏移量(px)
 */
function smoothScrollTo(target, offset = 0) {
  const el = typeof target === 'string' 
    ? document.querySelector(target) 
    : target;
  
  if (!el) return;
  
  const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
  
  window.scrollTo({
    top,
    behavior: 'smooth'
  });
}

/**
 * 复制文本到剪贴板
 * @param {string} text - 要复制的文本
 * @returns {Promise<boolean>} 是否成功
 */
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // 降级方案
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  }
}

/**
 * 获取 URL 参数
 * @param {string} name - 参数名
 * @returns {string|null} 参数值
 */
function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

/**
 * 设置 CSS 变量
 * @param {string} name - 变量名（不含 --）
 * @param {string} value - 变量值
 * @param {HTMLElement} el - 目标元素，默认 document.documentElement
 */
function setCSSVar(name, value, el = document.documentElement) {
  el.style.setProperty(`--${name}`, value);
}

/**
 * 获取 CSS 变量
 * @param {string} name - 变量名（不含 --）
 * @param {HTMLElement} el - 目标元素，默认 document.documentElement
 * @returns {string} 变量值
 */
function getCSSVar(name, el = document.documentElement) {
  return getComputedStyle(el).getPropertyValue(`--${name}`).trim();
}

/**
 * 检测是否为移动设备
 * @returns {boolean}
 */
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * 检测是否支持触摸
 * @returns {boolean}
 */
function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * 等待 DOM 元素出现
 * @param {string} selector - CSS 选择器
 * @param {number} timeout - 超时时间(ms)
 * @returns {Promise<Element>}
 */
function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const el = document.querySelector(selector);
    if (el) return resolve(el);
    
    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        observer.disconnect();
        resolve(el);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Element ${selector} not found within ${timeout}ms`));
    }, timeout);
  });
}

/**
 * 初始化所有通用功能
 */
function initHelpers() {
  setupLazyLoad();
  setupScrollAnimation();
  setupDynamicAlt();
}

// 自动初始化（DOMContentLoaded）
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHelpers);
} else {
  initHelpers();
}

// 导出 CommonJS 模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { debounce, throttle };
}

// 全局暴露（提升 <script> 标签兼容性）
if (typeof window !== 'undefined') {
  window.helpers = { debounce, throttle };
}

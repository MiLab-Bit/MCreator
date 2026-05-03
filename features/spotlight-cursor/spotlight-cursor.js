/* ============================================
   鼠标聚光灯效果
   在鼠标位置创建跟随的聚光灯效果
   适合深色背景的展示页面
   ============================================ */

/**
 * 鼠标聚光灯效果类
 */
class SpotlightCursor {
  constructor(options = {}) {
    // 默认配置
    this.config = {
      // 聚光灯半径（像素）
      radius: options.radius || 200,
      // 聚光灯颜色（CSS 颜色值）
      color: options.color || 'rgba(255, 255, 255, 0.08)',
      // 边缘模糊强度（0-1）
      blur: options.blur || 0.5,
      // 是否显示外圈
      showRing: options.showRing !== false,
      // 外圈颜色
      ringColor: options.ringColor || 'rgba(255, 255, 255, 0.15)',
      // 外圈宽度
      ringWidth: options.ringWidth || 1,
      // 平滑过渡时间（毫秒）
      transitionDuration: options.transitionDuration || 150,
      // 是否在移动设备上禁用
      disableOnMobile: options.disableOnMobile !== false,
      // 目标容器（默认为 body）
      container: options.container || document.body,
      // z-index
      zIndex: options.zIndex || 9999
    };
    
    // 状态
    this.isActive = false;
    this.mousePosition = { x: 0, y: 0 };
    this.targetPosition = { x: 0, y: 0 };
    this.spotlightEl = null;
    this.ringEl = null;
    this.animationFrame = null;
    
    // 检测移动设备
    if (this.config.disableOnMobile && this.isMobile()) {
      console.log('[Spotlight] Disabled on mobile device');
      return;
    }
    
    // 自动初始化
    if (options.autoInit !== false) {
      this.init();
    }
  }
  
  /**
   * 检测移动设备
   */
  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || 'ontouchstart' in window;
  }
  
  /**
   * 初始化聚光灯
   */
  init() {
    if (this.isActive) return;
    
    this.createElements();
    this.bindEvents();
    this.isActive = true;
    
    console.log('[Spotlight] Initialized');
  }
  
  /**
   * 创建 DOM 元素
   */
  createElements() {
    // 创建聚光灯元素
    this.spotlightEl = document.createElement('div');
    this.spotlightEl.className = 'spotlight-cursor';
    this.spotlightEl.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: ${this.config.radius * 2}px;
      height: ${this.config.radius * 2}px;
      border-radius: 50%;
      background: radial-gradient(
        circle,
        ${this.config.color} 0%,
        transparent ${100 * this.config.blur}%
      );
      pointer-events: none;
      z-index: ${this.config.zIndex};
      transform: translate(-50%, -50%);
      opacity: 0;
      transition: opacity ${this.config.transitionDuration}ms ease;
      will-change: transform, opacity;
    `;
    
    // 创建外圈元素
    if (this.config.showRing) {
      this.ringEl = document.createElement('div');
      this.ringEl.className = 'spotlight-ring';
      this.ringEl.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: ${this.config.radius * 2}px;
        height: ${this.config.radius * 2}px;
        border-radius: 50%;
        border: ${this.config.ringWidth}px solid ${this.config.ringColor};
        pointer-events: none;
        z-index: ${this.config.zIndex};
        transform: translate(-50%, -50%);
        opacity: 0;
        transition: opacity ${this.config.transitionDuration}ms ease;
        will-change: transform, opacity;
      `;
    }
    
    // 添加到容器
    this.config.container.appendChild(this.spotlightEl);
    if (this.ringEl) {
      this.config.container.appendChild(this.ringEl);
    }
  }
  
  /**
   * 绑定事件
   */
  bindEvents() {
    // 鼠标移动 - 使用 passive 提升性能
    this.handleMouseMove = (e) => {
      this.targetPosition.x = e.clientX;
      this.targetPosition.y = e.clientY;
      
      // 鼠标移动时重启动画循环
      if (!this.animationFrame) {
        this.animationFrame = requestAnimationFrame(() => this.update());
      }
    };
    
    // 鼠标离开
    this.handleMouseLeave = () => {
      this.hide();
    };
    
    document.addEventListener('mousemove', this.handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', this.handleMouseLeave);
    
    // 初始显示
    this.show();
  }
  
  /**
   * 更新位置（动画帧）
   */
  update() {
    // 平滑插值
    const smoothing = 0.15;
    const dx = this.targetPosition.x - this.mousePosition.x;
    const dy = this.targetPosition.y - this.mousePosition.y;
    
    // 阈值判断：鼠标静止时停止动画
    const threshold = 0.5;
    const isMoving = Math.abs(dx) > threshold || Math.abs(dy) > threshold;
    
    if (isMoving) {
      this.mousePosition.x += dx * smoothing;
      this.mousePosition.y += dy * smoothing;
      
      // 应用位置
      const transform = `translate(${this.mousePosition.x - this.config.radius}px, ${this.mousePosition.y - this.config.radius}px)`;
      
      this.spotlightEl.style.transform = transform;
      if (this.ringEl) {
        this.ringEl.style.transform = transform;
      }
      
      // 继续动画
      this.animationFrame = requestAnimationFrame(() => this.update());
    } else {
      // 停止动画循环
      this.animationFrame = null;
    }
  }
  
  /**
   * 显示聚光灯
   */
  show() {
    if (this.spotlightEl) {
      this.spotlightEl.style.opacity = '1';
    }
    if (this.ringEl) {
      this.ringEl.style.opacity = '1';
    }
  }
  
  /**
   * 隐藏聚光灯
   */
  hide() {
    if (this.spotlightEl) {
      this.spotlightEl.style.opacity = '0';
    }
    if (this.ringEl) {
      this.ringEl.style.opacity = '0';
    }
  }
  
  /**
   * 更新配置
   */
  updateConfig(newConfig) {
    Object.assign(this.config, newConfig);
    
    // 更新元素样式
    if (this.spotlightEl) {
      this.spotlightEl.style.width = `${this.config.radius * 2}px`;
      this.spotlightEl.style.height = `${this.config.radius * 2}px`;
      this.spotlightEl.style.background = `radial-gradient(
        circle,
        ${this.config.color} 0%,
        transparent ${100 * this.config.blur}%
      )`;
    }
    
    if (this.ringEl) {
      this.ringEl.style.width = `${this.config.radius * 2}px`;
      this.ringEl.style.height = `${this.config.radius * 2}px`;
      this.ringEl.style.borderColor = this.config.ringColor;
      this.ringEl.style.borderWidth = `${this.config.ringWidth}px`;
    }
  }
  
  /**
   * 销毁聚光灯
   */
  destroy() {
    if (!this.isActive) return;
    
    // 移除事件
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseenter', this.handleMouseEnter);
    document.removeEventListener('mouseleave', this.handleMouseLeave);
    
    // 取消动画帧
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    
    // 移除元素
    if (this.spotlightEl) {
      this.spotlightEl.remove();
    }
    if (this.ringEl) {
      this.ringEl.remove();
    }
    
    this.isActive = false;
    console.log('[Spotlight] Destroyed');
  }
}

/**
 * 快速初始化函数
 */
function initSpotlightCursor(options = {}) {
  return new SpotlightCursor(options);
}

// 自动初始化（如果页面有 data-spotlight 属性）
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.body.hasAttribute('data-spotlight')) {
      const config = {};
      
      // 从 data 属性读取配置
      const radius = document.body.getAttribute('data-spotlight-radius');
      if (radius) config.radius = parseInt(radius);
      
      const color = document.body.getAttribute('data-spotlight-color');
      if (color) config.color = color;
      
      initSpotlightCursor(config);
    }
  });
} else {
  if (document.body.hasAttribute('data-spotlight')) {
    initSpotlightCursor();
  }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SpotlightCursor, initSpotlightCursor };
}

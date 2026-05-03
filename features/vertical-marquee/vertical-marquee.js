/* ============================================
   纵向滚动文字流
   适合歌词、字幕、公告等垂直滚动内容
   ============================================ */

/**
 * 纵向滚动文字流类
 */
class VerticalMarquee {
  constructor(options = {}) {
    // 默认配置
    this.config = {
      // 容器选择器
      containerSelector: options.containerSelector || '.marquee-container',
      // 内容选择器
      contentSelector: options.contentSelector || '.marquee-content',
      // 滚动速度（像素/秒）
      speed: options.speed || 50,
      // 是否自动播放
      autoPlay: options.autoPlay !== false,
      // 是否暂停 on hover
      pauseOnHover: options.pauseOnHover !== false,
      // 是否显示进度条
      showProgress: options.showProgress || false,
      // 是否循环
      loop: options.loop !== false,
      // 循环间隔（毫秒）
      loopDelay: options.loopDelay || 2000,
      // 渐变遮罩高度（像素）
      maskHeight: options.maskHeight || 60,
      // 是否平滑滚动
      smoothScroll: options.smoothScroll !== false
    };
    
    // 状态
    this.isPlaying = false;
    this.isPaused = false;
    this.currentPosition = 0;
    this.containerEl = null;
    this.contentEl = null;
    this.progressEl = null;
    this.animationFrame = null;
    this.lastTimestamp = 0;
    this.contentHeight = 0;
    this.containerHeight = 0;
    this.loopTimeoutId = null; // 用于取消循环延迟
    
    // 自动初始化
    if (options.autoInit !== false) {
      this.init();
    }
  }
  
  /**
   * 初始化
   */
  init() {
    // 获取容器
    this.containerEl = document.querySelector(this.config.containerSelector);
    if (!this.containerEl) {
      console.warn('[Marquee] Container not found:', this.config.containerSelector);
      return;
    }
    
    // 获取内容
    this.contentEl = this.containerEl.querySelector(this.config.contentSelector);
    if (!this.contentEl) {
      console.warn('[Marquee] Content not found:', this.config.contentSelector);
      return;
    }
    
    // 计算尺寸
    this.updateDimensions();
    
    // 应用样式
    this.applyStyles();
    
    // 创建进度条
    if (this.config.showProgress) {
      this.createProgressBar();
    }
    
    // 绑定事件
    this.bindEvents();
    
    // 自动播放
    if (this.config.autoPlay) {
      this.play();
    }
    
    console.log('[Marquee] Initialized');
  }
  
  /**
   * 更新尺寸
   */
  updateDimensions() {
    this.containerHeight = this.containerEl.clientHeight;
    this.contentHeight = this.contentEl.scrollHeight;
  }
  
  /**
   * 应用样式
   */
  applyStyles() {
    // 容器样式
    this.containerEl.style.cssText += `
      overflow: hidden;
      position: relative;
    `;
    
    // 内容样式
    this.contentEl.style.cssText += `
      will-change: transform;
    `;
    
    // 渐变遮罩
    if (this.config.maskHeight > 0) {
      const maskImage = `linear-gradient(
        to bottom,
        transparent 0%,
        black ${this.config.maskHeight}px,
        black calc(100% - ${this.config.maskHeight}px),
        transparent 100%
      )`;
      
      this.containerEl.style.cssText += `
        mask-image: ${maskImage};
        -webkit-mask-image: ${maskImage};
      `;
    }
  }
  
  /**
   * 创建进度条
   */
  createProgressBar() {
    this.progressEl = document.createElement('div');
    this.progressEl.className = 'marquee-progress';
    this.progressEl.style.cssText = `
      position: absolute;
      bottom: 0;
      left: 0;
      height: 2px;
      background: var(--color-primary, #007aff);
      width: 0%;
      transition: width 0.1s linear;
    `;
    this.containerEl.appendChild(this.progressEl);
  }
  
  /**
   * 绑定事件
   */
  bindEvents() {
    // 悬停暂停
    if (this.config.pauseOnHover) {
      this.containerEl.addEventListener('mouseenter', () => this.pause());
      this.containerEl.addEventListener('mouseleave', () => this.resume());
    }
    
    // 窗口尺寸变化
    window.addEventListener('resize', () => {
      this.updateDimensions();
    });
    
    // 可见性变化（切换标签页时暂停）
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pause();
      } else if (this.isPlaying && !this.isPaused) {
        this.resume();
      }
    });
  }
  
  /**
   * 播放
   */
  play() {
    if (this.isPlaying) return;
    
    this.isPlaying = true;
    this.isPaused = false;
    this.lastTimestamp = performance.now();
    
    this.animationFrame = requestAnimationFrame((timestamp) => this.animate(timestamp));
    
    console.log('[Marquee] Playing');
  }
  
  /**
   * 暂停
   */
  pause() {
    if (!this.isPlaying || this.isPaused) return;
    
    this.isPaused = true;
    
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    
    // 取消未执行的循环延迟
    if (this.loopTimeoutId) {
      clearTimeout(this.loopTimeoutId);
      this.loopTimeoutId = null;
    }
    
    console.log('[Marquee] Paused');
  }
  
  /**
   * 恢复
   */
  resume() {
    if (!this.isPlaying || !this.isPaused) return;
    
    this.isPaused = false;
    this.lastTimestamp = performance.now();
    
    this.animationFrame = requestAnimationFrame((timestamp) => this.animate(timestamp));
    
    console.log('[Marquee] Resumed');
  }
  
  /**
   * 停止
   */
  stop() {
    this.isPlaying = false;
    this.isPaused = false;
    this.currentPosition = 0;
    
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    
    this.updatePosition(0);
    
    console.log('[Marquee] Stopped');
  }
  
  /**
   * 动画帧
   */
  animate(timestamp) {
    if (this.isPaused) return;
    
    // 计算时间差
    const deltaTime = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;
    
    // 计算位移
    const distance = (this.config.speed * deltaTime) / 1000;
    this.currentPosition += distance;
    
    // 检查是否滚动到底部
    const maxScroll = this.contentHeight - this.containerHeight;
    
    if (this.currentPosition >= maxScroll) {
      if (this.config.loop) {
        // 循环：延迟后重置
        this.pause();
        this.loopTimeoutId = setTimeout(() => {
          this.loopTimeoutId = null;
          this.currentPosition = 0;
          this.updatePosition(0);
          if (this.isPlaying) {
            this.resume();
          }
        }, this.config.loopDelay);
        return;
      } else {
        // 不循环：停止
        this.currentPosition = maxScroll;
        this.updatePosition(maxScroll);
        this.pause();
        return;
      }
    }
    
    // 更新位置
    this.updatePosition(this.currentPosition);
    
    // 继续动画
    this.animationFrame = requestAnimationFrame((t) => this.animate(t));
  }
  
  /**
   * 更新位置
   */
  updatePosition(position) {
    // 使用 transform 性能更好
    this.contentEl.style.transform = `translateY(-${position}px)`;
    
    // 更新进度条
    if (this.progressEl) {
      const maxScroll = this.contentHeight - this.containerHeight;
      const progress = maxScroll > 0 ? (position / maxScroll) * 100 : 0;
      this.progressEl.style.width = `${progress}%`;
    }
  }
  
  /**
   * 跳转到指定位置
   */
  scrollTo(position) {
    this.currentPosition = Math.max(0, Math.min(position, this.contentHeight - this.containerHeight));
    this.updatePosition(this.currentPosition);
  }
  
  /**
   * 跳转到指定进度（0-1）
   */
  scrollToProgress(progress) {
    const maxScroll = this.contentHeight - this.containerHeight;
    this.scrollTo(progress * maxScroll);
  }
  
  /**
   * 更新速度
   */
  setSpeed(speed) {
    this.config.speed = speed;
  }
  
  /**
   * 更新内容（动态加载新内容后调用）
   */
  updateContent() {
    this.updateDimensions();
  }
  
  /**
   * 销毁
   */
  destroy() {
    this.stop();
    
    // 取消未执行的循环延迟
    if (this.loopTimeoutId) {
      clearTimeout(this.loopTimeoutId);
      this.loopTimeoutId = null;
    }
    
    if (this.progressEl) {
      this.progressEl.remove();
    }
    
    console.log('[Marquee] Destroyed');
  }
}

/**
 * 快速初始化函数
 */
function initVerticalMarquee(options = {}) {
  return new VerticalMarquee(options);
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { VerticalMarquee, initVerticalMarquee };
}

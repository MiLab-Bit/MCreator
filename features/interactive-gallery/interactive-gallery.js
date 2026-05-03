/* ============================================
   交互式画廊
   支持点击放大、键盘导航、触摸滑动
   ============================================ */

/**
 * 交互式画廊类
 */
class InteractiveGallery {
  constructor(options = {}) {
    // 默认配置
    this.config = {
      // 画廊容器选择器
      containerSelector: options.containerSelector || '.gallery-container',
      // 图片项选择器
      itemSelector: options.itemSelector || '.gallery-item',
      // 是否启用键盘导航
      enableKeyboard: options.enableKeyboard !== false,
      // 是否启用触摸滑动
      enableTouch: options.enableTouch !== false,
      // 是否显示计数器
      showCounter: options.showCounter !== false,
      // 是否显示缩略图导航
      showThumbnails: options.showThumbnails || false,
      // 背景透明度（0-1）
      backdropOpacity: options.backdropOpacity || 0.95,
      // 动画持续时间（毫秒）
      animationDuration: options.animationDuration || 300,
      // 关闭按钮 HTML
      closeButtonText: options.closeButtonText || '×',
      // 图片加载占位符
      placeholder: options.placeholder || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 9"%3E%3Crect fill="%23f4f2ed" width="16" height="9"/%3E%3C/svg%3E'
    };
    
    // 状态
    this.isOpen = false;
    this.currentIndex = 0;
    this.items = [];
    this.modalEl = null;
    this.imageEl = null;
    this.closeBtn = null;
    this.prevBtn = null;
    this.nextBtn = null;
    this.counterEl = null;
    this.previousFocus = null; // 无障碍：保存之前的焦点
    this.touchStartX = 0;
    this.touchEndX = 0;
    
    // 自动初始化
    if (options.autoInit !== false) {
      this.init();
    }
  }
  
  /**
   * 初始化画廊
   */
  init() {
    // 获取所有图片项
    const container = document.querySelector(this.config.containerSelector);
    if (!container) {
      console.warn('[Gallery] Container not found:', this.config.containerSelector);
      return;
    }
    
    this.items = Array.from(container.querySelectorAll(this.config.itemSelector));
    
    if (this.items.length === 0) {
      console.warn('[Gallery] No items found');
      return;
    }
    
    // 绑定点击事件
    this.items.forEach((item, index) => {
      item.addEventListener('click', () => this.open(index));
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');
      item.setAttribute('aria-label', `查看图片 ${index + 1}`);
      
      // 键盘支持
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.open(index);
        }
      });
    });
    
    // 创建模态框
    this.createModal();
    
    // 绑定键盘事件
    if (this.config.enableKeyboard) {
      this.bindKeyboard();
    }
    
    console.log(`[Gallery] Initialized with ${this.items.length} items`);
  }
  
  /**
   * 创建模态框
   */
  createModal() {
    // 模态框容器
    this.modalEl = document.createElement('div');
    this.modalEl.className = 'gallery-modal';
    this.modalEl.setAttribute('role', 'dialog');
    this.modalEl.setAttribute('aria-modal', 'true');
    this.modalEl.setAttribute('aria-label', '图片画廊');
    this.modalEl.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, ${this.config.backdropOpacity});
      z-index: 10000;
      display: none;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity ${this.config.animationDuration}ms ease;
    `;
    
    // 内容容器
    const contentEl = document.createElement('div');
    contentEl.className = 'gallery-content';
    contentEl.style.cssText = `
      position: relative;
      max-width: 90vw;
      max-height: 90vh;
    `;
    
    // 图片元素
    this.imageEl = document.createElement('img');
    this.imageEl.className = 'gallery-image';
    this.imageEl.style.cssText = `
      max-width: 100%;
      max-height: 90vh;
      object-fit: contain;
      border-radius: 8px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    `;
    
    // 关闭按钮
    const closeBtn = document.createElement('button');
    closeBtn.className = 'gallery-close';
    closeBtn.innerHTML = this.config.closeButtonText;
    closeBtn.setAttribute('aria-label', '关闭画廊');
    closeBtn.style.cssText = `
      position: absolute;
      top: -40px;
      right: 0;
      width: 40px;
      height: 40px;
      border: none;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      font-size: 24px;
      cursor: pointer;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.3s ease;
    `;
    closeBtn.addEventListener('click', () => this.close());
    this.closeBtn = closeBtn; // 保存引用用于焦点管理
    
    // 导航按钮（保存引用以便后续控制显隐）
    this.prevBtn = document.createElement('button');
    this.prevBtn.className = 'gallery-prev';
    this.prevBtn.innerHTML = '‹';
    this.prevBtn.setAttribute('aria-label', '上一张');
    this.prevBtn.style.cssText = `
      position: absolute;
      left: -60px;
      top: 50%;
      transform: translateY(-50%);
      width: 50px;
      height: 50px;
      border: none;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      font-size: 32px;
      cursor: pointer;
      border-radius: 50%;
      transition: background 0.3s ease;
    `;
    this.prevBtn.addEventListener('click', () => this.prev());
    
    this.nextBtn = document.createElement('button');
    this.nextBtn.className = 'gallery-next';
    this.nextBtn.innerHTML = '›';
    this.nextBtn.setAttribute('aria-label', '下一张');
    this.nextBtn.style.cssText = `
      position: absolute;
      right: -60px;
      top: 50%;
      transform: translateY(-50%);
      width: 50px;
      height: 50px;
      border: none;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      font-size: 32px;
      cursor: pointer;
      border-radius: 50%;
      transition: background 0.3s ease;
    `;
    this.nextBtn.addEventListener('click', () => this.next());
    
    // 单图时隐藏导航按钮
    if (this.items.length <= 1) {
      this.prevBtn.style.display = 'none';
      this.nextBtn.style.display = 'none';
    }
    
    // 计数器
    if (this.config.showCounter) {
      this.counterEl = document.createElement('div');
      this.counterEl.className = 'gallery-counter';
      this.counterEl.style.cssText = `
        position: absolute;
        bottom: -40px;
        left: 50%;
        transform: translateX(-50%);
        color: white;
        font-size: 14px;
        opacity: 0.7;
      `;
      contentEl.appendChild(this.counterEl);
    }
    
    // 组装
    contentEl.appendChild(this.imageEl);
    contentEl.appendChild(closeBtn);
    contentEl.appendChild(this.prevBtn);
    contentEl.appendChild(this.nextBtn);
    this.modalEl.appendChild(contentEl);
    document.body.appendChild(this.modalEl);
    
    // 点击背景关闭
    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl) {
        this.close();
      }
    });
    
    // 触摸事件
    if (this.config.enableTouch) {
      this.bindTouch();
    }
  }
  
  /**
   * 绑定键盘事件
   */
  bindKeyboard() {
    this.handleKeydown = (e) => {
      if (!this.isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          this.close();
          break;
        case 'ArrowLeft':
          this.prev();
          break;
        case 'ArrowRight':
          this.next();
          break;
      }
    };
    
    document.addEventListener('keydown', this.handleKeydown);
  }
  
  /**
   * 绑定触摸事件
   */
  bindTouch() {
    this.modalEl.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
    });
    
    this.modalEl.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    });
  }
  
  /**
   * 处理滑动手势
   */
  handleSwipe() {
    const threshold = 50;
    const diff = this.touchStartX - this.touchEndX;
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        this.next();
      } else {
        this.prev();
      }
    }
  }
  
  /**
   * 打开画廊
   */
  open(index = 0) {
    this.currentIndex = index;
    this.isOpen = true;
    
    // 无障碍：保存当前焦点
    this.previousFocus = document.activeElement;
    
    // 显示模态框
    this.modalEl.style.display = 'flex';
    requestAnimationFrame(() => {
      this.modalEl.style.opacity = '1';
    });
    
    // 加载图片
    this.loadImage(index);
    
    // 禁止背景滚动
    document.body.style.overflow = 'hidden';
    
    // 无障碍：焦点移到关闭按钮
    setTimeout(() => {
      if (this.closeBtn) {
        this.closeBtn.focus();
      }
    }, this.config.animationDuration);
    
    // 触发自定义事件
    document.dispatchEvent(new CustomEvent('gallery:open', { 
      detail: { index } 
    }));
  }
  
  /**
   * 关闭画廊
   */
  close() {
    this.isOpen = false;
    
    // 隐藏模态框
    this.modalEl.style.opacity = '0';
    setTimeout(() => {
      this.modalEl.style.display = 'none';
    }, this.config.animationDuration);
    
    // 恢复背景滚动
    document.body.style.overflow = '';
    
    // 无障碍：恢复之前的焦点
    if (this.previousFocus && typeof this.previousFocus.focus === 'function') {
      this.previousFocus.focus();
    }
    
    // 触发自定义事件
    document.dispatchEvent(new CustomEvent('gallery:close'));
  }
  
  /**
   * 加载图片
   */
  loadImage(index) {
    const item = this.items[index];
    if (!item) return;
    
    // 获取图片源
    const src = item.dataset.full || item.src || item.querySelector('img')?.src;
    const alt = item.alt || item.querySelector('img')?.alt || '';
    
    // 显示占位符
    this.imageEl.src = this.config.placeholder;
    
    // 加载图片
    const img = new Image();
    img.onload = () => {
      this.imageEl.src = src;
      this.imageEl.alt = alt;
      this.imageEl.classList.remove('gallery-image-error');
    };
    img.onerror = () => {
      // 图片加载失败，显示错误状态
      this.imageEl.src = this.config.placeholder;
      this.imageEl.alt = '图片加载失败';
      this.imageEl.classList.add('gallery-image-error');
      console.warn('[Gallery] Image load failed:', src);
    };
    img.src = src;
    
    // 更新计数器
    if (this.counterEl) {
      this.counterEl.textContent = `${index + 1} / ${this.items.length}`;
    }
  }
  
  /**
   * 上一张
   */
  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
    this.loadImage(this.currentIndex);
  }
  
  /**
   * 下一张
   */
  next() {
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
    this.loadImage(this.currentIndex);
  }
  
  /**
   * 跳转到指定图片
   */
  goTo(index) {
    if (index >= 0 && index < this.items.length) {
      this.currentIndex = index;
      this.loadImage(index);
    }
  }
  
  /**
   * 销毁画廊
   */
  destroy() {
    // 移除事件
    document.removeEventListener('keydown', this.handleKeydown);
    
    // 移除模态框
    if (this.modalEl) {
      this.modalEl.remove();
    }
    
    console.log('[Gallery] Destroyed');
  }
}

/**
 * 快速初始化函数
 */
function initInteractiveGallery(options = {}) {
  return new InteractiveGallery(options);
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { InteractiveGallery, initInteractiveGallery };
}

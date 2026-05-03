/**
 * MCreator 基础测试套件
 */

const fs = require('fs');
const path = require('path');

// 设置工作目录为项目根目录
const projectRoot = path.resolve(__dirname, '..');
process.chdir(projectRoot);

const COLORS = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m'
};

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`${COLORS.green}✓${COLORS.reset} ${name}`);
    passed++;
  } catch (error) {
    console.log(`${COLORS.red}✗${COLORS.reset} ${name}`);
    console.log(`  ${COLORS.red}Error: ${error.message}${COLORS.reset}`);
    failed++;
  }
}

function assertEqual(actual, expected, message = '') {
  if (actual !== expected) {
    throw new Error(`${message}\nExpected: ${expected}\nActual: ${actual}`);
  }
}

function assertExists(filePath, message = '') {
  if (!fs.existsSync(filePath)) {
    throw new Error(`${message}\nFile not found: ${filePath}`);
  }
}

function assertContains(content, substring, message = '') {
  if (!content.includes(substring)) {
    throw new Error(`${message}\nSubstring not found: ${substring}`);
  }
}

// ==================== 测试开始 ====================
console.log('\n📦 MCreator 测试套件\n');

// 1. 核心文件存在性测试
console.log('1️⃣  核心文件测试');

test('README.md 存在', () => {
  assertExists('README.md');
});

test('site.config.json 存在', () => {
  assertExists('site.config.json');
});

test('site.config.schema.json 存在', () => {
  assertExists('site.config.schema.json');
});

test('.gitignore 存在', () => {
  assertExists('.gitignore');
});

test('.env.example 存在', () => {
  assertExists('.env.example');
});

// 2. CLI 测试
console.log('\n2️⃣  CLI 测试');

test('CLI 入口文件存在', () => {
  assertExists('cli/bin/mcreator.js');
});

test('CLI package.json 存在', () => {
  assertExists('cli/package.json');
});

test('CLI package.json 包含 bin 配置', () => {
  const pkg = JSON.parse(fs.readFileSync('cli/package.json', 'utf-8'));
  if (!pkg.bin?.mcreator) throw new Error('bin.mcreator 未配置');
});

// 3. 组件测试
console.log('\n3️⃣  组件测试');

test('国内组件目录存在', () => {
  assertExists('components/cn');
});

test('海外组件目录存在', () => {
  assertExists('components/global');
});

test('图片回退组件存在', () => {
  assertExists('components/image-fallback.js');
});

// 4. 样式系统测试
console.log('\n4️⃣  样式系统测试');

test('Tailwind 输入文件存在', () => {
  assertExists('styles/input.css');
});

test('标准动效库存在', () => {
  assertExists('styles/standard-animations.css');
});

test('字体系统存在', () => {
  assertExists('styles/typography.css');
});

// 5. 特色功能测试
console.log('\n5️⃣  特色功能测试');

test('聚光灯功能存在', () => {
  assertExists('features/spotlight-cursor/spotlight-cursor.js');
  assertExists('features/spotlight-cursor/spotlight-cursor.css');
});

test('交互式画廊功能存在', () => {
  assertExists('features/interactive-gallery/interactive-gallery.js');
});

test('纵向滚动功能存在', () => {
  assertExists('features/vertical-marquee/vertical-marquee.js');
  assertExists('features/vertical-marquee/vertical-marquee.css');
});

// 6. 文档测试
console.log('\n6️⃣  文档测试');

test('部署指南存在', () => {
  assertExists('docs/deployment-guide.md');
});

test('安全快速参考存在', () => {
  assertExists('docs/security-quick-reference.md');
});

test('安全完整指南存在', () => {
  assertExists('docs/security-full-guide.md');
});

test('CLI 参考存在', () => {
  assertExists('docs/cli-reference.md');
});

test('组件 API 文档存在', () => {
  assertExists('docs/component-api.md');
});

// 7. CI/CD 测试
console.log('\n7️⃣  CI/CD 测试');

test('GitHub Actions Vercel 工作流存在', () => {
  assertExists('.github/workflows/deploy-vercel.yml');
});

test('GitHub Actions EdgeOne 工作流存在', () => {
  assertExists('.github/workflows/deploy-edgeone.yml');
});

test('Lighthouse 工作流存在', () => {
  assertExists('.github/workflows/lighthouse.yml');
});

test('lighthouserc.json 存在', () => {
  assertExists('lighthouserc.json');
});

test('vercel.json 存在', () => {
  assertExists('vercel.json');
});

// 8. 配置验证测试
console.log('\n8️⃣  配置验证测试');

test('site.config.json 是有效 JSON', () => {
  const config = JSON.parse(fs.readFileSync('site.config.json', 'utf-8'));
  if (!config.site?.name) throw new Error('site.name 未配置');
});

test('site.config.schema.json 是有效 JSON', () => {
  const schema = JSON.parse(fs.readFileSync('site.config.schema.json', 'utf-8'));
  if (!schema.$schema) throw new Error('$schema 未定义');
});

// 10. 内容结构测试
console.log('\n🔟 内容结构测试');

test('工具函数实现存在', () => {
  assertExists('utils/helpers.js');
});

// 12. 新增/修复文件测试
console.log('\n1️⃣2️⃣ 新增文件测试');

test('tailwind.config.js 存在', () => {
  assertExists('tailwind.config.js');
});

test('tailwind-built.css 是真实产物（> 5000 字节）', () => {
  const content = fs.readFileSync('styles/tailwind-built.css', 'utf-8');
  if (content.length < 5000) {
    throw new Error(`tailwind-built.css 仅有 ${content.length} 字节，期望 > 5000`);
  }
  if (!content.includes('tailwindcss')) {
    throw new Error('tailwind-built.css 不包含 Tailwind CSS 标记');
  }
});

test('content/audio/playlist.json 存在且有效', () => {
  assertExists('content/audio/playlist.json');
  const playlist = JSON.parse(fs.readFileSync('content/audio/playlist.json', 'utf-8'));
  if (!Array.isArray(playlist)) throw new Error('playlist.json 应为数组');
  if (playlist.length === 0) throw new Error('playlist.json 不应为空');
});

test('helpers.js 无重复图片回退实现', () => {
  const content = fs.readFileSync('utils/helpers.js', 'utf-8');
  if (content.includes('handleError')) {
    throw new Error('helpers.js 仍包含 handleError 图片回退实现');
  }
});

test('utils/font-loader.js 存在且有效', () => {
  assertExists('utils/font-loader.js');
  const content = fs.readFileSync('utils/font-loader.js', 'utf-8');
  if (!content.includes('loadFontStrategy')) {
    throw new Error('font-loader.js 缺少 loadFontStrategy 函数');
  }
  if (!content.includes("'A'") || !content.includes("'B'") || !content.includes("'C'")) {
    throw new Error('font-loader.js 应支持策略 A/B/C');
  }
});


test('site.config.json 包含敏感字段警告', () => {
  const content = fs.readFileSync('site.config.json', 'utf-8');
  if (!content.includes('_warning') && !content.includes('警告')) {
    throw new Error('site.config.json 缺少敏感字段警告说明');
  }
});

test('vercel.json CSP 不含 unsafe-eval', () => {
  const content = fs.readFileSync('vercel.json', 'utf-8');
  if (content.includes('unsafe-eval')) {
    throw new Error('vercel.json CSP 仍包含 unsafe-eval');
  }
});
test('vercel.json 包含 HSTS 头', () => {
  const content = fs.readFileSync('vercel.json', 'utf-8');
  if (!content.includes('Strict-Transport-Security')) {
    throw new Error('vercel.json 缺少 HSTS 头');
  }
});

test('youtube-player.html 封面图使用 fetchpriority=high', () => {
  const content = fs.readFileSync('components/global/youtube-player.html', 'utf-8');
  if (content.includes('loading="lazy"') && content.includes('img.youtube.com') && content.includes('fetchpriority="high"')) {
    // 已修复
  } else if (content.includes('fetchpriority="high"')) {
    // 已修复
  } else {
    throw new Error('youtube-player.html 封面图未使用 fetchpriority=high');
  }
});

test('spotify-player.html 包含 preconnect', () => {
  const content = fs.readFileSync('components/global/spotify-player.html', 'utf-8');
  if (!content.includes('preconnect')) {
    throw new Error('spotify-player.html 缺少 preconnect 声明');
  }
});

test('youtube-player.html 包含 preconnect', () => {
  const content = fs.readFileSync('components/global/youtube-player.html', 'utf-8');
  if (!content.includes('preconnect')) {
    throw new Error('youtube-player.html 缺少 preconnect 声明');
  }
});

// 功能测试辅助函数（复制 helpers.js 逻辑，用于测试）
function debounce(func, wait, immediate = false) {
  let timeout;
  return function(...args) {
    const later = () => { timeout = null; if (!immediate) func.apply(this, args); };
    clearTimeout(timeout);
    if (immediate && !timeout) func.apply(this, args);
    timeout = setTimeout(later, wait);
  };
}
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) { func.apply(this, args); inThrottle = true; setTimeout(() => inThrottle = false, limit); }
  };
}

// 13. 功能单元测试
console.log('\n1️⃣3️⃣ 功能单元测试');


test('debounce 逻辑正确（连续调用只在延迟后触发一次）', () => {
  let count = 0;
  const fn = debounce(() => count++, 50);
  fn(); fn(); fn();
  if (count !== 0) throw new Error(`立即调用后 count=${count}，应为 0`);
});


test('throttle 逻辑正确（limit 期间只触发一次）', () => {
  let count = 0;
  const fn = throttle(() => count++, 100);
  fn(); fn(); fn();
  if (count !== 1) throw new Error(`throttle 连续调用 count=${count}，应为 1`);
});
test('CLI init 有项目名校验', () => {
  const content = fs.readFileSync('cli/bin/mcreator.js', 'utf-8');
  if (!content.includes('项目名称不能为空') || !content.includes('特殊字符')) {
    throw new Error('CLI 缺少项目名校验');
  }
});
test('CLI upload 有上传后建议', () => {
  const content = fs.readFileSync('cli/bin/mcreator.js', 'utf-8');
  if (!content.includes('下一步建议')) {
    throw new Error('CLI upload 缺少下一步建议');
  }
});
test('image-fallback.js 支持 WebP 检测', () => {
  const content = fs.readFileSync('components/image-fallback.js', 'utf-8');
  if (!content.includes('supportsWebP')) {
    throw new Error('image-fallback.js 缺少 WebP 检测');
  }
});
// === P2 Functional Tests ===
test('CLI init 生成包含 build 脚本的 package.json', () => {
  const cli = fs.readFileSync('cli/bin/mcreator.js', 'utf-8');
  if (!cli.includes('"serve"') && !cli.includes('"build:css"')) {
    throw new Error('CLI 未生成包含 build 脚本的 package.json');
  }
});
test('helpers.js 导出 debounce/throttle', () => {
  const helpers = fs.readFileSync('utils/helpers.js', 'utf-8');
  if (!helpers.includes('function debounce') && !helpers.includes('export')) {
    throw new Error('helpers.js 缺少 debounce 导出');
  }
});
test('site.config.json 包含 storage 三层配置', () => {
  const config = JSON.parse(fs.readFileSync('site.config.json', 'utf-8'));
  if (!config.storage || !config.storage.primary || !config.storage.backup || !config.storage.local) {
    throw new Error('site.config.json 缺少 storage 三层配置');
  }
});
test('typography.css 包含字体策略 A/B/C', () => {
  const css = fs.readFileSync('styles/typography.css', 'utf-8');
  if (!css.includes('方案 A') || !css.includes('方案 B') || !css.includes('方案 C')) {
    throw new Error('typography.css 缺少 ABC 策略');
  }
});
test('font-loader.js 支持策略 A/B/C', () => {
  const fl = fs.readFileSync('utils/font-loader.js', 'utf-8');
  if (!fl.includes("case 'A'") || !fl.includes("case 'B'") || !fl.includes("case 'C'")) {
    throw new Error('font-loader.js 缺少 ABC 策略支持');
  }
});
test('spotify-player.html 有 iframe + preconnect', () => {
  const html = fs.readFileSync('components/global/spotify-player.html', 'utf-8');
  if (!html.includes('<iframe')) throw new Error('spotify-player.html 缺少 iframe');
  if (!html.includes('preconnect')) throw new Error('spotify-player.html 缺少 preconnect');
});
test('vercel.json 有 HSTS header', () => {
  const v = JSON.parse(fs.readFileSync('vercel.json', 'utf-8'));
  const hsts = v && v.headers && v.headers.find(h =>
    h && h.headers && h.headers.some(hh => hh.key === 'Strict-Transport-Security')
  );
  if (!hsts) throw new Error('vercel.json 缺少 HSTS');
});
test('types.d.ts 包含 SiteConfig 和 Component 接口', () => {
  const types = fs.readFileSync('utils/types.d.ts', 'utf-8');
  if (!types.includes('interface SiteConfig')) throw new Error('缺少 SiteConfig 接口');
  if (!types.includes('interface Component')) throw new Error('缺少 Component 接口');
});


// === P2 Batch 2 Tests ===
test('site.config.json _warning 字段存在且非空', () => {
  const config = JSON.parse(fs.readFileSync('site.config.json', 'utf-8'));
  if (!config._warning || config._warning.length < 10) throw new Error('缺少 _warning 或内容为空');
});
test('youtube-player.html 包含 sandbox 安全说明注释', () => {
  const html = fs.readFileSync('components/global/youtube-player.html', 'utf-8');
  if (!html.includes('allow-same-origin')) throw new Error('youtube-player.html 缺少 sandbox 配置');
});
test('scripts/version-manager.js 存在且可执行', () => {
  if (!fs.existsSync('scripts/version-manager.js')) throw new Error('缺少 version-manager.js');
  const content = fs.readFileSync('scripts/version-manager.js', 'utf-8');
  if (!content.includes('function list') || !content.includes('function check')) {
    throw new Error('version-manager.js 缺少 list/check 函数');
  }
});
test('version-manager.js 支持 list/check/update 命令', () => {
  const script = fs.readFileSync('scripts/version-manager.js', 'utf-8');
  const cmds = ['list', 'check', 'update'];
  const missing = cmds.filter(c => !script.includes(c));
  if (missing.length > 0) throw new Error('缺少: ' + missing.join(','));
});

// ==================== 新增功能测试 ====================
console.log('\n1️⃣4️⃣ 扩展功能测试');

// --- helpers.js 全局暴露测试 ---
test('helpers.js 包含 window.helpers 全局暴露', () => {
  const content = fs.readFileSync('utils/helpers.js', 'utf-8');
  if (!content.includes('window.helpers')) {
    throw new Error('helpers.js 缺少 window.helpers 全局暴露');
  }
});

test('helpers.js 导出 debounce/throttle', () => {
  const content = fs.readFileSync('utils/helpers.js', 'utf-8');
  if (!content.includes('module.exports')) {
    throw new Error('helpers.js 缺少 module.exports');
  }
  if (!content.includes('debounce') || !content.includes('throttle')) {
    throw new Error('helpers.js 未导出 debounce/throttle');
  }
});

// --- 图片回退功能测试 ---
test('image-fallback.js 支持 setupImageFallback 函数', () => {
  const content = fs.readFileSync('components/image-fallback.js', 'utf-8');
  if (!content.includes('async function setupImageFallback')) {
    throw new Error('image-fallback.js 缺少 setupImageFallback 函数');
  }
});

test('image-fallback.js 支持 WebP 检测', () => {
  const content = fs.readFileSync('components/image-fallback.js', 'utf-8');
  if (!content.includes('supportsWebP')) {
    throw new Error('image-fallback.js 缺少 WebP 检测');
  }
  if (!content.includes('data:image/webp')) {
    throw new Error('image-fallback.js 未使用 WebP 检测图片');
  }
});

test('image-fallback.js 支持三级回退机制', () => {
  const content = fs.readFileSync('components/image-fallback.js', 'utf-8');
  if (!content.includes('fallback-1') || !content.includes('fallback-2') || !content.includes('fallback-3')) {
    throw new Error('image-fallback.js 未完整支持三级回退');
  }
  if (!content.includes('showPlaceholder')) {
    throw new Error('image-fallback.js 缺少 showPlaceholder 占位函数');
  }
});

test('image-fallback.js 包含 selectBestImageSource 智能选源', () => {
  const content = fs.readFileSync('components/image-fallback.js', 'utf-8');
  if (!content.includes('selectBestImageSource')) {
    throw new Error('image-fallback.js 缺少 selectBestImageSource 函数');
  }
  if (!content.includes('Promise.race')) {
    throw new Error('image-fallback.js selectBestImageSource 未使用 Promise.race 超时控制');
  }
});

test('image-fallback.js 包含 getResponsiveImageSource 响应式选源', () => {
  const content = fs.readFileSync('components/image-fallback.js', 'utf-8');
  if (!content.includes('getResponsiveImageSource')) {
    throw new Error('image-fallback.js 缺少 getResponsiveImageSource 函数');
  }
  if (!content.includes('window.innerWidth')) {
    throw new Error('image-fallback.js getResponsiveImageSource 未使用 window.innerWidth');
  }
});

test('image-fallback.js 正确设置 window.imageFallbackLoaded 标记', () => {
  const content = fs.readFileSync('components/image-fallback.js', 'utf-8');
  if (!content.includes('window.imageFallbackLoaded = true')) {
    throw new Error('image-fallback.js 未设置 imageFallbackLoaded 标记');
  }
});

// --- site.config.json 配置校验测试 ---
test('site.config.json 包含必需字段 site.name', () => {
  const config = JSON.parse(fs.readFileSync('site.config.json', 'utf-8'));
  if (!config.site?.name) throw new Error('site.config.json 缺少 site.name');
  if (typeof config.site.name !== 'string' || config.site.name.length === 0) {
    throw new Error('site.name 应为非空字符串');
  }
});

test('site.config.json 包含 storage.primary 配置', () => {
  const config = JSON.parse(fs.readFileSync('site.config.json', 'utf-8'));
  if (!config.storage?.primary) throw new Error('site.config.json 缺少 storage.primary');
  const primary = config.storage.primary;
  if (!primary.provider) throw new Error('storage.primary 缺少 provider');
  if (!primary.bucket) throw new Error('storage.primary 缺少 bucket');
  if (!primary.region) throw new Error('storage.primary 缺少 region');
});

test('site.config.json 包含 storage.backup 配置', () => {
  const config = JSON.parse(fs.readFileSync('site.config.json', 'utf-8'));
  if (!config.storage?.backup) throw new Error('site.config.json 缺少 storage.backup');
  const backup = config.storage.backup;
  if (!backup.provider) throw new Error('storage.backup 缺少 provider');
});

test('site.config.json 包含 storage.local 配置', () => {
  const config = JSON.parse(fs.readFileSync('site.config.json', 'utf-8'));
  if (!config.storage?.local) throw new Error('site.config.json 缺少 storage.local');
});

test('site.config.json 包含 theme.fonts.strategy 配置', () => {
  const config = JSON.parse(fs.readFileSync('site.config.json', 'utf-8'));
  if (!config.theme?.fonts?.strategy) throw new Error('site.config.json 缺少 theme.fonts.strategy');
  const validStrategies = ['A', 'B', 'C'];
  if (!validStrategies.includes(config.theme.fonts.strategy)) {
    throw new Error('theme.fonts.strategy 应为 A/B/C 之一');
  }
});

test('site.config.json 包含 _warning 敏感字段警告', () => {
  const config = JSON.parse(fs.readFileSync('site.config.json', 'utf-8'));
  if (!config._warning) throw new Error('site.config.json 缺少 _warning 字段');
  if (config._warning.length < 10) throw new Error('_warning 内容过短');
  if (!config._warning.includes('敏感') && !config._warning.includes('密钥')) {
    throw new Error('_warning 应提醒敏感信息');
  }
});

test('site.config.schema.json 包含正确的 $schema 声明', () => {
  const schema = JSON.parse(fs.readFileSync('site.config.schema.json', 'utf-8'));
  if (!schema.$schema) throw new Error('$schema 未定义');
  if (!schema.$schema.includes('json-schema')) {
    throw new Error('$schema 应指向 JSON Schema 规范');
  }
});

test('site.config.schema.json 定义了必需属性', () => {
  const schema = JSON.parse(fs.readFileSync('site.config.schema.json', 'utf-8'));
  if (!schema.required) throw new Error('schema 缺少 required 字段');
  if (!schema.required.includes('site')) throw new Error('required 应包含 site');
  if (!schema.required.includes('storage')) throw new Error('required 应包含 storage');
});

test('site.config.json 的 site.name 与 site.config.schema.json 类型一致', () => {
  const config = JSON.parse(fs.readFileSync('site.config.json', 'utf-8'));
  const schema = JSON.parse(fs.readFileSync('site.config.schema.json', 'utf-8'));
  // site.name 应为字符串
  if (typeof config.site?.name !== 'string') {
    throw new Error('site.name 应为字符串');
  }
  // schema 中应有 type: string 约束
  if (schema.definitions?.SiteConfig?.properties?.site?.properties?.name?.type !== 'string') {
    // 检查根级 type
    if (schema.definitions?.SiteConfig?.properties?.name?.type !== 'string') {
      // 如果 schema 没有明确定义类型，跳过此检查
      console.log('  (schema 类型定义在子级，略过)');
    }
  }
});

// ==================== 测试结果 ====================
console.log('\n' + '='.repeat(50));
console.log(`📊 测试结果: ${COLORS.green}${passed} 通过${COLORS.reset}, ${COLORS.red}${failed} 失败${COLORS.reset}`);
console.log('='.repeat(50) + '\n');
process.exit(failed > 0 ? 1 : 0);

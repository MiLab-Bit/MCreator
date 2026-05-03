#!/usr/bin/env node

/**
 * MCreator CLI - 项目脚手架工具
 * 用法: npx mcreator init <project-name> [template]
 * 
 * ⚠️ 注意：此 CLI 用于初始化项目脚手架
 *    生成的项目本身是零构建的，可直接打开 HTML 运行
 *    package.json 仅用于开发工具（如 serve、CSS 构建）
 *    生产部署无需 node_modules
 * 
 * 支持模板:
 *   - basic    纯 HTML 基础模板（推荐）
 *   - react    React 进阶模板
 *   - gallery  画廊展示模板
 *   - cms      内容管理模板
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const TEMPLATES = {
  basic: {
    name: '基础模板',
    description: '纯 HTML + CSS + 最小 JS',
    files: [
      'index.html',
      'styles/main.css',
      'scripts/main.js'
    ]
  },
  react: {
    name: 'React 模板',
    description: 'React + Vite + TypeScript',
    files: [
      'src/main.tsx',
      'src/App.tsx',
      'index.html',
      'vite.config.ts'
    ]
  },
  gallery: {
    name: '画廊模板',
    description: '完整作品集展示',
    files: [
      'index.html',
      'styles/main.css',
      'components/gallery.js',
      'data/works.json'
    ]
  },
  cms: {
    name: 'CMS 模板',
    description: '内容管理 + 博客',
    files: [
      'src/pages/index.tsx',
      'src/pages/blog.tsx',
      'src/components/Layout.tsx'
    ]
  }
};

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m'
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function exec(command, options = {}) {
  try {
    return execSync(command, {
      stdio: 'inherit',
      ...options
    });
  } catch (error) {
    log(`命令执行失败: ${command}`, 'red');
    process.exit(1);
  }
}

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function initProject(projectName, template = 'basic') {
  // 项目名称校验
  if (!projectName || projectName.trim() === '') {
    log('错误: 项目名称不能为空', 'red');
    process.exit(1);
  }
  if (/[<>:"'|?*]/.test(projectName)) {
    log('错误: 项目名称不能包含特殊字符 (< > : " | ? *)', 'red');
    process.exit(1);
  }

  const projectPath = path.join(process.cwd(), projectName);

  // 检查目标目录
  if (fs.existsSync(projectPath)) {
    log('错误: 目录 ' + projectName + ' 已存在', 'red');
    process.exit(1);
  }
  
  // 验证模板
  if (!TEMPLATES[template]) {
    log(`错误: 未知模板 ${template}`, 'red');
    log('可用模板: ' + Object.keys(TEMPLATES).join(', '), 'yellow');
    process.exit(1);
  }
  
  log(`创建项目: ${projectName}`, 'blue');
  log(`模板: ${TEMPLATES[template].name}`, 'blue');
  
  // 创建项目目录
  fs.mkdirSync(projectPath, { recursive: true });
  
  // 创建基础结构
  const dirs = [
    'src',
    'src/components',
    'src/styles',
    'src/utils',
    'public',
    'docs'
  ];
  
  dirs.forEach(dir => {
    fs.mkdirSync(path.join(projectPath, dir), { recursive: true });
  });
  
  // 复制模板文件
  const templatePath = path.join(__dirname, 'templates', template);
  if (fs.existsSync(templatePath)) {
    copyDir(templatePath, projectPath);
  } else {
    // 创建默认文件
    const defaultFiles = {
      'index.html': `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName}</title>
  <link rel="stylesheet" href="src/styles/main.css">
</head>
<body>
  <header>
    <h1>${projectName}</h1>
    <p>使用 MCreator 构建</p>
  </header>
  <main>
    <section>
      <h2>欢迎使用</h2>
      <p>开始编辑 src/index.html 开始创建你的网站</p>
    </section>
  </main>
</body>
</html>`,
      'src/styles/main.css': `/* MCreator 基础样式 */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  line-height: 1.7;
  color: #333;
  background: #fafafa;
}

header {
  padding: 3rem 2rem;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

main {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}`,
      'src/utils/helpers.js': `// MCreator 工具函数库

/**
 * 等待指定时间
 */
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 防抖函数
 */
function debounce(fn, delay = 300) {
  let timer = null;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * 节流函数
 */
function throttle(fn, limit = 100) {
  let inThrottle = false;
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * 懒加载图片
 */
function lazyLoadImages() {
  const images = document.querySelectorAll('img[data-src]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });
  
  images.forEach(img => observer.observe(img));
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', lazyLoadImages);
} else {
  lazyLoadImages();
}`,
      'package.json': `{
  "name": "${projectName}",
  "version": "1.0.0",
  "description": "使用 MCreator 构建的网站",
  "scripts": {
    "dev": "npx serve .",
    "build:css": "npx tailwindcss -o styles/tailwind-built.css --minify",
    "deploy": "npx vercel --prod"
  },
  "mcreator": {
    "zeroBuild": true,
    "note": "此项目为零构建架构，可直接打开 HTML 运行，无需 npm install"
  }
}`
    };
    
    for (const [filePath, content] of Object.entries(defaultFiles)) {
      const fullPath = path.join(projectPath, filePath);
      fs.mkdirSync(path.dirname(fullPath), { recursive: true });
      fs.writeFileSync(fullPath, content);
    }
  }
  
  // 创建 README
  const readme = `# ${projectName}

使用 [MCreator](https://github.com/your-org/mcreator) 构建

## 快速开始

\`\`\`bash
# 开发
npm run dev

# 构建
npm run build

# 部署
npm run deploy
\`\`\`

## 项目结构

\`\`\`
${projectName}/
├── src/
│   ├── components/   # 组件
│   ├── styles/       # 样式
│   └── utils/        # 工具函数
├── public/           # 静态资源
├── docs/             # 文档
└── index.html        # 入口文件
\`\`\`

## 参考文档

- [MCreator 文档](https://docs.example.com)
- [部署指南](./docs/deployment-guide.md)
`;

  fs.writeFileSync(path.join(projectPath, 'README.md'), readme);
  
  // 完成（零构建项目无需 npm install）
  log('\n✅ 项目创建完成!', 'green');
  log('\n📌 零构建说明:', 'bright');
  log('  - 项目可直接打开 index.html 运行，无需构建');
  log('  - package.json 仅用于开发工具（serve、CSS 构建）');
  log('  - 如需开发工具，运行: npm install');
  log('  - 生产部署不需要 node_modules');
  log(`\n进入项目目录: cd ${projectName}`, 'blue');
  log('直接打开: index.html（或运行 npx serve .）', 'blue');
}

function listTemplates() {
  log('\n可用模板:\n', 'blue');
  
  for (const [key, template] of Object.entries(TEMPLATES)) {
    log(`  ${key.padEnd(10)} - ${template.name}: ${template.description}`, 'reset');
  }
  
  log('\n例如:', 'yellow');
  log('  npx mcreator init my-portfolio gallery', 'reset');
}

/**
 * 验证配置文件
 */
function validateConfig(configPath = 'site.config.json') {
  const fullPath = path.resolve(configPath);
  
  if (!fs.existsSync(fullPath)) {
    log(`错误: 配置文件不存在 ${configPath}`, 'red');
    process.exit(1);
  }
  
  const schemaPath = path.resolve('site.config.schema.json');
  if (!fs.existsSync(schemaPath)) {
    log('警告: site.config.schema.json 不存在，跳过 Schema 验证', 'yellow');
    try {
      JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
      log('✓ JSON 格式有效', 'green');
    } catch (e) {
      log('✗ JSON 格式无效: ' + e.message, 'red');
      process.exit(1);
    }
    return;
  }
  
  try {
    const Ajv = require('ajv');
    const ajv = new Ajv({ allErrors: true });
    const config = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
    const validate = ajv.compile(schema);
    const valid = validate(config);
    
    if (valid) {
      log('✓ 配置验证通过', 'green');
    } else {
      log('✗ 配置验证失败:', 'red');
      validate.errors.forEach(err => {
        log(`  ${err.instancePath} ${err.message}`, 'red');
      });
      process.exit(1);
    }
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      log('提示: 安装 ajv 以启用 Schema 验证: npm install ajv', 'yellow');
      try {
        JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
        log('✓ JSON 格式有效（未执行 Schema 验证）', 'green');
      } catch (e) {
        log('✗ JSON 格式无效: ' + e.message, 'red');
        process.exit(1);
      }
    } else {
      throw error;
    }
  }
}

/**
 * 验证路径是否在允许的目录范围内（防止路径遍历攻击）
 * @param {string} inputPath - 用户输入的路径
 * @param {string} basePath - 基础目录
 * @returns {string|null} 验证后的绝对路径，失败返回 null
 */
function validatePath(inputPath, basePath) {
  const resolved = path.resolve(basePath, inputPath);
  const base = path.resolve(basePath);
  // 确保解析后的路径在基础目录内
  if (!resolved.startsWith(base + path.sep) && resolved !== base) {
    return null;
  }
  return resolved;
}

/**
 * 验证命令参数是否安全（防止命令注入）
 * @param {string} arg - 命令参数
 * @returns {boolean} 是否安全
 */
function isSafeArg(arg) {
  // 禁止包含危险字符
  return !/[;&|`$()-]/.test(arg) && !arg.includes('..');
}

/**
 * 上传文件到 CDN 存储
 */
function uploadToStorage(dirPath) {
  // 检查环境变量
  const OSS_KEY = process.env.OSS_ACCESS_KEY_ID;
  const OSS_SECRET = process.env.OSS_ACCESS_KEY_SECRET;
  const OSS_BUCKET = process.env.OSS_BUCKET;
  const OSS_REGION = process.env.OSS_REGION || 'oss-cn-shanghai';
  
  if (!OSS_KEY || !OSS_SECRET || !OSS_BUCKET) {
    log('错误: 未配置 OSS 环境变量', 'red');
    log('请设置环境变量后重试', 'yellow');
    process.exit(1);
  }
  
  // 验证路径安全（防止路径遍历）
  const targetPath = validatePath(dirPath || '.', process.cwd());
  if (!targetPath) {
    log('错误: 路径验证失败', 'red');
    process.exit(1);
  }
  
  if (!fs.existsSync(targetPath)) {
    log(`错误: 路径不存在`, 'red');
    process.exit(1);
  }
  
  log('\n📦 上传配置:', 'blue');
  log(`  区域: ${OSS_REGION}`);
  log(`  存储桶: ${OSS_BUCKET}`);
  log(`  源路径: ${targetPath}`);
  
  // 检测可用工具
  let toolFound = false;
  
  // 尝试 ossutil
  try {
    execSync('ossutil --version', { stdio: 'pipe' });
    toolFound = true;
    log('\n使用 ossutil 上传...', 'yellow');
    
    // 验证参数安全
    if (!isSafeArg(targetPath) || !isSafeArg(OSS_BUCKET)) {
      log('错误: 参数包含不安全字符', 'red');
      process.exit(1);
    }
    
    const bucketUrl = `oss://${OSS_BUCKET}/`;
    const cmd = `ossutil cp -r -f "${targetPath}" ${bucketUrl}`;
    
    log(`执行: ${cmd}`, 'blue');
    exec(cmd);
    
    log('\n✅ 上传完成!', 'green');
    log('\n📋 下一步建议:', 'yellow');
    log('  - 更新 site.config.json 中的 CDN URL');
    log('  - 运行 npm run build:css 更新 CSS');
    log('  - 配置 CI/CD 自动部署');
    log(`访问地址: https://${OSS_BUCKET}.${OSS_REGION}.aliyuncs.com/`, 'blue');
    return;
  } catch (e) {
    // ossutil 不可用，继续尝试其他工具
  }
  
  // 尝试 AWS CLI（兼容 S3 协议）
  try {
    execSync('aws --version', { stdio: 'pipe' });
    toolFound = true;
    
    log('\n使用 AWS CLI 上传（兼容 OSS S3 协议）...', 'yellow');
    
    // 验证参数安全
    if (!isSafeArg(targetPath) || !isSafeArg(OSS_BUCKET) || !isSafeArg(OSS_REGION)) {
      log('错误: 参数包含不安全字符', 'red');
      process.exit(1);
    }
    
    const endpoint = `https://${OSS_REGION}.aliyuncs.com`;
    const s3Path = `s3://${OSS_BUCKET}/`;
    
    const cmd = `aws s3 sync "${targetPath}" ${s3Path} --endpoint-url ${endpoint} --delete`;
    
    log(`执行: ${cmd}`, 'blue');
    exec(cmd, {
      env: {
        ...process.env,
        AWS_ACCESS_KEY_ID: OSS_KEY,
        AWS_SECRET_ACCESS_KEY: OSS_SECRET,
        AWS_DEFAULT_REGION: OSS_REGION.replace('oss-', '')
      }
    });
    
    log('\n✅ 上传完成!', 'green');
    log(`访问地址: https://${OSS_BUCKET}.${OSS_REGION}.aliyuncs.com/`, 'blue');
    return;
  } catch (e) {
    // AWS CLI 不可用
  }
  
  // 未检测到工具
  if (!toolFound) {
    log('\n❌ 未检测到上传工具', 'red');
    log('\n请安装以下工具之一:', 'yellow');
    log('  - ossutil (阿里云官方工具)');
    log('    下载: https://help.aliyun.com/document_detail/120075.html');
    log('  - AWS CLI (兼容 S3 协议)');
    log('    安装: pip install awscli 或 winget install Amazon.AWSCLI');
    log('\n或手动上传文件到 OSS 控制台:', 'blue');
    log(`  https://oss.console.aliyun.com/bucket/${OSS_REGION}/${OSS_BUCKET}/object`);
  }
}

// 主入口
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'init':
    const projectName = args[1];
    const template = args[2] || 'basic';
    
    if (!projectName) {
      log('错误: 请指定项目名称', 'red');
      log('用法: npx mcreator init <project-name> [template]', 'yellow');
      process.exit(1);
    }
    
    initProject(projectName, template);
    break;
    
  case 'list':
  case 'templates':
    listTemplates();
    break;
    
  case 'validate':
    validateConfig(args[1] || 'site.config.json');
    break;
    
  case 'upload':
    const uploadPath = args[1] || '.';
    uploadToStorage(uploadPath);
    break;
    
  case 'help':
  case undefined:
    log('\nMCreator CLI - 项目脚手架工具', 'blue');
    log('\n用法:', 'yellow');
    log('  npx mcreator init <project-name> [template]  创建新项目');
    log('  npx mcreator list                           列出可用模板');
    log('  npx mcreator validate [config]              验证配置文件');
    log('  npx mcreator upload <path>                  上传文件到 OSS');
    log('  npx mcreator help                           显示帮助');
    log('\n示例:', 'yellow');
    log('  npx mcreator init my-portfolio');
    log('  npx mcreator init my-gallery gallery');
    log('  npx mcreator validate site.config.json');
    log('  npx mcreator upload ./dist --requires OSS env vars');
    break;
    
  default:
    log(`未知命令: ${command}`, 'red');
    log('运行 npx mcreator help 查看帮助', 'yellow');
    process.exit(1);
}

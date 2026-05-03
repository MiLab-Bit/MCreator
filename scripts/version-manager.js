#!/usr/bin/env node
/**
 * vendor/versions.json 版本管理脚本
 * 用法: node scripts/version-manager.js [check|update|list]
 */
const fs = require('fs');
const path = require('path');

const versionsPath = path.join(__dirname, '../vendor/versions.json');
const versions = JSON.parse(fs.readFileSync(versionsPath, 'utf-8'));

const [,, cmd, pkg, newVersion] = process.argv;

function list() {
  console.log('\n📦 当前锁定版本:\n');
  Object.entries(versions).forEach(([key, val]) => {
    if (key === '_meta') return;
    if (typeof val === 'string') {
      console.log('  ' + key.padEnd(24) + val);
    }
  });
  console.log();
}

function check() {
  console.log('\n🔍 版本一致性检查:\n');
  const pkgFiles = [
    '../cli/package.json',
    '../package.json'
  ];
  pkgFiles.forEach(f => {
    try {
      const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, f), 'utf-8'));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      Object.entries(deps).forEach(([k, v]) => {
        const locked = versions[k];
        if (!locked) {
          console.log('  ⚠️ 未锁定: ' + k + '@' + v);
        } else if (locked !== v) {
          console.log('  🔄 版本差异: ' + k + ' — 锁定: ' + locked + ', 当前: ' + v);
        }
      });
    } catch(e) {
      console.log('  无法检查: ' + f);
    }
  });
  console.log('\n✅ 检查完成');
}

function update() {
  if (!pkg || !newVersion) {
    console.log('用法: node version-manager.js update <package> <version>');
    return;
  }
  const oldVersion = versions[pkg];
  versions[pkg] = newVersion;
  versions._meta = versions._meta || {};
  versions._meta.lastChecked = new Date().toISOString();
  versions._meta.lastUpdated = new Date().toISOString();
  versions._meta.updatedPackages = versions._meta.updatedPackages || [];
  versions._meta.updatedPackages.push({ pkg, from: oldVersion, to: newVersion });
  fs.writeFileSync(versionsPath, JSON.stringify(versions, null, 2), 'utf-8');
  console.log('✅ 已更新: ' + pkg + ' = ' + newVersion);
}

switch(cmd) {
  case 'list': list(); break;
  case 'check': check(); break;
  case 'update': update(); break;
  default:
    console.log('用法: node version-manager.js [list|check|update <pkg> <ver>]');
    list();
}

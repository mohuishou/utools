const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '..');
const distDir = path.resolve(__dirname, '../dist');
const srcDirAlt = path.resolve(__dirname, '../src');

// 需要复制的文件和目录
const assets = [
  'plugin.json',
  'icon',
  'public',
];

// 特殊处理：third_party 在 src 目录下
const thirdPartySrc = path.join(srcDirAlt, 'third_party');
const thirdPartyDest = path.join(distDir, 'third_party');

// 确保目标目录存在
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(child => {
      copyRecursive(path.join(src, child), path.join(dest, child));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

assets.forEach(asset => {
  const srcPath = path.join(srcDir, asset);
  const destPath = path.join(distDir, asset);

  if (fs.existsSync(srcPath)) {
    console.log(`Copying ${asset}...`);
    copyRecursive(srcPath, destPath);
  } else {
    console.warn(`Warning: ${asset} not found, skipping`);
  }
});

// 复制 third_party (位于 src 目录下)
if (fs.existsSync(thirdPartySrc)) {
  console.log('Copying third_party...');
  copyRecursive(thirdPartySrc, thirdPartyDest);
} else {
  console.warn('Warning: third_party not found, skipping');
}

console.log('Assets copied successfully!');

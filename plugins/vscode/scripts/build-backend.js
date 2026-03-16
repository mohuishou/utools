const esbuild = require('esbuild');
const path = require('path');

const outDir = path.resolve(__dirname, '../dist');

esbuild.build({
  entryPoints: ['src/preload.ts', 'src/setting.ts', 'src/vscode.ts', 'src/files.ts', 'src/add.ts', 'src/ide.ts'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  outdir: outDir,
  format: 'cjs',
  external: ['utools-api-types'],
  sourcemap: false,
  minify: false,
}).then(() => {
  console.log('Backend built successfully!');
}).catch(() => process.exit(1));

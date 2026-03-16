import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        setting: resolve(__dirname, 'public/setting.html'),
      },
      output: {
        entryFileNames: 'js/[name].js',
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || []
          const ext = info[info.length - 1]
          if (/\.(css)$/.test(assetInfo.name || '')) {
            return 'css/[name]-[hash][extname]'
          }
          if (/\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)$/.test(ext)) {
            return 'assets/[name]-[hash][extname]'
          }
          return '[name]-[hash][extname]'
        },
      },
      external: ['utools-api-types'],
    },
  },
})

import { defineConfig } from 'tsdown'

export default defineConfig([
  // dist/es/：ESM、.mjs，供现代打包器 tree-shaking
  {
    entry: ['index.ts'],
    format: ['esm'],
    unbundle: true,
    outDir: 'dist/es',
    platform: 'neutral',
    fromVite: true,
    sourcemap: true,
    minify: false,
    clean: false,
    dts: { vue: true },
    outputOptions(options) {
      ;(options as Record<string, unknown>).entryFileNames = '[name].mjs'
      ;(options as Record<string, unknown>).chunkFileNames = '[name].mjs'
    },
  },
  // dist/lib/：CJS、.js，供 Node 或旧版打包器
  {
    entry: ['index.ts'],
    format: ['cjs'],
    unbundle: true,
    outDir: 'dist/lib',
    platform: 'neutral',
    fromVite: true,
    sourcemap: true,
    minify: false,
    clean: false,
    dts: false,
    outputOptions(options) {
      ;(options as Record<string, unknown>).entryFileNames = '[name].js'
      ;(options as Record<string, unknown>).chunkFileNames = '[name].js'
    },
  },
  // dist/index.full.js：单文件全量、未压缩（构建后重命名 .iife.js → .js）
  {
    entry: { 'index.full': 'index.ts' },
    format: ['iife'],
    unbundle: false,
    outDir: 'dist',
    platform: 'browser',
    fromVite: true,
    sourcemap: true,
    minify: false,
    clean: false,
    dts: false,
    outputOptions(options) {
      ;(options as Record<string, unknown>).name = 'ElementPlusLab'
    },
  },
  // dist/index.full.min.js：单文件全量、已压缩
  {
    entry: { 'index.full.min': 'index.ts' },
    format: ['iife'],
    unbundle: false,
    outDir: 'dist',
    platform: 'browser',
    fromVite: true,
    sourcemap: false,
    minify: true,
    clean: false,
    dts: false,
    outputOptions(options) {
      ;(options as Record<string, unknown>).name = 'ElementPlusLab'
    },
  },
])

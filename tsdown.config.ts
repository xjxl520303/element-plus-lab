import { defineConfig } from 'tsdown'
import vue from '@vitejs/plugin-vue'
import VueJsx from 'unplugin-vue-jsx/rolldown'

const pkg = 'packages/element-plus-lab'

/**
 * 各构建共用的配置。
 * 注：publint 关闭。因配置文件在仓库根目录，tsdown 会从根目录解析 package.json（private: true）
 * 并在此执行 pnpm pack，导致 Pack failed。若需检查发布包，可在构建后手动执行：
 * pnpm pack -C packages/element-plus-lab && npx publint <生成的 tgz>
 */
const shared = {
  plugins: [vue(), VueJsx()],
  checks: { pluginTimings: false as const },
  publint: false,
  deps: {
    skipNodeModulesBundle: true,
  },
}

export default defineConfig([
  // dist/es/：ESM、.mjs，供现代打包器 tree-shaking
  {
    ...shared,
    entry: [`${pkg}/index.ts`],
    format: ['esm'],
    unbundle: true,
    outDir: `${pkg}/dist/es`,
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
    ...shared,
    entry: [`${pkg}/index.ts`],
    format: ['cjs'],
    unbundle: true,
    outDir: `${pkg}/dist/lib`,
    platform: 'neutral',
    fromVite: true,
    sourcemap: true,
    minify: false,
    clean: false,
    dts: false,
    outputOptions(options) {
      ;(options as Record<string, unknown>).entryFileNames = '[name].cjs'
      ;(options as Record<string, unknown>).chunkFileNames = '[name].cjs'
    },
  },
  // dist/index.full.cjs：单文件全量、未压缩（构建后重命名 .iife.js → .cjs）
  {
    ...shared,
    entry: { 'index.full': `${pkg}/index.ts` },
    format: ['iife'],
    unbundle: false,
    outDir: `${pkg}/dist`,
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
    ...shared,
    entry: { 'index.full.min': `${pkg}/index.ts` },
    format: ['iife'],
    unbundle: false,
    outDir: `${pkg}/dist`,
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

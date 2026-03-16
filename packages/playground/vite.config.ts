import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import type { PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { VineVitePlugin } from 'vue-vine/vite'
import tailwindcss from '@tailwindcss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import ElementPlus from 'unplugin-element-plus/vite'
import Icons from 'unplugin-icons/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    VineVitePlugin(),
    tailwindcss(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [
        // 排除由 app.use(ElementPlusLab) 全局注册的组件，避免被解析为 element-plus 路径
        ElementPlusResolver({
          exclude: /^El(SimplePageHeader|FormGroup|SimpleSteps)$/,
        }),
      ],
    }),
    ElementPlus({
      useSource: true,
    }),
    Icons(),
  ] as PluginOption[],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // 本地开发时直接指向源码，避免依赖 dist/es 中打包后的深层依赖解析
      'element-plus-lab': fileURLToPath(new URL('../element-plus-lab/index.ts', import.meta.url)),
    },
  },
})

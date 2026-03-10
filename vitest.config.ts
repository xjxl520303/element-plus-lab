import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    include: [
      'packages/components/**/*.{test,spec}.{ts,tsx}',
      'packages/element-plus-lab/**/*.{test,spec}.{ts,tsx}',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: [
        'packages/components/**/*.{ts,tsx}',
        'packages/element-plus-lab/**/*.{ts,tsx}',
      ],
      exclude: [
        '**/*.d.ts',
        '**/index.ts',
        '**/types.ts',
        '**/__tests__/**',
        '**/node_modules/**',
        '**/dist/**',
      ],
    },
  },
  plugins: [vue(), vueJsx()],
})

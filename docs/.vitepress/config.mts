import { withSidebar } from 'vitepress-sidebar';
import { defineConfig, type UserConfig } from 'vitepress';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { componentPreview, containerPreview } from '@vitepress-demo-preview/plugin';
import {
  GitChangelog,
  GitChangelogMarkdownSection,
} from '@nolebase/vitepress-plugin-git-changelog/vite';
import { transformerTwoslash } from '@shikijs/vitepress-twoslash';
import { VineVitePlugin } from 'vue-vine/vite';
import tailwindcss from '@tailwindcss/vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const alias = {
  '@': path.resolve(__dirname, '../examples'),
};

const vitePressOptions: UserConfig = {
  title: 'Element Plus Lab',
  description: '基于 Element Plus 的业务组件封装示例和演示项目',
  base: '/element-plus-lab/',
  srcDir: 'content',
  metaChunk: true,
  cleanUrls: true,
  lang: 'zh-Hans',
  head: [['link', { rel: 'icon', href: 'https://avatars.githubusercontent.com/u/53321551?v=4' }]],
  themeConfig: {
    logo: '/logo.png',
    darkModeSwitchLabel: '主题',
    darkModeSwitchTitle: '切换到深色模式',
    lightModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    outline: {
      label: '页面导航',
    },
    docFooter: {
      next: '下一页',
      prev: '上一页',
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      // { text: '首页', link: '/' },
      // { text: '文章', link: '/articles/index' },
      // { text: '更新日志', link: 'https://github.com/xjxl520303/element-plus-lab/blob/main/CHANGELOG.md' },
      {
        activeMatch: '^/(guide|components)/',
        text: '文档',
        items: [
          {
            activeMatch: '^/guide/',
            link: '/guide/introduction/element-plus-lab',
            text: '指南',
          },
          {
            activeMatch: '^/components/',
            link: '/components/introduction',
            text: '组件',
          },
        ],
      },
    ],
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/xjxl520303/vben-business-components',
      },
      // {
      //   icon: 'zhihu',
      //   link: 'https://www.zhihu.com/people/jenemy',
      // },
      // {
      //   icon: 'juejin',
      //   link: 'https://juejin.cn/user/4142615541848615',
      // },
    ],
    footer: {
      message: 'Released under the Apache License 2.0.',
      copyright: 'Copyright © 2026-present xjxl520303'
    }
  },
  markdown: {
    // 配置Markdown解析器
    config(md) {
      md.use(componentPreview, { alias });
      md.use(containerPreview, { alias });
    },
    codeTransformers: [transformerTwoslash()],
    // Explicitly load these languages for types highlighting
    languages: ['js', 'jsx', 'ts', 'tsx'],
  },
  vite: {
    plugins: [
      GitChangelog({
        mapAuthors: [
          {
            mapByNameAliases: ['jenemy'],
            name: 'jenemy',
            username: 'xjxl520303',
          },
        ],
        repoURL: () => 'https://github.com/xjxl520303/element-plus-lab',
      }),
      GitChangelogMarkdownSection(),
      VineVitePlugin(),
      tailwindcss(),
    ],
    resolve: {
      alias,
    },
    optimizeDeps: {
      exclude: [
        '@nolebase/vitepress-plugin-enhanced-readabilities/client',
        'vitepress',
        '@nolebase/ui',
      ],
    },
    ssr: {
      noExternal: [
        '@nolebase/vitepress-plugin-enhanced-readabilities',
        '@nolebase/ui',
      ],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return;

            const moduleId = id.replace(/\\/g, '/');

            // 1) Vue 全家桶
            if (/node_modules\/(vue|@vue\/|vue-router|vue-vine|@vue-vine\/)/.test(moduleId)) {
              return 'vue';
            }

            // 2) Element Plus 生态
            if (
              /node_modules\/(element-plus|@element-plus\/|@ctrl\/tinycolor|@floating-ui\/|@popperjs\/core|async-validator|dayjs|lodash-unified|memoize-one|normalize-wheel-es)\//.test(
                moduleId
              )
            ) {
              return 'element-plus';
            }

            // 3) Portal
            if (/node_modules\/portal-vue\//.test(moduleId)) {
              return 'portal';
            }

            // 4) VueUse 生态
            if (/node_modules\/(@vueuse\/|vue-demi)/.test(moduleId)) {
              return 'vue-use';
            }

            // 5) 文档插件生态统一 vendor（其余依赖交给 Rollup 自动分配，避免循环 chunk）
            if (
              /node_modules\/(@nolebase\/|@vitepress-demo-preview\/|vitepress-sidebar|@shikijs\/|shiki|vitepress\/|floating-vue\/|markdown-it|markdown-it-container)\//.test(
                moduleId
              )
            ) {
              return 'vendor';
            }
          },
        },
      }
    }
  },
}

const commonOptions = {
  // debugPrint: true,
  includeEmptyFolder: true,
  documentRootPath: '/content',
  collapsed: false,
  capitalizeFirst: true,
  useTitleFromFileHeading: true,
  useTitleFromFrontmatter: true,
  useFolderTitleFromIndexFile: true,
  sortMenusByFrontmatterOrder: true,
  folderLinkNotIncludesFileName: true
}
const vitePressSidebarOptions = [
  {
    ...commonOptions,
    scanStartPath: 'guide',
    basePath: '/guide/',
    resolvePath: '/guide/',
    manualSortFileNameByPriority: ['introduction', 'business', 'third'],
  },
  {
    ...commonOptions,
    scanStartPath: 'components',
    basePath: '/components/',
    resolvePath: '/components/',
    manualSortFileNameByPriority: ['introduction.md', 'basic', 'business', 'third', 'hooks', 'directive', 'utils'],
  }
]

export default defineConfig(withSidebar(vitePressOptions, vitePressSidebarOptions));
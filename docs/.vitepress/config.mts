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
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import ElementPlus from 'unplugin-element-plus/vite'
import Icons from 'unplugin-icons/vite'
import TurboConsole from 'unplugin-turbo-console/vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const alias = {
  '@': path.resolve(__dirname, '../examples'),
};

const vitePressOptions: UserConfig = {
  title: 'Element Plus Lab',
  description: '基于 Element Plus 的业务组件封装示例和演示项目',
  srcDir: 'content',
  metaChunk: true,
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
        link: 'https://github.com/xjxl520303/element-plus-lab',
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
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      ElementPlus({
        useSource: true,
      }),
      Icons(),
      TurboConsole({
        launchEditor: false
      })
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
      // 这些包在 SSR 构建阶段需要让 Vite 处理（否则 Node 会直接尝试加载 .vue / .css）
      noExternal: [
        '@nolebase/vitepress-plugin-enhanced-readabilities',
        '@nolebase/ui',
        'element-plus',
      ],
    },
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
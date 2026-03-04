<h1 align="center">Element Plus Lab 🚀</h1>

<p align="center">
  基于 Element Plus 的业务组件封装示例和演示项目
</p>

<p align="center">
  <a href="https://github.com/xjxl520303/element-plus-lab/stargazers">
    <img src="https://img.shields.io/github/stars/xjxl520303/element-plus-lab" alt="GitHub stars">
  </a>
  <a href="https://github.com/xjxl520303/element-plus-lab/issues">
    <img src="https://img.shields.io/github/issues/xjxl520303/element-plus-lab" alt="GitHub issues">
  </a>
  <a href="https://github.com/xjxl520303/element-plus-lab/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/xjxl520303/element-plus-lab" alt="GitHub">
  </a>
  <a href="https://github.com/xjxl520303/element-plus-lab/network/members">
    <img src="https://img.shields.io/github/forks/xjxl520303/element-plus-lab" alt="GitHub forks">
  </a>
</p>

[![Vue.js](https://img.shields.io/badge/Vue.js-3.5-42b883?style=flat-square&logo=vue.js&logoColor=white)](https://v3.vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Turborepo](https://img.shields.io/badge/Turborepo-%23000000?style=flat-square&logo=turborepo&logoColor=white)](https://turbo.build/)
[![pnpm](https://img.shields.io/badge/pnpm-%23F69220?style=flat-square&logo=pnpm&logoColor=white)](https://pnpm.io/)
[![License](https://img.shields.io/github/license/xjxl520303/element-plus-lab?style=flat-square)](LICENSE)

## 📖 项目简介

Element Plus Lab 是一个专注于分享基于 **Vue 3** 和 **Element Plus** 的业务组件封装示例和演示项目，同时也提供了对应的 NPM 包 [element-plus-lab](https://www.npmjs.com/package/element-plus-lab)。本项目采用现代化的 Monorepo 架构，旨在为开发者提供：

- 🎨 **业务组件封装示例**：基于 Element Plus 的二次封装组件，展示实际业务场景中的最佳实践
- 🛠️ **完整的开发工具链**：包含封装好的组件、工具函数、Hooks、指令等完整的开发资源
- 📚 **详细的文档和演示**：提供完整的组件文档和在线演示，方便学习和使用
- 🚀 **现代化的技术栈**：基于 Vue 3.5、TypeScript、Vite、Turborepo 等最新技术构建
<!-- - 🧪 **实时演示环境**：内置 Playground 和文档站点，支持在线体验和调试 -->

本项目不仅是一个组件库，而是一个学习和参考的资源库，帮助开发者快速上手 Vue 3 + Element Plus 的开发模式，提升开发效率。

项目的初衷在于分享作者自身经过实践验证的组件封装方案、基于技术社区（掘金、知乎）中分享的优秀组件分享文章进行整合以及开源社区（如 Vben Admin 等项目中）提供的实用组件进行整合和演示。

> [!NOTE]
> 1. 当前项目由 [Vben Business Components](https://github.com/xjxl520303/vben-business-components) 中的业务组件迁移而来，并在此基础上进行调整。
> 2. 当前项目正处于建设阶段，组件的功能、使用文档以及相关的指导文档及规范正在不断地完善中，因此项目存在一定的不稳定性，请谨慎使用。
> 3. 项目的 `package.json` 中设定的 `peerDependencies` 可能不准确，后续会根据实际使用情况进行调整。

## 📁 项目结构

```
├── docs/                           # 文档站（VitePress）
│   ├── .vitepress/                 # VitePress 配置、主题与插件
│   ├── content/                    # 文档内容（guide/components）
│   └── examples/                   # 文档演示示例代码
├── internal/                       # 内部工程配置
│   ├── lint-configs/               # ESLint / Commitlint 等配置
│   └── tsconfig/                   # 共享 TypeScript 配置
├── packages/
│   ├── components/                 # 组件库
│   ├── element-plus-lab/           # 业务组件封装示例
│   └── playground/                 # 演示与联调环境
├── .changeset/                     # 版本与变更记录
├── pnpm-workspace.yaml             # workspace 与 catalog 配置
└── package.json                    # 根脚本与工程依赖
```

## 🙏 致谢

项目的构建过程中使用了以下优秀的社区项目：

- [Vite](https://github.com/vitejs/vite) Next generation frontend tooling. It's fast!
- [Vitepress](https://github.com/vuejs/vitepress) Vite & Vue powered static site generator.
- [tsdown](https://github.com/rolldown/tsdown) The Elegant Library Bundler
- [oxc](https://github.com/oxc-project/oxc) ⚓ A collection of high-performance JavaScript tools.
- [lefthook](https://github.com/evilmartians/lefthook) Fast and powerful Git hooks manager for any type of projects.
- [cz-git](github.com/Zhengqbbb/cz-git) 🛠️ DX first and more engineered, lightweight, customizable, standard output format Commitizen adapter and CLI
- [turborepo](https://github.com/vercel/turborepo) Build system optimized for JavaScript and TypeScript, written in Rust
- [changesets](https://github.com/changesets/changesets) 🦋 A way to manage your versioning and changelogs with a focus on monorepos
- [vue-vine](https://github.com/vue-vine/vue-vine) Another style of writing Vue components.
- [Element Plus](https://element-plus.org/) - A Vue.js 3 UI library
- [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss) - A utility-first CSS framework for rapid UI development.
- [portal-vue](https://github.com/LinusBorg/portal-vue) - A Portal Component for Vue 3, to render DOM outside of a component, anywhere in the document.
- [Vueuse](https://github.com/vueuse/vueuse) - Collection of essential Vue Composition Utilities for Vue 3
- [Mockoon](https://github.com/mockoon/mockoon) - Mockoon is the easiest and quickest way to run mock APIs locally. No remote deployment, no account required, open source.

## 🤝 贡献

我们欢迎所有形式的贡献！

- 🐛 报告 Bug
- 💡 提出新功能建议
- 📝 改进文档
- 🔧 提交 Pull Request

## 📄 许可证

本项目基于 [MIT](LICENSE) 许可证，请遵守许可证内容。

---

⭐ 如果你喜欢这个项目，请给它一个星星！你的支持是我们持续改进的动力！

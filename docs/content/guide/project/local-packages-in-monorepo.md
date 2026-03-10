---
title: 在 monorepo 中引用本地包与发版实践
order: 4
---

# 在 monorepo 中引用本地包与发版实践

本文结合 `element-plus-lab` 仓库，讲解在 **monorepo 中如何引用本地包**，以及这些包在 **真正发布到 npm 之后** 如何做到开发体验与线上用法一致。

> 代表性场景：
>
> - 仓库内有业务组件库 `packages/element-plus-lab`，会发布到 npm。
> - 还有文档站 `docs`、示例应用 `packages/playground` 等「内部应用」需要在开发时就使用这套组件。
> - 要求：**开发期** 用起来要像线上包一样（`import { useDialog } from 'element-plus-lab'`），同时又要兼顾 **本地调试、发版构建、依赖解析** 等问题。

## 一、几种常见引用方式对比

### 1. workspace 协议：管理版本关系

在 monorepo 中，最基础的是使用 pnpm 的 `workspace:` 协议，让子包之间建立引用关系：

```json
// packages/playground/package.json
{
  "dependencies": {
    "element-plus-lab": "workspace:*"
  }
}
```

含义：

- `workspace:*` 表示「依赖当前 workspace 内名为 `element-plus-lab` 的包」。
- 版本号由该包自身 `version` 字段决定，升级版本只需在 **包本身** 改一次。

**注意**：
`workspace:*` 只解决「谁依赖谁」「版本跟随」的问题，**不会改变运行时入口文件**。
运行时真正加载哪个文件，依然由 `element-plus-lab` 包里的 `exports` / `main` / `module` 决定（可阅读：[package.json 的 exports 字段说明](/guide/project/package-exports)）。

### 2. 路径 alias：控制「源码 vs 构建产物」

在实际开发中，我们经常希望：

- **开发时**：直接走源码，改一行组件代码，playground / docs 立刻生效。
- **发布时**：用户从 npm 安装的包只看到构建好的 dist 产物。

这时可以在前端构建工具（Vite / VitePress）里通过 **alias** 强制把 `element-plus-lab` 指向源码：

```ts
// docs/.vitepress/config.mts 中的 alias 片段
const alias = {
  '@': path.resolve(__dirname, '../examples'),
  // 文档本地开发时直接指向源码，避免必须先 build 组件库
  'element-plus-lab': path.resolve(__dirname, '../../packages/element-plus-lab/index.ts'),
}
```

```ts
// packages/playground/vite.config.ts 中的 alias 片段
resolve: {
  alias: {
    '@': fileURLToPath(new URL('./src', import.meta.url)),
    // 本地开发时直接指向源码，避免依赖 dist/es 中打包后的深层依赖解析
    'element-plus-lab': fileURLToPath(new URL('../element-plus-lab/index.ts', import.meta.url)),
  },
},
```

**效果：**

- 对于 Vite / VitePress 来说，`import { useDialog } from 'element-plus-lab'` 会被重写为加载 `packages/element-plus-lab/index.ts`（源码）。
- 这样开发者可以像使用 npm 上的包那样写代码，同时享受「本地修改立即生效」的体验。
- 不需要先 `pnpm run build` 再给 docs / playground 用。

### 3. 直接消费构建产物（dist）

如果 **不配置 alias**，且使用 `workspace:*` 依赖本地包，那么：

- Vite 会把 `element-plus-lab` 当作一个普通 npm 包来解析。
- 再结合库自身的 `package.json`：

```json
{
  "name": "element-plus-lab",
  "main": "dist/lib/index.cjs",
  "module": "dist/es/index.mjs",
  "exports": {
    ".": {
      "import": { "default": "./dist/es/index.mjs" },
      "require": { "default": "./dist/lib/index.cjs" }
    }
  }
}
```

- 这样 playground / docs 等应用就会**直接消费构建产物** `dist/es/index.mjs` / `dist/lib/index.cjs`。

这在某些场景下是合理的（例如做一个完全「黑盒」集成测试），但在本项目里会带来多余的复杂度：

- 需要保证 dist 中打包进去的所有「间接依赖」在最终应用里都能解析，比如 `lodash-es` / `@ctrl/tinycolor` / `dayjs` 等。
- 等于把「库如何打包」的实现细节暴露给了 playground / docs，使问题更难排查。

因此，在 **日常开发** 阶段，我们更倾向于 **通过 alias 走源码**，只在发版和 `publint` 检查中严格使用 dist。

## 二、本项目实际采用的模式

结合上文，本项目采用的组合方式可以概括为：

1. **跨包依赖关系**：使用 `workspace:*`
   - 如 `packages/playground/package.json` 中对 `element-plus-lab` 的依赖：

    ```json
    {
      "element-plus-lab": "workspace:*"
    }
    ```

   - 方便版本同步与发版。

2. **开发期入口选择**：通过 Vite / VitePress 的 alias 强制指向源码入口
   - `docs/.vitepress/config.mts` 与 `packages/playground/vite.config.ts` 都把 `element-plus-lab` 别名到了 `packages/element-plus-lab/index.ts`。
   - playground、docs 内的示例都可以使用 npm 风格的导入：

     ```ts
     import { useDialog, type EllDialogResult } from 'element-plus-lab'
     ```

     开发体验和真实用户在项目中使用该包的方式一致。

3. **发布期入口选择**：依赖 `packages/element-plus-lab/package.json` 中的 `exports` / `main` / `module`
   - 发版前通过 `pnpm run build` 产出 `dist/es` + `dist/lib` + `dist/*.cjs`。
   - 通过 `publint` 检查 `exports` 配置的正确性（详见 `package-exports.md`）。
   - 发布到 npm 后，外部用户不会使用到本仓库里的 alias，而是按标准 Node / 打包器规则解析：

     ```ts
     import { useDialog } from 'element-plus-lab'
     // 实际走的是 package.json exports 指定的 dist 文件
     ```

这样可以做到：

- **内部应用（docs / playground）**：开发时享受源码热更新。
- **对外发布**：严格基于 dist 和 exports，行为与 publint 校验一致。
- **导入语句统一**：无论内部还是外部，示例都用 `import ... from 'element-plus-lab'`，避免「本地 demo 一种写法、用户又是另一种写法」的割裂。

## 三、常见问题与建议写法

### 1. 「本地源码 alias 会不会影响发版后的使用？」

不会。

- alias 只存在于 **本仓库的构建工具配置** 中（例如 `vite.config.ts`、`docs/.vitepress/config.mts`）；
- 当包发布到 npm 后，外部用户不会使用这些配置，而是完全依赖 npm 包自身的 `package.json` 配置（`exports` / `main` / `module` 等）。

因此，**本地 alias 只影响「本仓库的内部应用如何解析 import」，不会改变发到 npm 之后的行为**。

### 2. 「什么时候需要直接消费 dist？」

可以考虑在这些场景中使用 dist：

- 做一次「接近真实用户」的黑盒测试，确保 dist 中的 tree-shaking / sideEffects 标记 / 类型声明都按预期工作。
- 在另一个 monorepo 或外部项目里，用 git 依赖 / file 依赖的方式引入，还没发布到 npm，但想模拟真实消费行为。

但这类场景通常可以作为「额外的验证步骤」，而不是日常开发的默认路径。
在本仓库里，我们选择：**开发默认走源码，发布前通过 `pnpm run build` + `pnpm run publint` 来校验 dist 的正确性**。

## 四、小结

- **依赖关系**：用 `workspace:*` 建立本地包之间的依赖与版本对应关系。
- **开发体验**：通过 Vite / VitePress 的 alias 强制让本地应用走源码入口，保证示例与真实用法一致、调试体验良好。
- **发布行为**：对外完全依赖库包自身的 `exports` / `main` / `module` 配置，搭配 dist 构建和 publint 校验。
- **问题定位**：遇到「在 docs 正常、playground 报依赖缺失」时，优先检查「是否直接消费了 dist」，再决定是否加 alias 或补全依赖。

---

*本文部分内容由 AI 辅助创作，仅供参考，请以官方文档与项目实践为准。*

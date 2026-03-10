---
title: package.json 的 exports 字段说明
order: 2
---

# package.json 的 exports 字段说明

本文介绍 Node.js 与打包器如何通过 `package.json` 的 `exports` 字段解析包入口，以及如何为同时支持 ESM、CJS 和 TypeScript 的库正确配置。

## 一、为什么需要 exports

### 1. 传统方式：main、module、types

早期常用字段：

- **main**：`require('pkg')` 时解析的文件（通常是 CJS）
- **module**：打包器（Webpack、Rollup 等）做 ESM tree-shaking 时优先使用的入口
- **types**：TypeScript 查找类型声明时使用的入口

问题在于：

- 无法按「子路径」精细控制（如 `pkg/es`、`pkg/lib`）
- 无法区分「用 import 还是 require 来选不同文件」
- 没有官方标准，各工具行为不一致

### 2. exports 的作用

`exports` 是 **Node.js 12+** 和 **现代打包器** 共同支持的入口映射：

- **条件导出**：根据 `import` / `require` / `types` 等条件返回不同文件
- **子路径封装**：只暴露声明的入口，包内其他路径可被工具忽略
- **单一声明**：入口规则集中在一处，便于维护

配置好 `exports` 后，`main`、`module`、`types` 通常仍会保留，以兼容旧版 Node 或旧工具，但 **exports 优先级更高**。

## 二、exports 的基本结构

### 1. 键：入口路径

```json
{
  "exports": {
    ".": "入口：import 'pkg' 或 require('pkg')",
    "./es": "子路径：import 'pkg/es'",
    "./lib": "子路径：require('pkg/lib')",
    "./full": "子路径：全量构建等",
    "./package.json": "./package.json"
  }
}
```

- **`.`** 表示包根入口（对应 `import 'pkg'` / `require('pkg')`）。
- **`./xxx`** 表示子路径，只有列在这里的路径才会被正确解析，未列出的包内路径可能无法被用户使用（取决于工具）。

### 2. 值：字符串或条件对象

**简单写法（不区分 ESM/CJS）：**

```json
{
  "exports": {
    ".": "./dist/index.js"
  }
}
```

**条件写法（按 import/require/types 区分）：**

```json
{
  "exports": {
    ".": {
      "import": "./dist/es/index.mjs",
      "require": "./dist/lib/index.cjs",
      "types": "./dist/es/index.d.ts"
    }
  }
}
```

解析时：

- 用 `import` 加载 → 用 `"import"` 对应的文件
- 用 `require` 加载 → 用 `"require"` 对应的文件
- 仅需类型（TypeScript）→ 用 `"types"` 对应的声明文件

## 三、常用解析条件

| 条件       | 含义           | 典型用法                     |
|------------|----------------|------------------------------|
| **import** | ESM 加载       | `import pkg from 'pkg'`、打包器 ESM |
| **require**| CommonJS 加载  | `const pkg = require('pkg')` |
| **types**  | TypeScript 类型| 编辑器/tsc 查找 .d.ts/.d.cts |
| **default**| 兜底           | 其他条件都不匹配时使用       |

条件会按 **具体程度** 匹配，一般顺序类似：`types` > `import` / `require` > `default`。
同一条件可以写成字符串或对象；若为对象，可再包一层 `types` + `default`，例如：

```json
{
  "import": {
    "types": "./dist/es/index.d.ts",
    "default": "./dist/es/index.mjs"
  }
}
```

表示：在 ESM 场景下，类型用 `.d.ts`，运行时用 `.mjs`。

## 四、type: "module" 与文件扩展名

当包声明了 `"type": "module"` 时：

- **默认把 `.js` 当 ESM** 解析。
- 若包内还有 CommonJS 或 IIFE 等非 ESM 文件，若仍用 `.js`，可能被误当 ESM，导致报错或工具告警。

约定：

- **ESM**：用 `.mjs`，或保持 `.js` 且在 `type: "module"` 下。
- **CommonJS**：用 `.cjs`，明确表示 CJS，避免被当 ESM。
- **类型声明**：
  - 给 ESM 用：`.d.ts`
  - 给 CJS 用：`.d.cts`（按 Node/TypeScript 约定，在 `require` 条件下用 `.d.cts` 更规范）

这样在 `exports` 里为 `import` 配 `.mjs` + `.d.ts`，为 `require` 配 `.cjs` + `.d.cts`，工具（如 publint）就不会再提示「在 require 下用了 ESM 类型」。

## 五、本项目的 exports 配置说明（element-plus-lab）

下面以 `packages/element-plus-lab/package.json` 为例，说明各入口的用途和写法。

### 1. 根入口 `"."`

```json
{
  ".": {
    "import": {
      "types": "./dist/es/index.d.ts",
      "default": "./dist/es/index.mjs"
    },
    "require": {
      "types": "./dist/es/index.d.cts",
      "default": "./dist/lib/index.cjs"
    }
  }
}
```

- **import**：ESM 使用 `index.mjs`，类型使用 `index.d.ts`。
- **require**：CJS 使用 `index.cjs`，类型使用 `index.d.cts`（与 ESM 类型内容一致，仅扩展名区分，满足规范）。

没有在根层级单独写 `"types"`，而是把类型分别放在 `import` 和 `require` 里，避免在 `require` 场景下被误当成 ESM 类型（可消除 publint 等工具的警告）。

### 2. 子路径 `"./es"`

```json
{
  "./es": {
    "types": "./dist/es/index.d.ts",
    "import": "./dist/es/index.mjs"
  }
}
```

仅提供 ESM，适合明确写 `import 'element-plus-lab/es'` 的场景；无 `require`，因为该子路径只面向 ESM。

### 3. 子路径 `"./lib"`

```json
{
  "./lib": {
    "types": "./dist/es/index.d.ts",
    "require": {
      "types": "./dist/es/index.d.cts",
      "default": "./dist/lib/index.cjs"
    }
  }
}
```

仅提供 CJS，给 `require('element-plus-lab/lib')` 使用；类型同样在 `require` 下用 `.d.cts`。

### 4. 子路径 `"./full"`

```json
{
  "./full": {
    "types": "./dist/es/index.d.ts",
    "import": "./dist/index.full.cjs",
    "require": "./dist/index.full.cjs"
  }
}
```

全量构建（如 IIFE 打包成单文件），用于浏览器脚本等；虽然格式是 IIFE，但扩展名用 `.cjs` 以符合 `type: "module"` 包下非 ESM 用 `.cjs` 的约定。

### 5. 暴露 package.json

```json
{
  "./package.json": "./package.json"
}
```

允许用户或工具读取 `pkg/package.json`，部分工具会依赖此入口。

## 六、配套字段（main、module、types、unpkg）

在配置了 `exports` 后，以下字段主要给**未支持 exports 的旧环境**或 **CDN** 用：

| 字段       | 含义           | 本项目示例              |
|------------|----------------|-------------------------|
| **main**   | 默认 require 入口 | `dist/lib/index.cjs`   |
| **module** | 默认 ESM 入口（打包器） | `dist/es/index.mjs` |
| **types**  | 默认类型入口   | `dist/es/index.d.ts`    |
| **unpkg** / **jsdelivr** | CDN 脚本 | `dist/index.full.cjs`   |

现代 Node 和打包器会优先看 `exports`，再回退到这些字段。

## 七、检查与发布前验证

- 使用 **publint** 检查 `exports`、类型路径和扩展名是否符合规范：
  `pnpm run publint`（在根目录对 `packages/element-plus-lab` 执行）。
- 构建后再跑 publint，确保 `dist` 里实际存在 `exports` 中声明的文件（如 `index.d.cts` 需在构建脚本中从 `index.d.ts` 复制生成）。

## 八、小结

| 要点 | 说明 |
|------|------|
| **exports** | 按入口路径 + 条件（import/require/types）精确控制对外暴露的文件 |
| **条件** | `import`（ESM）、`require`（CJS）、`types`（类型）、`default`（兜底） |
| **type: "module"** | 非 ESM 产物用 `.cjs`，类型在 require 下用 `.d.cts`，避免 ESM/类型混用警告 |
| **根入口** | 建议把 `types` 写在 `import` 和 `require` 内部，不要只在顶层写一个 `types` |
| **子路径** | 只暴露需要对外使用的路径，并保持 ESM/CJS/类型扩展名约定一致 |

按上述方式配置后，既能兼容 ESM/CJS 双模式，又能通过 publint 等工具检查，适合作为发布到 npm 的库的长期写法。

---

*本文部分内容由 AI 辅助创作，仅供参考，请以官方文档与项目实践为准。*

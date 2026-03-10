---
title: pnpm Catalog 依赖目录说明
order: 3
---

# pnpm Catalog 依赖目录说明

本文介绍在 pnpm 的 monorepo 中如何使用 **Catalog** 集中管理依赖版本，以及本项目中的目录划分方式。

## 一、为什么需要 Catalog

在 monorepo 里，多个子包往往会用到同一批依赖（如 `vue`、`vite`、`eslint`）。若每个 `package.json` 各自写版本：

- **升级麻烦**：改一个依赖要改很多个 package.json，容易漏改或版本不一致。
- **合并冲突多**：多人改依赖时，同一行版本号容易冲突。
- **版本不统一**：同一依赖出现多个版本，体积变大，还可能带来运行时行为差异。

**Catalog** 把「包名 → 版本范围」集中写在 `pnpm-workspace.yaml` 里，各子包用 `catalog:名称` 引用，实现**单一来源、统一升级**。

## 二、Catalog 的基本用法

### 1. 在 pnpm-workspace.yaml 中定义

有两种写法：

**（1）默认 catalog（单一名录）**

```yaml
# pnpm-workspace.yaml
packages:
  - packages/*

catalog:
  vue: ^3.5.25
  vite: ^7.3.0
```

在 `package.json` 里用 `"catalog:"`（冒号后不写名字）表示使用这个默认 catalog：

```json
{
  "dependencies": {
    "vue": "catalog:",
    "vite": "catalog:"
  }
}
```

**（2）命名 catalog（多个名录）**

用 `catalogs`（复数）定义多个命名目录，便于按用途分组（如构建、文档、测试等）：

```yaml
# pnpm-workspace.yaml
catalogs:
  vue:
    vue: ^3.5.25
    vue-vine: ^1.7.27
  vite:
    vite: ^7.3.0
    '@vitejs/plugin-vue': ^6.0.2
```

在 `package.json` 里用 `"catalog:名称"` 指定用哪个目录里的版本：

```json
{
  "devDependencies": {
    "vue": "catalog:vue",
    "vite": "catalog:vite"
  }
}
```

pnpm 会从对应 catalog 里取出该包声明的版本范围，效果等同于直接写 `"^3.5.25"`、`"^7.3.0"`。

### 2. 可在哪些字段使用

`catalog:` 和 `catalog:名称` 可以用在：

- **package.json**：`dependencies`、`devDependencies`、`peerDependencies`、`optionalDependencies`
- **pnpm-workspace.yaml**：`overrides`

与直接写版本号一样，只是版本来源改成了 workspace 里的 catalog。

### 3. 编辑器支持：Catalog Lens

在 `package.json` 里写的是 `"vue": "catalog:vue"` 这类形式，实际解析出的版本号要到 `pnpm-workspace.yaml` 里才能看到。若希望在编辑器中**直接看到解析后的版本**，可以安装 **Catalog Lens** 类扩展。

例如 [Catalog Lens](https://marketplace.visualstudio.com/items?itemName=antfu.pnpm-catalog-lens)（VS Code / Cursor，作者 Anthony Fu）：

- 在 `package.json` 中，会在 `catalog:xxx` 旁**内联显示**该 catalog 里定义的具体版本范围（如 `^3.5.25`）。
- 支持默认 catalog（`catalog:`）和命名 catalog（`catalog:vue`、`catalog:vite` 等）。
- 悬停时可以看到依赖与 catalog 的对应关系。

安装后无需额外配置，在 monorepo 中打开任意 `package.json` 即可看到每条 catalog 依赖解析出的版本，便于核对和排查依赖。

### 4. 发布时的行为

执行 `pnpm publish` 或 `pnpm pack` 时，pnpm 会把 `catalog:` 协议**替换成** catalog 里实际定义的版本范围再打包。发布出去的 `package.json` 里看到的是普通版本号，而不是 `catalog:xxx`，因此对外部使用者没有影响。

## 三、本项目的 Catalog 划分

本仓库在 `pnpm-workspace.yaml` 里用 **命名 catalog** 按用途拆成多组，方便维护和复用。

| Catalog 名称    | 用途说明           | 典型依赖示例 |
|----------------|--------------------|--------------|
| **cli**        | 命令行、构建工具链 | typescript, lefthook, fast-glob, @changesets/cli |
| **docs**       | 文档站（VitePress 等） | vitepress, @nolebase/*, @vitepress-demo-preview/* |
| **lint-format**| 代码规范与提交规范 | eslint, oxlint, commitlint, czg, lint-staged |
| **style**      | 样式相关           | tailwindcss |
| **vite**       | Vite 及插件、打包  | vite, tsdown, unplugin-*, publint |
| **vitest**     | 单元测试           | vitest, happy-dom |
| **vue**        | Vue 生态与组件库   | vue, element-plus, vue-vine, @vueuse/core |

子包按需引用，例如：

- **根 package.json**：用 `catalog:cli`、`catalog:vite`、`catalog:vue`、`catalog:vitest`、`catalog:lint-format` 等，统一管理根目录脚本和工具链。
- **packages/components**：只用到 Vue 生态，写 `catalog:vue`。
- **docs**：文档相关用 `catalog:docs`，构建与 Vue 用 `catalog:vite`、`catalog:vue`。

这样新增或升级依赖时，只需在 `pnpm-workspace.yaml` 里改对应 catalog 的一处版本，所有引用该 catalog 的包会一起更新。

## 四、日常操作建议

### 1. 新增一个依赖

1. 确定它属于哪一类（构建 / 文档 / 规范 / Vue / 测试等）。
2. 在 `pnpm-workspace.yaml` 的对应 `catalogs.xxx` 下增加一行，例如：

   ```yaml
   catalogs:
     vite:
       # 已有...
       some-new-plugin: ^1.0.0
   ```

3. 在需要用的子包 `package.json` 里写：

```json
{
  "some-new-plugin": "catalog:vite"
}
```

4. 在仓库根目录执行 `pnpm install`，让 pnpm 解析 catalog 并安装。

### 2. 升级某个依赖的版本

只改 `pnpm-workspace.yaml` 里该 catalog 下的版本即可，例如：

```yaml
catalogs:
  vue:
    vue: ^3.5.28
```

所有使用 `"vue": "catalog:vue"` 的包会一起用新范围，再执行一次 `pnpm install` 即可。

### 3. 新增一个 catalog

在 `pnpm-workspace.yaml` 的 `catalogs` 下加一个新键，例如：

```yaml
catalogs:
  # 已有 cli, docs, ...
  my-group:
    some-pkg: ^1.0.0
```

之后在任意子包中写 `"some-pkg": "catalog:my-group"` 即可。

## 五、与 workspace 协议的区别

| 能力       | `workspace:*` / `workspace:^` | `catalog:` / `catalog:name` |
|------------|-------------------------------|-----------------------------|
| 引用对象   | 本仓库内的**其他包**           | **版本范围**（来自 catalog 定义） |
| 典型用途   | 子包之间互相依赖               | 统一第三方依赖的版本         |
| 定义位置   | 各包的 package.json           | pnpm-workspace.yaml 的 catalog(s) |

可以同时使用：例如 `"@element-plus-lab/components": "workspace:*"` 表示依赖本仓库的 components 包，`"vue": "catalog:vue"` 表示 vue 的版本由 catalog 统一管理。

## 六、小结

| 要点 | 说明 |
|------|------|
| **作用** | 在 monorepo 中集中维护依赖版本，子包用 `catalog:` 或 `catalog:名称` 引用，避免重复和冲突。 |
| **定义** | 在 `pnpm-workspace.yaml` 用 `catalog`（默认）或 `catalogs`（命名）写「包名: 版本范围」。 |
| **引用** | 在 package.json 里写 `"包名": "catalog:"` 或 `"包名": "catalog:名称"`。 |
| **发布** | 发布时会被替换成实际版本号，对外透明。 |
| **本项目** | 按用途分为 cli、docs、lint-format、style、vite、vitest、vue 等 catalog，子包按需选用。 |

用好 catalog 后，依赖升级和一致性会集中在 `pnpm-workspace.yaml` 一处，更易维护。

---

*本文部分内容由 AI 辅助创作，仅供参考，请以官方文档与项目实践为准。*

---
title: 分支（摘取/合并）和发版规范
---

# 分支（拉取/合并）和发版规范

保持项目开发的规范性和一致性，是项目长期发展的必要保障，也是团队协作的基础。这里主要介绍项目的分支创建与合并规范，以及版本发布流程和规范。

## 分支拉取

项目的主分支 `main` 是被保护的分支，不可以去接在 `main` 上开发和提交代码，所有的改动必须通过 Merge Request（MR）合入。

功能的新增和问题修复等需要从 `main` 拉取最新代码，具休要求如下：

  - 命名建议：`feat/xxx`、`fix/xxx`、`chore/xxx` 等。
  - 开发流程：
    1. 从 `main` 拉取最新代码：`git checkout main && git pull`.
    2. 创建分支：`git checkout -b feat/xxx`.
    3. 开发 & 提交，提交信息遵循 commitlint 规范（配合 `czg` 使用，使用 `pnpm commit` 交互式提交）。
    4. 提交 MR（源分支：`feat/xxx`，目标分支：`main`），通过代码评审与 CI 后合并。

::: warning

禁止在功能分支中进行以下操作：

- 直接修改包的版本号。
- 直接打 Git 标签（tag）。

:::

## Changesets 使用规范（变更记录）

- 每次有「对外可见」的变更时（如新增 / 修改 API、修复 bug、行为变更），在对应的功能分支上创建一个 changeset。
- 一个分支如果包含多种不同层级的变更（例如既有 bugfix，又有新特性），可以根据需要多次创建 changeset。

当前项目只涉及 `docs` 目录和 `packages/element-plus-lab` 包的版本管理需要生成 changelog，其它的部分不涉及。

项目参考 Element Plus 的提交规范，配置了交互式提交工具 `czg`，在提交完代码后，版本号变更按以下规则进行：

- `patch`：向下兼容的修复或小变更以及项目配置和文档的变更。
- `minor`：向下兼容的新特性。
- `major`：不兼容的破坏性变更。

::: details 直接套用的经验

- 新增组件 / 新的 hook / 新的对外导出 → `minor`
- 在现有组件上「只加不改」，新增可选 API 且默认行为不变 → `minor`
- 修 bug、性能优化、只改内部实现，不暴露新 API → `patch`
- 任何可能让现有调用方代码「编译不过」或「行为变化」的改动 → `major`

:::

在 `docs/` 或者 `packages/element-plus-lab` 目录下执行 `pnpm changeset` 命令会生成一个 `xxxx-描述.md` 文件。**请将该文件和代码一同提交，随 MR 合入 `main`。**

::: info

changeset 小文件只负责「描述变更」，不会立刻修改版本号或生成 changelog。

:::

## 发版流程（版本号、标签与发布）

发版必须通过「发版专用分支 + Release MR」来完成，避免与日常开发耦合。

### 1. 准备发版分支

当 `main` 上已经合入了若干功能 / 修复 MR，且都有对应的 changeset 后：

```bash
git checkout main
git pull origin main
git checkout -b release/vx.y.z   # 例如：release/v0.1.0
```

### 2. 在发版分支上生成版本与 changelog

在发版分支根目录执行：

```bash
pnpm version
```

该命令会：

- 读取已合入的 `.changeset/*.md` 文件。
- 计算每个包的新版本号（如 `packages/element-plus-lab/package.json` 中的 `version`）。
- 为相关包生成 / 更新 `CHANGELOG.md`。
- 删除已被消费的 `.changeset/*.md` 小文件。

执行完成后，会产生一批变更：版本号 + 各包 changelog 更新 + `.changeset` 文件删除。

### 3. 提交发版分支并创建 Release MR

在发版分支上：

```bash
git status   # 确认变更
git add .
git commit -m "chore(release): vx.y.z"
git push origin release/vx.y.z
```

随后提交到 Github 并创建 MR 到 `main` 分支，MR 经评审通过后合并到 `main` 分支。

### 4. 打标签与发布 NPM 包

在本地 `main` 分支上完成打标签与发布：

1. 拉取最新代码与标签：

```bash
git checkout main
git pull origin main --tags
```

2. 如果使用 Changesets 默认行为，会在执行 `pnpm version` 时自动创建 tag（例如 `vx.y.z`）。如有必要，可以手动创建并推送：

```bash
git tag vx.y.z   # 如果尚未打 tag
git push origin vx.y.z
```

3. 发布 NPM 包（示例，以子包 `element-plus-lab` 为例）：

```bash
cd packages/element-plus-lab
pnpm publish --access public
```

::: info

项目暂时手动方式发布 NPM 包，后续会通过 CI 来完成发布。

:::

## 总结

- **开发阶段**：功能分支 + MR 合入 `main`，并在功能分支上用 `pnpm changeset` 记录可发布变更。
- **发版阶段**：从 `main` 创建 `release/vx.y.z` 分支 → 在该分支上执行 `pnpm version` 生成版本 & changelog → 提交 Release MR → 合入 `main`。
- **发布阶段**：在 Release MR 合并后，推送 tag 并执行 `pnpm publish` 发布到 NPM（推荐由 CI 完成）。

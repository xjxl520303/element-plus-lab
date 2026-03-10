---
"element-plus-lab": patch
---

- 修复 `element-plus-lab` 在 eslint / publint 下的配置问题，清理多余字段
- 将 `tsconfig`、`tsdown`、`vitest` 等构建与类型配置上移到仓库根目录，统一管理
- 优化 `useDialog` 钩子实现，并补充单元测试与 playground 示例
- 更新文档与示例代码，补充 useDialog / EllDialogResult 使用说明及项目结构说明
/**
 * 通过 app.use(ElementPlusLab) / app.use(ElementPlus) 注册的全局组件类型声明，
 * 供模板类型检查使用（含通过 alias 拉入的 element-plus-lab 组件源码）。
 */
import type { ElButton, ElDivider, ElIcon } from 'element-plus'
import type { ElSimplePageHeader } from 'element-plus-lab'

declare module 'vue' {
  export interface GlobalComponents {
    ElButton: typeof ElButton
    ElDivider: typeof ElDivider
    ElIcon: typeof ElIcon
    ElSimplePageHeader: typeof ElSimplePageHeader
  }
}

import type { App } from 'vue'
import { useDialog } from '../components/dialog'
import { useDrawer } from '../components/drawer'
import ElFormGroupSfc from '../components/form-group/src/index.vue'
import ElSimplePageHeaderSfc from '../components/simple-page-header/src/index.vue'
import ElSimpleStepsSfc from '../components/simple-steps/src/index.vue'

function withInstall<T extends { name?: string }>(
  comp: T,
  displayName?: string,
): T & { install: (app: App) => void } {
  const name = displayName ?? (comp as { name?: string }).name ?? ''
  ;(comp as T & { install?: (app: App) => void }).install = (app: App) => {
    app.component(name, comp)
  }
  return comp as T & { install: (app: App) => void }
}

export { useDialog, useDrawer }

export const ElFormGroup = withInstall(ElFormGroupSfc)
export const ElSimplePageHeader = withInstall(ElSimplePageHeaderSfc)
export const ElSimpleSteps = withInstall(ElSimpleStepsSfc)

export const ElementPlusLab = {
  install(app: App) {
    app.use(ElFormGroup)
    app.use(ElSimplePageHeader)
    app.use(ElSimpleSteps)
  },
}

export default ElementPlusLab

export type * from '../components/dialog'
export type * from '../components/drawer'
export type * from '../components/form-group'
export type * from '../components/simple-page-header'
export type * from '../components/simple-steps'
export type {
  EllOverlayCloseReason,
  EllOverlayResult,
} from '@element-plus-lab/utils'

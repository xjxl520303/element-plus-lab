import type { DrawerProps } from 'element-plus'
import type { JSX } from 'vue/jsx-runtime'

import type { VNodeChild } from 'vue'
import type { EllOverlayResult } from '@element-plus-lab/utils'

export type EllDrawerVariant = 'blank' | 'default' | 'simple'

export interface EllDrawerHeaderConfig {
  /**
   * 抽屉标题
   */
  title?: string

  /**
   * 是否显示关闭按钮
   *
   * @description 优先级高于 `drawerConfig.showClose`，为 `false` 时隐藏 ElDrawer 自带关闭按钮
   */
  closeable?: boolean

  /**
   * 关闭区域相对于标题的位置
   *
   * @description
   * - `left`：关闭区域在左侧，标题在右侧
   * - `right`：标题在左侧，关闭区域在右侧
   *
   * 关闭按钮仅允许出现在头部最左或最右的位置。
   */
  closePlacement?: 'left' | 'right'
}

export interface EllDrawerActionConfig {
  /**
   * 抽屉底部按钮配置
   *
   * @defaultValue `['cancel', 'ok']`
   */
  actions?: Array<'cancel' | 'ok'>

  /**
   * 【确定】按钮的文本
   *
   * @defaultValue `确定`
   */
  okText?: string

  /**
   * 【取消】按钮的文本
   *
   * @defaultValue `取消`
   */
  cancelText?: string

  /**
   * 底部操作区域的位置
   */
  placement?: 'top' | 'bottom'

  /**
   * 【确认】按钮的回调函数
   */
  okHandler?: (
    resolve: (v: EllOverlayResult) => void,
    reject: (v: EllOverlayResult) => void,
  ) => Promise<void> | void

  /**
   * 【取消】按钮的回调函数
   */
  cancelHandler?: (
    resolve: (v: EllOverlayResult) => void,
    reject: (v: EllOverlayResult) => void,
  ) => Promise<void> | void
}

export interface EllDrawerProps {
  /**
   * 抽屉标题（便捷入口）
   *
   * @description
   * - 常用场景下可直接通过该字段设置标题；
   * - 当同时在 `headerConfig.title` 中指定标题时，以 `headerConfig.title` 为准。
   */
  title?: string

  /**
   * 抽屉展示变体
   *
   * @description 用于控制抽屉的整体外观和布局风格
   */
  variant?: EllDrawerVariant

  /**
   * 头部区域配置
   *
   * @description 包含标题、关闭按钮、图标等配置
   */
  headerConfig?: EllDrawerHeaderConfig

  /**
   * 底部操作区域配置
   *
   * @description 包含按钮组、文案和布局等配置
   */
  actionConfig?: EllDrawerActionConfig

  /**
   * 抽屉宽度（或高度，取决于方向）
   *
   * @defaultValue `400`
   */
  size?: number | string

  /**
   * `<el-drawer>` 的属性
   */
  drawerConfig?: Partial<DrawerProps>

  /**
   * 抽屉主体内容（适用于简单文本）
   */
  content?: string | VNodeChild

  /**
   * 渲染抽屉头部
   */
  renderHeader?: (
    resolve: (v: EllOverlayResult | Promise<EllOverlayResult>) => void,
    reject: (value?: any) => void,
  ) => JSX.Element | string | VNodeChild

  /**
   * 渲染抽屉主体内容
   */
  render?: (
    resolve: (v: EllOverlayResult | Promise<EllOverlayResult>) => void,
    reject: (value?: any) => void,
  ) => JSX.Element | string | VNodeChild

  /**
   * 渲染抽屉底部内容
   */
  renderFooter?: (
    resolve: (v: EllOverlayResult | Promise<EllOverlayResult>) => void,
    reject: (value?: any) => void,
  ) => JSX.Element | string | VNodeChild

  /**
   * 抽屉关闭前的拦截函数
   *
   * @param resolve 成功关闭抽屉方法（`resolve({ reason: 'ok', data: '...'})`）
   * @param reject 取消关闭抽屉方法（`reject({ reason: 'cancel', data: '...'})`）
   * @returns 返回 `false` 阻止关闭，返回 `true`、`undefined` 或 `Promise<void>` 允许关闭。也可以通过 `resolve`/`reject` 手动控制关闭
   */
  beforeClose?: (
    resolve: (v: EllOverlayResult) => void,
    reject: (v: EllOverlayResult) => void,
  ) => boolean | Promise<boolean | undefined> | Promise<void> | undefined
}


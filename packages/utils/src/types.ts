/**
 * 通用的浮层关闭原因类型
 *
 * 适用于对话框、抽屉等交互组件的关闭场景：
 * - `cancel`：用户主动取消
 * - `close`：点击关闭按钮或遮罩等关闭
 * - `ok`：确认关闭
 */
export type EllOverlayCloseReason = 'cancel' | 'close' | 'ok'

/**
 * 通用的浮层关闭结果类型
 *
 * 适用于对话框、抽屉等交互组件的关闭场景：
 * - `data`：浮层关闭时传递的参数
 * - `reason`：关闭原因，见 {@link EllOverlayCloseReason}
 */
export interface EllOverlayResult {
  /**
   * 浮层关闭时传递的参数
   */
  data?: any

  /**
   * 关闭原因，见 {@link EllOverlayCloseReason}
   */
  reason: EllOverlayCloseReason
}
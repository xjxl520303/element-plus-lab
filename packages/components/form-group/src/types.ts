export interface EllFormGroupProps {
  /**
   * 分组标题
   *
   * @description 分组的标题文本
   */
  title?: string

  /**
   * 分组描述信息
   *
   * @description 分组的描述信息
   */
  description?: string

  /**
   * 是否默认折叠分组（仅在不使用 v-model:folded 时生效）
   *
   * @defaultValue `false`
   */
  defaultFolded?: boolean

  /**
   * 是否开启折叠/展开动画
   *
   * @defaultValue `false`
   */
  animated?: boolean

  /**
   * 展开前钩子：返回 `false` 或 `Promise<false>` 可阻止展开
   */
  beforeExpand?: () => boolean | Promise<boolean | void>

  /**
   * 展开后钩子：展开完成后触发，可用于异步加载内容并配合加载动画
   */
  afterExpand?: () => void | Promise<void>

  /**
   * 折叠前钩子：返回 `false` 或 `Promise<false>` 可阻止折叠
   */
  beforeCollapse?: () => boolean | Promise<boolean | void>

  /**
   * 折叠后钩子：折叠完成后触发
   */
  afterCollapse?: () => void | Promise<void>
}

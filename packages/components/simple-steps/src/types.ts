export interface EllSimpleStepsOption {
  /** 标签 */
  label: string
  /** 值（步骤序号，从 1 开始） */
  value: number
}

export interface EllSimpleStepsProps {
  /**
   * 步骤选项
   *
   * @description 步骤选项，用于配置步骤的标签和值
   * @defaultValue `[]`
   */
  options: EllSimpleStepsOption[]
  /**
   * 步骤项最小间距
   *
   * @defaultValue `16`
   */
  space?: number
}

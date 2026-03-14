import type { TemplatePromiseProps } from '@vueuse/core'

import type { EllDrawerProps } from './types'

import { createTemplatePromise } from '@vueuse/core'
import { ElButton, ElDrawer } from 'element-plus'
import { PortalTarget, Wormhole } from 'portal-vue'
import { ulid } from 'ulid'
import type { VNodeChild } from 'vue'
import { ref } from 'vue'
import { getPromiseState, type EllOverlayResult } from '@element-plus-lab/utils'

/**
 * `ElDrawer` 封装
 *
 * @param keepInstance 是否保持实例（不销毁 `ElDrawer` 组件，可以多次打开同一个抽屉）
 * @param targetName `ElDrawer` 组件放置位置 `portal-vue` 目标名称，默认为 `ell-drawer`
 */
export function useDrawer(keepInstance = false, targetName = 'ell-drawer') {
  const sender = ulid()
  const InnerDrawer = createTemplatePromise<EllOverlayResult, [EllDrawerProps?]>()

  const visible = ref(false)
  const instanceArgs = ref<EllDrawerProps | undefined>(undefined)

  let {
    promise,
    resolve: instanceResolve,
    reject: instanceReject,
  } = Promise.withResolvers<EllOverlayResult | undefined>()

  const setCommonProps = (props: EllDrawerProps | undefined): any => {
    // 未传入任何配置时，仅展示一个可点击遮罩关闭的空抽屉（等价于 variant: 'blank'）
    if (!props) {
      return {
        appendToBody: true,
        withHeader: false,
        closeOnClickModal: true,
        closeOnPressEscape: true,
        size: 400,
      }
    }

    const variant = props.variant ?? 'default'
    const headerTitle = props.headerConfig?.title ?? props.title
    const closePlacement = props.headerConfig?.closePlacement
    const closeable = props.headerConfig?.closeable

    // 按 variant 设定：blank 无头部且遮罩可关，default/simple 有头部
    const blankVariant = variant === 'blank'
    const simpleVariant = variant === 'simple'
    const withHeader = blankVariant
      ? false
      : (props.drawerConfig?.withHeader ?? true)
    const closeOnClickModal =
      props.drawerConfig?.closeOnClickModal ?? blankVariant
    // simple 仅能通过右上角关闭按钮关闭，不响应遮罩与 Esc
    const closeOnPressEscape =
      props.drawerConfig?.closeOnPressEscape ?? !simpleVariant

    // headerConfig.closeable 优先于 drawerConfig.showClose
    const showClose =
      closeable === false ? false : (props.drawerConfig?.showClose ?? true)

    const drawerConfig = props.drawerConfig as Record<string, unknown> | undefined
    const mergedClass =
      closePlacement === 'left'
        ? [drawerConfig?.class, 'ell-drawer-close-left'].flat().filter(Boolean)
        : undefined

    return {
      appendToBody: true,
      withHeader,
      closeOnClickModal,
      closeOnPressEscape,
      title: headerTitle || '编辑',
      size: props.size ?? 400,
      ...props.drawerConfig,
      ...(mergedClass != null && mergedClass.length > 0 ? { class: mergedClass } : {}),
      showClose,
    }
  }

  /** 渲染默认的取消/确定按钮组，用于 footer 或 header（placement === 'top'） */
  const renderActionButtons = (
    p: EllDrawerProps | undefined,
    res: (value: EllOverlayResult | Promise<EllOverlayResult>) => void,
    rej: (value?: any) => void,
  ): VNodeChild[] => {
    const actions = p?.actionConfig?.actions ?? ['cancel', 'ok']
    const okText = p?.actionConfig?.okText || '确定'
    const cancelText = p?.actionConfig?.cancelText || '取消'
    const result: VNodeChild[] = []
    if (actions?.includes('cancel')) {
      result.push(
        <ElButton
          onClick={() =>
            p?.actionConfig?.cancelHandler
              ? p.actionConfig.cancelHandler(res, rej)
              : rej({ reason: 'cancel' as const })
          }
        >
          {cancelText}
        </ElButton>,
      )
    }
    if (actions?.includes('ok')) {
      result.push(
        <ElButton
          type="primary"
          onClick={() =>
            p?.actionConfig?.okHandler
              ? p.actionConfig.okHandler(res, rej)
              : res({ reason: 'ok' as const })
          }
        >
          {okText}
        </ElButton>,
      )
    }
    return result
  }

  const setSlotCommonLogic = (
    props: EllDrawerProps | undefined,
    resolve: (value: EllOverlayResult | Promise<EllOverlayResult>) => void,
    reject: (value?: any) => void,
  ): {
    header?: VNodeChild | null
    default: () => VNodeChild
    footer: () => VNodeChild
  } => {
    const isUsePortalHeader =
      Wormhole.getContentForTarget(`${sender}-el-drawer-header`).length > 0
    const isUsePortalFooter =
      Wormhole.getContentForTarget(`${sender}-el-drawer-footer`).length > 0

    const variant = props?.variant ?? 'default'
    const showHeader = variant !== 'blank'
    const placement = props?.actionConfig?.placement ?? 'bottom'
    const showDefaultFooterButtons =
      variant === 'default' && placement !== 'top'

    const needCustomDefaultHeader =
      showHeader &&
      !props?.renderHeader &&
      !isUsePortalHeader &&
      (props?.headerConfig?.closePlacement != null ||
        placement === 'top')

    const defaultHeaderTitle =
      props?.headerConfig?.title ?? props?.title ?? '编辑'

    return {
      ...(showHeader &&
        (props?.renderHeader
          ? {
              header: props.renderHeader(resolve, reject),
            }
          : isUsePortalHeader
            ? {
                header: (
                  <PortalTarget
                    multiple={true}
                    name={`${sender}-el-drawer-header`}
                    slotProps={{
                      resolve,
                      reject,
                      props,
                    }}
                  />
                ),
              }
            : needCustomDefaultHeader
              ? {
                  header: (
                    <div
                      class="ell-drawer-header-default"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span class="ell-drawer-header-title">{defaultHeaderTitle}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {placement === 'top' && renderActionButtons(props, resolve, reject)}
                      </div>
                    </div>
                  ),
                }
              : null)),
      default: () => {
        if (props?.render) {
          return props.render(resolve, reject)
        }

        if (props?.content) {
          return <div>{props.content}</div>
        }

        return (
          <PortalTarget
            multiple={true}
            name={`${sender}-el-drawer-content`}
            slotProps={{
              resolve,
              reject,
              props,
            }}
          />
        )
      },
      footer: () => {
        if (props?.renderFooter) {
          return props.renderFooter(resolve, reject)
        }
        if (isUsePortalFooter) {
          return (
            <PortalTarget
              multiple={true}
              name={`${sender}-el-drawer-footer`}
              slotProps={{
                resolve,
                reject,
                props,
              }}
            />
          )
        }
        // variant === 'default' 且 placement !== 'top' 时在底部显示默认取消/确定按钮
        if (showDefaultFooterButtons) {
          return renderActionButtons(props, resolve, reject)
        }
        return []
      },
    }
  }

  const createBeforeCloseHandler = (
    props: EllDrawerProps | undefined,
    resolve: (value: EllOverlayResult | Promise<EllOverlayResult>) => void,
    reject: (value?: any) => void,
  ): ((done: () => void) => Promise<void>) => {
    return async (done: () => void) => {
      if (!props?.beforeClose) {
        reject({ reason: 'close' as const })
        done()
        return
      }

      let handled = false

      const beforeResolve = (value: EllOverlayResult) => {
        handled = true
        resolve(value)
        done()
      }

      const beforeReject = (value: EllOverlayResult) => {
        handled = true
        reject(value)
        done()
      }

      try {
        const result = await props.beforeClose(beforeResolve, beforeReject)
        if (handled) return
        if (result === false) return
      } catch {
        return
      }

      reject({ reason: 'close' as const })
      done()
    }
  }

  const EllDrawer = () => {
    if (keepInstance) {
      const resolve = (value: EllOverlayResult | Promise<EllOverlayResult>) => {
        visible.value = false
        instanceResolve(value)
        const newPromise = Promise.withResolvers<EllOverlayResult | undefined>()
        promise = newPromise.promise
        instanceResolve = newPromise.resolve
        instanceReject = newPromise.reject
      }

      const reject = (value?: any) => {
        visible.value = false
        instanceReject(value)
        const newPromise = Promise.withResolvers<EllOverlayResult | undefined>()
        promise = newPromise.promise
        instanceResolve = newPromise.resolve
        instanceReject = newPromise.reject
      }

      // @ts-expect-error Type instantiation is excessively deep
      const commonProps = setCommonProps(instanceArgs.value) as any

      const beforeCloseHandler = async (done: () => void) => {
        if ((await getPromiseState(promise)) === 'pending') {
          await createBeforeCloseHandler(
            instanceArgs.value,
            resolve,
            reject,
          )(done)
        }
      }

      return (
        <ElDrawer
          beforeClose={beforeCloseHandler}
          v-model={visible.value}
          {...commonProps}
        >
          {setSlotCommonLogic(instanceArgs.value, resolve, reject) as any}
        </ElDrawer>
      )
    }

    return (
      <InnerDrawer>
        {{
          default: (
            slotProps: TemplatePromiseProps<EllOverlayResult, [EllDrawerProps?]>,
          ) => {
            const { resolve, reject, args } = slotProps
            const props = args[0]

            const commonProps = setCommonProps(props) as any
            const beforeCloseHandler = (done: () => void) => {
              createBeforeCloseHandler(props, resolve, reject)(done)
            }

            return (
              <ElDrawer
                modelValue={true}
                {...commonProps}
                beforeClose={beforeCloseHandler}
              >
                {setSlotCommonLogic(props, resolve, reject)}
              </ElDrawer>
            )
          },
        }}
      </InnerDrawer>
    )
  }

  return {
    /**
     * 抽屉唯一标识符，用于 portal-vue 指定内容
     */
    drawerUid: sender,

    /**
     * 抽屉头部 portal-vue 目标名称
     */
    headerPortalName: `${sender}-el-drawer-header`,

    /**
     * 抽屉主体 portal-vue 目标名称
     */
    contentPortalName: `${sender}-el-drawer-content`,

    /**
     * 抽屉底部 portal-vue 目标名称
     */
    footerPortalName: `${sender}-el-drawer-footer`,

    /**
     * 【打开】抽屉
     */
    openDrawer: async (args?: EllDrawerProps) => {
      const hasArgs =
        args && (Object.keys(args).length > 0 || Object.keys(args.drawerConfig ?? {}).length > 0)
      const effectiveArgs = hasArgs ? args : undefined

      Wormhole.open({
        to: targetName,
        from: sender,
        content: EllDrawer as any,
      })

      if (!keepInstance) {
        return await InnerDrawer.start(effectiveArgs)
      }

      instanceArgs.value = effectiveArgs
      visible.value = true
      return promise
    },
  }
}


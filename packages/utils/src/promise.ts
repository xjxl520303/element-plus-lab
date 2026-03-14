/**
 * Promise 状态类型
 *
 * - `fulfilled`：已成功
 * - `rejected`：已拒绝
 * - `pending`：仍在进行中
 */
export type PromiseState = 'fulfilled' | 'pending' | 'rejected'

/**
 * 获取 Promise 当前状态
 *
 * @param p 需要检查的 Promise 对象
 * @returns Promise 状态
 */
export async function getPromiseState(
  p: Promise<unknown>,
): Promise<PromiseState> {
  return await Promise.race([
    Promise.resolve(p).then(
      (): PromiseState => 'fulfilled',
      (): PromiseState => 'rejected',
    ),
    Promise.resolve().then((): PromiseState => 'pending'),
  ])
}


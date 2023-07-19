/**
 * 判断是否未定义
 * @param v 变量
 * @returns 如果变量定义则返回true,否则返回false
 */
export const isUndef = (v: unknown): boolean => v === undefined || v === null

export type classNamesOptions = Array<Record<string, any> | string> | Record<string, any> | string
/**
 * 根据条件判断生产className
 * @param options classNamesOptions
 * @returns 返回实际渲染的className
 */
export const classNames = (options: classNamesOptions): string | undefined => {
  if (typeof options === 'string') {
    return options
  }

  if (options instanceof Array) {
    return options.map(classNames).join(' ')
  }

  const isDef = !isUndef(options)
  if (isDef && typeof options === 'object') {
    return Object.keys(options)
      .filter((key: string) => !!options[key])
      .join(' ')
  }

  return undefined
}

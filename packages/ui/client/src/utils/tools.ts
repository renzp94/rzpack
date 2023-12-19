import dayjs from 'dayjs'

/**
 * 格式化时间戳
 * @param time 时间戳
 * @param format 格式
 * @returns 时间
 */
export const timeFormat = (time: number | undefined, format = 'YYYY-MM-DD HH:mm:ss'): string => {
  if (time) {
    const date = dayjs(Number(time.toString().padEnd(13, '0')))
    if (date.isValid()) {
      return date.format(format)
    }
  }

  return ''
}

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

/**
 * 复制文本
 * @param text 复制内容
 */
export const copyText = (text: string) => {
  // navigator.clipboard只能用于https或者localhost。
  if (navigator?.clipboard?.writeText) {
    return navigator.clipboard.writeText(text)
  }
  const input = document.createElement('input')
  document.body.appendChild(input)
  input.value = text
  input.select()
  document.execCommand('copy')
  document.body.removeChild(input)
  return Promise.resolve()
}

/**
 * 字符串首字母大写
 * @param str 要转化字符串
 * @returns 返回转换后的字符串
 */
export const firstCharToUpperCase = (str: string) =>
  str?.slice(0, 1).toUpperCase() + str?.slice(1, str.length)

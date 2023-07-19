import dayjs from 'dayjs'

/**
 * 判断是否未定义
 * @param v 变量
 * @returns 如果变量定义则返回true,否则返回false
 */
export const isUndef = (v: unknown): boolean => v === undefined || v === null

/**
 * 格式化时间戳
 * @param time 时间戳
 * @param format 格式
 * @returns 时间
 */
export const timeFormat = (time: number | undefined, format = 'YYYY-MM-DD HH:mm:ss'): string => {
  if (time) {
    const date = dayjs(time)
    if (date.isValid()) {
      return date.format(format)
    }
  }

  return ''
}
/**
 * 清除对象中的字符串前后空格
 * @param target 目标对象
 * @returns 去除前后空格后的对象
 */
export const recordValueTrim = (target: Record<string, any>) => {
  // 不为空且是对象或数组
  if (target && typeof target === 'object') {
    // 如果数组则使用数组解构，如果是对象则使用对象结构
    const query: Record<string, any> = target instanceof Array ? [...target] : { ...target }
    const keys = Object.keys(query)
    keys.forEach(key => {
      // 是string则进行trim
      if (typeof query[key] === 'string') {
        query[key] = (query[key] as string).trim()
        return
      }
      // 如果是数组，则递归处理
      if (query[key] instanceof Array) {
        query[key] = query[key].map((item: any) => {
          return typeof item === 'string' ? item.trim() : recordValueTrim(item)
        })
        return
      }
      // 如果是对象则处理对象
      if (typeof query[key] === 'object') {
        query[key] = recordValueTrim(query[key])
      }
    })

    return query
  }

  return target
}
type FlattenDeepByKey<T = any> = (list: Array<T>, key: string) => Array<T>
/**
 * 通过指定key深度递归扁平化数组
 * @param list 要扁平化的数组
 * @param key 扁平化依据的字段
 * @returns 返回扁平化后的数组
 */
export const flattenDeepByKey: FlattenDeepByKey = (list, key) => {
  return list.reduce(
    (prev: Parameters<FlattenDeepByKey>[0], curr: Parameters<FlattenDeepByKey>[0][0]) => [
      ...prev,
      curr,
      ...(curr[key] ? flattenDeepByKey(curr[key], key) : []),
    ],
    []
  ) as ReturnType<FlattenDeepByKey>
}
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
 * 将数字转换为千分位分隔的字符串
 * @param value 千分位分隔
 * @param decimalZeroCount 小数位补0的个数
 * @returns 返回千分位分隔的字符串
 */
export const thousandthSeparate = (value: number | string, decimalZeroCount = 0) => {
  if (!value && value !== 0) {
    return ''
  }

  const values = value.toString()?.split('.')
  values[0] = values[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  if (decimalZeroCount) {
    if (values.length === 1) {
      values.push(''.padStart(decimalZeroCount, '0'))
    } else {
      values[1] = values[1].padEnd(decimalZeroCount, '0')
    }
  }

  return values.join('.')
}
export type UnitOfTime =
  | 'd'
  | 'day'
  | 'days'
  | 'h'
  | 'hour'
  | 'hours'
  | 'm'
  | 'M'
  | 'millisecond'
  | 'milliseconds'
  | 'minute'
  | 'minutes'
  | 'month'
  | 'months'
  | 'ms'
  | 's'
  | 'second'
  | 'seconds'
  | 'w'
  | 'week'
  | 'weeks'
  | 'y'
  | 'year'
  | 'years'

export function timeFormatRange(timeStamp: dayjs.Dayjs | number, unitOfTime: UnitOfTime): number
export function timeFormatRange(
  timeStamp: Array<dayjs.Dayjs | number>,
  unitOfTime: UnitOfTime
): Array<number>

/**
 * 将时间戳转换为指定格式的开始时间和结束时间
 * @param timeStamp 需要转换的时间戳
 * @param unitOfTime 转换的格式
 * @returns 如果timeStamp参数是number，则返回指定格式的开始时间。
 * 如果是数组，返回一个数组，第一个元素转换为指定格式的开始时间，第二个元素转换为指定格式的结束时间。
 */
export function timeFormatRange(
  timeStamp: Array<dayjs.Dayjs | number> | dayjs.Dayjs | number,
  unitOfTime: UnitOfTime = 'days'
): number | number[] {
  if (typeof timeStamp === 'number') {
    return dayjs(timeStamp).startOf(unitOfTime).valueOf()
  }

  if (dayjs.isDayjs(timeStamp)) {
    return timeStamp.startOf(unitOfTime).valueOf()
  }

  const [start, end] = timeStamp
  return [
    (dayjs.isDayjs(start) ? start : dayjs(start)).startOf(unitOfTime).valueOf(),
    (dayjs.isDayjs(end) ? end : dayjs(end)).endOf(unitOfTime).valueOf(),
  ]
}

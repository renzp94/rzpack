import { logError } from 'rzpack-utils'
import type WebpackChain from 'webpack-chain'
import { DEFAULT_CONFIG } from '../../constant'

const getEntryKey = (entry: string) =>
  entry
    .split('/')
    .pop()
    .replace('.tsx', '')
    .replace('.jsx', '')
    .replace('.ts', '')
    .replace('.js', '')

export default (
  webpackChain: WebpackChain,
  entry: string | string[] | Record<string, string>,
) => {
  if (entry) {
    switch (true) {
      case typeof entry === 'string': {
        // eslint-disable-next-line no-case-declarations
        const key = getEntryKey(entry as string)
        webpackChain.entry(key).add(entry as string)
        break
      }
      case Array.isArray(entry): {
        // eslint-disable-next-line no-case-declarations
        const entryOption = (entry as Array<string>).map((item: string) => {
          if (typeof item !== 'string') {
            console.log(
              logError(
                'entry配置有误, 如果配置为Array, 应该配置为Array<string>类型',
              ),
            )
            process.exit(-1)
          }
          const key = getEntryKey(item)
          return {
            [key]: item,
          }
        })
        entryOption.forEach((item: Record<string, string>) => {
          const key = Object.keys(item)[0]
          webpackChain.entry(key).add(item[key])
        })
        break
      }
      case typeof entry === 'object': {
        Object.keys(entry).forEach((key: string) => {
          webpackChain.entry(key).add(entry[key])
        })
        break
      }
    }
  } else {
    webpackChain.entry('main').add(DEFAULT_CONFIG.ENTRY)
  }
}

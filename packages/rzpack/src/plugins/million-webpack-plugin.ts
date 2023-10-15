import million from 'million/compiler'
import type WebpackChain from 'webpack-chain'

export interface MillionOptions {
  optimize?: boolean
  server?: boolean
  mode?: 'react' | 'preact' | 'react-server' | 'preact-server' | 'vdom'
  mute?: boolean | 'info'
  auto?:
    | boolean
    | {
        threshold?: number
        rsc?: boolean
        skip?: (string | RegExp)[]
      }
  _file?: string
}

export default (
  webpackChain: WebpackChain,
  options: MillionOptions = { auto: true },
) => {
  webpackChain.plugin('million-webpack-plugin').use(million.webpack(options))
}

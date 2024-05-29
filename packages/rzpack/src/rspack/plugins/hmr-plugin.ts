import { HotModuleReplacementPlugin } from '@rspack/core'
import { resolveClientEnv } from 'rzpack-utils'
import type WebpackChain from 'webpack-chain'

export default (webpackChain: WebpackChain) => {
  webpackChain.plugin('hmr-plugin').use(HotModuleReplacementPlugin)
}

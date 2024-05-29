import { DefinePlugin } from '@rspack/core'
import { resolveClientEnv } from 'rzpack-utils'
import type WebpackChain from 'webpack-chain'

export default (webpackChain: WebpackChain) => {
  webpackChain
    .plugin('define-plugin')
    .use(DefinePlugin, [resolveClientEnv() as any])
}

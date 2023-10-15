import { resolveClientEnv } from 'rzpack-utils'
import webpack from 'webpack'
import type WebpackChain from 'webpack-chain'

export default (webpackChain: WebpackChain) => {
  webpackChain
    .plugin('define-plugin')
    .use(webpack.DefinePlugin, [resolveClientEnv()])
}

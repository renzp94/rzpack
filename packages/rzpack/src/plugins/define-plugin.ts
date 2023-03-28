import type WebpackChain from 'webpack-chain'
import webpack from 'webpack'
import { resolveClientEnv } from 'rzpack-utils'

export default (webpackChain: WebpackChain) => {
  webpackChain.plugin('define-plugin').use(webpack.DefinePlugin, [resolveClientEnv()])
}

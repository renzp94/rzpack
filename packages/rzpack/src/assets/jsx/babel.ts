import type WebpackChain from 'webpack-chain'
import { requireResolve } from 'rzpack-utils'

export default (webpackChain: WebpackChain) => {
  // 配置babel
  return webpackChain.module
    .rule('babel')
    .test(/\.[tj]sx?$/)
    .exclude.add(/node_modules/)
    .end()
    .use('babel')
    .loader(requireResolve('babel-loader'))
    .options({
      cacheDirectory: true,
      presets: [requireResolve('rzpack-babel-preset')],
    })
    .end()
}

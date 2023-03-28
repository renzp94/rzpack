import type WebpackChain from 'webpack-chain'
import { pathResolve } from 'rzpack-utils'
import { rzpack } from '../cli'

const resolveOutput = (webpackChain: WebpackChain, output = 'dist') => {
  // 配置打包输出文件
  webpackChain.output
    .path(pathResolve(output, process.cwd()))
    .filename('assets/js/[name].[contenthash].js')
    .chunkFilename('assets/js/[name].[contenthash].js')
    // 构建前先清空目录
    .set('clean', rzpack.mode === 'production')
    .end()
    // 将runtime代码抽离成一个
    .optimization.runtimeChunk(true)
    // vendors包的hash值保持不变，用于优化公共库的长期缓存
    .set('chunkIds', 'deterministic')
}

export default resolveOutput

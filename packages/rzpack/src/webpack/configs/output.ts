import { pathResolve } from 'rzpack-utils'
import type { Configuration } from 'webpack'
import type WebpackChain from 'webpack-chain'

export type Output = Configuration['output'] | string

const defaultFileName = 'assets/js/[name].[contenthash].js'
const defaultChunkFilename = 'assets/js/[name].[contenthash].js'

export default (webpackChain: WebpackChain, output: Output = 'dist') => {
  let configs: Output = {
    filename: defaultFileName,
    chunkFilename: defaultChunkFilename,
  }

  if (typeof output === 'string') {
    configs.path = pathResolve(output, process.cwd())
  } else {
    configs = {
      ...configs,
      ...output,
      path: pathResolve(output?.path, process.cwd()),
    }
  }

  const webpackOutput = webpackChain.output
  Object.keys(configs).forEach((key) => {
    webpackOutput[key](configs[key])
  })

  // 配置打包输出文件
  webpackOutput
    // 构建前先清空目录
    .set('clean', process.env.NODE_ENV === 'production')
    .end()
    // 将runtime代码抽离成一个
    .optimization.runtimeChunk(true)
    // vendors包的hash值保持不变，用于优化公共库的长期缓存
    .set('chunkIds', 'deterministic')
}

import type WebpackChain from 'webpack-chain'
import { getFileFullPath, requireResolve, fileExists } from 'rzpack-utils'

export default (webpackChain: WebpackChain) => {
  const tsconfig = getFileFullPath('./tsconfig.json')
  const tsconfigRaw = fileExists(tsconfig) ? require(tsconfig) : undefined

  return webpackChain.module
    .rule('esbuild')
    .test(/\.[tj]sx?$/)
    .exclude.add(/node_modules/)
    .end()
    .use('esbuild')
    .loader(requireResolve('esbuild-loader'))
    .options({
      loader: 'tsx',
      target: 'es2015',
      tsconfigRaw,
    })
    .end()
}

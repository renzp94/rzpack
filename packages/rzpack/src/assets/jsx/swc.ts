import { requireResolve } from 'rzpack-utils'
import type WebpackChain from 'webpack-chain'
import { rzpack } from '../../cli'

export default (webpackChain: WebpackChain) => {
  return webpackChain.module
    .rule('swc')
    .test(/\.[tj]sx?$/)
    .exclude.add(/node_modules/)
    .end()
    .use('swc')
    .loader(requireResolve('swc-loader'))
    .options({
      jsc: {
        parser: {
          syntax: 'typescript',
          dynamicImport: true,
          tsx: true,
          decorators: true,
        },
        target: 'es2015',
        externalHelpers: false,
        transform: {
          react: {
            runtime: 'automatic',
            development: rzpack.mode === 'development',
            useBuiltins: true,
          },
        },
      },
      minify: rzpack.mode === 'production',
    })
    .end()
}

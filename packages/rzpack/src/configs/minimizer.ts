import type WebpackChain from 'webpack-chain'
import type { Optimization } from 'webpack-chain'
import { ESBuildMinifyPlugin } from 'esbuild-loader'
import { JSX_TOOLS } from '..'

/**
 * esbuild压缩
 */
const esbuildMinimizer = (minimizer: Optimization) => {
  minimizer
    .minimizer('js-esbuild-minimizer')
    .use(ESBuildMinifyPlugin, [
      { target: 'es2015', legalComments: 'none', css: true, drop: ['console'] },
    ])
}

export default (webpackChain: WebpackChain, miniTools: JSX_TOOLS = JSX_TOOLS.ESBUILD) => {
  // css压缩
  const minimizer = webpackChain.optimization

  const minimizers = {
    swc: esbuildMinimizer,
    esbuild: esbuildMinimizer,
  }

  minimizers[miniTools]?.(minimizer)
}

import type WebpackChain from 'webpack-chain'
import type { Optimization } from 'webpack-chain'
import CssMinimizerWebpackPlugin from 'css-minimizer-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import { ESBuildMinifyPlugin } from 'esbuild-loader'
import { JSX_TOOLS } from '..'

/**
 * babel压缩
 */
const babelMinimizer = (minimizer: Optimization) => {
  minimizer.minimizer('js-minimizer').use(TerserPlugin, [
    {
      terserOptions: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        parse: {
          ecma: 8,
        },
        compress: {
          ecma: 5,
          warnings: false,
          comparisons: false,
          inline: 2,
          drop_console: true,
        },
        mangle: {
          safari10: true,
        },
        output: {
          ecma: 5,
          comments: false,
          ascii_only: true,
        },
      },
    },
  ])
}
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

export default (webpackChain: WebpackChain, miniTools: JSX_TOOLS = JSX_TOOLS.BABEL) => {
  // css压缩
  const minimizer = webpackChain.optimization
  // 如果是babel则使用css-minimizer-webpack-plugin，esbuild则使用esbuild自带的css压缩
  if (miniTools === JSX_TOOLS.BABEL) {
    minimizer
      .minimize(true)
      .minimizer('css-minimizer')
      .use(CssMinimizerWebpackPlugin, [{ test: /\.css/ }])
      .end()
  }

  const minimizers = {
    babel: babelMinimizer,
    swc: esbuildMinimizer,
    esbuild: esbuildMinimizer,
  }

  minimizers[miniTools]?.(minimizer)
}

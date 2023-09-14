import type WebpackChain from 'webpack-chain'
import type { Optimization } from 'webpack-chain'
import { ESBuildMinifyPlugin } from 'esbuild-loader'
import { JSX_TOOLS } from '..'
import ImageMinimizerPlugin, { FilterFn } from 'image-minimizer-webpack-plugin'

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

export default (
  webpackChain: WebpackChain,
  miniTools: JSX_TOOLS = JSX_TOOLS.ESBUILD,
  imageMini: boolean | FilterFn
) => {
  // css压缩
  const minimizer = webpackChain.optimization

  const minimizers = {
    swc: esbuildMinimizer,
    esbuild: esbuildMinimizer,
  }

  minimizers[miniTools]?.(minimizer)

  // 图片压缩
  if (imageMini) {
    minimizer
      .minimize(true)
      .minimizer('image-minimizer')
      .use(ImageMinimizerPlugin, [
        {
          minimizer: {
            filter:
              typeof imageMini === 'boolean'
                ? (source) => source.byteLength >= 1024 * 1024
                : imageMini,
            implementation: ImageMinimizerPlugin.imageminMinify,
            options: {
              plugins: [
                ['gifsicle', { interlaced: true }],
                ['jpegtran', { progressive: true }],
                ['optipng', { optimizationLevel: 5 }],
                [
                  'svgo',
                  {
                    plugins: [
                      {
                        name: 'preset-default',
                        params: {
                          overrides: {
                            removeViewBox: false,
                            addAttributesToSVGElement: {
                              params: {
                                attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }],
                              },
                            },
                          },
                        },
                      },
                    ],
                  },
                ],
              ],
            },
          },
        },
      ])
      .end()
  }
}

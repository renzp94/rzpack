import ImageMinimizerPlugin, {
  type FilterFn,
} from 'image-minimizer-webpack-plugin'
import { requireResolve } from 'rzpack-utils'
import type WebpackChain from 'webpack-chain'

export default (webpackChain: WebpackChain, imageMini?: boolean | FilterFn) => {
  // 处理图片
  const rule = webpackChain.module
    .rule('images')
    .test(/\.(png|jpg|jpeg|gif|webp)$/i)
    .exclude.add(/node_modules/)
    .end()
    .set('type', 'asset')
    .parser({
      dataUrlCondition: {
        maxSize: 80 * 1024,
      },
    })
    .set('generator', {
      filename: 'assets/images/[name].[hash:6][ext]',
    })

  if (imageMini) {
    rule
      .use('image-minimizer')
      .loader(ImageMinimizerPlugin.loader)
      .options([
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
                                attributes: [
                                  { xmlns: 'http://www.w3.org/2000/svg' },
                                ],
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

  // 处理svg可以直接导入为React组件
  webpackChain.module
    .rule('svg')
    .test(/\.svg$/)
    .exclude.add(/node_modules/)
    .end()
    .oneOf('svg-img')
    .set('resourceQuery', /url/)
    .set('type', 'asset')
    .parser({
      dataUrlCondition: {
        maxSize: 80 * 1024,
      },
    })
    .set('generator', {
      filename: 'assets/images/[name].[hash:6][ext]',
    })
    .end()
    .oneOf('svg-icon')
    .use('@svgr/webpack')
    .loader(requireResolve('@svgr/webpack'))
    .options({
      icon: true,
      svgAttributes: {
        fill: 'currentColor',
      },
      svgoConfig: {
        plugins: [{ name: 'convertColors', params: { currentColor: true } }],
      },
    })
    .end()
}

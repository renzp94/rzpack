import type WebpackChain from 'webpack-chain'
import { requireResolve } from 'rzpack-utils'

export default (webpackChain: WebpackChain) => {
  // 处理图片
  webpackChain.module
    .rule('images')
    .test(/\.(png|jpg|jpeg|gif|webp)$/i)
    .exclude.add(/node_modules/)
    .end()
    .set('type', 'asset/resource')
    .parser({
      dataUrlCondition: {
        maxSize: 80 * 1024,
      },
    })
    .set('generator', {
      filename: 'assets/images/[name].[hash:6][ext]',
    })

  // 处理svg可以直接导入为React组件
  webpackChain.module
    .rule('svg')
    .test(/\.svg$/)
    .exclude.add(/node_modules/)
    .end()
    .oneOf('svg-img')
    .set('resourceQuery', /url/)
    .set('type', 'asset/resource')
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

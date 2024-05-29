import type WebpackChain from 'webpack-chain'

export default (webpackChain: WebpackChain) => {
  webpackChain.module
    .rule('fonts')
    .test(/\.(woff|woff2|eot|ttf|otf)$/i)
    .exclude.add(/node_modules/)
    .end()
    .set('type', 'asset')
    .set('generator', {
      asset: {
        filename: 'assets/fonts/[name][ext]',
      },
    })
}

import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import type WebpackChain from 'webpack-chain'

export default (webpackChain: WebpackChain) => {
  webpackChain
    .plugin('mini-css-extract-plugin')
    .use(MiniCssExtractPlugin, [
      { filename: 'assets/css/[name][contenthash].css' },
    ])
}

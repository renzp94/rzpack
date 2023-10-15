import CompressionWebpackPlugin from 'compression-webpack-plugin'
import type WebpackChain from 'webpack-chain'

export default (webpackChain: WebpackChain) => {
  webpackChain
    .plugin('compression-webpack-plugin')
    .use(CompressionWebpackPlugin)
}

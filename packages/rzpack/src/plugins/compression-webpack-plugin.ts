import type WebpackChain from 'webpack-chain'
import CompressionWebpackPlugin from 'compression-webpack-plugin'

export default (webpackChain: WebpackChain) => {
  webpackChain.plugin('compression-webpack-plugin').use(CompressionWebpackPlugin)
}

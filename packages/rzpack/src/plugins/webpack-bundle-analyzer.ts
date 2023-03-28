import type WebpackChain from 'webpack-chain'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

export default (webpackChain: WebpackChain) => {
  webpackChain.plugin('webpack-bundle-analyzer').use(BundleAnalyzerPlugin)
}

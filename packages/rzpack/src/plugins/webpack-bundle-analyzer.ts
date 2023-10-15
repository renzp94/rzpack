import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import type WebpackChain from 'webpack-chain'

export default (webpackChain: WebpackChain) => {
  webpackChain.plugin('webpack-bundle-analyzer').use(BundleAnalyzerPlugin)
}

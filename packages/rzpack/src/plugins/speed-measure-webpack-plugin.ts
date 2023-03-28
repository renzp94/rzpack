import type WebpackChain from 'webpack-chain'
import SpeedMeasurePlugin from 'speed-measure-webpack-plugin'

export default (webpackChain: WebpackChain) => {
  webpackChain.plugin('speed-measure-webpack-plugin').use(SpeedMeasurePlugin)
}

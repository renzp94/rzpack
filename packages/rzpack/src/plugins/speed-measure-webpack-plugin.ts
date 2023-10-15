import SpeedMeasurePlugin from 'speed-measure-webpack-plugin'
import type WebpackChain from 'webpack-chain'

export default (webpackChain: WebpackChain) => {
  webpackChain.plugin('speed-measure-webpack-plugin').use(SpeedMeasurePlugin)
}

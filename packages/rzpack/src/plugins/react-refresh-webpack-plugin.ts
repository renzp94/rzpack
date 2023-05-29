import type WebpackChain from 'webpack-chain'
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'

export default (webpackChain: WebpackChain) => {
  webpackChain.plugin('react-refresh-webpack-plugin').use(ReactRefreshWebpackPlugin)
}

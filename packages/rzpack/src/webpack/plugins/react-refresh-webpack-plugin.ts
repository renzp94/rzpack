import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import type WebpackChain from 'webpack-chain'

export default (webpackChain: WebpackChain) => {
  webpackChain
    .plugin('react-refresh-webpack-plugin')
    .use(ReactRefreshWebpackPlugin, [
      {
        overlay: false,
      },
    ])
}

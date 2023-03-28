import type WebpackChain from 'webpack-chain'
import FriendlyErrorsWebpackPlugin from '@soda/friendly-errors-webpack-plugin'

export default (webpackChain: WebpackChain) => {
  webpackChain.stats('errors-only').set('infrastructureLogging', {
    level: 'none',
  })
  webpackChain.plugin('friendly-errors').use(FriendlyErrorsWebpackPlugin, [
    {
      clearConsole: true,
      additionalFormatters: [],
      additionalTransformers: [],
    },
  ])

  return webpackChain
}

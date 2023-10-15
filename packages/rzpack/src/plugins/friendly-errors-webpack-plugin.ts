import FriendlyErrorsWebpackPlugin from '@soda/friendly-errors-webpack-plugin'
import type WebpackChain from 'webpack-chain'

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

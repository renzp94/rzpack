import FriendlyErrorsWebpackPlugin from '@soda/friendly-errors-webpack-plugin'
import type WebpackChain from 'webpack-chain'

class HackerFriendlyErrorsWebpackPlugin extends FriendlyErrorsWebpackPlugin {
  getStatsCompileTime(stats, statsIndex) {
    const { endTime, startTime } = stats.compilation
    if (statsIndex !== undefined) {
      if (
        (this as FriendlyErrorsWebpackPlugin).previousEndTimes[statsIndex] ===
        endTime
      ) {
        return 0
      }
      ;(this as FriendlyErrorsWebpackPlugin).previousEndTimes[statsIndex] =
        endTime
    }

    return endTime - startTime
  }
}

export default (webpackChain: WebpackChain) => {
  webpackChain.stats('errors-only').set('infrastructureLogging', {
    level: 'none',
  })
  webpackChain
    .plugin('friendly-errors')
    .use<typeof FriendlyErrorsWebpackPlugin>(
      HackerFriendlyErrorsWebpackPlugin,
      [
        {
          clearConsole: true,
          additionalFormatters: [],
          additionalTransformers: [],
        },
      ],
    )

  return webpackChain
}

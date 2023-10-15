import CopyWebpackPlugin from 'copy-webpack-plugin'
import { pathResolve } from 'rzpack-utils'
import type WebpackChain from 'webpack-chain'

export default (webpackChain: WebpackChain, staticDir: string) => {
  webpackChain.plugin('copy-webpack-plugin').use(CopyWebpackPlugin, [
    {
      patterns: [
        {
          from: pathResolve(staticDir, process.cwd()),
          to: webpackChain.output.get('path'),
          noErrorOnMissing: true,
        },
      ],
    },
  ])
}

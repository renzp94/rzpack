import { CopyRspackPlugin } from '@rspack/core'
import { pathResolve } from 'rzpack-utils'
import type WebpackChain from 'webpack-chain'
import { DEFAULT_CONFIG } from '../../constant'

export default (
  webpackChain: WebpackChain,
  staticDir: string = DEFAULT_CONFIG.STATIC_DIR,
) => {
  webpackChain.plugin('copy-rspack-plugin').use(CopyRspackPlugin, [
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

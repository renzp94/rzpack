import type { Options } from '@renzp/unplugin-build-info/types'
import BuildInfoWebpackPlugin from '@renzp/unplugin-build-info/webpack'
import type WebpackChain from 'webpack-chain'

export type BuildInfoWebpackPluginOptions = Options

export default (webpackChain: WebpackChain, options: boolean | Options) => {
  webpackChain
    .plugin('unplugin-build-info')
    .use(
      BuildInfoWebpackPlugin(
        typeof options === 'boolean' ? undefined : options,
      ),
    )
}

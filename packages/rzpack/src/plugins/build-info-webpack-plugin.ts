import type { Options } from '@renzp/build-info-webpack-plugin'
import BuildInfoWebpackPlugin from '@renzp/build-info-webpack-plugin'
import type WebpackChain from 'webpack-chain'

export type BuildInfoWebpackPluginOptions = Options

export default (webpackChain: WebpackChain, options: boolean | Options) => {
  webpackChain
    .plugin('build-info-webpack-plugin')
    .use(
      BuildInfoWebpackPlugin,
      typeof options === 'boolean' ? undefined : [options],
    )
}

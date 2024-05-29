import type WebpackChain from 'webpack-chain'
import type { RzpackConfigs } from '..'
import { DEFAULT_CONFIG } from '../constant'
import loadAssetsConfigs from './assets'
import loadBaseConfigs from './configs'
import loadPluginsConfigs from './plugins'

export const loadWebpackConfigs = async (
  webpackChain: WebpackChain,
  configs: RzpackConfigs,
) => {
  const { publicPath = DEFAULT_CONFIG.STATIC_DIR } = configs
  loadBaseConfigs(webpackChain, configs)
  loadAssetsConfigs(webpackChain, { ...configs, publicPath })
  await loadPluginsConfigs(webpackChain, { ...configs, publicPath })
}

export { default as runWebpackBuild } from './build'
export { default as runWebpackPreview } from './preview'
export { default as runWebpackServer } from './server'

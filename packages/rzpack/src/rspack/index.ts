import type WebpackChain from 'webpack-chain'
import type { RzpackConfigs } from '..'
import { DEFAULT_CONFIG } from '../constant'
import loadAssetsConfigs from './assets'
import loadBaseConfigs from './configs'
import loadPluginsConfigs from './plugins'

export const loadRspackConfigs = async (
  chain: WebpackChain,
  configs: RzpackConfigs,
) => {
  const { publicPath = DEFAULT_CONFIG.STATIC_DIR } = configs
  loadBaseConfigs(chain, configs)
  loadAssetsConfigs(chain, { ...configs, publicPath })
  await loadPluginsConfigs(chain, { ...configs, publicPath })
}

export { default as runRspackBuild } from './build'
export { default as runRspackPreview } from './preview'
export { default as runRspackServer } from './server'

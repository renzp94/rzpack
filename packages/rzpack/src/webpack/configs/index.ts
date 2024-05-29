import type WebpackChain from 'webpack-chain'
import type { RzpackConfigs } from '../..'
import loadAliasConfigs from './alias'
import loadEntryConfigs from './entry'
import loadExtensionsConfigs from './extensions'
import loadLazyCompilationConfigs from './lazyCompilation'
import loadMinimizerConfigs from './minimizer'
import loadOutputConfigs from './output'
const loadBaseConfigs = (
  webpackChain: WebpackChain,
  configs: RzpackConfigs,
) => {
  const { entry, output, assets, lazyCompilation } = configs
  loadAliasConfigs(webpackChain)
  loadEntryConfigs(webpackChain, entry)
  loadExtensionsConfigs(webpackChain)
  loadOutputConfigs(webpackChain, output)
  loadLazyCompilationConfigs(webpackChain, lazyCompilation)
  if (process.env.NODE_ENV === 'production') {
    loadMinimizerConfigs(webpackChain, assets?.jsxTools, assets?.imageMini)
  }
}

export default loadBaseConfigs

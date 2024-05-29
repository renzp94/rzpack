import type WebpackChain from 'webpack-chain'
import type { RzpackConfigs } from '../..'
import loadAliasConfigs from '../../common/configs/alias'
import loadEntryConfigs from '../../common/configs/entry'
import loadExtensionsConfigs from '../../common/configs/extensions'
import loadLazyCompilationConfigs from '../../common/configs/lazyCompilation'
import loadOutputConfigs from '../../common/configs/output'
import loadMinimizerConfigs from './minimizer'

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

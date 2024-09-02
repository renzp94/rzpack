import { fileExists, getFileFullPath } from 'rzpack-utils'
import type WebpackChain from 'webpack-chain'
import type { RzpackConfigs } from '../..'
import { rzpack } from '../../cli'
import compressionWebpackPlugin from '../../common/plugins/compression-webpack-plugin'
import eslintWebpackPlugin from '../../common/plugins/eslint-webpack-plugin'
import forkTsCheckerWebpackPlugin from '../../common/plugins/fork-ts-checker-webpack-plugin'
import friendlyErrorsWebpackPlugin from '../../common/plugins/friendly-errors-webpack-plugin'
import htmlWebpackPlugin from '../../common/plugins/html-webpack-plugin'
import millionWebpackPlugin from '../../common/plugins/million-webpack-plugin'
import unpluginBuildInfo from '../../common/plugins/unplugin-build-info'
import webpackBundleAnalyzer from '../../common/plugins/webpack-bundle-analyzer'
import copyRspackPlugin from './copy-rspack-plugin'
import definePlugin from './define-plugin'
import HMRPlugin from './hmr-plugin'
import moduleFederationPlugin from './module-federation-plugin'
import progressPlugin from './progress-plugin'
import rsdoctorPlugin from './rsdoctor-rspack-plugin'

export default async (chain: WebpackChain, options: RzpackConfigs) => {
  const isProduction = process.env.NODE_ENV === 'production'
  htmlWebpackPlugin(chain, options?.html)
  friendlyErrorsWebpackPlugin(chain)
  progressPlugin(chain)
  definePlugin(chain)
  const isEslint =
    fileExists(getFileFullPath('.eslintrc')) ||
    fileExists(getFileFullPath('.eslintrc.js')) ||
    fileExists(getFileFullPath('.eslintrc.ts')) ||
    fileExists(getFileFullPath('.eslintrc.json'))

  if (isEslint) {
    eslintWebpackPlugin(chain)
  }
  const isForkTs = fileExists(getFileFullPath('tsconfig.json'))
  if (isForkTs) {
    forkTsCheckerWebpackPlugin(chain)
  }
  // // if (options?.dll?.length > 0) {
  // //   await useDll(options.dll)
  // //   dllPlugin(webpackChain)
  // // }
  if (options?.buildInfo) {
    unpluginBuildInfo(chain, options?.buildInfo)
  }

  if (options?.moduleFederation) {
    moduleFederationPlugin(chain, options?.moduleFederation)
  }

  if (isProduction) {
    if (options?.gzip) {
      compressionWebpackPlugin(chain)
    }
    if (options?.million) {
      millionWebpackPlugin(
        chain,
        typeof options?.million === 'boolean' ? undefined : options?.million,
      )
    }
    copyRspackPlugin(chain, options.publicPath)
    if (rzpack.bundleSize) {
      webpackBundleAnalyzer(chain)
    }
    if (rzpack.doctor) {
      rsdoctorPlugin(chain)
    }
  } else {
    HMRPlugin(chain)
  }
}

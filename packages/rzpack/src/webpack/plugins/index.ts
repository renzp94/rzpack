import { fileExists, getFileFullPath } from 'rzpack-utils'
import type WebpackChain from 'webpack-chain'
import type { RzpackConfigs } from '../..'
import { rzpack } from '../../cli'
import compressionWebpackPlugin from '../../common/plugins/compression-webpack-plugin'
import eslintWebpackPlugin from '../../common/plugins/eslint-webpack-plugin'
import forkTsCheckerWebpackPlugin from '../../common/plugins/fork-ts-checker-webpack-plugin'
import friendlyErrorsWebpackPlugin from '../../common/plugins/friendly-errors-webpack-plugin'
import millionWebpackPlugin from '../../common/plugins/million-webpack-plugin'
import unpluginBuildInfo from '../../common/plugins/unplugin-build-info'
// import dllPlugin, { useDll } from './dll-plugin'
import webpackBundleAnalyzer from '../../common/plugins/webpack-bundle-analyzer'
import copyWebpackPlugin from './copy-webpack-plugin'
import definePlugin from './define-plugin'
import htmlWebpackPlugin from './html-webpack-plugin'
import miniCssExtractPlugin from './mini-css-extract-plugin'
import moduleFederationWebpackPlugin from './module-federation-plugin'
import reactRefreshWebpackPlugin from './react-refresh-webpack-plugin'
import rsdoctorWebpackPlugin from './rsdoctor-webpack-plugin'
import speedMeasureWebpackPlugin from './speed-measure-webpack-plugin'
import webpackbar from './webpackbar'

export default async (webpackChain: WebpackChain, options: RzpackConfigs) => {
  const isProduction = process.env.NODE_ENV === 'production'
  htmlWebpackPlugin(webpackChain, options?.html)
  friendlyErrorsWebpackPlugin(webpackChain)
  webpackbar(webpackChain)
  definePlugin(webpackChain)

  const isEslint =
    fileExists(getFileFullPath('.eslintrc')) ||
    fileExists(getFileFullPath('.eslintrc.js')) ||
    fileExists(getFileFullPath('.eslintrc.ts')) ||
    fileExists(getFileFullPath('.eslintrc.json'))

  if (isEslint) {
    eslintWebpackPlugin(webpackChain)
  }

  const isForkTs = fileExists(getFileFullPath('tsconfig.json'))
  if (isForkTs) {
    forkTsCheckerWebpackPlugin(webpackChain)
  }

  // if (options?.dll?.length > 0) {
  //   await useDll(options.dll)
  //   dllPlugin(webpackChain)
  // }
  if (options?.buildInfo) {
    unpluginBuildInfo(webpackChain, options?.buildInfo)
  }

  if (options?.moduleFederation) {
    moduleFederationWebpackPlugin(webpackChain, options?.moduleFederation)
  }

  if (isProduction) {
    if (options?.million) {
      millionWebpackPlugin(
        webpackChain,
        typeof options?.million === 'boolean' ? undefined : options?.million,
      )
    }
    if (options?.gzip) {
      compressionWebpackPlugin(webpackChain)
    }
    copyWebpackPlugin(webpackChain, options.publicPath)
    miniCssExtractPlugin(webpackChain)
    if (rzpack.bundleSize) {
      webpackBundleAnalyzer(webpackChain)
    }
    if (rzpack.bundleTime) {
      speedMeasureWebpackPlugin(webpackChain)
    }
    if (rzpack.doctor) {
      rsdoctorWebpackPlugin(webpackChain)
    }
  } else {
    const refresh = options?.reactRefresh ?? true
    if (refresh) {
      reactRefreshWebpackPlugin(webpackChain)
    }
  }
}

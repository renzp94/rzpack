import { fileExists, getFileFullPath } from 'rzpack-utils'
import type WebpackChain from 'webpack-chain'
import type { RzpackConfigs } from '..'
import { rzpack } from './../cli'
import buildInfoWebpackPlugin from './build-info-webpack-plugin'
import compressionWebpackPlugin from './compression-webpack-plugin'
import copyWebpackPlugin from './copy-webpack-plugin'
import definePlugin from './define-plugin'
import eslintWebpackPlugin from './eslint-webpack-plugin'
import forkTsCheckerWebpackPlugin from './fork-ts-checker-webpack-plugin'
import friendlyErrorsWebpackPlugin from './friendly-errors-webpack-plugin'
import htmlWebpackPlugin from './html-webpack-plugin'
import millionWebpackPlugin from './million-webpack-plugin'
import miniCssExtractPlugin from './mini-css-extract-plugin'
import moduleFederationWebpackPlugin from './module-federation-plugin'
import reactRefreshWebpackPlugin from './react-refresh-webpack-plugin'
import speedMeasureWebpackPlugin from './speed-measure-webpack-plugin'
// import dllPlugin, { useDll } from './dll-plugin'
import webpackBundleAnalyzer from './webpack-bundle-analyzer'
import webpackbar from './webpackbar'

export default async (webpackChain: WebpackChain, options: RzpackConfigs) => {
  htmlWebpackPlugin(webpackChain, options?.html)
  webpackbar(webpackChain)
  friendlyErrorsWebpackPlugin(webpackChain)
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
    buildInfoWebpackPlugin(webpackChain, options?.buildInfo)
  }

  if (options?.gzip) {
    compressionWebpackPlugin(webpackChain)
  }
  if (options?.moduleFederation) {
    moduleFederationWebpackPlugin(webpackChain, options?.moduleFederation)
  }
  if (options?.million) {
    millionWebpackPlugin(
      webpackChain,
      typeof options?.million === 'boolean' ? undefined : options?.million,
    )
  }

  if (rzpack.mode === 'production') {
    copyWebpackPlugin(webpackChain, options.publicPath)
    miniCssExtractPlugin(webpackChain)
    if (rzpack.bundleSize) {
      webpackBundleAnalyzer(webpackChain)
    }
    if (rzpack.bundleTime) {
      speedMeasureWebpackPlugin(webpackChain)
    }
  }

  const refresh = options?.reactRefresh ?? true
  if (rzpack.mode === 'development' && refresh) {
    reactRefreshWebpackPlugin(webpackChain)
  }
}

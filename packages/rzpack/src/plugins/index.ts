import type { RzpackConfigs } from '..'
import type WebpackChain from 'webpack-chain'
import { fileExists, getFileFullPath } from 'rzpack-utils'
import { rzpack } from './../cli'
import htmlWebpackPlugin from './html-webpack-plugin'
import webpackbar from './webpackbar'
import friendlyErrorsWebpackPlugin from './friendly-errors-webpack-plugin'
import miniCssExtractPlugin from './mini-css-extract-plugin'
import copyWebpackPlugin from './copy-webpack-plugin'
import definePlugin from './define-plugin'
import eslintWebpackPlugin from './eslint-webpack-plugin'
import forkTsCheckerWebpackPlugin from './fork-ts-checker-webpack-plugin'
// import dllPlugin, { useDll } from './dll-plugin'
import webpackBundleAnalyzer from './webpack-bundle-analyzer'
import speedMeasureWebpackPlugin from './speed-measure-webpack-plugin'
import buildInfoWebpackPlugin from './build-info-webpack-plugin'
import compressionWebpackPlugin from './compression-webpack-plugin'

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
}

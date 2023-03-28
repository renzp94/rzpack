import type WebpackChain from 'webpack-chain'
import { fileExists, getFileFullPath } from 'rzpack-utils'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { DEFAULT_CONFIG } from '../constant'

export default (webpackChain: WebpackChain, options: HtmlWebpackPlugin.Options = {}) => {
  const {
    title = 'rzpack demo',
    template = DEFAULT_CONFIG.HTML,
    favicon = DEFAULT_CONFIG.FAVICON,
  } = options

  let hasFavicon = true
  if (typeof favicon === 'string') {
    const faviconFullPath = getFileFullPath(favicon)
    hasFavicon = fileExists(faviconFullPath)
  }

  webpackChain.plugin('html-webpack-plugin').use(HtmlWebpackPlugin, [
    {
      title,
      template,
      favicon: hasFavicon ? favicon : false,
      ...options,
    },
  ])
  return webpackChain
}

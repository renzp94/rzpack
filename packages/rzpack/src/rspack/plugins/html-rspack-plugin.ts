import { HtmlRspackPlugin, type HtmlRspackPluginOptions } from '@rspack/core'
import { fileExists, getFileFullPath } from 'rzpack-utils'
import type WebpackChain from 'webpack-chain'
import { DEFAULT_CONFIG } from '../../constant'

export default (
  webpackChain: WebpackChain,
  options: HtmlRspackPluginOptions = {},
) => {
  const {
    title = 'rzpack demo',
    template = DEFAULT_CONFIG.HTML,
    favicon = DEFAULT_CONFIG.FAVICON,
  } = options

  let hasFavicon = true
  if (typeof favicon === 'string') {
    const faviconFullPath = getFileFullPath(favicon)
    hasFavicon = !!faviconFullPath && fileExists(faviconFullPath)
  }

  webpackChain.plugin('html-webpack-plugin').use(HtmlRspackPlugin, [
    {
      title,
      template,
      favicon: hasFavicon ? favicon : undefined,
      ...options,
    },
  ])
  return webpackChain
}

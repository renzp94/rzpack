import { MFLiveReloadPlugin } from '@module-federation/fmr'
import rspack, { type ModuleFederationPluginOptions } from '@rspack/core'
import type WebpackChain from 'webpack-chain'
import {
  type ModuleFederationPluginOptions as Options,
  getSharedConfigs,
} from '../../webpack/plugins/module-federation-plugin'

const ModuleFederationPlugin = rspack.container.ModuleFederationPlugin

export default (webpackChain: WebpackChain, options: Options) => {
  const {
    filename = 'remote.js',
    shared,
    exposes,
    ...restOptions
  } = options ?? {}
  const providerDefaultOption = exposes ? { runtime: false } : {}
  let sharedConfigs: Record<string, any>
  if (shared) {
    if (Array.isArray(shared)) {
      sharedConfigs = shared.reduce((prev, item) => {
        return {
          ...prev,
          [item.name]: {
            requiredVersion: item.requiredVersion,
            singleton: true,
          },
        }
      }, {} as any)
    } else {
      sharedConfigs = getSharedConfigs(shared)
    }
  }

  webpackChain.plugin('module-federation-plugin').use(ModuleFederationPlugin, [
    {
      filename,
      shared: sharedConfigs,
      exposes,
      ...providerDefaultOption,
      ...restOptions,
    } as ModuleFederationPluginOptions,
  ])

  if (!!exposes && process.env.Node === 'development') {
    // 模块联邦热更新
    webpackChain.plugin('MFLiveReloadPlugin').use(MFLiveReloadPlugin, [
      {
        port: webpackChain.get('port'),
        container: options.name,
        standalone: false,
      },
    ])
  }
}

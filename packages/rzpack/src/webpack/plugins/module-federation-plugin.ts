import { MFLiveReloadPlugin } from '@module-federation/fmr'
import type { Exposes, Remotes } from '@rspack/core'
import { fileExists, getFileFullPath } from 'rzpack-utils'
import type WebpackChain from 'webpack-chain'
import ModuleFederationPlugin from 'webpack/lib/container/ModuleFederationPlugin'

export interface ModuleFederationPluginModule {
  name: string
  filename: string
}

export interface ModuleFederationPluginApp
  extends ModuleFederationPluginModule {
  name: string
  remotes: Record<string, string>
}

export interface ModuleFederationShared {
  name: string
  requiredVersion: string
}

export interface ModuleFederationSharedAuto {
  deps: string[]
  depsPackagePath: string
}

export interface ModuleFederationPluginOptions {
  // 模块名称
  name: string
  // 模块导出名称
  filename?: string
  // 要共享的依赖
  shared?: ModuleFederationShared[] | ModuleFederationSharedAuto
  // 模块暴露的内容
  exposes?: Exposes
  // 模块引入的内容
  remotes?: Remotes
}
/**
 * 获取共享依赖配置
 * @param shared 共享依赖
 * @returns 返回处理后的共享依赖配置
 */
export const getSharedConfigs = (shared: ModuleFederationSharedAuto) => {
  let sharedRecord: Record<string, { requiredVersion: string; singleton: true }>
  const pkgFilePath = getFileFullPath(shared?.depsPackagePath ?? 'package.json')

  if (fileExists(pkgFilePath)) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const pkg = require(pkgFilePath)
    const deps = pkg.dependencies
    const devDeps = pkg.devDependencies

    if (deps) {
      sharedRecord = shared?.deps?.reduce((prev, name) => {
        return {
          ...prev,
          [name]: {
            requiredVersion: deps[name] ?? devDeps[name],
            singleton: true,
          },
        }
      }, {})
    }
  }

  return sharedRecord
}

export default (
  webpackChain: WebpackChain,
  options: ModuleFederationPluginOptions,
) => {
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
      }, {})
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
    },
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

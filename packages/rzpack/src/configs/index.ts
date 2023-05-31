import type { RzpackConfigs, RzpackWebpackChain } from '..'
import type { Configuration } from 'webpack'
import WebpackChain from 'webpack-chain'
import {
  logError,
  getFileFullPath,
  requireFile,
  loadEnv,
  fileExists,
  getNetwork,
} from 'rzpack-utils'
import { DEFAULT_CONFIG } from '../constant'
import resolveEntry from './entry'
import resolveOutput from './output'
import resolveMinimizer from './minimizer'
import resolveAlias from './alias'
import resolveExtensions from './extensions'
import resolveAssets from '../assets'
import resolvePlugins from '../plugins'
import resolveLazyCompilation from './lazyCompilation'
import { bundleTsFile } from 'rzpack-utils'

export interface RzpackContextConfigs extends Configuration {
  network?: string
  local?: string
  port?: number
}

export class RzpackContext {
  public readonly webpackChain: WebpackChain
  public mode: 'development' | 'production'
  public cache: boolean
  public bundleSize: boolean
  public bundleTime: boolean
  constructor() {
    this.webpackChain = new WebpackChain()
    this.bundleSize = false
    this.bundleTime = false
  }
  set(key: string, value: any) {
    this.webpackChain.set(key, value)
  }
  get(key: string) {
    return this.webpackChain.get(key)
  }
  loadConfigFile(configFilePath?: string) {
    let configFile
    let configFileName
    if (configFilePath) {
      configFile = getFileFullPath(configFilePath)
      configFileName = configFilePath.replace(/.(t|j)s$/, '')
    }

    if (!configFile) {
      configFileName = DEFAULT_CONFIG.CONFIG_FILE.replace(/.(t|j)s$/, '')
      const suffix = ['.ts', '.js']
      const configFiles = suffix.map((key) => getFileFullPath(`${configFileName}${key}`))
      configFile = configFiles.find(fileExists)
    }

    if (!configFile) {
      throw `需要一个配置文件: ${configFile}`
    }
    let configs: RzpackConfigs = {}
    try {
      configs = requireFile(configFile)
    } catch {
      const tmpFilePath = getFileFullPath(`./node_modules/rzpack.config.tmp.js`)
      configs = bundleTsFile(configFile, tmpFilePath)
    }

    loadEnv(this.mode)
    loadEnv()

    return configs
  }
  async configs(configs: RzpackConfigs) {
    if (typeof configs === 'object') {
      const {
        entry,
        output,
        assets,
        cache = true,
        publicPath = DEFAULT_CONFIG.STATIC_DIR,
        webpackChain: resolveWebpackChain,
        server,
        lazyCompilation,
      } = configs
      this.cache = cache
      resolveEntry(this.webpackChain, entry)
      resolveOutput(this.webpackChain, output)
      resolveAlias(this.webpackChain)
      resolveExtensions(this.webpackChain)
      resolveAssets(this.webpackChain, configs)
      resolveLazyCompilation(this.webpackChain, lazyCompilation)
      await resolvePlugins(this.webpackChain, { ...configs, publicPath })
      if (this.mode === 'production') {
        resolveMinimizer(this.webpackChain, assets?.jsxTools)
      }

      const { network, local, port } = await getNetwork(server?.port as unknown as number)
      if (this.mode === 'development') {
        this.set('network', network)
        this.set('local', local)
        this.set('port', port)
      }

      if (server) {
        this.webpackChain.merge({ devServer: { ...server, port } })
      }
      resolveWebpackChain?.(this.webpackChain)
      // 如果是一个函数则默认为webpackChain配置
    } else if (typeof configs === 'function') {
      const resolveWebpackChain = configs as RzpackWebpackChain
      resolveWebpackChain(this.webpackChain)
    } else {
      console.log(logError('配置文件配置有误，请导出一个函数或对象'))
    }
    this.webpackChain.mode(this.mode)
  }
  toConfig() {
    return this.webpackChain.toConfig() as RzpackContextConfigs
  }
}

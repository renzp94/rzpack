import {
  fileExists,
  getFileFullPath,
  getNetwork,
  loadEnv,
  logError,
  requireFile,
} from 'rzpack-utils'
import { bundleTsFile } from 'rzpack-utils'
import type { Configuration } from 'webpack'
import WebpackChain from 'webpack-chain'
import type { RzpackConfigs, RzpackWebpackChain, Yagt } from '.'
import { DEFAULT_CONFIG } from './constant'
import { loadWebpackConfigs } from './webpack'

export interface RzpackContextConfigs extends Configuration {
  network?: string
  local?: string
  port?: number
}

/**
 * 获取编译的临时文件地址
 * @param filename 临时文件名
 * @returns 返回临时文件全路径
 */
export const getBuildTmpFilePath = (filename: string) => {
  const splitSeparator = __dirname.includes('/') ? '/' : '\\'
  const rootDir = __dirname.split('node_modules').shift()
  const rootFullDir = `${getFileFullPath('.')}`
  let filepath = `.${splitSeparator}node_modules${splitSeparator}${filename}.tmp.js`
  // 如果当前执行路径没有node_modules，则说明是当前仓库使用的
  //  当前执行根路径不等于项目根路径，则说明是多仓库
  if (
    __dirname.includes('node_modules') &&
    rootDir &&
    rootDir !== `${rootFullDir}${splitSeparator}`
  ) {
    const moduleName = rootFullDir.split(splitSeparator).pop()

    filepath = `${rootDir}node_modules${splitSeparator}${filename}.${moduleName}.tmp.js`
  }

  return getFileFullPath(filepath)
}

export class RzpackContext {
  public readonly webpackChain: WebpackChain
  public cache: boolean
  public bundleSize: boolean
  public bundleTime: boolean
  public yagt: Yagt
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
  loadConfigFile(configFilePath?: string): RzpackConfigs {
    let configFile: string
    let configFileName: string
    loadEnv(process.env.NODE_ENV)
    loadEnv()

    if (configFilePath) {
      configFile = getFileFullPath(configFilePath)
      configFileName = configFilePath.replace(/.(t|j)s$/, '')
    }

    if (!configFile) {
      configFileName = DEFAULT_CONFIG.CONFIG_FILE.replace(/.(t|j)s$/, '')
      const suffix = ['.ts', '.js']
      const configFiles = suffix.map((key) =>
        getFileFullPath(`${configFileName}${key}`),
      )
      configFile = configFiles.find(fileExists)
    }

    if (!configFile) {
      throw `需要一个配置文件: ${configFile}`
    }
    let configs: RzpackConfigs = {}
    try {
      configs = requireFile(configFile)
    } catch {
      const tmpFilePath = getBuildTmpFilePath('rzpack.config')
      configs = bundleTsFile(configFile, tmpFilePath)
    }

    return configs
  }
  async configs(configs: RzpackConfigs) {
    if (typeof configs === 'object') {
      const {
        cache = true,
        webpackChain: resolveWebpackChain,
        server,
        yagt,
      } = configs
      this.cache = cache
      this.yagt = yagt
      await loadWebpackConfigs(this.webpackChain, configs)
      const { network, local, port } = await getNetwork(
        server?.port as unknown as number,
      )
      if (process.env.NODE_ENV === 'development') {
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
    this.webpackChain.mode(process.env.NODE_ENV as 'development' | 'production')
  }
  toConfig() {
    return this.webpackChain.toConfig() as unknown as RzpackContextConfigs
  }
}

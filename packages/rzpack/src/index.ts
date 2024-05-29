import type { HtmlRspackPluginOptions } from '@rspack/core'
import type HtmlWebpackPlugin from 'html-webpack-plugin'
import type WebpackChain from 'webpack-chain'
import type { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server'
import type { LazyCompilationOptions } from './common/configs/lazyCompilation'
import type { Output } from './common/configs/output'
import type { MillionOptions } from './common/plugins/million-webpack-plugin'
import type { BuildInfoWebpackPluginOptions } from './common/plugins/unplugin-build-info'
import type { RzpackAssets } from './webpack/assets'
import type { ModuleFederationPluginOptions } from './webpack/plugins/module-federation-plugin'

interface CLIOptions {
  '--'?: string[]
  c?: string
  config?: string
  m?: 'development' | 'production'
  mode?: 'development' | 'production'
}

export interface ServerOptions extends CLIOptions {
  host?: string
  port?: number
  open?: boolean
  ui?: boolean
}

export interface BuildOptions extends CLIOptions {
  outDir?: string
  bundleSize?: boolean
  bundleTime?: boolean
  doctor?: boolean
}

export interface PreviewOptions
  extends Omit<BuildOptions, 'bundleSize' | 'bundleTime'> {
  outDir?: string
}

export interface LessVars {
  // 全局变量(直接定义的变量优先级高于变量文件)
  vars?: Record<string, string>
  // 全局变量文件
  file?: string
}

export interface Yagt {
  // yapi地址
  url: string
  // 项目token
  token: string
}

export interface RzpackConfigs {
  // 打包器
  builder?: BUILDER
  // antd主题变量设置
  antdTheme?: LessVars
  // less全局变量设置
  lessVars?: LessVars
  // 资源文件处理
  assets?: RzpackAssets
  // 是否在控制台打印编译信息
  buildInfo?: boolean | BuildInfoWebpackPluginOptions
  // 是否使用持久化缓存(目前只支持webpack)
  cache?: boolean
  // dll?: Array<string>
  entry?: string | string[] | Record<string, string>
  // 是否启用gzip
  gzip?: boolean
  // htmlPlugin插件设置
  html?: HtmlWebpackPlugin.Options | HtmlRspackPluginOptions
  // 输出目录
  output?: Output
  // 静态资源目录
  publicPath?: string
  // 代理配置，当开启可视化配置时此处配置的接口代理无效
  server?: WebpackDevServerConfiguration
  // 实验性功能
  lazyCompilation?: LazyCompilationOptions
  // 模块联邦
  moduleFederation?: ModuleFederationPluginOptions
  // 使用RspackChain重写配置
  rzpackChain?: RzpackChain
  // 可视化配置的代理，仅在开启可视化配置时才生效
  proxyFile?: string
  // 是否开启React代码热更新
  reactRefresh?: boolean
  // 是否使用Million.js
  million?: boolean | MillionOptions
  // 类型生成配置
  yagt?: Yagt
}

export type RzpackChain = (w: WebpackChain) => WebpackChain

export const defineConfig = (configs: RzpackConfigs) => configs

export enum JSX_TOOLS {
  ESBUILD = 'esbuild',
  SWC = 'swc',
}

export enum BUILDER {
  WEBPACK = 'webpack',
  RSPACK = 'rspack',
}

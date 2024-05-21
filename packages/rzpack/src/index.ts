import type HtmlWebpackPlugin from 'html-webpack-plugin'
import type WebpackChain from 'webpack-chain'
import type { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server'
import type { RzpackAssets } from './assets'
import type { LazyCompilationOptions } from './configs/lazyCompilation'
import type { Output } from './configs/output'
import type { MillionOptions } from './plugins/million-webpack-plugin'
import type { ModuleFederationPluginOptions } from './plugins/module-federation-plugin'
import type { BuildInfoWebpackPluginOptions } from './plugins/unplugin-build-info'

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
}

export interface PreviewOptions
  extends Omit<BuildOptions, 'bundleSize' | 'bundleTime'> {
  outDir?: string
}

// eslint-disable-next-line no-unused-vars
export type RzpackWebpackChain = (w: WebpackChain) => WebpackChain

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
  // antd主题变量设置
  antdTheme?: LessVars
  // less全局变量设置
  lessVars?: LessVars
  // 资源文件处理
  assets?: RzpackAssets
  // 是否在控制台打印编译信息
  buildInfo?: boolean | BuildInfoWebpackPluginOptions
  // 是否使用webpack5缓存
  cache?: boolean
  // dll?: Array<string>
  entry?: string | string[] | Record<string, string>
  // 是否启用gzip
  gzip?: boolean
  // htmlPlugin插件设置
  html?: HtmlWebpackPlugin.Options
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
  // 使用webpackChain重写webpack配置
  webpackChain?: RzpackWebpackChain
  // 可视化配置的代理，仅在开启可视化配置时才生效
  proxyFile?: string
  // 是否开启React代码热更新
  reactRefresh?: boolean
  // 是否使用Million.js
  million?: boolean | MillionOptions
  // 类型生成配置
  yagt?: Yagt
}

export const defineConfig = (configs: RzpackConfigs) => configs

export enum JSX_TOOLS {
  ESBUILD = 'esbuild',
  SWC = 'swc',
}

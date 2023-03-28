import type { RzpackConfigs } from './../index'
import type WebpackChain from 'webpack-chain'
import type { JSX_TOOLS } from './jsx'
import jsx from './jsx'
import font from './font'
import image from './image'
import css from './css'

export interface RzpackAssets {
  // jsx编译处理器
  jsxTools?: JSX_TOOLS
  // 是否使用cssScoped(类似Vue的scoped功能)
  cssScoped?: boolean
}

const resolveAssets = (webpackChain: WebpackChain, options: RzpackConfigs) => {
  jsx(webpackChain, options?.assets)
  font(webpackChain)
  image(webpackChain)
  css(webpackChain, options)
}

export default resolveAssets

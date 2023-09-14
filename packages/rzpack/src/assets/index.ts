import type { RzpackConfigs } from './../index'
import type WebpackChain from 'webpack-chain'
import type { JSX_TOOLS } from '../'
import jsx from './jsx'
import font from './font'
import image from './image'
import css from './css'
import { FilterFn } from 'image-minimizer-webpack-plugin'

export interface RzpackAssets {
  // jsx编译处理器
  jsxTools?: JSX_TOOLS
  // 是否使用cssScoped(类似Vue的scoped功能)
  cssScoped?: boolean
  // 是否压缩图片
  imageMini?: boolean | FilterFn
}

const resolveAssets = (webpackChain: WebpackChain, options: RzpackConfigs) => {
  jsx(webpackChain, options?.assets)
  font(webpackChain)
  image(webpackChain)
  css(webpackChain, options)
}

export default resolveAssets

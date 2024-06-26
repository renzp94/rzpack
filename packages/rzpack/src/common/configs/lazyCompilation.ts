import type { Module } from 'webpack'
import type WebpackChain from 'webpack-chain'

export interface LazyCompilationOptions {
  backend?: any
  entries?: boolean
  imports?: boolean
  test?: string | RegExp | ((module: Module) => boolean)
}

// 懒编译
export default (
  webpackChain: WebpackChain,
  lazyCompilation: boolean | LazyCompilationOptions,
) => {
  webpackChain.set('experiments', { lazyCompilation })
}

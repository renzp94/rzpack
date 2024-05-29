import { pathResolve } from 'rzpack-utils'
import type WebpackChain from 'webpack-chain'

export default (webpackChain: WebpackChain) => {
  webpackChain.resolve.alias.set('@', pathResolve('src', process.cwd()))
}

import { pathResolve } from 'rzpack-utils'
import type WebpackChain from 'webpack-chain'

const resolveAlias = (webpackChain: WebpackChain) => {
  webpackChain.resolve.alias.set('@', pathResolve('src', process.cwd()))
}

export default resolveAlias

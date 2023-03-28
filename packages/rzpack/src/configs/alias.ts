import type WebpackChain from 'webpack-chain'
import { pathResolve } from 'rzpack-utils'

const resolveAlias = (webpackChain: WebpackChain) => {
  webpackChain.resolve.alias.set('@', pathResolve('src', process.cwd()))
}

export default resolveAlias

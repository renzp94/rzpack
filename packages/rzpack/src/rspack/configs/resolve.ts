import { getFileFullPath } from 'rzpack-utils'
import type WebpackChain from 'webpack-chain'

export default (webpackChain: WebpackChain) => {
  const tsconfig = getFileFullPath('./tsconfig.json')
  webpackChain.resolve.set('tsConfig', tsconfig)
}

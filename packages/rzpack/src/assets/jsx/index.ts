import { RzpackAssets } from './../index'
import type WebpackChain from 'webpack-chain'
import esbuild from './esbuild'
import swc from './swc'
import { requireResolve } from 'rzpack-utils'
import { JSX_TOOLS } from '../..'

const jsx = (webpackChain: WebpackChain, assets: RzpackAssets) => {
  const { jsxTools = JSX_TOOLS.ESBUILD, cssScoped } = assets ?? {}
  const transformTools = {
    [JSX_TOOLS.ESBUILD]: esbuild,
    [JSX_TOOLS.SWC]: swc,
  }

  const rule = transformTools[jsxTools](webpackChain)
  if (cssScoped) {
    rule.use('jsx-scoped-loader').loader(requireResolve('@renzp/jsx-scoped-loader')).end()
  }
}

export default jsx

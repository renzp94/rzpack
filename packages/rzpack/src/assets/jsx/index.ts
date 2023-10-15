import { requireResolve } from 'rzpack-utils'
import type WebpackChain from 'webpack-chain'
import { JSX_TOOLS } from '../..'
import { RzpackAssets } from './../index'
import esbuild from './esbuild'
import swc from './swc'

const jsx = (webpackChain: WebpackChain, assets: RzpackAssets) => {
  const { jsxTools = JSX_TOOLS.ESBUILD, cssScoped } = assets ?? {}
  const transformTools = {
    [JSX_TOOLS.ESBUILD]: esbuild,
    [JSX_TOOLS.SWC]: swc,
  }

  const rule = transformTools[jsxTools](webpackChain)
  if (cssScoped) {
    rule
      .use('jsx-scoped-loader')
      .loader(requireResolve('@renzp/jsx-scoped-loader'))
      .end()
  }
}

export default jsx

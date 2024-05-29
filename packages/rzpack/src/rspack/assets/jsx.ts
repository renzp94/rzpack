import { requireResolve } from 'rzpack-utils'
import type WebpackChain from 'webpack-chain'

export default (
  chain: WebpackChain,
  reactRefresh?: boolean,
  cssScoped?: boolean,
) => {
  const isProduction = process.env.NODE_ENV === 'production'

  const rule = chain.module
    .rule('swc')
    .test(/\.[tj]sx?$/)
    .exclude.add(/node_modules/)
    .end()
    .type('javascript/auto')
    .use('swc')
    .loader('builtin:swc-loader')
    .options({
      jsc: {
        parser: {
          syntax: 'typescript',
          dynamicImport: true,
          tsx: true,
          decorators: true,
        },
        target: 'es2015',
        externalHelpers: false,
        transform: {
          react: {
            runtime: 'automatic',
            development: !isProduction,
            refresh: reactRefresh && !isProduction,
            useBuiltins: true,
          },
        },
      },
      minify: isProduction,
    })
    .end()

  if (cssScoped) {
    rule
      .use('jsx-scoped-loader')
      .loader(requireResolve('@renzp/jsx-scoped-loader'))
      .end()
  }
}

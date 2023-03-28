import type WebpackChain from 'webpack-chain'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import { requireResolve } from 'rzpack-utils'
import path from 'path'

export default (webpackChain: WebpackChain) => {
  webpackChain.plugin('fork-ts-checker-webpack-plugin').use(ForkTsCheckerWebpackPlugin, [
    {
      typescript: {
        diagnosticOptions: {
          semantic: true,
          syntactic: true,
        },
        mode: 'write-references',
        typescriptPath: path.dirname(
          requireResolve('typescript/package.json', { paths: [process.cwd()] }) ||
            requireResolve('typescript/package.json', { paths: [__dirname] })
        ),
      },
    },
  ])
}

import type WebpackChain from 'webpack-chain'
import path from 'path'
import EslintWebpackPlugin from 'eslint-webpack-plugin'
import { getFileFullPath, requireResolve } from 'rzpack-utils'

export default (webpackChain: WebpackChain) => {
  const cwd = process.cwd()
  webpackChain.plugin('eslint').use(EslintWebpackPlugin, [
    {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      files: './src/**/*.{js,jsx,ts,tsx}',
      context: cwd,
      eslintPath: path.dirname(
        requireResolve('eslint/package.json', { paths: [cwd] }) ||
          requireResolve('eslint/package.json', { paths: [__dirname] })
      ),
      cache: true,
      cacheLocation: getFileFullPath('node_modules/.cache/.eslint-cache'),
    },
  ])
}

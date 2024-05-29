import { RsdoctorWebpackPlugin } from '@rsdoctor/webpack-plugin'
import type WebpackChain from 'webpack-chain'

export default (chain: WebpackChain) => {
  chain.plugin('rsdoctor-webpack-plugin').use(RsdoctorWebpackPlugin)
}

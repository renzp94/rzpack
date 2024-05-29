import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin'
import type WebpackChain from 'webpack-chain'

export default (chain: WebpackChain) => {
  chain.plugin('rsdoctor-rspack-plugin').use(RsdoctorRspackPlugin)
}

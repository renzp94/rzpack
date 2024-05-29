import { ProgressPlugin } from '@rspack/core'
import type WebpackChain from 'webpack-chain'
import { NAME, VERSION } from '../../constant'

export default (chain: WebpackChain) => {
  chain
    .plugin('progress-plugin')
    .use(ProgressPlugin, [{ prefix: `${NAME} V${VERSION}` }])
}

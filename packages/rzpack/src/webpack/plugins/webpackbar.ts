import type WebpackChain from 'webpack-chain'
import Webpackbar from 'webpackbar'
import { NAME, VERSION } from '../../constant'

export default (webpackChain: WebpackChain) => {
  webpackChain
    .plugin('webpackbar')
    .use(Webpackbar, [{ name: `${NAME} V${VERSION}`, color: 'blue' }])
}

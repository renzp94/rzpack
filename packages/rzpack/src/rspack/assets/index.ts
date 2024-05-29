import type WebpackChain from 'webpack-chain'
import type { RzpackConfigs } from '../..'
import css from './css'
import font from './font'
import image from './image'
import jsx from './jsx'

export default (chain: WebpackChain, options: RzpackConfigs) => {
  css(chain, options)
  font(chain)
  jsx(chain, options?.reactRefresh, options?.assets?.cssScoped)
  image(chain, options?.assets?.imageMini)
}

import type WebpackChain from 'webpack-chain'

export default (webpackChain: WebpackChain) => {
  webpackChain.resolve.extensions.add('.jsx').add('.js').add('.ts').add('.tsx')
}

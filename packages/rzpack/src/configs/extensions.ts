import type WebpackChain from 'webpack-chain'

const resolveExtensions = (webpackChain: WebpackChain) => {
  webpackChain.resolve.extensions.add('.jsx').add('.js').add('.ts').add('.tsx')
}

export default resolveExtensions

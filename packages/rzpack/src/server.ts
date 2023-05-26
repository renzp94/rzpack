import { logError, cyan } from 'rzpack-utils'
import Webpack from 'webpack'
import WebpackDevServer, { Configuration } from 'webpack-dev-server'
import { rzpack } from './cli'

const runServer = async () => {
  rzpack.webpackChain.devtool('cheap-module-source-map')
  const { network, local, port, ...webpackConfigs } = rzpack.toConfig()

  const compiler = Webpack(webpackConfigs)
  compiler.hooks.failed.tap('rzpack', (msg) => {
    logError(msg.toString())
    process.exit(1)
  })

  compiler.hooks.done.tap('rzpack', (stats) => {
    if (stats.hasErrors()) {
      return false
    }

    console.log(
      'App run at: \n',
      `- Local:    ${cyan(`http://${local}:${port}`)}\n`,
      `- Network:  ${cyan(`http://${network}:${port}`)}\n\n`,
      'Note that the development build is not optimized.\n',
      `To create a production build, run ${cyan('yarn build')}.\n`
    )
  })
  const clientOverlay = {
    client: {
      overlay: {
        errors: true,
        runtimeErrors: false,
        warnings: false,
      },
    },
  }
  const devServerOptions: Configuration = {
    port,
    ...clientOverlay,
    ...(webpackConfigs.devServer ?? {}),
  }

  const server = new WebpackDevServer(devServerOptions, compiler)
  const signals = ['SIGINT', 'SIGTERM']
  signals.forEach((signal) =>
    process.on(signal, () => {
      server.stopCallback(() => process.exit(0))
      // 不用等dev server停掉再关闭进程，否则会出现Ctrl+C要等一会才能停止
      process.exit(0)
    })
  )
  server.start()
}

export default runServer

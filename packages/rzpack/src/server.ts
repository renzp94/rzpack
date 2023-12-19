import HtmlWebpackPlugin from 'html-webpack-plugin'
import runUI, {
  DEFAULT_CONFIG_FILE,
  PREFIX_URL,
  validateConfigFile,
} from 'rzpack-ui'
import { cyan, logError, logWarning } from 'rzpack-utils'
import Webpack from 'webpack'
import WebpackDevServer, { Configuration } from 'webpack-dev-server'
import { rzpack } from './cli'

const runServer = async (startUI: boolean, proxyFile: string) => {
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

    if (startUI) {
      console.log(
        'Rzpack UI run at: \n',
        `- Local:     ${cyan(`http://${local}:${port}${PREFIX_URL}`)}\n`,
        `- Network:   ${cyan(`http://${network}:${port}${PREFIX_URL}`)}\n\n`,
      )
    }

    console.log(
      'App run at: \n',
      `- Local:    ${cyan(`http://${local}:${port}`)}\n`,
      `- Network:  ${cyan(`http://${network}:${port}`)}\n\n`,
      'Note that the development build is not optimized.\n',
      `To create a production build, run ${cyan('yarn build')}.\n`,
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
    ...((webpackConfigs as any).devServer ?? {}),
  }

  if (startUI) {
    if (devServerOptions.proxy) {
      logWarning(
        '检测到使用Rzpack UI的同时，在配置文件配置了接口代理。配置文件中的配置将失效，优先使用Rzpack UI的代理模式',
      )
    }
    // 开启可视化配置时配置文件中配置的proxy将无效
    devServerOptions.proxy = undefined
    let proxyFilePath = proxyFile
    if (proxyFilePath && !validateConfigFile(proxyFilePath)) {
      logWarning(
        `接口代理配置文件仅支持json文件，${proxyFilePath}文件格式不对，将使用默认配置文件: ${DEFAULT_CONFIG_FILE}`,
      )
      proxyFilePath = undefined
    }
    const htmlWebpackPlugin = webpackConfigs.plugins?.find(
      (item) => item instanceof HtmlWebpackPlugin,
    ) as {
      userOptions?: { title?: string }
    }
    devServerOptions.setupMiddlewares = (middlewares, devServer) => {
      try {
        runUI({
          app: devServer.app,
          proxyFile: proxyFilePath,
          appTitle: htmlWebpackPlugin?.userOptions?.title,
          yagt: rzpack.yagt,
        })
      } catch (error) {
        console.log(error)
      }

      return middlewares
    }
  }

  const server = new WebpackDevServer(devServerOptions, compiler as any)
  const signals = ['SIGINT', 'SIGTERM']
  signals.forEach((signal) =>
    process.on(signal, () => {
      server.stopCallback(() => process.exit(0))
      // 不用等dev server停掉再关闭进程，否则会出现Ctrl+C要等一会才能停止
      process.exit(0)
    }),
  )
  server.start()
}

export default runServer

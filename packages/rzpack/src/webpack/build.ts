import { getFileFullPath, logError } from 'rzpack-utils'
import {
  bold,
  createEnvHash,
  cyan,
  fileExists,
  gray,
  lightBlue,
  lightYellow,
} from 'rzpack-utils'
import Webpack from 'webpack'
import { rzpack } from '../cli'

export default (isLog = true) => {
  // 抽离公共部分
  rzpack.webpackChain
    // 抛出错误之后停止打包
    .bail(true)
    .optimization.splitChunks({
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'chunk-vendors',
          priority: -10,
          chunks: 'initial',
        },
        common: {
          name: 'chunk-common',
          minChunks: 2,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true,
        },
      },
    })
  const raw = Object.keys(process.env).reduce((env) => env)

  if (rzpack.cache) {
    rzpack.webpackChain.cache({
      type: 'filesystem',
      name: `${process.env.NODE_ENV}-cache`,
      version: createEnvHash(raw),
      cacheDirectory: getFileFullPath('./node_modules/.cache'),
      store: 'pack',
      buildDependencies: {
        config: [__filename],
        tsconfig: [
          getFileFullPath('tsconfig.json'),
          getFileFullPath('jsconfig.json'),
        ].filter((f) => fileExists(f)),
      },
    })
  }
  const configs = rzpack.toConfig()

  const compiler = Webpack(configs)

  compiler.hooks.failed.tap('rzpack build', (msg) => {
    logError(msg.toString())
    process.exit(1)
  })

  compiler.run((_, stats) => {
    if (stats?.hasErrors()) {
      return false
    }

    if (isLog) {
      logBuildAssets(stats)
    }

    compiler.close((err) => {
      if (err) {
        console.log(err)
      }
    })
  })

  return new Promise<boolean>((resolve) =>
    compiler.hooks.afterDone.tap('rzpack', (stats) =>
      resolve(!stats?.hasErrors?.()),
    ),
  )
}

const logBuildAssets = (stats) => {
  const { time, assets } = stats.toJson()

  console.log(lightBlue(bold('Assets:')))

  assets?.map((item) => {
    const {
      name,
      cached,
      info: { immutable, minimized, size },
      related,
    } = item

    const status = `${cached ? 'cached ' : ''}${immutable ? 'immutable ' : ''}${
      minimized ? 'minimized' : ''
    }`.trim()

    let gzipInfo: string
    if (Object.keys(related).length > 0) {
      const [gzip] = related
      const gzipStatus = `${gzip?.cached ? 'cached ' : ''}${
        gzip?.info?.immutable ? 'immutable ' : ''
      }${gzip?.info?.minimized ? 'minimized' : ''}`.trim()
      gzipInfo = `\n${gray(
        `${gzip.name} ${(gzip?.size / 1024).toFixed(3)}KB  ${
          gzipStatus ? `[${gzipStatus}]` : ''
        }`,
      )}`
    }

    console.log(
      `${cyan(`${name} `)} ${lightYellow(
        bold(`${(size / 1024).toFixed(3)}KB`),
      )}  ${status ? lightBlue(`[${status}]`) : ''}`,
      gzipInfo ?? '',
    )
  })

  console.log(`\n✨  Done in ${(time / 1000).toPrecision(2)}s.`)
}

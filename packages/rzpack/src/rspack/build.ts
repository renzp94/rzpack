import rspack from '@rspack/core'
import { green, logError, red, yellow } from 'rzpack-utils'
import { bold, cyan, lightBlue, lightYellow } from 'rzpack-utils'
import { rzpack } from '../cli'

export default (isLog = true) => {
  // 抽离公共部分
  rzpack.chain
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

  // if (rzpack.cache) {
  //   rzpack.chain.cache({
  //     type: 'filesystem',
  //     name: `${process.env.NODE_ENV}-cache`,
  //     version: createEnvHash(raw),
  //     cacheDirectory: getFileFullPath('./node_modules/.cache'),
  //     store: 'pack',
  //     buildDependencies: {
  //       config: [__filename],
  //       tsconfig: [
  //         getFileFullPath('tsconfig.json'),
  //         getFileFullPath('jsconfig.json'),
  //       ].filter((f) => fileExists(f)),
  //     },
  //   })
  // }

  const configs = rzpack.toConfig()
  // @ts-ignore
  const compiler = rspack(configs)

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
  const { time, assets, warnings, errors } = stats.toJson()
  console.log(lightBlue(bold('Assets:')))

  assets?.map((item) => {
    const {
      name,
      cached,
      size,
      info: { immutable, minimized },
      // related,
    } = item

    const status = `${cached ? 'cached ' : ''}${immutable ? 'immutable ' : ''}${
      minimized ? 'minimized' : ''
    }`.trim()

    // let gzipInfo = ''
    // if (related && Object.keys(related).length > 0) {
    //   const [gzip] = related
    //   const gzipStatus = `${gzip?.cached ? 'cached ' : ''}${
    //     gzip?.info?.immutable ? 'immutable ' : ''
    //   }${gzip?.info?.minimized ? 'minimized' : ''}`.trim()
    //   gzipInfo = `\n${gray(
    //     `${gzip.name} ${(gzip?.size / 1024).toFixed(3)}KB  ${
    //       gzipStatus ? `[${gzipStatus}]` : ''
    //     }`,
    //   )}`
    // }

    console.log(
      `${cyan(`${name} `)} ${lightYellow(
        bold(`${(size / 1024).toFixed(3)}KB`),
      )}  ${status ? lightBlue(`[${status}]`) : ''}`,
      // gzipInfo,
    )
  })

  console.log(
    `\n🚨  Has ${red(errors?.length)} errors, ${yellow(
      warnings.length,
    )} warnings.`,
  )
  console.log(
    `✨  Rzpack build by ${green('Rspack')} done in ${green(
      (time / 1000).toPrecision(2),
    )}s.`,
  )
}

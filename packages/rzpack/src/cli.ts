#!/usr/bin/env node
import { cac } from 'cac'
import { fileExists, logError, pathResolve } from 'rzpack-utils'
import {
  BUILDER,
  type BuildOptions,
  type RzpackConfigs,
  type ServerOptions,
} from '.'
import { DEFAULT_CONFIG, NAME, VERSION } from './constant'
import { RzpackContext } from './ctx'
import { runRspackBuild, runRspackPreview, runRspackServer } from './rspack'
import { runWebpackBuild, runWebpackPreview, runWebpackServer } from './webpack'

export const rzpack = new RzpackContext()

const cli = cac(NAME)

// default config
cli
  .option('-c, --config <file>', '[string] use specified config file')
  .option('-m, --mode <mode>', `['development' | 'production'] set env mode`)

// dev
cli
  .command('[root]', 'start dev server')
  .alias('dev')
  .alias('start')
  .option('--host [host]', '[string] specify hostname')
  .option('--port [port]', '[string] specify port')
  .option('--open [path]', '[boolean | string] open browser on startup')
  .option('--ui', '[boolean] startup Rzpack UI')
  .action(async (_: string, options: ServerOptions) => {
    const { c, m, mode, ui = true, config, host, port, open } = options ?? {}
    process.env.NODE_ENV = m ?? mode ?? 'development'
    rzpack.chain.devServer.host(host).port(port).open(open)
    try {
      const configs: RzpackConfigs = rzpack.loadConfigFile(c ?? config)
      await rzpack.configs(configs)
      const run =
        configs?.builder === BUILDER.WEBPACK
          ? runWebpackServer
          : runRspackServer

      run(ui, configs?.proxyFile)
    } catch (error) {
      logError(error)
    }
  })

// build
cli
  .command('build', 'build for production')
  .option('--outDir <dir>', '[string] output directory (default: dist)')
  .option('--bundle-size', '[boolean] analysis package size')
  .option('--bundle-time', '[boolean] analyze packaging time')
  .option('--doctor', '[boolean] start Rsdoctor')
  .action(async (options: BuildOptions) => {
    const {
      c,
      m,
      mode,
      config,
      outDir = DEFAULT_CONFIG.OUTPUT,
      bundleSize,
      bundleTime,
      doctor,
    } = options ?? {}
    process.env.NODE_ENV = m ?? mode ?? 'production'
    rzpack.bundleSize = bundleSize ?? false
    rzpack.bundleTime = bundleTime ?? false
    rzpack.doctor = doctor ?? false

    try {
      const configs = rzpack.loadConfigFile(c ?? config)
      if (!configs?.output) {
        configs.output = outDir
      }
      await rzpack.configs(configs)
      const run =
        configs?.builder === BUILDER.WEBPACK ? runWebpackBuild : runRspackBuild

      run(!rzpack.bundleTime)
    } catch (error) {
      logError(error)
    }
  })

// preview
cli
  .command('preview', 'preview for outDir')
  .option('--outDir <dir>', '[string] output directory (default: dist)')
  .action(async (options: BuildOptions) => {
    const { c, m, mode, config, outDir = DEFAULT_CONFIG.OUTPUT } = options ?? {}
    process.env.NODE_ENV = m ?? mode ?? 'production'

    const configs = rzpack.loadConfigFile(c ?? config)
    if (!configs?.output) {
      configs.output = outDir
    }
    const dir =
      typeof configs.output === 'string'
        ? configs.output
        : configs?.output?.path
    const fullPath = pathResolve(dir, process.cwd())
    let isPreview: boolean = fileExists(fullPath)
    if (!isPreview) {
      await rzpack.configs(configs)
      const runBuild =
        configs?.builder === BUILDER.WEBPACK ? runWebpackBuild : runRspackBuild

      isPreview = await runBuild(false)
    }

    if (configs?.builder === BUILDER.WEBPACK) {
      runWebpackPreview(dir)
    }
    const run =
      configs?.builder === BUILDER.WEBPACK
        ? runWebpackPreview
        : runRspackPreview

    run(dir)
  })

cli.help()
cli.version(VERSION)
cli.parse()

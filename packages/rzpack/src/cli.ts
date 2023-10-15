#!/usr/bin/env node
import { cac } from 'cac'
import { fileExists, logError, pathResolve } from 'rzpack-utils'
import type { BuildOptions, RzpackConfigs, ServerOptions } from '.'
import runBuild from './build'
import { RzpackContext } from './configs'
import { NAME, VERSION } from './constant'
import runPreview from './preview'
import runServer from './server'

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
    rzpack.mode = m ?? mode ?? 'development'
    process.env.NODE_ENV = rzpack.mode
    rzpack.webpackChain.devServer.host(host).port(port).open(open)
    try {
      const configs: RzpackConfigs = rzpack.loadConfigFile(c ?? config)
      await rzpack.configs(configs)
      runServer(ui, configs?.proxyFile)
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
  .action(async (options: BuildOptions) => {
    const {
      c,
      m,
      mode,
      config,
      outDir = 'dist',
      bundleSize,
      bundleTime,
    } = options ?? {}
    rzpack.mode = m ?? mode ?? 'production'
    process.env.NODE_ENV = rzpack.mode
    rzpack.bundleSize = bundleSize ?? false
    rzpack.bundleTime = bundleTime ?? false
    try {
      const configs = rzpack.loadConfigFile(c ?? config)
      if (!configs?.output) {
        configs.output = outDir
      }
      await rzpack.configs(configs)
      runBuild(!rzpack.bundleTime)
    } catch (error) {
      logError(error)
    }
  })

// preview
cli
  .command('preview', 'preview for outDir')
  .option('--outDir <dir>', '[string] output directory (default: dist)')
  .action(async (options: BuildOptions) => {
    const { c, m, mode, config, outDir = 'dist' } = options ?? {}
    rzpack.mode = m ?? mode ?? 'production'
    process.env.NODE_ENV = rzpack.mode

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
      isPreview = await runBuild(false)
    }

    runPreview(dir)
  })

cli.help()
cli.version(VERSION)
cli.parse()

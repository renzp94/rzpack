#!/usr/bin/env node
import type { BuildOptions, ServerOptions, RzpackConfigs } from '.'
import { NAME, VERSION } from './constant'
import { cac } from 'cac'
import runServer from './server'
import runBuild from './build'
import runPreview from './preview'
import { RzpackContext } from './configs'
import { fileExists, pathResolve, logError } from 'rzpack-utils'

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
  .action(async (_: string, options: ServerOptions) => {
    const { c, m, mode, config = 'rzpack.config.js', host, port, open } = options ?? {}
    rzpack.mode = m ?? mode ?? 'development'
    process.env.NODE_ENV = rzpack.mode
    rzpack.webpackChain.devServer.host(host).port(port).open(open)
    try {
      const configs: RzpackConfigs = rzpack.loadConfigFile(c ?? config)
      await rzpack.configs(configs)
      runServer()
    } catch (error) {
      logError(error)
    }
  })

// build
cli
  .command('build', 'build for production')
  .option('--outDir <dir>', `[string] output directory (default: dist)`)
  .option('--bundle-size', '[boolean] analysis package size')
  .option('--bundle-time', '[boolean] analyze packaging time')
  .action(async (options: BuildOptions) => {
    const {
      c,
      m,
      mode,
      config = 'rzpack.config.js',
      outDir = 'dist',
      bundleSize,
      bundleTime,
    } = options ?? {}
    rzpack.mode = m ?? mode ?? 'production'
    process.env.NODE_ENV = rzpack.mode
    rzpack.bundleSize = bundleSize ?? false
    rzpack.bundleTime = bundleTime ?? false
    try {
      const configs: RzpackConfigs = rzpack.loadConfigFile(c ?? config)
      await rzpack.configs({ ...configs, output: outDir })
      runBuild(!rzpack.bundleTime)
    } catch (error) {
      logError(error)
    }
  })

// preview
cli
  .command('preview', 'preview for outDir')
  .option('--outDir <dir>', `[string] output directory (default: dist)`)
  .action(async (options: BuildOptions) => {
    const { c, m, mode, config, outDir = 'dist' } = options ?? {}
    let isPreview: boolean = fileExists(pathResolve(outDir, process.cwd()))
    if (!isPreview) {
      rzpack.mode = m ?? mode ?? 'production'
      process.env.NODE_ENV = rzpack.mode
      const configs: RzpackConfigs = rzpack.loadConfigFile(c ?? config)
      await rzpack.configs({ ...configs, output: outDir })
      isPreview = await runBuild(false)
    }

    if (isPreview) {
      runPreview(outDir)
    }
  })

cli.help()
cli.version(VERSION)
cli.parse()

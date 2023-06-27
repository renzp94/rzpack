import { defineConfig } from 'tsup'
import baseConfigs from '../../../configs/tsup.config.base'

export default defineConfig([
  {
    ...baseConfigs,
    //   入口文件
    entry: {
      index: './src/index.ts',
    },
    outDir: '../dist',
    dts: './src/index.ts',
    sourcemap: false,
    clean: false,
    external: ['esbuild'],
    noExternal: ['express', 'rzpack-utils', 'express-dynamic-middleware'],
  },
])

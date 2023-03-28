import { defineConfig } from 'tsup'
import baseConfigs from '../../configs/tsup.config.base'

export default defineConfig({
  ...baseConfigs,
  //   入口文件
  entry: ['./src/index.ts'],
  outDir: 'bin',
})

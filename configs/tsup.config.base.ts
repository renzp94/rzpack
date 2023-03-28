import { defineConfig } from 'tsup'

export default defineConfig({
  //   打包格式
  format: ['cjs'],
  //   打包前清空
  clean: true,
  sourcemap: true,
  minify: false,
})

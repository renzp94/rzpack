/* eslint-disable @typescript-eslint/no-var-requires */
const { defineConfig } = require('rzpack')

module.exports = defineConfig({
  html: {
    title: 'rzpack-antd',
  },
  antdTheme: {
    file: './src/theme/index.ts',
  },
  lessVars: {
    file: './src/theme/globalVars.ts',
  },
  assets: {
    jsxTools: 'esbuild',
  },
})

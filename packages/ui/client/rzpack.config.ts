import { defineConfig, JSX_TOOLS } from 'rzpack'

export default defineConfig({
  antdTheme: {
    file: './src/theme/index.ts',
  },
  assets: {
    jsxTools: JSX_TOOLS.ESBUILD,
  },
  html: {
    title: 'Rzpack UI',
  },
  lessVars: {
    file: './src/theme/globalVars.ts',
  },
  output: {
    path: '../dist/client',
    publicPath: '/static/',
  },
})

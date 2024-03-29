import { JSX_TOOLS, defineConfig } from 'rzpack'

export default defineConfig({
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
    jsxTools: JSX_TOOLS.ESBUILD,
  },
  buildInfo: true,
  million: true,
})

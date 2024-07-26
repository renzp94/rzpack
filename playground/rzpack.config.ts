import { BUILDER, JSX_TOOLS, defineConfig } from 'rzpack'

export default defineConfig({
  builder: BUILDER.RSPACK,
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
    jsxTools: JSX_TOOLS.BABEL,
    cssScoped: true,
  },
  gzip:true,
  buildInfo: true,
})

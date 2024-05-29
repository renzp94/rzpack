import { BUILDER, JSX_TOOLS, defineConfig } from 'rzpack'

export default defineConfig({
  builder: BUILDER.RSPACK,
  html: {
    title: 'module-two',
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
  server: {
    port: 8002,
  },
  moduleFederation: {
    name: 'MODULE_TWO',
    exposes: {
      './App': './src/App',
    },
    shared: {
      deps: ['react-dom', 'react'],
      depsPackagePath: '../../package.json',
    },
  },
})

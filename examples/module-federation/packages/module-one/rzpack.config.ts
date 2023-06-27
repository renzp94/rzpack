import { defineConfig, JSX_TOOLS } from 'rzpack'

export default defineConfig({
  html: {
    title: 'module-one',
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
    port: 8001,
  },
  moduleFederation: {
    name: 'MODULE_ONE',
    exposes: {
      './App': './src/App',
    },
    shared: {
      deps: ['react-dom', 'react'],
      depsPackagePath: '../../package.json',
    },
  },
})

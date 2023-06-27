import { defineConfig, JSX_TOOLS } from 'rzpack'

export default defineConfig({
  html: {
    title: 'app',
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
    proxy: {
      '/api': 'http://127.0.0.0:3000',
    },
  },
  moduleFederation: {
    name: 'APP',
    remotes: {
      MODULE_ONE: `MODULE_ONE@${process.env.REACT_APP_MODULE_ONE_URL}/remote.js`,
      MODULE_TWO: `MODULE_TWO@${process.env.REACT_APP_MODULE_TWO_URL}/remote.js`,
    },
    shared: {
      deps: ['react-dom', 'react'],
      depsPackagePath: '../../package.json',
    },
  },
})

import { BUILDER, JSX_TOOLS, defineConfig } from 'rzpack'

export default defineConfig({
  builder: BUILDER.RSPACK,
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

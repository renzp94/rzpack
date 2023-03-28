/* eslint-disable @typescript-eslint/no-var-requires */
import { requireResolve } from 'rzpack-utils'
import path from 'path'

const absoluteRuntime = path.dirname(requireResolve('@babel/runtime/package.json'))
const version = require('@babel/runtime/package.json').version

export default [
  [
    requireResolve('@babel/plugin-transform-runtime'),
    {
      corejs: false,
      helpers: true,
      regenerator: true,
      useESModules: true,
      absoluteRuntime,
      version,
    },
  ],
  requireResolve('babel-plugin-transform-react-remove-prop-types'),
  requireResolve('babel-plugin-macros'),
]

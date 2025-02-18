import path from 'node:path'
import { requireResolve } from 'rzpack-utils'

const absoluteRuntime = path.dirname(
  requireResolve('@babel/runtime/package.json'),
)
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
]

import { requireResolve } from 'rzpack-utils'

export default [
  [
    requireResolve('@babel/preset-env'),
    { modules: false, useBuiltIns: 'entry', corejs: '3.22' },
  ],
  [requireResolve('@babel/preset-react'), { runtime: 'automatic' }],
  requireResolve('@babel/preset-typescript'),
]

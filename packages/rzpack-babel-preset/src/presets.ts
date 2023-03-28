import { requireResolve } from 'rzpack-utils'

export default [
  [
    requireResolve('@babel/preset-env'),
    { useBuiltIns: 'entry', corejs: 3, exclude: ['transform-typeof-symbol'] },
  ],
  requireResolve('@babel/preset-react'),
  requireResolve('@babel/preset-typescript'),
]

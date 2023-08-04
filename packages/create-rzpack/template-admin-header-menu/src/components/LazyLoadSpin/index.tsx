import React from 'react'
import { Suspense } from 'react'

import CenterSpin from '../CenterSpin'

const LazyLoadSpin = ({ children }: { children: React.ReactElement }) => {
  return <Suspense fallback={<CenterSpin />}>{children}</Suspense>
}

export default LazyLoadSpin

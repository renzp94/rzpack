import React from 'react'
import { Outlet } from 'react-router-dom'

import styles from './index.module.less'

const LayoutContent = () => {
  return (
    <div className={styles.content}>
      <Outlet />
    </div>
  )
}

export default LayoutContent

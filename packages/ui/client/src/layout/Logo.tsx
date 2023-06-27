import React from 'react'

import logo from '@/assets/images/logo.svg?url'

import styles from './index.module.less'

const Logo = () => {
  return (
    <div className={styles.logo}>
      <img className={styles.logoImg} src={logo} />
      <h2 className={styles.logoText}>Rzpack UI</h2>
    </div>
  )
}

export default Logo

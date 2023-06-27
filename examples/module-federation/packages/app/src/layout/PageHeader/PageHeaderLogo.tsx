import React from 'react'
import logo from '@/assets/img/logo.png'
import classes from './index.module.less'
import { classNames } from '@/utils/tools'

export interface PageHeaderLogoProps {
  collapsed?: boolean
}

const PageHeaderLogo = (props: PageHeaderLogoProps) => {
  return (
    <div className={classNames([classes.logo, classes.logoCollapsed])}>
      <img className={classes.logoImg} src={logo} alt="logo" />
      {props.collapsed ? null : <span className={classes.logoName}>XXX管理平台</span>}
    </div>
  )
}

export default PageHeaderLogo

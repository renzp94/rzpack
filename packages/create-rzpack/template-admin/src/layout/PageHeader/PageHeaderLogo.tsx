import logo from '@/assets/img/logo.png'
import { classNames } from '@/utils/tools'

import classes from './index.module.less'

export interface PageHeaderLogoProps {
  collapsed?: boolean
}

const PageHeaderLogo = (props: PageHeaderLogoProps) => {
  return (
    <div className={classNames([classes.logo, classes.logoCollapsed])}>
      <img alt="logo" className={classes.logoImg} src={logo} />
      {props.collapsed ? null : <span className={classes.logoName}>XXX管理平台</span>}
    </div>
  )
}

export default PageHeaderLogo

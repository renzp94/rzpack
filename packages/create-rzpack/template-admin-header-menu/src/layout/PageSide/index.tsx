import { Layout } from 'antd'

import PageSideMenu from './PageSideMenu'
import MenuCloseIcon from '@/assets/svg/menu-close.svg'
import MenuOpenIcon from '@/assets/svg/menu-open.svg'

import classes from './index.module.less'

export interface PageSideProps {
  collapsed?: boolean
  onCollapsedChange?: React.Dispatch<React.SetStateAction<boolean>>
}

const PageSide = (props: PageSideProps) => {
  return (
    <Layout.Sider
      className={classes.sider}
      collapsed={props.collapsed}
      collapsible
      theme="light"
      trigger={null}
    >
      <PageSideMenu />
      <div className={classes.collapsed}>
        {props.collapsed ? (
          <MenuOpenIcon
            className={classes.collapsedIcon}
            onClick={() => props?.onCollapsedChange?.(false)}
          />
        ) : (
          <MenuCloseIcon
            className={classes.collapsedIcon}
            onClick={() => props?.onCollapsedChange?.(true)}
          />
        )}
      </div>
    </Layout.Sider>
  )
}

export default PageSide

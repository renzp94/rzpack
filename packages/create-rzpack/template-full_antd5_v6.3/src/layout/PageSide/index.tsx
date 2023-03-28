import React from 'react'
import { Layout } from 'antd'
import PageSideMenu from './PageSideMenu'
import classes from './index.module.less'
import MenuCloseIcon from '@/assets/svg/menu-close.svg'
import MenuOpenIcon from '@/assets/svg/menu-open.svg'

export interface PageSideProps {
  collapsed?: boolean
  onCollapsedChange?: React.Dispatch<React.SetStateAction<boolean>>
}

const PageSide = (props: PageSideProps) => {
  return (
    <Layout.Sider
      className={classes.sider}
      theme="light"
      trigger={null}
      collapsible
      collapsed={props.collapsed}
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

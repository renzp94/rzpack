import { Layout } from 'antd'
import React from 'react'
import classes from './index.module.less'
import PageHeaderLogo from './PageHeaderLogo'
import PageHeaderMenu from './PageHeaderMenu'
import PageHeaderTools from './PageHeaderTools'

export interface PageHeaderProps {
  collapsed?: boolean
}

const PageHeader = (props: PageHeaderProps) => {
  return (
    <Layout.Header className={classes.header}>
      <PageHeaderLogo collapsed={props?.collapsed} />
      <PageHeaderMenu />
      <PageHeaderTools />
    </Layout.Header>
  )
}

export default PageHeader

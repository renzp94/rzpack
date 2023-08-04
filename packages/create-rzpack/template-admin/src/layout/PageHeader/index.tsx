import { Layout } from 'antd'
import React from 'react'

import PageHeaderLogo from './PageHeaderLogo'
import PageHeaderTools from './PageHeaderTools'

import classes from './index.module.less'

export interface PageHeaderProps {
  collapsed?: boolean
}

const PageHeader = (props: PageHeaderProps) => {
  return (
    <Layout.Header className={classes.header}>
      <PageHeaderLogo collapsed={props?.collapsed} />
      <PageHeaderTools />
    </Layout.Header>
  )
}

export default PageHeader

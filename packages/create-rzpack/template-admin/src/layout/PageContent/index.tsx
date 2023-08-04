import type { ProBreadcrumbRoute } from '@/components/ProBreadcrumb'

import { Layout } from 'antd'
import React from 'react'
import { Outlet } from 'react-router-dom'

import { ProBreadcrumb } from '@/components'
import useRouterStore from '@/stores/router'

import classes from './index.module.less'

const PageContent = () => {
  const routes = useRouterStore(state => state.userAuths) as ProBreadcrumbRoute[]

  return (
    <Layout.Content className={classes.pageContent}>
      <ProBreadcrumb className={classes.pageContentBreadcrumb} routes={routes} />
      <Outlet />
    </Layout.Content>
  )
}

export default PageContent

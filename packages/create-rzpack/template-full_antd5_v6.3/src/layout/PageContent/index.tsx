import { ProBreadcrumb } from '@/components'
import { ProBreadcrumbRoute } from '@/components/ProBreadcrumb'
import useRouterStore from '@/stores/router'
import { Layout } from 'antd'
import React from 'react'
import { Outlet } from 'react-router-dom'
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

import { Layout } from 'antd'
import React, { useState } from 'react'

import PageContent from '../PageContent'
import PageHeader from '../PageHeader'
import PageSlider from '../PageSide'
import { AuthRoute, AutoFirstPath } from '@/components'

import classes from './index.module.less'

const PageLayout = () => {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <AuthRoute>
      <AutoFirstPath>
        <Layout>
          <PageHeader collapsed={collapsed} />
          <Layout className={classes.layout}>
            <PageSlider collapsed={collapsed} onCollapsedChange={setCollapsed} />
            <PageContent />
          </Layout>
        </Layout>
      </AutoFirstPath>
    </AuthRoute>
  )
}

export default PageLayout

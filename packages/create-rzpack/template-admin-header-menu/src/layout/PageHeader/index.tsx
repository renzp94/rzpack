import { Layout } from 'antd'

import PageHeaderLogo from './PageHeaderLogo'
import PageHeaderMenu from './PageHeaderMenu'
import PageHeaderTools from './PageHeaderTools'

import classes from './index.module.less'

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

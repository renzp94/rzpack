import { Layout } from 'antd'
import React from 'react'

import LayoutContent from './LayoutContent'
import LayoutSider from './LayoutSider'

import styles from './index.module.less'

const { Content, Footer, Sider } = Layout

const BasicLayout = () => {
  return (
    <Layout className={styles.layout}>
      <Sider theme="light">
        <LayoutSider />
      </Sider>
      <Layout className={styles.main}>
        <Content>
          <LayoutContent />
        </Content>
        <Footer className={styles.footer}>Powered by Rzpack</Footer>
      </Layout>
    </Layout>
  )
}

export default BasicLayout

import { App, ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import React from 'react'

import token from '@/theme'

export interface AntdConfigProvider {
  children: React.ReactNode
}

const AntdConfigProvider = (props: AntdConfigProvider) => {
  return (
    <ConfigProvider
      // 移除按钮汉字之间的空格
      button={{ autoInsertSpace: false }}
      // 中文配置
      locale={zhCN}
      theme={{ token }}
    >
      <App>{props.children}</App>
    </ConfigProvider>
  )
}

export default AntdConfigProvider

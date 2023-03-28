import React from 'react'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const token = require('@/theme')

export interface AntdConfigProvider {
  children: React.ReactNode
}

const AntdConfigProvider = (props: AntdConfigProvider) => {
  return (
    <ConfigProvider
      theme={{ token }}
      // 中文配置
      locale={zhCN}
      // 移除按钮汉字之间的空格
      autoInsertSpaceInButton={false}
    >
      {props.children}
    </ConfigProvider>
  )
}

export default AntdConfigProvider

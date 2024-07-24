import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import dayjs from 'dayjs'
import React from 'react'

import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')

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
    >
      {props.children}
    </ConfigProvider>
  )
}

export default AntdConfigProvider

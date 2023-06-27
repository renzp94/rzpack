import type { RouteObject } from 'react-router-dom'

import React, { lazy } from 'react'

import { LazyLoadSpin } from '@/components'
import BasicLayout from '@/layout/BasicLayout'
import PageError from '@/pages/Error'

export interface RouteModel {
  children?: Array<RouteModel>
  // 组件路径
  component?: string
  // 图标
  icon?: React.ReactElement
  // 是否为首页
  index?: boolean
  // 路径
  path: string
  // 排序
  sort?: number
  // 名称
  title: string
}

export const notFoundRoute: RouteObject = {
  element: <PageError />,
  path: '*',
}
export const layoutRoute: RouteObject = {
  children: [],
  element: <BasicLayout />,
  errorElement: <PageError />,
  path: '/',
}

/**
 * 渲染路由组件
 * @param configs 路由配置信息
 */
export const renderRoutes = (configs: RouteModel[]) => {
  const children = configs.map(item => {
    const route: RouteObject = {
      path: item.path,
    }

    // 设置嵌套路由
    if (item?.children?.length) {
      route.children = renderRoutes(item.children)
    }

    // 如果有组件则渲染element
    if (item.component) {
      // 要以@/pages/开头，否则webpack无法找到组件
      // 要以/index结尾，否则webpack会报无法识别文件类型的警告
      const Component = lazy(() => import(`@/pages/${item.component}/index`))

      route.element = (
        <LazyLoadSpin>
          <Component />
        </LazyLoadSpin>
      )
    }

    return route
  })

  return children
}

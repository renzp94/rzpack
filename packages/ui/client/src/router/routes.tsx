import { CoffeeOutlined, SlidersOutlined } from '@ant-design/icons'
import React from 'react'

import { layoutRoute, notFoundRoute } from './tools'
import { renderRoutes, type RouteModel } from './tools'

export const routeModels: RouteModel[] = [
  {
    component: 'Proxy',
    icon: <SlidersOutlined />,
    index: true,
    path: '/',
    title: '接口代理配置',
  },
  {
    component: 'Yagt',
    icon: <CoffeeOutlined />,
    path: '/yagt',
    title: '类型生成器',
  },
]

const routes = renderRoutes(routeModels)
layoutRoute.children = [...routes, notFoundRoute]

export const getAuthRoutes = (authRoutes: RouteModel[]) => {
  const list = renderRoutes(authRoutes)
  layoutRoute.children = [...list, notFoundRoute]

  return [layoutRoute]
}

export default [layoutRoute]

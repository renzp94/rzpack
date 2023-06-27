import { SlidersOutlined } from '@ant-design/icons'
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
]

const routes = renderRoutes(routeModels)
layoutRoute.children = [...routes, notFoundRoute]

export default [layoutRoute]

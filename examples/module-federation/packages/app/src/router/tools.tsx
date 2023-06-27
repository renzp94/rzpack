/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { RouteObject } from 'react-router-dom'
import React from 'react'
import { lazy } from 'react'
import { LazyLoadSpin } from '@/components'
import Login from '@/pages/Login'
import PageLayout from '@/layout/PageLayout'
import ErrorPage from '@/pages/Error'
import { flattenDeepByKey } from '@/utils/tools'
import { ErrorBoundary } from 'react-error-boundary'

// @ts-expect-error
const ProductApp = lazy(() => import('MODULE_ONE/App'))
// @ts-expect-error
const UserApp = lazy(() => import('MODULE_TWO/App'))

const remotes = {
  'MODULE_ONE/App': ProductApp,
  'MODULE_TWO/App': UserApp,
}

export interface RouteModel {
  id?: number | string
  // 名称
  title: string
  // 图标
  icon?: string
  // 路径
  path: string
  // 组件路径
  component?: string
  // 联邦模块路径
  remote?: string
  // 是否隐藏
  hidden: boolean
  // 权限类型
  type?: number
  // 排序
  sort?: number
  // 元信息
  meta?: string
  children?: Array<RouteModel>
}
export const notFoundRoute: RouteObject = {
  path: '*',
  element: <ErrorPage />,
}
export const layoutRoute: RouteObject = {
  path: '/',
  element: <PageLayout />,
  children: [notFoundRoute],
}
export const loginRoute: RouteObject = {
  path: '/login',
  element: <Login />,
}

/**
 * 渲染路由组件
 * @param configs 路由配置信息
 */
export const renderRoutes = (configs: RouteModel[]) => {
  const children = configs.map((item) => {
    const route: RouteObject = {
      path: item.path,
    }

    // 设置嵌套路由
    if (item?.children?.length) {
      route.children = renderRoutes(item.children)
    }

    // 如果有组件则渲染element
    if (item.remote || item.component) {
      // 要以@/pages/开头，否则webpack无法找到组件
      // 要以/index结尾，否则webpack会报无法识别文件类型的警告
      const Component = item.remote
        ? remotes[item.remote]
        : lazy(() => import(`@/pages/${item.component}/index`))

      route.element = (
        <ErrorBoundary resetKeys={[item.path]} fallback={<ErrorPage />}>
          <LazyLoadSpin>
            <Component />
          </LazyLoadSpin>
        </ErrorBoundary>
      )
    }

    return route
  })

  return children
}

export const getUserRoutes = (configs: RouteModel[]): [RouteObject[], string] => {
  const userRoutes = flattenDeepByKey(renderRoutes(configs), 'children')
    .map((item) => ({
      ...item,
      children: undefined,
    }))
    .filter((item) => item.element)

  let firstPath = '/404'
  if (userRoutes?.length) {
    firstPath = userRoutes[0]?.path
  }

  return [userRoutes, firstPath]
}

export const mergeUserRoutes = (routes: RouteObject[]) => {
  if (routes.length > 0) {
    layoutRoute.children = [...routes, ...(layoutRoute.children as RouteObject[])]
  }
  return [layoutRoute, loginRoute]
}

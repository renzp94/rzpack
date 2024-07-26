import type { RouteObject } from 'react-router-dom'

import { lazy } from 'react'

import { LazyLoadSpin } from '@/components'
import PageLayout from '@/layout/PageLayout'
import ErrorPage from '@/pages/Error'
import Login from '@/pages/Login'
import { flattenDeepByKey } from '@/utils/tools'

export interface RouteModel {
  children?: Array<RouteModel>
  // 组件路径
  component?: string
  // 是否隐藏
  hidden: boolean
  // 图标
  icon?: string | React.ReactNode
  id?: number | string
  // 元信息
  meta?: string
  // 路径
  path: string
  // 排序
  sort?: number
  // 名称
  title: string
  // 权限类型
  type?: number
}
export const notFoundRoute: RouteObject = {
  element: <ErrorPage />,
  path: '*',
}
export const layoutRoute: RouteObject = {
  children: [notFoundRoute],
  element: <PageLayout />,
  path: '/',
}
export const loginRoute: RouteObject = {
  element: <Login />,
  path: '/login',
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

export const getUserRoutes = (configs: RouteModel[]): [RouteObject[], string] => {
  const userRoutes = flattenDeepByKey(renderRoutes(configs), 'children')
    .map(item => ({
      ...item,
      children: undefined,
    }))
    .filter(item => item.element)

  let firstPath = '/404'
  if (userRoutes?.length) {
    firstPath = userRoutes[0]?.path as string
  }

  return [userRoutes, firstPath]
}

export const mergeUserRoutes = (routes: RouteObject[]) => {
  if (routes.length > 0) {
    layoutRoute.children = [...routes, ...(layoutRoute.children as RouteObject[])]
  }
  return [layoutRoute, loginRoute]
}

import type { RouteModel } from '@/router'
import React, { useMemo } from 'react'
import { Breadcrumb } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import DynamicIcon from '../DynamicIcon'

export interface ProBreadcrumbRoute extends RouteModel {
  icon: string & React.ReactNode
  // children属性中的配置是否渲染成下拉菜单
  isChildOverlayMenu?: boolean
  children: ProBreadcrumbRoute[]
}

export interface ProBreadcrumbProps {
  routes: ProBreadcrumbRoute[]
  prefixCls?: string
  params?: any
  separator?: React.ReactNode
  isIconRender?: boolean
  itemRender?: (
    route: ProBreadcrumbRoute,
    params: any,
    routes: ProBreadcrumbRoute[],
    paths: string[]
  ) => React.ReactNode
  style?: React.CSSProperties
  className?: string
  children?: React.ReactNode
}

const flattenDeepRoute = (routes: Array<ProBreadcrumbRoute>): Array<ProBreadcrumbRoute> => {
  return routes.reduce(
    (prev, curr) => [...prev, curr, ...(curr?.children ? flattenDeepRoute(curr.children) : [])],
    [] as Array<ProBreadcrumbRoute>
  )
}

const getCurrentRoutes = (routes: ProBreadcrumbRoute[], pathname: string) => {
  for (const item of routes) {
    if (item.path === pathname) {
      return [item]
    }

    if (item?.children?.length) {
      const list: ProBreadcrumbRoute[] = getCurrentRoutes(
        item.children as ProBreadcrumbRoute[],
        pathname
      )

      if (list?.length > 0) {
        return [item, ...list]
      }
    }
  }

  return []
}

export const itemDefaultRender = (item: ProBreadcrumbRoute, isIconRender?: boolean) => {
  return (
    <>
      {isIconRender ? (
        typeof item.icon === 'string' ? (
          <DynamicIcon name={item.icon} />
        ) : (
          item.icon
        )
      ) : null}
      <span style={{ marginLeft: 4 }}>{item.title}</span>
    </>
  )
}

export const itemLinkRender = (item: ProBreadcrumbRoute, isIconRender?: boolean) => {
  const isOutsideLink = item.path.startsWith('http')

  if (isOutsideLink) {
    return (
      <a href={item.path} target="_blank" rel="noreferrer">
        {itemDefaultRender(item, isIconRender)}
      </a>
    )
  }

  if (item.component) {
    return <Link to={item.path}>{itemDefaultRender(item, isIconRender)}</Link>
  }

  return itemDefaultRender(item, isIconRender)
}

export const getBreadcrumbMenus = (
  routes: ProBreadcrumbRoute[],
  pathname: string,
  isIconRender?: boolean
) => {
  const flattenRoutes = flattenDeepRoute(routes)
  const route = flattenRoutes.find((item) => item.isChildOverlayMenu && item.path === pathname)

  if (route && route?.children?.length) {
    return route.children.map((item) => ({
      key: item.path,
      label: itemLinkRender(item, isIconRender),
    }))
  }

  return undefined
}

const ProBreadcrumb = (props: ProBreadcrumbProps) => {
  const { routes = [], itemRender, isIconRender, ...breadcrumbProps } = props
  const location = useLocation()

  const breadcrumbRoutes = useMemo(
    () => getCurrentRoutes(routes, location.pathname),
    [routes, location]
  )

  return (
    <Breadcrumb {...breadcrumbProps}>
      {breadcrumbRoutes?.map((item, index) => {
        if (itemRender) {
          return itemRender(
            item,
            breadcrumbProps.params,
            routes,
            breadcrumbRoutes.map((item) => item.path)
          )
        }

        const isLastItem = index === breadcrumbRoutes.length - 1

        const menuItems = getBreadcrumbMenus(routes, item.path, isIconRender)

        return (
          <Breadcrumb.Item key={item.path} menu={menuItems ? { items: menuItems } : undefined}>
            {isLastItem
              ? itemDefaultRender(item, isIconRender)
              : itemLinkRender(item, isIconRender)}
          </Breadcrumb.Item>
        )
      })}
    </Breadcrumb>
  )
}

export default ProBreadcrumb

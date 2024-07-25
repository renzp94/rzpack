import type { RouteModel } from '@/router'

import { Breadcrumb, type BreadcrumbProps } from 'antd'
import { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'

import DynamicIcon from '../DynamicIcon'
import { flattenDeepByKey } from '@/utils/tools'

export interface ProBreadcrumbRoute extends RouteModel {
  children: ProBreadcrumbRoute[]
  icon: string & React.ReactNode
  // children属性中的配置是否渲染成下拉菜单
  isChildOverlayMenu?: boolean
}

export interface ProBreadcrumbProps extends Omit<BreadcrumbProps, 'routes'> {
  children?: React.ReactNode
  className?: string
  isIconRender?: boolean
  params?: any
  prefixCls?: string
  routes: ProBreadcrumbRoute[]
  separator?: React.ReactNode
  style?: React.CSSProperties
}

const ProBreadcrumb = (props: ProBreadcrumbProps) => {
  const { isIconRender, routes = [], ...breadcrumbProps } = props
  const location = useLocation()

  const breadcrumbRoutes = useMemo(
    () => getCurrentRoutes(routes, location.pathname),
    [routes, location]
  )

  const getBreadcrumbItems = (routes: ProBreadcrumbRoute[]) => {
    return routes?.map((item, index) => {
      const isLastItem = index === breadcrumbRoutes.length - 1
      const menuItems = getBreadcrumbMenus(routes, item.path, isIconRender)

      return {
        key: item.path,
        menu: menuItems ? { items: menuItems } : undefined,
        title: isLastItem
          ? itemDefaultRender(item, isIconRender)
          : itemLinkRender(item, isIconRender),
      }
    })
  }

  const items = getBreadcrumbItems(breadcrumbRoutes)

  return <Breadcrumb {...breadcrumbProps} items={items} />
}

export default ProBreadcrumb

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
      <a href={item.path} rel="noreferrer" target="_blank">
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
  const flattenRoutes = flattenDeepByKey<ProBreadcrumbRoute>(routes, 'children')
  const route = flattenRoutes.find(item => item.isChildOverlayMenu && item.path === pathname)

  if (route?.children?.length) {
    return route.children.map(item => ({
      key: item.path,
      title: itemLinkRender(item, isIconRender),
    }))
  }

  return undefined
}

import type { RouteModel } from '@/router'
import type { ItemType } from 'antd/lib/menu/hooks/useItems'

import { Menu } from 'antd'
import { compact } from 'lodash-es'
import React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { DynamicIcon } from '@/components'
import useRouterStore from '@/stores/router'

const AsideMenu = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [auths, allMenus] = useRouterStore(state => [state.userAuths, state.menus])
  const [openKeys, setOpenKeys] = useState<Array<string>>([])
  useEffect(() => {
    const keys = getOpenKeysByPath(location.pathname)
    setOpenKeys(keys)
  }, [location.pathname])

  let menus: ItemType[] = []
  const headerMenuKey = useMemo(() => `/${location.pathname.split('/').at(1)}`, [location.pathname])
  const activeHeaderMenu = allMenus.find(item => item.path === headerMenuKey)

  if (activeHeaderMenu?.children?.length) {
    menus = getMenuItems(location.pathname, activeHeaderMenu?.children)
  }
  let selectedKeys: string[] = [location.pathname]
  // 获取当前模块的路由
  const currentHeaderMenuRoute = auths.find(item => item.path === headerMenuKey)
  // 获取当前路由层级的所有路由
  const currentRoutes = getCurrentRoutes(location.pathname, currentHeaderMenuRoute)
  // 获取当前路由对象
  const currentRoute = currentRoutes?.find(item => item.path === location.pathname)
  // 如果当前路由的菜单是隐藏的，则通过meta配置activeMenuPath的值来设置高亮路由，否则通过当前路由的path来设置高亮路由
  if (currentRoute?.hidden && currentRoute?.meta) {
    const meta = JSON.parse(currentRoute.meta)
    if (meta?.activeMenuPath) {
      selectedKeys = [meta?.activeMenuPath ?? location.pathname]
    }
  }

  const onMenuClick = ({ key }: { key: string }) => navigate(key)

  return (
    <Menu
      items={menus}
      mode="inline"
      onClick={onMenuClick}
      onOpenChange={keys => {
        if (keys.length) {
          setOpenKeys(keys)
        }
      }}
      openKeys={openKeys}
      selectedKeys={selectedKeys}
      theme="light"
    />
  )
}

export default AsideMenu

/**
 * 根据路径获取菜单的openKeys
 * @param path 路径
 * @returns 返回openKeys
 */
const getOpenKeysByPath = (path: string) => {
  const paths = compact(path.split('/'))
  // 移除最后一个，因为最后一个是页面的路径
  paths.pop()
  const openKeys = paths.reduce((prev: string[], curr: string) => {
    if (prev.length) {
      return [...prev, `${prev.at(-1)}/${curr}`]
    } else {
      return [...prev, `/${curr}`]
    }
  }, [])
  return openKeys
}

const getCurrentRoutes = (path: string, route?: RouteModel): RouteModel[] => {
  if (route?.children?.length) {
    const paths = route.children.map(item => item.path)
    if (paths.includes(path)) {
      return route.children
    } else {
      return route.children.reduce(
        (prev, curr) => [...prev, ...getCurrentRoutes(path, curr)],
        [] as RouteModel[]
      )
    }
  }

  return []
}

const getMenuItems = (path: string, routes?: RouteModel[]): ItemType[] => {
  return (
    routes?.map(item => {
      return {
        children: item?.children?.length ? getMenuItems(path, item?.children) : undefined,
        icon: item.icon ? <DynamicIcon name={`menu/${item.icon}`} /> : null,
        key: item.path,
        label: item.title,
      }
    }) ?? []
  )
}

import type { RouteModel } from '@/router'
import type { ItemType } from 'antd/lib/menu/hooks/useItems'

import { Menu } from 'antd'
import { compact } from 'lodash-es'
import React from 'react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { DynamicIcon } from '@/components'
import useRouterStore from '@/stores/router'
import { flattenDeepByKey } from '@/utils/tools'

const AsideMenu = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const allMenus = useRouterStore(state => state.menus)
  const [openKeys, setOpenKeys] = useState<Array<string>>([])
  useEffect(() => {
    const keys = getOpenKeysByPath(location.pathname)
    setOpenKeys(keys)
  }, [location.pathname])

  const menus: ItemType[] = getMenuItems('/', allMenus)
  let selectedKeys: string[] = [location.pathname]
  // 获取当前路由层级的所有路由
  const currentRoutes = flattenDeepByKey(allMenus, 'children')
  // 获取当前路由对象
  const currentRoute = currentRoutes?.find(item => item.path === location.pathname)
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

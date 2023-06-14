import { Menu } from 'antd'
import { ItemType } from 'antd/lib/menu/hooks/useItems'
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { RouteModel } from '@/router'
import useRouterStore from '@/stores/router'

import classes from './index.module.less'

const HeaderMenu = () => {
  const menus = useRouterStore(state => state.menus)
  const location = useLocation()
  const navigate = useNavigate()
  const selectedKeys = [`/${location.pathname.split('/').at(1)}`]

  const onClick = ({ key }: { key: string }) => {
    const target = menus.find(item => item.path.includes(key))

    if (target) {
      const path = getDeepestPath(target)
      navigate(path)
    }
  }

  const menuItems: ItemType[] = menus?.map(item => ({
    key: item.path,
    label: item.title,
  }))

  return (
    <Menu
      className={classes.menu}
      items={menuItems}
      mode="horizontal"
      onClick={onClick}
      selectedKeys={selectedKeys}
    />
  )
}

export default HeaderMenu

// 获取最深层path
const getDeepestPath = (menu: RouteModel): string =>
  menu?.children?.length ? getDeepestPath(menu.children[0]) : menu.path

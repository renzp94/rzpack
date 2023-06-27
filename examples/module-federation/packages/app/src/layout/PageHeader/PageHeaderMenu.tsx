import React from 'react'
import { Menu } from 'antd'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import useRouterStore from '@/stores/router'
import { RouteModel } from '@/router'
import classes from './index.module.less'
import { ItemType } from 'antd/lib/menu/hooks/useItems'

const HeaderMenu = () => {
  const menus = useRouterStore((state) => state.menus)
  const location = useLocation()
  const navigate = useNavigate()
  const selectedKeys = [`/${location.pathname.split('/').at(1)}`]

  const onClick = ({ key }: { key: string }) => {
    const target = menus.find((item) => item.path.includes(key))

    if (target) {
      const path = getDeepestPath(target)
      navigate(path)
    }
  }

  const menuItems: ItemType[] = menus?.map((item) => ({
    label: <Link to={item.path}>{item.title}</Link>,
    key: item.path,
  }))

  return (
    <Menu
      className={classes.menu}
      mode="horizontal"
      items={menuItems}
      selectedKeys={selectedKeys}
      onClick={onClick}
    />
  )
}

export default HeaderMenu

// 获取最深层path
const getDeepestPath = (menu: RouteModel): string =>
  menu?.children?.length ? getDeepestPath(menu.children[0]) : menu.path

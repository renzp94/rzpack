import { Menu } from 'antd'
import React, { useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import Logo from './Logo'
import { AppContext } from '@/App'

const LayoutSider = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const authRouteModels = useContext(AppContext)

  const selectedKeys: string[] = [location.pathname]

  const onMenuClick = ({ key }: { key: string }) => {
    navigate(key)
  }

  const menus = authRouteModels.map(item => {
    return {
      icon: item.icon,
      key: item.path,
      label: item.title,
      title: item.title,
    }
  })

  return (
    <>
      <Logo />
      <Menu
        items={menus}
        mode="inline"
        onClick={onMenuClick}
        selectedKeys={selectedKeys}
        theme="light"
      />
    </>
  )
}

export default LayoutSider

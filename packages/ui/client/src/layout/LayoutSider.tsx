import { Menu } from 'antd'
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import Logo from './Logo'
import { routeModels } from '@/router'

const LayoutSider = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const selectedKeys: string[] = [location.pathname]

  const onMenuClick = ({ key }: { key: string }) => {
    navigate(key)
  }

  const menus = routeModels.map(item => {
    return {
      icon: item.icon,
      key: item.path,
      label: item.title,
      title: item.title,
    }
  })

  return (
    <div>
      <Logo />
      <Menu
        items={menus}
        mode="inline"
        onClick={onMenuClick}
        selectedKeys={selectedKeys}
        theme="light"
      />
    </div>
  )
}

export default LayoutSider

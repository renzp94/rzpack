import { Dropdown } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { modal } from '@/App'
import { logout } from '@/api/system'
import DownIcon from '@/assets/svg/down.svg'
import LogoutIcon from '@/assets/svg/logout.svg'
import userInfoStore from '@/stores/user'
import storage, { TOKEN } from '@/utils/storage'

import classes from './index.module.less'

const PageHeaderTools = () => {
  const navigate = useNavigate()
  const [userInfo, clearUserInfo] = userInfoStore(state => [state.userInfo, state.clear])

  const onLogout = () => {
    modal.confirm({
      onOk: async () => {
        await logout()
        clearUserInfo()
        storage.remove(TOKEN)
        navigate('/login')
      },
      title: '确定退出登录？',
    })
  }

  const onMenuClick = ({ key }: { key: string }) => {
    const methods: any = {
      logout: onLogout,
    }
    methods?.[key]?.()
  }

  const dropdownMenus = [
    {
      icon: <LogoutIcon height="16px" width="16px" />,
      key: 'logout',
      label: '退出系统',
    },
  ]

  return (
    <Dropdown
      menu={{
        items: dropdownMenus,
        onClick: onMenuClick,
      }}
      placement="bottomRight"
      trigger={['click']}
    >
      <div className={classes.username}>
        <div>{userInfo?.nickname}</div>
        <DownIcon fill="#fff" height="16" width="16" />
      </div>
    </Dropdown>
  )
}

export default PageHeaderTools

import storage, { TOKEN } from '@/utils/storage'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { Dropdown, Modal } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import DownIcon from '@/assets/svg/down.svg'
import LogoutIcon from '@/assets/svg/logout.svg'
import classes from './index.module.less'
import userInfoStore from '@/stores/user'
import { logout } from '@/api/system'

const PageHeaderTools = () => {
  const navigate = useNavigate()
  const [userInfo, clearUserInfo] = userInfoStore(state => [state.userInfo, state.clear])

  const onLogout = () => {
    Modal.confirm({
      title: '确定退出登录？',
      icon: <ExclamationCircleFilled />,
      onOk: async () => {
        await logout()
        clearUserInfo()
        storage.remove(TOKEN)
        navigate('/login')
      },
    })
  }

  const onMenuClick = ({ key }: { key: string }) => {
    const methods = {
      logout: onLogout,
    }
    methods?.[key]?.()
  }

  const dropdownMenus = [
    {
      label: '退出系统',
      key: 'logout',
      icon: <LogoutIcon width="16px" height="16px" />,
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

import type { MessageInstance } from 'antd/es/message/interface'
import type { ModalStaticFunctions } from 'antd/es/modal/confirm'
import type { NotificationInstance } from 'antd/es/notification/interface'

import {
  App as antdApp,
  message as antdMessage,
  Modal as antdModal,
  notification as antdNotification,
} from 'antd'
import React from 'react'
import { useEffect, useRef } from 'react'
import { createHashRouter, RouterProvider } from 'react-router-dom'

import { CenterSpin } from './components'
import { mergeUserRoutes } from './router'
import useRouterStore from './stores/router'
import userInfoStore from '@/stores/user'

let message: MessageInstance = antdMessage
let notification: NotificationInstance = antdNotification
let modal: Omit<ModalStaticFunctions, 'warn'> = antdModal

const App = () => {
  const staticFunctions = antdApp.useApp()
  message = staticFunctions.message
  notification = staticFunctions.notification
  modal = staticFunctions.modal

  const [token, refreshUserInfo] = userInfoStore(state => [state.token, state.refreshUserInfo])
  const { getUserAuths, loading, userRoutes } = useRouterStore(state => ({
    getUserAuths: state.getUserAuths,
    loading: state.loading,
    userRoutes: state.userRoutes,
  }))
  // 此处将信息请求缓存，防止useEffect进入死循环
  const refreshWebData = useRef(() => {
    refreshUserInfo()
    getUserAuths()
  })

  useEffect(() => {
    const isLoginPage = window?.location?.hash === '#/login'
    if (!isLoginPage && token) {
      refreshWebData.current()
    }
  }, [token])

  const router = createHashRouter(mergeUserRoutes(userRoutes))

  return !loading ? <RouterProvider router={router} /> : <CenterSpin />
}

export default App
export { message, modal, notification }

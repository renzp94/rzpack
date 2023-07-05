import type { MessageInstance } from 'antd/es/message/interface'
import type { ModalStaticFunctions } from 'antd/es/modal/confirm'
import type { NotificationInstance } from 'antd/es/notification/interface'

import { useMount } from 'ahooks'
import {
  App as antdApp,
  message as antdMessage,
  Modal as antdModal,
  notification as antdNotification,
} from 'antd'
import React from 'react'
import { createHashRouter, RouterProvider } from 'react-router-dom'

import { fetchSystemInfo } from './api/system'
import { CenterSpin } from './components'
import { routes } from './router'

let message: MessageInstance = antdMessage
let notification: NotificationInstance = antdNotification
let modal: Omit<ModalStaticFunctions, 'warn'> = antdModal

const App: React.FC = () => {
  useMount(async () => {
    const { data } = await fetchSystemInfo()
    if (data?.title) {
      document.title = `💻${data.title}`
    }
  })

  const staticFunctions = antdApp.useApp()
  message = staticFunctions.message
  notification = staticFunctions.notification
  modal = staticFunctions.modal
  const router = createHashRouter(routes)

  return routes?.length > 0 ? <RouterProvider router={router} /> : <CenterSpin />
}

export default App

export { message, modal, notification }

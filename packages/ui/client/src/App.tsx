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
import React, { createContext, useState } from 'react'
import { createHashRouter, RouteObject, RouterProvider } from 'react-router-dom'

import { fetchSystemInfo } from './api/system'
import { CenterSpin } from './components'
import { routes as allRoutes, getAuthRoutes, type RouteModel, routeModels } from './router'

let message: MessageInstance = antdMessage
let notification: NotificationInstance = antdNotification
let modal: Omit<ModalStaticFunctions, 'warn'> = antdModal

export const AppContext = createContext<RouteModel[]>([])

const App: React.FC = () => {
  const [routes, setRoutes] = useState<RouteObject[]>(allRoutes)
  const [authRouteModels, setAuthRouteModels] = useState<RouteModel[]>([])
  useMount(async () => {
    const { data } = await fetchSystemInfo()
    if (data?.title) {
      document.title = `💻${data.title}`
    }

    const authRouteModels = routeModels.filter(item => item.path !== '/yagt' || !!data?.yagt)
    setAuthRouteModels(authRouteModels)
    const authRoutes = getAuthRoutes(authRouteModels)
    setRoutes(authRoutes)
  })
  const staticFunctions = antdApp.useApp()
  message = staticFunctions.message
  notification = staticFunctions.notification
  modal = staticFunctions.modal
  const router = createHashRouter(routes)

  return (
    <AppContext.Provider value={authRouteModels}>
      {routes?.length > 0 ? <RouterProvider router={router} /> : <CenterSpin />}
    </AppContext.Provider>
  )
}

export default App

export { message, modal, notification }
